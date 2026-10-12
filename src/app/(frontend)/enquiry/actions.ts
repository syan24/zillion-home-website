'use server'

import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { getLocale } from '@/i18n/getLocale'
import { parseEnquiryBlobs } from '@/lib/enquiry/files'
import { submitEnquiryRecord } from '@/lib/enquiry/submit'
import { validateEnquiryFields, type EnquiryField } from '@/lib/enquiry/validate'

type SubmitEnquiryResult =
  | { ok: true; submissionReference: string }
  | { ok: false; fields: EnquiryField[] }

export async function submitEnquiry(formData: FormData): Promise<SubmitEnquiryResult> {
  const validated = validateEnquiryFields({
    clientSubmissionId: formData.get('clientSubmissionId'),
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    address: formData.get('address'),
    projectType: formData.get('projectType'),
    scope: formData.getAll('scope'),
    notes: formData.get('notes'),
    budget: formData.get('budget'),
    timeline: formData.get('timeline'),
  })
  if (!validated.ok) return validated

  const blobs = parseEnquiryBlobs(formData.get('blobs'))
  if (!blobs.ok) return { ok: false, fields: ['files'] }

  const files = formData.getAll('files').flatMap((item) => {
    if (typeof File !== 'undefined' && item instanceof File && item.size > 0) return [item]
    return []
  })
  if (blobs.value.length > 0 && files.length > 0) return { ok: false, fields: ['files'] }

  const headerList = await headers()
  const payload = await getPayload({ config: configPromise })
  return submitEnquiryRecord(payload, {
    fields: validated.value,
    locale: await getLocale(),
    ip: clientIp(headerList),
    userAgent: (headerList.get('user-agent') || '').slice(0, 400),
    files,
    blobs: blobs.value,
  })
}

function clientIp(headerList: Headers): string {
  const forwarded = headerList.get('x-forwarded-for')
  const raw = (forwarded?.split(',')[0] || headerList.get('x-real-ip') || 'local').trim()
  return raw.slice(0, 80) || 'local'
}
