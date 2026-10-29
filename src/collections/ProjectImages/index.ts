import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { revalidatePortfolio } from '../../hooks/revalidatePortfolio'

export const ProjectImages: CollectionConfig = {
  slug: 'project-images',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'displayOrder', 'published', 'allowDownload'],
    group: 'Projects',
    description:
      'Add several photos at once from the project page. Lower display order appears first. Unpublish an image to hide it without deleting the file.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req }) => (req.user ? true : { published: { equals: true } }),
    update: authenticated,
  },
  defaultSort: 'displayOrder',
  fields: [
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      index: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'styles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
    },
    {
      name: 'spaces',
      type: 'relationship',
      relationTo: 'spaces',
      hasMany: true,
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first within the project.',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show on the website',
    },
    {
      name: 'allowDownload',
      type: 'checkbox',
      defaultValue: true,
      label: 'Allow download',
      admin: {
        description: 'Shows a download action on the public project page.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePortfolio],
  },
}
