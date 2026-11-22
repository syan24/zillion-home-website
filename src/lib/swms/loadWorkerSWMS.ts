import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { displayText } from '@/lib/swms/registerCsv'
import { snapshotSections, type SwmsSectionSnapshot } from '@/lib/swms/content'
import { relationID } from '@/lib/swms/relationID'
import { isTradeValue, type TradeValue } from '@/lib/swms/trades'

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,200}$/

export type WorkerSwmsDocument = {
  accessToken: string
  title: string
  trades: TradeValue[]
  fileVersion: number
  versionLabel: string
}

export type WorkerSWMS = {
  token: string
  title: string
  projectName: string
  projectNameZh: string
  projectAddress: string
  versionId: number
  versionLabel: string
  sections: SwmsSectionSnapshot[]
  acknowledgementText: string
  enabledTrades: TradeValue[]
  documents: WorkerSwmsDocument[]
}

export type ActiveSwms = WorkerSWMS & {
  projectId: number
  projectSwmsId: number
}

export type ActiveProjectOption = {
  token: string
  swmsTitle: string
  projectName: string
  projectAddress: string
}

export async function loadWorkerSWMS(token: string): Promise<WorkerSWMS | null> {
  const payload = await getPayload({ config: configPromise })
  const site = await loadActiveSwms(payload, token)
  if (!site) return null
  return {
    token: site.token,
    title: site.title,
    projectName: site.projectName,
    projectNameZh: site.projectNameZh,
    projectAddress: site.projectAddress,
    versionId: site.versionId,
    versionLabel: site.versionLabel,
    sections: site.sections,
    acknowledgementText: site.acknowledgementText,
    enabledTrades: site.enabledTrades,
    documents: site.documents,
  }
}

export async function loadActiveSwms(payload: Payload, token: string): Promise<ActiveSwms | null> {
  if (!TOKEN_PATTERN.test(token)) return null

  const found = await payload.find({
    collection: 'project-swms',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [{ publicToken: { equals: token } }, { status: { equals: 'active' } }],
    },
  })

  const doc = found.docs[0]
  if (!doc) return null

  const versionID = relationID(doc.currentVersion)
  const projectID = relationID(doc.project)
  if (!versionID || !projectID) return null

  const version = await payload.findByID({
    collection: 'swms-versions',
    id: versionID,
    depth: 0,
    overrideAccess: true,
  })
  if (!version || version.status !== 'published') return null

  const project = await payload.findByID({
    collection: 'projects',
    id: projectID,
    depth: 0,
    locale: 'all',
    overrideAccess: true,
  })

  const sections = snapshotSections(version.sections)
  const projectName = displayText(project?.title)
  const projectAddress = typeof project?.address === 'string' ? project.address : ''
  if (!sections.length || !projectName || !projectAddress) return null

  const documents = await payload.find({
    collection: 'swms-documents',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    sort: 'sortOrder',
    where: {
      and: [{ project: { equals: projectID } }, { status: { equals: 'active' } }],
    },
  })

  return {
    token,
    title: doc.title,
    projectId: projectID,
    projectSwmsId: doc.id,
    projectName,
    projectNameZh: localizedText(project?.title, 'zh'),
    projectAddress,
    versionId: version.id,
    versionLabel: version.versionLabel,
    sections,
    acknowledgementText: version.acknowledgementText,
    enabledTrades: asTrades(project?.enabledTrades),
    documents: documents.docs.flatMap((item) => {
      if (!item.accessToken || typeof item.fileVersion !== 'number') return []
      return [
        {
          accessToken: item.accessToken,
          title: item.title,
          trades: asTrades(item.trades),
          fileVersion: item.fileVersion,
          versionLabel: item.versionLabel || `v${item.fileVersion}`,
        },
      ]
    }),
  }
}

export async function listActiveWorkerProjects(): Promise<ActiveProjectOption[]> {
  const payload = await getPayload({ config: configPromise })
  const found = await payload.find({
    collection: 'project-swms',
    depth: 1,
    limit: 100,
    overrideAccess: true,
    sort: 'title',
    where: {
      status: { equals: 'active' },
    },
  })

  const items = found.docs.flatMap((doc) => {
    if (!doc.publicToken || !doc.currentVersion) return []
    const project = doc.project
    if (!project || typeof project !== 'object') return []

    return [
      {
        token: doc.publicToken,
        swmsTitle: doc.title,
        projectName: displayText(project.title),
        projectAddress: project.address,
      },
    ]
  })

  return items.sort((a, b) => a.projectName.localeCompare(b.projectName))
}

function asTrades(value: unknown): TradeValue[] {
  if (!Array.isArray(value)) return []
  return value.filter(isTradeValue)
}

function localizedText(value: unknown, locale: 'en' | 'zh'): string {
  if (!value || typeof value !== 'object') return ''
  const text = (value as Record<string, unknown>)[locale]
  return typeof text === 'string' ? text.trim() : ''
}
