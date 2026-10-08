import crypto from 'crypto'
import type { CollectionConfig, FieldHook } from 'payload'

import { authenticated } from '../../access/authenticated'

const generateSubmissionRef: FieldHook = ({ operation, value }) => {
  if (operation === 'create' && (typeof value !== 'string' || value.trim() === '')) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = crypto.randomBytes(4).toString('hex').toUpperCase()
    return `ACK-${date}-${random}`
  }
  return value
}

export const SWMSAcknowledgements: CollectionConfig = {
  slug: 'swms-acknowledgements',
  admin: {
    useAsTitle: 'submissionRef',
    defaultColumns: ['submissionRef', 'workerName', 'project', 'swmsVersion', 'signedAt'],
    listSearchableFields: [
      'submissionRef',
      'workerName',
      'workerCompany',
      'workerPhone',
      'workerTrade',
    ],
    group: 'SWMS',
    description:
      'Worker signatures. Records are append-only and point at the exact SWMS version signed.',
  },
  access: {
    create: authenticated,
    delete: () => false,
    read: authenticated,
    update: () => false,
  },
  fields: [
    {
      name: 'submissionRef',
      type: 'text',
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [generateSubmissionRef],
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'clientSubmissionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description:
          'Idempotency key from the worker form. A repeated submit returns the original record.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'project',
          type: 'relationship',
          relationTo: 'projects',
          required: true,
          hasMany: false,
          index: true,
          admin: { width: '50%' },
        },
        {
          name: 'projectSwms',
          type: 'relationship',
          relationTo: 'project-swms',
          required: true,
          hasMany: false,
          index: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'swmsVersion',
      type: 'relationship',
      relationTo: 'swms-versions',
      required: true,
      hasMany: false,
      index: true,
      admin: {
        description: 'Exact version the worker signed.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'workerName',
          type: 'text',
          required: true,
          label: 'Worker full name',
          admin: { width: '50%' },
        },
        {
          name: 'workerCompany',
          type: 'text',
          label: 'Company / employer',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'workerPhone',
          type: 'text',
          label: 'Contact phone',
          admin: { width: '50%' },
        },
        {
          name: 'workerTrade',
          type: 'text',
          label: 'Trade / role',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'responses',
      type: 'json',
      required: true,
      label: 'Question responses',
    },
    {
      name: 'acknowledgementAccepted',
      type: 'checkbox',
      required: true,
      label: 'Acknowledgement accepted',
    },
    {
      name: 'signature',
      type: 'textarea',
      required: true,
      admin: {
        components: {
          Field: '@/components/SWMS/SignaturePreviewField',
        },
      },
    },
    {
      name: 'signedAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'ipAddress',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'userAgent',
          type: 'text',
          admin: { readOnly: true },
        },
      ],
    },
  ],
  timestamps: true,
}
