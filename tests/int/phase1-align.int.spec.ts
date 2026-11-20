import { describe, expect, it } from 'vitest'

import { getMarketing } from '@/content/getMarketing'
import { alignHeaderNav, withoutInteriorLinks } from '@/content/navMenu'
import { alignPhase1Layout } from '@/content/phase1Align'
import { relatedProjectHref } from '@/lib/projects/types'

const homeBriefs = {
  id: 'briefs',
  blockType: 'splitFeature',
  variant: 'briefs',
  heading: 'About Zillion Home',
  body: 'Client edited this module.',
  items: [{ title: 'Residential' }, { title: 'Interior Fit-out' }],
}

describe('phase 1 layout alignment', () => {
  it('does not overwrite an edited Home 01 briefs block', () => {
    const layout = [
      homeBriefs,
      {
        id: 'cards',
        blockType: 'serviceCards',
        heading: 'Four core capabilities',
        cards: [
          { id: 'c0', title: 'Residential', href: '/services#residential' },
          { id: 'c1', title: 'Commercial', href: '/services#commercial' },
          { id: 'c2', title: 'Joinery', href: '/services#joinery' },
          { id: 'c3', title: 'Interior Fit-out', href: '/services#interior' },
        ],
      },
    ]
    const aligned = alignPhase1Layout(layout, 'en', 'home', { idea: 11, plans: 12 })
    expect(aligned.changed).toBe(true)
    expect(aligned.layout).toEqual(expect.arrayContaining([homeBriefs]))
    expect((aligned.layout as unknown[])[0]).toEqual(homeBriefs)

    const again = alignPhase1Layout(aligned.layout, 'en', 'home', { idea: 11, plans: 12 })
    expect(again.changed).toBe(false)
    const cards = (
      aligned.layout as {
        blockType: string
        variant?: string
        cards?: { id?: string; title?: string; image?: number }[]
      }[]
    )[1]
    expect(cards.variant).toBe('pair')
    expect(cards.cards?.map((card) => card.title)).toEqual([
      'Starting with an Idea?',
      'Already Have Plans?',
    ])
    expect(cards.cards?.map((card) => card.id)).toEqual(['c0', 'c1'])
    expect(cards.cards?.map((card) => card.image)).toEqual([11, 12])
  })

  it('replaces the old process, assurances, and category bar without touching a custom process', () => {
    const layout = [
      {
        blockType: 'processSection',
        eyebrow: 'The Way We Work',
        heading: 'Clarity at every stage.',
        body: 'From initial consultation to final handover, we coordinate construction, interior fit-out and custom joinery to deliver well-managed projects with practical solutions and quality workmanship.',
        trustItems: [
          { id: 't0', title: 'Qualified & Insured', description: 'Old' },
          { id: 't1', title: 'In-house Joinery Capability', description: 'Old' },
          { id: 't2', title: 'Quality & Care', description: 'Old' },
        ],
        steps: [
          { id: 's0', title: 'Consultation' },
          { id: 's1', title: 'Planning' },
          { id: 's2', title: 'Construction' },
          { id: 's3', title: 'Joinery' },
          { id: 's4', title: 'Handover' },
        ],
      },
      {
        blockType: 'categoryBar',
        items: [
          { title: 'Residential Construction' },
          { title: 'Renovation' },
          { title: 'Commercial Fit-out' },
          { title: 'Custom Joinery' },
          { title: 'Interior Fit-out & Delivery' },
        ],
      },
    ]
    const aligned = alignPhase1Layout(layout, 'en', 'home')
    const process = (
      aligned.layout as {
        heading?: string
        trustHeading?: string
        trustItems?: { title: string }[]
        steps?: { id: string; title: string }[]
      }[]
    )[0]
    expect(process.heading).toBe('A considered approach, from start to finish.')
    expect(process.trustHeading).toBe('Built with the bigger picture in mind.')
    expect(process.trustItems?.map((item) => item.title)).toEqual([
      'A Broader Perspective',
      'Thinking Ahead',
      'Clearer Accountability',
    ])
    expect(process.steps?.map((step) => step.title)).toEqual([
      'Consultation',
      'Planning',
      'Construction',
      'Handover',
    ])
    expect(process.steps?.map((step) => step.id)).toEqual(['s0', 's1', 's2', 's4'])
    const categories = (aligned.layout as { items?: { title: string }[] }[])[1]
    expect(categories.items?.map((item) => item.title)).toEqual(
      getMarketing('en').home.categories.items.map((item) => item.title),
    )

    const custom = alignPhase1Layout(
      [{ blockType: 'processSection', heading: 'Our own method', steps: [{ title: 'Listen' }] }],
      'en',
      'home',
    )
    expect(custom.changed).toBe(false)
  })

  it('removes About capabilities and the in-house sentence, and leaves other essays', () => {
    const layout = [
      {
        blockType: 'proseSection',
        body: 'We are builders. Our in-house joinery capability means we can handle everything from structural work to the finest cabinetry details — all under one roof.\n\nThe rest stays.',
      },
      { blockType: 'capabilityList', heading: 'Our capabilities' },
      { blockType: 'proseSection', body: 'A note the client already rewrote.' },
    ]
    const aligned = alignPhase1Layout(layout, 'en', 'about')
    expect(aligned.layout).toHaveLength(2)
    const prose = (aligned.layout as { body: string }[])[0]
    expect(prose.body).toContain('Custom joinery is coordinated with the construction work')
    expect(prose.body).not.toMatch(/in-house/i)
    expect(prose.body).toContain('The rest stays.')
    expect((aligned.layout as { body: string }[])[1].body).toBe(
      'A note the client already rewrote.',
    )
  })

  it('drops interior services and points the remaining sections at related projects', () => {
    const layout = [
      {
        blockType: 'serviceDetails',
        services: [
          {
            anchor: 'residential',
            title: 'Residential',
            enquireLabel: 'Enquire about Residential',
          },
          {
            anchor: 'interior',
            title: 'Interior Fit-out & Project Delivery',
            enquireLabel: 'Enquire about Interior',
          },
          {
            anchor: 'joinery',
            title: 'Custom Joinery',
            description:
              'Bespoke joinery crafted in our workshop. Whether standalone or as part of a larger project, we deliver precision-made cabinetry tailored to your space.',
            enquireLabel: 'See kitchens',
          },
        ],
      },
      {
        blockType: 'splitFeature',
        variant: 'darkCopy',
        eyebrow: 'In-house Capability',
        heading: 'Custom joinery,',
        headingAccent: 'crafted in-house',
        body: 'Old workshop copy.',
      },
    ]
    const aligned = alignPhase1Layout(layout, 'en', 'services')
    const details = (
      aligned.layout as {
        services: { anchor: string; enquireLabel: string; description?: string }[]
      }[]
    )[0]
    expect(details.services.map((service) => service.anchor)).toEqual(['residential', 'joinery'])
    expect(details.services[0].enquireLabel).toBe('View Related Project')
    expect(details.services[1].enquireLabel).toBe('See kitchens')
    expect(details.services[1].description).toMatch(/Made-to-order cabinetry/)
    const band = (aligned.layout as { heading: string; headingAccent: string; body: string }[])[1]
    expect(band.heading).toBe('Made to order,')
    expect(band.headingAccent).toBe('made for your space.')
    expect(band.body).toContain('Great joinery starts long before installation.')
    expect(relatedProjectHref('joinery')).toBe('/projects?view=project&type=joinery')
  })

  it('replaces the live services hero sentence and leaves the corrected Chinese line', () => {
    const intended =
      'Three core services — residential construction and renovation, commercial fit-out, and custom joinery — delivered by one building team.'
    const live =
      'Four core capabilities under one roof. From ground-up construction to precision cabinetry, we deliver complete building solutions for homes and businesses.'
    const aligned = alignPhase1Layout(
      [{ blockType: 'pageIntro', description: live }],
      'en',
      'services',
    )
    expect((aligned.layout as { description: string }[])[0]?.description).toBe(intended)

    const older =
      'Four capabilities under one roof — from ground-up construction to precision cabinetry, delivered as one complete building service.'
    const olderAligned = alignPhase1Layout(
      [{ blockType: 'pageIntro', description: older }],
      'en',
      'services',
    )
    expect((olderAligned.layout as { description: string }[])[0]?.description).toBe(intended)

    const zh = '三项核心业务由同一个团队完成：住宅施工与翻新、商业装修和定制木作。'
    const kept = alignPhase1Layout([{ blockType: 'pageIntro', description: zh }], 'zh', 'services')
    expect(kept.changed).toBe(false)
    expect((kept.layout as { description: string }[])[0]?.description).toBe(zh)
  })
})

