import { defaultEnquiryFormFields, publicEnquiryFields } from '@/lib/enquiry/defaultForm'
import { isCanonicalScopeSet, isLegacyScopeSet } from '@/lib/enquiry/scopes'

type Locale = 'en' | 'zh'

type SelectName = 'budget' | 'timeline'

/**
 * Placeholders stored before the Chinese copy was applied.
 * The select placeholder column is not localized, so these strings were shown in both locales.
 */
const stalePlaceholders: Record<SelectName, readonly string[]> = {
  budget: ['Select Approximate budget', '选择大概预算'],
  timeline: ['Select Expected timeline', '选择预计时间'],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isSelectName(value: string): value is SelectName {
  return value === 'budget' || value === 'timeline'
}

function catalogField(name: SelectName) {
  return defaultEnquiryFormFields.find((field) => field.name === name)
}

function scopeValues(fields: unknown): string[] {
  if (!Array.isArray(fields)) return []
  const scope = fields.find(
    (field) => isRecord(field) && field.blockType === 'checkboxGroup' && field.name === 'scope',
  )
  if (!isRecord(scope) || !Array.isArray(scope.options)) return []
  return scope.options.flatMap((option) =>
    isRecord(option) && typeof option.value === 'string' && option.value ? [option.value] : [],
  )
}

export function isDefaultSelectPlaceholder(name: string, placeholder: string): boolean {
  if (!isSelectName(name)) return false
  const field = catalogField(name)
  if (!field?.placeholder) return false
  return (
    placeholder === field.placeholder.en ||
    placeholder === field.placeholder.zh ||
    stalePlaceholders[name].includes(placeholder)
  )
}

/**
 * The stored placeholder is one string for both locales.
 * Known defaults are shown in the page language. Any other wording is left as written.
 */
export function placeholderForLocale(
  name: string | undefined,
  placeholder: string | undefined,
  locale: Locale,
) {
  if (!name || !placeholder) return placeholder
  if (!isDefaultSelectPlaceholder(name, placeholder)) return placeholder
  return (
    publicEnquiryFields(locale).find((field) => field.name === name)?.placeholder || placeholder
  )
}

function readPlaceholder(
  enField: Record<string, unknown> | undefined,
  zhField: Record<string, unknown>,
) {
  const fromZh = typeof zhField.placeholder === 'string' ? zhField.placeholder.trim() : ''
  if (fromZh) return fromZh
  return typeof enField?.placeholder === 'string' ? enField.placeholder.trim() : ''
}

function alignSelectField(
  enField: Record<string, unknown> | undefined,
  zhField: Record<string, unknown>,
  name: SelectName,
): Record<string, unknown> {
  const catalog = catalogField(name)
  if (!catalog) return zhField
  let changed = false
  const next: Record<string, unknown> = { ...zhField }

  const stored = readPlaceholder(enField, zhField)
  const zhPlaceholder = catalog.placeholder?.zh
  if (
    zhPlaceholder &&
    (!stored || isDefaultSelectPlaceholder(name, stored)) &&
    stored !== zhPlaceholder
  ) {
    next.placeholder = zhPlaceholder
    changed = true
  }

  const zhLabel = typeof zhField.label === 'string' ? zhField.label.trim() : ''
  if (catalog.label && (!zhLabel || zhLabel === catalog.label.en) && zhLabel !== catalog.label.zh) {
    next.label = catalog.label.zh
    changed = true
  }

  if (Array.isArray(zhField.options) && catalog.options) {
    let optionsChanged = false
    const options = zhField.options.map((option) => {
      if (!isRecord(option) || typeof option.value !== 'string') return option
      const item = catalog.options?.find((entry) => entry.value === option.value)
      if (!item) return option
      const label = typeof option.label === 'string' ? option.label.trim() : ''
      if ((!label || label === item.label.en) && label !== item.label.zh) {
        optionsChanged = true
        return { ...option, label: item.label.zh }
      }
      return option
    })
    if (optionsChanged) {
      next.options = options
      changed = true
    }
  }

  return changed ? next : zhField
}

/**
 * Fills Chinese budget and timeline copy on the default enquiry form.
 * A form whose scope list is neither the old joinery list nor the catalog is left alone.
 * A placeholder, label, or option that is not one of the known defaults is kept.
 */
export function alignEnquirySelectFields(
  enFields: unknown,
  zhFields: unknown,
): { changed: boolean; en: unknown; zh: unknown } {
  const values = scopeValues(enFields)
  const allowed = isLegacyScopeSet(values) || isCanonicalScopeSet(values)
  if (!allowed || !Array.isArray(zhFields)) {
    return { changed: false, en: enFields, zh: zhFields }
  }

  const enList = Array.isArray(enFields) ? enFields : []
  let changed = false
  const en = enList.map((field) => {
    if (!isRecord(field) || field.blockType !== 'select' || typeof field.name !== 'string') return field
    if (!isSelectName(field.name)) return field
    const catalog = catalogField(field.name)
    const stored = typeof field.placeholder === 'string' ? field.placeholder.trim() : ''
    const nextPlaceholder = catalog?.placeholder?.en
    if (!nextPlaceholder || !stalePlaceholders[field.name].includes(stored) || stored === nextPlaceholder) {
      return field
    }
    changed = true
    return { ...field, placeholder: nextPlaceholder }
  })
  const zh = zhFields.map((field) => {
    if (!isRecord(field) || field.blockType !== 'select' || typeof field.name !== 'string')
      return field
    if (!isSelectName(field.name)) return field
    const enField = en.find(
      (entry) => isRecord(entry) && entry.blockType === 'select' && entry.name === field.name,
    )
    const next = alignSelectField(isRecord(enField) ? enField : undefined, field, field.name)
    if (next !== field) changed = true
    return next
  })

  return { changed, en: changed ? en : enFields, zh: changed ? zh : zhFields }
}
