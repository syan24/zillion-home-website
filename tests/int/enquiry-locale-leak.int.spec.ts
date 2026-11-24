import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '@/payload.config'
import { repairEnquiryLocaleLeak, repairLeakedEnquiryCopy } from '@/lib/enquiry/repairLocaleLeak'
import { loadEnquiryForm } from '@/lib/enquiry/loadForm'
import { seedEnquiryForm } from '@/seed/enquiryForm'
import type { Form } from '@/payload-types'

function select(fields: unknown, name: string) {
  return (Array.isArray(fields) ? fields : []).find(
    (field) =>
      field &&
      typeof field === 'object' &&
      'name' in field &&
      (field as { name?: string }).name === name,
  ) as { label?: string; placeholder?: string; options?: { value?: string; label?: string }[] } | undefined
}

describe('shared Chinese placeholder copied onto English', () => {
  const leaked = [
    {
      blockType: 'text',
      name: 'name',
      label: '姓名',
    },
    {
      blockType: 'text',
      name: 'phone',
      label: 'Studio desk',
    },
    {
      blockType: 'email',
      name: 'email',
      label: '',
    },
    {
      blockType: 'select',
      name: 'budget',
      label: 'Approximate budget',
      placeholder: '请选择预算范围',
      options: [
        { value: 'under-50k', label: '5 万澳元以下' },
        { value: '50k-100k', label: 'Editor range' },
      ],
    },
    {
      blockType: 'select',
      name: 'timeline',
      label: 'Expected timeline',
      placeholder: '',
      options: [{ value: 'asap', label: 'As soon as possible' }],
    },
    {
      blockType: 'checkboxGroup',
      name: 'scope',
      label: 'Scope of work',
      options: [{ value: 'new-home-construction', label: '新房建造' }],
    },
    {
      blockType: 'select',
      name: 'budget-custom',
      placeholder: '请选择预算范围',
    },
  ]

  it('repairs only the known Chinese demo strings on the English copy', () => {
    const repaired = repairLeakedEnquiryCopy({
      fields: leaked,
      submitButtonLabel: '提交咨询 →',
      confirmationMessage: {
        root: { children: [{ children: [{ text: '感谢您的咨询，我们已收到您的信息。' }] }] },
      },
    })
    expect(repaired.changed).toBe(true)
    expect(select(repaired.fields, 'name')?.label).toBe('Name')
    expect(select(repaired.fields, 'phone')?.label).toBe('Studio desk')
    expect(select(repaired.fields, 'email')?.label).toBe('')
    expect(select(repaired.fields, 'budget')?.placeholder).toBe('Select budget range')
    expect(select(repaired.fields, 'budget')?.options?.[0]?.label).toBe('Under $50,000')
    expect(select(repaired.fields, 'budget')?.options?.[1]?.label).toBe('Editor range')
    expect(select(repaired.fields, 'timeline')?.placeholder).toBe('')
    expect(select(repaired.fields, 'scope')?.options?.[0]?.label).toBe('New Home Construction')
    expect(select(repaired.fields, 'budget-custom')?.placeholder).toBe('请选择预算范围')
    expect(repaired.submitButtonLabel).toBe('Submit Enquiry →')
    expect(JSON.stringify(repaired.confirmationMessage)).toContain(
      'Thank you. Your enquiry has been received.',
    )

    const again = repairLeakedEnquiryCopy(repaired)
    expect(again.changed).toBe(false)
  })

  it('keeps an earlier stale Chinese placeholder distinct from a custom one', () => {
    const repaired = repairLeakedEnquiryCopy({
      fields: [
        { blockType: 'select', name: 'timeline', placeholder: '选择预计时间' },
        { blockType: 'select', name: 'budget', placeholder: 'Around $80k' },
      ],
    })
    expect(select(repaired.fields, 'timeline')?.placeholder).toBe('Select expected start')
    expect(select(repaired.fields, 'budget')?.placeholder).toBe('Around $80k')
  })
})