describe('header dropdown migration', () => {
  it('groups the flat service menu and drops interior', () => {
    const aligned = alignHeaderNav(
      [
        { id: 'home', link: { type: 'custom', url: '/', label: 'Home' } },
        { id: 'res', link: { type: 'custom', url: '/services#residential', label: 'Homes' } },
        { id: 'com', link: { type: 'custom', url: '/services#commercial', label: 'Commercial' } },
        { id: 'joi', link: { type: 'custom', url: '/services#joinery', label: 'Custom Joinery' } },
        {
          id: 'int',
          link: { type: 'custom', url: '/services#interior', label: 'Interior Fit-out' },
        },
      ],
      'en',
    )
    expect(aligned.changed).toBe(true)
    expect(aligned.items.map((item) => item.link?.label)).toEqual(['Home', 'Our Services'])
    expect(aligned.items[0].id).toBe('home')
    expect(aligned.items[1].children?.map((item) => item.link?.label)).toEqual([
      'Homes',
      'Commercial',
      'Custom Joinery',
    ])
    expect(JSON.stringify(aligned.items)).not.toContain('#interior')

    const again = alignHeaderNav(aligned.items, 'en')
    expect(again.changed).toBe(false)
  })

  it('leaves a custom menu that is not the old service row', () => {
    const items = [
      { link: { type: 'custom' as const, url: '/', label: 'Home' } },
      { link: { type: 'custom' as const, url: '/journal', label: 'Journal' } },
    ]
    expect(alignHeaderNav(items, 'en').changed).toBe(false)
  })

  it('removes an interior footer link', () => {
    const footer = withoutInteriorLinks([
      { link: { url: '/services#residential' } },
      { link: { url: '/services#interior' } },
      { link: { url: '/services#joinery' } },
    ])
    expect(footer.changed).toBe(true)
    expect(footer.items.map((item) => item.link.url)).toEqual([
      '/services#residential',
      '/services#joinery',
    ])
  })
})
