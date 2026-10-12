import nodemailer from 'nodemailer'

import {
  budgetOptions,
  enquiryLocaleOptions,
  labelFor,
  projectTypeOptions,
  scopeOptions,
  spaceOptions,
  timelineOptions,
} from '@/lib/enquiry/options'
import type { ValidEnquiry } from '@/lib/enquiry/validate'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type EnquiryMailPlan =
  | { mode: 'skip'; detail: string }
  | { mode: 'resend'; apiKey: string; from: string; to: string[] }
  | {
      mode: 'smtp'
      from: string
      to: string[]
      host: string
      port: number
      secure: boolean
      user?: string
      pass?: string
    }

export type EnquiryMailResult = {
  status: 'sent' | 'skipped' | 'failed'
  detail: string
}

export function resolveEnquiryMail(
  env: Record<string, string | undefined> = process.env,
): EnquiryMailPlan {
  const to = splitEmails(env.ENQUIRY_NOTIFY_TO)
  const from = (env.ENQUIRY_NOTIFY_FROM || '').trim()

  if (to.length === 0) {
    return { mode: 'skip', detail: 'Skipped: ENQUIRY_NOTIFY_TO is not set.' }
  }
  if (to.some((address) => !EMAIL_PATTERN.test(address))) {
    return { mode: 'skip', detail: 'Skipped: ENQUIRY_NOTIFY_TO has an invalid email address.' }
  }
  if (!from || !fromAddress(from)) {
    return { mode: 'skip', detail: 'Skipped: ENQUIRY_NOTIFY_FROM is not set.' }
  }

  const resendKey = (env.RESEND_API_KEY || '').trim()
  if (resendKey) {
    return { mode: 'resend', apiKey: resendKey, from, to }
  }

  const host = (env.SMTP_HOST || '').trim()
  if (!host) {
    return { mode: 'skip', detail: 'Skipped: set RESEND_API_KEY or SMTP_HOST to send enquiry email.' }
  }

  const port = Number(env.SMTP_PORT || 587)
  if (!Number.isInteger(port) || port <= 0) {
    return { mode: 'skip', detail: 'Skipped: SMTP_PORT is not a valid port.' }
  }

  const user = (env.SMTP_USER || '').trim()
  const pass = env.SMTP_PASS || ''
  if (user && !pass) {
    return { mode: 'skip', detail: 'Skipped: SMTP_USER is set without SMTP_PASS.' }
  }

  const secure = env.SMTP_SECURE === 'true' || port === 465
  return {
    mode: 'smtp',
    from,
    to,
    host,
    port,
    secure,
    user: user || undefined,
    pass: user ? pass : undefined,
  }
}

export async function sendEnquiryNotification(input: {
  enquiry: ValidEnquiry
  locale: 'en' | 'zh'
  submissionReference: string
  attachmentNames: string[]
  adminURL: string
  env?: NodeJS.ProcessEnv
}): Promise<EnquiryMailResult> {
  const plan = resolveEnquiryMail(input.env)
  if (plan.mode === 'skip') return { status: 'skipped', detail: plan.detail }

  const subject = `New enquiry ${input.submissionReference}: ${input.enquiry.name}`
  const text = enquiryText(input)
  const html = enquiryHtml(input)

  try {
    if (plan.mode === 'resend') {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${plan.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: plan.from,
          to: plan.to,
          subject,
          html,
          text,
          reply_to: input.enquiry.email,
        }),
        signal: AbortSignal.timeout(8000),
      })
      if (!response.ok) {
        const body = await response.text()
        return {
          status: 'failed',
          detail: clip(`Failed: Resend returned ${response.status}. ${body}`),
        }
      }
      return { status: 'sent', detail: `Sent via Resend to ${plan.to.join(', ')}.` }
    }

    const transport = nodemailer.createTransport({
      host: plan.host,
      port: plan.port,
      secure: plan.secure,
      auth: plan.user ? { user: plan.user, pass: plan.pass } : undefined,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    })
    await transport.sendMail({
      from: plan.from,
      to: plan.to,
      replyTo: input.enquiry.email,
      subject,
      text,
      html,
    })
    return { status: 'sent', detail: `Sent via SMTP to ${plan.to.join(', ')}.` }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email send failed.'
    return { status: 'failed', detail: clip(`Failed: ${message}`) }
  }
}

