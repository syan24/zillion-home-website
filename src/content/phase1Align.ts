import { getMarketing } from '@/content/getMarketing'
import {
  alignHomeProcessLayout,
  ourProcessSteps,
  ourProcessStepsZh,
  type ProcessLocale,
} from '@/content/processSteps'

export type Phase1Media = {
  idea?: number
  plans?: number
}

const oldServiceCardHeadings = new Set(['Four core capabilities', '四项核心能力'])

const oldCategoryTitles: Record<ProcessLocale, string[]> = {
  en: [
    'Residential Construction',
    'Renovation',
    'Commercial Fit-out',
    'Custom Joinery',
    'Interior Fit-out & Delivery',
  ],
  zh: ['住宅施工', '翻新', '商业装修', '定制木作', '室内装修与交付'],
}

const oldProcessHeadings: Record<ProcessLocale, string[]> = {
  en: ['Clarity at every stage.', 'Our process'],
  zh: ['每个阶段都清楚。', '我们的流程'],
}

const oldProcessEyebrows: Record<ProcessLocale, string[]> = {
  en: ['The Way We Work', 'How We Work'],
  zh: ['我们的方式', '我们如何工作'],
}

const oldProcessBodies: Record<ProcessLocale, string[]> = {
  en: [
    'From initial consultation to final handover, we coordinate construction, interior fit-out and custom joinery to deliver well-managed projects with practical solutions and quality workmanship.',
  ],
  zh: [
    '从初次沟通到最终交付，我们协调施工、室内装修与定制木作，把项目管清楚，给出实用做法，并保证做工品质。',
  ],
}

const oldTrustTitles: Record<ProcessLocale, string[]> = {
  en: ['Qualified & Insured', 'In-house Joinery Capability', 'Quality & Care'],
  zh: ['持证并投保', '自有木作能力', '品质与用心'],
}

const oldTrustEyebrows = new Set(['Our assurances', '我们的保证'])
const oldTrustHeadings = new Set([
  'Craft you can see. Confidence you can feel.',
  '看得见的工艺，感受得到的把握。',
])

const oldCapabilityHeadings = new Set(['Our capabilities', 'Our Capabilities', '我们的能力'])

const oldEnquireLabels = new Set([
  'Enquire about Residential',
  'Enquire about Commercial',
  'Enquire about Custom',
  'Enquire about Interior',
  '咨询住宅项目',
  '咨询商业项目',
  '咨询定制木作',
  '咨询室内项目',
])

const oldJoineryAccents = new Set(['crafted in-house', '车间内完成'])

const staleJoineryTitles = new Set(['Custom Joinery & Cabinetry', '定制橱柜与木作'])

