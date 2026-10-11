import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload, TypedLocale } from 'payload'

const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'assets/projects')
const seedContext = { disableRevalidate: true }

const styles = [
  { slug: 'modern', en: 'Modern', zh: '现代', order: 1 },
  { slug: 'minimalist', en: 'Minimalist', zh: '简约', order: 2 },
  { slug: 'contemporary', en: 'Contemporary', zh: '当代', order: 3 },
  { slug: 'classic', en: 'Classic', zh: '古典', order: 4 },
]

const spaces = [
  { slug: 'kitchen', en: 'Kitchen', zh: '厨房', order: 1 },
  { slug: 'bathroom', en: 'Bathroom', zh: '卫生间', order: 2 },
  { slug: 'living', en: 'Living', zh: '客厅', order: 3 },
  { slug: 'bedroom', en: 'Bedroom', zh: '卧室', order: 4 },
  { slug: 'wardrobe', en: 'Wardrobe & Joinery', zh: '衣柜与定制柜', order: 5 },
  { slug: 'laundry', en: 'Laundry', zh: '洗衣房', order: 6 },
  { slug: 'home-office', en: 'Home Office', zh: '家庭办公', order: 7 },
  { slug: 'outdoor', en: 'Outdoor', zh: '户外空间', order: 8 },
  { slug: 'office', en: 'Office', zh: '办公', order: 9 },
]

type ImageSeed = {
  file: string
  alt: string
  title: string
  titleZh: string
  caption: string
  captionZh: string
  styles: string[]
  spaces: string[]
  order: number
  allowDownload?: boolean
}

type ProjectSeed = {
  slug: string
  title: string
  titleZh: string
  type: 'residential' | 'commercial'
  address: string
  suburb: string
  showAddressPublicly: boolean
  short: string
  shortZh: string
  description: string
  descriptionZh: string
  styles: string[]
  spaces: string[]
  order: number
  images: ImageSeed[]
}

