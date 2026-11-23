import { describe, expect, it } from 'vitest'

import { alignEnquiryScopeFields } from '@/lib/enquiry/alignFormScopes'
import { publicEnquiryFields } from '@/lib/enquiry/defaultForm'
import { scopeCatalog, scopesForProjectType } from '@/lib/enquiry/scopes'
import { alignEnquirySelectFields } from '@/lib/enquiry/selectCopy'

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
      '新房建造',
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
    ).toBe('新房建造')
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

  it('keeps a renamed scope label and an assigned project type', () => {
    const options = scopeCatalog.map((item) => ({
      value: item.value,
      label: item.value === 'new-home-construction' ? '新建住宅' : item.zh,
      projectType: item.projectType,
    }))
    const customLabel = options.map((option) =>
      option.value === 'new-home-construction' ? { ...option, label: '自建住宅' } : option,
    )
    const fields = [{ blockType: 'checkboxGroup', name: 'scope', options }]
    const aligned = alignEnquiryScopeFields(fields, fields)
    expect(aligned.changed).toBe(false)
    const zhScope = (fields as { options?: { value: string; label: string; projectType?: string }[] }[])[0]
    expect(
      zhScope?.options?.find((option) => option.value === 'new-home-construction')?.label,
    ).toBe('新建住宅')
    expect(
      zhScope?.options?.find((option) => option.value === 'new-home-construction')?.projectType,
    ).toBe('residential')
    expect(zhScope?.options?.find((option) => option.value === 'extension-addition')?.label).toBe(
      '扩建 / 加建',
    )

    const kept = alignEnquiryScopeFields(
      [{ blockType: 'checkboxGroup', name: 'scope', options: customLabel }],
      [{ blockType: 'checkboxGroup', name: 'scope', options: customLabel }],
    )
    expect(kept.changed).toBe(false)
  })
})

describe('enquiry budget and timeline copy', () => {
  const scope = scopeCatalog.map((item) => ({
    value: item.value,
    label: item.en,
    projectType: item.projectType,
  }))

  function form(placeholder: string, label = '预计预算') {
    return [
      { blockType: 'checkboxGroup', name: 'scope', options: scope },
      {
        blockType: 'select',
        name: 'budget',
        label,
        placeholder,
        options: [
          { value: 'under-50k', label: 'Under $50,000' },
          { value: '50k-100k', label: '5 万 – 10 万澳元' },
        ],
      },
      {
        blockType: 'select',
        name: 'timeline',
        label: '期望时间',
        placeholder: 'Select Expected timeline',
        options: [{ value: 'asap', label: '尽快' }],
      },
    ]
  }

  it('updates default select copy once and leaves a custom placeholder', () => {
    const aligned = alignEnquirySelectFields(
      form('Select Approximate budget', 'Approximate budget'),
      form('Select Approximate budget', 'Approximate budget'),
    )
    expect(aligned.changed).toBe(true)
    const budget = (
      aligned.zh as {
        name?: string
        label?: string
        placeholder?: string
        options?: { label: string }[]
      }[]
    )[1]
    expect(budget?.label).toBe('预计预算')
    expect(budget?.placeholder).toBe('请选择预算范围')
    expect(budget?.options?.map((option) => option.label)).toEqual([
      '5 万澳元以下',
      '5 万 – 10 万澳元',
    ])
    const timeline = (aligned.zh as { placeholder?: string }[])[2]
    expect(timeline?.placeholder).toBe('请选择预计开始时间')

    const customPlaceholder = alignEnquirySelectFields(form('Around $80k'), form('Around $80k'))
    expect(customPlaceholder.changed).toBe(true)
    expect((customPlaceholder.zh as { placeholder?: string }[])[1]?.placeholder).toBe('Around $80k')

    const customForm = alignEnquirySelectFields(
      [
        {
          blockType: 'checkboxGroup',
          name: 'scope',
          options: [{ value: 'site-measure', label: 'Site measure' }],
        },
        { blockType: 'select', name: 'budget', placeholder: 'Select Approximate budget' },
      ],
      [
        {
          blockType: 'checkboxGroup',
          name: 'scope',
          options: [{ value: 'site-measure', label: '现场测量' }],
        },
        { blockType: 'select', name: 'budget', placeholder: 'Select Approximate budget' },
      ],
    )
    expect(customForm.changed).toBe(false)
  })
})
