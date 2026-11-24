import type { GlobalConfig } from 'payload'

import { projectTypeOptions } from '@/lib/projects/types'
import { revalidateGlobal } from './revalidateGlobal'

export const ProjectsPage: GlobalConfig = {
  slug: 'projects-page',
  label: 'Projects page',
  admin: {
    group: 'Website',
    description:
      'Public portfolio introduction, gallery hero, view labels, project-type chip labels, and the closing band. Room chips come from Spaces.',
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal('projects-page')] },
  fields: [
    {
      name: 'contentSeeded',
      type: 'checkbox',
      defaultValue: false,
      admin: { hidden: true, readOnly: true },
    },
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'textarea', localized: true },
    { name: 'headingAccent', type: 'text', localized: true, label: 'Heading accent' },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'hero',
      type: 'upload',
      relationTo: 'media',
      label: 'Gallery hero',
      admin: { description: 'Large image at the top of the projects page. Leave empty for no photo.' },
    },
    { name: 'heroAlt', type: 'text', localized: true, label: 'Gallery hero alt text' },
    { name: 'byProject', type: 'text', localized: true, label: 'By project label' },
    { name: 'byRoom', type: 'text', localized: true, label: 'By room label' },
    { name: 'typeHeading', type: 'text', localized: true, label: 'Project type heading' },
    { name: 'filterHeading', type: 'text', localized: true, label: 'Filter heading' },
    {
      name: 'types',
      type: 'array',
      labels: { singular: 'Project type', plural: 'Project types' },
      admin: {
        description:
          'Public names for the existing project type values. The value stays in the address (?type=residential) and on each project. Drag to reorder. Turn Active off to hide a chip and filter.',
      },
      fields: [
        {
          name: 'value',
          type: 'select',
          required: true,
          options: projectTypeOptions.map((option) => ({ label: option.value, value: option.value })),
        },
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'active', type: 'checkbox', defaultValue: true },
      ],
    },
    { name: 'bandEyebrow', type: 'text', localized: true, label: 'Closing eyebrow' },
    { name: 'bandHeading', type: 'text', localized: true, label: 'Closing heading' },
    { name: 'bandAccent', type: 'text', localized: true, label: 'Closing accent' },
    { name: 'enquireLabel', type: 'text', localized: true, label: 'Closing button' },
    {
      name: 'enquireUrl',
      type: 'text',
      label: 'Closing button link',
      defaultValue: '/enquiry',
    },
    { name: 'metaTitle', type: 'text', localized: true },
    { name: 'metaDescription', type: 'textarea', localized: true },
  ],
}
