// @vitest-environment node

import { randomUUID } from 'crypto'
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '@payload-config'

import { submitEnquiryRecord } from '@/lib/enquiry/submit'
import type { ValidEnquiry } from '@/lib/enquiry/validate'

let payload: Payload

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

function enquiry(id: string): ValidEnquiry {
  return {
    clientSubmissionId: id,
    name: 'Alex Chen',
    phone: '0400 000 000',
    email: 'alex@example.com',
    address: 'Kew',
    projectType: 'residential',
    scope: ['kitchen', 'tv-unit'],
    spaces: ['kitchen'],
    notes: 'Warm oak kitchen.',
    budgetRange: '100k-250k',
    expectedStart: '3-6-months',
    additionalAnswers: { siteAccess: 'After 7am' },
  }
}

describe('enquiry submission', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  afterAll(async () => {
    if (!payload) return
    const created = await payload.find({
      collection: 'enquiries',
      depth: 0,
      limit: 50,
      overrideAccess: true,
      where: { email: { equals: 'alex@example.com' } },
    })
    for (const doc of created.docs) {
      await payload.delete({ collection: 'enquiries', id: doc.id, overrideAccess: true })
    }
  })

  it('stores one enquiry and one file when the same attempt is submitted twice', async () => {
    const id = randomUUID()
    const input = {
      fields: enquiry(id),
      locale: 'zh' as const,
      ip: `test-${id}`,
      userAgent: 'vitest',
      blobs: [],
      files: [
        {
          name: 'photo.png',
          type: 'image/png',
          size: png.length,
          arrayBuffer: async () => Uint8Array.from(png).buffer,
        },
      ],
    }

    const first = await submitEnquiryRecord(payload, input)
    const second = await submitEnquiryRecord(payload, input)
    expect(first.ok).toBe(true)
    expect(second).toEqual(first)

    const found = await payload.find({
      collection: 'enquiries',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { clientSubmissionId: { equals: id } },
    })
    expect(found.totalDocs).toBe(1)
    const doc = found.docs[0]
    expect(doc?.submissionReference).toMatch(/^ENQ-/)
    expect(doc?.projectType).toBe('residential')
    expect(doc?.spaces).toEqual(['kitchen'])
    expect(doc?.locale).toBe('zh')
    expect(doc?.status).toBe('new')
    expect(doc?.notificationStatus).toBe('skipped')
    expect(doc?.attachments).toHaveLength(1)
    expect(doc?.additionalAnswers).toEqual({ siteAccess: 'After 7am' })

    if (!doc) return
    const updated = await payload.update({
      collection: 'enquiries',
      id: doc.id,
      overrideAccess: true,
      data: { name: 'Changed', status: 'contacted', internalNotes: 'Called back.' },
    })
    expect(updated.name).toBe('Alex Chen')
    expect(updated.status).toBe('contacted')
    expect(updated.internalNotes).toBe('Called back.')
  })

  it('rejects a disallowed file and does not create an enquiry', async () => {
    const id = randomUUID()
    const result = await submitEnquiryRecord(payload, {
      fields: enquiry(id),
      locale: 'en',
      ip: `test-${id}`,
      userAgent: 'vitest',
      blobs: [],
      files: [
        {
          name: 'plan.exe',
          type: 'application/octet-stream',
          size: 12,
          arrayBuffer: async () => new Uint8Array(12).buffer,
        },
      ],
    })
    expect(result).toEqual({ ok: false, issues: [{ field: 'files', code: 'files' }] })
    const found = await payload.count({
      collection: 'enquiries',
      overrideAccess: true,
      where: { clientSubmissionId: { equals: id } },
    })
    expect(found.totalDocs).toBe(0)
  })
})
