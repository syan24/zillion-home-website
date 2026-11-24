/** @vitest-environment node */
import { revalidatePath } from 'next/cache'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

import { snapshotSections } from '@/lib/swms/content'
import { loadWorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { validateSelectedTrades } from '@/lib/swms/siteSafety'
import { seedSwms } from '@/seed/swms'

const editedQuestion = 'Edited induction question for the consistency check'
const editedSwmsTitle = 'Edited Construction SWMS'
const editedDocTitle = 'Edited SWMS heights title'
const editedAddress = '99 Edited Street, Rosebery NSW 2018'
const editedZhTitle = '玫瑰湾住宅（已编辑）'

let payload: Payload
let restore: (() => Promise<void>) | null = null

describe('SWMS seed keeps editor values', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
    await seedSwms(payload)
  }, 180000)

  afterAll(async () => {
    if (restore) await restore()
  })

  it('keeps cleared trades, renamed documents, and edited questions across two seeds', async () => {
    const project = await projectByKey('rosebery-residence')
    const swms = await projectSwms(project.id)
    const document = await documentByKey('rosebery-working-at-heights', project.id)
    const template = await placeholderTemplate()
    const original = {
      address: project.address,
      trades: project.enabledTrades,
      zh: await zhTitle(project.id),
      swmsTitle: swms.title,
      sections: swms.sections,
      acknowledgement: swms.acknowledgementText,
      status: swms.status,
      docTitle: document.title,
      docTrades: document.trades,
      docStatus: document.status,
      templateDescription: template.description,
    }
    const token = swms.publicToken
    const fileVersion = document.fileVersion
    const accessToken = document.accessToken
    const fileID = document.file
    if (!token || !accessToken) throw new Error('Rosebery SWMS is missing its public token')
    const linfield = await projectByKey('linfield-house')
    const linfieldAddress = linfield.address
    const linfieldTrades = linfield.enabledTrades
    restore = async () => {
      await payload.update({
        collection: 'projects',
        id: project.id,
        overrideAccess: true,
        draft: false,
        locale: 'en',
        data: {
          title: 'Rosebery Residence',
          address: original.address,
          enabledTrades: original.trades ?? [],
        },
      })
      if (original.zh) {
        await payload.update({
          collection: 'projects',
          id: project.id,
          overrideAccess: true,
          draft: false,
          locale: 'zh',
          data: { title: original.zh },
        })
      }
      await payload.update({
        collection: 'project-swms',
        id: swms.id,
        overrideAccess: true,
        data: {
          title: original.swmsTitle,
          sections: original.sections,
          acknowledgementText: original.acknowledgement,
          status: original.status,
        },
      })
      await payload.update({
        collection: 'swms-documents',
        id: document.id,
        overrideAccess: true,
        data: { title: original.docTitle, trades: original.docTrades, status: original.docStatus },
      })
      await payload.update({
        collection: 'swms-templates',
        id: template.id,
        overrideAccess: true,
        data: { description: original.templateDescription },
      })
      await payload.update({
        collection: 'projects',
        id: linfield.id,
        overrideAccess: true,
        draft: false,
        data: { enabledTrades: linfieldTrades ?? [], address: linfieldAddress },
      })
    }

    vi.mocked(revalidatePath).mockClear()
    await payload.update({
      collection: 'projects',
      id: project.id,
      overrideAccess: true,
      draft: false,
      locale: 'en',
      data: { title: 'Rosebery Residence Edited', address: editedAddress, enabledTrades: [] },
    })
    expect(revalidatePath).toHaveBeenCalledWith('/swms')
    expect(revalidatePath).toHaveBeenCalledWith(`/swms/${token}`, 'layout')

    await payload.update({
      collection: 'projects',
      id: project.id,
      overrideAccess: true,
      draft: false,
      locale: 'zh',
      data: { title: editedZhTitle },
    })
    await payload.update({
      collection: 'project-swms',
      id: swms.id,
      overrideAccess: true,
      data: {
        title: editedSwmsTitle,
        sections: editedSections(swms.sections),
      },
    })
    await payload.update({
      collection: 'swms-documents',
      id: document.id,
      overrideAccess: true,
      data: { title: editedDocTitle, trades: ['landscaping'], status: 'archived' },
    })
    await payload.update({
      collection: 'swms-templates',
      id: template.id,
      overrideAccess: true,
      data: { description: 'Template edit that workers must not see' },
    })

    await payload.update({
      collection: 'projects',
      id: linfield.id,
      overrideAccess: true,
      draft: false,
      data: { demoKey: null, enabledTrades: [], address: '1 Kept Address, Linfield NSW 2070' },
    })

    await seedSwms(payload)
    await seedSwms(payload)

    const keptProject = await projectByKey('rosebery-residence')
    expect(keptProject.id).toBe(project.id)
    expect(keptProject.enabledTrades ?? []).toEqual([])
    expect(keptProject.address).toBe(editedAddress)
    expect(await zhTitle(project.id)).toBe(editedZhTitle)
    const titles = await payload.find({
      collection: 'projects',
      depth: 0,
      draft: false,
      limit: 10,
      overrideAccess: true,
      where: { title: { equals: 'Rosebery Residence' } },
    })
    expect(titles.totalDocs).toBe(0)

    const keptSwms = await payload.findByID({
      collection: 'project-swms',
      id: swms.id,
      depth: 0,
      overrideAccess: true,
    })
    expect(keptSwms.title).toBe(editedSwmsTitle)
    expect(keptSwms.status).toBe('active')
    expect(keptSwms.publicToken).toBe(token)
    expect(snapshotSections(keptSwms.sections)[0]?.questions[0]?.question).toBe(editedQuestion)

    const keptTemplate = await payload.findByID({
      collection: 'swms-templates',
      id: template.id,
      depth: 0,
      overrideAccess: true,
    })
    expect(keptTemplate.description).toBe('Template edit that workers must not see')

    const keptDoc = await documentByKey('rosebery-working-at-heights', project.id)
    expect(keptDoc.id).toBe(document.id)
    expect(keptDoc.title).toBe(editedDocTitle)
    expect(keptDoc.trades).toEqual(['landscaping'])
    expect(keptDoc.status).toBe('archived')
    expect(keptDoc.fileVersion).toBe(fileVersion)
    expect(keptDoc.accessToken).toBe(accessToken)
    expect(keptDoc.file).toBe(fileID)
    const duplicates = await payload.find({
      collection: 'swms-documents',
      depth: 0,
      limit: 10,
      overrideAccess: true,
      where: {
        and: [
          { seedKey: { equals: 'rosebery-working-at-heights' } },
          { project: { equals: project.id } },
        ],
      },
    })
    expect(duplicates.totalDocs).toBe(1)

    const worker = await loadWorkerSWMS(token)
    expect(worker?.projectName).toBe('Rosebery Residence Edited')
    expect(worker?.projectNameZh).toBe(editedZhTitle)
    expect(worker?.projectAddress).toBe(editedAddress)
    expect(worker?.title).toBe(editedSwmsTitle)
    expect(worker?.enabledTrades).toEqual([])
    expect(worker?.sections[0]?.questions[0]?.question).toBe(editedQuestion)
    expect(worker?.documents.some((item) => item.title === editedDocTitle)).toBe(false)
    expect(validateSelectedTrades(['landscaping'], worker?.enabledTrades ?? []).ok).toBe(false)

    const keptLinfield = await projectByKey('linfield-house')
    expect(keptLinfield.id).toBe(linfield.id)
    expect(keptLinfield.enabledTrades ?? []).toEqual([])
    expect(keptLinfield.address).toBe('1 Kept Address, Linfield NSW 2070')
    expect(keptLinfield.demoKey).toBe('linfield-house')
  }, 180000)
})

