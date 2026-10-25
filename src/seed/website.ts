import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload, TypedLocale } from 'payload'

import { getMarketing } from '@/content/getMarketing'
import {
  marketingImages,
  type ImageRef,
  type MarketingImageKey,
} from '@/content/marketing'
import { ensureSeedMedia } from '@/seed/ensureSeedMedia'
import { mergeLocale, stripLegacyBilingualCopy } from '@/seed/localeCopy'

const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const seedContext = { disableRevalidate: true }

function filePathFor(filename: string) {
  return path.join(assetsDir, filename)
}

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

async function findPage(payload: Payload, slug: string) {
  for (const draft of [false, true]) {
    const existing = await payload.find({
      collection: 'pages',
      depth: 0,
      draft,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { slug: { equals: slug } },
    })
    if (existing.docs[0]) return { id: existing.docs[0].id, draft }
  }
  return null
}

async function ensureMedia(payload: Payload): Promise<MediaIds> {
  const ids = {} as MediaIds

  for (const key of Object.keys(marketingImages) as MarketingImageKey[]) {
    const image = marketingImages[key]
    ids[key] = await ensureSeedMedia(payload, {
      alt: image.alt,
      filePath: filePathFor(image.file),
      filename: image.file,
    })
  }

  return ids
}

function imageId(ids: MediaIds, image?: ImageRef) {
  return image ? ids[image.key] : undefined
}

function pageDefinitions(copy: ReturnType<typeof getMarketing>, ids: MediaIds) {
  const homeContent = copy.home
  const aboutContent = copy.about
  const servicesContent = copy.services
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
            image: imageId(ids, servicesContent.intro.image),
            imageAlt: servicesContent.intro.image?.alt,
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

  return pages
}

function blockTypeOf(block: unknown) {
  return isRecord(block) && typeof block.blockType === 'string' ? block.blockType : ''
}

/**
 * Existing demo pages keep their copy. The canvas refresh only reorders the
 * original home blocks and attaches the services hero when that image is empty.
 */
async function alignCanvasLayout(payload: Payload, id: number, draft: boolean, ids: MediaIds) {
  const saved = await payload.findByID({
    collection: 'pages',
    id,
    depth: 0,
    draft,
    locale: 'en',
    fallbackLocale: false,
    overrideAccess: true,
  })
  if (!Array.isArray(saved.layout)) return null
  const types = saved.layout.map((block) => blockTypeOf(block))
  let next = saved.layout
  let changed = false

  if (
    saved.slug === 'home' &&
    types.join(',') === 'serviceCards,splitFeature,processSection,categoryBar,ctaBand'
  ) {
    next = [next[1], next[0], next[2], next[3], next[4]]
    changed = true
  }

  if (saved.slug === 'services') {
    next = next.map((block) => {
      if (!isRecord(block)) return block
      if (block.blockType === 'pageIntro' && !block.image) {
        changed = true
        return {
          ...block,
          image: ids.serviceInterior,
          imageAlt: typeof block.imageAlt === 'string' && block.imageAlt ? block.imageAlt : 'Interior fit-out',
        }
      }
      // The canvas enquire band is a dark photo. Only the original light demo band is flipped.
      if (block.blockType === 'ctaBand' && block.tone === 'light') {
        changed = true
        return { ...block, tone: 'dark' }
      }
      return block
    })
  }

  if (!changed) return null

  await payload.update({
    collection: 'pages',
    id,
    draft,
    locale: 'en',
    overrideAccess: true,
    context: seedContext,
    data: { layout: next as never },
  })
  return saved.slug === 'home' ? `page home: reordered to canvas` : `page services: canvas hero and enquire band`
}

