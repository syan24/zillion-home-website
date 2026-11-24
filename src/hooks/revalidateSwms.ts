import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'
import { revalidatePath } from 'next/cache'

import { relationID } from '@/lib/swms/relationID'

/**
 * Admin saves run inside the Next.js server. Clearing these paths matches the
 * other CMS hooks. Worker routes are also `force-dynamic`, so a write from a
 * script is visible on the next request even when this hook does not run.
 */
export const revalidateProjectSwms: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc
  const projectID = relationID(doc?.id)
  if (projectID) await revalidateProjectTokens(req, projectID)
  return doc
}

export const revalidateSwmsToken: CollectionAfterChangeHook = ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc
  revalidateTokens([typeof doc?.publicToken === 'string' ? doc.publicToken : null])
  return doc
}

async function revalidateDocumentProject(
  req: PayloadRequest,
  doc: { project?: unknown } | undefined,
) {
  if (req.context.disableRevalidate) return
  const projectID = relationID(doc?.project)
  if (projectID) await revalidateProjectTokens(req, projectID)
}

export const revalidateSwmsDocument: CollectionAfterChangeHook = async ({ doc, req }) => {
  await revalidateDocumentProject(req, doc)
  return doc
}

export const revalidateDeletedSwmsDocument: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidateDocumentProject(req, doc)
  return doc
}

async function revalidateProjectTokens(req: PayloadRequest, projectID: number) {
  try {
    const found = await req.payload.find({
      collection: 'project-swms',
      depth: 0,
      limit: 20,
      overrideAccess: true,
      req,
      where: { project: { equals: projectID } },
    })
    revalidateTokens(found.docs.map((item) => item.publicToken))
  } catch {
    // Seed and test scripts are not a Next.js render. The pages read the database live.
  }
}

function revalidateTokens(tokens: Array<string | null | undefined>) {
  try {
    revalidatePath('/swms')
    for (const token of tokens) {
      if (token) revalidatePath(`/swms/${token}`, 'layout')
    }
  } catch {
    // Same as above: revalidatePath is a no-op outside a Next.js server.
  }
}
