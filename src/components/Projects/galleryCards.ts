export type GalleryCard = {
  key: string
  mediaID: number
  title: string
  src: string | null
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null
  return value as Record<string, unknown>
}

export function mediaIDFromField(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) return value
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const id = Number(value)
    return id > 0 ? id : null
  }
  if (value && typeof value === 'object' && 'id' in value) {
    return mediaIDFromField((value as { id: unknown }).id)
  }
  return null
}

function mediaSrc(image: unknown): { id: number; src: string | null } | null {
  if (typeof image === 'number' && Number.isInteger(image) && image > 0)
    return { id: image, src: null }
  const record = asRecord(image)
  const id = record ? mediaIDFromField(record.id) : null
  if (!record || !id) return null
  const sizes = asRecord(record.sizes)
  const thumbnail = sizes ? asRecord(sizes.thumbnail) : null
  const thumbURL = thumbnail && typeof thumbnail.url === 'string' ? thumbnail.url : null
  const url = typeof record.url === 'string' ? record.url : null
  return { id, src: thumbURL || url }
}

export function galleryCardsFromDocs(docs: unknown): GalleryCard[] {
  if (!Array.isArray(docs)) return []
  const cards: GalleryCard[] = []
  for (const doc of docs) {
    const record = asRecord(doc)
    if (!record || typeof record.id !== 'number') continue
    const media = mediaSrc(record.image)
    if (!media) continue
    const title =
      typeof record.title === 'string' && record.title.trim() ? record.title : 'Untitled image'
    cards.push({
      key: `image-${record.id}`,
      mediaID: media.id,
      src: media.src,
      title,
    })
  }
  return cards
}

export function galleryCardFromMedia(value: unknown): GalleryCard | null {
  const record = asRecord(value)
  const doc = record && 'doc' in record ? record.doc : value
  const media = mediaSrc(doc)
  if (!media) return null
  const source = asRecord(doc)
  const alt = source && typeof source.alt === 'string' && source.alt.trim() ? source.alt : ''
  const filename = source && typeof source.filename === 'string' ? source.filename : ''
  return {
    key: `featured-${media.id}`,
    mediaID: media.id,
    src: media.src,
    title: alt || filename || 'Featured image',
  }
}
