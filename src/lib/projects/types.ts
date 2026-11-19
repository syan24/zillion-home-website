export const projectTypeOptions = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Custom Joinery', value: 'joinery' },
] as const

export type ProjectType = (typeof projectTypeOptions)[number]['value']

const projectTypes = new Set<string>(projectTypeOptions.map((option) => option.value))

export function isProjectType(value: string | null | undefined): value is ProjectType {
  return Boolean(value && projectTypes.has(value))
}

/** Gallery link used by each service section. `view=project` selects By Project. */
export function relatedProjectHref(type: ProjectType) {
  return `/projects?view=project&type=${type}`
}

export function relatedProjectHrefForAnchor(anchor: string | null | undefined) {
  if (anchor === 'residential' || anchor === 'commercial' || anchor === 'joinery') {
    return relatedProjectHref(anchor)
  }
  return null
}

export function projectTypeLabel(
  type: string | null | undefined,
  copy: { residential: string; commercial: string; joinery: string },
) {
  if (type === 'commercial') return copy.commercial
  if (type === 'joinery') return copy.joinery
  return copy.residential
}