const projects: ProjectSeed[] = [
  {
    slug: 'kew-residence',
    title: 'Kew Residence',
    titleZh: 'Kew 住宅',
    type: 'residential',
    address: '18 Walpole Street, Kew VIC 3101',
    suburb: 'Kew',
    showAddressPublicly: false,
    short: 'A dusk-lit family home with a new kitchen, living room and main bedroom.',
    shortZh: '一栋傍晚点亮的家庭住宅，包含新厨房、客厅和主卧。',
    description:
      'Residential construction and joinery for a Kew house. The kitchen, living room and bedroom were planned together so the joinery, lighting and finishes read as one project.\n\nThe street address stays private. The public page shows the suburb only.',
    descriptionZh:
      'Kew 一栋住宅的施工与木作。厨房、客厅和卧室一起规划，橱柜、灯光和收尾看起来是同一个项目。\n\n街道地址不公开，网站只显示区域。',
    styles: ['modern', 'contemporary'],
    spaces: ['kitchen', 'living', 'bedroom'],
    order: 1,
    images: [
      {
        file: 'kew-exterior.jpg',
        alt: 'Kew house at dusk',
        title: 'House at dusk',
        titleZh: '傍晚的住宅',
        caption: 'Timber, glass and warm interior light.',
        captionZh: '木材、玻璃和温暖的室内灯光。',
        styles: ['modern'],
        spaces: ['outdoor'],
        order: 0,
      },
      {
        file: 'kew-kitchen.jpg',
        alt: 'Kitchen joinery',
        title: 'Kitchen',
        titleZh: '厨房',
        caption: 'Custom kitchen joinery.',
        captionZh: '定制厨房木作。',
        styles: ['modern'],
        spaces: ['kitchen'],
        order: 1,
      },
      {
        file: 'kew-living.jpg',
        alt: 'Living room',
        title: 'Living',
        titleZh: '客厅',
        caption: 'Living room looking toward the joinery.',
        captionZh: '客厅看向木作的一侧。',
        styles: ['modern'],
        spaces: ['living'],
        order: 2,
      },
      {
        file: 'kew-bedroom.jpg',
        alt: 'Main bedroom',
        title: 'Bedroom',
        titleZh: '卧室',
        caption: 'Main bedroom.',
        captionZh: '主卧。',
        styles: ['contemporary'],
        spaces: ['bedroom'],
        order: 3,
      },
    ],
  },
  {
    slug: 'armadale-terrace',
    title: 'Armadale Terrace',
    titleZh: 'Armadale 联排',
    type: 'residential',
    address: '42 Kooyong Road, Armadale VIC 3143',
    suburb: 'Armadale',
    showAddressPublicly: true,
    short: 'Bathroom, wardrobe and laundry joinery. The full address is public on this case.',
    shortZh: '卫生间、衣柜和洗衣房木作。这个案例公开完整地址。',
    description:
      'A terrace renovation focused on wet areas and storage. The bathroom, wardrobe and laundry were built in the joinery workshop and installed with the renovation.\n\nThis demo publishes the street address so the public-address setting can be checked against a hidden one.',
    descriptionZh:
      '一套以潮湿区和收纳为主的联排翻新。卫生间、衣柜和洗衣房在木作车间完成，并随翻新安装。\n\n这个演示项目公开街道地址，用来对照不公开地址的案例。',
    styles: ['minimalist'],
    spaces: ['bathroom', 'wardrobe', 'laundry'],
    order: 2,
    images: [
      {
        file: 'armadale-bath.jpg',
        alt: 'Bathroom with dark joinery',
        title: 'Bathroom',
        titleZh: '卫生间',
        caption: 'Vanity and shower.',
        captionZh: '浴室柜和淋浴。',
        styles: ['minimalist'],
        spaces: ['bathroom'],
        order: 0,
      },
      {
        file: 'armadale-wardrobe.jpg',
        alt: 'Built-in wardrobe',
        title: 'Wardrobe',
        titleZh: '衣柜',
        caption: 'Built-in wardrobe and joinery.',
        captionZh: '嵌入式衣柜与木作。',
        styles: ['minimalist'],
        spaces: ['wardrobe'],
        order: 1,
      },
      {
        file: 'armadale-laundry.jpg',
        alt: 'Laundry',
        title: 'Laundry',
        titleZh: '洗衣房',
        caption: 'Download is turned off for this image.',
        captionZh: '这张图片不允许下载。',
        styles: ['minimalist'],
        spaces: ['laundry'],
        order: 2,
        allowDownload: false,
      },
    ],
  },
  {
    slug: 'richmond-studio',
    title: 'Richmond Studio',
    titleZh: 'Richmond 工作室',
    type: 'commercial',
    address: '9 Tanner Street, Richmond VIC 3121',
    suburb: 'Richmond',
    showAddressPublicly: false,
    short: 'Commercial fit-out for a small studio, with a workspace and meeting room.',
    shortZh: '小型工作室的商业装修，包含工作区和会议室。',
    description:
      'A commercial fit-out in Richmond. The workspace and meeting room share the same joinery language, and the street address is not published.',
    descriptionZh: 'Richmond 的一处商业装修。工作区和会议室使用同一套木作语言，街道地址不公开。',
    styles: ['contemporary'],
    spaces: ['office'],
    order: 3,
    images: [
      {
        file: 'richmond-exterior.jpg',
        alt: 'Commercial building',
        title: 'Street front',
        titleZh: '沿街立面',
        caption: 'The studio sits in a Richmond commercial building.',
        captionZh: '工作室位于 Richmond 的一栋商业楼。',
        styles: ['contemporary'],
        spaces: [],
        order: 0,
      },
      {
        file: 'richmond-office.jpg',
        alt: 'Studio workspace',
        title: 'Workspace',
        titleZh: '工作区',
        caption: 'Open workspace.',
        captionZh: '开放工作区。',
        styles: ['contemporary'],
        spaces: ['office'],
        order: 1,
      },
      {
        file: 'richmond-boardroom.jpg',
        alt: 'Meeting room',
        title: 'Meeting room',
        titleZh: '会议室',
        caption: 'Meeting room fit-out.',
        captionZh: '会议室装修。',
        styles: ['contemporary'],
        spaces: ['office'],
        order: 2,
      },
    ],
  },
  {
    slug: 'south-yarra-courtyard',
    title: 'South Yarra Courtyard',
    titleZh: 'South Yarra 庭院',
    type: 'residential',
    address: '7 Darling Street, South Yarra VIC 3141',
    suburb: 'South Yarra',
    showAddressPublicly: false,
    short: 'Outdoor living and a home office, finished with classic timber.',
    shortZh: '户外起居和家庭办公，以古典木材收尾。',
    description:
      'A residential case organised around an outdoor room and a quiet home office. Use it with the Classic style filter, or open Outdoor and Home Office from By Room.',
    descriptionZh: '一个围绕户外空间和安静书房组织的住宅案例。可以用古典风格筛选，或从按空间进入户外和家庭办公。',
    styles: ['classic'],
    spaces: ['outdoor', 'home-office'],
    order: 4,
    images: [
      {
        file: 'south-yarra-outdoor.jpg',
        alt: 'Outdoor living',
        title: 'Outdoor',
        titleZh: '户外',
        caption: 'Outdoor living space.',
        captionZh: '户外起居空间。',
        styles: ['classic'],
        spaces: ['outdoor'],
        order: 0,
      },
      {
        file: 'south-yarra-study.jpg',
        alt: 'Home office desk',
        title: 'Home office',
        titleZh: '家庭办公',
        caption: 'A small home office.',
        captionZh: '一间小书房。',
        styles: ['classic'],
        spaces: ['home-office'],
        order: 1,
      },
    ],
  },
]

