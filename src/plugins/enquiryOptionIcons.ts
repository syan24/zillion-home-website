import type { Block, Field } from 'payload'

import { enquiryIconOptions } from '@/lib/enquiry/icons'

const optionIconFields: Field[] = [
  {
    name: 'icon',
    type: 'select',
    label: 'Icon',
    options: enquiryIconOptions,
    admin: {
      description: 'Line icon on the public card. Leave empty for no icon. A custom image replaces it.',
    },
  },
  {
    name: 'iconImage',
    type: 'upload',
    relationTo: 'media',
    label: 'Custom icon',
    admin: {
      description: 'Optional. Shown instead of the line icon on the public card.',
    },
  },
]

const cardBlocks = new Set(['radio', 'select', 'checkboxGroup'])

function withOptionIcons(fields: Field[]): Field[] {
  return fields.map((field) => {
    if (field.type !== 'array' || !('name' in field) || field.name !== 'options') return field
    const children = field.fields ?? []
    if (children.some((child) => 'name' in child && child.name === 'icon')) return field
    return {
      ...field,
      fields: [...children, ...optionIconFields],
    }
  })
}

function withBlockIcons(block: Block | string): Block | string {
  if (typeof block === 'string' || !cardBlocks.has(block.slug)) return block
  return {
    ...block,
    fields: withOptionIcons(block.fields),
  }
}

/** Adds an icon and an optional Media image to radio, select, and checkbox options. */
export function withEnquiryOptionIcons<T extends Field>(fields: T[]): T[] {
  return fields.map((field) => {
    if (field.type !== 'blocks' || !('blocks' in field) || !field.blocks) return field
    return {
      ...field,
      blocks: field.blocks.map(withBlockIcons),
    }
  })
}
