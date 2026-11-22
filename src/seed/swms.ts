import type { Payload } from 'payload'

import { buildTextPdf } from '@/lib/swms/demoPdf'
import type { TradeValue } from '@/lib/swms/trades'
import { seedSwmsAcknowledgement } from '@/seed/swmsAcknowledgement'

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
      title: 'Rosebery Residence',
      address: '12 Smith Street, Rosebery NSW 2018',
      suburb: 'Rosebery',
      summary: 'Demo project for the SWMS worker flow.',
      trades: ['electrical-mechanical', 'interior-fitout', 'internal-linings'] as TradeValue[],
    },
    {
      title: 'Linfield House',
      address: '8 Highfield Rd, Linfield NSW 2070',
      suburb: 'Linfield',
      summary: 'Demo project for the SWMS project list.',
      trades: ['structural-concrete', 'plumbing-drainage'] as TradeValue[],
    },
    {
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

  const template = await findOrCreateTemplate(payload)

  const titles = ['Construction Works SWMS', 'Site Safety SWMS', 'Fit-out SWMS']
  const links: string[] = []
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  for (const [index, project] of projectDocs.entries()) {
    const swms = await findOrCreateProjectSWMS(payload, {
      title: titles[index] || 'Project SWMS',
      projectID: project.id,
      templateID: template.id,
    })
    links.push(`${project.title}: ${baseUrl}/swms/${swms.publicToken}`)
  }

  const rosebery = projectDocs[0]
  if (rosebery) await seedDemoSwmsDocuments(payload, rosebery.id)

  await seedSwmsAcknowledgement(payload)
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
  data: { title: string; address: string; suburb: string; summary: string; trades: TradeValue[] },
) {
  const existing = await payload.find({
    collection: 'projects',
    limit: 1,
    overrideAccess: true,
    where: { title: { equals: data.title } },
  })
  const current = existing.docs[0]
  if (current) return ensureDemoTrades(payload, current.id, current.enabledTrades, data.trades)

  return payload.create({
    collection: 'projects',
    overrideAccess: true,
    draft: false,
    context: { disableRevalidate: true },
    data: {
      title: data.title,
      address: data.address,
      suburb: data.suburb,
      summary: data.summary,
      enabledTrades: data.trades,
      type: 'residential',
      projectStatus: 'active',
      showAddressPublicly: false,
      _status: 'published',
    },
  })
}

async function ensureDemoTrades(
  payload: Payload,
  id: number,
  current: unknown,
  trades: TradeValue[],
) {
  if (Array.isArray(current) && current.length > 0) {
    return payload.findByID({ collection: 'projects', id, overrideAccess: true, draft: false })
  }
  return payload.update({
    collection: 'projects',
    id,
    overrideAccess: true,
    draft: false,
    context: { disableRevalidate: true },
    data: { enabledTrades: trades },
  })
}

async function seedDemoSwmsDocuments(payload: Payload, projectID: number) {
  const documents = [
    {
      title: 'SWMS - Working at heights',
      trades: ['electrical-mechanical'] as TradeValue[],
      sortOrder: 1,
      filename: 'swms-working-at-heights.pdf',
      pages: [
        ['SWMS - Working at heights', 'Placeholder for the Phase 3 demo.', 'Page 1 of 2. Not a legal SWMS.'],
        ['Keep reading to the bottom of this page.', 'Confirm only after the last line is visible.', 'End of SWMS - Working at heights.'],
      ],
    },
    {
      title: 'SWMS - Interior fit-out',
      trades: ['interior-fitout'] as TradeValue[],
      sortOrder: 2,
      filename: 'swms-interior-fit-out.pdf',
      pages: [
        ['SWMS - Interior fit-out', 'Placeholder for the Phase 3 demo.', 'Page 1 of 2. Not a legal SWMS.'],
        ['Review this second file after the first.', 'End of SWMS - Interior fit-out.'],
      ],
    },
  ]

  for (const document of documents) {
    const existing = await payload.find({
      collection: 'swms-documents',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        and: [{ title: { equals: document.title } }, { project: { equals: projectID } }],
      },
    })
    if (existing.docs[0]) continue

    const pdf = buildTextPdf(document.pages)
    const file = await payload.create({
      collection: 'swms-files',
      overrideAccess: true,
      data: { alt: document.title },
      file: {
        data: pdf,
        mimetype: 'application/pdf',
        name: document.filename,
        size: pdf.length,
      },
    })
    await payload.create({
      collection: 'swms-documents',
      overrideAccess: true,
      data: {
        title: document.title,
        project: projectID,
        file: file.id,
        trades: document.trades,
        status: 'active',
        sortOrder: document.sortOrder,
      },
    })
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

async function findOrCreateProjectSWMS(
  payload: Payload,
  args: { title: string; projectID: number; templateID: number },
) {
  const existing = await payload.find({
    collection: 'project-swms',
    limit: 1,
    overrideAccess: true,
    where: {
      and: [{ title: { equals: args.title } }, { project: { equals: args.projectID } }],
    },
  })
  const current = existing.docs[0]
  if (current?.status === 'active' && current.publicToken) return current

  const draft =
    current ??
    (await payload.create({
      collection: 'project-swms',
      overrideAccess: true,
      data: {
        title: args.title,
        project: args.projectID,
        sourceTemplate: args.templateID,
        status: 'draft',
        acknowledgementText,
      },
    }))

  if (draft.status === 'active' && draft.publicToken) return draft

  return payload.update({
    collection: 'project-swms',
    id: draft.id,
    overrideAccess: true,
    data: {
      status: 'active',
    },
  })
}

