import { readFileSync } from 'fs'
import path from 'path'
import type { Payload } from 'payload'

import { relationID } from '@/lib/swms/relationID'

export const demoAcknowledgementRef = 'ACK-DEMO-ROSEBERY'
export const demoAcknowledgementClientId = '00000000-0000-4000-8000-0000000000a7'
const demoProjectTitle = 'Rosebery Residence'
const demoSwmsTitle = 'Construction Works SWMS'

const demoSignature = `data:image/png;base64,${readFileSync(
  path.resolve(process.cwd(), 'src/seed/demo-signature.png'),
).toString('base64')}`

export async function seedSwmsAcknowledgement(payload: Payload) {
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

  const project = await payload.find({
    collection: 'projects',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { title: { equals: demoProjectTitle } },
  })
  const projectID = project.docs[0]?.id
  if (!projectID) {
    throw new Error(`Demo SWMS acknowledgement needs project “${demoProjectTitle}”.`)
  }

  const swms = await payload.find({
    collection: 'project-swms',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [{ title: { equals: demoSwmsTitle } }, { project: { equals: projectID } }],
    },
  })
  const projectSwmsID = swms.docs[0]?.id
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
      and: [
        { projectSwms: { equals: projectSwmsID } },
        { status: { equals: 'published' } },
      ],
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
      signature: demoSignature,
      signedAt: '2026-04-15T01:30:00.000Z',
      submissionRef: demoAcknowledgementRef,
      swmsVersion: versionID,
      workerCompany: 'Demo Electrical',
      workerName: 'Demo Worker',
      workerPhone: '0400 111 222',
      workerTrade: 'Electrician',
    },
  })

  console.log(
    `Demo SWMS acknowledgement ${created.submissionRef} created for ${demoProjectTitle} (${versionLabel || relationID(created.swmsVersion)}).`,
  )
  return created
}
