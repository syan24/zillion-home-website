/** @vitest-environment node */
import fs from 'fs/promises'
import path from 'path'
import { pathToFileURL } from 'url'

import { BlobNotFoundError, head } from '@vercel/blob'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { swmsUploadsDir } from '@/collections/SWMSFiles'
import { readSwmsFile, swmsBlobFileUrl, type StoredSwmsFile } from '@/lib/swms/readSwmsFile'

vi.mock('@vercel/blob', () => {
  class BlobNotFoundError extends Error {
    constructor() {
      super('The requested blob does not exist')
      this.name = 'BlobNotFoundError'
    }
  }
  return {
    BlobNotFoundError,
    head: vi.fn(),
  }
})

const token = 'vercel_blob_rw_Store1_secret9'
const pdf = Buffer.from('%PDF-1.4 demo')
const heightsName = 'swms-working-at-heights.pdf'

const headMock = vi.mocked(head)

describe('readSwmsFile', () => {
  const written: string[] = []
  const originalToken = process.env.BLOB_READ_WRITE_TOKEN
  const originalBase = process.env.STORAGE_VERCEL_BLOB_BASE_URL

  afterEach(async () => {
    vi.unstubAllGlobals()
    headMock.mockReset()
    restoreEnv('BLOB_READ_WRITE_TOKEN', originalToken)
    restoreEnv('STORAGE_VERCEL_BLOB_BASE_URL', originalBase)
    await Promise.all(written.splice(0).map((filePath) => fs.rm(filePath, { force: true })))
  })

  it('builds the same Blob URL the storage adapter serves', async () => {
    const { generateURL } = await import(
      pathToFileURL(
        path.resolve('node_modules/@payloadcms/storage-vercel-blob/dist/generateURL.js'),
      ).href
    )
    const base = 'https://store1.public.blob.vercel-storage.com'
    const cases: StoredSwmsFile[] = [
      {
        filename: heightsName,
        prefix: 'swms-files/',
        url: `/api/swms-files/file/${heightsName}`,
      },
      {
        filename: 'SWMS interior.pdf',
        prefix: 'swms-files',
        _objectKey: 'abc_123',
        url: '/api/swms-files/file/SWMS%20interior.pdf?prefix=swms-files',
      },
      { filename: heightsName },
    ]

    for (const file of cases) {
      const docPrefix = joinPrefix(file.prefix, file._objectKey)
      expect(swmsBlobFileUrl(file, token)).toBe(
        generateURL({
          baseUrl: base,
          collectionPrefix: 'swms-files',
          filename: file.filename,
          prefix: docPrefix,
          useCompositePrefixes: false,
        }),
      )
    }
    expect(swmsBlobFileUrl({ filename: '../secret.pdf' }, token)).toBeNull()
    expect(swmsBlobFileUrl({ filename: heightsName }, 'not-a-blob-token')).toBeNull()
  })

  it('reads a relative Payload URL from Blob using prefix and _objectKey', async () => {
    process.env.BLOB_READ_WRITE_TOKEN = token
    const uploadedAt = new Date('2026-11-22T00:00:00.000Z')
    headMock.mockResolvedValue(blobHead(uploadedAt))
    const fetchMock = vi.fn(async (url: string) => {
      expect(url).toBe(
        `https://store1.public.blob.vercel-storage.com/swms-files/abc_123/${heightsName}?${uploadedAt.toISOString()}`,
      )
      return new Response(pdf, { status: 200 })
    })
    vi.stubGlobal('fetch', fetchMock)

    const stored = await readSwmsFile({
      filename: heightsName,
      mimeType: 'application/pdf',
      prefix: 'swms-files/',
      _objectKey: 'abc_123',
      url: `/api/swms-files/file/${heightsName}?prefix=swms-files%2F`,
    })

    expect(headMock).toHaveBeenCalledWith(
      `https://store1.public.blob.vercel-storage.com/swms-files/abc_123/${heightsName}`,
      { token },
    )
    expect(stored?.bytes.equals(pdf)).toBe(true)
    expect(stored?.mimeType).toBe('application/pdf')
    expect(stored?.filename).toBe(heightsName)
  })

  it('reads a prefixed Blob object when _objectKey was not stored', async () => {
    process.env.BLOB_READ_WRITE_TOKEN = token
    const uploadedAt = new Date('2026-11-22T01:00:00.000Z')
    headMock.mockResolvedValue(blobHead(uploadedAt))
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(pdf, { status: 200 })),
    )

    const stored = await readSwmsFile({
      filename: heightsName,
      mimeType: 'application/pdf',
      prefix: 'swms-files',
      url: `/api/swms-files/file/${heightsName}`,
    })

    expect(headMock).toHaveBeenCalledWith(
      `https://store1.public.blob.vercel-storage.com/swms-files/${heightsName}`,
      { token },
    )
    expect(stored?.bytes.subarray(0, 5).toString()).toBe('%PDF-')
  })

  it('reads an https Blob URL and ignores a cached query string', async () => {
    process.env.BLOB_READ_WRITE_TOKEN = token
    const uploadedAt = new Date('2026-11-22T02:00:00.000Z')
    headMock.mockResolvedValue(blobHead(uploadedAt))
    const fetchMock = vi.fn(async (url: string) => {
      expect(url).toBe(
        `https://store1.public.blob.vercel-storage.com/swms-files/${heightsName}?${uploadedAt.toISOString()}`,
      )
      return new Response(pdf, { status: 200 })
    })
    vi.stubGlobal('fetch', fetchMock)

    const stored = await readSwmsFile({
      filename: heightsName,
      mimeType: 'application/pdf',
      url: `https://store1.public.blob.vercel-storage.com/swms-files/${heightsName}?download=1`,
    })

    expect(stored?.bytes.equals(pdf)).toBe(true)
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('fetches an https Blob URL without a token', async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN
    const fetchMock = vi.fn(async (url: string) => {
      expect(url).toBe(`https://cdn.example.blob.vercel-storage.com/swms-files/${heightsName}`)
      return new Response(pdf, { status: 200 })
    })
    vi.stubGlobal('fetch', fetchMock)

    const stored = await readSwmsFile({
      filename: heightsName,
      mimeType: 'application/pdf',
      url: `https://cdn.example.blob.vercel-storage.com/swms-files/${heightsName}?download=1`,
    })

    expect(headMock).not.toHaveBeenCalled()
    expect(stored?.bytes.equals(pdf)).toBe(true)
  })

  it('returns null when the Blob object and the local file are both missing', async () => {
    process.env.BLOB_READ_WRITE_TOKEN = token
    headMock.mockRejectedValue(new BlobNotFoundError())

    const stored = await readSwmsFile({
      filename: 'missing-swms.pdf',
      mimeType: 'application/pdf',
      prefix: 'swms-files',
      _objectKey: 'gone',
      url: '/api/swms-files/file/missing-swms.pdf',
    })

    expect(stored).toBeNull()
  })

  it('returns null when an https file URL does not respond', async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 404 })),
    )

    const stored = await readSwmsFile({
      filename: heightsName,
      url: 'https://files.example.com/swms.pdf',
    })

    expect(stored).toBeNull()
  })

  it('reads a local file when no Blob token is set', async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN
    const filename = await writeLocal('local-swms.pdf')

    const stored = await readSwmsFile({
      filename,
      mimeType: 'application/pdf',
      prefix: 'swms-files/',
      url: `/api/swms-files/file/${filename}`,
    })

    expect(headMock).not.toHaveBeenCalled()
    expect(stored?.bytes.equals(pdf)).toBe(true)
    expect(stored?.mimeType).toBe('application/pdf')
  })

  it('falls back to the local file when Blob does not have the object', async () => {
    process.env.BLOB_READ_WRITE_TOKEN = token
    headMock.mockRejectedValue(new BlobNotFoundError())
    const filename = await writeLocal('fallback-swms.pdf')

    const stored = await readSwmsFile({
      filename,
      mimeType: 'application/pdf',
      prefix: 'swms-files',
      url: `/api/swms-files/file/${filename}`,
    })

    expect(stored?.bytes.equals(pdf)).toBe(true)
  })

  it('does not read a filename outside the uploads directory', async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN
    const stored = await readSwmsFile({
      filename: '../package.json',
      url: '/api/swms-files/file/package.json',
    })
    expect(stored).toBeNull()
  })

  async function writeLocal(filename: string) {
    await fs.mkdir(swmsUploadsDir, { recursive: true })
    const filePath = path.join(swmsUploadsDir, filename)
    await fs.writeFile(filePath, pdf)
    written.push(filePath)
    return filename
  }
})

function joinPrefix(prefix?: string | null, objectKey?: string | null) {
  const safePrefix = (prefix || '').replace(/^\/+|\/+$/g, '')
  const safeKey = (objectKey || '').replace(/^\/+|\/+$/g, '')
  if (safePrefix && safeKey) return `${safePrefix}/${safeKey}`
  return safePrefix || safeKey
}

function blobHead(uploadedAt: Date) {
  return {
    size: pdf.length,
    uploadedAt,
    pathname: heightsName,
    contentType: 'application/pdf',
    contentDisposition: 'inline',
    url: '',
    downloadUrl: '',
    cacheControl: '',
    etag: '"etag"',
  }
}

function restoreEnv(
  name: 'BLOB_READ_WRITE_TOKEN' | 'STORAGE_VERCEL_BLOB_BASE_URL',
  value: string | undefined,
) {
  if (value === undefined) delete process.env[name]
  else process.env[name] = value
}
