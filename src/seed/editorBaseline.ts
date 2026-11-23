import { sql } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

import {
  alignEnquiryScopeFields,
  copyScopeIdentity,
  stampCatalogScopeLabels,
} from '@/lib/enquiry/alignFormScopes'
import { alignEnquirySelectFields } from '@/lib/enquiry/selectCopy'
import type { Form } from '@/payload-types'
import { mergeLocale } from '@/seed/localeCopy'
import { applyWebsiteBaseline } from '@/seed/website'

/**
 * Last automatic rewrite of pre-feedback website and enquiry copy.
 * Deploy runs this once, from the migration. Later seeds do not call it.
 * A second call leaves custom labels, project types, and corrected copy in place.
 */
export async function applyEditorBaseline(payload: Payload) {
  const pages = await applyWebsiteBaseline(payload)
  const enquiry = await applyEnquiryBaseline(payload)
  return [...pages, ...enquiry]
}

async function applyEnquiryBaseline(payload: Payload) {
  const existing = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { enquiryForm: { equals: true } },
  })
  const form = existing.docs[0]
  if (!form) return ['enquiry form: none yet']

  const summary: string[] = []
  const en = await payload.findByID({
    collection: 'forms',
    id: form.id,
    locale: 'en',
    depth: 0,
    overrideAccess: true,
  })
  const zh = await payload.findByID({
    collection: 'forms',
    id: form.id,
    locale: 'zh',
    depth: 0,
    fallbackLocale: false,
    overrideAccess: true,
  })
  const aligned = alignEnquiryScopeFields(en.fields, zh.fields)
  const enFields = aligned.changed ? aligned.en : en.fields
  const zhFields = aligned.changed ? aligned.zh : zh.fields
  const selects = alignEnquirySelectFields(enFields, zhFields)
  if (!aligned.changed && !selects.changed) {
    summary.push('enquiry form: editor fields kept')
    return summary
  }

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

  const enToSave = selects.changed ? selects.en : enFields
  const updated =
    aligned.changed || selects.changed
      ? await payload.update({
          collection: 'forms',
          id: form.id,
          locale: 'en',
          overrideAccess: true,
          data: { fields: enToSave as NonNullable<Form['fields']> },
        })
      : en
  const zhSource = selects.changed ? selects.zh : zhFields
  const withIdentity = copyScopeIdentity(updated.fields, mergeLocale(updated.fields, zhSource))
  const stamped = stampCatalogScopeLabels(withIdentity, 'zh', aligned.replacedLegacy)
  await payload.update({
    collection: 'forms',
    id: form.id,
    locale: 'zh',
    overrideAccess: true,
    data: { fields: stamped as NonNullable<Form['fields']> },
  })
  summary.push('enquiry form: baseline applied once')
  return summary
}
