import { describe, expect, it } from 'vitest'

import { isSiteLocale } from '@/i18n/config'
import { hasProjectFilters, imageMatchesTerm, parseProjectFilters, projectFilterHref } from '@/lib/projects/filters'
import { publicProjectLocation } from '@/lib/projects/location'
import { mergeLocale, stripLegacyBilingualCopy } from '@/seed/localeCopy'

describe('locale cookie values', () => {
  it('accepts en and zh only', () => {
    expect(isSiteLocale('en')).toBe(true)
    expect(isSiteLocale('zh')).toBe(true)
    expect(isSiteLocale('zh-CN')).toBe(false)
    expect(isSiteLocale(undefined)).toBe(false)
  })
})

describe('project filters', () => {
  it('keeps combined filters in the url', () => {
    const filters = parseProjectFilters({
      type: 'residential',
      style: 'Modern',
      space: 'kitchen',
      project: 'kew-residence',
      extra: '<script>',
    })
    expect(filters).toEqual({
      type: 'residential',
      style: 'modern',
      space: 'kitchen',
      project: 'kew-residence',
    })
    expect(hasProjectFilters(filters)).toBe(true)
    expect(projectFilterHref(filters, 'gallery')).toBe(
      '/projects?type=residential&style=modern&space=kitchen&project=kew-residence#gallery',
    )
  })

  it('drops unknown project types', () => {
    expect(parseProjectFilters({ type: 'joinery' }).type).toBeUndefined()
    expect(hasProjectFilters({})).toBe(false)
  })

  it('keeps a space filter on the image when the image has its own tag', () => {
    const kitchen = 1
    const living = 2
    const bedroom = 3
    const projectSpaces = [kitchen, living, bedroom]

    expect(imageMatchesTerm([kitchen], projectSpaces, kitchen)).toBe(true)
    expect(imageMatchesTerm([living], projectSpaces, kitchen)).toBe(false)
    expect(imageMatchesTerm([bedroom], projectSpaces, kitchen)).toBe(false)
  })

  it('uses project tags only when the image has none', () => {
    expect(imageMatchesTerm([], [9], 9)).toBe(true)
    expect(imageMatchesTerm([], [9], 4)).toBe(false)
    expect(imageMatchesTerm([4], [9], 9)).toBe(false)
  })
})

describe('public project location', () => {
  it('hides the street address unless the flag is on', () => {
    expect(
      publicProjectLocation({
        showAddressPublicly: false,
        address: '18 Walpole Street, Kew VIC 3101',
        suburb: 'Kew',
      }),
    ).toBe('Kew')
    expect(
      publicProjectLocation({
        showAddressPublicly: true,
        address: '42 Kooyong Road, Armadale VIC 3143',
        suburb: 'Armadale',
      }),
    ).toBe('42 Kooyong Road, Armadale VIC 3143')
  })
})

describe('locale seed merge', () => {
  it('overlays translated strings and keeps ids', () => {
    const merged = mergeLocale(
      { id: '1', blockType: 'serviceCards', title: 'Residential', image: 4 },
      { blockType: 'serviceCards', title: '住宅施工', image: 9 },
    )
    expect(merged).toEqual({ id: '1', blockType: 'serviceCards', title: '住宅施工', image: 4 })
  })

  it('clears the old bilingual subtitle lines', () => {
    const result = stripLegacyBilingualCopy({ subtitle: '住宅施工与翻新', title: 'Residential' })
    expect(result.changed).toBe(true)
    expect(result.value).toEqual({ subtitle: '', title: 'Residential' })
  })
})
