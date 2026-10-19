import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import React from 'react'

import { PageIntro, ProseSection } from '@/components/Marketing/sections'
import { PageFromCms } from '@/components/Pages/PageFromCms'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import { generateMeta } from '@/utilities/generateMeta'
import { pageHasContent } from '@/utilities/pageContent'
import { queryPageBySlug } from '@/utilities/queryPageBySlug'

export type LegalSlug = 'privacy' | 'terms'

export async function LegalPage({ slug }: { slug: LegalSlug }) {
  const { isEnabled: draft } = await draftMode()
  const page = await queryPageBySlug({ slug })

  if (page && pageHasContent(page)) {
    return <PageFromCms draft={draft} page={page} url={`/${slug}`} />
  }

  const copy = getMessages(await getLocale()).legal[slug]

  return (
    <main className="min-h-screen">
      <PageIntro eyebrow={copy.eyebrow} heading={copy.heading} description={copy.intro} />
      <ProseSection heading={copy.sectionHeading} body={copy.body} />
    </main>
  )
}

export async function legalMetadata(slug: LegalSlug): Promise<Metadata> {
  const page = await queryPageBySlug({ slug })
  if (page && pageHasContent(page)) return generateMeta({ doc: page })

  const copy = getMessages(await getLocale()).legal[slug]
  return {
    title: `${copy.metaTitle} | Zillion Home`,
    description: copy.metaDescription,
  }
}
