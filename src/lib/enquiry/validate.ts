import { enquiryFileIssue, isEnquirySubmissionId } from '@/lib/enquiry/files'
import { isSpaceValue, MAX_ENQUIRY_FILE_BYTES, MAX_ENQUIRY_FILES, type SpaceValue } from '@/lib/enquiry/options'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9+().\-\s]{6,40}$/

export type EnquiryIssueCode =
  | 'required'
  | 'invalid'
  | 'email'
  | 'phone'
  | 'length'
  | 'files'
  | 'rate'
  | 'generic'

export type EnquiryIssue = {
  field: string
  code: EnquiryIssueCode
}

export type EnquiryAnswer = string | boolean | string[]

/** Serializable form-builder field used by the public enquiry page. */
export type PublicEnquiryField = {
  blockType: string
  name?: string
  label?: string
  required?: boolean
  placeholder?: string
  width?: number
  options?: { label: string; value: string; icon?: string; iconUrl?: string }[]
  multiple?: boolean
  maxFileSize?: number | null
  mimeTypes?: string[]
  message?: unknown
}

export type EnquiryFileMeta = {
  field: string
  name: string
  type: string
  size: number
}

export type ValidEnquiry = {
  clientSubmissionId: string
  name: string
  phone: string
  email: string
  address: string
  projectType: string
  scope: string[]
  spaces: SpaceValue[]
  notes: string
  budgetRange?: string
  expectedStart?: string
  additionalAnswers?: Record<string, EnquiryAnswer>
}

type Ok = { ok: true; value: ValidEnquiry }
type Err = { ok: false; issues: EnquiryIssue[] }

const primaryUploadNames = new Set(['attachments', 'files'])

/**
 * Maps a Form Builder submission onto an enquiry.
 * Known `name` values fill enquiry columns. Every other named field is kept in `additionalAnswers`.
 */
export function mapEnquiryAnswers(input: {
  fields: PublicEnquiryField[]
  values: Record<string, unknown>
  files: EnquiryFileMeta[]
  clientSubmissionId: unknown
}): Ok | Err {
  const issues: EnquiryIssue[] = []
  const clientSubmissionId =
    typeof input.clientSubmissionId === 'string' ? input.clientSubmissionId.toLowerCase() : ''
  if (!isEnquirySubmissionId(clientSubmissionId)) issues.push({ field: 'form', code: 'generic' })

  const fields = input.fields.filter((field) => field.name && field.blockType !== 'message')
  const seen = new Set<string>()
  const uniqueFields = fields.filter((field) => {
    const name = field.name || ''
    if (seen.has(name)) return false
    seen.add(name)
    return true
  })

  const scalars = new Map<string, string>()
  const groups = new Map<string, string[]>()
  const checks = new Map<string, boolean>()
  const filesByField = new Map<string, EnquiryFileMeta[]>()
  for (const file of input.files) {
    const list = filesByField.get(file.field) || []
    list.push(file)
    filesByField.set(file.field, list)
  }

  if (input.files.length > MAX_ENQUIRY_FILES) issues.push({ field: 'files', code: 'files' })

  for (const field of uniqueFields) {
    const name = field.name || ''
    if (field.blockType === 'upload') {
      const files = filesByField.get(name) || []
      if (field.required && files.length === 0) issues.push({ field: name, code: 'required' })
      if (field.multiple === false && files.length > 1) issues.push({ field: name, code: 'files' })
      const limit = fieldLimit(field.maxFileSize)
      for (const file of files) {
        const issue = enquiryFileIssue(file.name, file.type, file.size)
        if (issue || file.size > limit || !mimeAllowed(file, field.mimeTypes)) {
          issues.push({ field: name, code: 'files' })
          break
        }
      }
      continue
    }

    if (field.blockType === 'checkbox') {
      const checked = isChecked(input.values[name])
      checks.set(name, checked)
      if (field.required && !checked) issues.push({ field: name, code: 'required' })
      continue
    }

    if (field.blockType === 'checkboxGroup') {
      const selected = uniqueStrings(input.values[name])
      groups.set(name, selected)
      if (field.required && selected.length === 0) issues.push({ field: name, code: 'required' })
      if (!valuesAllowed(selected, field.options)) issues.push({ field: name, code: 'invalid' })
      continue
    }

    const max = maxLength(field)
    const raw = cleanScalar(input.values[name])
    if (raw.length > max) {
      issues.push({ field: name, code: 'length' })
      continue
    }
    scalars.set(name, raw)
    if (field.required && raw.length === 0) issues.push({ field: name, code: 'required' })
    if ((field.blockType === 'email' || name === 'email') && raw && !EMAIL_PATTERN.test(raw)) {
      issues.push({ field: name, code: 'email' })
    }
    if (name === 'phone' && raw && !PHONE_PATTERN.test(raw)) issues.push({ field: name, code: 'phone' })
    if (field.options?.length && raw && !valuesAllowed([raw], field.options)) {
      issues.push({ field: name, code: 'invalid' })
    }
  }

  const unknownFiles = [...filesByField.keys()].filter((name) => !seen.has(name))
  if (unknownFiles.length > 0) issues.push({ field: 'files', code: 'files' })

  if (issues.length > 0) return { ok: false, issues: dedupe(issues) }

  const hasNotes = uniqueFields.some((field) => field.name === 'notes')
  const notes = hasNotes ? scalars.get('notes') || '' : scalars.get('description') || ''
  const scope = groups.get('scope') || splitList(scalars.get('scope'))
  const additional: Record<string, EnquiryAnswer> = {}

  for (const field of uniqueFields) {
    const name = field.name || ''
    if (isMappedName(name, hasNotes)) continue
    if (field.blockType === 'upload') {
      const names = (filesByField.get(name) || []).map((file) => file.name)
      if (names.length > 0 && !primaryUploadNames.has(name)) additional[name] = names
      continue
    }
    if (field.blockType === 'checkbox') {
      additional[name] = checks.get(name) === true
      continue
    }
    if (field.blockType === 'checkboxGroup') {
      additional[name] = groups.get(name) || []
      continue
    }
    const value = scalars.get(name) || ''
    if (value) additional[name] = value
  }

  const budget = scalars.get('budget') || ''
  const timeline = scalars.get('timeline') || ''

  return {
    ok: true,
    value: {
      clientSubmissionId,
      name: scalars.get('name') || '',
      phone: scalars.get('phone') || '',
      email: (scalars.get('email') || '').toLowerCase(),
      address: scalars.get('address') || '',
      projectType: scalars.get('projectType') || '',
      scope,
      spaces: scope.filter((item): item is SpaceValue => isSpaceValue(item)),
      notes,
      ...(budget ? { budgetRange: budget } : {}),
      ...(timeline ? { expectedStart: timeline } : {}),
      ...(Object.keys(additional).length > 0 ? { additionalAnswers: additional } : {}),
    },
  }
}

