'use server'

import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { getLocale } from '@/i18n/getLocale'
import { parseEnquiryBlobs, type IncomingBlob } from '@/lib/enquiry/files'
import { loadEnquiryForm } from '@/lib/enquiry/loadForm'
import { submitEnquiryRecord, type EnquiryUpload } from '@/lib/enquiry/submit'
import {
  mapEnquiryAnswers,
  type EnquiryFileMeta,
  type EnquiryIssue,
  type PublicEnquiryField,
} from '@/lib/enquiry/validate'

type SubmitEnquiryResult =
  | { ok: true; submissionReference: string }
  | { ok: false; issues: EnquiryIssue[] }

export async function submitEnquiry(formData: FormData): Promise<SubmitEnquiryResult> {
  const payload = await getPayload({ config: configPromise })
  const form = await loadEnquiryForm(payload, 'en')
  if (!form) return { ok: false, issues: [{ field: 'form', code: 'generic' }] }

  const blobs = parseEnquiryBlobs(formData.get('blobs'))
  if (!blobs.ok) return { ok: false, issues: [{ field: 'files', code: 'files' }] }

  const uploads = readUploads(form.fields, formData)
  if (blobs.value.length > 0 && uploads.length > 0) {
    return { ok: false, issues: [{ field: 'files', code: 'files' }] }
  }

  const files = fileMeta(form.fields, uploads, blobs.value)
  const mapped = mapEnquiryAnswers({
    fields: form.fields,
    values: readValues(form.fields, formData),
    files,
    clientSubmissionId: formData.get('clientSubmissionId'),
  })
  if (!mapped.ok) return mapped

  const headerList = await headers()
  const saved = await submitEnquiryRecord(payload, {
    fields: mapped.value,
    locale: await getLocale(),
    ip: clientIp(headerList),
    userAgent: (headerList.get('user-agent') || '').slice(0, 400),
    files: uploads.map((item) => item.file),
    blobs: blobs.value,
  })
  return saved
}

function readValues(fields: PublicEnquiryField[], formData: FormData): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const field of fields) {
    if (!field.name || field.blockType === 'message' || field.blockType === 'upload') continue
    if (field.blockType === 'checkboxGroup') {
      values[field.name] = formData.getAll(field.name).map((item) => String(item))
      continue
    }
    const value = formData.get(field.name)
    values[field.name] = typeof value === 'string' ? value : ''
  }
  return values
}

function readUploads(
  fields: PublicEnquiryField[],
  formData: FormData,
): Array<{ field: string; file: EnquiryUpload & File }> {
  const uploads: Array<{ field: string; file: EnquiryUpload & File }> = []
  for (const field of fields) {
    if (field.blockType !== 'upload' || !field.name) continue
    for (const item of formData.getAll(field.name)) {
      if (typeof File !== 'undefined' && item instanceof File && item.size > 0) {
        uploads.push({ field: field.name, file: item })
      }
    }
  }
  return uploads
}

function fileMeta(
  fields: PublicEnquiryField[],
  uploads: Array<{ field: string; file: EnquiryUpload }>,
  blobs: IncomingBlob[],
): EnquiryFileMeta[] {
  const firstUpload = fields.find((field) => field.blockType === 'upload' && field.name)?.name || 'attachments'
  return [
    ...uploads.map((item) => ({
      field: item.field,
      name: item.file.name,
      type: item.file.type,
      size: item.file.size,
    })),
    ...blobs.map((blob) => ({
      field: blob.field || firstUpload,
      name: blob.originalName,
      type: blob.contentType,
      size: blob.size,
    })),
  ]
}

function clientIp(headerList: Headers): string {
  const forwarded = headerList.get('x-forwarded-for')
  const raw = (forwarded?.split(',')[0] || headerList.get('x-real-ip') || 'local').trim()
  return raw.slice(0, 80) || 'local'
}
