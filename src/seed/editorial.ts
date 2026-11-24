import type { Payload, TypedLocale } from 'payload'

import { getMarketing } from '@/content/getMarketing'

const seedContext = { disableRevalidate: true }

const projectsCopy = {
  en: {
    eyebrow: 'Projects',
    heading: 'Real projects. Better ways to live.',
    headingAccent: 'Better ways to live.',
    intro:
      'Explore our portfolio of residential, commercial, and custom joinery projects, or browse by room to find inspiration for your space.',
    heroAlt: 'Project showcase',
    byProject: 'By Project',
    byRoom: 'By Room',
    typeHeading: 'Project type',
    filterHeading: 'Filter',
    types: [
      { value: 'residential', label: 'Residential' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'joinery', label: 'Custom Joinery' },
    ],
    bandEyebrow: 'Begin a project',
    bandHeading: 'Imagine your space here.',
    bandAccent: 'your space',
    enquireLabel: 'Start an Enquiry →',
    metaTitle: 'Projects | Zillion Home',
    metaDescription:
      'Browse residential construction, commercial fit-outs, and custom joinery projects. Filter by project type, room, and style.',
  },
  zh: {
    eyebrow: '项目',
    heading: '真实项目，启发更好的生活方式。',
    headingAccent: '启发更好的生活方式。',
    intro: '浏览住宅、商业与定制木作项目，或按空间寻找灵感。',
    heroAlt: '项目展示',
    byProject: '按项目',
    byRoom: '按空间',
    typeHeading: '项目类型',
    filterHeading: '筛选',
    types: [
      { value: 'residential', label: '住宅' },
      { value: 'commercial', label: '商业' },
      { value: 'joinery', label: '定制木作' },
    ],
    bandEyebrow: '开始一个项目',
    bandHeading: '想象这里是您的空间。',
    bandAccent: '您的空间',
    enquireLabel: '开始咨询 →',
    metaTitle: '项目 | Zillion Home',
    metaDescription: '浏览住宅施工、商业装修与定制木作项目。可按项目类型、空间和风格筛选。',
  },
} as const

const enquiryCopy = {
  en: {
    overlayEyebrow: "Let's Create Together",
    overlayTitle: 'Start an enquiry.',
    overlayAccent: 'enquiry.',
    overlayBody:
      'Tell us about your project and our team will be in touch to discuss your needs, provide guidance and next steps.',
    overlayLine1: 'Tailored Joinery',
    overlayLine2: 'For Better Living',
    imageAlt: 'Modern kitchen interior',
    formEyebrow: 'Contact Us',
    formHeading: 'Tell us about your project',
    formIntro:
      "Please fill out the form below and we'll get back to you as soon as possible. We'll provide expert advice and help guide your next steps.",
    metaTitle: 'Start an Enquiry | Zillion Home',
    metaDescription:
      'Tell us about your project. Our team will be in touch to discuss your needs, provide guidance and next steps.',
  },
  zh: {
    overlayEyebrow: '一起把项目落地',
    overlayTitle: '开始咨询。',
    overlayAccent: '咨询。',
    overlayBody: '告诉我们您的项目，团队会与您联系，讨论需求并说明下一步。',
    overlayLine1: '定制木作',
    overlayLine2: '为更好的生活',
    imageAlt: '现代厨房室内',
    formEyebrow: '联系我们',
    formHeading: '告诉我们您的项目',
    formIntro: '请填写下面的表格，我们会尽快回复，并提供下一步建议。',
    metaTitle: '开始咨询 | Zillion Home',
    metaDescription: '告诉我们您的项目需求。团队会与您联系，说明下一步。',
  },
} as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

async function mediaId(payload: Payload, filename: string) {
  const found = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: filename } },
  })
  return found.docs[0]?.id
}

/**
 * Fills the new editorial fields once. A later deploy does not put back a value
 * an editor cleared. Pages, header, and footer copy that already exists is kept.
 */