describe('workers read the published project', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
  })

  it('ignores an unpublished title and still opens a project that was never published', async () => {
    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const publishedTitle = `Published ${stamp}`
    const draftTitle = `Draft ${stamp}`
    const project = await payload.create({
      collection: 'projects',
      overrideAccess: true,
      draft: false,
      data: {
        title: publishedTitle,
        address: `1 Published St ${stamp}, Sydney NSW 2000`,
        type: 'residential',
        projectStatus: 'active',
        showAddressPublicly: false,
        enabledTrades: ['electrical-mechanical'],
        _status: 'published',
      },
    })
    const token = await activateSwms(project.id, stamp, 'Published question')

    await payload.update({
      collection: 'projects',
      id: project.id,
      overrideAccess: true,
      draft: true,
      data: { title: draftTitle },
    })
    expect((await loadWorkerSWMS(token))?.projectName).toBe(publishedTitle)

    await payload.update({
      collection: 'projects',
      id: project.id,
      overrideAccess: true,
      draft: false,
      data: { title: draftTitle, enabledTrades: [] },
    })
    const published = await loadWorkerSWMS(token)
    expect(published?.projectName).toBe(draftTitle)
    expect(published?.enabledTrades).toEqual([])

    const onlyDraft = await payload.create({
      collection: 'projects',
      overrideAccess: true,
      draft: true,
      data: {
        title: `Never published ${stamp}`,
        address: `2 Draft St ${stamp}, Sydney NSW 2000`,
        type: 'residential',
        projectStatus: 'active',
        showAddressPublicly: false,
        enabledTrades: ['landscaping'],
        _status: 'draft',
      },
    })
    const draftToken = await activateSwms(onlyDraft.id, `${stamp}-draft`, 'Draft question')
    const opened = await loadWorkerSWMS(draftToken)
    expect(opened?.projectName).toBe(`Never published ${stamp}`)
    expect(opened?.enabledTrades).toEqual(['landscaping'])
  }, 120000)
})

