import crypto from 'crypto'
import type { CollectionConfig, FieldHook } from 'payload'

import { authenticated } from '../../access/authenticated'
import { acknowledgementTextField, swmsSectionsField } from '../../fields/swmsContent'
import {
  copyTemplateOnCreate,
  lockPublicToken,
  publishActiveVersion,
  requireContentWhenActive,
} from './hooks/publishActiveVersion'

const generatePublicToken: FieldHook = ({ operation, value }) => {
  if (operation === 'create' && (typeof value !== 'string' || value.trim() === '')) {
    return crypto.randomBytes(24).toString('base64url')
  }
  return value
}

export const ProjectSWMS: CollectionConfig = {
  slug: 'project-swms',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'status', 'updatedAt'],
    group: 'SWMS',
    description:
      'Save a draft, then set status to Active. Activation publishes an immutable version and keeps the same worker link.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  hooks: {
    beforeChange: [lockPublicToken, copyTemplateOnCreate, requireContentWhenActive],
    afterChange: [publishActiveVersion],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'SWMS title',
      admin: {
        description: 'Shown to workers, for example “Construction Works SWMS”.',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      hasMany: false,
    },
    {
      name: 'sourceTemplate',
      type: 'relationship',
      relationTo: 'swms-templates',
      hasMany: false,
      admin: {
        description: 'If sections are empty on create, they are copied from this template.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Superseded', value: 'superseded' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        description: 'Workers can open the QR link only while status is Active.',
      },
    },
    {
      name: 'publicToken',
      type: 'text',
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [generatePublicToken],
      },
      admin: {
        readOnly: true,
        position: 'sidebar',
        description:
          'Unguessable token used in the worker URL. It does not change after the first save.',
      },
    },
    {
      name: 'currentVersion',
      type: 'relationship',
      relationTo: 'swms-versions',
      hasMany: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Published version workers sign. Set automatically when the SWMS is active.',
      },
    },
    {
      name: 'activatedAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    swmsSectionsField(
      'Project-specific content. Changing this while the SWMS is Active publishes a new version. Signed records stay on the previous version.',
    ),
    acknowledgementTextField,
    {
      name: 'workerLink',
      type: 'ui',
      label: 'Worker QR link',
      admin: {
        components: {
          Field: '@/components/SWMS/SWMSPublicLinkField',
        },
      },
    },
  ],
  timestamps: true,
}
