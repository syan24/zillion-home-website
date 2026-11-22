import { sql } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

import {
  alignEnquiryScopeFields,
  copyScopeIdentity,
  stampCatalogScopeLabels,
} from '@/lib/enquiry/alignFormScopes'
import { alignEnquirySelectFields } from '@/lib/enquiry/selectCopy'
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

function fillMissingProjectTypeIcons(fields: Form['fields']): {
  fields: Form['fields']
  changed: boolean
} {
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
    await alignStoredEnquiryScopes(payload, existing.docs[0].id)
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
      fields: mergeLocale(created.fields, payloadEnquiryFields('zh')) as NonNullable<
        Form['fields']
      >,
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

/**
 * Replaces the original joinery-only scope list with the three project-type lists,
 * and fills the default Chinese budget and timeline copy.
 * A form whose scope values are no longer that list, and are not the canonical list, is left as edited.
 */
async function alignStoredEnquiryScopes(payload: Payload, id: number) {
  const en = await payload.findByID({
    collection: 'forms',
    id,
    locale: 'en',
    depth: 0,
    overrideAccess: true,
  })
  const zh = await payload.findByID({
    collection: 'forms',
    id,
    locale: 'zh',
    depth: 0,
    overrideAccess: true,
  })
  const aligned = alignEnquiryScopeFields(en.fields, zh.fields)
  const enFields = aligned.changed ? aligned.en : en.fields
  const zhFields = aligned.changed ? aligned.zh : zh.fields
  const selects = alignEnquirySelectFields(enFields, zhFields)
  if (!aligned.changed && !selects.changed) {
    console.log('Enquiry scope options already current.')
    return
  }

  // Payload keeps the existing option rows when the replacement objects have no ids,
  // so the old values survive and the new rows are appended. Delete the rows first.
  if (aligned.replacedLegacy) {
    const scope = (en.fields || []).find(
      (field) => field.blockType === 'checkboxGroup' && field.name === 'scope',
    )
    if (scope?.id) {
      await payload.db.drizzle.execute(sql`
        DELETE FROM forms_blocks_checkbox_group_options WHERE _parent_id = ${scope.id}
      `)
    }
  }

  const updated = aligned.changed
    ? await payload.update({
        collection: 'forms',
        id,
        locale: 'en',
        overrideAccess: true,
        data: { fields: enFields as NonNullable<Form['fields']> },
      })
    : en
  const zhSource = selects.changed ? selects.zh : zhFields
  const withIdentity = copyScopeIdentity(updated.fields, mergeLocale(updated.fields, zhSource))
  const stamped = stampCatalogScopeLabels(withIdentity, 'zh', aligned.replacedLegacy)
  await payload.update({
    collection: 'forms',
    id,
    locale: 'zh',
    overrideAccess: true,
    data: { fields: stamped as NonNullable<Form['fields']> },
  })
  if (aligned.changed) console.log('Enquiry scope options updated for project type.')
  if (selects.changed) console.log('Enquiry budget and timeline copy updated.')
}
