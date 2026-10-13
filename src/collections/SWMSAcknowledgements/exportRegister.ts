import {
  APIError,
  type PayloadHandler,
  type PayloadRequest,
  type Where,
} from 'payload'

import { relationID } from '@/lib/swms/relationID'
import {
  displayText,
  registerFilename,
  toRegisterCsv,
  type RegisterCsvRow,
} from '@/lib/swms/registerCsv'
import {
  registerSearchFields,
  registerSortFromQuery,
  registerWhereFromQuery,
  singleProjectId,
} from '@/lib/swms/registerQuery'

const PAGE_SIZE = 200
const MAX_PAGES = 500

type LabelDoc = {
  id: number
  title?: unknown
  versionLabel?: unknown
}

export const exportSWMSRegister: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json(
      { errors: [{ message: 'You must be logged in to export the SWMS register.' }] },
      { status: 401 },
    )
  }

  try {
    const searchable = registerSearchFields(
      req.payload.collections['swms-acknowledgements']?.config.admin?.listSearchableFields,
    )
    const where = registerWhereFromQuery(req.query, searchable)
    const sort = registerSortFromQuery(req.query)
    const rows = await loadRows(req, where, sort)
    const filename = await filenameFor(req, where)
    const csv = toRegisterCsv(rows)

    return new Response(csv, {
      headers: {
        'Cache-Control': 'private, no-store',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'text/csv; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
      status: 200,
    })
  } catch (error) {
    if (error instanceof APIError) {
      return Response.json(
        { errors: [{ message: error.message }] },
        { status: error.status || 400 },
      )
    }
    console.error('SWMS register export failed', error)
    return Response.json(
      { errors: [{ message: 'The register could not be exported.' }] },
      { status: 500 },
    )
  }
}

async function loadRows(
  req: PayloadRequest,
  where: Where,
  sort: string | string[],
): Promise<RegisterCsvRow[]> {
  const docs = []
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const result = await req.payload.find({
      collection: 'swms-acknowledgements',
      depth: 0,
      limit: PAGE_SIZE,
      overrideAccess: false,
      page,
      pagination: true,
      req,
      select: {
        acknowledgementAccepted: true,
        project: true,
        projectSwms: true,
        signedAt: true,
        submissionRef: true,
        swmsVersion: true,
        workerCompany: true,
        workerName: true,
        workerPhone: true,
        workerTrade: true,
      },
      sort,
      user: req.user,
      where,
    })
    docs.push(...result.docs)
    if (!result.hasNextPage) break
  }

  const projectIds = uniqueIds(docs.map((doc) => relationID(doc.project)))
  const swmsIds = uniqueIds(docs.map((doc) => relationID(doc.projectSwms)))
  const versionIds = uniqueIds(docs.map((doc) => relationID(doc.swmsVersion)))

  const [projects, projectSwms, versions] = await Promise.all([
    labels(req, 'projects', projectIds, 'title'),
    labels(req, 'project-swms', swmsIds, 'title'),
    labels(req, 'swms-versions', versionIds, 'versionLabel'),
  ])

  return docs.map((doc) => ({
    acknowledgementAccepted: doc.acknowledgementAccepted === true,
    project: projects.get(relationID(doc.project) ?? -1) ?? '',
    projectSwms: projectSwms.get(relationID(doc.projectSwms) ?? -1) ?? '',
    signedAt: doc.signedAt || '',
    submissionRef: doc.submissionRef || '',
    version: versions.get(relationID(doc.swmsVersion) ?? -1) ?? '',
    workerCompany: doc.workerCompany || '',
    workerName: doc.workerName || '',
    workerPhone: doc.workerPhone || '',
    workerTrade: doc.workerTrade || '',
  }))
}

async function labels(
  req: PayloadRequest,
  collection: 'projects' | 'project-swms' | 'swms-versions',
  ids: number[],
  field: 'title' | 'versionLabel',
): Promise<Map<number, string>> {
  const map = new Map<number, string>()
  if (ids.length === 0) return map

  const result = await req.payload.find({
    collection,
    depth: 0,
    limit: ids.length,
    overrideAccess: false,
    pagination: false,
    req,
    select: { [field]: true },
    user: req.user,
    where: { id: { in: ids } },
  })

  for (const doc of result.docs as LabelDoc[]) {
    map.set(doc.id, displayText(doc[field]))
  }
  return map
}

async function filenameFor(req: PayloadRequest, where: Where): Promise<string> {
  const projectId = singleProjectId(where)
  if (projectId == null) return registerFilename(null)

  try {
    const project = await req.payload.findByID({
      collection: 'projects',
      id: projectId,
      depth: 0,
      overrideAccess: false,
      req,
      select: { title: true },
      user: req.user,
    })
    return registerFilename(displayText(project.title))
  } catch {
    return registerFilename(null)
  }
}

function uniqueIds(ids: Array<number | null>): number[] {
  return [...new Set(ids.filter((id): id is number => id != null))]
}
