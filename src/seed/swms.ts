import type { Payload } from 'payload'

import { snapshotSections } from '@/lib/swms/content'
import type { TradeValue } from '@/lib/swms/trades'
import { ensureDemoSwmsDocument } from '@/seed/ensureSeedSwmsFile'
import { seedSwmsAcknowledgement } from '@/seed/swmsAcknowledgement'

const seedContext = { disableRevalidate: true }

const placeholderSections = [
  {
    title: 'Site safety',
    content:
      'Placeholder content for the Phase 1 demo. Replace this template with the client’s approved SWMS before operational use.',
    questions: [
      question('Have you completed the site induction for this project?', 'yes-no'),
      question('Are you wearing the PPE required for your work today?', 'yes-no'),
      question('Do you know the emergency assembly point?', 'yes-no'),
    ],
  },
  {
    title: 'Hazards and controls',
    content: 'Placeholder hazard check. This is not legal SWMS wording.',
    questions: [
      question('Have you checked the work area for new hazards?', 'yes-no-na'),
      question('Are you trained and competent for the tasks you will do today?', 'yes-no'),
      question(
        'Do the height, plant, or electrical controls apply to your work today?',
        'yes-no-na',
      ),
    ],
  },
  {
    title: 'Acknowledgement',
    content: 'Confirm how you will work on this site.',
    questions: [
      question('I will follow the controls in this SWMS.', 'acknowledgement'),
      question(
        'I will stop work and report it if the task or conditions change.',
        'acknowledgement',
      ),
    ],
  },
]

const acknowledgementText =
  'Placeholder acknowledgement: I have read and understood this Safe Work Method Statement. I agree to follow the safe work practices described above. This text is not the client’s legal SWMS.'

export async function seedSwms(payload: Payload) {
  const projects = [
    {
      demoKey: 'rosebery-residence',
      title: 'Rosebery Residence',
      address: '12 Smith Street, Rosebery NSW 2018',
      suburb: 'Rosebery',
      summary: 'Demo project for the SWMS worker flow.',
      trades: ['electrical-mechanical', 'interior-fitout', 'internal-linings'] as TradeValue[],
    },
    {
      demoKey: 'linfield-house',
      title: 'Linfield House',
      address: '8 Highfield Rd, Linfield NSW 2070',
      suburb: 'Linfield',
      summary: 'Demo project for the SWMS project list.',
      trades: ['structural-concrete', 'plumbing-drainage'] as TradeValue[],
    },
    {
      demoKey: 'marrickville-duplex',
      title: 'Marrickville Duplex',
      address: '2 Ocean St, Marrickville NSW 2020',
      suburb: 'Marrickville',
      summary: 'Demo project for the SWMS project list.',
      trades: ['siteworks-demolition', 'roofing-external'] as TradeValue[],
    },
  ]

  const projectDocs = []
  for (const project of projects) {
    projectDocs.push(await findOrCreateProject(payload, project))
  }

  const titles = ['Construction Works SWMS', 'Site Safety SWMS', 'Fit-out SWMS']
  const links: string[] = []
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  for (const [index, project] of projectDocs.entries()) {
    const swms = await ensureProjectSwms(payload, {
      title: titles[index] || 'Project SWMS',
      projectID: project.id,
      createIfMissing: project.created,
    })
    if (swms?.publicToken) {
      links.push(`${project.title}: ${baseUrl}/swms/${swms.publicToken} (${swms.status})`)
    }
  }

  const rosebery = projectDocs[0]
  if (rosebery) await seedDemoSwmsDocuments(payload, rosebery.id)

  await seedSwmsAcknowledgement(payload, { createIfMissing: rosebery?.created === true })
  console.log('SWMS seed ready.')
  console.log(links.join('\n'))
  console.log(`Project list: ${baseUrl}/swms`)
  console.log(`SWMS register: ${baseUrl}/admin/collections/swms-acknowledgements`)
}

function question(text: string, type: 'yes-no' | 'yes-no-na' | 'acknowledgement') {
  return {
    question: text,
    type,
    required: true,
    correctAnswer: 'yes' as const,
  }
}

