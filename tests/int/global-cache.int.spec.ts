import { describe, expect, it } from 'vitest'

import { globalCacheKey } from '@/utilities/globalCacheKey'

describe('global cache key', () => {
  it('changes with the deployment so a later seed cannot read the previous footer', () => {
    const before = globalCacheKey('footer', 1, 'en', 'dpl_before')
    const after = globalCacheKey('footer', 1, 'en', 'dpl_after')

    expect(before).toEqual(['footer', '1', 'en', 'dpl_before'])
    expect(after).not.toEqual(before)
    expect(after[3]).toBe('dpl_after')
  })

  it('keeps English and Chinese footer entries apart', () => {
    const english = globalCacheKey('footer', 1, 'en', 'dpl_same')
    const chinese = globalCacheKey('footer', 1, 'zh', 'dpl_same')

    expect(english).not.toEqual(chinese)
    expect(english[2]).toBe('en')
    expect(chinese[2]).toBe('zh')
  })

  it('uses a stable local scope when there is no deployment id', () => {
    expect(globalCacheKey('footer', 1, 'en', null)).toEqual(['footer', '1', 'en', 'local'])
    expect(globalCacheKey('header', 1, 'en', '  ')).toEqual(['header', '1', 'en', 'local'])
    expect(globalCacheKey('footer', 1, 'en', '')).toEqual(['footer', '1', 'en', 'local'])
  })

  it('reads VERCEL_DEPLOYMENT_ID when the caller does not pass one', () => {
    const previous = process.env.VERCEL_DEPLOYMENT_ID
    process.env.VERCEL_DEPLOYMENT_ID = 'dpl_from_env'
    try {
      expect(globalCacheKey('footer', 1, 'en')).toEqual(['footer', '1', 'en', 'dpl_from_env'])
    } finally {
      if (previous === undefined) delete process.env.VERCEL_DEPLOYMENT_ID
      else process.env.VERCEL_DEPLOYMENT_ID = previous
    }
  })
})
