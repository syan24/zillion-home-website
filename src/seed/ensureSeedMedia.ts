import fs from 'fs'
import path from 'path'
import { BlobNotFoundError, head, put } from '@vercel/blob'
import type { Payload } from 'payload'

const seedContext = { disableRevalidate: true }

const blobTokenPattern = /^vercel_blob_rw_([a-z\d]+)_([a-z\d]+)$/i

export type SeedMediaDoc = {
  id: number
  url?: string | null
  filename?: string | null
  filesize?: number | null
  prefix?: string | null
  _objectKey?: string | null
}

export type SeedMediaProbe = {
  filename: string
  url?: string | null
  filesize?: number | null
  seedBytes: number
  blobRequired: boolean
  /** present = durable object with size > 0; missing = 404 or empty; unknown = not checked */
  blob?: 'present' | 'missing' | 'unknown'
  /** ok = 2xx/206; missing = 404; unknown = request failed or was not attempted */
  publicFile?: 'ok' | 'missing' | 'unknown'
  localFileExists?: boolean
}

/**
 * A stored URL that cannot survive a serverless deploy.
 * `/api/media/file/...` is the Payload file route (Blob-backed when the token is set).
 * `/media/...`, localhost, and filesystem paths are the build disk.
 */
export function urlLooksLocalOnly(url: string | null | undefined): boolean {
  if (!url?.trim()) return true
  const value = url.trim()
  if (/^file:/i.test(value)) return true
  if (/^[a-zA-Z]:[\\/]/.test(value)) return true

  let host = ''
  let pathname = value.split('?')[0] || ''
  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value)
      host = parsed.hostname
      pathname = parsed.pathname
    } catch {
      return true
    }
  }

  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true
  if (pathname.startsWith('/api/media/file/')) return false
  if (/\.blob\.vercel-storage\.com$/i.test(host)) return false
  if (host) return false
  return true
}

export function blobReadWriteToken(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  return token || null
}

/** Why a deploy seed must stop, or null when the Blob token is present and well formed. */
export function deployBlobTokenProblem(): string | null {
  const token = blobReadWriteToken()
  if (!token) {
    return 'SEED_DEMO=true requires BLOB_READ_WRITE_TOKEN so demo images are stored in Vercel Blob. Without it, uploads stay on the build filesystem, the Media rows remain, and later seeds skip those filenames forever. Set the token for Preview and Production (available at build time), then redeploy.'
  }
  if (!blobTokenPattern.test(token)) {
    return 'BLOB_READ_WRITE_TOKEN is set but is not a Vercel Blob read/write token (expected vercel_blob_rw_<store>_<secret>). The deploy seed cannot confirm files landed in Blob.'
  }
  return null
}

export function seedBlobObjectUrl(
  filename: string,
  doc: { prefix?: string | null; _objectKey?: string | null },
  token = blobReadWriteToken() || '',
): string {
  const override = process.env.STORAGE_VERCEL_BLOB_BASE_URL?.replace(/\/$/, '')
  const storeId = token.match(blobTokenPattern)?.[1]?.toLowerCase()
  const base = override || (storeId ? `https://${storeId}.public.blob.vercel-storage.com` : '')
  if (!base) {
    throw new Error('BLOB_READ_WRITE_TOKEN is missing or not a Vercel Blob read/write token.')
  }

  const folder = [doc.prefix, doc._objectKey]
    .map((part) => (part || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/')
  const encodedFilename = encodeURIComponent(filename)
  const key = folder ? `${folder}/${encodedFilename}` : encodedFilename
  return `${base}/${key}`
}

export function seedServerBaseUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '')
  if (configured) return configured
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return null
}

export function assessSeedMedia(probe: SeedMediaProbe): { repair: boolean; reason: string } {
  const filesize = probe.filesize
  if (filesize == null || !Number.isFinite(filesize) || filesize <= 0) {
    return { repair: true, reason: 'filesize is missing or zero' }
  }

  const url = probe.url?.trim()
  if (!url) return { repair: true, reason: 'no usable url' }
  if (probe.blobRequired && urlLooksLocalOnly(url)) {
    return { repair: true, reason: 'url is local-only' }
  }

  if (probe.blobRequired && probe.blob !== 'present') {
    return {
      repair: true,
      reason: probe.blob === 'missing' ? 'blob object is missing' : 'blob durability was not confirmed',
    }
  }

  // A cached 404 from the previous deployment is not proof the Blob object is missing.
  // Authenticated Blob head is the durability check when the token is set.
  if (probe.publicFile === 'missing' && probe.blob !== 'present') {
    return { repair: true, reason: 'public file returned 404' }
  }

  if (probe.filename === 'hero-house.jpg' && filesize !== probe.seedBytes) {
    return { repair: true, reason: 'hero-house.jpg size differs from the seed asset' }
  }

  if (!probe.blobRequired) {
    if (probe.publicFile === 'ok' || probe.localFileExists) {
      return {
        repair: false,
        reason:
          filesize === probe.seedBytes
            ? 'local file matches the seed asset'
            : 'reachable local file kept',
      }
    }
    return { repair: true, reason: 'local file is missing' }
  }

  return {
    repair: false,
    reason:
      filesize === probe.seedBytes
        ? 'blob object matches the seed asset'
        : 'durable blob object kept',
  }
}