function enquiryText(input: {
  enquiry: ValidEnquiry
  locale: 'en' | 'zh'
  submissionReference: string
  attachmentNames: string[]
  adminURL: string
}): string {
  const { enquiry } = input
  const lines = [
    `Reference: ${input.submissionReference}`,
    `Name: ${enquiry.name}`,
    `Phone: ${enquiry.phone || '—'}`,
    `Email: ${enquiry.email}`,
    `Address: ${enquiry.address}`,
    `Project type: ${labelFor(projectTypeOptions, enquiry.projectType)}`,
    `Scope: ${enquiry.scope.map((value) => labelFor(scopeOptions, value)).join(', ') || '—'}`,
    `Spaces: ${enquiry.spaces.map((value) => labelFor(spaceOptions, value)).join(', ') || '—'}`,
    `Budget: ${labelFor(budgetOptions, enquiry.budgetRange) || '—'}`,
    `Expected start: ${labelFor(timelineOptions, enquiry.expectedStart) || '—'}`,
    `Locale: ${labelFor(enquiryLocaleOptions, input.locale)}`,
    '',
    enquiry.notes || 'No project description.',
    '',
    `Attachments: ${input.attachmentNames.length ? input.attachmentNames.join(', ') : 'None'}`,
    ...additionalLines(input.enquiry),
    `Admin: ${input.adminURL}`,
  ]
  return lines.join('\n')
}

function enquiryHtml(input: {
  enquiry: ValidEnquiry
  locale: 'en' | 'zh'
  submissionReference: string
  attachmentNames: string[]
  adminURL: string
}): string {
  const { enquiry } = input
  const row = (label: string, value: string) =>
    `<tr><th align="left" style="padding:4px 12px 4px 0;">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
  return [
    `<p>A new enquiry was submitted on the website.</p>`,
    '<table>',
    row('Reference', input.submissionReference),
    row('Name', enquiry.name),
    row('Phone', enquiry.phone || '—'),
    row('Email', enquiry.email),
    row('Address', enquiry.address),
    row('Project type', labelFor(projectTypeOptions, enquiry.projectType)),
    row('Scope', enquiry.scope.map((value) => labelFor(scopeOptions, value)).join(', ') || '—'),
    row('Spaces', enquiry.spaces.map((value) => labelFor(spaceOptions, value)).join(', ') || '—'),
    row('Budget', labelFor(budgetOptions, enquiry.budgetRange) || '—'),
    row('Expected start', labelFor(timelineOptions, enquiry.expectedStart) || '—'),
    row('Locale', labelFor(enquiryLocaleOptions, input.locale) || 'English'),
    '</table>',
    `<p>${escapeHtml(enquiry.notes || 'No project description.').replace(/\n/g, '<br>')}</p>`,
    `<p>Attachments: ${escapeHtml(input.attachmentNames.length ? input.attachmentNames.join(', ') : 'None')}</p>`,
    additionalHtml(input.enquiry),
    `<p><a href="${escapeHtml(input.adminURL)}">Open in admin</a></p>`,
  ].join('')
}

function additionalLines(enquiry: ValidEnquiry): string[] {
  const answers = enquiry.additionalAnswers
  if (!answers) return []
  const lines = Object.entries(answers).map(([key, value]) => `${key}: ${formatAnswer(value)}`)
  return lines.length ? ['', 'Additional answers:', ...lines] : []
}

function additionalHtml(enquiry: ValidEnquiry): string {
  const answers = enquiry.additionalAnswers
  if (!answers) return ''
  const rows = Object.entries(answers)
    .map(([key, value]) => `<li>${escapeHtml(key)}: ${escapeHtml(formatAnswer(value))}</li>`)
    .join('')
  return rows ? `<p>Additional answers:</p><ul>${rows}</ul>` : ''
}

function formatAnswer(value: string | boolean | string[]): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) return value.join(', ')
  return value
}

function splitEmails(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split(/[,;]/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function fromAddress(value: string): string | null {
  const match = value.match(/<([^>]+)>\s*$/)
  const address = (match?.[1] || value).trim()
  return EMAIL_PATTERN.test(address) ? address : null
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function clip(value: string): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, 300)
}
