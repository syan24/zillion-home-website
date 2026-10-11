import configPromise from '@payload-config'
import { getPayload, type TypedLocale } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'

import { getLocale } from '@/i18n/getLocale'

export const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  try {
    const { isEnabled: draft } = await draftMode()
    const locale = await getLocale()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      locale: locale as TypedLocale,
      fallbackLocale: 'en',
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  } catch {
    return null
  }
})
