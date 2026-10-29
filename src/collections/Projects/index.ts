import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { revalidatePortfolio } from '../../hooks/revalidatePortfolio'
import { addProjectGalleryEndpoint } from './addGalleryImages'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'suburb', '_status', 'showAddressPublicly'],
    group: 'Projects',
    description:
      'One project record for the public portfolio and for SWMS. Publish it to show the case on the website. SWMS can use the project either way.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  endpoints: [
    {
      path: '/:id/gallery',
      method: 'post',
      handler: addProjectGalleryEndpoint,
    },
  ],
  defaultSort: 'displayOrder',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Project name',
    },
    slugField({ required: false }),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'residential',
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
      ],
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      label: 'Short description',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Public description',
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      label: 'Project address',
      access: {
        read: ({ req, doc }) => {
          if (req.user) return true
          return Boolean((doc as { showAddressPublicly?: boolean } | undefined)?.showAddressPublicly)
        },
      },
      admin: {
        description:
          'Full site address. Workers see this on the SWMS flow. The public website shows it only when the checkbox below is on.',
      },
    },
    {
      name: 'suburb',
      type: 'text',
      label: 'Public location',
      admin: {
        description: 'Suburb or general location. Shown on the website when the full address is hidden.',
      },
    },
    {
      name: 'showAddressPublicly',
      type: 'checkbox',
      label: 'Show full address on the public website',
      defaultValue: false,
      admin: {
        description: 'The SWMS worker flow always shows the address for the bound project.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured image',
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
    {
      name: 'projectStatus',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Project status',
      admin: {
        position: 'sidebar',
        description: 'Operational status. Publishing the document is what shows it on the website.',
      },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'On hold', value: 'on-hold' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Internal summary',
      admin: {
        description: 'Not shown on the public website.',
      },
    },
    {
      name: 'bulkGalleryUpload',
      type: 'ui',
      label: 'Add photos',
      admin: {
        components: {
          Field: '@/components/Projects/BulkGalleryUpload',
        },
      },
    },
    {
      name: 'gallery',
      type: 'join',
      collection: 'project-images',
      on: 'project',
      admin: {
        description: 'Photos added above appear here. Change display order on a photo to reorder the gallery.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePortfolio],
  },
  versions: {
    drafts: true,
  },
}
