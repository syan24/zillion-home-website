import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { rejectRecordDelete, rejectRecordUpdate } from '../../hooks/appendOnly'
import { tradeSelectOptions } from '../../lib/swms/trades'

export const SWMSDocumentConfirmations: CollectionConfig = {
  slug: 'swms-document-confirmations',
  labels: {
    singular: 'SWMS confirmation',
    plural: 'SWMS confirmations',
  },
  admin: {
    useAsTitle: 'workerName',
    defaultColumns: ['workerName', 'project', 'document', 'versionLabel', 'confirmedAt'],
    group: 'SWMS',
    description:
      'Each time a worker confirms a SWMS PDF. A later file version is a new row. These records are append-only.',
  },
  access: {
    create: () => false,
    delete: () => false,
    read: authenticated,
    update: () => false,
  },
  defaultSort: '-confirmedAt',
  hooks: {
    beforeChange: [rejectRecordUpdate('SWMS confirmation')],
    beforeDelete: [rejectRecordDelete('SWMS confirmation')],
  },
  fields: [
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      index: true,
    },
    {
      name: 'document',
      type: 'relationship',
      relationTo: 'swms-documents',
      required: true,
      index: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'swms-files',
      required: true,
      label: 'Confirmed PDF',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fileVersion',
          type: 'number',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'versionLabel',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'documentTitle',
      type: 'text',
      required: true,
      label: 'Document title',
    },
    {
      name: 'trades',
      type: 'select',
      hasMany: true,
      options: tradeSelectOptions,
      label: 'Trades',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'workerName',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'workerPhone',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'workerNameKey',
      type: 'text',
      required: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'workerPhoneKey',
      type: 'text',
      required: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'confirmedAt',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'induction',
      options: [
        { label: 'Site induction', value: 'induction' },
        { label: 'Version reconfirm', value: 'reconfirm' },
      ],
    },
  ],
  timestamps: true,
}
