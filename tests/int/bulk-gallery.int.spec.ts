import { getPayload, type Payload, type PayloadRequest } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { addProjectGalleryEndpoint } from '@/collections/Projects/addGalleryImages'
import { buildMediaUploadFormData } from '@/components/Projects/mediaUploadFormData'
import { uploadGalleryFiles } from '@/components/Projects/uploadGalleryFiles'
import { isGalleryImageFile, titleFromFilename } from '@/lib/projects/galleryTitle'
import { loadProjectDetail } from '@/lib/projects/loadPortfolio'
import config from '@/payload.config'

const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

describe('gallery file names', () => {
  it('builds an English title from the file name', () => {
    expect(titleFromFilename('kitchen-hero.JPG')).toBe('kitchen hero')
    expect(titleFromFilename('IMG_4821.png')).toBe('IMG 4821')
    expect(titleFromFilename('厨房.jpg')).toBe('厨房')
    expect(titleFromFilename('a/b/bath_photo.webp')).toBe('bath photo')
    expect(titleFromFilename('.jpg')).toBe('Untitled image')
  })

  it('accepts images and skips other files', () => {
    expect(isGalleryImageFile({ name: 'room.png', type: 'image/png' })).toBe(true)
    expect(isGalleryImageFile({ name: 'room.heic', type: '' })).toBe(true)
    expect(isGalleryImageFile({ name: 'notes.pdf', type: 'application/pdf' })).toBe(false)
  })
})

describe('media upload body', () => {
  it('sends the file itself when no client upload handler is registered', async () => {
    const file = new File(['png'], 'kitchen-hero.png', { type: 'image/png' })
    const form = await buildMediaUploadFormData({
      alt: 'kitchen hero',
      file,
      uploadHandler: null,
    })

    expect(form.get('_payload')).toBe(JSON.stringify({ alt: 'kitchen hero' }))
    expect(form.get('file')).toBeInstanceOf(File)
  })

  it('sends the client-upload description for a normal image', async () => {
    const file = new File(['png'], 'kitchen-hero.png', { type: 'image/png' })
    const form = await buildMediaUploadFormData({
      alt: 'kitchen hero',
      file,
      uploadHandler: async ({ updateFilename }) => {
        updateFilename('kitchen-hero-suffix.png')
        return { prefix: 'media', signedReceipt: 'receipt' }
      },
    })

    const raw = form.get('file')
    expect(typeof raw).toBe('string')
    expect(JSON.parse(String(raw))).toMatchObject({
      clientUploadContext: { prefix: 'media', signedReceipt: 'receipt' },
      collectionSlug: 'media',
      filename: 'kitchen-hero-suffix.png',
      mimeType: 'image/png',
      size: file.size,
    })
  })

  it('keeps SVG bytes on the server so Payload can validate them', async () => {
    const file = new File(['<svg></svg>'], 'plan.svg', { type: 'image/svg+xml' })
    const form = await buildMediaUploadFormData({
      alt: 'plan',
      file,
      uploadHandler: async () => ({ signedReceipt: 'receipt' }),
    })

    expect(form.get('file')).toBeInstanceOf(File)
  })
})

describe('upload gallery files', () => {
  it('uploads each image, then links them to the project in the same order', async () => {
    const calls: { body: BodyInit | null | undefined; url: string }[] = []
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = String(input)
      calls.push({ body: init?.body, url })
      if (url.endsWith('/media')) {
        const index = calls.filter((call) => call.url.endsWith('/media')).length
        return Response.json({ doc: { id: index } }, { status: 201 })
      }
      return Response.json({
        created: [
          { displayOrder: 4, id: 10, mediaID: 1, title: 'kitchen hero' },
          { displayOrder: 5, id: 11, mediaID: 2, title: 'bath photo' },
        ],
        errors: [],
      })
    }

    const result = await uploadGalleryFiles({
      apiRoute: '/api',
      fetchImpl,
      files: [
        new File(['a'], 'kitchen-hero.png', { type: 'image/png' }),
        new File(['b'], 'bath_photo.jpg', { type: 'image/jpeg' }),
      ],
      projectID: 7,
      uploadHandler: null,
    })

    expect(result.errors).toEqual([])
    expect(result.created.map((image) => image.title)).toEqual(['kitchen hero', 'bath photo'])
    const galleryCall = calls.find((call) => call.url.includes('/projects/7/gallery'))
    expect(galleryCall?.url).toBe('/api/projects/7/gallery')
    expect(JSON.parse(String(galleryCall?.body))).toEqual({
      items: [
        { filename: 'kitchen-hero.png', mediaID: 1 },
        { filename: 'bath_photo.jpg', mediaID: 2 },
      ],
    })
  })
})

