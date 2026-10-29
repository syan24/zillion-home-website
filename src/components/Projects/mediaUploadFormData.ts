import { uploadRequiresServerValidation } from 'payload/shared'

export type ClientUploadHandler = (args: {
  file: File
  updateFilename: (filename: string) => void
}) => Promise<unknown>

/**
 * Builds the same multipart body Payload's admin bulk upload sends.
 * When a client-upload handler is registered (Vercel Blob), the file field is a
 * JSON description of the already-uploaded object. Otherwise it is the file itself.
 */
export async function buildMediaUploadFormData({
  alt,
  file,
  uploadHandler,
}: {
  alt: string
  file: File
  uploadHandler: ClientUploadHandler | null
}): Promise<FormData> {
  const formData = new FormData()
  formData.append('_payload', JSON.stringify({ alt }))

  const sendToServer =
    !uploadHandler ||
    uploadRequiresServerValidation({
      filename: file.name,
      mimeType: file.type,
    })

  if (sendToServer) {
    formData.append('file', file, file.name)
    return formData
  }

  let filename = file.name
  const clientUploadContext = await uploadHandler({
    file,
    updateFilename: (value) => {
      filename = value
    },
  })

  formData.append(
    'file',
    JSON.stringify({
      clientUploadContext,
      collectionSlug: 'media',
      filename,
      mimeType: file.type,
      size: file.size,
    }),
  )
  return formData
}
