import type { Block } from 'payload'

/** Multi-select checkboxes for the enquiry scope question. Options and labels are edited in Forms. */
export const enquiryCheckboxGroup: Block = {
  slug: 'checkboxGroup',
  labels: {
    singular: 'Checkbox group',
    plural: 'Checkbox groups',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Name',
          admin: { width: '50%' },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          label: 'Label',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          type: 'number',
          label: 'Field width',
          admin: { width: '50%' },
        },
        {
          name: 'required',
          type: 'checkbox',
          label: 'Required',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'options',
      type: 'array',
      label: 'Options',
      labels: { singular: 'Option', plural: 'Options' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              label: 'Label',
              admin: { width: '50%' },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              label: 'Value',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
