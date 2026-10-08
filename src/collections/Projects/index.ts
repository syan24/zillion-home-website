import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'address', 'type', 'projectStatus'],
    group: 'SWMS',
    description:
      'Minimal project records used to bind SWMS. The portfolio slice should extend this collection.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Project name',
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      label: 'Project address',
      admin: {
        description:
          'Full site address. Workers see this on the SWMS flow. It is not a public marketing field.',
      },
    },
    {
      name: 'suburb',
      type: 'text',
      label: 'Suburb / locality',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'residential',
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
      ],
    },
    {
      name: 'projectStatus',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Project status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'On hold', value: 'on-hold' },
      ],
    },
    {
      name: 'showAddressPublicly',
      type: 'checkbox',
      label: 'Show address on the public website',
      defaultValue: false,
      admin: {
        description:
          'Reserved for the public portfolio. The SWMS worker flow always shows the address for the bound project.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Internal summary',
    },
  ],
  timestamps: true,
}
