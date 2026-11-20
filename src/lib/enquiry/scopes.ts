/** Scope of work for the public enquiry form. Values are stored; labels are localized in the form. */

export const enquiryProjectTypes = ['residential', 'commercial', 'joinery'] as const

export type EnquiryProjectType = (typeof enquiryProjectTypes)[number]

export type ScopeCatalogItem = {
  projectType: EnquiryProjectType
  value: string
  en: string
  zh: string
}

export const scopeCatalog: readonly ScopeCatalogItem[] = [
  {
    projectType: 'residential',
    value: 'new-home-construction',
    en: 'New Home Construction',
    zh: '新房建造',
  },
  {
    projectType: 'residential',
    value: 'extension-addition',
    en: 'Extension / Addition',
    zh: '扩建 / 加建',
  },
  {
    projectType: 'residential',
    value: 'full-house-renovation',
    en: 'Full House Renovation',
    zh: '全屋翻新',
  },
  {
    projectType: 'residential',
    value: 'kitchen-bathroom-renovation',
    en: 'Kitchen / Bathroom Renovation',
    zh: '厨房 / 卫生间翻新',
  },
  { projectType: 'residential', value: 'outdoor-works', en: 'Outdoor Works', zh: '户外工程' },
  { projectType: 'residential', value: 'residential-other', en: 'Other', zh: '其他' },
  { projectType: 'commercial', value: 'office-fit-out', en: 'Office Fit-out', zh: '办公室装修' },
  { projectType: 'commercial', value: 'retail-fit-out', en: 'Retail Fit-out', zh: '零售装修' },
  {
    projectType: 'commercial',
    value: 'hospitality-fit-out',
    en: 'Hospitality Fit-out',
    zh: '餐饮与酒店装修',
  },
  {
    projectType: 'commercial',
    value: 'warehouse-industrial',
    en: 'Warehouse / Industrial',
    zh: '仓库 / 工业',
  },
  {
    projectType: 'commercial',
    value: 'commercial-refurbishment',
    en: 'Commercial Refurbishment',
    zh: '商业翻新',
  },
  { projectType: 'commercial', value: 'commercial-other', en: 'Other', zh: '其他' },
  { projectType: 'joinery', value: 'kitchen-cabinetry', en: 'Kitchen Cabinetry', zh: '厨房橱柜' },
  {
    projectType: 'joinery',
    value: 'wardrobes-walk-in',
    en: 'Wardrobes / Walk in robe',
    zh: '衣柜 / 步入式衣帽间',
  },
  { projectType: 'joinery', value: 'bathroom-vanities', en: 'Bathroom Vanities', zh: '浴室柜' },
  { projectType: 'joinery', value: 'laundry-cabinetry', en: 'Laundry Cabinetry', zh: '洗衣房橱柜' },
  { projectType: 'joinery', value: 'entertainment-units', en: 'Entertainment Units', zh: '娱乐柜' },
  { projectType: 'joinery', value: 'joinery-other', en: 'Other', zh: '其他' },
]

const catalogByValue = new Map(scopeCatalog.map((item) => [item.value, item]))

/** Previous joinery-only option values. Still mapped onto spaces when an older form submits them. */
export const legacyScopeValues = [
  'full-joinery',
  'kitchen',
  'wardrobe',
  'bathroom-vanity',
  'tv-unit',
  'other',
] as const

const legacyScopeValueSet = new Set<string>(legacyScopeValues)

const scopeToSpace = {
  kitchen: 'kitchen',
  wardrobe: 'wardrobe',
  'bathroom-vanity': 'bathroom-vanity',
  'kitchen-cabinetry': 'kitchen',
  'wardrobes-walk-in': 'wardrobe',
  'bathroom-vanities': 'bathroom-vanity',
} as const

export type ScopeSpace = (typeof scopeToSpace)[keyof typeof scopeToSpace]

export function isEnquiryProjectType(
  value: string | null | undefined,
): value is EnquiryProjectType {
  return value === 'residential' || value === 'commercial' || value === 'joinery'
}

export function scopeLabel(value: string, locale: 'en' | 'zh' = 'en'): string {
  const item = catalogByValue.get(value)
  if (!item) return value
  return locale === 'zh' ? item.zh : item.en
}

export function spacesForScope(scope: readonly string[]): ScopeSpace[] {
  const next: ScopeSpace[] = []
  for (const value of scope) {
    const space = scopeToSpace[value as keyof typeof scopeToSpace]
    if (space && !next.includes(space)) next.push(space)
  }
  return next
}

export function scopesForProjectType<T extends { projectType?: string | null }>(
  options: readonly T[],
  projectType: string,
): T[] {
  const tagged = options.some((option) => option.projectType)
  if (!tagged) return [...options]
  if (!isEnquiryProjectType(projectType)) return []
  return options.filter((option) => option.projectType === projectType)
}

export function scopeSelectionsFitType(
  scope: readonly string[],
  projectType: string,
  options: readonly { value: string; projectType?: string | null }[] | undefined,
): boolean {
  if (!options || options.length === 0) return true
  const tagged = options.some((option) => option.projectType)
  if (!tagged) return true
  const allowed = new Set(scopesForProjectType(options, projectType).map((option) => option.value))
  return scope.every((value) => allowed.has(value))
}

export function isLegacyScopeSet(values: readonly string[]): boolean {
  return values.length > 0 && values.every((value) => legacyScopeValueSet.has(value))
}

export function isCanonicalScopeSet(values: readonly string[]): boolean {
  if (values.length !== scopeCatalog.length) return false
  const present = new Set(values)
  return scopeCatalog.every((item) => present.has(item.value))
}
