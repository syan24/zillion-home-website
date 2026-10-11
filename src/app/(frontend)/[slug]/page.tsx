import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'

import { PageFromCms } from '@/components/Pages/PageFromCms'
import { FallbackHome } from '@/components/Home/FallbackHome'
import { generateMeta } from '@/utilities/generateMeta'
import { pageHasContent } from '@/utilities/pageContent'
import { queryPageBySlug } from '@/utilities/queryPageBySlug'

const reservedSlugs = new Set(['home', 'about', 'services', 'enquiry', 'contact', 'projects'])

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    const params = pages.docs
      ?.filter((doc) => doc.slug && !reservedSlugs.has(doc.slug))
      .map(({ slug }) => {
        return { slug }
      })

    return params
  } catch {
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  const isHome = decodedSlug === 'home'

  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  if (!page) {
    if (isHome) return <FallbackHome />
    return <PayloadRedirects url={url} />
  }

  if (isHome && !pageHasContent(page)) return <FallbackHome />

  return <PageFromCms draft={draft} page={page} url={isHome ? '/' : url} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}
