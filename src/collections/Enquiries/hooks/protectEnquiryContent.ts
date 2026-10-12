import type { CollectionBeforeChangeHook } from 'payload'

import { enquiryStatusOptions } from '@/lib/enquiry/options'

const lockedFields = [
  'submissionReference',
  'clientSubmissionId',
  'submittedAt',
  'name',
  'phone',
  'email',
  'address',
  'projectType',
  'scope',
  'spaces',
  'notes',
  'budgetRange',
  'expectedStart',
  'attachments',
  'additionalAnswers',
  'locale',
  'submitterIp',
  'userAgent',
] as const

const statuses = new Set<string>(enquiryStatusOptions.map((option) => option.value))

export const protectEnquiryContent: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (!data) return data
  if (typeof data.projectTypeDetail === 'string') {
    data.projectTypeDetail = data.projectTypeDetail.trim().slice(0, 300)
  }
  if (typeof data.internalNotes === 'string') {
    data.internalNotes = data.internalNotes.trim().slice(0, 5000)
  }

  if (operation !== 'update' || !originalDoc) return data

  for (const field of lockedFields) {
    data[field] = originalDoc[field]
  }

  if (!req.context?.enquiryNotifyUpdate) {
    data.notificationStatus = originalDoc.notificationStatus
    data.notificationDetail = originalDoc.notificationDetail
  }

  if (!statuses.has(String(data.status))) {
    data.status = originalDoc.status
  }

  return data
}
