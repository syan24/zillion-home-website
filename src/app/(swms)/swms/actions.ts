'use server'

import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { relationID } from '@/lib/swms/relationID'
import {
  validateClientSubmissionId,
  validateResponses,
  validateSignature,
  validateWorkerDetails,
} from '@/lib/swms/validateSubmission'
import { loadWorkerSWMS } from '@/lib/swms/loadWorkerSWMS'

export type SubmitSWMSResult =
  | { ok: true; submissionRef: string; signedAt: string }
  | { ok: false; error: string; code?: 'version-changed' }

type SubmitInput = {
  token: string
  versionId: number
  clientSubmissionId: string
  responses: unknown
  workerName: string
  workerCompany: string
  workerPhone: string
  workerTrade: string
  acknowledgementAccepted: boolean
  signature: string
}

export async function submitSWMSAcknowledgement(input: SubmitInput): Promise<SubmitSWMSResult> {
  const clientSubmissionId = validateClientSubmissionId(input.clientSubmissionId)
  if (!clientSubmissionId.ok) return clientSubmissionId

  const swms = await loadWorkerSWMS(input.token)
  if (!swms) {
    return {
      ok: false,
      error: 'This SWMS is no longer active. Ask your supervisor for a new link.',
    }
  }

  if (input.versionId !== swms.versionId) {
    return {
      ok: false,
      code: 'version-changed',
      error: 'This SWMS was updated. Review the latest version, then sign again.',
    }
  }

  const details = validateWorkerDetails(input)
  if (!details.ok) return details

  const responses = validateResponses(swms.sections, input.responses)
  if (!responses.ok) return responses

  if (input.acknowledgementAccepted !== true) {
    return { ok: false, error: 'Confirm the acknowledgement before submitting.' }
  }

  const signature = validateSignature(input.signature)
  if (!signature.ok) return signature

  const payload = await getPayload({ config: configPromise })
  const existing = await payload.find({
    collection: 'swms-acknowledgements',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      clientSubmissionId: { equals: clientSubmissionId.value },
    },
  })

  const existingDoc = existing.docs[0]
  if (existingDoc) {
    const sameSWMS = await acknowledgementMatchesToken(existingDoc.projectSwms, input.token)
    if (sameSWMS && existingDoc.submissionRef && existingDoc.signedAt) {
      return {
        ok: true,
        submissionRef: existingDoc.submissionRef,
        signedAt: existingDoc.signedAt,
      }
    }
    return {
      ok: false,
      error: 'This submission was already used. Refresh the page and sign again.',
    }
  }

  const projectSWMS = await payload.find({
    collection: 'project-swms',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      publicToken: { equals: input.token },
    },
  })
  const projectSWMSDoc = projectSWMS.docs[0]
  const projectID = relationID(projectSWMSDoc?.project)
  const projectSWMSID = projectSWMSDoc?.id
  if (!projectSWMSDoc || !projectID || !projectSWMSID) {
    return {
      ok: false,
      error: 'This SWMS is no longer active. Ask your supervisor for a new link.',
    }
  }

  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  const ipAddress = (forwarded?.split(',')[0] || headerList.get('x-real-ip') || '')
    .trim()
    .slice(0, 80)
  const userAgent = (headerList.get('user-agent') || '').slice(0, 400)
  const signedAt = new Date().toISOString()

  try {
    const created = await payload.create({
      collection: 'swms-acknowledgements',
      overrideAccess: true,
      data: {
        clientSubmissionId: clientSubmissionId.value,
        project: projectID,
        projectSwms: projectSWMSID,
        swmsVersion: swms.versionId,
        workerName: details.value.workerName,
        workerCompany: details.value.workerCompany,
        workerPhone: details.value.workerPhone,
        workerTrade: details.value.workerTrade,
        responses: responses.value,
        acknowledgementAccepted: true,
        signature: signature.value,
        signedAt,
        metadata: {
          ipAddress,
          userAgent,
        },
      },
    })

    return {
      ok: true,
      submissionRef: created.submissionRef || '',
      signedAt: created.signedAt,
    }
  } catch (error) {
    const raced = await payload.find({
      collection: 'swms-acknowledgements',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        clientSubmissionId: { equals: clientSubmissionId.value },
      },
    })
    const racedDoc = raced.docs[0]
    if (racedDoc?.submissionRef && racedDoc.signedAt) {
      return {
        ok: true,
        submissionRef: racedDoc.submissionRef,
        signedAt: racedDoc.signedAt,
      }
    }

    console.error('SWMS acknowledgement failed', error)
    return {
      ok: false,
      error: 'The signature could not be saved. Check your connection and try again.',
    }
  }
}

async function acknowledgementMatchesToken(projectSWMS: unknown, token: string): Promise<boolean> {
  const id = relationID(projectSWMS)
  if (!id) return false
  const payload = await getPayload({ config: configPromise })
  const doc = await payload.findByID({
    collection: 'project-swms',
    id,
    depth: 0,
    overrideAccess: true,
  })
  return doc.publicToken === token
}
