import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload, TypedLocale } from 'payload'

import { getMarketing } from '@/content/getMarketing'
import {
  marketingImages,
  type ImageRef,
  type MarketingImageKey,
} from '@/content/marketing'
import { alignFooterServiceLabels, alignHeaderNav, asNavItems, withoutInteriorLinks } from '@/content/navMenu'
import { alignPhase1Layout, replaceLeakedEnglishPhrases } from '@/content/phase1Align'
import { ensureSeedMedia } from '@/seed/ensureSeedMedia'
import { mergeLocale, stripLegacyBilingualCopy } from '@/seed/localeCopy'

const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets')
const seedContext = { disableRevalidate: true }

function filePathFor(filename: string) {
  return path.join(assetsDir, filename)
}

type MediaIds = Record<MarketingImageKey, number>

type SeedNavLink = {
  link: { type: 'custom'; url: string; label: string }
  children?: SeedNavLink[]
}

function navLink(item: { label: string; href: string; children?: { label: string; href: string }[] }): SeedNavLink {
  return {
    link: {
      type: 'custom',
      url: item.href,
      label: item.label,
    },
    ...(item.children?.length ? { children: item.children.map((child) => navLink(child)) } : {}),
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
          headlineAccent: homeContent.hero.headlineAccent,
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
            variant: homeContent.serviceCards.variant,
            eyebrow: homeContent.serviceCards.eyebrow,
            heading: homeContent.serviceCards.heading,
            headingAccent: homeContent.serviceCards.headingAccent,
            body: homeContent.serviceCards.body,
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
            trustEyebrow: homeContent.process.trustEyebrow,
            trustHeading: homeContent.process.trustHeading,
            trustItems: homeContent.process.trustItems.map((item) => ({
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
            eyebrow: homeContent.cta.eyebrow,
            heading: homeContent.cta.heading,
            body: homeContent.cta.body,
            image: ids.serviceJoinery,
            imageAlt: 'Custom joinery',
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
            eyebrow: aboutContent.cta.eyebrow,
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
            featuresLabel: servicesContent.details.featuresLabel,
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
            body: servicesContent.process.body,
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
            eyebrow: servicesContent.cta.eyebrow,
            heading: servicesContent.cta.heading,
            body: servicesContent.cta.body,
            image: ids.heroHouse,
            imageAlt: 'House at dusk',
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
          imageAlt: typeof block.imageAlt === 'string' && block.imageAlt ? block.imageAlt : 'Finished interior',
        }
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

const heroTypography = {
  en: {
    eyebrowFrom: 'Residential / Commercial / Joinery / Interior Fit-out',
    eyebrow: 'Builders & Joiners · Est. Melbourne',
    headlineFrom: 'Built from the\nground up.',
    headline: 'Built from the ground up.',
    descriptionFrom:
      'Residential construction, renovation, commercial fit-out and custom joinery — built with quality, precision and care.',
    description:
      'Residential construction, renovation, commercial fit-out and custom joinery — delivered by one team, with precision and care.',
    badgesFrom: ['Quality', 'Construction', 'Lasting Value'],
    badges: ['Residential', 'Commercial', 'Joinery'],
  },
  zh: {
    eyebrowFrom: '住宅施工 / 商业装修 / 定制木作 / 室内交付',
    eyebrow: '建筑与木作 · 墨尔本',
    headlineFrom: '从施工落地\n开始。',
    headline: '从施工落地开始。',
    descriptionFrom: '住宅施工、翻新、商业装修与定制木作，以品质、精度和用心完成。',
    description: '住宅施工、翻新、商业装修与定制木作，由同一个团队完成，讲究精度和用心。',
    badgesFrom: ['品质', '施工', '长久价值'],
    badges: ['住宅', '商业', '木作'],
  },
} as const

function enquiryOnlyLinks(links: unknown) {
  if (!Array.isArray(links) || links.length === 0) return false
  return links.every((item) => {
    if (!isRecord(item) || !isRecord(item.link)) return false
    const label = typeof item.link.label === 'string' ? item.link.label : ''
    return item.link.url === '/enquiry' && (/enquiry/i.test(label) || label.includes('咨询'))
  })
}

/**
 * Rewrites only the previous demo hero strings. Edited headlines are left alone.
 * Headline, eyebrow, and badge fields are localized, so each locale is patched on its own.
 */
async function alignHeroTypography(payload: Payload, id: number, draft: boolean, locale: 'en' | 'zh') {
  const saved = await payload.findByID({
    collection: 'pages',
    id,
    depth: 0,
    draft,
    locale,
    fallbackLocale: false,
    overrideAccess: true,
  })
  const copy = heroTypography[locale]
  let changed = false
  let hero = saved.hero
  let layout = saved.layout

  if (saved.slug === 'home' && isRecord(hero)) {
    const next = { ...hero }
    if (next.eyebrow === copy.eyebrowFrom) {
      next.eyebrow = copy.eyebrow
      changed = true
    }
    if (next.headline === copy.headlineFrom) {
      next.headline = copy.headline
      changed = true
    }
    if (next.description === copy.descriptionFrom) {
      next.description = copy.description
      changed = true
    }
    if (
      next.badgePrimary === copy.badgesFrom[0] &&
      next.badgeSecondary === copy.badgesFrom[1] &&
      next.badgeMuted === copy.badgesFrom[2]
    ) {
      next.badgePrimary = copy.badges[0]
      next.badgeSecondary = copy.badges[1]
      next.badgeMuted = copy.badges[2]
      changed = true
    }
    if (enquiryOnlyLinks(next.links)) {
      next.links = []
      changed = true
    }
    hero = next
  }

  if (Array.isArray(layout)) {
    layout = layout.map((block) => {
      if (!isRecord(block) || block.blockType !== 'pageIntro') return block
      let heading = typeof block.heading === 'string' ? block.heading : ''
      let headingAccent = typeof block.headingAccent === 'string' ? block.headingAccent : ''
      let description = typeof block.description === 'string' ? block.description : ''
      let blockChanged = false
      if (heading === 'Building with' && headingAccent === 'care and precision') {
        heading = 'Building with care & precision.'
        headingAccent = 'care'
        blockChanged = true
      }
      if (
        description ===
        'Zillion Home is a Melbourne-based builder bringing construction, interiors and joinery together under one team. We deliver residential and commercial projects with a clear process and close attention to every detail.'
      ) {
        description = 'A Melbourne builder bringing construction, interiors and joinery together under one team.'
        blockChanged = true
      }
      if (heading === '住宅、商业与\n定制木作') {
        heading = '住宅、商业与定制木作'
        blockChanged = true
      }
      if (!blockChanged) return block
      changed = true
      return { ...block, heading, headingAccent, description }
    })
  }

  if (!changed) return null

  await payload.update({
    collection: 'pages',
    id,
    draft,
    locale,
    overrideAccess: true,
    context: seedContext,
    data: {
      ...(saved.slug === 'home' ? { hero: hero as never } : {}),
      ...(Array.isArray(layout) ? { layout: layout as never } : {}),
    },
  })
  return `page ${saved.slug}: hero typography aligned (${locale})`
}

/**
 * Rewrites known pre-feedback blocks (process, capabilities cards, category bar,
 * services, joinery, in-house sentences). It also renames a Services joinery title
 * that is still the longer name, and removes an enquiry link on the joinery band.
 * The Home briefs block is left as stored so an edited Home 01 is not overwritten.
 */
async function alignPhase1Page(
  payload: Payload,
  id: number,
  draft: boolean,
  locale: 'en' | 'zh',
  ids: MediaIds,
) {
  const saved = await payload.findByID({
    collection: 'pages',
    id,
    depth: 0,
    draft,
    locale,
    fallbackLocale: false,
    overrideAccess: true,
  })
  if (!Array.isArray(saved.layout) || typeof saved.slug !== 'string') return null
  const leaked = locale === 'zh' ? replaceLeakedEnglishPhrases(saved.layout) : { changed: false, value: saved.layout }
  const aligned = alignPhase1Layout(leaked.value, locale, saved.slug, {
    idea: ids.featureInterior,
    plans: ids.trustQualified,
  })
  if (!aligned.changed && !leaked.changed) return null

  await payload.update({
    collection: 'pages',
    id,
    draft,
    locale,
    overrideAccess: true,
    context: seedContext,
    data: { layout: (aligned.changed ? aligned.layout : leaked.value) as never },
  })
  return `page ${saved.slug}: phase 1 copy aligned (${locale})`
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
      summary.push(`page ${page.slug}: english kept`)
    }

    if (!zhPage || !id) continue

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
  if (!header.contentSeeded) {
    const headerData: Record<string, unknown> = { contentSeeded: true }
    if (!header.navItems?.length) headerData.navItems = english.header.primary.map(navLink)
    if (!header.secondaryNavItems?.length) {
      headerData.secondaryNavItems = english.header.secondary.map(navLink)
    }
    if (!header.enquiryLabel) headerData.enquiryLabel = 'Start an Enquiry →'
    if (!header.enquiryUrl) headerData.enquiryUrl = '/enquiry'
    await payload.updateGlobal({
      slug: 'header',
      overrideAccess: true,
      locale: 'en',
      context: seedContext,
      data: headerData,
    })
    summary.push('header: initial navigation filled')
    summary.push(await fillHeaderLocale(payload, chinese.header))
  } else {
    summary.push('header: english kept')
  }

  const footer = await payload.findGlobal({ slug: 'footer', overrideAccess: true, locale: 'en' })
  if (!footer.contentSeeded) {
    const footerData: Record<string, unknown> = { contentSeeded: true }
    if (!footer.blurb) footerData.blurb = english.footer.blurb
    if (!footer.tagline) footerData.tagline = english.footer.tagline
    if (!footer.location) footerData.location = english.footer.location
    if (!footer.serviceLinks?.length) footerData.serviceLinks = english.footer.services.map(navLink)
    if (!footer.navItems?.length) footerData.navItems = english.footer.company.map(navLink)
    await payload.updateGlobal({
      slug: 'footer',
      overrideAccess: true,
      locale: 'en',
      context: seedContext,
      data: footerData,
    })
    summary.push('footer: initial fields filled')
    summary.push(await fillFooterLocale(payload, chinese.footer))
  } else {
    summary.push('footer: english kept')
  }

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
  const data: Record<string, unknown> = {}
  if (navItems) data.navItems = navItems
  if (secondaryNavItems) data.secondaryNavItems = secondaryNavItems
  if (!header.enquiryLabel) data.enquiryLabel = '开始咨询 →'
  if (!Object.keys(data).length) return 'header: zh kept'

  await payload.updateGlobal({
    slug: 'header',
    overrideAccess: true,
    locale: 'zh' as TypedLocale,
    context: seedContext,
    data,
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

type NavTranslation = { label: string; href: string; children?: NavTranslation[] }

type StoredNavItem = {
  id?: string | null
  link?: { type?: string | null; url?: string | null; label?: string | null; newTab?: boolean | null } | null
  children?: StoredNavItem[] | null
}

type LocalizedNav = {
  id?: string | null
  link: {
    type: 'reference' | 'custom'
    url?: string | null
    newTab?: boolean | null
    label: string
  }
  children?: LocalizedNav[]
}

function findTranslation(translations: NavTranslation[], href: string | null | undefined): NavTranslation | undefined {
  if (!href) return undefined
  for (const entry of translations) {
    if (entry.href === href) return entry
    const nested = entry.children ? findTranslation(entry.children, href) : undefined
    if (nested) return nested
  }
  return undefined
}

function storedNav(items: StoredNavItem[]): LocalizedNav[] {
  return items.map((item) => ({
    id: item.id,
    link: {
      type: item.link?.type === 'reference' ? 'reference' : 'custom',
      url: item.link?.url,
      newTab: item.link?.newTab,
      label: item.link?.label || '',
    },
    ...(item.children?.length ? { children: storedNav(item.children) } : {}),
  }))
}

function localizeNav(items: StoredNavItem[] | null | undefined, translations: NavTranslation[]): LocalizedNav[] | null {
  if (!items?.length) return null
  let changed = false
  const next: LocalizedNav[] = items.map((item) => {
    const match = findTranslation(translations, item.link?.url)
    const label = item.link?.label || match?.label || ''
    if (!item.link?.label && match?.label) changed = true
    const childTranslations = match?.children?.length ? match.children : translations
    const localizedChildren = item.children?.length ? localizeNav(item.children, childTranslations) : null
    if (localizedChildren) changed = true
    const children = localizedChildren || (item.children?.length ? storedNav(item.children) : undefined)
    return {
      id: item.id,
      link: {
        type: item.link?.type === 'reference' ? 'reference' : 'custom',
        url: item.link?.url,
        newTab: item.link?.newTab,
        label,
      },
      ...(children ? { children } : {}),
    }
  })
  return changed ? next : null
}

/**
 * One-off correction for data saved before editor content was left alone.
 * Safe to run again: already-corrected copy and custom labels do not match
 * the old sentences, and an edited Home 01 block is never rewritten.
 * Fresh databases have no pages yet, so this does not insert the baseline.
 * `seedWebsite` does that once, then sets `contentSeeded` so later deploys
 * do not refill fields an editor cleared.
 */
export async function applyWebsiteBaseline(payload: Payload) {
  const summary: string[] = []
  const ids = {} as MediaIds
  for (const key of ['featureInterior', 'trustQualified', 'serviceInterior'] as const) {
    const image = marketingImages[key]
    const found = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { filename: { equals: image.file } },
    })
    if (found.docs[0]) ids[key] = found.docs[0].id
  }

  for (const slug of ['home', 'about', 'services']) {
    const existing = await findPage(payload, slug)
    if (!existing) continue
    const { id, draft } = existing
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
      summary.push(`page ${slug}: cleared mixed-language subtitles`)
    }
    const canvas = await alignCanvasLayout(payload, id, draft, ids)
    if (canvas) summary.push(canvas)
    for (const locale of ['en', 'zh'] as const) {
      const hero = await alignHeroTypography(payload, id, draft, locale)
      if (hero) summary.push(hero)
      const phase = await alignPhase1Page(payload, id, draft, locale, ids)
      if (phase) summary.push(phase)
    }
  }

  const header = await payload.findGlobal({ slug: 'header', overrideAccess: true, locale: 'en' })
  const headerHasContent = Boolean(header.navItems?.length || header.secondaryNavItems?.length)
  if (headerHasContent) {
    const headerData: Record<string, unknown> = {}
    if (header.navItems?.length) {
      const aligned = alignHeaderNav(asNavItems(header.navItems), 'en')
      if (aligned.changed) headerData.navItems = aligned.items
    }
    if (header.secondaryNavItems?.length) {
      const cleaned = withoutInteriorLinks(header.secondaryNavItems)
      if (cleaned.changed) headerData.secondaryNavItems = cleaned.items
    }
    if (!header.contentSeeded) headerData.contentSeeded = true
    if (Object.keys(headerData).length) {
      await payload.updateGlobal({
        slug: 'header',
        overrideAccess: true,
        locale: 'en',
        context: seedContext,
        data: headerData,
      })
      summary.push('header: baseline locked')
    }
    summary.push(await fillHeaderLocale(payload, getMarketing('zh').header))
  }

  const footer = await payload.findGlobal({ slug: 'footer', overrideAccess: true, locale: 'en' })
  const footerHasContent = Boolean(
    footer.blurb || footer.tagline || footer.location || footer.serviceLinks?.length || footer.navItems?.length,
  )
  if (footerHasContent) {
    const footerData: Record<string, unknown> = {}
    if (footer.serviceLinks?.length) {
      const cleaned = withoutInteriorLinks(footer.serviceLinks)
      const labeled = alignFooterServiceLabels(cleaned.items, 'en')
      if (cleaned.changed || labeled.changed) footerData.serviceLinks = labeled.items
    }
    const zhFooter = await payload.findGlobal({
      slug: 'footer',
      overrideAccess: true,
      locale: 'zh' as TypedLocale,
      fallbackLocale: false,
    })
    if (zhFooter.serviceLinks?.length) {
      const labeledZh = alignFooterServiceLabels(zhFooter.serviceLinks, 'zh')
      if (labeledZh.changed) {
        await payload.updateGlobal({
          slug: 'footer',
          overrideAccess: true,
          locale: 'zh' as TypedLocale,
          context: seedContext,
          data: { serviceLinks: labeledZh.items },
        })
      }
    }
    if (!footer.contentSeeded) footerData.contentSeeded = true
    if (Object.keys(footerData).length) {
      await payload.updateGlobal({
        slug: 'footer',
        overrideAccess: true,
        locale: 'en',
        context: seedContext,
        data: footerData,
      })
      summary.push('footer: baseline locked')
    }
    summary.push(await fillFooterLocale(payload, getMarketing('zh').footer))
  }

  if (summary.length) console.log(summary.join('\n'))
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
