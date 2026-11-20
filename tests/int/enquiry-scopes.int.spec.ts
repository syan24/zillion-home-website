import { describe, expect, it } from 'vitest'

import { alignEnquiryScopeFields } from '@/lib/enquiry/alignFormScopes'
import { publicEnquiryFields } from '@/lib/enquiry/defaultForm'
import { scopeCatalog, scopesForProjectType } from '@/lib/enquiry/scopes'

const legacyOptions = [
  { id: 'o1', label: 'Full Joinery', value: 'full-joinery' },
  { id: 'o2', label: 'Kitchen', value: 'kitchen' },
  { id: 'o3', label: 'Wardrobe', value: 'wardrobe' },
  { id: 'o4', label: 'Bathroom Vanity', value: 'bathroom-vanity' },
  { id: 'o5', label: 'TV Unit', value: 'tv-unit' },
  { id: 'o6', label: 'Other', value: 'other' },
]

describe('enquiry scope lists', () => {
  it('changes the visible options with the project type and keeps multi-select values', () => {
    const options = publicEnquiryFields('en').find((field) => field.name === 'scope')?.options || []
    expect(scopesForProjectType(options, 'residential').map((option) => option.label)).toEqual([
      'New Home Construction',
      'Extension / Addition',
      'Full House Renovation',
      'Kitchen / Bathroom Renovation',
      'Outdoor Works',
      'Other',
    ])
    expect(scopesForProjectType(options, 'commercial').map((option) => option.label)).toEqual([
      'Office Fit-out',
      'Retail Fit-out',
      'Hospitality Fit-out',
      'Warehouse / Industrial',
      'Commercial Refurbishment',
      'Other',
    ])
    expect(scopesForProjectType(options, 'joinery').map((option) => option.label)).toEqual([
      'Kitchen Cabinetry',
      'Wardrobes / Walk in robe',
      'Bathroom Vanities',
      'Laundry Cabinetry',
      'Entertainment Units',
      'Other',
    ])
    expect(scopesForProjectType(options, '').map((option) => option.value)).toEqual([])

    const zh = publicEnquiryFields('zh').find((field) => field.name === 'scope')?.options || []
    expect(scopesForProjectType(zh, 'residential').map((option) => option.label)).toEqual([
      '新建住宅',
      '扩建 / 加建',
      '全屋翻新',
      '厨房 / 卫生间翻新',
      '户外工程',
      '其他',
    ])
    expect(scopeCatalog).toHaveLength(18)
  })

  it('replaces the joinery-only scope list and leaves a custom list', () => {
    const en = [
      { id: 'name', blockType: 'text', name: 'name', label: 'Name' },
      {
        id: 'scope',
        blockType: 'checkboxGroup',
        name: 'scope',
        label: 'Scope of work',
        options: legacyOptions,
      },
    ]
    const zh = [
      { id: 'name', blockType: 'text', name: 'name', label: '姓名' },
      {
        id: 'scope',
        blockType: 'checkboxGroup',
        name: 'scope',
        label: '工作范围',
        options: legacyOptions.map((option) => ({ ...option, label: '旧选项' })),
      },
    ]
    const aligned = alignEnquiryScopeFields(en, zh)
    expect(aligned.changed).toBe(true)
    expect(aligned.replacedLegacy).toBe(true)
    const enScope = (
      aligned.en as {
        name?: string
        label?: string
        options?: { value: string; projectType?: string }[]
      }[]
    )[1]
    expect(enScope?.label).toBe('Scope of work')
    expect(enScope?.options?.map((option) => option.value)).toEqual(
      scopeCatalog.map((item) => item.value),
    )
    expect(enScope?.options?.every((option) => option.projectType)).toBe(true)
    expect((aligned.en as { label?: string }[])[0]?.label).toBe('Name')
    const zhScope = (aligned.zh as { options?: { label: string; value: string }[] }[])[1]
    expect(
      zhScope?.options?.find((option) => option.value === 'new-home-construction')?.label,
    ).toBe('新建住宅')
    expect((aligned.zh as { label?: string }[])[0]?.label).toBe('姓名')

    const again = alignEnquiryScopeFields(aligned.en, aligned.zh)
    expect(again.changed).toBe(false)

    const custom = alignEnquiryScopeFields(
      [
        {
          blockType: 'checkboxGroup',
          name: 'scope',
          options: [{ label: 'Site measure', value: 'site-measure' }],
        },
      ],
      [
        {
          blockType: 'checkboxGroup',
          name: 'scope',
          options: [{ label: '现场测量', value: 'site-measure' }],
        },
      ],
    )
    expect(custom.changed).toBe(false)
  })
})
