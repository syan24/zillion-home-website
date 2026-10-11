import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'blurb',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short company description under the logo.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
    },
    {
      name: 'serviceLinks',
      type: 'array',
      labels: { singular: 'Service link', plural: 'Service links' },
      maxRows: 8,
      fields: [
        link({
          appearances: false,
          localizedLabel: true,
        }),
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Company links',
      fields: [
        link({
          appearances: false,
          localizedLabel: true,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
