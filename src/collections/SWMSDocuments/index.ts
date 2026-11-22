import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { tradeSelectOptions } from '../../lib/swms/trades'
import { prepareSwmsDocument } from './hooks/prepareSwmsDocument'

export const SWMSDocuments: CollectionConfig = {
  slug: 'swms-documents',
  labels: {
    singular: 'SWMS document',
    plural: 'SWMS documents',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'versionLabel', 'status', 'updatedAt'],
    group: 'SWMS',
    description:
      'Upload one PDF per SWMS and choose the trades it applies to. Replacing the PDF publishes the next file version. Workers who already confirmed the previous file only review the new version.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  hooks: {
    beforeChange: [prepareSwmsDocument],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Document title',
      admin: {
        description: 'Shown to workers, for example “SWMS - Working at heights”.',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      index: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'swms-files',
      required: true,
      label: 'SWMS PDF',
      admin: {
        description: 'PDF only. Upload a new file to publish the next version.',
      },
    },
    {
      name: 'trades',
      type: 'select',
      hasMany: true,
      required: true,
      options: tradeSelectOptions,
      admin: {
        description: 'Workers who select one of these trades must review this file.',
      },
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
      admin: {
        description: 'Archived files stay on past confirmations and are hidden from workers.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers are shown first. Workers confirm files in this order.',
      },
    },
    {
      name: 'fileVersion',
      type: 'number',
      defaultValue: 1,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Increases when the PDF is replaced.',
      },
    },
    {
      name: 'versionLabel',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'accessToken',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Unguessable token used to open this PDF from the project QR link.',
      },
    },
  ],
  timestamps: true,
}
