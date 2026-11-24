import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'contentSeeded',
      type: 'checkbox',
      label: 'Initial navigation saved',
      defaultValue: false,
      admin: {
        hidden: true,
        readOnly: true,
        description:
          'Set when the first seed fills an empty header. Later seeds do not refill fields an editor cleared.',
      },
    },
    {
      name: 'enquiryLabel',
      type: 'text',
      localized: true,
      label: 'Enquiry button',
      admin: { description: 'Shown at the end of the header. Leave empty to hide the button.' },
    },
    {
      name: 'enquiryUrl',
      type: 'text',
      label: 'Enquiry button link',
      defaultValue: '/enquiry',
      admin: { description: 'Path or URL for the header enquiry button.' },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
          localizedLabel: true,
        }),
        {
          name: 'children',
          type: 'array',
          maxRows: 6,
          labels: { singular: 'Dropdown link', plural: 'Dropdown links' },
          admin: {
            initCollapsed: true,
            description: 'Optional. These links open under this item. Leave empty for a normal top-level link.',
          },
          fields: [
            link({
              appearances: false,
              localizedLabel: true,
            }),
          ],
        },
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'secondaryNavItems',
      type: 'array',
      labels: { singular: 'Secondary nav item', plural: 'Secondary nav items' },
      fields: [
        link({
          appearances: false,
          localizedLabel: true,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description: 'Shown in the quieter group beside the primary navigation. Projects and About live here.',
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
