import type { Payload } from 'payload'

const demoReference = 'ENQ-DEMO-KEW'
const demoSubmissionId = '00000000-0000-4000-8000-000000000004'

export async function seedEnquiry(payload: Payload) {
  const existing = await payload.find({
    collection: 'enquiries',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      or: [
        { submissionReference: { equals: demoReference } },
        { clientSubmissionId: { equals: demoSubmissionId } },
      ],
    },
  })

  if (existing.docs[0]) {
    console.log('Sample enquiry already exists.')
    return
  }

  await payload.create({
    collection: 'enquiries',
    overrideAccess: true,
    data: {
      submissionReference: demoReference,
      clientSubmissionId: demoSubmissionId,
      submittedAt: '2026-04-01T00:00:00.000Z',
      name: 'Demo Enquiry',
      phone: '0400 000 000',
      email: 'demo-enquiry@example.com',
      address: 'Kew, Victoria',
      projectType: 'residential',
      scope: ['kitchen', 'wardrobe'],
      spaces: ['kitchen', 'wardrobe'],
      notes:
        'Sample enquiry created by seed:demo so the admin list is not empty. Safe to delete. It has no attachment, so media repair is unchanged.',
      budgetRange: '100k-250k',
      expectedStart: '3-6-months',
      status: 'new',
      locale: 'en',
      notificationStatus: 'skipped',
      notificationDetail: 'Demo seed does not send email.',
    },
  })
  console.log(`Sample enquiry ${demoReference} created.`)
}
