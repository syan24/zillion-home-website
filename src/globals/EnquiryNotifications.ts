import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const EnquiryNotifications: GlobalConfig = {
  slug: 'enquiry-notifications',
  label: 'Enquiry notifications',
  admin: {
    group: 'Settings',
    description:
      'Who receives a new enquiry, and the From address. Leave a field empty to use ENQUIRY_NOTIFY_TO or ENQUIRY_NOTIFY_FROM. API keys and SMTP passwords stay in the host environment and are not stored here.',
  },
  access: {
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'notifyTo',
      type: 'textarea',
      label: 'Notification recipients',
      admin: {
        description: 'One or more email addresses, separated by commas. Not shown on the public site.',
      },
    },
    {
      name: 'notifyFrom',
      type: 'text',
      label: 'Notification from',
      admin: {
        description: 'From address, for example Name <hello@example.com>. Not shown on the public site.',
      },
    },
  ],
}
