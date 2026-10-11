import type { Block, Field } from 'payload'

const imageField = (name = 'image'): Field => ({
  name,
  type: 'upload',
  relationTo: 'media',
})

const imageAltField: Field = {
  name: 'imageAlt',
  type: 'text',
  label: 'Image alt text',
  admin: {
    description: 'Overrides the alt text stored on the media item for this placement.',
  },
}

const linkFields: Field[] = [
  { name: 'label', type: 'text', required: true },
  {
    name: 'href',
    type: 'text',
    required: true,
    admin: { description: 'Path or URL, for example /enquiry or /services#joinery.' },
  },
  {
    name: 'variant',
    type: 'select',
    defaultValue: 'enquiry',
    options: [
      { label: 'Beige enquiry', value: 'enquiry' },
      { label: 'Outline', value: 'outline' },
      { label: 'Charcoal', value: 'default' },
    ],
  },
]

const linksField: Field = {
  name: 'links',
  type: 'array',
  admin: { initCollapsed: true },
  fields: linkFields,
}

const marketingAdmin: Pick<Block, 'admin'> = {
  admin: { group: 'Marketing' },
}

export const PageIntro: Block = {
  slug: 'pageIntro',
  interfaceName: 'PageIntroBlock',
  labels: { singular: 'Page intro', plural: 'Page intros' },
  ...marketingAdmin,
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'text',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Text and image', value: 'split' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'textarea', admin: { description: 'Use a new line for a line break.' } },
    { name: 'headingAccent', type: 'text', label: 'Accent line' },
    { name: 'description', type: 'textarea' },
    imageField(),
    imageAltField,
  ],
}

export const ServiceCards: Block = {
  slug: 'serviceCards',
  interfaceName: 'ServiceCardsBlock',
  labels: { singular: 'Service cards', plural: 'Service cards' },
  ...marketingAdmin,
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'cards',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        imageField(),
        imageAltField,
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text', admin: { description: 'Optional second line, such as a Chinese label.' } },
        { name: 'description', type: 'textarea' },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}

export const SplitFeature: Block = {
  slug: 'splitFeature',
  interfaceName: 'SplitFeatureBlock',
  labels: { singular: 'Split feature', plural: 'Split features' },
  ...marketingAdmin,
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'briefs',
      required: true,
      options: [
        { label: 'Image and thumbnail list', value: 'briefs' },
        { label: 'Checklist and image', value: 'checklist' },
        { label: 'Dark copy and image', value: 'darkCopy' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'textarea' },
    { name: 'headingAccent', type: 'text', label: 'Accent line' },
    { name: 'body', type: 'textarea', admin: { description: 'Separate paragraphs with a blank line.' } },
    imageField(),
    imageAltField,
    {
      name: 'items',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        imageField(),
        imageAltField,
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'textarea' },
      ],
    },
    linksField,
  ],
}

export const ProcessSection: Block = {
  slug: 'processSection',
  interfaceName: 'ProcessSectionBlock',
  labels: { singular: 'Process', plural: 'Process sections' },
  ...marketingAdmin,
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'split',
      required: true,
      options: [
        { label: 'Intro, trust signals and icons', value: 'split' },
        { label: 'Centered numbered steps', value: 'centered' },
      ],
      admin: {
        description: 'Icons on the split layout are chosen by step order and stay in code.',
      },
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
    {
      name: 'trustItems',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        imageField(),
        imageAltField,
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

export const CategoryBar: Block = {
  slug: 'categoryBar',
  interfaceName: 'CategoryBarBlock',
  labels: { singular: 'Category bar', plural: 'Category bars' },
  ...marketingAdmin,
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'textarea', admin: { description: 'Use a new line for a line break.' } },
    {
      name: 'items',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'Icons are chosen by item order and stay in code.',
      },
      fields: [{ name: 'title', type: 'text', required: true }],
    },
  ],
}

export const CtaBand: Block = {
  slug: 'ctaBand',
  interfaceName: 'CtaBandBlock',
  labels: { singular: 'CTA band', plural: 'CTA bands' },
  ...marketingAdmin,
  fields: [
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Charcoal', value: 'dark' },
        { label: 'Light', value: 'light' },
      ],
    },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
    linksField,
  ],
}

export const ProseSection: Block = {
  slug: 'proseSection',
  interfaceName: 'ProseSectionBlock',
  labels: { singular: 'Prose section', plural: 'Prose sections' },
  ...marketingAdmin,
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea', admin: { description: 'Separate paragraphs with a blank line.' } },
  ],
}

export const CapabilityList: Block = {
  slug: 'capabilityList',
  interfaceName: 'CapabilityListBlock',
  labels: { singular: 'Capability list', plural: 'Capability lists' },
  ...marketingAdmin,
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

export const ServiceDetails: Block = {
  slug: 'serviceDetails',
  interfaceName: 'ServiceDetailsBlock',
  labels: { singular: 'Service details', plural: 'Service details' },
  ...marketingAdmin,
  fields: [
    {
      name: 'services',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'anchor',
          type: 'text',
          admin: { description: 'Hash without #, for example residential. Used by /services#residential.' },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'features',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        imageField(),
        imageAltField,
        { name: 'enquireLabel', type: 'text', admin: { description: 'Links to /enquiry. Leave blank to hide.' } },
      ],
    },
  ],
}

export const marketingBlocks: Block[] = [
  PageIntro,
  ServiceCards,
  SplitFeature,
  ProcessSection,
  CategoryBar,
  CtaBand,
  ProseSection,
  CapabilityList,
  ServiceDetails,
]
