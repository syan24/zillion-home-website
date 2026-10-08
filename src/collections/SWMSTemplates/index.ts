import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { acknowledgementTextField, swmsSectionsField } from '../../fields/swmsContent'

export const SWMSTemplates: CollectionConfig = {
  slug: 'swms-templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'updatedAt'],
    group: 'SWMS',
    description:
      'Reusable SWMS source content. Copy a template onto a Project SWMS, then adjust it.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Template name',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    swmsSectionsField('Questions and notes workers will review after this template is applied.'),
    acknowledgementTextField,
  ],
  timestamps: true,
}
