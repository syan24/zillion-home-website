import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export function revalidateGlobal(slug: string): GlobalAfterChangeHook {
  return ({ doc, req: { payload, context } }) => {
    if (!context.disableRevalidate) {
      payload.logger.info(`Revalidating ${slug}`)
      revalidateTag(`global_${slug}`, 'max')
    }
    return doc
  }
}
