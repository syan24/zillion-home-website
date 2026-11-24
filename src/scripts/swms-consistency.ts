import { readFile, writeFile } from 'fs/promises'

import { getPayload, type Payload } from 'payload'

import config from '@payload-config'
import type { ProjectSwm } from '@/payload-types'
import { seedSwms } from '@/seed/swms'

const statePath = '/tmp/swms-consistency.json'

const editedQuestion = 'Edited induction question for the consistency check'
const editedDocTitle = 'Edited fit-out title'
const editedAddress = '99 Edited Street, Rosebery NSW 2018'
const editedZhTitle = '玫瑰湾住宅（已编辑）'
const editedSwmsTitle = 'Edited Construction SWMS'

type State = {
  token: string
  fitoutToken: string
  address: string
  zh: string
  swmsTitle: string
  question: string
  docTitle: string
  hiddenTitle: string
  projectId: number
  swmsId: number
  fitoutId: number
  heightsId: number
  original: {
    address: string
    trades: Project['trades']
    zh: string
    swmsTitle: string
    sections: ProjectSwm['sections']
    acknowledgement: string
    fitoutTitle: string
    fitoutTrades: SwmsDoc['trades']
    heightsTitle: string
    heightsTrades: SwmsDoc['trades']
    heightsStatus: SwmsDoc['status']
  }
}

type Project = {
  trades:
    | (
        | 'siteworks-demolition'
        | 'structural-concrete'
        | 'roofing-external'
        | 'plumbing-drainage'
        | 'electrical-mechanical'
        | 'internal-linings'
        | 'interior-fitout'
        | 'landscaping'
      )[]
    | null
    | undefined
}

type SwmsDoc = {
  trades: Project['trades']
  status: 'active' | 'archived'
}

const payload = await getPayload({ config })
const mode = process.env.SWMS_CHECK || 'mutate'

if (mode === 'mutate') await mutate(payload)
else if (mode === 'clear-trades') await clearTrades(payload)
else if (mode === 'reseed') {
  await seedSwms(payload)
  await seedSwms(payload)
  console.log('swms consistency: reseeded twice')
} else if (mode === 'restore') await restore(payload)
else throw new Error(`Unknown SWMS_CHECK mode ${mode}`)

process.exit(0)

async function mutate(payload: Payload) {
  await seedSwms(payload)
  const project = await one(payload, 'projects', { demoKey: { equals: 'rosebery-residence' } })
  const swms = await one(payload, 'project-swms', { project: { equals: project.id } })
  const fitout = await one(payload, 'swms-documents', {
    and: [
      { seedKey: { equals: 'rosebery-interior-fit-out' } },
      { project: { equals: project.id } },
    ],
  })
  const heights = await one(payload, 'swms-documents', {
    and: [
      { seedKey: { equals: 'rosebery-working-at-heights' } },
      { project: { equals: project.id } },
    ],
  })
  if (!swms.publicToken || !fitout.accessToken)
    throw new Error('Rosebery SWMS is missing a public token')

  const zh = await zhTitle(payload, project.id)
  const state: State = {
    token: swms.publicToken,
    fitoutToken: fitout.accessToken,
    address: editedAddress,
    zh: editedZhTitle,
    swmsTitle: editedSwmsTitle,
    question: editedQuestion,
    docTitle: editedDocTitle,
    hiddenTitle: heights.title,
    projectId: project.id,
    swmsId: swms.id,
    fitoutId: fitout.id,
    heightsId: heights.id,
    original: {
      address: project.address,
      trades: project.enabledTrades,
      zh,
      swmsTitle: swms.title,
      sections: swms.sections,
      acknowledgement: swms.acknowledgementText,
      fitoutTitle: fitout.title,
      fitoutTrades: fitout.trades,
      heightsTitle: heights.title,
      heightsTrades: heights.trades,
      heightsStatus: heights.status,
    },
  }

  await payload.update({
    collection: 'projects',
    id: project.id,
    overrideAccess: true,
    draft: false,
    locale: 'en',
    data: { address: editedAddress, enabledTrades: ['landscaping'] },
  })
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
    data: { title: editedSwmsTitle, sections: withQuestion(swms.sections, editedQuestion) },
  })
  await payload.update({
    collection: 'swms-documents',
    id: fitout.id,
    overrideAccess: true,
    data: { title: editedDocTitle },
  })
  await payload.update({
    collection: 'swms-documents',
    id: heights.id,
    overrideAccess: true,
    data: { status: 'archived' },
  })

  await writeFile(statePath, JSON.stringify(state))
  console.log(`swms consistency: mutated ${state.token}`)
}

async function clearTrades(payload: Payload) {
  const state = await readState()
  await payload.update({
    collection: 'projects',
    id: state.projectId,
    overrideAccess: true,
    draft: false,
    data: { enabledTrades: [] },
  })
  console.log('swms consistency: trades cleared')
}

async function restore(payload: Payload) {
  const state = await readState()
  const original = state.original
  await payload.update({
    collection: 'projects',
    id: state.projectId,
    overrideAccess: true,
    draft: false,
    locale: 'en',
    data: { address: original.address, enabledTrades: original.trades ?? [] },
  })
  if (original.zh) {
    await payload.update({
      collection: 'projects',
      id: state.projectId,
      overrideAccess: true,
      draft: false,
      locale: 'zh',
      data: { title: original.zh },
    })
  }
  await payload.update({
    collection: 'project-swms',
    id: state.swmsId,
    overrideAccess: true,
    data: {
      title: original.swmsTitle,
      sections: original.sections,
      acknowledgementText: original.acknowledgement,
    },
  })
  await payload.update({
    collection: 'swms-documents',
    id: state.fitoutId,
    overrideAccess: true,
    data: { title: original.fitoutTitle, trades: original.fitoutTrades ?? undefined },
  })
  await payload.update({
    collection: 'swms-documents',
    id: state.heightsId,
    overrideAccess: true,
    data: {
      title: original.heightsTitle,
      trades: original.heightsTrades ?? undefined,
      status: original.heightsStatus,
    },
  })
  console.log('swms consistency: restored')
}

async function readState(): Promise<State> {
  return JSON.parse(await readFile(statePath, 'utf8')) as State
}

async function zhTitle(payload: Payload, id: number) {
  const project = await payload.findByID({
    collection: 'projects',
    id,
    depth: 0,
    draft: false,
    locale: 'zh',
    fallbackLocale: false,
    overrideAccess: true,
  })
  return project.title || ''
}

async function one<T extends 'projects' | 'project-swms' | 'swms-documents'>(
  payload: Payload,
  collection: T,
  where: Record<string, unknown>,
) {
  const found = await payload.find({
    collection,
    depth: 0,
    ...(collection === 'projects' ? { draft: false } : {}),
    limit: 1,
    overrideAccess: true,
    where: where as never,
  })
  const doc = found.docs[0]
  if (!doc) throw new Error(`Missing ${collection} row`)
  return doc
}

function withQuestion(sections: ProjectSwm['sections'], question: string): ProjectSwm['sections'] {
  const first = sections?.[0]
  const questions = first?.questions ?? []
  const current = questions[0]
  if (!first || !current) throw new Error('SWMS has no question to edit')
  return [
    { ...first, questions: [{ ...current, question }, ...questions.slice(1)] },
    ...sections.slice(1),
  ]
}
