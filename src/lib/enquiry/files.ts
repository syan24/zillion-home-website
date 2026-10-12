import {
  MAX_ENQUIRY_FILE_BYTES,
  MAX_ENQUIRY_FILES,
} from '@/lib/enquiry/options'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const INCOMING_PATH =
  /^enquiry-incoming\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/[A-Za-z0-9._-]{1,180}$/i

export const enquiryFileExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'dwg'] as const

const allowedExtensions = new Set<string>(enquiryFileExtensions)

const mimeByExtension: Record<(typeof enquiryFileExtensions)[number], string[]> = {
  pdf: ['application/pdf', 'application/x-pdf'],
  png: ['image/png'],
  jpg: ['image/jpeg', 'image/jpg'],
  jpeg: ['image/jpeg', 'image/jpg'],
  dwg: [
    'application/octet-stream',
    'image/vnd.dwg',
    'application/acad',
    'application/x-dwg',
    'application/dwg',
    'image/x-dwg',
  ],
}

export const enquiryUploadMimeTypes = [
  'application/pdf',
  'application/x-pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/vnd.dwg',
  'application/acad',
  'application/x-dwg',
  'application/dwg',
  'image/x-dwg',
  'application/octet-stream',
]

export type EnquiryFileIssue = 'type' | 'size' | 'count'

export type IncomingBlob = {
  field?: string
  url: string
  pathname: string
  originalName: string
  contentType: string
  size: number
}

export function isEnquirySubmissionId(value: string): boolean {
  return UUID_PATTERN.test(value)
}

export function extensionOf(filename: string): string {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/)
  return match?.[1] ?? ''
}

export function safeOriginalName(name: string): string {
  const base = name.split(/[/\\]/).pop() || 'file'
  return base.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, 180) || 'file'
}

export function canonicalMimeType(filename: string, mimeType: string): string | null {
  const extension = extensionOf(filename)
  if (!allowedExtensions.has(extension)) return null
  const allowed = mimeByExtension[extension as (typeof enquiryFileExtensions)[number]]
  const mime = mimeType.toLowerCase().split(';')[0]?.trim() ?? ''
  if (mime === '' || allowed.includes(mime)) {
    if (extension === 'png') return 'image/png'
    if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg'
    if (extension === 'pdf') return 'application/pdf'
    return mime && allowed.includes(mime) ? mime : 'application/octet-stream'
  }
  return null
}

export function enquiryFileIssue(filename: string, mimeType: string, size: number): EnquiryFileIssue | null {
  if (!Number.isFinite(size) || size <= 0) return 'type'
  if (size > MAX_ENQUIRY_FILE_BYTES) return 'size'
  if (!canonicalMimeType(filename, mimeType)) return 'type'
  return null
}

export function incomingEnquiryPath(originalName: string): string | null {
  const safe = safeOriginalName(originalName).replace(/[^A-Za-z0-9._-]/g, '_')
  if (!canonicalMimeType(safe, '')) return null
  const pathname = `enquiry-incoming/${crypto.randomUUID()}/${safe.slice(0, 180)}`
  return isIncomingEnquiryPath(pathname) ? pathname : null
}

export function isIncomingEnquiryPath(pathname: string): boolean {
  if (!INCOMING_PATH.test(pathname)) return false
  return allowedExtensions.has(extensionOf(pathname))
}

export function isPublicBlobUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      url.port === '' &&
      url.username === '' &&
      url.password === '' &&
      url.hostname.endsWith('.public.blob.vercel-storage.com')
    )
  } catch {
    return false
  }
}

export function parseEnquiryBlobs(raw: unknown): { ok: true; value: IncomingBlob[] } | { ok: false } {
  if (raw == null || raw === '') return { ok: true, value: [] }
  if (typeof raw !== 'string' || raw.length > 20_000) return { ok: false }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false }
  }
  if (!Array.isArray(parsed) || parsed.length > MAX_ENQUIRY_FILES) return { ok: false }

  const value: IncomingBlob[] = []
  for (const item of parsed) {
    if (!item || typeof item !== 'object') return { ok: false }
    const record = item as Record<string, unknown>
    const field = typeof record.field === 'string' && /^[A-Za-z][A-Za-z0-9_-]{0,60}$/.test(record.field)
      ? record.field
      : undefined
    const url = typeof record.url === 'string' ? record.url : ''
    const pathname = typeof record.pathname === 'string' ? record.pathname : ''
    const originalName = typeof record.originalName === 'string' ? safeOriginalName(record.originalName) : ''
    const contentType = typeof record.contentType === 'string' ? record.contentType.slice(0, 120) : ''
    const size = typeof record.size === 'number' ? record.size : Number.NaN
    if (!isPublicBlobUrl(url) || !isIncomingEnquiryPath(pathname)) return { ok: false }
    if (!originalName || enquiryFileIssue(originalName, contentType, size)) return { ok: false }
    value.push({ field, url, pathname, originalName, contentType, size })
  }

  return { ok: true, value }
}

export function storedEnquiryFilename(originalName: string): string {
  const extension = extensionOf(safeOriginalName(originalName)) || 'bin'
  return `${crypto.randomUUID()}.${extension}`
}
