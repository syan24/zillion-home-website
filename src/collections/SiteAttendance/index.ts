import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { rejectRecordDelete, rejectRecordUpdate } from '../../hooks/appendOnly'

export const SiteAttendance: CollectionConfig = {
  slug: 'site-attendance',
  labels: {
    singular: 'Site attendance',
    plural: 'Site attendance',
  },
  admin: {
    useAsTitle: 'workerName',
    defaultColumns: ['workerName', 'direction', 'project', 'recordedAt'],
    group: 'SWMS',
    description: 'Daily sign-in and sign-out for a project. Workers are matched by name and phone. Records are append-only.',
  },
  access: {
    create: () => false,
    delete: () => false,
    read: authenticated,
    update: () => false,
  },
  defaultSort: '-recordedAt',
  hooks: {
    beforeChange: [rejectRecordUpdate('Attendance')],
    beforeDelete: [rejectRecordDelete('Attendance')],
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
      name: 'projectSwms',
      type: 'relationship',
      relationTo: 'project-swms',
      required: true,
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
      name: 'direction',
      type: 'select',
      required: true,
      options: [
        { label: 'Sign in', value: 'in' },
        { label: 'Sign out', value: 'out' },
      ],
    },
    {
      name: 'recordedAt',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
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
