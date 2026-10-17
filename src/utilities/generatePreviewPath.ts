import type { CollectionSlug, PayloadRequest } from 'payload'

import { isSiteLocale } from '@/i18n/config'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string | null | undefined
  locale?: string | null
  req: PayloadRequest
}

/**
 * Public path for a Pages document.
 * The home document is stored as slug `home` and served at `/`.
 */
export const pagePreviewPath = (slug: string): string => {
  const normalized = slug.trim()
  if (normalized === 'home') return '/'
  const prefix = collectionPrefixMap.pages ?? ''
  return `${prefix}/${encodeURIComponent(normalized)}`
}

export const generatePreviewPath = ({ collection, slug, locale }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  const path =
    collection === 'pages'
      ? pagePreviewPath(slug)
      : `${collectionPrefixMap[collection] ?? ''}/${encodeURIComponent(slug.trim())}`

  const params = new URLSearchParams({
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  if (locale && isSiteLocale(locale)) {
    params.set('locale', locale)
  }

  return `/next/preview?${params.toString()}`
}
