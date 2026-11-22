import type { Payload } from 'payload'

import { validateWorkerIdentity } from '@/lib/swms/identity'
import { relationID } from '@/lib/swms/relationID'
import {
  documentsForTrades,
  isReportKind,
  pendingDocumentConfirmations,
  validateOccurredAt,
  validateReportDescription,
  validateSelectedTrades,
  type SwmsDocumentRef,
} from '@/lib/swms/siteSafety'
import { isTradeValue, tradeLabels, type TradeValue } from '@/lib/swms/trades'
import {
  validateClientSubmissionId,
  validateResponses,
  validateSignature,
  validateWorkerDetails,
} from '@/lib/swms/validateSubmission'
import { loadActiveSwms, type ActiveSwms } from '@/lib/swms/loadWorkerSWMS'

const FILE_BYTES = 8 * 1024 * 1024
const FILE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

export type RequestMeta = {
  ipAddress: string
  userAgent: string
}

type Failure = { ok: false; error: string; code?: string }

export type AttendanceResult =
  | { ok: true; code: 'signed-in' | 'signed-out' | 'already-in'; recordedAt: string }
  | (Failure & {
      code?: 'induction-required' | 'reconfirm-required' | 'not-signed-in'
      pending?: PublicDocument[]
    })

export type PublicDocument = {
  accessToken: string
  title: string
  versionLabel: string
  fileVersion: number
  trades: TradeValue[]
}

type StoredDocument = PublicDocument & {
  id: number
  fileId: number
}

type ConfirmationSnapshot = {
  documentId: number
  title: string
  fileVersion: number
  versionLabel: string
  confirmedAt: string
  fileId: number
}

export async function recordAttendance(
  payload: Payload,
  input: {
    token: string
    name: string
    phone: string
    direction: 'in' | 'out'
    meta?: RequestMeta
  },
): Promise<AttendanceResult> {
  const site = await loadActiveSwms(payload, input.token)
  if (!site) {
    return { ok: false, error: 'This project link is no longer active. Ask your supervisor for a new QR code. 此项目链接已失效，请向主管索取新的二维码。' }
  }

  const identity = validateWorkerIdentity(input.name, input.phone)
  if (!identity.ok) return identity

  if (input.direction === 'out') {
    const latest = await latestAttendance(payload, site.projectId, identity.value)
    if (!latest || latest.direction !== 'in') {
      return {
        ok: false,
        code: 'not-signed-in',
        error: 'Sign in before signing out. 请先签到再签退。',
      }
    }
    const recordedAt = new Date().toISOString()
    await writeAttendance(payload, site, identity.value, 'out', recordedAt, input.meta)
    return { ok: true, code: 'signed-out', recordedAt }
  }

  const induction = await findInduction(payload, site.projectId, identity.value)
  if (!induction) {
    return {
      ok: false,
      code: 'induction-required',
      error: 'Complete site induction before signing in. 首次进场请先完成现场入场培训。',
    }
  }

  const documents = await loadActiveDocuments(payload, site.projectId)
  const confirmations = await loadConfirmations(payload, site.projectId, identity.value)
  const pending = pendingDocumentConfirmations(
    documents,
    asTradeList(induction.trades),
    confirmations,
  )
  if (pending.length > 0) {
    return {
      ok: false,
      code: 'reconfirm-required',
      error: 'Review the updated SWMS before signing in. 签到前请确认更新后的 SWMS。',
      pending: pending.map(toPublicDocument),
    }
  }

  const latest = await latestAttendance(payload, site.projectId, identity.value)
  if (latest?.direction === 'in') {
    return { ok: true, code: 'already-in', recordedAt: latest.recordedAt }
  }

  const recordedAt = new Date().toISOString()
  await writeAttendance(payload, site, identity.value, 'in', recordedAt, input.meta)
  return { ok: true, code: 'signed-in', recordedAt }
}

