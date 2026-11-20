import { imageMatchesTerm, type ProjectFilters } from '@/lib/projects/filters'
import type { ProjectType } from '@/lib/projects/types'

export type ProjectCardSource = {
  slug: string
  title: string
  type: ProjectType
  location: string | null
  styleIds: number[]
  /** Style ids on each published gallery image. An empty list means that image has no style tag. */
  imageStyles: number[][]
  coverSrc: string | null
  coverAlt: string
}

/**
 * Cover cards for By Project.
 * Projects without a cover image are omitted. A selected type with no matching covers returns an empty list.
 */
export function selectProjectCards(
  projects: readonly ProjectCardSource[],
  filters: ProjectFilters,
  styleTermId: number | undefined,
): ProjectCardSource[] {
  if (filters.style && styleTermId == null) return []
  return projects.filter((project) => {
    if (!project.coverSrc) return false
    if (filters.type && project.type !== filters.type) return false
    if (filters.project && project.slug !== filters.project) return false
    if (styleTermId == null) return true
    if (project.styleIds.includes(styleTermId)) return true
    return project.imageStyles.some((imageStyleIds) =>
      imageMatchesTerm(imageStyleIds, project.styleIds, styleTermId),
    )
  })
}

export function galleryMode(view: string | undefined, filters: ProjectFilters): 'project' | 'room' {
  if (view === 'project') return 'project'
  if (view === 'room' || Boolean(filters.space)) return 'room'
  return 'project'
}
