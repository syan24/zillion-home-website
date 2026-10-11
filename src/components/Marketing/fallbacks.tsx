import React from 'react'

import { getMarketing } from '@/content/getMarketing'
import type { ImageRef } from '@/content/marketing'
import { getLocale } from '@/i18n/getLocale'
import {
  CapabilityList,
  CategoryBar,
  CtaBand,
  HomeHero,
  PageIntro,
  ProcessSection,
  ProseSection,
  ServiceCards,
  ServiceDetails,
  SplitFeature,
} from '@/components/Marketing/sections'

function stock(image?: ImageRef | null) {
  if (!image) return undefined
  return { src: image.src, alt: image.alt }
}

export async function FallbackHome() {
  const content = getMarketing(await getLocale()).home
  return (
    <main>
      <HomeHero {...content.hero} image={stock(content.hero.image)} />
      <ServiceCards
        {...content.serviceCards}
        cards={content.serviceCards.cards.map((card) => ({ ...card, image: stock(card.image) }))}
      />
      <SplitFeature
        {...content.briefs}
        image={stock(content.briefs.image)}
        items={content.briefs.items.map((item) => ({ ...item, image: stock(item.image) }))}
      />
      <ProcessSection
        {...content.process}
        trustItems={content.process.trustItems.map((item) => ({ ...item, image: stock(item.image) }))}
      />
      <CategoryBar {...content.categories} />
      <CtaBand {...content.cta} />
    </main>
  )
}

export async function FallbackAbout() {
  const content = getMarketing(await getLocale()).about
  return (
    <main className="min-h-screen">
      <PageIntro {...content.intro} image={stock(content.intro.image)} />
      <ProseSection {...content.prose} />
      <CapabilityList {...content.capabilities} />
      <SplitFeature
        {...content.trust}
        image={stock(content.trust.image)}
        items={content.trust.items}
      />
      <CtaBand {...content.cta} />
    </main>
  )
}

export async function FallbackServices() {
  const content = getMarketing(await getLocale()).services
  return (
    <main className="min-h-screen">
      <PageIntro {...content.intro} />
      <ServiceDetails
        services={content.details.services.map((service) => ({
          ...service,
          features: service.features.map((text) => ({ text })),
          image: stock(service.image),
        }))}
      />
      <ProcessSection {...content.process} />
      <SplitFeature {...content.joinery} image={stock(content.joinery.image)} />
      <CtaBand {...content.cta} />
    </main>
  )
}
