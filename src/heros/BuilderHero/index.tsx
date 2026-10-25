import React from 'react'

import type { Media } from '@/payload-types'

import { HomeHero, type MarketingLink } from '@/components/Marketing/sections'
import { resolveMedia } from '@/components/Marketing/media'

type BuilderHeroProps = {
  eyebrow?: string | null
  headline?: string | null
  description?: string | null
  badgePrimary?: string | null
  badgeSecondary?: string | null
  badgeMuted?: string | null
  links?:
    | {
        link?: {
          label?: string | null
          url?: string | null
          type?: 'custom' | 'reference' | null
          reference?: {
            value: number | { slug?: string | null }
          } | null
        } | null
      }[]
    | null
  media?: number | Media | null
}

export const BuilderHero: React.FC<BuilderHeroProps> = ({
  eyebrow,
  headline,
  description,
  badgePrimary,
  badgeSecondary,
  badgeMuted,
  links,
  media,
}) => {
  const mappedLinks: MarketingLink[] = (links || [])
    .map((item) => {
      const reference = item.link?.reference
      const referencedSlug =
        item.link?.type === 'reference' && reference && typeof reference.value === 'object'
          ? reference.value.slug
          : undefined
      const href = referencedSlug
        ? referencedSlug === 'home'
          ? '/'
          : `/${referencedSlug}`
        : item.link?.url

      return {
        label: item.link?.label,
        href,
        variant: 'enquiry' as const,
      }
    })
    .filter((link) => link.label && link.href)

  const buttonLinks =
    links == null
      ? [{ label: 'Start an Enquiry →', href: '/enquiry', variant: 'enquiry' as const }]
      : mappedLinks

  return (
    <HomeHero
      eyebrow={eyebrow ?? 'Builders & Joiners · Est. Melbourne'}
      headline={headline ?? 'Built from the ground up.'}
      description={
        description ??
        'Residential construction, renovation, commercial fit-out and custom joinery — delivered by one team, with precision and care.'
      }
      image={resolveMedia(media)}
      badgePrimary={badgePrimary ?? 'Residential'}
      badgeSecondary={badgeSecondary ?? 'Commercial'}
      badgeMuted={badgeMuted ?? 'Joinery'}
      links={buttonLinks}
    />
  )
}
