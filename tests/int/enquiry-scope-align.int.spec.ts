// @vitest-environment node

import { sql } from '@payloadcms/db-postgres'
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '@payload-config'

import type { Form } from '@/payload-types'
import { payloadEnquiryFields } from '@/lib/enquiry/defaultForm'
import { loadEnquiryForm } from '@/lib/enquiry/loadForm'
import { scopeCatalog } from '@/lib/enquiry/scopes'
import { applyEditorBaseline } from '@/seed/editorBaseline'
import { seedEnquiryForm } from '@/seed/enquiryForm'

let payload: Payload
let formID: number

const legacyOptions = [
  { label: 'Full Joinery', value: 'full-joinery' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Wardrobe', value: 'wardrobe' },
  { label: 'Bathroom Vanity', value: 'bathroom-vanity' },
  { label: 'TV Unit', value: 'tv-unit' },
  { label: 'Other', value: 'other' },
]

function scopeOptions(fields: Form['fields'] | null | undefined) {
  const scope = fields?.find(
    (field) => field.blockType === 'checkboxGroup' && field.name === 'scope',
  )
  if (!scope || scope.blockType !== 'checkboxGroup') return []
  return scope.options || []
}

describe('enquiry scope seed alignment', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
    const found = await payload.find({
      collection: 'forms',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { enquiryForm: { equals: true } },
    })
    let form = found.docs[0]
    if (!form) {
      await seedEnquiryForm(payload)
      const created = await payload.find({
        collection: 'forms',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { enquiryForm: { equals: true } },
      })
      form = created.docs[0]
    }
    if (!form) throw new Error('Enquiry form is missing.')
    formID = form.id

    const scope = form.fields?.find(
      (field) => field.blockType === 'checkboxGroup' && field.name === 'scope',
    )
    if (scope?.id) {
      await payload.db.drizzle.execute(sql`
        DELETE FROM forms_blocks_checkbox_group_options WHERE _parent_id = ${scope.id}
      `)
    }
    const legacy = (payloadEnquiryFields('en') as NonNullable<Form['fields']>).map((field) => {
      if (field.blockType === 'checkboxGroup' && field.name === 'scope') {
        return { ...field, options: legacyOptions }
      }
      if (field.blockType === 'select' && field.name === 'budget') {
        return { ...field, placeholder: 'Select Approximate budget' }
      }
      if (field.blockType === 'select' && field.name === 'timeline') {
        return { ...field, placeholder: 'Select Expected timeline' }
      }
      return field
    })
    const enSaved = await payload.update({
      collection: 'forms',
      id: formID,
      locale: 'en',
      overrideAccess: true,
      data: { fields: legacy as NonNullable<Form['fields']> },
    })
    const zhLegacy = (enSaved.fields || []).map((field) => {
      if (field.blockType === 'text' && field.name === 'name') return { ...field, label: '姓名' }
      if (field.blockType === 'checkboxGroup' && field.name === 'scope') {
        return {
          ...field,
          options: (field.options || []).map((option) => ({ ...option, label: '旧选项' })),
        }
      }
      if (field.blockType === 'select' && field.name === 'budget') {
        return {
          ...field,
          label: 'Approximate budget',
          placeholder: 'Select Approximate budget',
          options: (field.options || []).map((option) =>
            option.value === 'under-50k' ? { ...option, label: 'Under $50,000' } : option,
          ),
        }
      }
      if (field.blockType === 'select' && field.name === 'timeline') {
        return { ...field, label: 'Expected timeline', placeholder: 'Select Expected timeline' }
      }
      return field
    })
    await payload.update({
      collection: 'forms',
      id: formID,
      locale: 'zh',
      overrideAccess: true,
      data: { fields: zhLegacy },
    })
  })

  afterAll(async () => {
    if (!payload || !formID) return
    const en = await payload.update({
      collection: 'forms',
      id: formID,
      locale: 'en',
      overrideAccess: true,
      data: { fields: payloadEnquiryFields('en') as NonNullable<Form['fields']> },
    })
    const { mergeLocale } = await import('@/seed/localeCopy')
    await payload.update({
      collection: 'forms',
      id: formID,
      locale: 'zh',
      overrideAccess: true,
      data: {
        fields: mergeLocale(en.fields, payloadEnquiryFields('zh')) as NonNullable<Form['fields']>,
      },
    })
  })

  it('leaves editor scope fields on seed and applies the old list only from the one-off baseline', async () => {
    await seedEnquiryForm(payload)
    const seeded = await payload.findByID({
      collection: 'forms',
      id: formID,
      locale: 'en',
      depth: 0,
      overrideAccess: true,
    })
    expect(scopeOptions(seeded.fields).map((option) => option.value)).toEqual(
      legacyOptions.map((option) => option.value),
    )

    await applyEditorBaseline(payload)
    const en = await payload.findByID({
      collection: 'forms',
      id: formID,
      locale: 'en',
      depth: 0,
      overrideAccess: true,
    })
    const zh = await payload.findByID({
      collection: 'forms',
      id: formID,
      locale: 'zh',
      depth: 0,
      overrideAccess: true,
    })
    expect(scopeOptions(en.fields).map((option) => option.value)).toEqual(
      scopeCatalog.map((item) => item.value),
    )
    expect(scopeOptions(en.fields).map((option) => option.projectType)).toEqual(
      scopeCatalog.map((item) => item.projectType),
    )
    expect(
      scopeOptions(zh.fields).find((option) => option.value === 'new-home-construction')?.label,
    ).toBe('新房建造')
    const budget = zh.fields?.find(
      (field) => field.blockType === 'select' && field.name === 'budget',
    )
    const timeline = zh.fields?.find(
      (field) => field.blockType === 'select' && field.name === 'timeline',
    )
    expect(budget && 'label' in budget ? budget.label : '').toBe('预计预算')
    expect(budget && 'placeholder' in budget ? budget.placeholder : '').toBe('请选择预算范围')
    expect(
      budget && 'options' in budget
        ? budget.options?.find((option) => option.value === 'under-50k')?.label
        : '',
    ).toBe('5 万澳元以下')
    expect(timeline && 'label' in timeline ? timeline.label : '').toBe('期望时间')
    expect(timeline && 'placeholder' in timeline ? timeline.placeholder : '').toBe(
      '请选择预计开始时间',
    )
    const enBudget = en.fields?.find(
      (field) => field.blockType === 'select' && field.name === 'budget',
    )
    expect(enBudget && 'label' in enBudget ? enBudget.label : '').toBe('Approximate budget')
    expect(
      enBudget && 'options' in enBudget
        ? enBudget.options?.find((option) => option.value === 'under-50k')?.label
        : '',
    ).toBe('Under $50,000')
    const zhForm = await loadEnquiryForm(payload, 'zh')
    const enForm = await loadEnquiryForm(payload, 'en')
    expect(zhForm?.fields.find((field) => field.name === 'budget')?.placeholder).toBe(
      '请选择预算范围',
    )
    expect(zhForm?.fields.find((field) => field.name === 'timeline')?.placeholder).toBe(
      '请选择预计开始时间',
    )
    expect(enForm?.fields.find((field) => field.name === 'budget')?.placeholder).toBe(
      'Select budget range',
    )
    expect(enForm?.fields.find((field) => field.name === 'timeline')?.placeholder).toBe(
      'Select expected start',
    )
    expect(scopeOptions(zh.fields).some((option) => option.label === '旧选项')).toBe(false)
    const name = zh.fields?.find((field) => field.blockType === 'text' && field.name === 'name')
    expect(name && 'label' in name ? name.label : '').toBe('姓名')

    const edited = (en.fields || []).map((field) => {
      if (field.blockType !== 'checkboxGroup' || field.name !== 'scope') return field
      return {
        ...field,
        options: (field.options || []).map((option) =>
          option.value === 'kitchen-cabinetry'
            ? { ...option, label: 'Editor kitchen', projectType: 'residential' as const }
            : option,
        ),
      }
    })
    await payload.update({
      collection: 'forms',
      id: formID,
      locale: 'en',
      overrideAccess: true,
      data: { fields: edited },
    })
    await seedEnquiryForm(payload)
    await seedEnquiryForm(payload)
    const again = await payload.findByID({
      collection: 'forms',
      id: formID,
      locale: 'en',
      depth: 0,
      overrideAccess: true,
    })
    const kitchen = scopeOptions(again.fields).find((option) => option.value === 'kitchen-cabinetry')
    expect(kitchen?.label).toBe('Editor kitchen')
    expect(kitchen?.projectType).toBe('residential')
  })
})
