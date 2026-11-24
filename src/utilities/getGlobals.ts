import type { Config } from 'src/payload-types'
import type { TypedLocale } from 'payload'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { SiteLocale } from '@/i18n/config'
import { globalCacheKey } from '@/utilities/globalCacheKey'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(
  slug: T,
  depth = 0,
  locale: SiteLocale = 'en',
  fallbackLocale: false | TypedLocale = 'en',
): Promise<DataFromGlobalSlug<T> | null> {
  try {
    const payload = await getPayload({ config: configPromise })

    const global = await payload.findGlobal({
      slug,
      depth,
      locale: locale as TypedLocale,
      fallbackLocale,
    })

    return global
  } catch {
    return null
  }
}

/**
 * Returns an unstable_cache function mapped with the cache tag for the slug.
 * The key includes the Vercel deployment id. See `globalCacheKey`.
 */
export const getCachedGlobal = <T extends Global>(
  slug: T,
  depth = 0,
  locale: SiteLocale = 'en',
  fallbackLocale: false | TypedLocale = 'en',
) =>
  unstable_cache(
    async () => getGlobal<T>(slug, depth, locale, fallbackLocale),
    [...globalCacheKey(slug, depth, locale), fallbackLocale === false ? 'strict' : fallbackLocale],
    {
      tags: [`global_${slug}`],
    },
  )