async function seedPages(payload: Payload, ids: MediaIds) {
  const english = pageDefinitions(getMarketing('en'), ids)
  const chinese = pageDefinitions(getMarketing('zh'), ids)
  const summary: string[] = []

  for (const page of english) {
    const zhPage = chinese.find((item) => item.slug === page.slug)
    const existing = await findPage(payload, page.slug)
    let id = existing?.id
    const draft = existing?.draft ?? false

    if (!id) {
      const created = await payload.create({
        collection: 'pages',
        overrideAccess: true,
        draft: false,
        locale: 'en',
        context: seedContext,
        data: page.data,
      })
      id = created.id
      summary.push(`page ${page.slug}: created`)
    } else {
      const saved = await payload.findByID({
        collection: 'pages',
        id,
        depth: 0,
        draft,
        locale: 'en',
        fallbackLocale: false,
        overrideAccess: true,
      })
      const stripped = stripLegacyBilingualCopy(saved)
      if (stripped.changed && isRecord(stripped.value)) {
        const value = stripped.value
        await payload.update({
          collection: 'pages',
          id,
          draft,
          locale: 'en',
          overrideAccess: true,
          context: seedContext,
          data: {
            hero: value.hero as Record<string, unknown>,
            layout: value.layout as never,
          },
        })
        summary.push(`page ${page.slug}: cleared mixed-language subtitles`)
      } else {
        summary.push(`page ${page.slug}: english kept`)
      }
    }

    const aligned = id ? await alignCanvasLayout(payload, id, draft, ids) : null
    if (aligned) summary.push(aligned)

    if (!zhPage) continue

    const zhSaved = await payload.findByID({
      collection: 'pages',
      id,
      depth: 0,
      draft,
      locale: 'zh' as TypedLocale,
      fallbackLocale: false,
      overrideAccess: true,
    })

    if (zhSaved.title) {
      summary.push(`page ${page.slug}: zh kept`)
      continue
    }

    const enSaved = await payload.findByID({
      collection: 'pages',
      id,
      depth: 0,
      draft,
      locale: 'en',
      fallbackLocale: false,
      overrideAccess: true,
    })

    await payload.update({
      collection: 'pages',
      id,
      draft,
      locale: 'zh' as TypedLocale,
      overrideAccess: true,
      context: seedContext,
      data: {
        title: ({ home: '首页', about: '关于我们', services: '服务' } as Record<string, string>)[page.slug] || zhPage.data.title,
        hero: mergeLocale(enSaved.hero, zhPage.data.hero) as never,
        layout: mergeLocale(enSaved.layout, zhPage.data.layout) as never,
        meta: mergeLocale(enSaved.meta, zhPage.data.meta) as never,
      },
    })
    summary.push(`page ${page.slug}: zh filled`)
  }

  return summary
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

async function seedGlobals(payload: Payload) {
  const summary: string[] = []
  const english = getMarketing('en')
  const chinese = getMarketing('zh')
  const header = await payload.findGlobal({ slug: 'header', overrideAccess: true, locale: 'en' })
  const headerData: Record<string, unknown> = {}

  if (!header.navItems?.length) {
    headerData.navItems = english.header.primary.map(navLink)
  }
  if (!header.secondaryNavItems?.length) {
    headerData.secondaryNavItems = english.header.secondary.map(navLink)
  }
  if (Object.keys(headerData).length) {
    await payload.updateGlobal({
      slug: 'header',
      overrideAccess: true,
      locale: 'en',
      context: seedContext,
      data: headerData,
    })
    summary.push('header: filled empty navigation')
  } else {
    summary.push('header: english kept')
  }

  const footer = await payload.findGlobal({ slug: 'footer', overrideAccess: true, locale: 'en' })
  const footerData: Record<string, unknown> = {}
  if (!footer.blurb) footerData.blurb = english.footer.blurb
  if (!footer.tagline) footerData.tagline = english.footer.tagline
  if (!footer.location) footerData.location = english.footer.location
  if (!footer.serviceLinks?.length) footerData.serviceLinks = english.footer.services.map(navLink)
  if (!footer.navItems?.length) footerData.navItems = english.footer.company.map(navLink)

  if (Object.keys(footerData).length) {
    await payload.updateGlobal({
      slug: 'footer',
      overrideAccess: true,
      locale: 'en',
      context: seedContext,
      data: footerData,
    })
    summary.push('footer: filled empty fields')
  } else {
    summary.push('footer: english kept')
  }

  summary.push(await fillHeaderLocale(payload, chinese.header))
  summary.push(await fillFooterLocale(payload, chinese.footer))

  return summary
}

async function fillHeaderLocale(
  payload: Payload,
  copy: ReturnType<typeof getMarketing>['header'],
) {
  const header = await payload.findGlobal({
    slug: 'header',
    overrideAccess: true,
    locale: 'zh' as TypedLocale,
    fallbackLocale: false,
  })
  const navItems = localizeNav(header.navItems, copy.primary)
  const secondaryNavItems = localizeNav(header.secondaryNavItems, copy.secondary)
  if (!navItems && !secondaryNavItems) return 'header: zh kept'

  await payload.updateGlobal({
    slug: 'header',
    overrideAccess: true,
    locale: 'zh' as TypedLocale,
    context: seedContext,
    data: {
      ...(navItems ? { navItems } : {}),
      ...(secondaryNavItems ? { secondaryNavItems } : {}),
    },
  })
  return 'header: zh filled'
}

async function fillFooterLocale(
  payload: Payload,
  copy: ReturnType<typeof getMarketing>['footer'],
) {
  const footer = await payload.findGlobal({
    slug: 'footer',
    overrideAccess: true,
    locale: 'zh' as TypedLocale,
    fallbackLocale: false,
  })
  const data: Record<string, unknown> = {}
  if (!footer.blurb) data.blurb = copy.blurb
  if (!footer.tagline) data.tagline = copy.tagline
  if (!footer.location) data.location = copy.location
  const serviceLinks = localizeNav(footer.serviceLinks, copy.services)
  const navItems = localizeNav(footer.navItems, copy.company)
  if (serviceLinks) data.serviceLinks = serviceLinks
  if (navItems) data.navItems = navItems
  if (!Object.keys(data).length) return 'footer: zh kept'

  await payload.updateGlobal({
    slug: 'footer',
    overrideAccess: true,
    locale: 'zh' as TypedLocale,
    context: seedContext,
    data,
  })
  return 'footer: zh filled'
}

function localizeNav(
  items: { id?: string | null; link?: { type?: string | null; url?: string | null; label?: string | null; newTab?: boolean | null } | null }[] | null | undefined,
  translations: { label: string; href: string }[],
) {
  if (!items?.length) return null
  if (items.every((item) => item.link?.label)) return null

  return items.map((item) => {
    const href = item.link?.url
    const match = translations.find((entry) => entry.href === href)
    return {
      id: item.id,
      link: {
        type: item.link?.type === 'reference' ? ('reference' as const) : ('custom' as const),
        url: item.link?.url,
        newTab: item.link?.newTab,
        label: item.link?.label || match?.label || '',
      },
    }
  })
}

export async function seedWebsite(payload: Payload) {
  const ids = await ensureMedia(payload)
  const pages = await seedPages(payload, ids)
  const globals = await seedGlobals(payload)
  const summary = [...pages, ...globals]
  console.log(summary.join('\n'))
  return summary
}
