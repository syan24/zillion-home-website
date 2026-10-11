import type { Media } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export function resolveMedia(
  media: number | Media | null | undefined,
  altOverride?: string | null,
): { src?: string; alt: string } {
  if (!media || typeof media === 'number') {
    return { alt: altOverride || '' }
  }

  const src = getMediaUrl(media.url, media.updatedAt)

  return {
    src: src || undefined,
    alt: altOverride || media.alt || '',
  }
}
