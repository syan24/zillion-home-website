import {
  isCanonicalScopeSet,
  isLegacyScopeSet,
  scopeCatalog,
  type EnquiryProjectType,
} from '@/lib/enquiry/scopes'

type Locale = 'en' | 'zh'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isScopeBlock(field: unknown): field is Record<string, unknown> {
  return isRecord(field) && field.blockType === 'checkboxGroup' && field.name === 'scope'
}

function optionValue(option: unknown): string {
  return isRecord(option) && typeof option.value === 'string' ? option.value : ''
}

function catalogOptions(locale: Locale) {
  return scopeCatalog.map((item) => ({
    label: locale === 'zh' ? item.zh : item.en,
    value: item.value,
    projectType: item.projectType,
  }))
}

function labelFor(
  item: (typeof scopeCatalog)[number],
  locale: Locale,
  current: unknown,
  force: boolean,
): string {
  const canonical = locale === 'zh' ? item.zh : item.en
  const label = typeof current === 'string' ? current.trim() : ''
  if (force || !label) return canonical
  if (locale === 'zh' && label === item.en) return item.zh
  return label
}

/**
 * Fills project type and catalog labels on the current scope options.
 * `force` replaces labels for known values. Custom labels are kept otherwise.
 */
export function stampCatalogScopeLabels(fields: unknown, locale: Locale, force: boolean): unknown {
  if (!Array.isArray(fields)) return fields
  let changed = false
  const next = fields.map((field) => {
    if (!isScopeBlock(field) || !Array.isArray(field.options)) return field
    let optionsChanged = false
    const options = field.options.map((option) => {
      if (!isRecord(option)) return option
      const item = scopeCatalog.find((entry) => entry.value === option.value)
      if (!item) return option
      const label = labelFor(item, locale, option.label, force)
      const projectType: EnquiryProjectType = item.projectType
      if (option.label === label && option.projectType === projectType) return option
      optionsChanged = true
      return { ...option, label, projectType }
    })
    if (!optionsChanged) return field
    changed = true
    return { ...field, options }
  })
  return changed ? next : fields
}

/** Keeps option codes and project types from the saved English fields after a locale merge. */
export function copyScopeIdentity(source: unknown, target: unknown): unknown {
  if (!Array.isArray(source) || !Array.isArray(target)) return target
  let changed = false
  const next = target.map((field, index) => {
    const from = source[index]
    const sourceOptions = isScopeBlock(from) ? from.options : undefined
    if (!isScopeBlock(field) || !Array.isArray(field.options) || !Array.isArray(sourceOptions)) {
      return field
    }
    let optionsChanged = false
    const options = field.options.map((option, optionIndex) => {
      const origin = sourceOptions[optionIndex]
      if (!isRecord(option) || !isRecord(origin)) return option
      const value = typeof origin.value === 'string' ? origin.value : option.value
      const projectType = origin.projectType ?? option.projectType
      if (option.value === value && option.projectType === projectType) return option
      optionsChanged = true
      return { ...option, value, projectType }
    })
    if (!optionsChanged) return field
    changed = true
    return { ...field, options }
  })
  return changed ? next : target
}

function replaceLegacyScope(fields: unknown, locale: Locale): unknown {
  if (!Array.isArray(fields)) return fields
  let changed = false
  const next = fields.map((field) => {
    if (!isScopeBlock(field)) return field
    changed = true
    return { ...field, options: catalogOptions(locale) }
  })
  return changed ? next : fields
}

/**
 * Replaces the joinery-only scope list, or fills project types on the canonical list.
 * A custom option set is left as the editor saved it.
 */
export function alignEnquiryScopeFields(
  enFields: unknown,
  zhFields: unknown,
): { changed: boolean; replacedLegacy: boolean; en: unknown; zh: unknown } {
  const enList = Array.isArray(enFields) ? enFields : []
  const scope = enList.find(isScopeBlock)
  const values = (Array.isArray(scope?.options) ? scope.options : [])
    .map(optionValue)
    .filter(Boolean)
  const replacedLegacy = isLegacyScopeSet(values)
  const canonical = isCanonicalScopeSet(values)

  if (!scope || (!replacedLegacy && !canonical)) {
    return { changed: false, replacedLegacy: false, en: enFields, zh: zhFields }
  }

  const en = replacedLegacy
    ? replaceLegacyScope(enFields, 'en')
    : stampCatalogScopeLabels(enFields, 'en', false)
  const zhSource = zhFields ?? enFields
  const zh = replacedLegacy
    ? replaceLegacyScope(zhSource, 'zh')
    : stampCatalogScopeLabels(zhSource, 'zh', false)
  const changed = en !== enFields || zh !== zhFields
  return {
    changed,
    replacedLegacy,
    en: changed ? en : enFields,
    zh: changed ? zh : zhFields,
  }
}
