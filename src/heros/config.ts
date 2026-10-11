import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Builder (Homepage)',
          value: 'builder',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'builder',
      },
    },
    {
      name: 'headline',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'builder',
        description: 'Use a new line for a line break.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'builder',
      },
    },
    {
      name: 'badgePrimary',
      type: 'text',
      label: 'Badge line 1',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'builder',
      },
    },
    {
      name: 'badgeSecondary',
      type: 'text',
      label: 'Badge line 2',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'builder',
      },
    },
    {
      name: 'badgeMuted',
      type: 'text',
      label: 'Badge line 3',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'builder',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      admin: {
        condition: (_, siblingData) => siblingData?.type !== 'builder',
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'builder'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
