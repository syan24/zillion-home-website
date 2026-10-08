import React from 'react'

import { aboutContent, homeContent, servicesContent } from '@/content/marketing'
import type { ImageRef } from '@/content/marketing'
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

export function FallbackHome() {
  const content = homeContent
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

export function FallbackAbout() {
  const content = aboutContent
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

export function FallbackServices() {
  const content = servicesContent
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
