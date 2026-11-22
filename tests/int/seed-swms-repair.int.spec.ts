/** @vitest-environment node */
import fs from 'fs/promises'
import path from 'path'

import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { beforeAll, describe, expect, it } from 'vitest'

import { swmsUploadsDir } from '@/collections/SWMSFiles'
import { readSwmsFile } from '@/lib/swms/readSwmsFile'
import { relationID } from '@/lib/swms/relationID'
import { ensureDemoSwmsDocument } from '@/seed/ensureSeedSwmsFile'

let payload: Payload

describe('demo SWMS repair against the database', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('rewrites a missing local PDF onto the same file without a new file version', async () => {
    const previousToken = process.env.BLOB_READ_WRITE_TOKEN
    delete process.env.BLOB_READ_WRITE_TOKEN
    try {
      const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      const project = await payload.create({
        collection: 'projects',
        overrideAccess: true,
        draft: false,
        data: {
          title: `Repair ${stamp}`,
          address: '1 Repair Street, Sydney NSW 2000',
          type: 'residential',
          projectStatus: 'active',
          showAddressPublicly: false,
          enabledTrades: ['electrical-mechanical'],
          _status: 'published',
        },
      })
      const demo = {
        title: `SWMS - Repair ${stamp}`,
        trades: ['electrical-mechanical' as const],
        sortOrder: 1,
        filename: `swms-repair-${stamp}.pdf`,
        pages: [[`SWMS repair ${stamp}`, 'Placeholder PDF']],
      }

      await ensureDemoSwmsDocument(payload, demo, project.id)
      const created = await findDocument(project.id, demo.title)
      const fileID = relationID(created.file)
      expect(fileID).toBeTruthy()
      expect(created.fileVersion).toBe(1)
      const accessToken = created.accessToken

      const file = await payload.findByID({
        collection: 'swms-files',
        id: fileID as number,
        depth: 0,
        overrideAccess: true,
      })
      expect(file.filename).toBeTruthy()
      const before = await readSwmsFile(file)
      expect(before?.bytes.includes(Buffer.from(`SWMS repair ${stamp}`))).toBe(true)
      const updatedAt = file.updatedAt

      await fs.rm(path.resolve(swmsUploadsDir, file.filename as string), { force: true })
      expect(await readSwmsFile(file)).toBeNull()

      await ensureDemoSwmsDocument(payload, demo, project.id)

      const afterDoc = await findDocument(project.id, demo.title)
      expect(relationID(afterDoc.file)).toBe(fileID)
      expect(afterDoc.fileVersion).toBe(1)
      expect(afterDoc.accessToken).toBe(accessToken)

      const repaired = await payload.findByID({
        collection: 'swms-files',
        id: fileID as number,
        depth: 0,
        overrideAccess: true,
      })
      expect(repaired.updatedAt).not.toBe(updatedAt)
      const bytes = await readSwmsFile(repaired)
      expect(bytes?.mimeType).toBe('application/pdf')
      expect(bytes?.bytes.subarray(0, 5).toString()).toBe('%PDF-')
      expect(bytes?.bytes.includes(Buffer.from(`SWMS repair ${stamp}`))).toBe(true)

      await ensureDemoSwmsDocument(payload, demo, project.id)
      const kept = await payload.findByID({
        collection: 'swms-files',
        id: fileID as number,
        depth: 0,
        overrideAccess: true,
      })
      expect(kept.updatedAt).toBe(repaired.updatedAt)
      expect((await findDocument(project.id, demo.title)).fileVersion).toBe(1)
    } finally {
      if (previousToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN
      else process.env.BLOB_READ_WRITE_TOKEN = previousToken
    }
  })
})

async function findDocument(projectID: number, title: string) {
  const found = await payload.find({
    collection: 'swms-documents',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [{ title: { equals: title } }, { project: { equals: projectID } }],
    },
  })
  const document = found.docs[0]
  if (!document) throw new Error(`Missing SWMS document ${title}`)
  return document
}
