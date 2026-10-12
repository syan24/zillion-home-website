import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

/** The enquiry form is saved through /enquiry. Form submissions must not create a second copy. */
export const rejectEnquiryFormSubmission: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data) return data
  const formId = typeof data.form === 'object' && data.form ? data.form.id : data.form
  if (formId == null || formId === '') return data

  let form: { enquiryForm?: boolean | null } | null = null
  try {
    form = await req.payload.findByID({
      id: formId,
      collection: 'forms',
      depth: 0,
      overrideAccess: true,
      req,
    })
  } catch {
    return data
  }

  if (form?.enquiryForm) {
    throw new ValidationError({
      collection: 'form-submissions',
      errors: [
        {
          message: 'This form is saved as an enquiry. Submit it from the enquiry page.',
          path: 'form',
        },
      ],
    })
  }

  return data
}
