import { getPayload, type Payload, type PayloadRequest } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import { addProjectGalleryEndpoint } from '@/collections/Projects/addGalleryImages'
import { galleryCardsFromDocs, mediaIDFromField } from '@/components/Projects/galleryCards'
import { buildMediaUploadFormData } from '@/components/Projects/mediaUploadFormData'
import {
  buildGalleryBatch,
  keepFeaturedId,
  withinGalleryLimit,
} from '@/components/Projects/pendingProjectPhotos'
import { projectPhotoCopy } from '@/components/Projects/projectPhotoCopy'
import { uploadGalleryFiles } from '@/components/Projects/uploadGalleryFiles'
import {
  isGalleryImageFile,
  MAX_GALLERY_UPLOAD,
  titleFromFilename,
} from '@/lib/projects/galleryTitle'
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

describe('project photo batch', () => {
  it('keeps one featured photo and places it first', () => {
    expect(keepFeaturedId(['a', 'b'], 'b')).toBe('b')
    expect(keepFeaturedId(['a', 'b'], 'missing')).toBe('a')
    expect(keepFeaturedId([], 'a')).toBeNull()
    expect(withinGalleryLimit(39, 1, MAX_GALLERY_UPLOAD)).toBe(true)
    expect(withinGalleryLimit(39, 2, MAX_GALLERY_UPLOAD)).toBe(false)

    expect(
      buildGalleryBatch(
        [
          { filename: 'kitchen-hero.png', id: 'a', mediaID: 1 },
          { filename: 'bath-photo.png', id: 'b', mediaID: 2 },
        ],
        'b',
      ),
    ).toEqual({
      featuredImage: 2,
      items: [
        { filename: 'bath-photo.png', mediaID: 2 },
        { filename: 'kitchen-hero.png', mediaID: 1 },
      ],
    })
  })

  it('reads gallery cards and the featured media id', () => {
    expect(mediaIDFromField(4)).toBe(4)
    expect(mediaIDFromField({ id: 9 })).toBe(9)
    expect(mediaIDFromField(null)).toBeNull()
    expect(
      galleryCardsFromDocs([
        {
          id: 3,
          image: { id: 8, sizes: { thumbnail: { url: '/thumb.jpg' } }, url: '/full.jpg' },
          title: 'kitchen hero',
        },
      ]),
    ).toEqual([{ key: 'image-3', mediaID: 8, src: '/thumb.jpg', title: 'kitchen hero' }])
  })

  it('uses the same phrases in English and Chinese', () => {
    const english = projectPhotoCopy('en')
    const chinese = projectPhotoCopy('zh')
    expect(english.title).toBe('Project photos')
    expect(chinese.title).toBe('项目照片')
    expect(english.tooMany(40)).toContain('40')
    expect(chinese.tooMany(40)).toContain('40')
    expect(english.progress(1, 2, 'kitchen-hero.png')).toContain('kitchen-hero.png')
    expect(chinese.progress(1, 2, 'kitchen-hero.png')).toContain('kitchen-hero.png')
    expect(Object.keys(english).sort()).toEqual(Object.keys(chinese).sort())
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
    expect(detail?.images.map((image) => image.title)).toEqual([
      'kitchen hero',
      'bath photo',
      'kitchen hero',
    ])
    expect(detail?.images[0]?.downloadHref).toBe(`/projects/images/${body.created[0].id}/download`)

    const chinese = await loadProjectDetail(`gallery-${stamp}`, 'zh')
    expect(chinese?.images[0]?.title).toBe('kitchen hero')
  }, 60_000)

  it('creates gallery rows and the featured image while the project is created', async () => {
    const stamp = Date.now()
    const user = await payload.create({
      collection: 'users',
      data: {
        email: `batch-${stamp}@example.com`,
        password: 'test-password-123',
      },
    })
    const kitchen = await createMedia(payload, `batch-kitchen-${stamp}.png`)
    const bath = await createMedia(payload, `batch-bath-${stamp}.png`)
    const notes = await payload.create({
      collection: 'media',
      data: { alt: 'notes' },
      file: {
        data: Buffer.from('%PDF-1.1\n'),
        mimetype: 'application/pdf',
        name: `batch-notes-${stamp}.pdf`,
        size: Buffer.from('%PDF-1.1\n').length,
      },
    })

    const project = await payload.create({
      collection: 'projects',
      context: { disableRevalidate: true },
      data: {
        address: '2 Gallery Street',
        featuredImage: bath.id,
        galleryBatch: {
          items: [
            { filename: 'bath-photo.png', mediaID: bath.id },
            { filename: 'kitchen-hero.png', mediaID: kitchen.id },
          ],
        },
        projectStatus: 'active',
        slug: `batch-${stamp}`,
        title: `Batch ${stamp}`,
        type: 'residential',
      },
      overrideAccess: false,
      user,
    })

    expect(
      typeof project.featuredImage === 'object' ? project.featuredImage?.id : project.featuredImage,
    ).toBe(bath.id)
    expect(project).not.toHaveProperty('galleryBatch')

    const images = await payload.find({
      collection: 'project-images',
      depth: 0,
      sort: 'displayOrder',
      where: { project: { equals: project.id } },
    })
    expect(images.docs.map((image) => image.title)).toEqual(['bath photo', 'kitchen hero'])
    expect(images.docs.map((image) => image.displayOrder)).toEqual([0, 1])
    expect(
      images.docs.map((image) => (typeof image.image === 'object' ? image.image?.id : image.image)),
    ).toEqual([bath.id, kitchen.id])

    const localized = await payload.findByID({
      collection: 'project-images',
      id: images.docs[0].id,
      locale: 'all',
    })
    const title = localized.title as { en?: string | null; zh?: string | null }
    expect(title.en).toBe('bath photo')
    expect(title.zh || null).toBeNull()

    await payload.update({
      collection: 'projects',
      id: project.id,
      context: { disableRevalidate: true },
      data: {
        galleryBatch: { items: [{ filename: 'kitchen-hero.png', mediaID: kitchen.id }] },
      },
      overrideAccess: false,
      user,
    })
    const afterUpdate = await payload.find({
      collection: 'project-images',
      where: { project: { equals: project.id } },
    })
    expect(afterUpdate.totalDocs).toBe(2)

    await expect(
      payload.create({
        collection: 'projects',
        context: { disableRevalidate: true },
        data: {
          address: '3 Gallery Street',
          galleryBatch: { items: [{ filename: 'notes.pdf', mediaID: notes.id }] },
          projectStatus: 'active',
          slug: `batch-bad-${stamp}`,
          title: `Batch bad ${stamp}`,
          type: 'residential',
        },
        overrideAccess: false,
        user,
      }),
    ).rejects.toThrow(/image/i)

    const rejected = await payload.find({
      collection: 'projects',
      where: { slug: { equals: `batch-bad-${stamp}` } },
    })
    expect(rejected.totalDocs).toBe(0)

    await expect(
      payload.create({
        collection: 'projects',
        context: { disableRevalidate: true },
        data: {
          address: '4 Gallery Street',
          galleryBatch: { items: [] },
          projectStatus: 'active',
          slug: `batch-empty-${stamp}`,
          title: `Batch empty ${stamp}`,
          type: 'residential',
        },
        overrideAccess: false,
        user,
      }),
    ).rejects.toThrow(/1 and 40/)
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
