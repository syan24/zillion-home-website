export const MARKETING_BLOCK_TYPES = new Set([
  'capabilityList',
  'categoryBar',
  'ctaBand',
  'pageIntro',
  'processSection',
  'proseSection',
  'serviceCards',
  'serviceDetails',
  'splitFeature',
])

type PageLike = {
  hero?: { type?: string | null } | null
  layout?: { blockType?: string | null }[] | null
}

export function pageHasContent(page: PageLike | null | undefined): boolean {
  if (!page) return false
  const heroOn = Boolean(page.hero?.type && page.hero.type !== 'none')
  const hasLayout = Array.isArray(page.layout) && page.layout.length > 0
  return heroOn || hasLayout
}

export function isMarketingPage(page: PageLike | null | undefined): boolean {
  if (!page) return false
  if (page.hero?.type === 'builder') return true
  return (page.layout || []).some(
    (block) => Boolean(block?.blockType && MARKETING_BLOCK_TYPES.has(block.blockType)),
  )
}