export async function confirmSwmsVersions(
  payload: Payload,
  input: {
    token: string
    name: string
    phone: string
    confirmed: { accessToken: string; fileVersion: number }[]
    meta?: RequestMeta
  },
): Promise<{ ok: true; confirmedAt: string } | Failure> {
  const site = await loadActiveSwms(payload, input.token)
  if (!site) {
    return { ok: false, error: 'This project link is no longer active. Ask your supervisor for a new QR code. 此项目链接已失效，请向主管索取新的二维码。' }
  }
  const identity = validateWorkerIdentity(input.name, input.phone)
  if (!identity.ok) return identity

  const induction = await findInduction(payload, site.projectId, identity.value)
  if (!induction) {
    return {
      ok: false,
      code: 'induction-required',
      error: 'Complete site induction before reviewing a new SWMS version. 请先完成现场入场培训。',
    }
  }

  const documents = await loadActiveDocuments(payload, site.projectId)
  const confirmations = await loadConfirmations(payload, site.projectId, identity.value)
  const pending = pendingDocumentConfirmations(documents, asTradeList(induction.trades), confirmations)
  const mismatch = versionsMismatch(pending, input.confirmed)
  if (mismatch) return mismatch

  const confirmedAt = new Date().toISOString()
  await writeConfirmations(payload, {
    site,
    identity: identity.value,
    documents: pending,
    trades: asTradeList(induction.trades),
    confirmedAt,
    source: 'reconfirm',
  })
  return { ok: true, confirmedAt }
}

type InductionInput = {
  token: string
  versionId: number
  clientSubmissionId: string
  responses: unknown
  workerName: string
  workerCompany: string
  workerPhone: string
  trades: unknown
  confirmed: { accessToken: string; fileVersion: number }[]
  acknowledgementAccepted: boolean
  signature: string
  meta?: RequestMeta
}

export type InductionResult =
  | { ok: true; submissionRef: string; signedAt: string }
  | (Failure & { code?: 'version-changed' | 'swms-version-changed' })

export async function saveInduction(payload: Payload, input: InductionInput): Promise<InductionResult> {
  const clientSubmissionId = validateClientSubmissionId(input.clientSubmissionId)
  if (!clientSubmissionId.ok) return clientSubmissionId

  const site = await loadActiveSwms(payload, input.token)
  if (!site) {
    return {
      ok: false,
      error: 'This SWMS is no longer active. Ask your supervisor for a new link.',
    }
  }

  if (input.versionId !== site.versionId) {
    return {
      ok: false,
      code: 'version-changed',
      error: 'This SWMS was updated. Review the latest version, then sign again.',
    }
  }

  const details = validateWorkerDetails({
    workerName: input.workerName,
    workerCompany: input.workerCompany,
    workerPhone: input.workerPhone,
    workerTrade: '',
  })
  if (!details.ok) return details

  const identity = validateWorkerIdentity(details.value.workerName, details.value.workerPhone)
  if (!identity.ok) return identity

  const trades = validateSelectedTrades(input.trades, site.enabledTrades)
  if (!trades.ok) return trades

  const responses = validateResponses(site.sections, input.responses)
  if (!responses.ok) return responses

  if (input.acknowledgementAccepted !== true) {
    return { ok: false, error: 'Confirm the acknowledgement before submitting.' }
  }

  const signature = validateSignature(input.signature)
  if (!signature.ok) return signature

  const documents = documentsForTrades(await loadActiveDocuments(payload, site.projectId), trades.value)
  const mismatch = versionsMismatch(documents, input.confirmed)
  if (mismatch) return mismatch

  const existing = await payload.find({
    collection: 'swms-acknowledgements',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { clientSubmissionId: { equals: clientSubmissionId.value } },
  })
  const existingDoc = existing.docs[0]
  if (existingDoc?.submissionRef && existingDoc.signedAt) {
    const sameProject = relationID(existingDoc.project) === site.projectId
    if (sameProject) {
      return { ok: true, submissionRef: existingDoc.submissionRef, signedAt: existingDoc.signedAt }
    }
    return { ok: false, error: 'This submission was already used. Refresh the page and sign again.' }
  }

  const signedAt = new Date().toISOString()
  const snapshot: ConfirmationSnapshot[] = documents.map((document) => ({
    documentId: document.id,
    title: document.title,
    fileVersion: document.fileVersion,
    versionLabel: document.versionLabel,
    confirmedAt: signedAt,
    fileId: document.fileId,
  }))

  try {
    await writeConfirmations(payload, {
      site,
      identity: identity.value,
      documents,
      trades: trades.value,
      confirmedAt: signedAt,
      source: 'induction',
    })

    const created = await payload.create({
      collection: 'swms-acknowledgements',
      overrideAccess: true,
      data: {
        clientSubmissionId: clientSubmissionId.value,
        project: site.projectId,
        projectSwms: site.projectSwmsId,
        swmsVersion: site.versionId,
        workerName: identity.value.name,
        workerCompany: details.value.workerCompany,
        workerPhone: identity.value.phone,
        workerTrade: tradeLabels(trades.value),
        workerNameKey: identity.value.nameKey,
        workerPhoneKey: identity.value.phoneKey,
        trades: trades.value,
        swmsConfirmations: snapshot,
        responses: responses.value,
        acknowledgementAccepted: true,
        signature: signature.value,
        signedAt,
        metadata: input.meta,
      },
    })

    await writeAttendance(payload, site, identity.value, 'in', signedAt, input.meta)
    return { ok: true, submissionRef: created.submissionRef || '', signedAt: created.signedAt }
  } catch (error) {
    const raced = await payload.find({
      collection: 'swms-acknowledgements',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { clientSubmissionId: { equals: clientSubmissionId.value } },
    })
    if (raced.docs[0]?.submissionRef && raced.docs[0].signedAt) {
      return {
        ok: true,
        submissionRef: raced.docs[0].submissionRef,
        signedAt: raced.docs[0].signedAt,
      }
    }
    console.error('Site induction failed', error)
    return { ok: false, error: 'The signature could not be saved. Check your connection and try again.' }
  }
}

