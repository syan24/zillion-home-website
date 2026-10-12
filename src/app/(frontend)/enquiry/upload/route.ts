import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

import { enquiryUploadMimeTypes, isIncomingEnquiryPath } from '@/lib/enquiry/files'
import { MAX_ENQUIRY_FILE_BYTES } from '@/lib/enquiry/options'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<Response> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return Response.json({ error: 'uploads-unavailable' }, { status: 404 })
  }

  let body: HandleUploadBody
  try {
    body = (await request.json()) as HandleUploadBody
  } catch {
    return Response.json({ error: 'invalid-upload' }, { status: 400 })
  }

  if (body.type === 'blob.generate-client-token' && !sameOrigin(request)) {
    return Response.json({ error: 'forbidden' }, { status: 403 })
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (pathname) => {
        if (!isIncomingEnquiryPath(pathname)) {
          throw new Error('Invalid enquiry upload path.')
        }
        return {
          addRandomSuffix: false,
          allowOverwrite: false,
          allowedContentTypes: [...enquiryUploadMimeTypes],
          maximumSizeInBytes: MAX_ENQUIRY_FILE_BYTES,
          validUntil: Date.now() + 15 * 60 * 1000,
        }
      },
      onUploadCompleted: async () => {
        return undefined
      },
    })
    return Response.json(jsonResponse)
  } catch (error) {
    console.error('Enquiry client upload failed', error)
    return Response.json({ error: 'upload-failed' }, { status: 400 })
  }
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