async function findOrCreateProject(
  payload: Payload,
  data: {
    demoKey: string
    title: string
    address: string
    suburb: string
    summary: string
    trades: TradeValue[]
  },
) {
  const byKey = await payload.find({
    collection: 'projects',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: { demoKey: { equals: data.demoKey } },
  })
  if (byKey.docs[0]) return { id: byKey.docs[0].id, title: data.title, created: false }

  const byTitle = await payload.find({
    collection: 'projects',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: { title: { equals: data.title } },
  })
  const current = byTitle.docs[0]
  if (current) {
    if (!current.demoKey) {
      await payload.update({
        collection: 'projects',
        id: current.id,
        overrideAccess: true,
        draft: false,
        context: seedContext,
        data: { demoKey: data.demoKey },
      })
      console.log(`${data.title}: recorded demo key, left trades and other fields unchanged`)
    }
    return { id: current.id, title: data.title, created: false }
  }

  const created = await payload.create({
    collection: 'projects',
    overrideAccess: true,
    draft: false,
    context: seedContext,
    data: {
      title: data.title,
      slug: data.demoKey,
      generateSlug: false,
      address: data.address,
      suburb: data.suburb,
      summary: data.summary,
      enabledTrades: data.trades,
      demoKey: data.demoKey,
      type: 'residential',
      projectStatus: 'active',
      showAddressPublicly: false,
      _status: 'published',
    },
  })
  return { id: created.id, title: data.title, created: true }
}

async function seedDemoSwmsDocuments(payload: Payload, projectID: number) {
  const documents = [
    {
      seedKey: 'rosebery-working-at-heights',
      title: 'SWMS - Working at heights',
      trades: ['electrical-mechanical'] as TradeValue[],
      sortOrder: 1,
      filename: 'swms-working-at-heights.pdf',
      pages: [
        [
          'SWMS - Working at heights',
          'Placeholder for the Phase 3 demo.',
          'Page 1 of 2. Not a legal SWMS.',
        ],
        [
          'Keep reading to the bottom of this page.',
          'Confirm only after the last line is visible.',
          'End of SWMS - Working at heights.',
        ],
      ],
    },
    {
      seedKey: 'rosebery-interior-fit-out',
      title: 'SWMS - Interior fit-out',
      trades: ['interior-fitout'] as TradeValue[],
      sortOrder: 2,
      filename: 'swms-interior-fit-out.pdf',
      pages: [
        [
          'SWMS - Interior fit-out',
          'Placeholder for the Phase 3 demo.',
          'Page 1 of 2. Not a legal SWMS.',
        ],
        ['Review this second file after the first.', 'End of SWMS - Interior fit-out.'],
      ],
    },
  ]

  for (const document of documents) {
    await ensureDemoSwmsDocument(payload, document, projectID)
  }
}

async function findOrCreateTemplate(payload: Payload) {
  const name = 'General Construction SWMS (placeholder)'
  const existing = await payload.find({
    collection: 'swms-templates',
    limit: 1,
    overrideAccess: true,
    where: { name: { equals: name } },
  })
  if (existing.docs[0]) return existing.docs[0]

  return payload.create({
    collection: 'swms-templates',
    overrideAccess: true,
    context: seedContext,
    data: {
      name,
      description:
        'Placeholder quiz for Slice D. Not a legal SWMS. Replace the sections with the client’s approved template before site use.',
      status: 'active',
      sections: placeholderSections,
      acknowledgementText,
    },
  })
}

async function ensureProjectSwms(
  payload: Payload,
  args: { title: string; projectID: number; createIfMissing: boolean },
) {
  const existing = await payload.find({
    collection: 'project-swms',
    depth: 0,
    limit: 5,
    overrideAccess: true,
    where: { project: { equals: args.projectID } },
  })
  const current =
    existing.docs.find((doc) => doc.status === 'active' && doc.publicToken) || existing.docs[0]
  if (current) return current
  if (!args.createIfMissing) {
    console.log(`Project ${args.projectID}: project SWMS left absent`)
    return null
  }

  const template = await findOrCreateTemplate(payload)
  const templateSections = snapshotSections(template.sections)
  const draft = await payload.create({
    collection: 'project-swms',
    overrideAccess: true,
    context: seedContext,
    data: {
      title: args.title,
      project: args.projectID,
      sourceTemplate: template.id,
      status: 'draft',
      acknowledgementText: template.acknowledgementText || acknowledgementText,
      ...(templateSections.length ? {} : { sections: placeholderSections }),
    },
  })

  return payload.update({
    collection: 'project-swms',
    id: draft.id,
    overrideAccess: true,
    context: seedContext,
    data: { status: 'active' },
  })
}