export async function createSiteReport(
  payload: Payload,
  input: {
    token: string
    kind: unknown
    name: string
    phone: string
    description: unknown
    occurredAt?: unknown
    attachment?: { data: Buffer; mimetype: string; name: string } | null
    meta?: RequestMeta
  },
): Promise<{ ok: true; id: number } | Failure> {
  if (!isReportKind(input.kind)) {
    return { ok: false, error: 'Choose a report type. 请选择记录类型。' }
  }
  const site = await loadActiveSwms(payload, input.token)
  if (!site) {
    return { ok: false, error: 'This project link is no longer active. Ask your supervisor for a new QR code. 此项目链接已失效，请向主管索取新的二维码。' }
  }
  const identity = validateWorkerIdentity(input.name, input.phone)
  if (!identity.ok) return identity
  const description = validateReportDescription(input.description)
  if (!description.ok) return description
  const occurredAt = validateOccurredAt(input.occurredAt)
  if (!occurredAt.ok) return occurredAt

  let attachment: number | undefined
  if (input.attachment && input.attachment.data.length > 0) {
    if (input.attachment.data.length > FILE_BYTES || !FILE_MIME.has(input.attachment.mimetype)) {
      return { ok: false, error: 'Attach a JPG, PNG, WEBP, or PDF under 8 MB. 请上传 8 MB 以内的图片或 PDF。' }
    }
    const file = await payload.create({
      collection: 'swms-files',
      overrideAccess: true,
      data: { alt: input.attachment.name },
      file: {
        data: input.attachment.data,
        mimetype: input.attachment.mimetype,
        name: safeFilename(input.attachment.name),
        size: input.attachment.data.length,
      },
    })
    attachment = file.id
  }

  const created = await payload.create({
    collection: 'site-safety-reports',
    overrideAccess: true,
    data: {
      kind: input.kind,
      summary: description.value.slice(0, 80),
      project: site.projectId,
      workerName: identity.value.name,
      workerPhone: identity.value.phone,
      workerNameKey: identity.value.nameKey,
      workerPhoneKey: identity.value.phoneKey,
      occurredAt: occurredAt.value,
      description: description.value,
      attachment,
      metadata: input.meta,
    },
  })

  return { ok: true, id: created.id }
}

async function findInduction(
  payload: Payload,
  projectId: number,
  identity: { nameKey: string; phoneKey: string },
) {
  const found = await payload.find({
    collection: 'swms-acknowledgements',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    sort: '-signedAt',
    where: {
      and: [
        { project: { equals: projectId } },
        { workerNameKey: { equals: identity.nameKey } },
        { workerPhoneKey: { equals: identity.phoneKey } },
      ],
    },
  })
  return found.docs[0] ?? null
}

async function loadConfirmations(
  payload: Payload,
  projectId: number,
  identity: { nameKey: string; phoneKey: string },
) {
  const found = await payload.find({
    collection: 'swms-document-confirmations',
    depth: 0,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [
        { project: { equals: projectId } },
        { workerNameKey: { equals: identity.nameKey } },
        { workerPhoneKey: { equals: identity.phoneKey } },
      ],
    },
  })
  return found.docs.flatMap((doc) => {
    const documentId = relationID(doc.document)
    if (!documentId || typeof doc.fileVersion !== 'number') return []
    return [{ documentId, fileVersion: doc.fileVersion }]
  })
}

