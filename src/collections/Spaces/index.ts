import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Spaces: CollectionConfig = {
  slug: 'spaces',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'active', 'displayOrder'],
    group: 'Projects',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req }) => (req.user ? true : { active: { equals: true } }),
    update: authenticated,
  },
  defaultSort: 'displayOrder',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField(),
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
