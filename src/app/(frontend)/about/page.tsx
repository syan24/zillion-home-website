import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import React from 'react'

import { FallbackAbout } from '@/components/Marketing/fallbacks'
import { PageFromCms } from '@/components/Pages/PageFromCms'
import { aboutContent } from '@/content/marketing'
import { generateMeta } from '@/utilities/generateMeta'
import { pageHasContent } from '@/utilities/pageContent'
import { queryPageBySlug } from '@/utilities/queryPageBySlug'

export default async function AboutPage() {
  const { isEnabled: draft } = await draftMode()
  const page = await queryPageBySlug({ slug: 'about' })

  if (!page || !pageHasContent(page)) return <FallbackAbout />

  return <PageFromCms draft={draft} page={page} url="/about" />
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug({ slug: 'about' })
  if (page && pageHasContent(page)) return generateMeta({ doc: page })

  return {
    title: `${aboutContent.metaTitle} | Zillion Home`,
    description: aboutContent.metaDescription,
  }
}
