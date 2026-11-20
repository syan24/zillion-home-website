// @vitest-environment node

import { sql } from '@payloadcms/db-postgres'
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '@payload-config'

import type { Form } from '@/payload-types'
import { scopeCatalog } from '@/lib/enquiry/scopes'
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
    const form = found.docs[0]
    if (!form) throw new Error('Enquiry form is missing. Run pnpm seed:demo first.')
    formID = form.id

    const scope = form.fields?.find(
      (field) => field.blockType === 'checkboxGroup' && field.name === 'scope',
    )
    if (scope?.id) {
      await payload.db.drizzle.execute(sql`
        DELETE FROM forms_blocks_checkbox_group_options WHERE _parent_id = ${scope.id}
      `)
    }
    const legacy = (form.fields || []).map((field) =>
      field.blockType === 'checkboxGroup' && field.name === 'scope'
        ? { ...field, options: legacyOptions }
        : field,
    )
    await payload.update({
      collection: 'forms',
      id: formID,
      locale: 'en',
      overrideAccess: true,
      data: { fields: legacy as NonNullable<Form['fields']> },
    })
    const zh = await payload.findByID({
      collection: 'forms',
      id: formID,
      locale: 'zh',
      depth: 0,
      overrideAccess: true,
    })
    const zhLegacy = (zh.fields || []).map((field) =>
      field.blockType === 'checkboxGroup' && field.name === 'scope'
        ? {
            ...field,
            options: (field.options || []).map((option) => ({ ...option, label: '旧选项' })),
          }
        : field,
    )
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
    await seedEnquiryForm(payload)
  })

  it('replaces the stored joinery-only options and keeps other Chinese labels', async () => {
    await seedEnquiryForm(payload)
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
    ).toBe('新建住宅')
    expect(scopeOptions(zh.fields).some((option) => option.label === '旧选项')).toBe(false)
    const name = zh.fields?.find((field) => field.blockType === 'text' && field.name === 'name')
    expect(name && 'label' in name ? name.label : '').toBe('姓名')

    await seedEnquiryForm(payload)
    const again = await payload.findByID({
      collection: 'forms',
      id: formID,
      locale: 'en',
      depth: 0,
      overrideAccess: true,
    })
    expect(scopeOptions(again.fields).map((option) => option.value)).toEqual(
      scopeCatalog.map((item) => item.value),
    )
  })
})
