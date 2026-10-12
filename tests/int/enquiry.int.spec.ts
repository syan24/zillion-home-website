import { describe, expect, it } from 'vitest'

import { publicEnquiryFields } from '@/lib/enquiry/defaultForm'
import {
  enquiryFileIssue,
  incomingEnquiryPath,
  isIncomingEnquiryPath,
  isPublicBlobUrl,
  parseEnquiryBlobs,
} from '@/lib/enquiry/files'
import { resolveEnquiryMail } from '@/lib/enquiry/mail'
import { MAX_ENQUIRY_FILE_BYTES } from '@/lib/enquiry/options'
import { mapEnquiryAnswers } from '@/lib/enquiry/validate'

const fields = publicEnquiryFields('en')
const valid = {
  clientSubmissionId: '8d9b6c3e-1f4a-4c2b-9a1e-0b7c6d5e4f30',
  name: 'Alex Chen',
  phone: '0400 000 000',
  email: 'alex@example.com',
  address: 'Kew',
  projectType: 'joinery',
  scope: ['kitchen', 'tv-unit', 'kitchen'],
  notes: 'Warm oak.',
  budget: '100k-250k',
  timeline: '3-6-months',
}

describe('enquiry form mapping', () => {
  it('maps the seeded field names and copies room scopes', () => {
    const result = mapEnquiryAnswers({
      fields,
      values: valid,
      files: [],
      clientSubmissionId: valid.clientSubmissionId,
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.projectType).toBe('joinery')
    expect(result.value.scope).toEqual(['kitchen', 'tv-unit'])
    expect(result.value.spaces).toEqual(['kitchen'])
    expect(result.value.email).toBe('alex@example.com')
    expect(result.value.budgetRange).toBe('100k-250k')
    expect(result.value.additionalAnswers).toBeUndefined()
  })

  it('requires the seeded name, email, address, and project type', () => {
    const result = mapEnquiryAnswers({
      fields,
      values: { ...valid, name: ' ', email: 'not-an-email', address: '', projectType: 'interior', phone: 'abc' },
      files: [],
      clientSubmissionId: valid.clientSubmissionId,
    })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.issues.map((issue) => `${issue.field}:${issue.code}`)).toEqual([
      'name:required',
      'phone:phone',
      'email:email',
      'address:required',
      'projectType:invalid',
    ])
  })

  it('keeps a project type that the form itself offers', () => {
    const custom = fields.map((field) =>
      field.name === 'projectType'
        ? {
            ...field,
            options: [...(field.options || []), { label: 'Interior', value: 'interior' }],
          }
        : field,
    )
    const result = mapEnquiryAnswers({
      fields: custom,
      values: { ...valid, projectType: 'interior' },
      files: [],
      clientSubmissionId: valid.clientSubmissionId,
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.projectType).toBe('interior')
  })

  it('stores unknown questions without dropping them', () => {
    const result = mapEnquiryAnswers({
      fields: [...fields, { blockType: 'text', name: 'siteAccess', label: 'Site access' }],
      values: { ...valid, siteAccess: 'After 7am' },
      files: [],
      clientSubmissionId: valid.clientSubmissionId,
    })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.additionalAnswers).toEqual({ siteAccess: 'After 7am' })
  })

  it('allows a blank phone', () => {
    const result = mapEnquiryAnswers({
      fields,
      values: { ...valid, phone: '' },
      files: [],
      clientSubmissionId: valid.clientSubmissionId,
    })
    expect(result.ok).toBe(true)
  })
})

describe('enquiry files', () => {
  it('accepts pdf, images, and dwg within 10MB', () => {
    expect(enquiryFileIssue('plan.pdf', 'application/pdf', 1024)).toBeNull()
    expect(enquiryFileIssue('photo.JPG', 'image/jpeg', 1024)).toBeNull()
    expect(enquiryFileIssue('drawing.dwg', '', 1024)).toBeNull()
    expect(enquiryFileIssue('plan.pdf', 'application/pdf', MAX_ENQUIRY_FILE_BYTES + 1)).toBe('size')
    expect(enquiryFileIssue('plan.exe', 'application/pdf', 1024)).toBe('type')
  })

  it('only accepts incoming blob urls on the public blob host', () => {
    const pathname = 'enquiry-incoming/8d9b6c3e-1f4a-4c2b-9a1e-0b7c6d5e4f30/plan.pdf'
    expect(isIncomingEnquiryPath(pathname)).toBe(true)
    expect(incomingEnquiryPath('Site plan.pdf')).toMatch(/^enquiry-incoming\//)
    expect(incomingEnquiryPath('virus.exe')).toBeNull()

    const url = `https://store.public.blob.vercel-storage.com/${pathname}`
    expect(isPublicBlobUrl(url)).toBe(true)
    expect(isPublicBlobUrl('https://example.com/plan.pdf')).toBe(false)
    expect(
      parseEnquiryBlobs(
        JSON.stringify([
          {
            field: 'attachments',
            url,
            pathname,
            originalName: 'plan.pdf',
            contentType: 'application/pdf',
            size: 1024,
          },
        ]),
      ).ok,
    ).toBe(true)
  })
})

describe('enquiry mail plan', () => {
  it('skips when the recipient is missing', () => {
    expect(resolveEnquiryMail({}).mode).toBe('skip')
  })

  it('prefers Resend when both providers are set', () => {
    const plan = resolveEnquiryMail({
      ENQUIRY_NOTIFY_TO: 'office@example.com',
      ENQUIRY_NOTIFY_FROM: 'Zillion <notify@example.com>',
      RESEND_API_KEY: 're_test',
      SMTP_HOST: 'smtp.example.com',
    })
    expect(plan.mode).toBe('resend')
  })

  it('uses SMTP when Resend is absent', () => {
    const plan = resolveEnquiryMail({
      ENQUIRY_NOTIFY_TO: 'office@example.com',
      ENQUIRY_NOTIFY_FROM: 'notify@example.com',
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: '465',
    })
    expect(plan).toMatchObject({ mode: 'smtp', port: 465, secure: true })
  })
})
