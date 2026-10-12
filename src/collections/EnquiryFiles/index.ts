import path from 'path'
import { fileURLToPath } from 'url'
import { ValidationError, type CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { enquiryUploadMimeTypes } from '@/lib/enquiry/files'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const EnquiryFiles: CollectionConfig = {
  slug: 'enquiry-files',
  admin: {
    useAsTitle: 'originalName',
    defaultColumns: ['originalName', 'mimeType', 'filesize', 'updatedAt'],
    group: 'Enquiries',
    description:
      'Files attached to an enquiry. Visitors upload them with the form. They are not part of the public media library.',
  },
  access: {
    create: () => false,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../../enquiry-uploads'),
    mimeTypes: enquiryUploadMimeTypes,
  },
  hooks: {
    beforeValidate: [
      ({ operation, req }) => {
        if (operation === 'create' && !req.context?.enquiryFileCreate) {
          throw new ValidationError({
            collection: 'enquiry-files',
            errors: [
              {
                message: 'Enquiry files are created when an enquiry is submitted.',
                path: 'originalName',
              },
            ],
          })
        }
      },
    ],
  },
  fields: [
    {
      name: 'originalName',
      type: 'text',
      required: true,
      label: 'Original filename',
      admin: {
        readOnly: true,
        description: 'The name of the file the visitor selected. The stored filename is random.',
      },
    },
  ],
}
