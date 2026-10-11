export const roomSlugs = [
  'kitchen',
  'bathroom',
  'living',
  'bedroom',
  'wardrobe',
  'laundry',
  'home-office',
  'outdoor',
] as const

export type RoomSlug = (typeof roomSlugs)[number]
export type ProjectTypeFilter = 'residential' | 'commercial'

export type ProjectFilters = {
  type?: ProjectTypeFilter
  style?: string
  space?: string
  project?: string
}

type SearchParams = Record<string, string | string[] | undefined>

function one(params: SearchParams, key: string) {
  const value = params[key]
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) return undefined
  const trimmed = raw.trim().toLowerCase()
  if (!/^[a-z0-9-]+$/.test(trimmed)) return undefined
  return trimmed
}

export function parseProjectFilters(params: SearchParams): ProjectFilters {
  const type = one(params, 'type')
  return {
    type: type === 'residential' || type === 'commercial' ? type : undefined,
    style: one(params, 'style'),
    space: one(params, 'space'),
    project: one(params, 'project'),
  }
}

export function hasProjectFilters(filters: ProjectFilters) {
  return Boolean(filters.type || filters.style || filters.space || filters.project)
}

export function projectFilterHref(filters: ProjectFilters, hash?: string) {
  const query = new URLSearchParams()
  if (filters.type) query.set('type', filters.type)
  if (filters.style) query.set('style', filters.style)
  if (filters.space) query.set('space', filters.space)
  if (filters.project) query.set('project', filters.project)
  const search = query.toString()
  return `/projects${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`
}
