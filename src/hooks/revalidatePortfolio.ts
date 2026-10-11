import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidatePortfolio: CollectionAfterChangeHook = ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc

  try {
    revalidatePath('/projects')
    const slug =
      doc && typeof doc === 'object' && 'slug' in doc && typeof doc.slug === 'string' ? doc.slug : null
    if (slug) revalidatePath(`/projects/${slug}`)
  } catch {
    // Scripts such as the demo seed run outside a Next.js request.
  }

  return doc
}
