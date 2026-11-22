import fs from 'fs/promises'
import path from 'path'

import { BlobNotFoundError, head } from '@vercel/blob'

import { swmsUploadsDir } from '@/collections/SWMSFiles'

/**
 * Collection prefix on `swms-files` in payload.config.ts.
 * The Blob adapter uses it when a document has no prefix of its own.
 */
const collectionPrefix = 'swms-files'
const blobTokenPattern = /^vercel_blob_rw_([a-z\d]+)_([a-z\d]+)$/i

export type StoredSwmsFile = {
  filename?: string | null
  mimeType?: string | null
  url?: string | null
  prefix?: string | null
  _objectKey?: string | null
}

export type SwmsFileBytes = {
  bytes: Buffer
  mimeType: string
  filename: string
}

/**
 * Public Blob URL for a stored SWMS file.
 * Matches the storage adapter: folder is `prefix` plus `_objectKey`, and an empty folder
 * falls back to the collection prefix. Only the filename segment is URL-encoded.
 */
export function swmsBlobFileUrl(file: StoredSwmsFile, token: string): string | null {
  const filename = safeFilename(file.filename)
  const base = blobBaseUrl(token)
  if (!filename || !base) return null
  return `${base}/${storageFolder(file)}/${encodeURIComponent(filename)}`
}

export async function readSwmsFile(file: StoredSwmsFile): Promise<SwmsFileBytes | null> {
  const mimeType = file.mimeType || 'application/octet-stream'
  const filename = safeFilename(file.filename) || 'swms.pdf'
  const remote = remoteHttpUrl(file.url)

  if (remote && isBlobHost(remote)) {
    const token = blobToken()
    const bytes = token ? await readBlobUrl(remote, token) : await fetchBytes(stripQuery(remote))
    return bytes ? { bytes, mimeType, filename } : null
  }

  if (remote) {
    const bytes = await fetchBytes(remote)
    return bytes ? { bytes, mimeType, filename } : null
  }

  const token = blobToken()
  if (token) {
    const blobUrl = swmsBlobFileUrl(file, token)
    if (blobUrl) {
      try {
        const bytes = await readBlobUrl(blobUrl, token)
        if (bytes) return { bytes, mimeType, filename }
      } catch (error) {
        const local = await readLocalFile(file.filename)
        if (local) return { bytes: local, mimeType, filename }
        throw error
      }
    }
  }

  const local = await readLocalFile(file.filename)
  if (!local) return null
  return { bytes: local, mimeType, filename }
}

function blobToken(): string {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || ''
}

function blobBaseUrl(token: string): string | null {
  const trimmed = token.trim()
  if (!trimmed) return null
  const override = process.env.STORAGE_VERCEL_BLOB_BASE_URL?.replace(/\/$/, '')
  if (override) return override
  const storeId = trimmed.match(blobTokenPattern)?.[1]?.toLowerCase()
  if (!storeId) return null
  return `https://${storeId}.public.blob.vercel-storage.com`
}

/** Same folder the Vercel Blob static handler reads: prefix, then `_objectKey`, else the collection prefix. */
function storageFolder(file: StoredSwmsFile): string {
  const prefix = sanitizePrefix(file.prefix || '')
  const objectKey = sanitizePrefix(file._objectKey || '')
  const docPrefix = prefix && objectKey ? `${prefix}/${objectKey}` : prefix || objectKey
  return docPrefix || collectionPrefix
}

function sanitizePrefix(prefix: string): string {
  let decodedPrefix: string
  try {
    decodedPrefix = decodeURIComponent(prefix)
  } catch {
    return ''
  }
  if (/%[0-9a-f]{2}/i.test(decodedPrefix)) return ''
  return decodedPrefix
    .replace(/[\u0000-\u001f\u0080-\u009f]/g, '')
    .replace(/\\/g, '/')
    .split('/')
    .filter((segment) => segment && segment !== '..' && segment !== '.')
    .join('/')
}

function safeFilename(filename: string | null | undefined): string | null {
  if (!filename) return null
  const trimmed = filename.trim()
  if (!trimmed || trimmed === '.' || trimmed === '..') return null
  if (trimmed.includes('/') || trimmed.includes('\\') || trimmed.includes('\0')) return null
  return trimmed
}

function remoteHttpUrl(url: string | null | undefined): string | null {
  if (!url || !/^https?:\/\//i.test(url.trim())) return null
  try {
    const parsed = new URL(url.trim())
    if (
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '::1'
    ) {
      return null
    }
    return parsed.toString()
  } catch {
    return null
  }
}

function isBlobHost(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.endsWith('.blob.vercel-storage.com')) return true
    const override = process.env.STORAGE_VERCEL_BLOB_BASE_URL
    if (!override) return false
    return parsed.host === new URL(override).host
  } catch {
    return false
  }
}

function stripQuery(url: string): string {
  const parsed = new URL(url)
  parsed.search = ''
  parsed.hash = ''
  return parsed.toString()
}

function isBlobMissing(error: unknown): boolean {
  if (error instanceof BlobNotFoundError) return true
  return error instanceof Error && error.name === 'BlobNotFoundError'
}

async function readBlobUrl(url: string, token: string): Promise<Buffer | null> {
  const clean = stripQuery(url)
  try {
    const meta = await head(clean, { token })
    if (!meta || meta.size <= 0) return null
    return fetchBytes(`${clean}?${meta.uploadedAt.toISOString()}`)
  } catch (error) {
    if (isBlobMissing(error)) return null
    throw error
  }
}

async function fetchBytes(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
    })
    if (!response.ok) return null
    const bytes = Buffer.from(await response.arrayBuffer())
    return bytes.length > 0 ? bytes : null
  } catch {
    return null
  }
}

async function readLocalFile(filename: string | null | undefined): Promise<Buffer | null> {
  const safe = safeFilename(filename)
  if (!safe) return null
  const root = path.resolve(swmsUploadsDir)
  const filePath = path.resolve(root, safe)
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) return null
  try {
    const bytes = await fs.readFile(filePath)
    return bytes.length > 0 ? bytes : null
  } catch {
    return null
  }
}
