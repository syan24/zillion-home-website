import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { protectReferencedSwmsFile } from './protectReferencedSwmsFile'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const swmsUploadsDir = path.resolve(dirname, '../../../swms-uploads')

export const SWMSFiles: CollectionConfig = {
  slug: 'swms-files',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'updatedAt'],
    group: 'SWMS',
    description:
      'PDFs and photos for site safety. Workers open them through the project QR link. They are not part of the public media library.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  hooks: {
    beforeDelete: [protectReferencedSwmsFile],
  },
  upload: {
    staticDir: swmsUploadsDir,
    mimeTypes: ['application/pdf', 'application/x-pdf', 'image/jpeg', 'image/png', 'image/webp'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Description',
    },
  ],
}
