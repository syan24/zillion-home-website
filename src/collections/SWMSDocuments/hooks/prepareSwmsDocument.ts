import crypto from 'crypto'
import { APIError, type CollectionBeforeChangeHook } from 'payload'

import { relationID } from '@/lib/swms/relationID'

const PDF_MIME = new Set(['application/pdf', 'application/x-pdf'])

export const prepareSwmsDocument: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (!data) return data

  const trades = Array.isArray(data.trades) ? data.trades : originalDoc?.trades
  if (!Array.isArray(trades) || trades.length === 0) {
    throw new APIError('Choose at least one trade for this SWMS file.', 400)
  }

  const fileID = relationID(data.file ?? originalDoc?.file)
  if (!fileID) throw new APIError('Upload a SWMS PDF.', 400)

  const file = await req.payload.findByID({
    collection: 'swms-files',
    id: fileID,
    depth: 0,
    overrideAccess: true,
    req,
  })
  if (!PDF_MIME.has(file.mimeType || '')) {
    throw new APIError('SWMS files must be PDFs.', 400)
  }

  if (operation === 'create') {
    data.fileVersion = 1
    data.versionLabel = 'v1'
    if (typeof data.accessToken !== 'string' || data.accessToken.trim() === '') {
      data.accessToken = crypto.randomBytes(24).toString('base64url')
    }
    return data
  }

  if (originalDoc?.accessToken) data.accessToken = originalDoc.accessToken
  const previousFile = relationID(originalDoc?.file)
  const nextFile = fileID
  const previousVersion = Number(originalDoc?.fileVersion) || 1
  if (previousFile && nextFile !== previousFile) {
    data.fileVersion = previousVersion + 1
    data.versionLabel = `v${data.fileVersion}`
    return data
  }

  data.fileVersion = previousVersion
  data.versionLabel = originalDoc?.versionLabel || `v${previousVersion}`
  return data
}
