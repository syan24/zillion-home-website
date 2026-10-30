import { APIError, type CollectionAfterChangeHook, type CollectionBeforeChangeHook } from 'payload'

import { MAX_GALLERY_UPLOAD } from '@/lib/projects/galleryTitle'

import {
  addProjectGalleryImages,
  parseGalleryUploadItems,
  type GalleryUploadItem,
} from './addGalleryImages'

const BATCH_CONTEXT = 'projectGalleryBatch'

function batchItems(value: unknown): GalleryUploadItem[] | null {
  if (!value || typeof value !== 'object' || !('items' in value)) return null
  return parseGalleryUploadItems((value as { items?: unknown }).items)
}

/**
 * Create-time photos are uploaded to Media first, then sent with the project as
 * `galleryBatch`. The field is virtual, so it is removed before the row is written
 * and the gallery rows are created in the same request.
 */
export const stashProjectGalleryBatch: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (
    !data ||
    typeof data !== 'object' ||
    !Object.prototype.hasOwnProperty.call(data, 'galleryBatch')
  ) {
    return data
  }

  const record = data as { galleryBatch?: unknown }
  if (operation === 'create' && record.galleryBatch != null) {
    const items = batchItems(record.galleryBatch)
    if (!items) {
      throw new APIError(`Choose between 1 and ${MAX_GALLERY_UPLOAD} photos.`, 400)
    }
    req.context[BATCH_CONTEXT] = items
  }

  delete record.galleryBatch
  return data
}

export const attachProjectGalleryBatch: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const items = req.context[BATCH_CONTEXT]
  delete req.context[BATCH_CONTEXT]
  if (!Array.isArray(items) || items.length === 0) return doc

  const projectID =
    doc && typeof doc === 'object' && 'id' in doc && typeof doc.id === 'number' ? doc.id : null
  if (!projectID) return doc

  const result = await addProjectGalleryImages({
    items: items as GalleryUploadItem[],
    payload: req.payload,
    projectID,
    req,
  })

  if (result.errors.length > 0) {
    const message = result.errors.map((error) => error.message).join(' ')
    throw new APIError(message || 'Could not add the photos to this project.', 400)
  }

  return doc
}
