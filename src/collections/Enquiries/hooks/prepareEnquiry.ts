import crypto from 'crypto'
import type { CollectionBeforeValidateHook } from 'payload'

export const prepareEnquiry: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (!data || operation !== 'create') return data

  if (typeof data.submissionReference !== 'string' || data.submissionReference.trim() === '') {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = crypto.randomBytes(4).toString('hex').toUpperCase()
    data.submissionReference = `ENQ-${date}-${random}`
  } else {
    data.submissionReference = data.submissionReference.trim()
  }

  if (!data.submittedAt) {
    data.submittedAt = new Date().toISOString()
  }
  if (!data.status) data.status = 'new'
  if (!data.notificationStatus) data.notificationStatus = 'pending'
  if (!data.locale) data.locale = 'en'

  return data
}
