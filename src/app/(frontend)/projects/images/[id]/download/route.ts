import fs from 'fs/promises'
import path from 'path'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

import type { Media, Project, ProjectImage } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

type Args = {
  params: Promise<{ id: string }>
}

function safeName(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '-') || 'project-image.jpg'
}

export async function GET(_request: Request, { params }: Args) {
  const { id } = await params
  if (!/^\d+$/.test(id)) return new NextResponse('Not found', { status: 404 })

  const payload = await getPayload({ config: configPromise })
  let image: ProjectImage
  try {
    image = (await payload.findByID({
      collection: 'project-images',
      id,
      depth: 1,
      overrideAccess: true,
    })) as ProjectImage
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }

  const project = image.project
  const projectDoc = project && typeof project === 'object' ? (project as Project) : null
  const media = image.image && typeof image.image === 'object' ? (image.image as Media) : null
  if (!image.published || !image.allowDownload || !projectDoc || projectDoc._status !== 'published' || !media) {
    return new NextResponse('Not found', { status: 404 })
  }

  const filename = safeName(media.filename || `${image.title}.jpg`)
  const headers = {
    'Content-Type': media.mimeType || 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'private, max-age=60',
  }

  if (media.url?.startsWith('http')) {
    const upstream = await fetch(media.url)
    if (!upstream.ok || !upstream.body) return new NextResponse('Not found', { status: 404 })
    return new NextResponse(upstream.body, { headers })
  }

  const localPath = path.resolve(process.cwd(), 'public/media', media.filename || '')
  try {
    const file = await fs.readFile(localPath)
    return new NextResponse(file, { headers })
  } catch {
    const fallback = media.url ? `${getServerSideURL()}${media.url}` : ''
    if (!fallback) return new NextResponse('Not found', { status: 404 })
    const upstream = await fetch(fallback)
    if (!upstream.ok || !upstream.body) return new NextResponse('Not found', { status: 404 })
    return new NextResponse(upstream.body, { headers })
  }
}