async function loadActiveDocuments(payload: Payload, projectId: number): Promise<StoredDocument[]> {
  const found = await payload.find({
    collection: 'swms-documents',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    sort: 'sortOrder',
    where: {
      and: [{ project: { equals: projectId } }, { status: { equals: 'active' } }],
    },
  })

  return found.docs.flatMap((doc) => {
    const fileId = relationID(doc.file)
    if (!doc.accessToken || !fileId || typeof doc.fileVersion !== 'number') return []
    return [
      {
        id: doc.id,
        fileId,
        accessToken: doc.accessToken,
        title: doc.title,
        trades: asTradeList(doc.trades),
        fileVersion: doc.fileVersion,
        versionLabel: doc.versionLabel || `v${doc.fileVersion}`,
      },
    ]
  })
}

async function latestAttendance(
  payload: Payload,
  projectId: number,
  identity: { nameKey: string; phoneKey: string },
) {
  const found = await payload.find({
    collection: 'site-attendance',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    sort: '-recordedAt',
    where: {
      and: [
        { project: { equals: projectId } },
        { workerNameKey: { equals: identity.nameKey } },
        { workerPhoneKey: { equals: identity.phoneKey } },
      ],
    },
  })
  const doc = found.docs[0]
  if (!doc?.recordedAt || (doc.direction !== 'in' && doc.direction !== 'out')) return null
  return { direction: doc.direction, recordedAt: doc.recordedAt }
}

async function writeAttendance(
  payload: Payload,
  site: ActiveSwms,
  identity: { name: string; phone: string; nameKey: string; phoneKey: string },
  direction: 'in' | 'out',
  recordedAt: string,
  meta?: RequestMeta,
) {
  const latest = await latestAttendance(payload, site.projectId, identity)
  if (direction === 'in' && latest?.direction === 'in') return
  await payload.create({
    collection: 'site-attendance',
    overrideAccess: true,
    data: {
      project: site.projectId,
      projectSwms: site.projectSwmsId,
      workerName: identity.name,
      workerPhone: identity.phone,
      workerNameKey: identity.nameKey,
      workerPhoneKey: identity.phoneKey,
      direction,
      recordedAt,
      metadata: meta,
    },
  })
}

async function writeConfirmations(
  payload: Payload,
  args: {
    site: ActiveSwms
    identity: { name: string; phone: string; nameKey: string; phoneKey: string }
    documents: StoredDocument[]
    trades: TradeValue[]
    confirmedAt: string
    source: 'induction' | 'reconfirm'
  },
) {
  const existing = await loadConfirmations(payload, args.site.projectId, args.identity)
  for (const document of args.documents) {
    const already = existing.some(
      (item) => item.documentId === document.id && item.fileVersion === document.fileVersion,
    )
    if (already) continue
    await payload.create({
      collection: 'swms-document-confirmations',
      overrideAccess: true,
      data: {
        project: args.site.projectId,
        document: document.id,
        file: document.fileId,
        fileVersion: document.fileVersion,
        versionLabel: document.versionLabel,
        documentTitle: document.title,
        trades: args.trades,
        workerName: args.identity.name,
        workerPhone: args.identity.phone,
        workerNameKey: args.identity.nameKey,
        workerPhoneKey: args.identity.phoneKey,
        confirmedAt: args.confirmedAt,
        source: args.source,
      },
    })
  }
}

function versionsMismatch(
  required: readonly SwmsDocumentRef[],
  confirmed: { accessToken: string; fileVersion: number }[],
): { ok: false; code: 'swms-version-changed'; error: string } | null {
  const byToken = new Map(confirmed.map((item) => [item.accessToken, item.fileVersion]))
  for (const document of required) {
    if (byToken.get(document.accessToken) !== document.fileVersion) {
      return {
        ok: false,
        code: 'swms-version-changed',
        error: 'A SWMS file was updated. Review the latest file, then confirm again. SWMS 文件已更新，请重新查阅后再确认。',
      }
    }
  }
  return null
}

function toPublicDocument(document: StoredDocument): PublicDocument {
  return {
    accessToken: document.accessToken,
    title: document.title,
    versionLabel: document.versionLabel,
    fileVersion: document.fileVersion,
    trades: document.trades,
  }
}

function asTradeList(value: unknown): TradeValue[] {
  if (!Array.isArray(value)) return []
  return value.filter(isTradeValue)
}

function safeFilename(name: string): string {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '')
  return cleaned || 'attachment'
}
