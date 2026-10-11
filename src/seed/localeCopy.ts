const structuralKeys = new Set([
  'id',
  'blockType',
  'blockName',
  'type',
  'variant',
  'layout',
  'tone',
  'anchor',
  'href',
  'url',
  'image',
  'media',
  'reference',
  'relationTo',
  'newTab',
  'appearance',
  'generateSlug',
  '_status',
  'slug',
])

export const legacyBilingualSubtitles = new Set([
  '住宅施工与翻新',
  '商业空间装修',
  '定制橱柜与木作',
  '室内装修与项目交付',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function mergeLocale(base: unknown, localized: unknown): unknown {
  if (typeof localized === 'string' || typeof localized === 'number' || typeof localized === 'boolean') {
    return localized
  }

  if (Array.isArray(base) && Array.isArray(localized)) {
    return base.map((item, index) => mergeLocale(item, localized[index] ?? item))
  }

  if (isRecord(base) && isRecord(localized)) {
    if (
      typeof base.blockType === 'string' &&
      typeof localized.blockType === 'string' &&
      base.blockType !== localized.blockType
    ) {
      return base
    }

    const out: Record<string, unknown> = { ...base }
    for (const [key, value] of Object.entries(localized)) {
      if (structuralKeys.has(key) || value == null) continue
      out[key] = mergeLocale(base[key], value)
    }
    return out
  }

  return base ?? localized
}

export function stripLegacyBilingualCopy(value: unknown): { changed: boolean; value: unknown } {
  if (typeof value === 'string') {
    if (legacyBilingualSubtitles.has(value)) return { changed: true, value: '' }
    return { changed: false, value }
  }

  if (Array.isArray(value)) {
    let changed = false
    const next = value.map((item) => {
      const result = stripLegacyBilingualCopy(item)
      changed = changed || result.changed
      return result.value
    })
    return { changed, value: changed ? next : value }
  }

  if (isRecord(value)) {
    let changed = false
    const next: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(value)) {
      const result = stripLegacyBilingualCopy(child)
      changed = changed || result.changed
      next[key] = result.value
    }
    return { changed, value: changed ? next : value }
  }

  return { changed: false, value }
}
