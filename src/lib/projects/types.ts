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

export type ProjectTypeChoice = {
  value?: string | null
  label?: string | null
  active?: boolean | null
}

/** Chips and filters follow the saved order and hide types an editor turned off. */
export function visibleProjectTypes(types: ProjectTypeChoice[] | null | undefined) {
  return (types || []).flatMap((item) => {
    if (item.active === false || !isProjectType(item.value) || !item.label) return []
    return [{ value: item.value, label: item.label }]
  })
}

/** Saved label for a project, including a type whose chip is hidden. */
export function labelForProjectType(
  type: string | null | undefined,
  types: ProjectTypeChoice[] | null | undefined,
) {
  return (types || []).find((item) => item.value === type && item.label)?.label || ''
}
