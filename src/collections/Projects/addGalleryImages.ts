import { APIError, type Payload, type PayloadHandler, type PayloadRequest } from 'payload'

import {
  isGalleryImageMime,
  MAX_GALLERY_UPLOAD,
  titleFromFilename,
} from '@/lib/projects/galleryTitle'

export type GalleryUploadItem = {
  filename: string
  mediaID: number
}

export type GalleryCreatedImage = {
  displayOrder: number
  id: number
  mediaID: number
  title: string
}

export type GalleryUploadError = {
  filename: string
  message: string
}

export type GalleryUploadResult = {
  created: GalleryCreatedImage[]
  errors: GalleryUploadError[]
}

function parseID(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) return value
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const id = Number(value)
    return id > 0 ? id : null
  }
  return null
}

export function parseGalleryUploadItems(value: unknown): GalleryUploadItem[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_GALLERY_UPLOAD) return null

  const items: GalleryUploadItem[] = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') return null
    const record = entry as { filename?: unknown; mediaID?: unknown }
    const mediaID = parseID(record.mediaID)
    if (!mediaID) return null
    const filename = typeof record.filename === 'string' ? record.filename.slice(0, 500) : ''
    items.push({ filename, mediaID })
  }
  return items
}

function errorStatus(error: unknown): number | undefined {
  if (error instanceof APIError) return error.status
  if (error && typeof error === 'object' && 'status' in error && typeof error.status === 'number') {
    return error.status
  }
  return undefined
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return 'Could not add this photo.'
}

export async function addProjectGalleryImages({
  items,
  payload,
  projectID,
  req,
}: {
  items: GalleryUploadItem[]
  payload: Payload
  projectID: number
  req: PayloadRequest
}): Promise<GalleryUploadResult> {
  try {
    await payload.findByID({
      collection: 'projects',
      id: projectID,
      depth: 0,
      draft: true,
      overrideAccess: false,
      req,
    })
  } catch (error) {
    if (errorStatus(error) === 404) {
      throw new APIError('Project not found.', 404)
    }
    throw error
  }

  const existing = await payload.find({
    collection: 'project-images',
    where: { project: { equals: projectID } },
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    req,
    select: { displayOrder: true },
  })

  let nextOrder = -1
  for (const doc of existing.docs) {
    if (typeof doc.displayOrder === 'number' && doc.displayOrder > nextOrder) {
      nextOrder = doc.displayOrder
    }
  }

  const created: GalleryCreatedImage[] = []
  const errors: GalleryUploadError[] = []

  for (const item of items) {
    const label = item.filename || `Media ${item.mediaID}`
    try {
      const media = await payload.findByID({
        collection: 'media',
        id: item.mediaID,
        depth: 0,
        overrideAccess: false,
        req,
        select: { filename: true, mimeType: true },
      })

      if (!isGalleryImageMime(media.mimeType)) {
        errors.push({ filename: label, message: 'Only image files can be added to the gallery.' })
        continue
      }

      nextOrder += 1
      const title = titleFromFilename(item.filename || media.filename || label)
      const image = await payload.create({
        collection: 'project-images',
        data: {
          allowDownload: true,
          displayOrder: nextOrder,
          image: item.mediaID,
          project: projectID,
          published: true,
          title,
        },
        locale: 'en',
        overrideAccess: false,
        req,
      })

      created.push({
        displayOrder: nextOrder,
        id: image.id,
        mediaID: item.mediaID,
        title: image.title,
      })
    } catch (error) {
      if (errorStatus(error) === 404) {
        errors.push({ filename: label, message: 'That file is not in the media library.' })
        continue
      }
      errors.push({ filename: label, message: errorMessage(error) })
    }
  }

  return { created, errors }
}

export const addProjectGalleryEndpoint: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ errors: [{ message: 'You must be logged in.' }] }, { status: 401 })
  }

  const projectID = parseID(req.routeParams?.id)
  if (!projectID) {
    return Response.json({ errors: [{ message: 'Project not found.' }] }, { status: 404 })
  }

  let body: unknown
  try {
    body = await req.json?.()
  } catch {
    return Response.json({ errors: [{ message: 'Send a JSON body with the uploaded files.' }] }, { status: 400 })
  }

  const items = parseGalleryUploadItems(
    body && typeof body === 'object' && 'items' in body ? (body as { items?: unknown }).items : undefined,
  )
  if (!items) {
    return Response.json(
      { errors: [{ message: `Choose between 1 and ${MAX_GALLERY_UPLOAD} photos.` }] },
      { status: 400 },
    )
  }

  try {
    const result = await addProjectGalleryImages({
      items,
      payload: req.payload,
      projectID,
      req,
    })
    const status = result.created.length === 0 ? 400 : 200
    return Response.json(result, { status })
  } catch (error) {
    const status = errorStatus(error) ?? 500
    return Response.json({ errors: [{ message: errorMessage(error) }] }, { status })
  }
}
