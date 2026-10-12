import { describe, expect, it } from 'vitest'

import {
  enquiryFileIssue,
  incomingEnquiryPath,
  isIncomingEnquiryPath,
  isPublicBlobUrl,
  parseEnquiryBlobs,
} from '@/lib/enquiry/files'
import { resolveEnquiryMail } from '@/lib/enquiry/mail'
import { MAX_ENQUIRY_FILE_BYTES } from '@/lib/enquiry/options'
import { validateEnquiryFields } from '@/lib/enquiry/validate'

const valid = {
  clientSubmissionId: '8d9b6c3e-1f4a-4c2b-9a1e-0b7c6d5e4f30',
  name: 'Alex Chen',
  phone: '0400 000 000',
  email: 'alex@example.com',
  address: 'Kew',
  projectType: 'joinery',
  scope: ['kitchen', 'tv-unit', 'kitchen'],
  notes: 'Warm oak, not a full interior fit-out.',
  budget: '100k-250k',
  timeline: '3-6-months',
}

describe('enquiry validation', () => {
  it('keeps the three project types and copies room scopes', () => {
    const result = validateEnquiryFields(valid)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.projectType).toBe('joinery')
    expect(result.value.scope).toEqual(['kitchen', 'tv-unit'])
    expect(result.value.spaces).toEqual(['kitchen'])
    expect(result.value.email).toBe('alex@example.com')
  })

  it('requires a name, email, address, and project type', () => {
    const result = validateEnquiryFields({
      ...valid,
      name: ' ',
      email: 'not-an-email',
      address: '',
      projectType: 'interior',
      phone: 'abc',
    })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.fields).toEqual(['name', 'email', 'phone', 'address', 'projectType'])
  })

  it('allows a blank phone and rejects an unknown scope', () => {
    expect(validateEnquiryFields({ ...valid, phone: '' }).ok).toBe(true)
    const scope = validateEnquiryFields({ ...valid, scope: ['office'] })
    expect(scope.ok).toBe(false)
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
            url,
            pathname,
            originalName: 'plan.pdf',
            contentType: 'application/pdf',
            size: 1024,
          },
        ]),
      ).ok,
    ).toBe(true)
    expect(parseEnquiryBlobs('{"url":"https://example.com"}').ok).toBe(false)
  })
})

describe('enquiry email plan', () => {
  it('skips when the mailbox is not configured', () => {
    expect(resolveEnquiryMail({}).mode).toBe('skip')
    const missingFrom = resolveEnquiryMail({ ENQUIRY_NOTIFY_TO: 'office@example.com' })
    expect(missingFrom.mode).toBe('skip')
    if (missingFrom.mode === 'skip') expect(missingFrom.detail).toMatch(/ENQUIRY_NOTIFY_FROM/)
  })

  it('prefers Resend when both providers are set', () => {
    const plan = resolveEnquiryMail({
      ENQUIRY_NOTIFY_TO: 'office@example.com, hello@example.com',
      ENQUIRY_NOTIFY_FROM: 'Zillion Home <notify@example.com>',
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
      SMTP_USER: 'notify@example.com',
      SMTP_PASS: 'secret',
    })
    expect(plan).toMatchObject({ mode: 'smtp', port: 465, secure: true })
  })
})
