// @vitest-environment node

import { sql } from '@payloadcms/db-postgres'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { legalPageCopy, type LegalSlug } from '@/content/legalPages'

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}))

import { seedEnquiryForm } from '@/seed/enquiryForm'
import { seedWebsite } from '@/seed/website'

let payload: Payload
let restore: (() => Promise<void>) | null = null

type Block = { blockType?: string; [key: string]: unknown }

function blocks(layout: unknown): Block[] {
  return Array.isArray(layout) ? (layout as Block[]) : []
}

describe('deploy seed keeps editor content', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
    await seedWebsite(payload)
    await seedEnquiryForm(payload)
  }, 120000)

  afterAll(async () => {
    if (restore) await restore()
  })

  it('keeps edited pages, navigation, footer, and media across two seeds', async () => {
    const home = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: 'home' } },
    })
    const services = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: 'services' } },
    })
    const homeDoc = home.docs[0]
    const servicesDoc = services.docs[0]
    if (!homeDoc || !servicesDoc) throw new Error('Seed pages are missing')
    const originalHome = await payload.findByID({
      collection: 'pages',
      id: homeDoc.id,
      locale: 'en',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    const originalZh = await payload.findByID({
      collection: 'pages',
      id: homeDoc.id,
      locale: 'zh',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    const originalServices = await payload.findByID({
      collection: 'pages',
      id: servicesDoc.id,
      locale: 'en',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    const originalHeader = await payload.findGlobal({
      slug: 'header',
      locale: 'en',
      fallbackLocale: false,
      overrideAccess: true,
    })
    const originalFooter = await payload.findGlobal({
      slug: 'footer',
      locale: 'en',
      fallbackLocale: false,
      overrideAccess: true,
    })
    const media = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { filename: { equals: 'hero-house.jpg' } },
    })
    const heroMedia = media.docs[0]
    restore = async () => {
      await payload.update({
        collection: 'pages',
        id: homeDoc.id,
        locale: 'en',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: { hero: originalHome.hero as never, layout: originalHome.layout as never },
      })
      await payload.update({
        collection: 'pages',
        id: homeDoc.id,
        locale: 'zh',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: { hero: originalZh.hero as never, layout: originalZh.layout as never },
      })
      await payload.update({
        collection: 'pages',
        id: servicesDoc.id,
        locale: 'en',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: { layout: originalServices.layout as never },
      })
      await payload.updateGlobal({
        slug: 'header',
        locale: 'en',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: {
          contentSeeded: originalHeader.contentSeeded,
          navItems: originalHeader.navItems,
          secondaryNavItems: originalHeader.secondaryNavItems,
        },
      })
      await payload.updateGlobal({
        slug: 'footer',
        locale: 'en',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: {
          contentSeeded: originalFooter.contentSeeded,
          blurb: originalFooter.blurb,
          serviceLinks: originalFooter.serviceLinks,
        },
      })
      if (heroMedia) {
        await payload.update({
          collection: 'media',
          id: heroMedia.id,
          overrideAccess: true,
          data: { alt: heroMedia.alt },
        })
      }
    }

    const homeLayout = blocks(homeDoc.layout).map((block) => {
      if (block.blockType === 'serviceCards') return { ...block, heading: 'Interior Fit-out' }
      if (block.blockType === 'categoryBar' && Array.isArray(block.items)) {
        return {
          ...block,
          items: (block.items as { title?: string }[]).map((item, index) =>
            index === 0 ? { ...item, title: '室内装修' } : item,
          ),
        }
      }
      if (block.blockType === 'processSection' && Array.isArray(block.steps)) {
        return {
          ...block,
          steps: (block.steps as { title?: string }[]).map((step, index) =>
            index === 0 ? { ...step, title: 'Enquire about Consultation' } : step,
          ),
        }
      }
      return block
    })
    await payload.update({
      collection: 'pages',
      id: homeDoc.id,
      locale: 'en',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        hero: { ...(homeDoc.hero as object), headline: 'Built from the\nground up.' },
        layout: homeLayout as never,
      },
    })
    const zhBefore = await payload.findByID({
      collection: 'pages',
      id: homeDoc.id,
      locale: 'zh',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    const zhLayout = blocks(zhBefore.layout).map((block) => {
      if (block.blockType !== 'categoryBar' || !Array.isArray(block.items)) return block
      return {
        ...block,
        items: (block.items as { title?: string }[]).map((item) => ({
          ...item,
          title: item.title || '分类',
        })),
      }
    })
    await payload.update({
      collection: 'pages',
      id: homeDoc.id,
      locale: 'zh',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        hero: { ...(zhBefore.hero as object), headline: '客户的中文标题' },
        layout: zhLayout as never,
      },
    })

    const servicesLayout = blocks(servicesDoc.layout).map((block) =>
      block.blockType === 'ctaBand' ? { ...block, tone: 'light' } : block,
    )
    await payload.update({
      collection: 'pages',
      id: servicesDoc.id,
      locale: 'en',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: { layout: servicesLayout as never },
    })

    await payload.updateGlobal({
      slug: 'header',
      locale: 'en',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        contentSeeded: true,
        navItems: [
          { link: { type: 'custom', url: '/services#residential', label: 'Keep Residential' } },
          { link: { type: 'custom', url: '/services#commercial', label: 'Keep Commercial' } },
          { link: { type: 'custom', url: '/services#joinery', label: 'Keep Joinery' } },
        ],
      },
    })
    await payload.updateGlobal({
      slug: 'footer',
      locale: 'en',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        contentSeeded: true,
        blurb: '',
        serviceLinks: [
          {
            link: {
              type: 'custom',
              url: '/services#residential',
              label: 'Residential Construction',
            },
          },
        ],
      },
    })

    if (heroMedia) {
      await payload.update({
        collection: 'media',
        id: heroMedia.id,
        overrideAccess: true,
        data: { alt: 'Editor hero alt' },
      })
    }

    await seedWebsite(payload)
    await seedEnquiryForm(payload)
    await seedWebsite(payload)

    const savedHome = await payload.findByID({
      collection: 'pages',
      id: homeDoc.id,
      locale: 'en',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    const savedZh = await payload.findByID({
      collection: 'pages',
      id: homeDoc.id,
      locale: 'zh',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    const savedServices = await payload.findByID({
      collection: 'pages',
      id: servicesDoc.id,
      locale: 'en',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    const cards = blocks(savedHome.layout).find((block) => block.blockType === 'serviceCards')
    const bar = blocks(savedHome.layout).find((block) => block.blockType === 'categoryBar')
    const process = blocks(savedHome.layout).find((block) => block.blockType === 'processSection')
    const band = blocks(savedServices.layout).find((block) => block.blockType === 'ctaBand')
    expect(cards?.heading).toBe('Interior Fit-out')
    expect((bar?.items as { title?: string }[])?.[0]?.title).toBe('室内装修')
    expect((process?.steps as { title?: string }[])?.[0]?.title).toBe('Enquire about Consultation')
    expect((savedHome.hero as { headline?: string } | undefined)?.headline).toBe(
      'Built from the\nground up.',
    )
    expect((savedZh.hero as { headline?: string } | undefined)?.headline).toBe('客户的中文标题')
    expect(band?.tone).toBe('light')

    const header = await payload.findGlobal({
      slug: 'header',
      locale: 'en',
      fallbackLocale: false,
      overrideAccess: true,
    })
    expect(header.navItems?.map((item) => item.link.label)).toEqual([
      'Keep Residential',
      'Keep Commercial',
      'Keep Joinery',
    ])
    expect(header.navItems?.some((item) => item.children?.length)).toBe(false)

    const footer = await payload.findGlobal({
      slug: 'footer',
      locale: 'en',
      fallbackLocale: false,
      overrideAccess: true,
    })
    expect(footer.blurb || '').toBe('')
    expect(footer.serviceLinks?.[0]?.link.label).toBe('Residential Construction')

    if (heroMedia) {
      const savedMedia = await payload.findByID({
        collection: 'media',
        id: heroMedia.id,
        depth: 0,
        overrideAccess: true,
      })
      expect(savedMedia.alt).toBe('Editor hero alt')
      expect(savedMedia.filesize).toBe(heroMedia.filesize)
    }
  }, 120000)

  it('creates privacy and terms in both locales and keeps later edits', async () => {
    const deleteLegal = async () => {
      for (const slug of ['privacy', 'terms'] as const) {
        const found = await payload.find({
          collection: 'pages',
          depth: 0,
          limit: 1,
          overrideAccess: true,
          where: { slug: { equals: slug } },
        })
        if (found.docs[0]) {
          await payload.delete({
            collection: 'pages',
            id: found.docs[0].id,
            overrideAccess: true,
          })
        }
      }
    }

    await deleteLegal()

    try {
      const first = await seedWebsite(payload)
      expect(first).toEqual(
        expect.arrayContaining([
          'page privacy: created',
          'page privacy: zh filled',
          'page terms: created',
          'page terms: zh filled',
        ]),
      )

      for (const slug of ['privacy', 'terms'] as const) {
        for (const locale of ['en', 'zh'] as const) {
          const doc = await legalDoc(payload, slug, locale)
          const copy = legalPageCopy(locale)[slug]
          expect(doc._status).toBe('published')
          expect(doc.hero?.type).toBe('none')
          expect(doc.title).toBe(copy.title)
          expect(doc.meta?.title).toBe(copy.metaTitle)
          expect(doc.meta?.description).toBe(copy.metaDescription)
          expect(proseHeadings(doc.layout)).toEqual(copy.sections.map((section) => section.heading))
          const intro = blocks(doc.layout).find((block) => block.blockType === 'pageIntro')
          expect(intro?.eyebrow).toBe(copy.eyebrow)
          expect(intro?.heading).toBe(copy.heading)
          expect(intro?.description).toBe(copy.description)
          const firstSection = blocks(doc.layout).find((block) => block.blockType === 'proseSection')
          expect(firstSection?.body).toBe(copy.sections[0]?.paragraphs.join('\n\n'))
        }
      }

      const privacy = await legalDoc(payload, 'privacy', 'en')
      const privacyZh = await legalDoc(payload, 'privacy', 'zh')
      const terms = await legalDoc(payload, 'terms', 'en')
      await payload.update({
        collection: 'pages',
        id: privacy.id,
        locale: 'en',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: {
          title: 'Privacy Policy edited',
          layout: withProseEdit(privacy.layout, 'Last updated', {
            heading: 'Editor last updated',
            body: 'Editor kept this privacy sentence.',
          }) as never,
        },
      })
      await payload.update({
        collection: 'pages',
        id: privacyZh.id,
        locale: 'zh',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: {
          title: '隐私政策（已改）',
          layout: withProseEdit(privacyZh.layout, '更新日期', {
            heading: '客户更新日期',
            body: '客户保留的这句话。',
          }) as never,
        },
      })
      await payload.update({
        collection: 'pages',
        id: terms.id,
        locale: 'en',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: {
          layout: withProseEdit(terms.layout, 'Governing law', {
            heading: 'Editor governing law',
          }) as never,
        },
      })

      const kept = await seedWebsite(payload)
      await seedWebsite(payload)
      expect(kept).toEqual(
        expect.arrayContaining([
          'page privacy: english kept',
          'page privacy: zh kept',
          'page terms: english kept',
          'page terms: zh kept',
        ]),
      )

      const savedPrivacy = await legalDoc(payload, 'privacy', 'en')
      const savedPrivacyZh = await legalDoc(payload, 'privacy', 'zh')
      const savedTerms = await legalDoc(payload, 'terms', 'en')
      expect(savedPrivacy.title).toBe('Privacy Policy edited')
      expect(proseHeadings(savedPrivacy.layout)).toContain('Editor last updated')
      expect(proseHeadings(savedPrivacy.layout)).toContain('Who we are')
      expect(blocks(savedPrivacy.layout).find((block) => block.heading === 'Editor last updated')?.body).toBe(
        'Editor kept this privacy sentence.',
      )
      expect(savedPrivacyZh.title).toBe('隐私政策（已改）')
      expect(proseHeadings(savedPrivacyZh.layout)).toEqual(
        expect.arrayContaining(['客户更新日期', '我们是谁']),
      )
      expect(blocks(savedPrivacyZh.layout).find((block) => block.heading === '客户更新日期')?.body).toBe(
        '客户保留的这句话。',
      )
      expect(proseHeadings(savedTerms.layout)).toContain('Editor governing law')
      expect(blocks(savedTerms.layout).find((block) => block.heading === 'Contact')?.body).toBe(
        'Questions about these terms can be sent through the enquiry form on this website.',
      )

      await payload.db.drizzle.execute(
        sql`DELETE FROM pages_blocks_page_intro WHERE _parent_id = ${savedPrivacy.id}`,
      )
      await payload.db.drizzle.execute(
        sql`DELETE FROM pages_blocks_prose_section WHERE _parent_id = ${savedPrivacy.id}`,
      )
      const filled = await seedWebsite(payload)
      expect(filled).toEqual(
        expect.arrayContaining(['page privacy: english filled', 'page privacy: zh filled', 'page terms: english kept', 'page terms: zh kept']),
      )
      const refilled = await legalDoc(payload, 'privacy', 'en')
      const refilledZh = await legalDoc(payload, 'privacy', 'zh')
      const termsAfter = await legalDoc(payload, 'terms', 'en')
      expect(refilled.title).toBe('Privacy Policy edited')
      expect(refilled.hero?.type).toBe('none')
      expect(proseHeadings(refilled.layout)).toEqual(
        legalPageCopy('en').privacy.sections.map((section) => section.heading),
      )
      expect(refilledZh.title).toBe('隐私政策（已改）')
      expect(proseHeadings(refilledZh.layout)).toEqual(
        legalPageCopy('zh').privacy.sections.map((section) => section.heading),
      )
      expect(blocks(refilledZh.layout).find((block) => block.heading === '我们是谁')?.body).toContain(
        'Zillion Home 是一家位于墨尔本的注册建筑商',
      )
      expect(proseHeadings(termsAfter.layout)).toContain('Editor governing law')
    } finally {
      await deleteLegal()
      await seedWebsite(payload)
    }
  }, 240000)
})

async function legalDoc(payload: Payload, slug: LegalSlug, locale: 'en' | 'zh') {
  const found = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    locale,
    fallbackLocale: false,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })
  const doc = found.docs[0]
  if (!doc) throw new Error(`Missing ${locale} page ${slug}`)
  return doc
}

function proseHeadings(layout: unknown) {
  return blocks(layout)
    .filter((block) => block.blockType === 'proseSection')
    .map((block) => block.heading)
}

function withProseEdit(
  layout: unknown,
  heading: string,
  next: { heading: string; body?: string },
) {
  return blocks(layout).map((block) => {
    if (block.blockType !== 'proseSection' || block.heading !== heading) return block
    return { ...block, heading: next.heading, ...(next.body ? { body: next.body } : {}) }
  })
}
