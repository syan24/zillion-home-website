import type { Payload } from 'payload'

import { buildTextPdf } from '@/lib/swms/demoPdf'
import { readSwmsFile } from '@/lib/swms/readSwmsFile'
import { relationID } from '@/lib/swms/relationID'
import type { TradeValue } from '@/lib/swms/trades'

const seedContext = { disableRevalidate: true }

export type DemoSwmsDocument = {
  title: string
  trades: TradeValue[]
  sortOrder: number
  filename: string
  pages: string[][]
}

/**
 * Create a Rosebery demo SWMS PDF, or put the placeholder bytes back on the same file
 * when that file cannot be opened. Keeping the file id leaves `fileVersion` unchanged,
 * so workers who already confirmed this version are not sent through reconfirm.
 * A missing file row is the one case that attaches a new upload. The document hook then
 * publishes the next file version, because the previous PDF cannot be recovered.
 */
export async function ensureDemoSwmsDocument(
  payload: Payload,
  document: DemoSwmsDocument,
  projectID: number,
): Promise<void> {
  const pdf = buildTextPdf(document.pages)
  const existing = await payload.find({
    collection: 'swms-documents',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [{ title: { equals: document.title } }, { project: { equals: projectID } }],
    },
  })
  const current = existing.docs[0]
  if (!current) {
    const file = await createSwmsFile(payload, document, pdf)
    await assertSwmsFileReadable(payload, file.id, document.filename)
    await payload.create({
      collection: 'swms-documents',
      overrideAccess: true,
      context: seedContext,
      data: {
        title: document.title,
        project: projectID,
        file: file.id,
        trades: document.trades,
        status: 'active',
        sortOrder: document.sortOrder,
      },
    })
    console.log(`swms ${document.title}: created`)
    return
  }

  const fileID = relationID(current.file)
  const file = fileID ? await loadSwmsFile(payload, fileID) : null
  if (!file || !fileID) {
    const created = await createSwmsFile(payload, document, pdf)
    await assertSwmsFileReadable(payload, created.id, document.filename)
    await payload.update({
      collection: 'swms-documents',
      id: current.id,
      overrideAccess: true,
      context: seedContext,
      data: { file: created.id },
    })
    console.log(
      `swms ${document.title}: attached a new PDF because the file row was missing. fileVersion moved to the next version.`,
    )
    return
  }

  if (await fileIsReadable(file)) {
    console.log(`swms ${document.title}: kept (file is readable, fileVersion unchanged)`)
    return
  }

  const updated = await payload.update({
    collection: 'swms-files',
    id: fileID,
    overrideAccess: true,
    context: seedContext,
    overwriteExistingFiles: true,
    data: { alt: document.title },
    file: pdfUpload(document, pdf),
  })
  await assertSwmsFileReadable(payload, updated.id, document.filename)
  console.log(
    `swms ${document.title}: re-uploaded the placeholder PDF onto file ${fileID} (fileVersion unchanged)`,
  )
}

function pdfUpload(document: DemoSwmsDocument, pdf: Buffer) {
  return {
    data: pdf,
    mimetype: 'application/pdf',
    name: document.filename,
    size: pdf.length,
  }
}

async function createSwmsFile(payload: Payload, document: DemoSwmsDocument, pdf: Buffer) {
  return payload.create({
    collection: 'swms-files',
    overrideAccess: true,
    context: seedContext,
    data: { alt: document.title },
    file: pdfUpload(document, pdf),
  })
}

async function loadSwmsFile(payload: Payload, id: number) {
  try {
    const file = await payload.findByID({
      collection: 'swms-files',
      id,
      depth: 0,
      overrideAccess: true,
    })
    return file ?? null
  } catch (error) {
    if (isNotFound(error)) return null
    throw error
  }
}

function isNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  if ('status' in error && (error as { status?: number }).status === 404) return true
  return error instanceof Error && error.name === 'NotFound'
}

async function fileIsReadable(file: {
  filename?: string | null
  mimeType?: string | null
  url?: string | null
  prefix?: string | null
  _objectKey?: string | null
}): Promise<boolean> {
  const stored = await readSwmsFile(file)
  return Boolean(stored && stored.bytes.length > 0)
}

async function assertSwmsFileReadable(payload: Payload, id: number, filename: string) {
  const attempts = process.env.BLOB_READ_WRITE_TOKEN?.trim() ? 2 : 1
  for (let attempt = 0; attempt < attempts; attempt++) {
    const file = await loadSwmsFile(payload, id)
    if (file && (await fileIsReadable(file))) return
    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 400))
    }
  }
  throw new Error(
    `SWMS seed file ${filename} is still not readable. With BLOB_READ_WRITE_TOKEN the PDF must land in Vercel Blob under the swms-files prefix (and _objectKey, when set). The worker route cannot read the build disk after deploy.`,
  )
}
