import type { CollectionBeforeDeleteHook } from 'payload'

function idsOf(value: unknown): Array<number | string> {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (typeof item === 'number' || typeof item === 'string') return [item]
    if (item && typeof item === 'object' && 'id' in item) {
      const id = (item as { id: unknown }).id
      if (typeof id === 'number' || typeof id === 'string') return [id]
    }
    return []
  })
}

export const deleteEnquiryFiles: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const doc = await req.payload.findByID({
    collection: 'enquiries',
    id,
    depth: 0,
    overrideAccess: true,
    req,
  })
  for (const fileId of idsOf(doc?.attachments)) {
    await req.payload
      .delete({
        collection: 'enquiry-files',
        id: fileId,
        overrideAccess: true,
        req,
      })
      .catch((error) => {
        req.payload.logger.error(error)
      })
  }
}
