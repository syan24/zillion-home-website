import { parseParams, type Where } from 'payload'

const SEARCHABLE_FIELDS = [
  'submissionRef',
  'workerName',
  'workerCompany',
  'workerPhone',
  'workerTrade',
]

type ProjectConstraint = {
  ambiguous: boolean
  ids: Set<number>
  seen: boolean
}

export function registerSearchFields(fields: string[] | null | undefined): string[] {
  if (fields && fields.length > 0) return fields
  return SEARCHABLE_FIELDS
}

/**
 * Matches the admin list: the search box is ANDed with the filter drawer `where`.
 * Field list is the collection's `listSearchableFields`.
 */
export function mergeRegisterSearch(fields: string[], search: string, where: Where = {}): Where {
  if (!search) return where

  const or = fields.filter((field) => field.trim() !== '').map((field) => ({
    [field]: { like: search },
  }))
  if (or.length === 0) return where

  const searchWhere: Where = { or }
  if (Object.keys(where).length === 0) return searchWhere
  if (Array.isArray(where.and)) return { and: [...where.and, searchWhere] }
  return { and: [where, searchWhere] }
}

export function registerWhereFromQuery(
  query: Record<string, unknown>,
  searchableFields: string[],
): Where {
  const parsed = parseParams(query)
  const search = typeof query.search === 'string' ? query.search : ''
  return mergeRegisterSearch(searchableFields, search, parsed.where ?? {})
}

export function registerSortFromQuery(query: Record<string, unknown>): string | string[] {
  const parsed = parseParams(query)
  if (Array.isArray(parsed.sort) && parsed.sort.length > 0) return parsed.sort
  return '-signedAt'
}

/** One project id when the filter names exactly one project. Otherwise null. */
export function singleProjectId(where: Where | undefined): number | null {
  const acc: ProjectConstraint = { ambiguous: false, ids: new Set(), seen: false }
  visitWhere(where, acc)
  if (!acc.seen || acc.ambiguous || acc.ids.size !== 1) return null
  return [...acc.ids][0] ?? null
}

function visitWhere(node: unknown, acc: ProjectConstraint) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) visitWhere(item, acc)
    return
  }

  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key === 'and' || key === 'or') {
      visitWhere(value, acc)
      continue
    }
    if (key !== 'project' || !value || typeof value !== 'object' || Array.isArray(value)) continue

    const operator = value as Record<string, unknown>
    const keys = Object.keys(operator)
    acc.seen = true
    if (keys.length === 1 && keys[0] === 'equals') {
      const id = numericId(operator.equals)
      if (id == null) acc.ambiguous = true
      else acc.ids.add(id)
      continue
    }
    if (keys.length === 1 && keys[0] === 'in' && Array.isArray(operator.in)) {
      if (operator.in.length === 0) acc.ambiguous = true
      for (const item of operator.in) {
        const id = numericId(item)
        if (id == null) acc.ambiguous = true
        else acc.ids.add(id)
      }
      continue
    }
    acc.ambiguous = true
  }
}

function numericId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) return value
  if (typeof value === 'string' && /^[1-9]\d*$/.test(value)) return Number(value)
  return null
}
