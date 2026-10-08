import { APIError, type CollectionBeforeChangeHook } from 'payload'

export const protectPublishedVersion: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (operation !== 'update' || !originalDoc || !data) return data

  if (originalDoc.status === 'superseded') {
    if (req.context?.allowSupersede) return data
    throw new APIError('Superseded SWMS versions cannot be changed.', 400)
  }

  if (originalDoc.status !== 'published') return data

  if (!req.context?.allowSupersede) {
    throw new APIError(
      'Published SWMS versions are immutable. Edit the Project SWMS while it is active to publish a new version. Existing signatures stay on the version they signed.',
      400,
    )
  }

  data.sections = originalDoc.sections
  data.acknowledgementText = originalDoc.acknowledgementText
  data.versionLabel = originalDoc.versionLabel
  data.projectSwms = originalDoc.projectSwms
  data.project = originalDoc.project
  data.publishedAt = originalDoc.publishedAt
  data.publishedBy = originalDoc.publishedBy
  data.status = 'superseded'
  data.supersededAt = data.supersededAt ?? new Date().toISOString()
  return data
}
