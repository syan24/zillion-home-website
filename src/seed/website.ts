import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload } from 'payload'

import {
  aboutContent,
  footerContent,
  headerNav,
  homeContent,
  marketingImages,
  servicesContent,
  type ImageRef,
  type MarketingImageKey,
} from '@/content/marketing'

const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const seedContext = { disableRevalidate: true }

type MediaIds = Record<MarketingImageKey, number>

function navLink(item: { label: string; href: string }) {
  return {
    link: {
      type: 'custom' as const,
      url: item.href,
      label: item.label,
    },
  }
}

function bandLinks(
  links: { label: string; href: string; variant: 'enquiry' | 'outline' | 'default' }[],
) {
  return links.map((link) => ({
    label: link.label,
    href: link.href,
    variant: link.variant,
  }))
}

async function pageExists(payload: Payload, slug: string) {
  for (const draft of [true, false]) {
    const existing = await payload.find({
      collection: 'pages',
      depth: 0,
      draft,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { slug: { equals: slug } },
    })
    if (existing.docs[0]) return true
  }
  return false
}

async function ensureMedia(payload: Payload): Promise<MediaIds> {
  const ids = {} as MediaIds

  for (const key of Object.keys(marketingImages) as MarketingImageKey[]) {
    const image = marketingImages[key]
    const existing = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { filename: { equals: image.file } },
    })

    if (existing.docs[0]) {
      ids[key] = existing.docs[0].id
      continue
    }

    const filePath = path.join(assetsDir, image.file)
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing seed image ${filePath}`)
    }

    const created = await payload.create({
      collection: 'media',
      overrideAccess: true,
      context: seedContext,
      data: { alt: image.alt },
      filePath,
    })
    ids[key] = created.id
  }

  return ids
}

function imageId(ids: MediaIds, image?: ImageRef) {
  return image ? ids[image.key] : undefined
}

async function seedPages(payload: Payload, ids: MediaIds) {
  const pages = [
    {
      slug: 'home',
      data: {
        title: 'Home',
        slug: 'home',
        generateSlug: false,
        _status: 'published' as const,
        hero: {
          type: 'builder' as const,
          eyebrow: homeContent.hero.eyebrow,
          headline: homeContent.hero.headline,
          description: homeContent.hero.description,
          badgePrimary: homeContent.hero.badgePrimary,
          badgeSecondary: homeContent.hero.badgeSecondary,
          badgeMuted: homeContent.hero.badgeMuted,
          media: imageId(ids, homeContent.hero.image),
          links: homeContent.hero.links.map((link) => ({
            link: {
              type: 'custom' as const,
              url: link.href,
              label: link.label,
              appearance: 'default' as const,
            },
          })),
        },
        layout: [
          {
            blockType: 'serviceCards' as const,
            eyebrow: homeContent.serviceCards.eyebrow,
            heading: homeContent.serviceCards.heading,
            cards: homeContent.serviceCards.cards.map((card) => ({
              image: imageId(ids, card.image),
              imageAlt: card.image.alt,
              title: card.title,
              subtitle: card.subtitle,
              description: card.description,
              href: card.href,
            })),
          },
          {
            blockType: 'splitFeature' as const,
            variant: homeContent.briefs.variant,
            eyebrow: homeContent.briefs.eyebrow,
            heading: homeContent.briefs.heading,
            headingAccent: homeContent.briefs.headingAccent,
            body: homeContent.briefs.body,
            image: imageId(ids, homeContent.briefs.image),
            imageAlt: homeContent.briefs.image.alt,
            items: homeContent.briefs.items.map((item) => ({
              image: imageId(ids, item.image),
              imageAlt: item.image.alt,
              title: item.title,
              subtitle: item.subtitle,
            })),
          },
          {
            blockType: 'processSection' as const,
            variant: homeContent.process.variant,
            eyebrow: homeContent.process.eyebrow,
            heading: homeContent.process.heading,
            body: homeContent.process.body,
            trustItems: homeContent.process.trustItems.map((item) => ({
              image: imageId(ids, item.image),
              imageAlt: item.image.alt,
              title: item.title,
              description: item.description,
            })),
            steps: homeContent.process.steps,
          },
          {
            blockType: 'categoryBar' as const,
            eyebrow: homeContent.categories.eyebrow,
            heading: homeContent.categories.heading,
            items: homeContent.categories.items,
          },
          {
            blockType: 'ctaBand' as const,
            tone: homeContent.cta.tone,
            heading: homeContent.cta.heading,
            body: homeContent.cta.body,
            links: bandLinks(homeContent.cta.links),
          },
        ],
        meta: { description: homeContent.metaDescription },
      },
    },
    {
      slug: 'about',
      data: {
        title: 'About',
        slug: 'about',
        generateSlug: false,
        _status: 'published' as const,
        hero: { type: 'none' as const },
        layout: [
          {
            blockType: 'pageIntro' as const,
            layout: aboutContent.intro.layout,
            eyebrow: aboutContent.intro.eyebrow,
            heading: aboutContent.intro.heading,
            headingAccent: aboutContent.intro.headingAccent,
            description: aboutContent.intro.description,
            image: imageId(ids, aboutContent.intro.image),
            imageAlt: aboutContent.intro.image.alt,
          },
          {
            blockType: 'proseSection' as const,
            eyebrow: aboutContent.prose.eyebrow,
            heading: aboutContent.prose.heading,
            body: aboutContent.prose.body,
          },
          {
            blockType: 'capabilityList' as const,
            eyebrow: aboutContent.capabilities.eyebrow,
            heading: aboutContent.capabilities.heading,
            items: aboutContent.capabilities.items,
          },
          {
            blockType: 'splitFeature' as const,
            variant: aboutContent.trust.variant,
            eyebrow: aboutContent.trust.eyebrow,
            heading: aboutContent.trust.heading,
            headingAccent: aboutContent.trust.headingAccent,
            body: aboutContent.trust.body,
            image: imageId(ids, aboutContent.trust.image),
            imageAlt: aboutContent.trust.image.alt,
            items: aboutContent.trust.items,
          },
          {
            blockType: 'ctaBand' as const,
            tone: aboutContent.cta.tone,
            heading: aboutContent.cta.heading,
            body: aboutContent.cta.body,
            links: bandLinks(aboutContent.cta.links),
          },
        ],
        meta: {
          title: aboutContent.metaTitle,
          description: aboutContent.metaDescription,
        },
      },
    },
    {
      slug: 'services',
      data: {
        title: 'Services',
        slug: 'services',
        generateSlug: false,
        _status: 'published' as const,
        hero: { type: 'none' as const },
        layout: [
          {
            blockType: 'pageIntro' as const,
            layout: servicesContent.intro.layout,
            eyebrow: servicesContent.intro.eyebrow,
            heading: servicesContent.intro.heading,
            headingAccent: servicesContent.intro.headingAccent,
            description: servicesContent.intro.description,
          },
          {
            blockType: 'serviceDetails' as const,
            services: servicesContent.details.services.map((service) => ({
              anchor: service.anchor,
              title: service.title,
              subtitle: service.subtitle,
              description: service.description,
              features: service.features.map((text) => ({ text })),
              image: imageId(ids, service.image),
              imageAlt: service.image.alt,
              enquireLabel: service.enquireLabel,
            })),
          },
          {
            blockType: 'processSection' as const,
            variant: servicesContent.process.variant,
            eyebrow: servicesContent.process.eyebrow,
            heading: servicesContent.process.heading,
            steps: servicesContent.process.steps,
          },
          {
            blockType: 'splitFeature' as const,
            variant: servicesContent.joinery.variant,
            eyebrow: servicesContent.joinery.eyebrow,
            heading: servicesContent.joinery.heading,
            headingAccent: servicesContent.joinery.headingAccent,
            body: servicesContent.joinery.body,
            image: imageId(ids, servicesContent.joinery.image),
            imageAlt: servicesContent.joinery.image.alt,
            links: bandLinks(servicesContent.joinery.links),
          },
          {
            blockType: 'ctaBand' as const,
            tone: servicesContent.cta.tone,
            heading: servicesContent.cta.heading,
            body: servicesContent.cta.body,
            links: bandLinks(servicesContent.cta.links),
          },
        ],
        meta: {
          title: servicesContent.metaTitle,
          description: servicesContent.metaDescription,
        },
      },
    },
  ]

  const summary: string[] = []

  for (const page of pages) {
    if (await pageExists(payload, page.slug)) {
      summary.push(`page ${page.slug}: skipped`)
      continue
    }

    await payload.create({
      collection: 'pages',
      overrideAccess: true,
      draft: false,
      context: seedContext,
      data: page.data,
    })
    summary.push(`page ${page.slug}: created`)
  }

  return summary
}

async function seedGlobals(payload: Payload) {
  const summary: string[] = []
  const header = await payload.findGlobal({ slug: 'header', overrideAccess: true })
  const headerData: Record<string, unknown> = {}

  if (!header.navItems?.length) {
    headerData.navItems = headerNav.primary.map(navLink)
  }
  if (!header.secondaryNavItems?.length) {
    headerData.secondaryNavItems = headerNav.secondary.map(navLink)
  }
  if (Object.keys(headerData).length) {
    await payload.updateGlobal({
      slug: 'header',
      overrideAccess: true,
      context: seedContext,
      data: headerData,
    })
    summary.push('header: filled empty navigation')
  } else {
    summary.push('header: skipped')
  }

  const footer = await payload.findGlobal({ slug: 'footer', overrideAccess: true })
  const footerData: Record<string, unknown> = {}
  if (!footer.blurb) footerData.blurb = footerContent.blurb
  if (!footer.tagline) footerData.tagline = footerContent.tagline
  if (!footer.location) footerData.location = footerContent.location
  if (!footer.serviceLinks?.length) footerData.serviceLinks = footerContent.services.map(navLink)
  if (!footer.navItems?.length) footerData.navItems = footerContent.company.map(navLink)

  if (Object.keys(footerData).length) {
    await payload.updateGlobal({
      slug: 'footer',
      overrideAccess: true,
      context: seedContext,
      data: footerData,
    })
    summary.push('footer: filled empty fields')
  } else {
    summary.push('footer: skipped')
  }

  return summary
}

export async function seedWebsite(payload: Payload) {
  const ids = await ensureMedia(payload)
  const pages = await seedPages(payload, ids)
  const globals = await seedGlobals(payload)
  const summary = [...pages, ...globals]
  console.log(summary.join('\n'))
  return summary
}
