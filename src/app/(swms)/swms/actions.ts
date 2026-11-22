'use server'

import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import type { RequestMeta } from '@/lib/swms/siteSafetyRecords'
import {
  confirmSwmsVersions,
  createSiteReport,
  recordAttendance,
  saveInduction,
  type InductionResult,
} from '@/lib/swms/siteSafetyRecords'

export type SubmitSWMSResult = InductionResult

type SubmitInput = {
  token: string
  versionId: number
  clientSubmissionId: string
  responses: unknown
  workerName: string
  workerCompany: string
  workerPhone: string
  trades: string[]
  confirmed: { accessToken: string; fileVersion: number }[]
  acknowledgementAccepted: boolean
  signature: string
}

async function requestMeta(): Promise<RequestMeta> {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  const ipAddress = (forwarded?.split(',')[0] || headerList.get('x-real-ip') || '').trim().slice(0, 80)
  const userAgent = (headerList.get('user-agent') || '').slice(0, 400)
  return { ipAddress, userAgent }
}

async function payload() {
  return getPayload({ config: configPromise })
}

export async function submitSWMSAcknowledgement(input: SubmitInput): Promise<SubmitSWMSResult> {
  return saveInduction(await payload(), { ...input, meta: await requestMeta() })
}

export async function submitSiteAttendance(input: {
  token: string
  name: string
  phone: string
  direction: 'in' | 'out'
}) {
  return recordAttendance(await payload(), { ...input, meta: await requestMeta() })
}

export async function submitSwmsReconfirm(input: {
  token: string
  name: string
  phone: string
  confirmed: { accessToken: string; fileVersion: number }[]
}) {
  return confirmSwmsVersions(await payload(), { ...input, meta: await requestMeta() })
}

export async function submitSiteReport(formData: FormData) {
  const file = formData.get('attachment')
  const attachment =
    file instanceof File && file.size > 0
      ? {
          data: Buffer.from(await file.arrayBuffer()),
          mimetype: file.type,
          name: file.name,
        }
      : null

  return createSiteReport(await payload(), {
    token: String(formData.get('token') ?? ''),
    kind: String(formData.get('kind') ?? ''),
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    description: String(formData.get('description') ?? ''),
    occurredAt: String(formData.get('occurredAt') ?? ''),
    attachment,
    meta: await requestMeta(),
  })
}
