import type { Payload } from 'payload'

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

/** Creates the public enquiry form once. Later Admin edits are left in place. */
export async function seedEnquiryForm(payload: Payload) {
  const existing = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { enquiryForm: { equals: true } },
  })

  if (existing.docs[0]) {
    console.log('Enquiry form already exists.')
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
