const MAX_TITLE_LENGTH = 200

/** English title for a bulk-uploaded gallery photo, taken from the file name. */
export function titleFromFilename(filename: string): string {
  const base = filename.split(/[/\\]/).pop()?.trim() ?? ''
  const withoutExtension = base.replace(/\.[^.]+$/, '')
  const spaced = withoutExtension.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  return spaced.slice(0, MAX_TITLE_LENGTH) || 'Untitled image'
}

export function isGalleryImageMime(mimeType: string | null | undefined): boolean {
  return typeof mimeType === 'string' && mimeType.toLowerCase().startsWith('image/')
}

const IMAGE_EXTENSION = /\.(avif|bmp|gif|heic|heif|jpe?g|png|tif|tiff|webp)$/i

/** File-picker check. The server still requires the stored media mime type to be an image. */
export function isGalleryImageFile(file: { name: string; type: string }): boolean {
  if (isGalleryImageMime(file.type)) return true
  return file.type === '' && IMAGE_EXTENSION.test(file.name)
}

export const MAX_GALLERY_UPLOAD = 40