export async function seedEditorial(payload: Payload) {
  const current = await payload.findGlobal({
    slug: 'projects-page',
    locale: 'en',
    overrideAccess: true,
  })
  if (current.contentSeeded) {
    console.log('editorial: kept')
    return
  }

  const home = await payload.find({
    collection: 'pages',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'home' } },
  })
  if (!home.docs[0]) {
    console.log('editorial: pages not ready')
    return
  }

  const hero = await mediaId(payload, 'DSC03791.jpg')
  const joinery = await mediaId(payload, 'service-joinery.jpg')
  const house = await mediaId(payload, 'hero-house.jpg')
  const kitchen = await mediaId(payload, 'kew-kitchen.jpg')

  const savedProjects = await payload.updateGlobal({
    slug: 'projects-page',
    locale: 'en',
    overrideAccess: true,
    context: seedContext,
    data: {
      ...projectsCopy.en,
      types: projectsCopy.en.types.map((item) => ({ ...item, active: true })),
      hero: hero || null,
      enquireUrl: '/enquiry',
      contentSeeded: true,
    },
  })
  await payload.updateGlobal({
    slug: 'projects-page',
    locale: 'zh' as TypedLocale,
    overrideAccess: true,
    context: seedContext,
    data: {
      ...projectsCopy.zh,
      types: projectsCopy.zh.types.map((item, index) => ({
        id: savedProjects.types?.[index]?.id,
        label: item.label,
      })),
    },
  })

  await payload.updateGlobal({
    slug: 'enquiry-page',
    locale: 'en',
    overrideAccess: true,
    context: seedContext,
    data: { ...enquiryCopy.en, image: kitchen || null, contentSeeded: true },
  })
  await payload.updateGlobal({
    slug: 'enquiry-page',
    locale: 'zh' as TypedLocale,
    overrideAccess: true,
    context: seedContext,
    data: enquiryCopy.zh,
  })

  await fillHeaderEnquiry(payload)
  await fillPageFields(payload, 'home', 'en', joinery)
  await fillPageFields(payload, 'home', 'zh', joinery)
  await fillPageFields(payload, 'services', 'en', house)
  await fillPageFields(payload, 'services', 'zh', house)
  await fillPageFields(payload, 'about', 'en', undefined)
  await fillPageFields(payload, 'about', 'zh', undefined)
  await fillHeroAccent(payload)
  console.log('editorial: initial fields filled')
}

async function fillHeroAccent(payload: Payload) {
  const found = await payload.find({
    collection: 'pages',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'home' } },
  })
  const page = found.docs[0]
  if (!page) return
  for (const locale of ['en', 'zh'] as const) {
    const saved = await payload.findByID({
      collection: 'pages',
      id: page.id,
      depth: 0,
      draft: false,
      locale: locale as TypedLocale,
      fallbackLocale: false,
      overrideAccess: true,
    })
    const hero = saved.hero
    if (!isRecord(hero) || hero.type !== 'builder' || hero.headlineAccent) continue
    const accent = getMarketing(locale).home.hero.headlineAccent
    if (!accent) continue
    await payload.update({
      collection: 'pages',
      id: page.id,
      draft: false,
      locale: locale as TypedLocale,
      overrideAccess: true,
      context: seedContext,
      data: { hero: { ...hero, headlineAccent: accent } as never },
    })
  }
}

async function fillHeaderEnquiry(payload: Payload) {
  for (const locale of ['en', 'zh'] as const) {
    const header = await payload.findGlobal({
      slug: 'header',
      locale: locale as TypedLocale,
      fallbackLocale: false,
      overrideAccess: true,
    })
    const data: Record<string, unknown> = {}
    if (!header.enquiryLabel) {
      data.enquiryLabel = locale === 'zh' ? '开始咨询 →' : 'Start an Enquiry →'
    }
    if (locale === 'en' && !header.enquiryUrl) data.enquiryUrl = '/enquiry'
    if (!Object.keys(data).length) continue
    await payload.updateGlobal({
      slug: 'header',
      locale: locale as TypedLocale,
      overrideAccess: true,
      context: seedContext,
      data,
    })
  }
}

async function fillPageFields(
  payload: Payload,
  slug: string,
  locale: 'en' | 'zh',
  image: number | undefined,
) {
  const found = await payload.find({
    collection: 'pages',
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })
  const page = found.docs[0]
  if (!page) return
  const saved = await payload.findByID({
    collection: 'pages',
    id: page.id,
    depth: 0,
    draft: false,
    locale: locale as TypedLocale,
    fallbackLocale: false,
    overrideAccess: true,
  })
  if (!Array.isArray(saved.layout)) return
  const copy = getMarketing(locale)
  const source = slug === 'home' ? copy.home.cta : slug === 'about' ? copy.about.cta : copy.services.cta
  let changed = false
  const layout = saved.layout.map((block) => {
    if (!isRecord(block)) return block
    if (block.blockType === 'ctaBand') {
      const next = { ...block }
      if (!next.eyebrow && source.eyebrow) {
        next.eyebrow = source.eyebrow
        changed = true
      }
      if (locale === 'en' && !next.image && image) {
        next.image = image
        changed = true
      }
      if (!next.imageAlt && image) {
        next.imageAlt = slug === 'services' ? 'House at dusk' : 'Custom joinery'
        changed = true
      }
      return next
    }
    if (block.blockType === 'serviceDetails' && !block.featuresLabel) {
      changed = true
      return { ...block, featuresLabel: locale === 'zh' ? '交付内容' : 'What we deliver' }
    }
    return block
  })
  if (!changed) return
  await payload.update({
    collection: 'pages',
    id: page.id,
    draft: false,
    locale: locale as TypedLocale,
    overrideAccess: true,
    context: seedContext,
    data: { layout: layout as never },
  })
}
