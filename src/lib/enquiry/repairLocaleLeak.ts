import type { Payload } from 'payload'

import {
  defaultEnquiryFormFields,
  enquiryConfirmationText,
  enquirySubmitLabel,
} from '@/lib/enquiry/defaultForm'
import type { Form } from '@/payload-types'

/**
 * Select placeholders used to be one shared column. Saving the Chinese form
 * wrote the Chinese demo string into that column, and the locale migration
 * copied it onto the English row as well. These are the only strings this
 * repair will replace, and only when they are stored on the English locale.
 */
const earlierChinesePlaceholders: Record<string, readonly string[]> = {
  budget: ['选择大概预算'],
  timeline: ['选择预计时间'],
}

type Copy = { en: string; zh: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function catalogField(name: string) {
  return defaultEnquiryFormFields.find((field) => field.name === name)
}

function leakedEnglish(value: unknown, copy: Copy | undefined, extraZh: readonly string[] = []) {
  if (typeof value !== 'string') return null
  const stored = value.trim()
  if (!stored || !copy || stored === copy.en) return null
  if (stored === copy.zh || extraZh.includes(stored)) return copy.en
  return null
}

function plainText(value: unknown): string {
  if (!isRecord(value)) return ''
  const own = typeof value.text === 'string' ? value.text : ''
  const nested = Array.isArray(value.children) ? value.children.map(plainText).join('') : ''
  const root = isRecord(value.root) ? plainText(value.root) : ''
  return `${own}${nested}${root}`
}

function confirmation(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
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

export type EnquiryLocaleRepair = {
  changed: boolean
  fields: unknown
  submitButtonLabel: string | null | undefined
  confirmationMessage: unknown
}

/**
 * Replaces an English enquiry string only when it is exactly a known Chinese
 * demo string for that same field. Custom wording and blanks stay as saved.
 * Chinese rows are not written.
 */
export function repairLeakedEnquiryCopy(input: {
  fields: unknown
  submitButtonLabel?: string | null
  confirmationMessage?: unknown
}): EnquiryLocaleRepair {
  let changed = false
  const fields = Array.isArray(input.fields)
    ? input.fields.map((field) => {
        if (!isRecord(field) || typeof field.name !== 'string') return field
        const catalog = catalogField(field.name)
        if (!catalog) return field
        let fieldChanged = false
        const next: Record<string, unknown> = { ...field }
        const label = leakedEnglish(field.label, catalog.label)
        if (label) {
          next.label = label
          fieldChanged = true
        }
        const placeholder = leakedEnglish(
          field.placeholder,
          catalog.placeholder,
          earlierChinesePlaceholders[field.name] || [],
        )
        if (placeholder) {
          next.placeholder = placeholder
          fieldChanged = true
        }
        if (Array.isArray(field.options) && catalog.options) {
          let optionsChanged = false
          const options = field.options.map((option) => {
            if (!isRecord(option) || typeof option.value !== 'string') return option
            const item = catalog.options?.find((entry) => entry.value === option.value)
            const optionLabel = leakedEnglish(option.label, item?.label)
            if (!optionLabel) return option
            optionsChanged = true
            return { ...option, label: optionLabel }
          })
          if (optionsChanged) {
            next.options = options
            fieldChanged = true
          }
        }
        if (!fieldChanged) return field
        changed = true
        return next
      })
    : input.fields

  let submitButtonLabel = input.submitButtonLabel
  const submit = leakedEnglish(input.submitButtonLabel, enquirySubmitLabel)
  if (submit) {
    submitButtonLabel = submit
    changed = true
  }

  let confirmationMessage = input.confirmationMessage
  if (plainText(input.confirmationMessage).trim() === enquiryConfirmationText.zh) {
    confirmationMessage = confirmation(enquiryConfirmationText.en)
    changed = true
  }

  return { changed, fields, submitButtonLabel, confirmationMessage }
}

/** One-off used by the migration. A later seed does not call this. */
export async function repairEnquiryLocaleLeak(payload: Payload) {
  const existing = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { enquiryForm: { equals: true } },
  })
  const form = existing.docs[0]
  if (!form) return 'enquiry locales: no form yet'

  const en = await payload.findByID({
    collection: 'forms',
    id: form.id,
    locale: 'en',
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })
  const repaired = repairLeakedEnquiryCopy({
    fields: en.fields,
    submitButtonLabel: en.submitButtonLabel,
    confirmationMessage: en.confirmationMessage,
  })
  if (!repaired.changed) return 'enquiry locales: kept'

  await payload.update({
    collection: 'forms',
    id: form.id,
    locale: 'en',
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: {
      fields: repaired.fields as NonNullable<Form['fields']>,
      submitButtonLabel: repaired.submitButtonLabel,
      confirmationMessage: repaired.confirmationMessage as Form['confirmationMessage'],
    },
  })
  return 'enquiry locales: repaired known Chinese demo strings on English'
}
