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

function relationIds(value: Relation<{ id: number }>[] | null | undefined) {
  return (value || [])
    .map((item) => (typeof item === 'number' ? item : item?.id))
    .filter((id): id is number => typeof id === 'number')
}

async function publishedImages(locale: SiteLocale, projectIds: number[]) {
  const payload = await getPayload({ config: configPromise })
  const where: Where = projectIds.length
    ? { and: [{ published: { equals: true } }, { project: { in: projectIds } }] }
    : { id: { equals: -1 } }
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
  return { images: sortImages(images, result.docs), docs: result.docs }
}

export async function loadPortfolio(locale: SiteLocale, filters: ProjectFilters) {
  const payload = await getPayload({ config: configPromise })
  const localeOptions = { locale: locale as TypedLocale, fallbackLocale: 'en' as const, overrideAccess: false as const }

  const [styleResult, spaceResult, projectResult] = await Promise.all([
    payload.find({ collection: 'styles', limit: 50, sort: 'displayOrder', pagination: false, ...localeOptions }),
    payload.find({ collection: 'spaces', limit: 50, sort: 'displayOrder', pagination: false, ...localeOptions }),
    payload.find({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      depth: 0,
      limit: 200,
      pagination: false,
      sort: 'displayOrder',
      ...localeOptions,
    }),
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

  const publishedProjects = projectResult.docs.filter((doc) => doc.slug)
  const styleId = filters.style ? styles.find((item) => item.slug === filters.style)?.id : undefined
  const spaceId = filters.space ? spaces.find((item) => item.slug === filters.space)?.id : undefined
  const knownStyle = !filters.style || Boolean(styleId)
  const knownSpace = !filters.space || Boolean(spaceId)

  const candidateIds = publishedProjects
    .filter((project) => {
      if (!knownStyle || !knownSpace) return false
      if (filters.type && project.type !== filters.type) return false
      if (filters.project && project.slug !== filters.project) return false
      return true
    })
    .map((project) => project.id)

  const loaded = await publishedImages(locale, candidateIds)
  const covers = hasProjectFilters(filters) ? (await publishedImages(locale, publishedProjects.map((project) => project.id))).images : loaded.images

  const styleIdsByProject = new Map(publishedProjects.map((project) => [project.id, relationIds(project.styles)]))
  const spaceIdsByProject = new Map(publishedProjects.map((project) => [project.id, relationIds(project.spaces)]))
  const projectIdBySlug = new Map(publishedProjects.map((project) => [project.slug as string, project.id]))

  const images = loaded.images.filter((image) => {
    const projectId = projectIdBySlug.get(image.projectSlug)
    if (!projectId) return false
    if (styleId) {
      const onImage = loaded.docs.find((doc) => doc.id === image.id)
      const imageStyleIds = relationIds(onImage?.styles)
      if (!imageStyleIds.includes(styleId) && !styleIdsByProject.get(projectId)?.includes(styleId)) return false
    }
    if (spaceId) {
      const onImage = loaded.docs.find((doc) => doc.id === image.id)
      const imageSpaceIds = relationIds(onImage?.spaces)
      if (!imageSpaceIds.includes(spaceId) && !spaceIdsByProject.get(projectId)?.includes(spaceId)) return false
    }
    return true
  })

  return { styles, spaces, images: hasProjectFilters(filters) ? images : covers, covers, projects: projectOptions(covers) }
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

  const images = (await publishedImages(locale, [project.id])).images

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
