import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import {
  enquiryLocaleOptions,
  enquiryStatusOptions,
  notificationStatusOptions,
  spaceOptions,
} from '@/lib/enquiry/options'

import { deleteEnquiryFiles } from './hooks/deleteEnquiryFiles'
import { prepareEnquiry } from './hooks/prepareEnquiry'
import { protectEnquiryContent } from './hooks/protectEnquiryContent'

const locked = { readOnly: true }

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'submissionReference',
    defaultColumns: ['submissionReference', 'name', 'projectType', 'status', 'submittedAt', 'email'],
    listSearchableFields: ['submissionReference', 'name', 'email', 'phone', 'address', 'notes'],
    group: 'Enquiries',
    description:
      'Website enquiries. The visitor’s answers stay as submitted. Status, internal notes, and project type detail can be updated. Field labels and options are edited on the Enquiry form.',
  },
  access: {
    create: () => false,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  defaultSort: '-submittedAt',
  fields: [
    {
      name: 'submissionReference',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Reference',
      admin: { ...locked, position: 'sidebar' },
    },
    {
      name: 'clientSubmissionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Idempotency key',
      admin: {
        ...locked,
        position: 'sidebar',
        description: 'Repeated submits with this key return the original enquiry.',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      index: true,
      label: 'Submitted',
      admin: {
        ...locked,
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [...enquiryStatusOptions],
      admin: { position: 'sidebar' },
    },
    {
      name: 'locale',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [...enquiryLocaleOptions],
      label: 'Visitor language',
      admin: { ...locked, position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          maxLength: 120,
          admin: { ...locked, width: '50%' },
        },
        {
          name: 'phone',
          type: 'text',
          maxLength: 40,
          admin: { ...locked, width: '50%' },
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      index: true,
      admin: locked,
    },
    {
      name: 'address',
      type: 'text',
      maxLength: 300,
      label: 'Project address / suburb',
      admin: locked,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'projectType',
          type: 'text',
          index: true,
          label: 'Project type',
          admin: {
            ...locked,
            width: '50%',
            description: 'The option value submitted from the enquiry form.',
          },
        },
        {
          name: 'projectTypeDetail',
          type: 'text',
          maxLength: 300,
          label: 'Project type detail',
          admin: {
            width: '50%',
            description: 'Optional staff note. Public choices are edited on the Enquiry form.',
          },
        },
      ],
    },
    {
      name: 'scope',
      type: 'json',
      label: 'Scope of work',
      admin: {
        ...locked,
        description: 'Option values selected on the enquiry form.',
      },
    },
    {
      name: 'spaces',
      type: 'select',
      hasMany: true,
      options: [...spaceOptions],
      label: 'Spaces',
      admin: {
        ...locked,
        description: 'Copied from kitchen, wardrobe, and bathroom vanity when the visitor selects those scopes.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      maxLength: 5000,
      label: 'Style and notes',
      admin: {
        ...locked,
        description: 'Project description from the form, including style and requirements.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'budgetRange',
          type: 'text',
          label: 'Approximate budget',
          admin: {
            ...locked,
            width: '50%',
            description: 'The option value submitted from the enquiry form.',
          },
        },
        {
          name: 'expectedStart',
          type: 'text',
          label: 'Expected start',
          admin: {
            ...locked,
            width: '50%',
            description: 'The option value submitted from the enquiry form.',
          },
        },
      ],
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'enquiry-files',
      hasMany: true,
      label: 'Attachments',
      admin: locked,
    },
    {
      name: 'additionalAnswers',
      type: 'json',
      label: 'Additional answers',
      admin: {
        ...locked,
        description:
          'Answers to form questions that do not map onto the fields above, including files named on an extra upload question.',
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      maxLength: 5000,
      label: 'Internal notes',
      admin: {
        description: 'Staff notes. Visitors do not see this.',
      },
    },
    {
      name: 'notificationStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [...notificationStatusOptions],
      label: 'Email notification',
      admin: { ...locked, position: 'sidebar' },
    },
    {
      name: 'notificationDetail',
      type: 'textarea',
      label: 'Email detail',
      admin: { ...locked, position: 'sidebar' },
    },
    {
      name: 'submitterIp',
      type: 'text',
      index: true,
      label: 'Submitter IP',
      admin: {
        ...locked,
        position: 'sidebar',
        description: 'Used for the hourly submission limit and spam review.',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      label: 'User agent',
      admin: { ...locked, position: 'sidebar' },
    },
  ],
  hooks: {
    beforeValidate: [prepareEnquiry],
    beforeChange: [protectEnquiryContent],
    beforeDelete: [deleteEnquiryFiles],
  },
  timestamps: true,
}
