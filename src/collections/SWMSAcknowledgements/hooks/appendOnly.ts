import { APIError, type CollectionBeforeChangeHook, type CollectionBeforeDeleteHook } from 'payload'

export const rejectAcknowledgementUpdate: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'update') {
    throw new APIError(
      'SWMS acknowledgements are append-only. Signed records cannot be changed.',
      400,
    )
  }
  return data
}

export const rejectAcknowledgementDelete: CollectionBeforeDeleteHook = () => {
  throw new APIError('SWMS acknowledgements cannot be deleted.', 400)
}
