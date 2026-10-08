import { getPayload } from 'payload'
import config from '@payload-config'

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

async function seed() {
  const payload = await getPayload({ config })

  const projects = [
    {
      title: 'Rosebery Residence',
      address: '12 Smith Street, Rosebery NSW 2018',
      suburb: 'Rosebery',
      summary: 'Demo project for the SWMS worker flow.',
    },
    {
      title: 'Linfield House',
      address: '8 Highfield Rd, Linfield NSW 2070',
      suburb: 'Linfield',
      summary: 'Demo project for the SWMS project list.',
    },
    {
      title: 'Marrickville Duplex',
      address: '2 Ocean St, Marrickville NSW 2020',
      suburb: 'Marrickville',
      summary: 'Demo project for the SWMS project list.',
    },
  ]

  const projectDocs = []
  for (const project of projects) {
    projectDocs.push(await findOrCreateProject(payload, project))
  }

  const template = await findOrCreateTemplate(payload)

  const titles = ['Construction Works SWMS', 'Site Safety SWMS', 'Fit-out SWMS']
  const links: string[] = []

  for (const [index, project] of projectDocs.entries()) {
    const swms = await findOrCreateProjectSWMS(payload, {
      title: titles[index] || 'Project SWMS',
      projectID: project.id,
      templateID: template.id,
    })
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    links.push(`${project.title}: ${baseUrl}/swms/${swms.publicToken}`)
  }

  console.log('SWMS seed ready.')
  console.log(links.join('\n'))
  console.log(`Project list: ${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/swms`)

  process.exit(0)
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
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: { title: string; address: string; suburb: string; summary: string },
) {
  const existing = await payload.find({
    collection: 'projects',
    limit: 1,
    overrideAccess: true,
    where: { title: { equals: data.title } },
  })
  if (existing.docs[0]) return existing.docs[0]

  return payload.create({
    collection: 'projects',
    overrideAccess: true,
    data: {
      ...data,
      type: 'residential',
      projectStatus: 'active',
      showAddressPublicly: false,
    },
  })
}

async function findOrCreateTemplate(payload: Awaited<ReturnType<typeof getPayload>>) {
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
  payload: Awaited<ReturnType<typeof getPayload>>,
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

try {
  await seed()
} catch (error) {
  console.error(error)
  process.exit(1)
}
