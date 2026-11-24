import { isProjectType, type ProjectType } from '@/lib/projects/types'

export type ProjectTypeFilter = ProjectType

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
    type: isProjectType(type) ? type : undefined,
    style: one(params, 'style'),
    space: one(params, 'space'),
    project: one(params, 'project'),
  }
}

export function hasProjectFilters(filters: ProjectFilters) {
  return Boolean(filters.type || filters.style || filters.space || filters.project)
}

/** Clicking the active project-type chip clears it. Other chips select that type. */
export function toggleProjectType(filters: ProjectFilters, type: ProjectType): ProjectFilters {
  return {
    ...filters,
    type: filters.type === type ? undefined : type,
    space: undefined,
    project: undefined,
  }
}

/**
 * Style and space filters use the image's own tags.
 * Project tags apply only when the image has none of that kind,
 * so a kitchen filter does not also return that project's living and bedroom images.
 */
export function imageMatchesTerm(
  imageIds: number[],
  projectIds: number[] | undefined,
  termId: number,
) {
  if (imageIds.length > 0) return imageIds.includes(termId)
  return Boolean(projectIds?.includes(termId))
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
