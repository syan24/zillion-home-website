import { APIError, type CollectionBeforeChangeHook, type CollectionBeforeDeleteHook } from 'payload'

export function rejectRecordUpdate(label: string): CollectionBeforeChangeHook {
  return ({ data, operation }) => {
    if (operation === 'update') {
      throw new APIError(`${label} records cannot be changed.`, 400)
    }
    return data
  }
}

export function rejectRecordDelete(label: string): CollectionBeforeDeleteHook {
  return () => {
    throw new APIError(`${label} records cannot be deleted.`, 400)
  }
}
