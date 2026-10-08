import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import React from 'react'

import { FallbackServices } from '@/components/Marketing/fallbacks'
import { PageFromCms } from '@/components/Pages/PageFromCms'
import { servicesContent } from '@/content/marketing'
import { generateMeta } from '@/utilities/generateMeta'
import { pageHasContent } from '@/utilities/pageContent'
import { queryPageBySlug } from '@/utilities/queryPageBySlug'

export default async function ServicesPage() {
  const { isEnabled: draft } = await draftMode()
  const page = await queryPageBySlug({ slug: 'services' })

  if (!page || !pageHasContent(page)) return <FallbackServices />

  return <PageFromCms draft={draft} page={page} url="/services" />
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug({ slug: 'services' })
  if (page && pageHasContent(page)) return generateMeta({ doc: page })

  return {
    title: `${servicesContent.metaTitle} | Zillion Home`,
    description: servicesContent.metaDescription,
  }
}
