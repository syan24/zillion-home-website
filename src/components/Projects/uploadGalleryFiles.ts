import { formatAdminURL } from 'payload/shared'

import { titleFromFilename } from '@/lib/projects/galleryTitle'

import { buildMediaUploadFormData, type ClientUploadHandler } from './mediaUploadFormData'

export type UploadedGalleryImage = {
  displayOrder: number
  id: number
  mediaID: number
  title: string
}

export type GalleryUploadError = {
  filename: string
  message: string
}

function messageFrom(json: unknown): string | null {
  if (!json || typeof json !== 'object') return null
  if ('errors' in json && Array.isArray(json.errors)) {
    const first = json.errors[0]
    if (first && typeof first === 'object' && 'message' in first && typeof first.message === 'string') {
      return first.message
    }
  }
  if ('message' in json && typeof json.message === 'string') return json.message
  return null
}

function asErrors(value: unknown): GalleryUploadError[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return []
    const filename = 'filename' in entry && typeof entry.filename === 'string' ? entry.filename : ''
    const message = 'message' in entry && typeof entry.message === 'string' ? entry.message : ''
    if (!message) return []
    return [{ filename, message }]
  })
}

function asCreated(value: unknown): UploadedGalleryImage[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return []
    const id = 'id' in entry && typeof entry.id === 'number' ? entry.id : null
    const mediaID = 'mediaID' in entry && typeof entry.mediaID === 'number' ? entry.mediaID : null
    const displayOrder = 'displayOrder' in entry && typeof entry.displayOrder === 'number' ? entry.displayOrder : 0
    const title = 'title' in entry && typeof entry.title === 'string' ? entry.title : ''
    if (!id || !mediaID) return []
    return [{ displayOrder, id, mediaID, title }]
  })
}

export async function uploadGalleryFiles({
  apiRoute,
  fetchImpl = fetch,
  files,
  onProgress,
  projectID,
  uploadHandler,
}: {
  apiRoute: string
  fetchImpl?: typeof fetch
  files: File[]
  onProgress?: (current: number, total: number, filename: string) => void
  projectID: number | string
  uploadHandler: ClientUploadHandler | null
}): Promise<{ created: UploadedGalleryImage[]; errors: GalleryUploadError[] }> {
  const errors: GalleryUploadError[] = []
  const uploaded: { filename: string; mediaID: number }[] = []
  const mediaURL = formatAdminURL({ apiRoute, path: '/media' })

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index]
    onProgress?.(index + 1, files.length, file.name)
    try {
      const body = await buildMediaUploadFormData({
        alt: titleFromFilename(file.name),
        file,
        uploadHandler,
      })
      const response = await fetchImpl(mediaURL, {
        body,
        credentials: 'include',
        method: 'POST',
      })
      const json: unknown = await response.json().catch(() => null)
      const doc =
        json && typeof json === 'object' && 'doc' in json && json.doc && typeof json.doc === 'object'
          ? (json.doc as { id?: unknown })
          : null
      const mediaID = typeof doc?.id === 'number' ? doc.id : null
      if (!response.ok || !mediaID) {
        errors.push({
          filename: file.name,
          message: messageFrom(json) || `Could not upload this file (${response.status}).`,
        })
        continue
      }
      uploaded.push({ filename: file.name, mediaID })
    } catch (error) {
      errors.push({
        filename: file.name,
        message: error instanceof Error && error.message ? error.message : 'Could not upload this file.',
      })
    }
  }

  if (uploaded.length === 0) return { created: [], errors }

  const galleryURL = formatAdminURL({
    apiRoute,
    path: `/projects/${projectID}/gallery`,
  })
  try {
    const response = await fetchImpl(galleryURL, {
      body: JSON.stringify({ items: uploaded }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    const json: unknown = await response.json().catch(() => null)
    const created = asCreated(json && typeof json === 'object' && 'created' in json ? json.created : undefined)
    const linkErrors = asErrors(json && typeof json === 'object' && 'errors' in json ? json.errors : undefined)
    if (!response.ok && created.length === 0 && linkErrors.length === 0) {
      errors.push({
        filename: '',
        message: messageFrom(json) || 'Could not add the photos to this project.',
      })
    }
    return { created, errors: [...errors, ...linkErrors] }
  } catch (error) {
    return {
      created: [],
      errors: [
        ...errors,
        {
          filename: '',
          message:
            error instanceof Error && error.message
              ? error.message
              : 'Could not add the photos to this project.',
        },
      ],
    }
  }
}
