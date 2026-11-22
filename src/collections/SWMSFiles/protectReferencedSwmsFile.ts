import { APIError, type CollectionBeforeDeleteHook } from 'payload'

export const protectReferencedSwmsFile: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const [documents, confirmations, reports] = await Promise.all([
    req.payload.find({
      collection: 'swms-documents',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      req,
      where: { file: { equals: id } },
    }),
    req.payload.find({
      collection: 'swms-document-confirmations',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      req,
      where: { file: { equals: id } },
    }),
    req.payload.find({
      collection: 'site-safety-reports',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      req,
      where: { attachment: { equals: id } },
    }),
  ])

  if (documents.totalDocs > 0 || confirmations.totalDocs > 0 || reports.totalDocs > 0) {
    throw new APIError('This file is part of a site safety record and cannot be deleted.', 400)
  }
}
