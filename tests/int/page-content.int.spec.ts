import { describe, expect, it } from 'vitest'

import { isMarketingPage, pageHasContent } from '@/utilities/pageContent'

describe('marketing page detection', () => {
  it('treats an empty home as having no CMS content', () => {
    expect(pageHasContent({ hero: { type: 'none' }, layout: [] })).toBe(false)
    expect(pageHasContent(null)).toBe(false)
  })

  it('treats a builder hero or marketing block as content', () => {
    expect(pageHasContent({ hero: { type: 'builder' }, layout: [] })).toBe(true)
    expect(pageHasContent({ hero: { type: 'none' }, layout: [{ blockType: 'pageIntro' }] })).toBe(
      true,
    )
    expect(isMarketingPage({ hero: { type: 'builder' }, layout: [] })).toBe(true)
    expect(isMarketingPage({ hero: { type: 'none' }, layout: [{ blockType: 'cta' }] })).toBe(false)
    expect(
      isMarketingPage({ hero: { type: 'lowImpact' }, layout: [{ blockType: 'serviceCards' }] }),
    ).toBe(true)
  })
})
