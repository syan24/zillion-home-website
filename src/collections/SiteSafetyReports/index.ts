import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { rejectRecordDelete, rejectRecordUpdate } from '../../hooks/appendOnly'

export const SiteSafetyReports: CollectionConfig = {
  slug: 'site-safety-reports',
  labels: {
    singular: 'Site safety report',
    plural: 'Site safety reports',
  },
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['kind', 'workerName', 'project', 'occurredAt'],
    group: 'SWMS',
    description:
      'Incident reports, hazard identifications, and toolbox talks submitted from the site safety menu. Records are append-only.',
  },
  access: {
    create: () => false,
    delete: () => false,
    read: authenticated,
    update: () => false,
  },
  defaultSort: '-occurredAt',
  hooks: {
    beforeChange: [rejectRecordUpdate('Site safety report')],
    beforeDelete: [rejectRecordDelete('Site safety report')],
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Incident report', value: 'incident' },
        { label: 'Hazard identification', value: 'hazard' },
        { label: 'Toolbox talk', value: 'toolbox' },
      ],
    },
    {
      name: 'summary',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'workerName',
          type: 'text',
          required: true,
          label: 'Name 姓名',
          admin: { width: '50%' },
        },
        {
          name: 'workerPhone',
          type: 'text',
          required: true,
          label: 'Phone 电话',
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
      name: 'occurredAt',
      type: 'date',
      required: true,
      label: 'Time 时间',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description 简短说明',
    },
    {
      name: 'attachment',
      type: 'upload',
      relationTo: 'swms-files',
      label: 'Photo / attachment 照片 / 附件',
    },
    {
      name: 'metadata',
      type: 'group',
      fields: [
        { name: 'ipAddress', type: 'text', admin: { readOnly: true } },
        { name: 'userAgent', type: 'text', admin: { readOnly: true } },
      ],
    },
  ],
  timestamps: true,
}
