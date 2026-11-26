import { describe, expect, it } from 'vitest'

import {
  legalFallbackCopy,
  legalPageCopy,
  legalPageDocument,
  pageLayoutIsEmpty,
} from '@/content/legalPages'
import { getMessages } from '@/i18n/messages'

describe('first-version legal copy', () => {
  it('builds a text intro and one prose section per heading', () => {
    for (const locale of ['en', 'zh'] as const) {
      for (const slug of ['privacy', 'terms'] as const) {
        const copy = legalPageCopy(locale)[slug]
        const doc = legalPageDocument(copy)
        expect(doc.slug).toBe(slug)
        expect(doc.hero.type).toBe('none')
        expect(doc._status).toBe('published')
        expect(doc.generateSlug).toBe(false)
        expect(doc.layout[0]).toMatchObject({
          blockType: 'pageIntro',
          layout: 'text',
          eyebrow: copy.eyebrow,
          heading: copy.heading,
          description: copy.description,
        })
        expect(doc.layout.slice(1).map((block) => block.heading)).toEqual(
          copy.sections.map((section) => section.heading),
        )
        expect(doc.layout.slice(1).every((block) => block.blockType === 'proseSection')).toBe(true)
        expect(doc.meta).toEqual({ title: copy.metaTitle, description: copy.metaDescription })
      }
    }

    expect(legalPageCopy('zh').privacy.title).toBe('隐私政策')
    expect(legalPageCopy('zh').terms.title).toBe('服务条款')
    expect(legalPageCopy('en').privacy.sections).toHaveLength(9)
    expect(legalPageCopy('en').terms.sections).toHaveLength(11)
    expect(legalPageCopy('zh').privacy.sections).toHaveLength(
      legalPageCopy('en').privacy.sections.length,
    )
    expect(legalPageCopy('zh').terms.sections).toHaveLength(legalPageCopy('en').terms.sections.length)
  })

  it('keeps the dictionary fallback as the same first-version text', () => {
    for (const locale of ['en', 'zh'] as const) {
      const fallback = legalFallbackCopy(locale)
      const messages = getMessages(locale).legal
      expect(messages).toEqual(fallback)
      for (const slug of ['privacy', 'terms'] as const) {
        const copy = legalPageCopy(locale)[slug]
        const page = messages[slug]
        expect(page.intro).toBe(copy.description)
        expect(page.sectionHeading).toBe(copy.sections[0]?.heading)
        expect(page.body).toContain(copy.sections[0]?.paragraphs[0])
        expect(page.body).toContain(copy.sections.at(-1)?.heading)
        expect(page.body).toContain(copy.sections.at(-1)?.paragraphs[0])
        expect(page.body.toLowerCase()).not.toContain('placeholder')
        expect(page.intro).not.toContain('占位')
        expect(page.body).not.toContain('占位')
      }
    }

    expect(getMessages('en').legal.privacy.body).toContain('We do not sell your personal information.')
    expect(getMessages('en').legal.privacy.body).toContain('26 November 2026')
    expect(getMessages('en').legal.terms.body).toContain('laws of Victoria, Australia')
    expect(getMessages('zh').legal.privacy.body).toContain('2026年11月26日')
    expect(getMessages('zh').legal.terms.body).toContain('维多利亚州法律管辖')
    expect(getMessages('en').enquiry.consent).toContain('privacy policy')
    expect(getMessages('zh').enquiry.consent).toContain('隐私政策')
  })

  it('treats a missing block list as an empty layout', () => {
    expect(pageLayoutIsEmpty(undefined)).toBe(true)
    expect(pageLayoutIsEmpty([])).toBe(true)
    expect(pageLayoutIsEmpty(null)).toBe(true)
    expect(pageLayoutIsEmpty([{ blockType: 'pageIntro' }])).toBe(false)
  })
})