const phraseSwaps: Record<ProcessLocale, [string, string][]> = {
  en: [
    [
      'Our in-house joinery capability means we can handle everything from structural work to the finest cabinetry details — all under one roof.',
      'Custom joinery is coordinated with the construction work, so cabinetry can be planned with the rest of the project.',
    ],
    [
      'Our in-house joinery workshop allows us to deliver custom cabinetry with the same quality control as our construction work — no outsourcing, no surprises.',
      'Custom cabinetry is coordinated with the same care as our construction work, so the details stay consistent across the project.',
    ],
    [
      'Bespoke joinery crafted in our workshop. Whether standalone or as part of a larger project, we deliver precision-made cabinetry tailored to your space.',
      'Made-to-order cabinetry tailored to each project, with flexibility in dimensions, layouts, materials and finishes, including 2PAC painted and laminate options. It suits standalone joinery projects and larger renovations.',
    ],
    [
      'Four capabilities under one roof — from ground-up construction to precision cabinetry, delivered as one complete building service.',
      'Three core services — residential construction and renovation, commercial fit-out, and custom joinery — delivered by one building team.',
    ],
    [
      'Four core capabilities under one roof. From ground-up construction to precision cabinetry, we deliver complete building solutions for homes and businesses.',
      'Three core services — residential construction and renovation, commercial fit-out, and custom joinery — delivered by one building team.',
    ],
  ],
  zh: [
    [
      '自有木作能力让我们可以从结构工程做到最细的橱柜，都在同一屋檐下完成。',
      '定制木作与施工一起协调，橱柜可以和项目的其他部分一起计划。',
    ],
    [
      '自有木作车间让定制橱柜与施工使用同一套品质控制，不外包，也少意外。',
      '定制橱柜与施工用同样的用心来协调，细节在整个项目里保持一致。',
    ],
    [
      '在我们的车间完成定制木作。可以单独做，也可以作为更大项目的一部分，按您的空间来做。',
      '按每个项目定制的橱柜，尺寸、布局、材料和饰面都可以调整，包括 2PAC 烤漆和层压板。适合单独的木作项目，也适合更大的翻新。',
    ],
    [
      '四项核心能力在同一屋檐下。从地基施工到精确橱柜，为住宅和企业提供完整的建造方案。',
      '三项核心业务由同一个团队完成：住宅施工与翻新、商业装修和定制木作。',
    ],
  ],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function titles(items: unknown) {
  if (!Array.isArray(items)) return []
  return items.map((item) => (isRecord(item) ? text(item.title) : '')).filter(Boolean)
}

function sameTitles(left: string[], right: readonly string[]) {
  return left.length === right.length && left.every((title, index) => title === right[index])
}

export function isInteriorServiceTitle(title: string | null | undefined) {
  const value = (title || '').trim().toLowerCase()
  if (!value) return false
  return (
    value.includes('interior fit-out') ||
    value.includes('interior fit out') ||
    value.includes('室内装修') ||
    value.includes('室内交付')
  )
}

export function isLegacyEnquireLabel(label: string | null | undefined) {
  const value = (label || '').trim()
  if (!value) return false
  if (oldEnquireLabels.has(value)) return true
  const bare = value.replace(/\s*→\s*$/, '').trim()
  if (bare !== value && oldEnquireLabels.has(bare)) return true
  return /^enquire about\b/i.test(value)
}

function officialJoineryTitle(locale: ProcessLocale) {
  return locale === 'zh' ? '定制木作' : 'Custom Joinery'
}

function enquiryPath(href: string) {
  const trimmed = href.trim()
  if (!trimmed) return ''
  const withoutQuery = trimmed.split(/[?#]/)[0] || ''
  if (/^https?:\/\//i.test(withoutQuery)) {
    try {
      return new URL(withoutQuery).pathname.replace(/\/$/, '') || '/'
    } catch {
      return withoutQuery
    }
  }
  const path = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`
  return path.replace(/\/$/, '') || '/'
}

function isEnquiryHref(href: string) {
  const path = enquiryPath(href)
  return path === '/enquiry' || path.startsWith('/enquiry/')
}

function isBandEnquiryLink(link: unknown) {
  if (!isRecord(link)) return false
  if (isEnquiryHref(text(link.href))) return true
  return isLegacyEnquireLabel(text(link.label))
}

function stripEnquiryLinks(block: Record<string, unknown>) {
  if (!Array.isArray(block.links) || block.links.length === 0) {
    return { changed: false, block }
  }
  const links = block.links.filter((link) => !isBandEnquiryLink(link))
  if (links.length === block.links.length) return { changed: false, block }
  return { changed: true, block: { ...block, links } }
}

function withJoineryTitle(service: Record<string, unknown>, locale: ProcessLocale) {
  const title = officialJoineryTitle(locale)
  let changed = false
  const next: Record<string, unknown> = { ...service }
  if (staleJoineryTitles.has(text(service.title))) {
    next.title = title
    changed = true
  }
  if (staleJoineryTitles.has(text(service.imageAlt))) {
    next.imageAlt = title
    changed = true
  }
  return changed ? next : service
}

function swapPhrases(value: string, locale: ProcessLocale) {
  let next = value
  for (const [from, to] of phraseSwaps[locale]) {
    if (next.includes(from)) next = next.split(from).join(to)
  }
  return next
}

/**
 * One-off: Chinese fields that still contain the old English sentences
 * receive the matching Chinese sentence. Custom wording is left as stored.
 */
export function replaceLeakedEnglishPhrases(value: unknown): { changed: boolean; value: unknown } {
  if (typeof value === 'string') {
    let next = value
    for (let index = 0; index < phraseSwaps.en.length; index++) {
      const from = phraseSwaps.en[index]?.[0]
      const to = phraseSwaps.zh[index]?.[1]
      if (from && to && next.includes(from)) next = next.split(from).join(to)
    }
    return next === value ? { changed: false, value } : { changed: true, value: next }
  }
  if (Array.isArray(value)) {
    let changed = false
    const next = value.map((item) => {
      const result = replaceLeakedEnglishPhrases(item)
      changed = changed || result.changed
      return result.value
    })
    return { changed, value: changed ? next : value }
  }
  if (isRecord(value)) {
    let changed = false
    const next: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(value)) {
      const result = replaceLeakedEnglishPhrases(child)
      changed = changed || result.changed
      next[key] = result.value
    }
    return { changed, value: changed ? next : value }
  }
  return { changed: false, value }
}

function withId(current: unknown, fields: Record<string, unknown>) {
  const id =
    isRecord(current) && (typeof current.id === 'string' || typeof current.id === 'number')
      ? current.id
      : undefined
  return { ...(id !== undefined ? { id } : {}), ...fields }
}

/**
 * Rewrites known pre-feedback marketing blocks.
 * The Home briefs block (Home 01, About Zillion Home) is never changed.
 */
export function alignPhase1Layout(
  layout: unknown,
  locale: ProcessLocale,
  slug: string,
  media?: Phase1Media,
): { changed: boolean; layout: unknown } {
  if (!Array.isArray(layout)) return { changed: false, layout }

  const copy = getMarketing(locale)
  const canonical = locale === 'zh' ? ourProcessStepsZh : ourProcessSteps
  let changed = false
  let next = layout.flatMap((block) => {
    if (!isRecord(block)) return [block]
    if (
      slug === 'about' &&
      block.blockType === 'capabilityList' &&
      oldCapabilityHeadings.has(text(block.heading))
    ) {
      changed = true
      return []
    }
    if (slug === 'home' && block.blockType === 'splitFeature') return [block]

    const updated = alignBlock(block, locale, copy, media)
    if (updated !== block) changed = true
    return [updated]
  })

  const process = alignHomeProcessLayout(next, locale, canonical)
  if (process.changed) {
    changed = true
    next = process.layout as unknown[]
  }

  return { changed, layout: changed ? next : layout }
}

function alignBlock(
  block: Record<string, unknown>,
  locale: ProcessLocale,
  copy: ReturnType<typeof getMarketing>,
  media?: Phase1Media,
) {
  if (block.blockType === 'serviceCards') return alignServiceCards(block, locale, copy, media)
  if (block.blockType === 'processSection') return alignProcessCopy(block, locale, copy)
  if (block.blockType === 'categoryBar') return alignCategory(block, locale, copy)
  if (block.blockType === 'serviceDetails') return alignServiceDetails(block, locale)
  if (block.blockType === 'splitFeature' && block.variant === 'darkCopy')
    return alignJoineryBand(block, locale, copy)
  return alignPhrases(block, locale)
}

function alignServiceCards(
  block: Record<string, unknown>,
  locale: ProcessLocale,
  copy: ReturnType<typeof getMarketing>,
  media?: Phase1Media,
) {
  const heading = text(block.heading)
  const cards = Array.isArray(block.cards) ? block.cards : []
  const promotesInterior = cards.some(
    (card) =>
      isRecord(card) &&
      (isInteriorServiceTitle(text(card.title)) ||
        (typeof card.href === 'string' && card.href.includes('#interior'))),
  )
  const legacy = oldServiceCardHeadings.has(heading) || promotesInterior
  if (!legacy) return alignPhrases(block, locale)
  if (heading === copy.home.serviceCards.heading && block.variant === 'pair') return block

  const desired = copy.home.serviceCards
  const images = [media?.idea, media?.plans]
  return {
    ...block,
    variant: 'pair',
    eyebrow: desired.eyebrow,
    heading: desired.heading,
    headingAccent: desired.headingAccent,
    body: desired.body,
    cards: desired.cards.map((card, index) => {
      const current = cards[index]
      const image = images[index] ?? (isRecord(current) ? current.image : undefined)
      return withId(current, {
        image,
        imageAlt: card.image.alt,
        title: card.title,
        subtitle: card.subtitle,
        description: card.description,
        href: card.href,
      })
    }),
  }
}

function alignProcessCopy(
  block: Record<string, unknown>,
  locale: ProcessLocale,
  copy: ReturnType<typeof getMarketing>,
) {
  const next = alignPhrases(block, locale)
  const source = copy.home.process
  const heading = text(next.heading)
  const eyebrow = text(next.eyebrow)
  const body = text(next.body)
  const patch: Record<string, unknown> = {}

  if (
    oldProcessHeadings[locale].includes(heading) ||
    oldProcessEyebrows[locale].includes(eyebrow) ||
    oldProcessBodies[locale].includes(body)
  ) {
    patch.eyebrow = source.eyebrow
    patch.heading = source.heading
    patch.body = source.body
  }

  const trustTitles = titles(next.trustItems)
  const existingTrust = Array.isArray(next.trustItems) ? next.trustItems : null
  if (existingTrust && sameTitles(trustTitles, oldTrustTitles[locale])) {
    patch.trustItems = source.trustItems.map((item, index) =>
      withId(existingTrust[index], {
        title: item.title,
        description: item.description,
        image: null,
        imageAlt: '',
      }),
    )
  }

  const hasTrust = Array.isArray(next.trustItems) && next.trustItems.length > 0
  const trustEyebrow = text(next.trustEyebrow)
  const trustHeading = text(next.trustHeading)
  if (hasTrust && (!trustEyebrow || oldTrustEyebrows.has(trustEyebrow)))
    patch.trustEyebrow = source.trustEyebrow
  if (hasTrust && (!trustHeading || oldTrustHeadings.has(trustHeading)))
    patch.trustHeading = source.trustHeading

  if (!Object.keys(patch).length) return next
  return { ...next, ...patch }
}

function alignCategory(
  block: Record<string, unknown>,
  locale: ProcessLocale,
  copy: ReturnType<typeof getMarketing>,
) {
  const current = titles(block.items)
  const desired = copy.home.categories.items.map((item) => item.title)
  if (sameTitles(current, desired)) return block
  const old = new Set(oldCategoryTitles[locale])
  const legacy =
    current.length > 0 && current.every((title) => old.has(title) || isInteriorServiceTitle(title))
  const existingItems = Array.isArray(block.items) ? block.items : null
  if (!legacy || !existingItems) return block
  return {
    ...block,
    items: copy.home.categories.items.map((item, index) =>
      withId(existingItems[index], { title: item.title }),
    ),
  }
}

function alignServiceDetails(block: Record<string, unknown>, locale: ProcessLocale) {
  if (!Array.isArray(block.services)) return alignPhrases(block, locale)
  const relatedLabel = locale === 'zh' ? '查看相关项目' : 'View Related Project'
  let changed = false
  const services = block.services.flatMap((service) => {
    if (!isRecord(service)) return [service]
    if (text(service.anchor) === 'interior' || isInteriorServiceTitle(text(service.title))) {
      changed = true
      return []
    }
    const phrased = withJoineryTitle(alignPhrases(service, locale), locale)
    const label = text(phrased.enquireLabel)
    if (!label || isLegacyEnquireLabel(label)) {
      changed = true
      return [{ ...phrased, enquireLabel: relatedLabel }]
    }
    if (phrased !== service) changed = true
    return [phrased]
  })

  if (!changed) return block
  return { ...block, services }
}

function alignJoineryBand(
  block: Record<string, unknown>,
  locale: ProcessLocale,
  copy: ReturnType<typeof getMarketing>,
) {
  const stripped = stripEnquiryLinks(block)
  const base = stripped.block
  const accent = text(base.headingAccent)
  const legacy =
    oldJoineryAccents.has(accent) ||
    text(base.eyebrow) === 'In-house Capability' ||
    text(base.eyebrow) === '自有能力'
  if (!legacy) {
    const phrased = alignPhrases(base, locale)
    if (!stripped.changed && phrased === base) return block
    return phrased
  }
  const desired = copy.services.joinery
  return {
    ...base,
    eyebrow: desired.eyebrow,
    heading: desired.heading,
    headingAccent: desired.headingAccent,
    body: desired.body,
  }
}

function alignPhrases(
  block: Record<string, unknown>,
  locale: ProcessLocale,
): Record<string, unknown> {
  let changed = false
  const next: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(block)) {
    if (typeof value === 'string') {
      const swapped = swapPhrases(value, locale)
      if (swapped !== value) changed = true
      next[key] = swapped
      continue
    }
    if (Array.isArray(value)) {
      const items = value.map((item) => (isRecord(item) ? alignPhrases(item, locale) : item))
      if (items.some((item, index) => item !== value[index])) changed = true
      next[key] = items
      continue
    }
    next[key] = value
  }
  return changed ? next : block
}
