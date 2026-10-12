import { del, head } from '@vercel/blob'
import crypto from 'crypto'
import type { Payload } from 'payload'

import type { SiteLocale } from '@/i18n/config'
import {
  canonicalMimeType,
  enquiryFileIssue,
  isIncomingEnquiryPath,
  storedEnquiryFilename,
  type IncomingBlob,
} from '@/lib/enquiry/files'
import { sendEnquiryNotification } from '@/lib/enquiry/mail'
import {
  ENQUIRY_RATE_LIMIT,
  ENQUIRY_RATE_WINDOW_MS,
  MAX_ENQUIRY_FILE_BYTES,
  MAX_ENQUIRY_FILES,
} from '@/lib/enquiry/options'
import type { EnquiryIssue, ValidEnquiry } from '@/lib/enquiry/validate'
import { getServerSideURL } from '@/utilities/getURL'

export type EnquiryUpload = {
  name: string
  type: string
  size: number
  arrayBuffer: () => Promise<ArrayBuffer>
}

export type EnquirySubmitResult =
  | { ok: true; submissionReference: string }
  | { ok: false; issues: EnquiryIssue[] }

export async function submitEnquiryRecord(
  payload: Payload,
  input: {
    fields: ValidEnquiry
    locale: SiteLocale
    ip: string
    userAgent: string
    files: EnquiryUpload[]
    blobs: IncomingBlob[]
  },
): Promise<EnquirySubmitResult> {
  const fileError = validateAttachmentList(input.files, input.blobs)
  if (fileError) return { ok: false, issues: [fileError] }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (input.blobs.length > 0 && !token) {
    return { ok: false, issues: [{ field: 'files', code: 'files' }] }
  }

  const existing = await findBySubmissionId(payload, input.fields.clientSubmissionId)
  if (existing?.submissionReference) {
    await discardIncomingBlobs(input.blobs, token)
    return { ok: true, submissionReference: existing.submissionReference }
  }

  if (!(await enquiryRateLimitOpen(payload, input.ip))) {
    await discardIncomingBlobs(input.blobs, token)
    return { ok: false, issues: [{ field: 'form', code: 'rate' }] }
  }

  const stored: Array<{ id: number; name: string }> = []
  try {
    for (const blob of input.blobs) {
      stored.push(await copyIncomingBlob(payload, blob, token || ''))
    }
    for (const file of input.files) {
      stored.push(await storeUploadedFile(payload, file))
    }
  } catch (error) {
    payload.logger.error(error)
    await deleteEnquiryFiles(payload, stored.map((file) => file.id))
    await discardIncomingBlobs(input.blobs, token)
    return { ok: false, issues: [{ field: 'files', code: 'files' }] }
  }

  try {
    const created = await payload.create({
      collection: 'enquiries',
      overrideAccess: true,
      data: {
        submissionReference: newEnquiryReference(),
        clientSubmissionId: input.fields.clientSubmissionId,
        submittedAt: new Date().toISOString(),
        name: input.fields.name,
        phone: input.fields.phone,
        ...(input.fields.email ? { email: input.fields.email } : {}),
        address: input.fields.address,
        projectType: input.fields.projectType,
        scope: input.fields.scope,
        spaces: input.fields.spaces,
        notes: input.fields.notes,
        ...(input.fields.budgetRange ? { budgetRange: input.fields.budgetRange } : {}),
        ...(input.fields.expectedStart ? { expectedStart: input.fields.expectedStart } : {}),
        ...(input.fields.additionalAnswers ? { additionalAnswers: input.fields.additionalAnswers } : {}),
        attachments: stored.map((file) => file.id),
        status: 'new',
        locale: input.locale,
        notificationStatus: 'pending',
        submitterIp: input.ip,
        userAgent: input.userAgent,
      },
    })

    const submissionReference = created.submissionReference || ''
    if (!submissionReference) {
      await deleteEnquiryFiles(payload, stored.map((file) => file.id))
      return { ok: false, issues: [{ field: 'form', code: 'generic' }] }
    }

    await recordNotification(payload, created.id, {
      enquiry: input.fields,
      locale: input.locale,
      submissionReference,
      attachmentNames: stored.map((file) => file.name),
      adminURL: `${getServerSideURL()}/admin/collections/enquiries/${created.id}`,
    })

    return { ok: true, submissionReference }
  } catch (error) {
    const raced = await findBySubmissionId(payload, input.fields.clientSubmissionId)
    await deleteEnquiryFiles(payload, stored.map((file) => file.id))
    if (raced?.submissionReference) {
      return { ok: true, submissionReference: raced.submissionReference }
    }
    payload.logger.error(error)
    return { ok: false, issues: [{ field: 'form', code: 'generic' }] }
  }
}