describe('enquiry locale repair against the database', () => {
  let payload: Payload
  let formID = 0
  let english: Form
  let chinese: Form

  beforeAll(async () => {
    payload = await getPayload({ config })
    const found = await payload.find({
      collection: 'forms',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { enquiryForm: { equals: true } },
    })
    const form = found.docs[0]
    if (!form) throw new Error('Enquiry form is missing.')
    formID = form.id
    english = await payload.findByID({
      collection: 'forms',
      id: formID,
      locale: 'en',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    chinese = await payload.findByID({
      collection: 'forms',
      id: formID,
      locale: 'zh',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
  })

  afterAll(async () => {
    if (!formID) return
    await payload.update({
      collection: 'forms',
      id: formID,
      locale: 'en',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        fields: english.fields,
        submitButtonLabel: english.submitButtonLabel,
        confirmationMessage: english.confirmationMessage,
      },
    })
    await payload.update({
      collection: 'forms',
      id: formID,
      locale: 'zh',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        fields: chinese.fields,
        submitButtonLabel: chinese.submitButtonLabel,
        confirmationMessage: chinese.confirmationMessage,
      },
    })
  })

  it('upgrades the copied Chinese placeholder without touching custom or blank values', async () => {
    const broken = (english.fields || []).map((field) => {
      if (field.blockType === 'select' && field.name === 'budget') {
        return {
          ...field,
          placeholder: '请选择预算范围',
          options: (field.options || []).map((option) =>
            option.value === 'under-50k' ? { ...option, label: '5 万澳元以下' } : option,
          ),
        }
      }
      if (field.blockType === 'select' && field.name === 'timeline') {
        return { ...field, placeholder: '' }
      }
      if (field.blockType === 'text' && field.name === 'phone') {
        return { ...field, label: 'Studio desk' }
      }
      if (field.blockType === 'text' && field.name === 'name') {
        return { ...field, label: '姓名' }
      }
      return field
    })
    await payload.update({
      collection: 'forms',
      id: formID,
      locale: 'en',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: { fields: broken, submitButtonLabel: '提交咨询 →' },
    })

    expect(await repairEnquiryLocaleLeak(payload)).toContain('repaired')
    expect(await repairEnquiryLocaleLeak(payload)).toContain('kept')

    const en = await loadEnquiryForm(payload, 'en')
    const zh = await loadEnquiryForm(payload, 'zh')
    expect(en?.fields.find((field) => field.name === 'budget')?.placeholder).toBe('Select budget range')
    expect(en?.fields.find((field) => field.name === 'timeline')?.placeholder || '').toBe('')
    expect(en?.fields.find((field) => field.name === 'phone')?.label).toBe('Studio desk')
    expect(en?.fields.find((field) => field.name === 'name')?.label).toBe('Name')
    expect(
      en?.fields.find((field) => field.name === 'budget')?.options?.find((option) => option.value === 'under-50k')
        ?.label,
    ).toBe('Under $50,000')
    expect(en?.submitButtonLabel).toBe('Submit Enquiry →')
    expect(zh?.fields.find((field) => field.name === 'budget')?.placeholder).toBe('请选择预算范围')
    expect(zh?.fields.find((field) => field.name === 'name')?.label).toBe('姓名')

    const current = await payload.findByID({
      collection: 'forms',
      id: formID,
      locale: 'en',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    const custom = (current.fields || []).map((field) => {
      if (field.blockType === 'select' && field.name === 'budget') {
        return { ...field, placeholder: 'Editor budget' }
      }
      return field
    })
    const zhCurrent = await payload.findByID({
      collection: 'forms',
      id: formID,
      locale: 'zh',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    const zhCleared = (zhCurrent.fields || []).map((field) => {
      if (field.blockType === 'select' && field.name === 'timeline') return { ...field, placeholder: '' }
      if (field.blockType === 'select' && field.name === 'budget') {
        return { ...field, placeholder: '编辑预算' }
      }
      return field
    })
    await payload.update({
      collection: 'forms',
      id: formID,
      locale: 'en',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: { fields: custom },
    })
    await payload.update({
      collection: 'forms',
      id: formID,
      locale: 'zh',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: { fields: zhCleared },
    })
    await seedEnquiryForm(payload)
    await seedEnquiryForm(payload)

    const enAfter = await loadEnquiryForm(payload, 'en')
    const zhAfter = await loadEnquiryForm(payload, 'zh')
    expect(enAfter?.fields.find((field) => field.name === 'budget')?.placeholder).toBe('Editor budget')
    expect(zhAfter?.fields.find((field) => field.name === 'budget')?.placeholder).toBe('编辑预算')
    expect(zhAfter?.fields.find((field) => field.name === 'timeline')?.placeholder || '').toBe('')
    expect(enAfter?.fields.find((field) => field.name === 'timeline')?.placeholder || '').toBe('')
  })
})
