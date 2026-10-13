import crypto from 'crypto'
import type { CollectionConfig, FieldHook } from 'payload'

import { authenticated } from '../../access/authenticated'
import { exportSWMSRegister } from './exportRegister'
import { rejectAcknowledgementDelete, rejectAcknowledgementUpdate } from './hooks/appendOnly'

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
  labels: {
    singular: 'SWMS acknowledgement',
    plural: 'SWMS register',
  },
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
      'Signed worker records. Filter by project, Project SWMS, version, worker name, or signed date, then export the current list as CSV. Records are append-only and stay on the SWMS version that was signed.',
    components: {
      beforeListTable: ['@/components/SWMS/ExportRegisterButton'],
    },
  },
  access: {
    create: () => false,
    delete: () => false,
    read: authenticated,
    update: () => false,
  },
  defaultSort: '-signedAt',
  endpoints: [
    {
      path: '/export',
      method: 'get',
      handler: exportSWMSRegister,
    },
  ],
  hooks: {
    beforeChange: [rejectAcknowledgementUpdate],
    beforeDelete: [rejectAcknowledgementDelete],
  },
  fields: [
    {
      name: 'submissionRef',
      type: 'text',
      unique: true,
      index: true,
      label: 'Submission ref',
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
          label: 'Project',
          admin: { width: '50%' },
        },
        {
          name: 'projectSwms',
          type: 'relationship',
          relationTo: 'project-swms',
          required: true,
          hasMany: false,
          index: true,
          label: 'Project SWMS',
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
      label: 'Version label',
      admin: {
        description: 'Exact version the worker signed. The list shows that version’s label.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'workerName',
          type: 'text',
          required: true,
          label: 'Worker name',
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
      admin: {
        disableListColumn: true,
      },
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
        disableListColumn: true,
        components: {
          Field: '@/components/SWMS/SignaturePreviewField',
        },
      },
    },
    {
      name: 'signedAt',
      type: 'date',
      required: true,
      label: 'Signed at',
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