describe('project gallery endpoint', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  }, 60_000)

  it('creates one project image per file, in order, with English titles only', async () => {
    const stamp = Date.now()
    const user = await payload.create({
      collection: 'users',
      data: {
        email: `gallery-${stamp}@example.com`,
        password: 'test-password-123',
      },
    })
    const project = await payload.create({
      collection: 'projects',
      data: {
        address: '1 Gallery Street',
        projectStatus: 'active',
        slug: `gallery-${stamp}`,
        title: `Gallery ${stamp}`,
        type: 'residential',
      },
    })
    const kitchen = await createMedia(payload, `kitchen-hero-${stamp}.png`)
    const bath = await createMedia(payload, `bath_photo-${stamp}.jpg`)
    const notes = await payload.create({
      collection: 'media',
      data: { alt: 'notes' },
      file: {
        data: Buffer.from('%PDF-1.1\n'),
        mimetype: 'application/pdf',
        name: `notes-${stamp}.pdf`,
        size: Buffer.from('%PDF-1.1\n').length,
      },
    })

    const req = {
      context: { disableRevalidate: true },
      payload,
      user,
    } as unknown as PayloadRequest

    const denied = await addProjectGalleryEndpoint({
      ...req,
      json: async () => ({ items: [{ filename: 'kitchen-hero.png', mediaID: kitchen.id }] }),
      routeParams: { id: String(project.id) },
      user: null,
    } as unknown as PayloadRequest)
    expect(denied.status).toBe(401)

    const missing = await addProjectGalleryEndpoint({
      ...req,
      json: async () => ({ items: [{ filename: 'kitchen-hero.png', mediaID: kitchen.id }] }),
      routeParams: { id: '99999999' },
    } as unknown as PayloadRequest)
    expect(missing.status).toBe(404)

    const response = await addProjectGalleryEndpoint({
      ...req,
      json: async () => ({
        items: [
          { filename: 'kitchen-hero.png', mediaID: kitchen.id },
          { filename: 'notes.pdf', mediaID: notes.id },
          { filename: 'bath_photo.jpg', mediaID: bath.id },
        ],
      }),
      routeParams: { id: String(project.id) },
    } as unknown as PayloadRequest)

    expect(response.status).toBe(200)
    const body = (await response.json()) as {
      created: { displayOrder: number; id: number; title: string }[]
      errors: { filename: string; message: string }[]
    }
    expect(body.created.map((image) => image.title)).toEqual(['kitchen hero', 'bath photo'])
    expect(body.created.map((image) => image.displayOrder)).toEqual([0, 1])
    expect(body.errors).toEqual([
      { filename: 'notes.pdf', message: 'Only image files can be added to the gallery.' },
    ])

    const again = await addProjectGalleryEndpoint({
      ...req,
      json: async () => ({
        items: [{ filename: 'kitchen-hero.png', mediaID: kitchen.id }],
      }),
      routeParams: { id: String(project.id) },
    } as unknown as PayloadRequest)
    const againBody = (await again.json()) as { created: { displayOrder: number }[] }
    expect(againBody.created[0]?.displayOrder).toBe(2)

    const localized = await payload.findByID({
      collection: 'project-images',
      id: body.created[0].id,
      locale: 'all',
    })
    const title = localized.title as { en?: string | null; zh?: string | null }
    expect(title.en).toBe('kitchen hero')
    expect(title.zh || null).toBeNull()

    const saved = await payload.findByID({
      collection: 'project-images',
      id: body.created[0].id,
    })
    expect(saved.published).toBe(true)
    expect(saved.allowDownload).toBe(true)
    expect(typeof saved.project === 'object' ? saved.project?.id : saved.project).toBe(project.id)

    await payload.update({
      collection: 'projects',
      id: project.id,
      data: { _status: 'published' },
    })

    const detail = await loadProjectDetail(`gallery-${stamp}`, 'en')
    expect(detail?.images.map((image) => image.title)).toEqual(['kitchen hero', 'bath photo', 'kitchen hero'])
    expect(detail?.images[0]?.downloadHref).toBe(`/projects/images/${body.created[0].id}/download`)

    const chinese = await loadProjectDetail(`gallery-${stamp}`, 'zh')
    expect(chinese?.images[0]?.title).toBe('kitchen hero')
  }, 60_000)
})

async function createMedia(payload: Payload, name: string) {
  return payload.create({
    collection: 'media',
    data: { alt: titleFromFilename(name) },
    file: {
      data: TINY_PNG,
      mimetype: 'image/png',
      name,
      size: TINY_PNG.length,
    },
  })
}
