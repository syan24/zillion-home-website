import React from 'react'

import type { Media } from '@/payload-types'

import { resolveMedia } from '@/components/Marketing/media'
import {
  CapabilityList,
  CategoryBar,
  CtaBand,
  PageIntro,
  ProcessSection,
  ProseSection,
  ServiceCards,
  ServiceDetails,
  SplitFeature,
  type MarketingLink,
} from '@/components/Marketing/sections'

type Upload = number | Media | null | undefined

function placed(image: Upload, imageAlt?: string | null) {
  return resolveMedia(image, imageAlt)
}

export function PageIntroBlock(props: {
  layout?: 'split' | 'text' | null
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  description?: string | null
  image?: Upload
  imageAlt?: string | null
  pageSlug?: string | null
}) {
  const { pageSlug, image, imageAlt, ...intro } = props
  return (
    <PageIntro
      {...intro}
      measure={pageSlug === 'about' ? 'about' : 'services'}
      image={placed(image, imageAlt)}
    />
  )
}

export function ServiceCardsBlock(props: {
  variant?: 'grid' | 'pair' | null
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  body?: string | null
  cards?:
    | {
        title?: string | null
        subtitle?: string | null
        description?: string | null
        href?: string | null
        image?: Upload
        imageAlt?: string | null
      }[]
    | null
}) {
  return (
    <ServiceCards
      variant={props.variant}
      eyebrow={props.eyebrow}
      heading={props.heading}
      headingAccent={props.headingAccent}
      body={props.body}
      cards={(props.cards || []).map((card) => ({
        ...card,
        image: placed(card.image, card.imageAlt),
      }))}
    />
  )
}

export function SplitFeatureBlock(props: {
  variant?: 'briefs' | 'checklist' | 'darkCopy' | null
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  body?: string | null
  image?: Upload
  imageAlt?: string | null
  items?:
    | {
        title?: string | null
        subtitle?: string | null
        image?: Upload
        imageAlt?: string | null
      }[]
    | null
  links?: MarketingLink[] | null
}) {
  return (
    <SplitFeature
      {...props}
      image={placed(props.image, props.imageAlt)}
      items={(props.items || []).map((item) => ({
        ...item,
        image: placed(item.image, item.imageAlt),
      }))}
    />
  )
}

export function ProcessSectionBlock(props: {
  variant?: 'split' | 'centered' | null
  eyebrow?: string | null
  heading?: string | null
  body?: string | null
  trustEyebrow?: string | null
  trustHeading?: string | null
  trustItems?:
    | {
        title?: string | null
        description?: string | null
        image?: Upload
        imageAlt?: string | null
      }[]
    | null
  steps?: { title?: string | null; description?: string | null }[] | null
}) {
  return (
    <ProcessSection
      {...props}
      trustItems={(props.trustItems || []).map((item) => ({
        ...item,
        image: placed(item.image, item.imageAlt),
      }))}
    />
  )
}

export function CategoryBarBlock(props: {
  eyebrow?: string | null
  heading?: string | null
  items?: { title?: string | null }[] | null
}) {
  return <CategoryBar {...props} />
}

export function CtaBandBlock(props: {
  eyebrow?: string | null
  tone?: 'dark' | 'light' | null
  heading?: string | null
  body?: string | null
  links?: MarketingLink[] | null
  image?: Upload
  imageAlt?: string | null
}) {
  const { image, imageAlt, ...band } = props
  return <CtaBand {...band} image={placed(image, imageAlt)} />
}

export function ProseSectionBlock(props: {
  eyebrow?: string | null
  heading?: string | null
  body?: string | null
}) {
  return <ProseSection {...props} />
}

export function CapabilityListBlock(props: {
  eyebrow?: string | null
  heading?: string | null
  items?: { title?: string | null; description?: string | null }[] | null
}) {
  return <CapabilityList {...props} />
}

export async function ServiceDetailsBlock(props: {
  featuresLabel?: string | null
  services?:
    | {
        anchor?: string | null
        title?: string | null
        subtitle?: string | null
        description?: string | null
        features?: { text?: string | null }[] | null
        image?: Upload
        imageAlt?: string | null
        enquireLabel?: string | null
      }[]
    | null
}) {
  return (
    <ServiceDetails
      featuresLabel={props.featuresLabel || undefined}
      services={(props.services || []).map((service) => ({
        ...service,
        image: placed(service.image, service.imageAlt),
      }))}
    />
  )
}