async function ensureMedia(payload: Payload, file: string, alt: string) {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: file } },
  })
  if (existing.docs[0]) return existing.docs[0].id

  const filePath = path.join(assetsDir, file)
  if (!fs.existsSync(filePath)) throw new Error(`Missing portfolio image ${filePath}`)

  const created = await payload.create({
    collection: 'media',
    overrideAccess: true,
    context: seedContext,
    data: { alt },
    filePath,
  })
  return created.id
}

async function ensureTerm(
  payload: Payload,
  collection: 'styles' | 'spaces',
  item: { slug: string; en: string; zh: string; order: number },
) {
  const existing = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: item.slug } },
  })

  let id = existing.docs[0]?.id
  if (!id) {
    const created = await payload.create({
      collection,
      overrideAccess: true,
      locale: 'en',
      context: seedContext,
      data: {
        name: item.en,
        slug: item.slug,
        generateSlug: false,
        active: true,
        displayOrder: item.order,
      },
    })
    id = created.id
  }

  const zh = await payload.findByID({
    collection,
    id,
    locale: 'zh' as TypedLocale,
    fallbackLocale: false,
    overrideAccess: true,
    depth: 0,
  })
  if (!zh.name) {
    await payload.update({
      collection,
      id,
      locale: 'zh' as TypedLocale,
      overrideAccess: true,
      context: seedContext,
      data: { name: item.zh },
    })
  }
  return id
}

export async function seedPortfolio(payload: Payload) {
  const summary: string[] = []
  const styleIds: Record<string, number> = {}
  const spaceIds: Record<string, number> = {}

  for (const style of styles) styleIds[style.slug] = await ensureTerm(payload, 'styles', style)
  for (const space of spaces) spaceIds[space.slug] = await ensureTerm(payload, 'spaces', space)
  summary.push('styles and spaces ready')

  for (const project of projects) {
    const existing = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: project.slug } },
    })

    let id = existing.docs[0]?.id
    if (!id) {
      const created = await payload.create({
        collection: 'projects',
        overrideAccess: true,
        draft: false,
        locale: 'en',
        context: seedContext,
        data: {
          title: project.title,
          slug: project.slug,
          generateSlug: false,
          _status: 'published',
          type: project.type,
          address: project.address,
          suburb: project.suburb,
          showAddressPublicly: project.showAddressPublicly,
          shortDescription: project.short,
          description: project.description,
          styles: project.styles.map((slug) => styleIds[slug]),
          spaces: project.spaces.map((slug) => spaceIds[slug]),
          displayOrder: project.order,
          projectStatus: 'completed',
          summary: 'Demo portfolio project.',
        },
      })
      id = created.id
      summary.push(`project ${project.slug}: created`)
    } else {
      summary.push(`project ${project.slug}: kept`)
    }

    const zh = await payload.findByID({
      collection: 'projects',
      id,
      locale: 'zh' as TypedLocale,
      fallbackLocale: false,
      overrideAccess: true,
      depth: 0,
      draft: false,
    })
    if (!zh.title) {
      await payload.update({
        collection: 'projects',
        id,
        locale: 'zh' as TypedLocale,
        draft: false,
        overrideAccess: true,
        context: seedContext,
        data: {
          title: project.titleZh,
          shortDescription: project.shortZh,
          description: project.descriptionZh,
        },
      })
      summary.push(`project ${project.slug}: zh filled`)
    }

    const imageCount = await payload.find({
      collection: 'project-images',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { project: { equals: id } },
    })
    if (imageCount.totalDocs > 0) {
      summary.push(`project ${project.slug}: images kept`)
      continue
    }

    let featured: number | undefined
    for (const image of project.images) {
      const mediaId = await ensureMedia(payload, image.file, image.alt)
      featured ??= mediaId
      const created = await payload.create({
        collection: 'project-images',
        overrideAccess: true,
        locale: 'en',
        context: seedContext,
        data: {
          project: id,
          image: mediaId,
          title: image.title,
          caption: image.caption,
          styles: image.styles.map((slug) => styleIds[slug]),
          spaces: image.spaces.map((slug) => spaceIds[slug]),
          displayOrder: image.order,
          published: true,
          allowDownload: image.allowDownload !== false,
        },
      })
      await payload.update({
        collection: 'project-images',
        id: created.id,
        locale: 'zh' as TypedLocale,
        overrideAccess: true,
        context: seedContext,
        data: { title: image.titleZh, caption: image.captionZh },
      })
    }

    if (featured) {
      await payload.update({
        collection: 'projects',
        id,
        draft: false,
        overrideAccess: true,
        context: seedContext,
        data: { featuredImage: featured },
      })
    }
    summary.push(`project ${project.slug}: images created`)
  }

  console.log(summary.join('\n'))
  return summary
}