function isMappedName(name: string, hasNotes: boolean): boolean {
  if (name === 'description') return !hasNotes
  if (name === 'scope') return true
  return (
    name === 'name' ||
    name === 'phone' ||
    name === 'email' ||
    name === 'address' ||
    name === 'projectType' ||
    name === 'budget' ||
    name === 'timeline' ||
    name === 'notes' ||
    primaryUploadNames.has(name)
  )
}

function fieldLimit(maxFileSize: number | null | undefined): number {
  if (typeof maxFileSize === 'number' && maxFileSize > 0) return Math.min(maxFileSize, MAX_ENQUIRY_FILE_BYTES)
  return MAX_ENQUIRY_FILE_BYTES
}

function mimeAllowed(file: EnquiryFileMeta, mimeTypes: string[] | undefined): boolean {
  if (!mimeTypes || mimeTypes.length === 0) return true
  const mime = file.type.toLowerCase().split(';')[0]?.trim() || ''
  const extension = file.name.toLowerCase().split('.').pop() || ''
  return mimeTypes.some((pattern) => {
    const expected = pattern.toLowerCase().trim()
    if (!expected) return false
    if (expected.endsWith('/*')) return mime.startsWith(expected.slice(0, -1))
    if (expected === mime) return true
    if (extension === 'dwg' && /dwg|octet-stream|acad/.test(expected)) return true
    if ((extension === 'jpg' || extension === 'jpeg') && expected === 'image/jpeg') return true
    if (extension === 'pdf' && expected === 'application/pdf') return true
    if (extension === 'png' && expected === 'image/png') return true
    return false
  })
}

function maxLength(field: PublicEnquiryField): number {
  if (field.name === 'name') return 120
  if (field.name === 'phone') return 40
  if (field.name === 'email') return 200
  if (field.name === 'address') return 300
  if (field.name === 'notes' || field.name === 'description' || field.blockType === 'textarea') return 5000
  return 300
}

function isChecked(value: unknown): boolean {
  return value === true || value === 'true' || value === 'on' || value === 'yes'
}

function uniqueStrings(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : value == null || value === '' ? [] : [value]
  const next: string[] = []
  for (const item of raw) {
    if (typeof item !== 'string') continue
    const cleaned = cleanScalar(item)
    if (!cleaned || next.includes(cleaned)) continue
    next.push(cleaned)
  }
  return next
}

function splitList(value: string | undefined): string[] {
  if (!value) return []
  return uniqueStrings(value.split(','))
}

function valuesAllowed(values: string[], options: { value: string }[] | undefined): boolean {
  if (!options || options.length === 0) return true
  const allowed = new Set(options.map((option) => option.value))
  return values.every((value) => allowed.has(value))
}

function cleanScalar(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
}

function dedupe(issues: EnquiryIssue[]): EnquiryIssue[] {
  const seen = new Set<string>()
  return issues.filter((issue) => {
    const key = `${issue.field}:${issue.code}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
