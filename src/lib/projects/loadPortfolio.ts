import configPromise from '@payload-config'
import { getPayload, type TypedLocale, type Where } from 'payload'

import type { Media, Project, ProjectImage, Space, Style } from '@/payload-types'
import type { SiteLocale } from '@/i18n/config'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import { hasProjectFilters, type ProjectFilters } from './filters'
import { publicProjectLocation } from './location'

type Relation<T> = number | T | null | undefined

function asDoc<T>(value: Relation<T>): T | null {
  if (!value || typeof value === 'number') return null
  return value
}

function mediaSrc(media: Relation<Media>) {
  const file = asDoc(media)
  if (!file?.url) return null
  return {
    src: getMediaUrl(file.url, file.updatedAt),
    alt: file.alt || '',
    filename: file.filename || 'project-image.jpg',
  }
}

export type GalleryImage = {
  id: number
  title: string
  caption: string | null
  alt: string
  src: string
  filename: string
  downloadHref: string | null
  projectSlug: string
  projectTitle: string
  projectType: 'residential' | 'commercial'
  location: string | null
  styleNames: string[]
  spaceNames: string[]
  spaceSlugs: string[]
}

export type PortfolioTerm = { id: number; name: string; slug: string }

export type PortfolioProjectOption = { slug: string; title: string; type: 'residential' | 'commercial' }

function names(value: Relation<Style | Space>[] | null | undefined) {
  return (value || []).map((item) => asDoc(item)?.name).filter((name): name is string => Boolean(name))
}

function slugs(value: Relation<Space>[] | null | undefined) {
  return (value || []).map((item) => asDoc(item)?.slug).filter((slug): slug is string => Boolean(slug))
}

function toGalleryImage(doc: ProjectImage): GalleryImage | null {
  const project = asDoc(doc.project)
  const file = mediaSrc(doc.image)
  if (!project?.slug || !file?.src) return null
  if (project._status && project._status !== 'published') return null

  return {
    id: doc.id,
    title: doc.title,
    caption: doc.caption || null,
    alt: file.alt || doc.title,
    src: file.src,
    filename: file.filename,
    downloadHref: doc.allowDownload ? `/projects/images/${doc.id}/download` : null,
    projectSlug: project.slug,
    projectTitle: project.title,
    projectType: project.type,
    location: publicProjectLocation(project),
    styleNames: names(doc.styles),
    spaceNames: names(doc.spaces),
    spaceSlugs: slugs(doc.spaces),
  }
}

function sortImages(images: GalleryImage[], docs: ProjectImage[]) {
  const order = new Map<number, { project: number; image: number }>()
  for (const doc of docs) {
    const project = asDoc(doc.project)
    order.set(doc.id, {
      project: project?.displayOrder ?? 0,
      image: doc.displayOrder ?? 0,
    })
  }
  return [...images].sort((a, b) => {
    const left = order.get(a.id) || { project: 0, image: 0 }
    const right = order.get(b.id) || { project: 0, image: 0 }
    if (left.project !== right.project) return left.project - right.project
    if (left.image !== right.image) return left.image - right.image
    return a.id - b.id
  })
}

async function publishedImages(locale: SiteLocale, where: Where) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'project-images',
    where,
    depth: 2,
    limit: 200,
    pagination: false,
    overrideAccess: false,
    locale: locale as TypedLocale,
    fallbackLocale: 'en',
  })
  const images = result.docs.map((doc) => toGalleryImage(doc)).filter((image): image is GalleryImage => Boolean(image))
  return sortImages(images, result.docs)
}

const publishedImageWhere: Where = {
  and: [{ published: { equals: true } }, { 'project._status': { equals: 'published' } }],
}

