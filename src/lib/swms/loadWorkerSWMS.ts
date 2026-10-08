import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { snapshotSections, type SwmsSectionSnapshot } from '@/lib/swms/content'
import { relationID } from '@/lib/swms/relationID'

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,200}$/

export type WorkerSWMS = {
  token: string
  title: string
  projectName: string
  projectAddress: string
  versionId: number
  versionLabel: string
  sections: SwmsSectionSnapshot[]
  acknowledgementText: string
}

export type ActiveProjectOption = {
  token: string
  swmsTitle: string
  projectName: string
  projectAddress: string
}

export async function loadWorkerSWMS(token: string): Promise<WorkerSWMS | null> {
  if (!TOKEN_PATTERN.test(token)) return null

  const payload = await getPayload({ config: configPromise })
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
    overrideAccess: true,
  })

  const sections = snapshotSections(version.sections)
  if (!sections.length || !project?.title || !project.address) return null

  return {
    token,
    title: doc.title,
    projectName: project.title,
    projectAddress: project.address,
    versionId: version.id,
    versionLabel: version.versionLabel,
    sections,
    acknowledgementText: version.acknowledgementText,
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
        projectName: project.title,
        projectAddress: project.address,
      },
    ]
  })

  return items.sort((a, b) => a.projectName.localeCompare(b.projectName))
}
