/** @vitest-environment node */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Payload } from 'payload'

import { readSwmsFile } from '@/lib/swms/readSwmsFile'
import { ensureDemoSwmsDocument, type DemoSwmsDocument } from '@/seed/ensureSeedSwmsFile'

vi.mock('@/lib/swms/readSwmsFile', () => ({
  readSwmsFile: vi.fn(),
}))

const readMock = vi.mocked(readSwmsFile)

const document: DemoSwmsDocument = {
  title: 'SWMS - Working at heights',
  trades: ['electrical-mechanical'],
  sortOrder: 1,
  filename: 'swms-working-at-heights.pdf',
  pages: [['SWMS - Working at heights', 'Placeholder for the Phase 3 demo.']],
}

const readable = {
  bytes: Buffer.from('%PDF-1.4 readable'),
  mimeType: 'application/pdf',
  filename: document.filename,
}

describe('demo SWMS file seed', () => {
  beforeEach(() => {
    readMock.mockReset()
    delete process.env.BLOB_READ_WRITE_TOKEN
  })

  it('creates the document when the title is missing', async () => {
    readMock.mockResolvedValue(readable)
    const payload = mockPayload({ documents: [] })

    await ensureDemoSwmsDocument(payload.api, document, 3)

    expect(payload.creates.map((call) => call.collection)).toEqual(['swms-files', 'swms-documents'])
    expect(payload.updates).toEqual([])
    const file = payload.creates[0]
    expect(file?.file?.mimetype).toBe('application/pdf')
    expect(file?.file?.name).toBe(document.filename)
    expect(file?.file?.data.subarray(0, 5).toString()).toBe('%PDF-')
    expect(payload.creates[1]?.data).toMatchObject({
      title: document.title,
      project: 3,
      file: 9,
      status: 'active',
    })
  })

  it('keeps a readable file and does not change fileVersion', async () => {
    readMock.mockResolvedValue(readable)
    const payload = mockPayload({
      documents: [{ id: 4, title: document.title, file: 5, fileVersion: 1, accessToken: 'token' }],
      file: {
        id: 5,
        filename: document.filename,
        url: '/api/swms-files/file/swms-working-at-heights.pdf',
      },
    })

    await ensureDemoSwmsDocument(payload.api, document, 3)

    expect(payload.updates).toEqual([])
    expect(payload.creates).toEqual([])
    expect(readMock).toHaveBeenCalledOnce()
  })

  it('repairs an unreadable file on the same id without publishing a new version', async () => {
    readMock.mockResolvedValueOnce(null).mockResolvedValueOnce(readable)
    const payload = mockPayload({
      documents: [
        { id: 4, title: document.title, file: { id: 5 }, fileVersion: 2, accessToken: 'token' },
      ],
      file: {
        id: 5,
        filename: document.filename,
        mimeType: 'application/pdf',
        prefix: 'swms-files',
        _objectKey: null,
        url: '/api/swms-files/file/swms-working-at-heights.pdf',
      },
    })

    await ensureDemoSwmsDocument(payload.api, document, 3)

    expect(payload.creates).toEqual([])
    expect(payload.updates).toHaveLength(1)
    const repair = payload.updates[0]
    expect(repair?.collection).toBe('swms-files')
    expect(repair?.id).toBe(5)
    expect(repair?.overwriteExistingFiles).toBe(true)
    expect(repair?.data).toEqual({ alt: document.title })
    expect(repair?.file?.name).toBe(document.filename)
    expect(repair?.file?.data.subarray(0, 5).toString()).toBe('%PDF-')
    expect(repair?.data).not.toHaveProperty('fileVersion')
  })

  it('attaches a new file only when the file row is gone, which bumps fileVersion', async () => {
    readMock.mockResolvedValue(readable)
    const payload = mockPayload({
      documents: [{ id: 4, title: document.title, file: 5, fileVersion: 1 }],
      missingFile: true,
    })

    await ensureDemoSwmsDocument(payload.api, document, 3)

    expect(payload.creates.map((call) => call.collection)).toEqual(['swms-files'])
    expect(payload.updates).toEqual([
      expect.objectContaining({
        collection: 'swms-documents',
        id: 4,
        data: { file: 9 },
      }),
    ])
  })

  it('fails the seed when a repair is still not readable', async () => {
    readMock.mockResolvedValue(null)
    const payload = mockPayload({
      documents: [{ id: 4, title: document.title, file: 5, fileVersion: 1 }],
      file: { id: 5, filename: document.filename, prefix: 'swms-files' },
    })

    await expect(ensureDemoSwmsDocument(payload.api, document, 3)).rejects.toThrow(
      /still not readable/,
    )
  })
})

type FileUpload = { data: Buffer; mimetype: string; name: string; size: number }
type CreateCall = { collection: string; data: Record<string, unknown>; file?: FileUpload }
type UpdateCall = {
  collection: string
  id: number
  data: Record<string, unknown>
  overwriteExistingFiles?: boolean
  file?: FileUpload
}

function mockPayload(options: {
  documents: Record<string, unknown>[]
  file?: Record<string, unknown>
  missingFile?: boolean
}) {
  const creates: CreateCall[] = []
  const updates: UpdateCall[] = []
  let missingReads = options.missingFile ? 1 : 0
  const api = {
    find: async (args: { collection: string }) => {
      if (args.collection === 'swms-documents') return { docs: options.documents }
      return { docs: [] }
    },
    findByID: async (args: { collection: string; id: number }) => {
      if (missingReads > 0) {
        missingReads -= 1
        throw Object.assign(new Error('Not Found'), { status: 404, name: 'NotFound' })
      }
      return {
        filename: document.filename,
        mimeType: 'application/pdf',
        prefix: 'swms-files',
        ...(options.file ?? {}),
        id: args.id,
      }
    },
    create: async (args: CreateCall) => {
      creates.push(args)
      return { id: args.collection === 'swms-files' ? 9 : 4, ...args.data }
    },
    update: async (args: UpdateCall) => {
      updates.push(args)
      return {
        id: args.id,
        filename: document.filename,
        mimeType: 'application/pdf',
        prefix: 'swms-files',
        url: `/api/swms-files/file/${document.filename}`,
      }
    },
  }
  return { api: api as unknown as Payload, creates, updates }
}
