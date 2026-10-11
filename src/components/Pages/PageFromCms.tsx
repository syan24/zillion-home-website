import React from 'react'

import type { Page } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderHero } from '@/heros/RenderHero'
import { isMarketingPage } from '@/utilities/pageContent'
import PageClient from '@/app/(frontend)/[slug]/page.client'

export function PageFromCms({
  page,
  url,
  draft,
}: {
  page: Page
  url: string
  draft: boolean
}) {
  const inner = (
    <>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <RenderHero {...page.hero} />
      <RenderBlocks blocks={page.layout} />
    </>
  )

  if (isMarketingPage(page)) return <main>{inner}</main>

  return <article className="pt-16 pb-24">{inner}</article>
}
