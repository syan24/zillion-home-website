import { readFileSync } from 'fs'
import path from 'path'
import type { Payload } from 'payload'

import { relationID } from '@/lib/swms/relationID'

export const demoAcknowledgementRef = 'ACK-DEMO-ROSEBERY'
export const demoAcknowledgementClientId = '00000000-0000-4000-8000-0000000000a7'
const demoProjectTitle = 'Rosebery Residence'
const demoSwmsTitle = 'Construction Works SWMS'

async function findRoseberyProject(payload: Payload) {
  const byKey = await payload.find({
    collection: 'projects',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: { demoKey: { equals: 'rosebery-residence' } },
  })
  if (byKey.docs[0]) return byKey.docs[0]

  const byTitle = await payload.find({
    collection: 'projects',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: { title: { equals: demoProjectTitle } },
  })
  return byTitle.docs[0] ?? null
}

function demoSignatureDataUrl(): string {
  const file = path.resolve(process.cwd(), 'src/seed/demo-signature.png')
  try {
    return `data:image/png;base64,${readFileSync(file).toString('base64')}`
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown error'
    throw new Error(`Demo SWMS acknowledgement could not read ${file}. ${detail}`)
  }
}

export async function seedSwmsAcknowledgement(
  payload: Payload,
  options?: { createIfMissing?: boolean },
) {
  const existing = await payload.find({
    collection: 'swms-acknowledgements',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      or: [
        { submissionRef: { equals: demoAcknowledgementRef } },
        { clientSubmissionId: { equals: demoAcknowledgementClientId } },
      ],
    },
  })

  if (existing.docs[0]) {
    console.log('Demo SWMS acknowledgement already exists.')
    return existing.docs[0]
  }
  if (options?.createIfMissing === false) {
    console.log('Demo SWMS acknowledgement left removed.')
    return null
  }

  const project = await findRoseberyProject(payload)
  const projectID = project?.id
  if (!projectID) {
    throw new Error(`Demo SWMS acknowledgement needs project “${demoProjectTitle}”.`)
  }

  const swms = await payload.find({
    collection: 'project-swms',
    depth: 0,
    limit: 5,
    overrideAccess: true,
    where: { project: { equals: projectID } },
  })
  const projectSwms =
    swms.docs.find((doc) => doc.title === demoSwmsTitle) ||
    swms.docs.find((doc) => doc.status === 'active') ||
    swms.docs[0]
  const projectSwmsID = projectSwms?.id
  if (!projectSwmsID) {
    throw new Error(`Demo SWMS acknowledgement needs “${demoSwmsTitle}”.`)
  }

  const version = await payload.find({
    collection: 'swms-versions',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    sort: '-createdAt',
    where: {
      and: [{ projectSwms: { equals: projectSwmsID } }, { status: { equals: 'published' } }],
    },
  })
  const versionID = version.docs[0]?.id
  const versionLabel = version.docs[0]?.versionLabel
  if (!versionID) {
    throw new Error('Demo SWMS acknowledgement needs a published SWMS version.')
  }

  const created = await payload.create({
    collection: 'swms-acknowledgements',
    overrideAccess: true,
    data: {
      acknowledgementAccepted: true,
      clientSubmissionId: demoAcknowledgementClientId,
      metadata: {
        userAgent: 'demo-seed',
      },
      project: projectID,
      projectSwms: projectSwmsID,
      responses: {
        '0.0': 'yes',
        '0.1': 'yes',
        '0.2': 'yes',
        '1.0': 'yes',
        '1.1': 'yes',
        '1.2': 'na',
        '2.0': 'accepted',
        '2.1': 'accepted',
      },
      signature: demoSignatureDataUrl(),
      signedAt: '2026-04-15T01:30:00.000Z',
      submissionRef: demoAcknowledgementRef,
      swmsVersion: versionID,
      workerCompany: 'Demo Electrical',
      workerName: 'Demo Worker',
      workerPhone: '0400 111 222',
      workerTrade: 'Electrical & Mechanical Services',
      trades: ['electrical-mechanical'],
    },
  })

  console.log(
    `Demo SWMS acknowledgement ${created.submissionRef} created for ${demoProjectTitle} (${versionLabel || relationID(created.swmsVersion)}).`,
  )
  return created
}
