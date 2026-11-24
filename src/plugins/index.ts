import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import type { FieldsConfig } from '@payloadcms/plugin-form-builder/types'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin, type Block, type Field } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { rejectEnquiryFormSubmission } from '@/lib/enquiry/rejectFormSubmission'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { enquiryCheckboxGroup } from './enquiryCheckboxGroup'
import { withEnquiryOptionIcons } from './enquiryOptionIcons'

import { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Zillion Home` : 'Zillion Home'
}

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
      radio: true,
      upload: true,
      checkboxGroup: enquiryCheckboxGroup,
    } as FieldsConfig,
    uploadCollections: ['enquiry-files'],
    formOverrides: {
      admin: {
        description:
          'The public enquiry page uses the earliest form with “Enquiry form” checked. Edit fields here; leads are stored under Enquiries.',
      },
      fields: ({ defaultFields }) => {
        return withEnquiryOptionIcons([
          {
            name: 'enquiryForm',
            type: 'checkbox',
            label: 'Enquiry form',
            admin: {
              position: 'sidebar',
              description:
                'The public /enquiry page renders this form. Submissions are saved as Enquiries, not as form submissions.',
            },
          },
          ...defaultFields.map((field) => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    ]
                  },
                }),
              }
            }
            return field
          }),
        ])
      },
    },
    formSubmissionOverrides: {
      hooks: {
        beforeValidate: [rejectEnquiryFormSubmission],
      },
    },
  }),
  localizeFormPlaceholders,
]

function localizePlaceholderField(field: Field): Field {
  if ('name' in field && field.name === 'placeholder' && (field.type === 'text' || field.type === 'textarea')) {
    return { ...field, localized: true }
  }
  if (field.type === 'blocks') {
    return {
      ...field,
      blocks: field.blocks.map((block) =>
        typeof block === 'string'
          ? block
          : { ...block, fields: block.fields.map((child) => localizePlaceholderField(child)) },
      ) as Block[],
    }
  }
  if ('fields' in field && Array.isArray(field.fields)) {
    return { ...field, fields: field.fields.map((child) => localizePlaceholderField(child)) }
  }
  if (field.type === 'tabs') {
    return {
      ...field,
      tabs: field.tabs.map((tab) =>
        'fields' in tab ? { ...tab, fields: tab.fields.map((child) => localizePlaceholderField(child)) } : tab,
      ),
    }
  }
  return field
}

/** Select placeholders are one string per locale, read back as the editor saved them. */
function localizeFormPlaceholders(config: Parameters<Plugin>[0]): ReturnType<Plugin> {
  return {
  ...config,
  collections: (config.collections || []).map((collection) => {
    if (collection.slug !== 'forms' || !collection.fields) return collection
    return {
      ...collection,
      fields: collection.fields.map((field) => localizePlaceholderField(field)),
    }
  }),
  }
}
