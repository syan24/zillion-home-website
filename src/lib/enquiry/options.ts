/** Public enquiry values. Codes are stored; labels are the English admin labels. */

export const enquiryDraftStorageKey = 'zillion-enquiry-draft-id'
export const enquiryResultStorageKey = 'zillion-enquiry-result'

export const MAX_ENQUIRY_FILES = 10
export const MAX_ENQUIRY_FILE_BYTES = 10 * 1024 * 1024
export const ENQUIRY_RATE_LIMIT = 20
export const ENQUIRY_RATE_WINDOW_MS = 60 * 60 * 1000

export const projectTypeOptions = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Custom Joinery', value: 'joinery' },
] as const

export const scopeOptions = [
  { label: 'Full Joinery', value: 'full-joinery' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Wardrobe', value: 'wardrobe' },
  { label: 'Bathroom Vanity', value: 'bathroom-vanity' },
  { label: 'TV Unit', value: 'tv-unit' },
  { label: 'Other', value: 'other' },
] as const

/** Room-like scope values copied onto `spaces` for admin filtering. */
export const spaceOptions = [
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Wardrobe', value: 'wardrobe' },
  { label: 'Bathroom Vanity', value: 'bathroom-vanity' },
] as const

export const budgetOptions = [
  { label: 'Under $50,000', value: 'under-50k' },
  { label: '$50,000 – $100,000', value: '50k-100k' },
  { label: '$100,000 – $250,000', value: '100k-250k' },
  { label: '$250,000 – $500,000', value: '250k-500k' },
  { label: 'Over $500,000', value: 'over-500k' },
] as const

export const timelineOptions = [
  { label: 'As soon as possible', value: 'asap' },
  { label: '1–3 months', value: '1-3-months' },
  { label: '3–6 months', value: '3-6-months' },
  { label: '6–12 months', value: '6-12-months' },
  { label: 'Just planning', value: 'planning' },
] as const

export const enquiryStatusOptions = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Closed', value: 'closed' },
] as const

export const notificationStatusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Sent', value: 'sent' },
  { label: 'Skipped', value: 'skipped' },
  { label: 'Failed', value: 'failed' },
] as const

export const enquiryLocaleOptions = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
] as const

export type ProjectType = (typeof projectTypeOptions)[number]['value']
export type ScopeValue = (typeof scopeOptions)[number]['value']
export type SpaceValue = (typeof spaceOptions)[number]['value']
export type BudgetValue = (typeof budgetOptions)[number]['value']
export type TimelineValue = (typeof timelineOptions)[number]['value']

const projectTypes = new Set<string>(projectTypeOptions.map((option) => option.value))
const scopes = new Set<string>(scopeOptions.map((option) => option.value))
const spaces = new Set<string>(spaceOptions.map((option) => option.value))
const budgets = new Set<string>(budgetOptions.map((option) => option.value))
const timelines = new Set<string>(timelineOptions.map((option) => option.value))

export function isProjectType(value: string): value is ProjectType {
  return projectTypes.has(value)
}

export function isScopeValue(value: string): value is ScopeValue {
  return scopes.has(value)
}

export function isSpaceValue(value: string): value is SpaceValue {
  return spaces.has(value)
}

export function isBudgetValue(value: string): value is BudgetValue {
  return budgets.has(value)
}

export function isTimelineValue(value: string): value is TimelineValue {
  return timelines.has(value)
}

export function labelFor(
  options: readonly { label: string; value: string }[],
  value: string | null | undefined,
): string {
  if (!value) return ''
  return options.find((option) => option.value === value)?.label ?? value
}
