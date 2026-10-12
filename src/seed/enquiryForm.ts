import type { Payload } from 'payload'

import { defaultProjectTypeIcons } from '@/lib/enquiry/icons'
import {
  enquiryConfirmationText,
  enquirySubmitLabel,
  payloadEnquiryFields,
} from '@/lib/enquiry/defaultForm'
import type { Form } from '@/payload-types'
import { mergeLocale } from '@/seed/localeCopy'

function lexical(text: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            {
              mode: 'normal',
              text,
              type: 'text',
              style: '',
              detail: 0,
              format: 0,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

function fillMissingProjectTypeIcons(fields: Form['fields']): { fields: Form['fields']; changed: boolean } {
  if (!fields) return { fields, changed: false }
  let changed = false
  const next = fields.map((field) => {
    if (
      !field ||
      (field.blockType !== 'radio' && field.blockType !== 'select') ||
      field.name !== 'projectType' ||
      !field.options
    ) {
      return field
    }
    const options = field.options.map((option) => {
      const icon = defaultProjectTypeIcons[option.value]
      if (!icon || option.icon || option.iconImage) return option
      changed = true
      return { ...option, icon }
    })
    return { ...field, options }
  })
  return { fields: next, changed }
}

/**
 * Creates the public enquiry form once.
 * An existing form keeps staff edits. Missing project-type icons are filled for the original three values.
 */
export async function seedEnquiryForm(payload: Payload) {
  const existing = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { enquiryForm: { equals: true } },
  })

  if (existing.docs[0]) {
    await backfillProjectTypeIcons(payload, existing.docs[0].id)
    return
  }

  const created = await payload.create({
    collection: 'forms',
    locale: 'en',
    overrideAccess: true,
    data: {
      title: 'Enquiry',
      enquiryForm: true,
      fields: payloadEnquiryFields('en') as NonNullable<Form['fields']>,
      submitButtonLabel: enquirySubmitLabel.en,
      confirmationType: 'message',
      confirmationMessage: lexical(enquiryConfirmationText.en),
    },
  })

  await payload.update({
    collection: 'forms',
    id: created.id,
    locale: 'zh',
    overrideAccess: true,
    data: {
      fields: mergeLocale(created.fields, payloadEnquiryFields('zh')) as NonNullable<Form['fields']>,
      submitButtonLabel: enquirySubmitLabel.zh,
      confirmationMessage: lexical(enquiryConfirmationText.zh),
    },
  })
  console.log('Enquiry form created.')
}

async function backfillProjectTypeIcons(payload: Payload, id: number) {
  const en = await payload.findByID({
    collection: 'forms',
    id,
    locale: 'en',
    depth: 0,
    overrideAccess: true,
  })
  const filled = fillMissingProjectTypeIcons(en.fields)
  if (!filled.changed || !filled.fields) {
    console.log('Enquiry form already exists.')
    return
  }

  const zh = await payload.findByID({
    collection: 'forms',
    id,
    locale: 'zh',
    depth: 0,
    overrideAccess: true,
  })
  const updated = await payload.update({
    collection: 'forms',
    id,
    locale: 'en',
    overrideAccess: true,
    data: { fields: filled.fields },
  })
  await payload.update({
    collection: 'forms',
    id,
    locale: 'zh',
    overrideAccess: true,
    data: {
      fields: mergeLocale(updated.fields, zh.fields) as NonNullable<Form['fields']>,
    },
  })
  console.log('Enquiry form project-type icons set.')
}
