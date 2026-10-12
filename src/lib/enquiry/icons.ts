/** Line icons staff can assign to a Form Builder option. A Media image replaces the line icon. */
export const enquiryIconKeys = ['house', 'building', 'layout'] as const

export type EnquiryIcon = (typeof enquiryIconKeys)[number]

export const enquiryIconOptions: { label: string; value: EnquiryIcon }[] = [
  { label: 'House', value: 'house' },
  { label: 'Building', value: 'building' },
  { label: 'Layout', value: 'layout' },
]

/** Seeded project-type values. Applied only when that option has no icon yet. */
export const defaultProjectTypeIcons: Record<string, EnquiryIcon> = {
  residential: 'house',
  commercial: 'building',
  joinery: 'layout',
}

export function isEnquiryIcon(value: unknown): value is EnquiryIcon {
  return typeof value === 'string' && (enquiryIconKeys as readonly string[]).includes(value)
}
