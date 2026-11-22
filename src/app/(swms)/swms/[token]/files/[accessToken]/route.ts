import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { loadActiveSwms } from '@/lib/swms/loadWorkerSWMS'
import { readSwmsFile } from '@/lib/swms/readSwmsFile'
import { relationID } from '@/lib/swms/relationID'

const ACCESS_TOKEN = /^[A-Za-z0-9_-]{20,200}$/

type Args = {
  params: Promise<{ token: string; accessToken: string }>
}

export async function GET(_request: Request, { params }: Args) {
  const { token, accessToken } = await params
  if (!ACCESS_TOKEN.test(accessToken)) return notFound()

  const payload = await getPayload({ config: configPromise })
  const site = await loadActiveSwms(payload, token)
  if (!site) return notFound()

  const found = await payload.find({
    collection: 'swms-documents',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { accessToken: { equals: accessToken } },
        { project: { equals: site.projectId } },
        { status: { equals: 'active' } },
      ],
    },
  })
  const document = found.docs[0]
  const fileID = relationID(document?.file)
  if (!document || !fileID) return notFound()

  const file = await payload.findByID({
    collection: 'swms-files',
    id: fileID,
    depth: 0,
    overrideAccess: true,
  })
  const stored = await readSwmsFile(file)
  if (!stored) return notFound()

  const filename = stored.filename.replace(/[^A-Za-z0-9._-]+/g, '-')
  return new Response(new Uint8Array(stored.bytes), {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Content-Type': stored.mimeType,
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

function notFound() {
  return new Response('Not found', { status: 404 })
}
