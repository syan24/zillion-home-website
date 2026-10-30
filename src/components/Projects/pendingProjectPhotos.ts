import { MAX_GALLERY_UPLOAD } from '@/lib/projects/galleryTitle'

export type BatchPhoto = {
  id: string
  filename: string
  mediaID: number
}

export function keepFeaturedId(ids: string[], featuredId: string | null): string | null {
  if (ids.length === 0) return null
  if (featuredId && ids.includes(featuredId)) return featuredId
  return ids[0]
}

export function withinGalleryLimit(
  current: number,
  incoming: number,
  max = MAX_GALLERY_UPLOAD,
): boolean {
  return incoming > 0 && current + incoming <= max
}

/** Featured photo first, then the rest in the order they were chosen. */
export function buildGalleryBatch(
  photos: BatchPhoto[],
  featuredId: string | null,
): { featuredImage: number; items: { filename: string; mediaID: number }[] } | null {
  if (photos.length === 0) return null
  const featured = photos.find((photo) => photo.id === featuredId) ?? photos[0]
  const ordered = [featured, ...photos.filter((photo) => photo.id !== featured.id)]
  return {
    featuredImage: featured.mediaID,
    items: ordered.map(({ filename, mediaID }) => ({ filename, mediaID })),
  }
}
