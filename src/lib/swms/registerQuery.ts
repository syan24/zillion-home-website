import { parseParams, type Where } from 'payload'

import { filenameSource } from '@/lib/swms/registerCsv'
import { relationID } from '@/lib/swms/relationID'

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
  labels: Set<string>
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

export function rawRegisterWhere(query: Record<string, unknown> | null | undefined): Where {
  const parsed = parseParams(query ?? {})
  return parsed.where ?? {}
}

export function registerWhereFromQuery(
  query: Record<string, unknown>,
  searchableFields: string[],
): Where {
  const search = typeof query.search === 'string' ? query.search : ''
  return mergeRegisterSearch(searchableFields, search, coerceRegisterWhere(rawRegisterWhere(query)))
}

export function registerSortFromQuery(query: Record<string, unknown>): string | string[] {
  const parsed = parseParams(query)
  if (Array.isArray(parsed.sort) && parsed.sort.length > 0) return parsed.sort
  return '-signedAt'
}

const RELATION_FIELDS = new Set(['project', 'projectSwms', 'swmsVersion', 'project.id'])

export type ProjectFilenameHint = {
  id: number | null
  /** Title or slug carried on the filter, used when the project record cannot be loaded. */
  label: string | null
}

/**
 * One project when the filter names exactly one.
 * Admin relationship filters often send the id nested (`{ id }` / `{ value }`) or under a
 * bracket key left by a shallow query parse (`[equals]`). A title-only constraint still counts.
 */
export function projectFilenameHint(where: Where | undefined): ProjectFilenameHint {
  const acc: ProjectConstraint = {
    ambiguous: false,
    ids: new Set(),
    labels: new Set(),
    seen: false,
  }
  visitWhere(where, acc)
  if (!acc.seen || acc.ambiguous) return { id: null, label: null }
  const label = acc.labels.size === 1 ? ([...acc.labels][0] ?? null) : null
  if (acc.ids.size === 1) return { id: [...acc.ids][0] ?? null, label }
  if (acc.ids.size === 0 && label) return { id: null, label }
  return { id: null, label: null }
}

/** One project id when the filter names exactly one project. Otherwise null. */
export function singleProjectId(where: Where | undefined): number | null {
  return projectFilenameHint(where).id
}

/**
 * Turns populated relationship values and `[equals]` keys into ids Payload can query.
 * Title and slug constraints are left as they are.
 */
export function coerceRegisterWhere<T>(where: T): T {
  return coerceNode(where) as T
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
    if (key !== 'project' && key !== 'project.id' && key !== 'project.title' && key !== 'project.slug') {
      continue
    }
    noteProject(key, value, acc)
  }
}

function noteProject(path: string, value: unknown, acc: ProjectConstraint) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    acc.seen = true
    acc.ambiguous = true
    return
  }

  const operator = normalizeOperators(value as Record<string, unknown>)
  const keys = Object.keys(operator)
  acc.seen = true

  if (path === 'project.title' || path === 'project.slug') {
    noteLabelOperator(operator, keys, acc)
    return
  }

  if (keys.length === 1 && keys[0] === 'equals') {
    noteEquals(operator.equals, acc)
    return
  }
  if (keys.length === 1 && keys[0] === 'in' && Array.isArray(operator.in)) {
    if (operator.in.length === 0) acc.ambiguous = true
    for (const item of operator.in) noteEquals(item, acc)
    return
  }
  if (keys.length === 1 && (keys[0] === 'id' || keys[0] === 'title' || keys[0] === 'slug')) {
    const nestedPath = keys[0] === 'id' ? 'project.id' : `project.${keys[0]}`
    noteProject(nestedPath, operator[keys[0]], acc)
    return
  }

  const bareId = positiveId(operator)
  if (bareId != null) {
    acc.ids.add(bareId)
    const label = labelFromRelation(operator)
    if (label) acc.labels.add(label)
    return
  }

  acc.ambiguous = true
}

function noteEquals(value: unknown, acc: ProjectConstraint) {
  const id = positiveId(value)
  if (id == null) {
    acc.ambiguous = true
    return
  }
  acc.ids.add(id)
  const label = labelFromRelation(value)
  if (label) acc.labels.add(label)
}

function noteLabelOperator(
  operator: Record<string, unknown>,
  keys: string[],
  acc: ProjectConstraint,
) {
  if (keys.length === 1 && keys[0] === 'equals') {
    const label = filenameSource(operator.equals)
    if (!label) acc.ambiguous = true
    else acc.labels.add(label)
    return
  }
  acc.ambiguous = true
}

function labelFromRelation(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  return filenameSource(record.title, record.slug)
}

function positiveId(value: unknown): number | null {
  const fromValue = value && typeof value === 'object' ? idFromValueField(value) : null
  const id = fromValue ?? relationID(value)
  if (id == null || !Number.isInteger(id) || id <= 0) return null
  return id
}

function idFromValueField(value: object): number | null {
  if (!('value' in value)) return null
  return relationID((value as { value: unknown }).value)
}

function normalizeOperators(value: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value)) {
    const name = key.startsWith('[') && key.endsWith(']') ? key.slice(1, -1) : key
    out[name] = child
  }
  return out
}

function coerceNode(node: unknown): unknown {
  if (Array.isArray(node)) return node.map((item) => coerceNode(item))
  if (!node || typeof node !== 'object') return node

  const source = node as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(source)) {
    if (key === 'and' || key === 'or') {
      out[key] = coerceNode(value)
      continue
    }
    if (!RELATION_FIELDS.has(key) || !value || typeof value !== 'object' || Array.isArray(value)) {
      out[key] = value
      continue
    }
    const dest = key === 'project.id' ? 'project' : key
    const coerced = coerceRelationOperators(normalizeOperators(value as Record<string, unknown>))
    if (dest === 'project' && out.project && typeof out.project === 'object') {
      out.project = { ...(out.project as Record<string, unknown>), ...coerced }
    } else {
      out[dest] = coerced
    }
  }
  return out
}

function coerceRelationOperators(operator: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(operator)) {
    if (key === 'equals') {
      out.equals = positiveId(value) ?? value
      continue
    }
    if ((key === 'in' || key === 'not_in') && Array.isArray(value)) {
      out[key] = value.map((item) => positiveId(item) ?? item)
      continue
    }
    if (key === 'id' && value && typeof value === 'object' && !Array.isArray(value)) {
      const nested = normalizeOperators(value as Record<string, unknown>)
      if ('equals' in nested) {
        out.equals = positiveId(nested.equals) ?? nested.equals
        continue
      }
    }
    out[key] = value
  }
  return out
}
