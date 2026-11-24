import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from './revalidateGlobal'

export const EnquiryPage: GlobalConfig = {
  slug: 'enquiry-page',
  label: 'Enquiry page',
  admin: {
    group: 'Website',
    description:
      'The public introduction beside and above the enquiry form. Questions, options, and the submit button are edited on the Enquiry form.',
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal('enquiry-page')] },
  fields: [
    {
      name: 'contentSeeded',
      type: 'checkbox',
      defaultValue: false,
      admin: { hidden: true, readOnly: true },
    },
    { name: 'overlayEyebrow', type: 'text', localized: true, label: 'Image eyebrow' },
    { name: 'overlayTitle', type: 'textarea', localized: true, label: 'Image heading' },
    { name: 'overlayAccent', type: 'text', localized: true, label: 'Image heading accent' },
    { name: 'overlayBody', type: 'textarea', localized: true, label: 'Image text' },
    { name: 'overlayLine1', type: 'text', localized: true, label: 'Image line 1' },
    { name: 'overlayLine2', type: 'text', localized: true, label: 'Image line 2' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Side image' },
    { name: 'imageAlt', type: 'text', localized: true, label: 'Side image alt text' },
    { name: 'formEyebrow', type: 'text', localized: true, label: 'Form eyebrow' },
    { name: 'formHeading', type: 'text', localized: true, label: 'Form heading' },
    { name: 'formIntro', type: 'textarea', localized: true, label: 'Form introduction' },
    { name: 'metaTitle', type: 'text', localized: true },
    { name: 'metaDescription', type: 'textarea', localized: true },
  ],
}
