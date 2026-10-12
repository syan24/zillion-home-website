import {
  isBudgetValue,
  isProjectType,
  isScopeValue,
  isSpaceValue,
  isTimelineValue,
  type BudgetValue,
  type ProjectType,
  type ScopeValue,
  type SpaceValue,
  type TimelineValue,
} from '@/lib/enquiry/options'
import { isEnquirySubmissionId } from '@/lib/enquiry/files'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9+().\-\s]{6,40}$/

export type EnquiryField =
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'projectType'
  | 'scope'
  | 'budget'
  | 'timeline'
  | 'notes'
  | 'files'
  | 'rate'
  | 'generic'

export type ValidEnquiry = {
  clientSubmissionId: string
  name: string
  phone: string
  email: string
  address: string
  projectType: ProjectType
  scope: ScopeValue[]
  spaces: SpaceValue[]
  notes: string
  budgetRange?: BudgetValue
  expectedStart?: TimelineValue
}

type Ok = { ok: true; value: ValidEnquiry }
type Err = { ok: false; fields: EnquiryField[] }

export function validateEnquiryFields(input: {
  clientSubmissionId: unknown
  name: unknown
  phone: unknown
  email: unknown
  address: unknown
  projectType: unknown
  scope: unknown
  notes: unknown
  budget: unknown
  timeline: unknown
}): Ok | Err {
  const fields: EnquiryField[] = []
  const name = cleanLine(input.name, 120)
  const phone = cleanLine(input.phone, 40)
  const email = cleanLine(input.email, 200).toLowerCase()
  const address = cleanLine(input.address, 300)
  const notes = cleanMultiline(input.notes, 5000)
  const projectType = cleanLine(input.projectType, 40)
  const budget = cleanLine(input.budget, 40)
  const timeline = cleanLine(input.timeline, 40)

  const clientSubmissionId =
    typeof input.clientSubmissionId === 'string' ? input.clientSubmissionId.toLowerCase() : ''
  if (!isEnquirySubmissionId(clientSubmissionId)) fields.push('generic')
  if (name.length < 2) fields.push('name')
  if (!EMAIL_PATTERN.test(email)) fields.push('email')
  if (phone && !PHONE_PATTERN.test(phone)) fields.push('phone')
  if (address.length < 2) fields.push('address')
  if (!isProjectType(projectType)) fields.push('projectType')

  const scope = uniqueScopes(input.scope)
  if (scope == null) fields.push('scope')

  let budgetRange: BudgetValue | undefined
  if (budget) {
    if (!isBudgetValue(budget)) fields.push('budget')
    else budgetRange = budget
  }

  let expectedStart: TimelineValue | undefined
  if (timeline) {
    if (!isTimelineValue(timeline)) fields.push('timeline')
    else expectedStart = timeline
  }

  if (typeof input.notes === 'string' && input.notes.trim().length > 5000) fields.push('notes')

  if (fields.length > 0 || !scope || !isProjectType(projectType)) {
    return { ok: false, fields: unique(fields) }
  }

  return {
    ok: true,
    value: {
      clientSubmissionId,
      name,
      phone,
      email,
      address,
      projectType,
      scope,
      spaces: scope.filter((item): item is SpaceValue => isSpaceValue(item)),
      notes,
      budgetRange,
      expectedStart,
    },
  }
}

function uniqueScopes(value: unknown): ScopeValue[] | null {
  const raw = Array.isArray(value) ? value : value == null || value === '' ? [] : [value]
  const next: ScopeValue[] = []
  for (const item of raw) {
    if (typeof item !== 'string' || item === '') continue
    if (!isScopeValue(item)) return null
    if (!next.includes(item)) next.push(item)
  }
  return next
}

function unique(fields: EnquiryField[]): EnquiryField[] {
  return [...new Set(fields)]
}

function cleanLine(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max)
}

function cleanMultiline(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max)
}