async function projectByKey(demoKey: string) {
  const found = await payload.find({
    collection: 'projects',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: { demoKey: { equals: demoKey } },
  })
  const project = found.docs[0]
  if (!project) throw new Error(`Missing demo project ${demoKey}`)
  return project
}

async function zhTitle(id: number) {
  const project = await payload.findByID({
    collection: 'projects',
    id,
    depth: 0,
    draft: false,
    locale: 'zh',
    fallbackLocale: false,
    overrideAccess: true,
  })
  return typeof project.title === 'string' ? project.title : ''
}

async function projectSwms(projectID: number) {
  const found = await payload.find({
    collection: 'project-swms',
    depth: 0,
    limit: 5,
    overrideAccess: true,
    where: { project: { equals: projectID } },
  })
  const swms = found.docs.find((doc) => doc.status === 'active') || found.docs[0]
  if (!swms) throw new Error('Missing project SWMS')
  return swms
}

async function documentByKey(seedKey: string, projectID: number) {
  const found = await payload.find({
    collection: 'swms-documents',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [{ seedKey: { equals: seedKey } }, { project: { equals: projectID } }],
    },
  })
  const document = found.docs[0]
  if (!document) throw new Error(`Missing SWMS document ${seedKey}`)
  return document
}

async function placeholderTemplate() {
  const found = await payload.find({
    collection: 'swms-templates',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { name: { equals: 'General Construction SWMS (placeholder)' } },
  })
  const template = found.docs[0]
  if (!template) throw new Error('Missing placeholder SWMS template')
  return template
}

function editedSections(sections: unknown) {
  const snapshot = snapshotSections(sections)
  const [first, ...rest] = snapshot
  if (!first?.questions[0]) throw new Error('Rosebery SWMS has no question to edit')
  return [
    {
      ...first,
      questions: [{ ...first.questions[0], question: editedQuestion }, ...first.questions.slice(1)],
    },
    ...rest,
  ]
}

async function activateSwms(projectID: number, stamp: string, question: string) {
  const draft = await payload.create({
    collection: 'project-swms',
    overrideAccess: true,
    data: {
      title: `SWMS ${stamp}`,
      project: projectID,
      status: 'draft',
      acknowledgementText: 'Test acknowledgement',
      sections: [
        {
          title: 'Induction',
          content: 'Placeholder',
          questions: [{ question, type: 'yes-no', required: true, correctAnswer: 'yes' }],
        },
      ],
    },
  })
  await payload.update({
    collection: 'project-swms',
    id: draft.id,
    overrideAccess: true,
    data: { status: 'active' },
  })
  const active = await payload.findByID({
    collection: 'project-swms',
    id: draft.id,
    depth: 0,
    overrideAccess: true,
  })
  if (!active.publicToken) throw new Error('SWMS did not publish a token')
  return active.publicToken
}
