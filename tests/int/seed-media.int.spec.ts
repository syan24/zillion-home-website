import fs from 'fs'
import path from 'path'

import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Payload } from 'payload'

import {
  assessSeedMedia,
  deployBlobTokenProblem,
  ensureSeedMedia,
  seedBlobObjectUrl,
  urlLooksLocalOnly,
} from '@/seed/ensureSeedMedia'

const healthy = {
  filename: 'service-residential.jpg',
  url: '/api/media/file/service-residential.jpg',
  filesize: 1200,
  seedBytes: 1200,
  blobRequired: true,
  blob: 'present' as const,
  publicFile: 'ok' as const,
}

describe('seed media repair', () => {
  afterEach(() => {
    delete process.env.BLOB_READ_WRITE_TOKEN
    delete process.env.STORAGE_VERCEL_BLOB_BASE_URL
  })

  it('treats Payload file URLs as usable and disk or localhost URLs as local-only', () => {
    expect(urlLooksLocalOnly('/api/media/file/kew-kitchen.jpg')).toBe(false)
    expect(urlLooksLocalOnly('/api/media/file/kew-kitchen.jpg?prefix=media')).toBe(false)
    expect(urlLooksLocalOnly('https://abc.public.blob.vercel-storage.com/kew-kitchen.jpg')).toBe(
      false,
    )
    expect(urlLooksLocalOnly(null)).toBe(true)
    expect(urlLooksLocalOnly('')).toBe(true)
    expect(urlLooksLocalOnly('/media/kew-kitchen.jpg')).toBe(true)
    expect(urlLooksLocalOnly('http://localhost:3000/api/media/file/kew-kitchen.jpg')).toBe(true)
    expect(urlLooksLocalOnly('file:///tmp/kew-kitchen.jpg')).toBe(true)
  })

  it('keeps a seed file when the blob object and public URL are healthy', () => {
    expect(assessSeedMedia(healthy).repair).toBe(false)
  })

  it('re-uploads when the row has no file, a local-only url, or a zero size', () => {
    expect(assessSeedMedia({ ...healthy, filesize: 0 }).reason).toBe('filesize is missing or zero')
    expect(assessSeedMedia({ ...healthy, filesize: null }).reason).toBe('filesize is missing or zero')
    expect(assessSeedMedia({ ...healthy, url: null }).reason).toBe('no usable url')
    expect(assessSeedMedia({ ...healthy, url: 'http://localhost:3000/api/media/file/x.jpg' }).reason).toBe(
      'url is local-only',
    )
    expect(assessSeedMedia({ ...healthy, url: '/media/service-residential.jpg' }).reason).toBe(
      'url is local-only',
    )
  })

  it('re-uploads orphan rows whose filename exists but the blob object or public file does not', () => {
    expect(assessSeedMedia({ ...healthy, blob: 'missing' }).reason).toBe('blob object is missing')
    expect(assessSeedMedia({ ...healthy, publicFile: 'missing' }).reason).toBe(
      'public file returned 404',
    )
    expect(assessSeedMedia({ ...healthy, blob: 'unknown' }).reason).toBe(
      'blob durability was not confirmed',
    )
  })

  it('keeps a reachable admin replacement except the homepage hero', () => {
    expect(assessSeedMedia({ ...healthy, filesize: 50 }).repair).toBe(false)
    expect(
      assessSeedMedia({
        ...healthy,
        filename: 'hero-house.jpg',
        filesize: 50,
      }).reason,
    ).toBe('hero-house.jpg size differs from the seed asset')
  })

  it('keeps a local file that matches and re-uploads when the disk file is gone', () => {
    expect(
      assessSeedMedia({
        ...healthy,
        blobRequired: false,
        blob: 'unknown',
        publicFile: 'unknown',
        localFileExists: true,
      }).repair,
    ).toBe(false)
    expect(
      assessSeedMedia({
        ...healthy,
        blobRequired: false,
        blob: 'unknown',
        publicFile: 'unknown',
        localFileExists: false,
      }).reason,
    ).toBe('local file is missing')
    expect(
      assessSeedMedia({
        ...healthy,
        blobRequired: false,
        blob: 'unknown',
        publicFile: 'missing',
        localFileExists: true,
      }).reason,
    ).toBe('public file returned 404')
  })

  it('builds the public blob URL the storage adapter serves', () => {
    const token = 'vercel_blob_rw_AbC12_secret9'
    expect(seedBlobObjectUrl('kew-kitchen.jpg', {}, token)).toBe(
      'https://abc12.public.blob.vercel-storage.com/kew-kitchen.jpg',
    )
    expect(
      seedBlobObjectUrl('my file.jpg', { prefix: 'uploads', _objectKey: 'obj' }, token),
    ).toBe('https://abc12.public.blob.vercel-storage.com/uploads/obj/my%20file.jpg')
  })

  it('re-uploads a local orphan and skips the same file once the bytes are on disk', async () => {
    const filename = 'service-residential.jpg'
    const filePath = path.resolve('src/seed/assets', filename)
    const seedBytes = fs.statSync(filePath).size
    const updates: number[] = []
    const payload = {
      find: async () => ({
        docs: [
          {
            id: 7,
            filename,
            filesize: seedBytes,
            url: `/api/media/file/${filename}`,
          },
        ],
      }),
      update: async (args: { id: number; filePath?: string; overwriteExistingFiles?: boolean }) => {
        updates.push(args.id)
        expect(args.overwriteExistingFiles).toBe(true)
        expect(args.filePath).toBe(filePath)
        return {
          id: args.id,
          filename,
          filesize: seedBytes,
          url: `/api/media/file/${filename}`,
        }
      },
      create: async () => {
        throw new Error('should reuse the media row')
      },
    } as unknown as Payload

    const previousServer = process.env.NEXT_PUBLIC_SERVER_URL
    const previousVercel = process.env.VERCEL_URL
    const previousProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL
    process.env.NEXT_PUBLIC_SERVER_URL = ''
    process.env.VERCEL_URL = ''
    process.env.VERCEL_PROJECT_PRODUCTION_URL = ''

    await expect(
      ensureSeedMedia(payload, { alt: 'Residential construction', filePath, filename }),
    ).resolves.toBe(7)
    expect(updates).toEqual([7])

    const dest = path.resolve('public/media', filename)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(filePath, dest)
    updates.length = 0
    try {
      await expect(
        ensureSeedMedia(payload, { alt: 'Residential construction', filePath, filename }),
      ).resolves.toBe(7)
      expect(updates).toEqual([])
    } finally {
      fs.rmSync(dest, { force: true })
      process.env.NEXT_PUBLIC_SERVER_URL = previousServer
      process.env.VERCEL_URL = previousVercel
      process.env.VERCEL_PROJECT_PRODUCTION_URL = previousProduction
    }
  })

  it('re-uploads when Blob is missing and skips when the blob object and public file answer', async () => {
    const filename = 'kew-kitchen.jpg'
    const filePath = path.resolve('src/seed/assets/projects', filename)
    const seedBytes = fs.statSync(filePath).size
    const previousServer = process.env.NEXT_PUBLIC_SERVER_URL
    process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_store1_secret9'
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://zillion-home.vercel.app'

    let uploaded = false
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const href = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      if (href.includes('blob.vercel-storage.com')) {
        if (!uploaded) return new Response(null, { status: 404 })
        return new Response('x', {
          status: 206,
          headers: { 'content-range': `bytes 0-0/${seedBytes}` },
        })
      }
      if (!uploaded) return new Response(null, { status: 404 })
      return new Response('x', {
        status: 206,
        headers: { 'content-range': `bytes 0-0/${seedBytes}` },
      })
    })

    const updates: string[] = []
    const payload = {
      find: async () => ({
        docs: [
          {
            id: 4,
            filename,
            filesize: seedBytes,
            url: `/api/media/file/${filename}`,
            prefix: '',
            _objectKey: null,
          },
        ],
      }),
      update: async (args: { overwriteExistingFiles?: boolean; filePath?: string }) => {
        uploaded = true
        updates.push(args.filePath || '')
        expect(args.overwriteExistingFiles).toBe(true)
        return {
          id: 4,
          filename,
          filesize: seedBytes,
          url: `/api/media/file/${filename}`,
        }
      },
      create: async () => {
        throw new Error('should reuse the media row')
      },
    } as unknown as Payload

    try {
      await expect(
        ensureSeedMedia(payload, { alt: 'Kitchen', filePath, filename }),
      ).resolves.toBe(4)
      expect(updates).toEqual([filePath])

      await expect(
        ensureSeedMedia(payload, { alt: 'Kitchen', filePath, filename }),
      ).resolves.toBe(4)
      expect(updates).toEqual([filePath])
    } finally {
      fetchMock.mockRestore()
      process.env.NEXT_PUBLIC_SERVER_URL = previousServer
    }
  })

  it('fails the deploy seed when the blob token is missing or malformed', () => {
    expect(deployBlobTokenProblem()).toMatch(/SEED_DEMO=true requires BLOB_READ_WRITE_TOKEN/)
    process.env.BLOB_READ_WRITE_TOKEN = 'not-a-blob-token'
    expect(deployBlobTokenProblem()).toMatch(/not a Vercel Blob read\/write token/)
    process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_store1_secret9'
    expect(deployBlobTokenProblem()).toBeNull()
  })
})
