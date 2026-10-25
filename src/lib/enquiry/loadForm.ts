import type { Payload, TypedLocale } from 'payload'

import { publicEnquiryFields } from '@/lib/enquiry/defaultForm'
import { isEnquiryIcon } from '@/lib/enquiry/icons'
import type { PublicEnquiryField } from '@/lib/enquiry/validate'

export type PublicEnquiryForm = {
  submitButtonLabel: string
  fields: PublicEnquiryField[]
}

export async function loadEnquiryForm(
  payload: Payload,
  locale: TypedLocale,
): Promise<PublicEnquiryForm | null> {
  const found = await payload.find({
    collection: 'forms',
    depth: 1,
    limit: 1,
    locale,
    overrideAccess: true,
    sort: 'createdAt',
    where: { enquiryForm: { equals: true } },
  })
  const form = found.docs[0]
  if (!form) return null

  const fields = Array.isArray(form.fields)
    ? form.fields.flatMap((field) => toPublicField(field, locale === 'zh' ? 'zh' : 'en'))
    : []
  return {
    submitButtonLabel: typeof form.submitButtonLabel === 'string' ? form.submitButtonLabel : '',
    fields,
  }
}

function mediaUrl(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  const url = (value as { url?: unknown }).url
  return typeof url === 'string' && url ? url : undefined
}

/**
 * Form placeholders are not localized. Seeding Chinese after English stores the
 * Chinese string for both locales. When that happens, show the copy for the
 * page locale. A custom placeholder is left as written.
 */
function placeholderForLocale(name: string | undefined, placeholder: string | undefined, locale: 'en' | 'zh') {
  if (!name || !placeholder) return placeholder
  const current = publicEnquiryFields(locale).find((field) => field.name === name)?.placeholder
  const other = publicEnquiryFields(locale === 'en' ? 'zh' : 'en').find((field) => field.name === name)?.placeholder
  if (current && other && placeholder === other) return current
  return placeholder
}

function toPublicField(field: unknown, locale: 'en' | 'zh'): PublicEnquiryField[] {
  if (!field || typeof field !== 'object') return []
  const block = field as Record<string, unknown>
  const blockType = typeof block.blockType === 'string' ? block.blockType : ''
  if (!blockType) return []

  const options = Array.isArray(block.options)
    ? block.options.flatMap((option) => {
        if (!option || typeof option !== 'object') return []
        const record = option as Record<string, unknown>
        const value = typeof record.value === 'string' ? record.value : ''
        if (!value) return []
        const icon = isEnquiryIcon(record.icon) ? record.icon : undefined
        const iconUrl = mediaUrl(record.iconImage)
        return [
          {
            label: typeof record.label === 'string' ? record.label : value,
            value,
            ...(icon ? { icon } : {}),
            ...(iconUrl ? { iconUrl } : {}),
          },
        ]
      })
    : undefined

  const mimeTypes = Array.isArray(block.mimeTypes)
    ? block.mimeTypes.flatMap((item) => {
        if (!item || typeof item !== 'object') return []
        const mimeType = (item as { mimeType?: unknown }).mimeType
        return typeof mimeType === 'string' && mimeType ? [mimeType] : []
      })
    : undefined

  return [
    {
      blockType,
      name: typeof block.name === 'string' ? block.name : undefined,
      label: typeof block.label === 'string' ? block.label : undefined,
      required: block.required === true,
      placeholder: placeholderForLocale(
        typeof block.name === 'string' ? block.name : undefined,
        typeof block.placeholder === 'string' ? block.placeholder : undefined,
        locale,
      ),
      width: typeof block.width === 'number' ? block.width : undefined,
      options,
      multiple: typeof block.multiple === 'boolean' ? block.multiple : undefined,
      maxFileSize: typeof block.maxFileSize === 'number' ? block.maxFileSize : undefined,
      mimeTypes,
      message: block.message,
    },
  ]
}