type HttpProbe = { status: number; length: number | null }

/** Byte length from a ranged response. `null` means the server did not say. */
function probeLength(response: Response): number | null {
  const range = response.headers.get('content-range')
  const total = range?.match(/\/(\d+|\*)$/)?.[1]
  if (total && total !== '*') {
    const size = Number(total)
    return Number.isFinite(size) ? size : null
  }
  const contentLength = response.headers.get('content-length')
  if (contentLength == null || contentLength === '') return null
  const size = Number(contentLength)
  return Number.isFinite(size) ? size : null
}

async function requestProbe(url: string, headers?: HeadersInit): Promise<HttpProbe | null> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
    })
    const length = probeLength(response)
    await response.arrayBuffer().catch(() => undefined)
    return { status: response.status, length }
  } catch {
    return null
  }
}

async function probeUrl(url: string): Promise<HttpProbe | null> {
  const ranged = await requestProbe(url, { Range: 'bytes=0-0' })
  if (!ranged) return null
  if (
    ranged.status === 200 ||
    ranged.status === 206 ||
    ranged.status === 404 ||
    ranged.status === 416
  ) {
    return ranged
  }
  return requestProbe(url)
}

function probeIsPresent(probe: HttpProbe): boolean {
  if (probe.length === 0) return false
  return probe.status === 200 || probe.status === 206
}

/** Blob CDN URL stored on the Media doc, without a cache-busting query. */
export function absoluteBlobUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null
  let parsed: URL
  try {
    parsed = new URL(url.trim())
  } catch {
    return null
  }
  if (!parsed.hostname.endsWith('.blob.vercel-storage.com')) return null
  parsed.search = ''
  parsed.hash = ''
  return parsed.toString()
}

/**
 * URL to confirm with the Blob API.
 * Payload usually stores `/api/media/file/<filename>` and the file route resolves the
 * object from `prefix`, `_objectKey`, and `filename`. When the document already stores
 * a Blob URL, that URL is the one to check.
 */
export function blobUrlToVerify(doc: SeedMediaDoc, filename: string, token: string): string {
  return absoluteBlobUrl(doc.url) ?? seedBlobObjectUrl(doc.filename || filename, doc, token)
}

function blobPathname(blobUrl: string): string {
  const pathname = new URL(blobUrl).pathname.replace(/^\/+/, '')
  return decodeURIComponent(pathname)
}

function isBlobMissing(error: unknown): boolean {
  if (error instanceof BlobNotFoundError) return true
  return error instanceof Error && error.name === 'BlobNotFoundError'
}

/** Same check the `/api/media/file` handler uses: Blob API `head` with the read/write token. */
export async function blobHeadPresent(url: string, token: string, attempts = 1): Promise<boolean> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const meta = await head(url, { token })
      return meta.size > 0
    } catch (error) {
      if (!isBlobMissing(error)) throw error
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400))
      }
    }
  }
  return false
}

async function putSeedFileAt(blobUrl: string, filePath: string, token: string) {
  const ext = path.extname(filePath).toLowerCase()
  const contentType =
    ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.gif' ? 'image/gif' : 'image/jpeg'
  await put(blobPathname(blobUrl), fs.readFileSync(filePath), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
    token,
  })
}

async function publicFileState(filename: string): Promise<'ok' | 'missing' | 'unknown'> {
  const base = seedServerBaseUrl()
  if (!base) return 'unknown'
  const probe = await probeUrl(`${base}/api/media/file/${encodeURIComponent(filename)}`)
  if (!probe) return 'unknown'
  if (probe.status === 404 || probe.status === 416 || probe.length === 0) return 'missing'
  if (probeIsPresent(probe)) return 'ok'
  return 'unknown'
}

function localSeedFileExists(filename: string): boolean {
  return fs.existsSync(path.resolve(process.cwd(), 'public/media', filename))
}

