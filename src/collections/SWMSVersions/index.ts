import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { acknowledgementTextField, swmsSectionsField } from '../../fields/swmsContent'
import { protectPublishedVersion } from './hooks/protectPublishedVersion'

export const SWMSVersions: CollectionConfig = {
  slug: 'swms-versions',
  admin: {
    useAsTitle: 'versionLabel',
    defaultColumns: ['versionLabel', 'projectSwms', 'status', 'publishedAt'],
    group: 'SWMS',
    description:
      'Immutable snapshots. Create a new version by editing and saving the active Project SWMS.',
  },
  access: {
    create: authenticated,
    delete: () => false,
    read: authenticated,
    update: authenticated,
  },
  hooks: {
    beforeChange: [protectPublishedVersion],
  },
  fields: [
    {
      name: 'versionLabel',
      type: 'text',
      required: true,
      admin: {
        description: 'Example: v1.0',
      },
    },
    {
      name: 'projectSwms',
      type: 'relationship',
      relationTo: 'project-swms',
      required: true,
      hasMany: false,
      index: true,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      hasMany: false,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Superseded', value: 'superseded' },
      ],
    },
    swmsSectionsField(
      'Snapshot of the sections a worker signed. Published versions cannot be edited.',
    ),
    acknowledgementTextField,
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'supersededAt',
      type: 'date',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'publishedBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
