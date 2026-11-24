import { describe, expect, it } from 'vitest'

import { publicEnquiryFields } from '@/lib/enquiry/defaultForm'
import { sendEnquiryNotification } from '@/lib/enquiry/mail'
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
  scope: ['kitchen-cabinetry', 'entertainment-units', 'kitchen-cabinetry'],
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
    expect(result.value.scope).toEqual(['kitchen-cabinetry', 'entertainment-units'])
    expect(result.value.spaces).toEqual(['kitchen'])
    expect(result.value.email).toBe('alex@example.com')
    expect(result.value.budgetRange).toBe('100k-250k')
    expect(result.value.additionalAnswers).toBeUndefined()
  })

  it('requires the seeded name, email, address, and project type', () => {
    const result = mapEnquiryAnswers({
      fields,
      values: {
        ...valid,
        name: ' ',
        email: 'not-an-email',
        address: '',
        projectType: 'interior',
        phone: 'abc',
        scope: [],
      },
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

  it('rejects a scope from another project type', () => {
    const result = mapEnquiryAnswers({
      fields,
      values: { ...valid, projectType: 'residential', scope: ['office-fit-out'] },
      files: [],
      clientSubmissionId: valid.clientSubmissionId,
    })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.issues).toContainEqual({ field: 'scope', code: 'invalid' })
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
      values: { ...valid, projectType: 'interior', scope: [] },
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

  it('sends the project type and scope labels when notify env is set', async () => {
    const calls: string[] = []
    const original = globalThis.fetch
    globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
      calls.push(String(init?.body || ''))
      return new Response('{}', { status: 200 })
    }) as typeof fetch
    try {
      const result = await sendEnquiryNotification({
        enquiry: {
          clientSubmissionId: valid.clientSubmissionId,
          name: 'Alex Chen',
          phone: '',
          email: 'alex@example.com',
          address: 'Richmond',
          projectType: 'commercial',
          scope: ['office-fit-out', 'commercial-other'],
          spaces: [],
          notes: 'Ground floor.',
        },
        locale: 'en',
        submissionReference: 'ENQ-2601',
        attachmentNames: [],
        adminURL: 'http://localhost:3000/admin/collections/enquiries/1',
        env: {
          ENQUIRY_NOTIFY_TO: 'office@example.com',
          ENQUIRY_NOTIFY_FROM: 'Zillion Home <notify@example.com>',
          RESEND_API_KEY: 're_test',
        },
      })
      expect(result.status).toBe('sent')
      const body = JSON.parse(calls[0] || '{}') as { text?: string; to?: string[] }
      expect(body.to).toEqual(['office@example.com'])
      expect(body.text).toContain('Project type: commercial')
      expect(body.text).toContain('Scope: office-fit-out, commercial-other')
    } finally {
      globalThis.fetch = original
    }
  })

  it('skips email without failing when notify env is unset', async () => {
    const result = await sendEnquiryNotification({
      enquiry: {
        clientSubmissionId: valid.clientSubmissionId,
        name: 'Alex Chen',
        phone: '',
        email: 'alex@example.com',
        address: 'Kew',
        projectType: 'residential',
        scope: ['new-home-construction'],
        spaces: [],
        notes: '',
      },
      locale: 'en',
      submissionReference: 'ENQ-2602',
      attachmentNames: [],
      adminURL: 'http://localhost:3000/admin/collections/enquiries/2',
      env: {},
    })
    expect(result.status).toBe('skipped')
  })

  it('uses saved form labels and a saved recipient before the environment', async () => {
    const calls: string[] = []
    const original = globalThis.fetch
    globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
      calls.push(String(init?.body || ''))
      return new Response('{}', { status: 200 })
    }) as typeof fetch
    try {
      const result = await sendEnquiryNotification({
        enquiry: {
          clientSubmissionId: valid.clientSubmissionId,
          name: 'Alex Chen',
          phone: '',
          email: 'alex@example.com',
          address: 'Richmond',
          projectType: 'commercial',
          scope: ['office-fit-out'],
          spaces: [],
          notes: '',
        },
        locale: 'zh',
        submissionReference: 'ENQ-2603',
        attachmentNames: [],
        adminURL: 'http://localhost:3000/admin/collections/enquiries/3',
        env: {
          ENQUIRY_NOTIFY_TO: 'env@example.com',
          ENQUIRY_NOTIFY_FROM: 'Env <env@example.com>',
          RESEND_API_KEY: 're_test',
        },
        labels: { commercial: '商业装修', 'office-fit-out': '办公室装修' },
        notify: { to: 'saved@example.com', from: 'Saved <saved@example.com>' },
      })
      expect(result.status).toBe('sent')
      const body = JSON.parse(calls[0] || '{}') as { text?: string; to?: string[] }
      expect(body.to).toEqual(['saved@example.com'])
      expect(body.text).toContain('Project type: 商业装修')
      expect(body.text).toContain('Scope: 办公室装修')
      expect(body.text).not.toContain('Commercial')
    } finally {
      globalThis.fetch = original
    }
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
