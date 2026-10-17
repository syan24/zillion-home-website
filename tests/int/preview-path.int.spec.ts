import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'

import { generatePreviewPath, pagePreviewPath } from '@/utilities/generatePreviewPath'

const req = {} as PayloadRequest

describe('page preview paths', () => {
  it('maps the home slug to the public root', () => {
    expect(pagePreviewPath('home')).toBe('/')
    expect(pagePreviewPath('  home  ')).toBe('/')
  })

  it('encodes other page slugs', () => {
    expect(pagePreviewPath('about')).toBe('/about')
    expect(pagePreviewPath('a b')).toBe('/a%20b')
  })

  it('builds a preview URL with the admin locale and secret', () => {
    process.env.PREVIEW_SECRET = 'preview-test-secret'
    const url = generatePreviewPath({
      collection: 'pages',
      slug: 'home',
      locale: 'zh',
      req,
    })

    expect(url?.startsWith('/next/preview?')).toBe(true)
    const params = new URLSearchParams(url?.split('?')[1])
    expect(params.get('path')).toBe('/')
    expect(params.get('locale')).toBe('zh')
    expect(params.get('previewSecret')).toBe('preview-test-secret')
  })

  it('omits a locale the public site does not use', () => {
    process.env.PREVIEW_SECRET = 'preview-test-secret'
    const url = generatePreviewPath({
      collection: 'pages',
      slug: 'services',
      locale: 'fr',
      req,
    })
    const params = new URLSearchParams(url?.split('?')[1])
    expect(params.get('path')).toBe('/services')
    expect(params.get('locale')).toBeNull()
  })

  it('returns null when the slug is missing', () => {
    expect(generatePreviewPath({ collection: 'pages', slug: null, req })).toBeNull()
    expect(generatePreviewPath({ collection: 'pages', slug: undefined, req })).toBeNull()
  })
})