export async function loadPortfolio(locale: SiteLocale, filters: ProjectFilters) {
  const payload = await getPayload({ config: configPromise })
  const localeOptions = { locale: locale as TypedLocale, fallbackLocale: 'en' as const, overrideAccess: false as const }

  const [styleResult, spaceResult] = await Promise.all([
    payload.find({ collection: 'styles', limit: 50, sort: 'displayOrder', pagination: false, ...localeOptions }),
    payload.find({ collection: 'spaces', limit: 50, sort: 'displayOrder', pagination: false, ...localeOptions }),
  ])

  const styles: PortfolioTerm[] = styleResult.docs.map((doc: Style) => ({
    id: doc.id,
    name: doc.name,
    slug: doc.slug || '',
  })).filter((doc) => doc.slug)

  const spaces: PortfolioTerm[] = spaceResult.docs.map((doc: Space) => ({
    id: doc.id,
    name: doc.name,
    slug: doc.slug || '',
  })).filter((doc) => doc.slug)

  const covers = await publishedImages(locale, publishedImageWhere)
  const projects = projectOptions(covers)

  let images = covers
  if (hasProjectFilters(filters)) {
    const and: Where[] = [{ published: { equals: true } }, { 'project._status': { equals: 'published' } }]
    if (filters.type) and.push({ 'project.type': { equals: filters.type } })

    if (filters.project) {
      const project = projects.find((item) => item.slug === filters.project)
      and.push(project ? { 'project.slug': { equals: project.slug } } : { id: { equals: -1 } })
    }

    if (filters.style) {
      const style = styles.find((item) => item.slug === filters.style)
      and.push(
        style
          ? { or: [{ styles: { in: [style.id] } }, { 'project.styles': { in: [style.id] } }] }
          : { id: { equals: -1 } },
      )
    }

    if (filters.space) {
      const space = spaces.find((item) => item.slug === filters.space)
      and.push(
        space
          ? { or: [{ spaces: { in: [space.id] } }, { 'project.spaces': { in: [space.id] } }] }
          : { id: { equals: -1 } },
      )
    }

    images = await publishedImages(locale, { and })
  }

  return { styles, spaces, images, covers, projects }
}

function projectOptions(images: GalleryImage[]): PortfolioProjectOption[] {
  const seen = new Map<string, PortfolioProjectOption>()
  for (const image of images) {
    if (!seen.has(image.projectSlug)) {
      seen.set(image.projectSlug, {
        slug: image.projectSlug,
        title: image.projectTitle,
        type: image.projectType,
      })
    }
  }
  return [...seen.values()]
}

export function coverFor(images: GalleryImage[], match: (image: GalleryImage) => boolean) {
  return images.find(match) || null
}

export type ProjectDetail = {
  id: number
  slug: string
  title: string
  type: 'residential' | 'commercial'
  location: string | null
  shortDescription: string | null
  description: string | null
  styleNames: string[]
  spaceNames: string[]
  styleSlugs: string[]
  spaceSlugs: string[]
}

export async function loadProjectDetail(slug: string, locale: SiteLocale) {
  const payload = await getPayload({ config: configPromise })
  const localeOptions = { locale: locale as TypedLocale, fallbackLocale: 'en' as const, overrideAccess: false as const }
  const result = await payload.find({
    collection: 'projects',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    depth: 1,
    limit: 1,
    pagination: false,
    ...localeOptions,
  })
  const project = result.docs[0] as Project | undefined
  if (!project?.slug) return null

  const images = await publishedImages(locale, {
    and: [{ published: { equals: true } }, { project: { equals: project.id } }],
  })

  const relatedResult = await payload.find({
    collection: 'projects',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { type: { equals: project.type } },
        { id: { not_equals: project.id } },
      ],
    },
    depth: 1,
    limit: 6,
    sort: 'displayOrder',
    ...localeOptions,
  })

  const related = (relatedResult.docs as Project[])
    .filter((item) => item.slug)
    .slice(0, 3)
    .map((item) => ({
      slug: item.slug as string,
      title: item.title,
      type: item.type,
      location: publicProjectLocation(item),
      src: mediaSrc(item.featuredImage)?.src || null,
      alt: mediaSrc(item.featuredImage)?.alt || item.title,
    }))

  const detail: ProjectDetail = {
    id: project.id,
    slug: project.slug,
    title: project.title,
    type: project.type,
    location: publicProjectLocation(project),
    shortDescription: project.shortDescription || null,
    description: project.description || null,
    styleNames: names(project.styles),
    spaceNames: names(project.spaces),
    styleSlugs: (project.styles || []).map((item) => asDoc(item)?.slug).filter((slug): slug is string => Boolean(slug)),
    spaceSlugs: slugs(project.spaces),
  }

  return { project: detail, images, related }
}