export async function enquiryRateLimitOpen(payload: Payload, ip: string): Promise<boolean> {
  const since = new Date(Date.now() - ENQUIRY_RATE_WINDOW_MS).toISOString()
  const recent = await payload.count({
    collection: 'enquiries',
    overrideAccess: true,
    where: {
      and: [{ submitterIp: { equals: ip } }, { createdAt: { greater_than: since } }],
    },
  })
  return recent.totalDocs < ENQUIRY_RATE_LIMIT
}

function validateAttachmentList(files: EnquiryUpload[], blobs: IncomingBlob[]): EnquiryIssue | null {
  if (files.length > 0 && blobs.length > 0) return { field: 'files', code: 'files' }
  if (files.length + blobs.length > MAX_ENQUIRY_FILES) return { field: 'files', code: 'files' }
  for (const file of files) {
    if (enquiryFileIssue(file.name, file.type, file.size)) return { field: 'files', code: 'files' }
  }
  return null
}

async function copyIncomingBlob(payload: Payload, blob: IncomingBlob, token: string) {
  const meta = await head(blob.url, { token })
  if (meta.pathname !== blob.pathname || !isIncomingEnquiryPath(meta.pathname)) {
    throw new Error('Enquiry upload path was not recognised.')
  }
  if (meta.size <= 0 || meta.size > MAX_ENQUIRY_FILE_BYTES) {
    throw new Error('Enquiry upload is too large.')
  }
  const mime = canonicalMimeType(blob.originalName, meta.contentType || blob.contentType)
  if (!mime) throw new Error('Enquiry upload type is not allowed.')

  const response = await fetch(meta.url, { signal: AbortSignal.timeout(20_000) })
  if (!response.ok) throw new Error('Enquiry upload could not be read.')
  const data = Buffer.from(await response.arrayBuffer())
  if (data.length <= 0 || data.length > MAX_ENQUIRY_FILE_BYTES) {
    throw new Error('Enquiry upload is too large.')
  }

  try {
    const created = await payload.create({
      collection: 'enquiry-files',
      overrideAccess: true,
      context: { enquiryFileCreate: true },
      data: { originalName: blob.originalName },
      file: {
        data,
        mimetype: mime,
        name: storedEnquiryFilename(blob.originalName),
        size: data.length,
      },
    })
    return { id: numericId(created.id), name: blob.originalName }
  } finally {
    await del(meta.url, { token }).catch((error) => {
      payload.logger.error(error)
    })
  }
}

async function storeUploadedFile(payload: Payload, file: EnquiryUpload) {
  const data = Buffer.from(await file.arrayBuffer())
  const mime = canonicalMimeType(file.name, file.type)
  if (!mime || data.length > MAX_ENQUIRY_FILE_BYTES) {
    throw new Error('Enquiry upload type is not allowed.')
  }
  const originalName = file.name
  const created = await payload.create({
    collection: 'enquiry-files',
    overrideAccess: true,
    context: { enquiryFileCreate: true },
    data: { originalName },
    file: {
      data,
      mimetype: mime,
      name: storedEnquiryFilename(originalName),
      size: data.length,
    },
  })
  return { id: numericId(created.id), name: originalName }
}

async function findBySubmissionId(payload: Payload, clientSubmissionId: string) {
  const existing = await payload.find({
    collection: 'enquiries',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { clientSubmissionId: { equals: clientSubmissionId } },
  })
  return existing.docs[0]
}

async function deleteEnquiryFiles(payload: Payload, ids: number[]) {
  for (const id of ids) {
    await payload
      .delete({
        collection: 'enquiry-files',
        id,
        overrideAccess: true,
      })
      .catch((error) => {
        payload.logger.error(error)
      })
  }
}

function newEnquiryReference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `ENQ-${date}-${random}`
}

function numericId(id: number | string): number {
  const value = typeof id === 'number' ? id : Number(id)
  if (!Number.isInteger(value)) throw new Error('Enquiry file id was not a number.')
  return value
}

async function discardIncomingBlobs(blobs: IncomingBlob[], token: string | undefined) {
  if (!token || blobs.length === 0) return
  await Promise.all(
    blobs.map((blob) =>
      del(blob.url, { token }).catch(() => {
        return undefined
      }),
    ),
  )
}

async function recordNotification(
  payload: Payload,
  id: number,
  input: {
    enquiry: ValidEnquiry
    locale: SiteLocale
    submissionReference: string
    attachmentNames: string[]
    adminURL: string
  },
) {
  const result = await sendEnquiryNotification(input)
  payload.logger.info(
    `Enquiry ${input.submissionReference} saved. Notification ${result.status}. ${result.detail}`,
  )
  await payload
    .update({
      collection: 'enquiries',
      id,
      overrideAccess: true,
      context: { enquiryNotifyUpdate: true },
      data: {
        notificationStatus: result.status,
        notificationDetail: result.detail,
      },
    })
    .catch((error) => {
      payload.logger.error(error)
    })
}