function numericSize(value: number | null | undefined): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  return null
}

async function probeExisting(
  filename: string,
  doc: SeedMediaDoc,
  seedBytes: number,
): Promise<{ repair: boolean; reason: string }> {
  const token = blobReadWriteToken()
  const blobRequired = Boolean(token)
  const storedName = doc.filename || filename
  let blob: SeedMediaProbe['blob'] = 'unknown'

  if (token) {
    const objectUrl = blobUrlToVerify(doc, storedName, token)
    blob = (await blobHeadPresent(objectUrl, token)) ? 'present' : 'missing'
  }

  const publicFile = await publicFileState(storedName)
  return assessSeedMedia({
    filename,
    url: doc.url,
    filesize: numericSize(doc.filesize),
    seedBytes,
    blobRequired,
    blob,
    publicFile,
    localFileExists: blobRequired ? false : localSeedFileExists(storedName),
  })
}

async function uploadSeedFile(
  payload: Payload,
  doc: SeedMediaDoc,
  filePath: string,
  alt: string,
): Promise<SeedMediaDoc> {
  const updated = await payload.update({
    collection: 'media',
    id: doc.id,
    overrideAccess: true,
    context: seedContext,
    overwriteExistingFiles: true,
    data: { alt },
    filePath,
  })
  return updated
}

async function freshMedia(payload: Payload, doc: SeedMediaDoc): Promise<SeedMediaDoc> {
  if (typeof payload.findByID !== 'function') return doc
  const loaded = await payload.findByID({
    collection: 'media',
    id: doc.id,
    depth: 0,
    overrideAccess: true,
  })
  return loaded ?? doc
}

async function assertBlobLanded(
  payload: Payload,
  filename: string,
  doc: SeedMediaDoc,
  filePath: string,
) {
  const token = blobReadWriteToken()
  if (!token) return

  const fresh = await freshMedia(payload, doc)
  const handlerUrl = seedBlobObjectUrl(fresh.filename || filename, fresh, token)
  const storedUrl = absoluteBlobUrl(fresh.url)
  const preferred = storedUrl ?? handlerUrl

  let durable = await blobHeadPresent(preferred, token, 2)
  if (!durable && preferred !== handlerUrl) {
    durable = await blobHeadPresent(handlerUrl, token)
  }
  if (!durable) {
    await putSeedFileAt(handlerUrl, filePath, token)
    durable = await blobHeadPresent(handlerUrl, token, 2)
    if (durable) {
      console.log(`media ${filename}: Blob API confirmed ${handlerUrl}`)
    }
  }
  if (durable && preferred !== handlerUrl && !(await blobHeadPresent(handlerUrl, token))) {
    await putSeedFileAt(handlerUrl, filePath, token)
    durable = await blobHeadPresent(handlerUrl, token, 2)
  }
  if (!durable) {
    throw new Error(
      `Seed upload for ${filename} did not land in Vercel Blob (${preferred}). Stored media url: ${fresh.url || '(empty)'}; prefix: ${fresh.prefix || '(empty)'}; _objectKey: ${fresh._objectKey || '(empty)'}. The deploy seed will not leave another orphan Media row.`,
    )
  }
}

/**
 * Reuse a Media row for this seed filename when the file is actually reachable.
 * Orphan rows (database record, no durable file) are re-uploaded in place.
 */
export async function ensureSeedMedia(
  payload: Payload,
  args: { filename: string; alt: string; filePath: string },
): Promise<number> {
  const { filename, alt, filePath } = args
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing seed image ${filePath}`)
  }
  const seedBytes = fs.statSync(filePath).size

  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 20,
    overrideAccess: true,
    pagination: false,
    where: { filename: { equals: filename } },
  })

  if (existing.docs.length === 0) {
    const created = await payload.create({
      collection: 'media',
      overrideAccess: true,
      context: seedContext,
      data: { alt },
      filePath,
    })
    await assertBlobLanded(payload, filename, created, filePath)
    console.log(`media ${filename}: created`)
    return created.id
  }

  let primaryId = existing.docs[0].id
  for (const doc of existing.docs) {
    const decision = await probeExisting(filename, doc, seedBytes)
    if (!decision.repair) {
      console.log(`media ${filename}: kept (${decision.reason})`)
      continue
    }
    console.log(`media ${filename}: re-upload (${decision.reason})`)
    const updated = await uploadSeedFile(payload, doc, filePath, alt)
    await assertBlobLanded(payload, filename, updated, filePath)
    if (doc.id === primaryId) primaryId = updated.id
  }

  return primaryId
}
