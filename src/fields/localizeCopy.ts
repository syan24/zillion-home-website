import type { Block, Field } from 'payload'

const copyTypes = new Set(['text', 'textarea', 'richText'])

const skipNames = new Set([
  'anchor',
  'href',
  'url',
  'slug',
  'type',
  'variant',
  'layout',
  'tone',
])

export function localizeCopyFields(fields: Field[]): Field[] {
  return fields.map((field) => localizeCopyField(field))
}

export function localizeCopyField(field: Field): Field {
  switch (field.type) {
    case 'array':
    case 'group':
    case 'row':
    case 'collapsible':
      return { ...field, fields: field.fields.map((child) => localizeCopyField(child)) }
    case 'tabs':
      return {
        ...field,
        tabs: field.tabs.map((tab) =>
          'fields' in tab ? { ...tab, fields: tab.fields.map((child) => localizeCopyField(child)) } : tab,
        ),
      }
    case 'blocks':
      return {
        ...field,
        blocks: field.blocks.map((block) => localizeBlock(block)) as Block[],
      }
    case 'text':
    case 'textarea':
    case 'richText':
      if ('name' in field && field.name && skipNames.has(field.name)) return field
      if (!copyTypes.has(field.type)) return field
      return { ...field, localized: true }
    default:
      return field
  }
}

function localizeBlock(block: Block | string): Block | string {
  if (typeof block === 'string') return block
  return { ...block, fields: block.fields.map((field) => localizeCopyField(field)) }
}
