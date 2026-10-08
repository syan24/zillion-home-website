import { APIError, type CollectionAfterChangeHook, type CollectionBeforeChangeHook } from 'payload'

import { contentFingerprint, countQuestions, snapshotSections } from '@/lib/swms/content'
import { relationID } from '@/lib/swms/relationID'

export const lockPublicToken: CollectionBeforeChangeHook = ({ data, originalDoc, operation }) => {
  if (!data) return data
  if (operation === 'update' && originalDoc?.publicToken) {
    data.publicToken = originalDoc.publicToken
  }
  return data
}

export const copyTemplateOnCreate: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data) return data

  const hasSections = Array.isArray(data.sections) && data.sections.length > 0
  const templateID = relationID(data.sourceTemplate)
  if (hasSections || !templateID) return data

  const template = await req.payload.findByID({
    collection: 'swms-templates',
    id: templateID,
    depth: 0,
    overrideAccess: true,
    req,
  })

  data.sections = snapshotSections(template.sections)
  if (!data.acknowledgementText && template.acknowledgementText) {
    data.acknowledgementText = template.acknowledgementText
  }

  return data
}

export const requireContentWhenActive: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data || data.status !== 'active') return data

  const sections = snapshotSections(data.sections ?? originalDoc?.sections)
  if (!sections.length || countQuestions(sections) === 0) {
    throw new APIError('Add at least one SWMS section with a question before activating.', 400)
  }

  const acknowledgement = String(
    data.acknowledgementText ?? originalDoc?.acknowledgementText ?? '',
  ).trim()
  if (!acknowledgement) {
    throw new APIError('Add the acknowledgement statement before activating.', 400)
  }

  return data
}

export const publishActiveVersion: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context.skipVersioning) return doc
  if (doc.status !== 'active') return doc

  const nextSections = snapshotSections(doc.sections)
  const previousSections = snapshotSections(previousDoc?.sections)
  const nextAcknowledgement = String(doc.acknowledgementText ?? '')
  const previousAcknowledgement = String(previousDoc?.acknowledgementText ?? '')
  const becameActive = previousDoc?.status !== 'active'
  const contentChanged =
    contentFingerprint(nextSections, nextAcknowledgement) !==
    contentFingerprint(previousSections, previousAcknowledgement)

  if (!becameActive && !contentChanged) return doc

  const previousVersionID = relationID(doc.currentVersion)
  if (previousVersionID) {
    await req.payload.update({
      collection: 'swms-versions',
      id: previousVersionID,
      data: {
        status: 'superseded',
        supersededAt: new Date().toISOString(),
      },
      context: { allowSupersede: true },
      overrideAccess: true,
      req,
    })
  }

  const existing = await req.payload.count({
    collection: 'swms-versions',
    where: {
      projectSwms: {
        equals: doc.id,
      },
    },
    overrideAccess: true,
    req,
  })

  const projectID = relationID(doc.project)
  if (!projectID) {
    throw new APIError('Choose a project before activating this SWMS.', 400)
  }

  const version = await req.payload.create({
    collection: 'swms-versions',
    data: {
      versionLabel: `v${existing.totalDocs + 1}.0`,
      projectSwms: doc.id,
      project: projectID,
      status: 'published',
      sections: nextSections,
      acknowledgementText: nextAcknowledgement,
      publishedAt: new Date().toISOString(),
      ...(req.user?.id ? { publishedBy: req.user.id } : {}),
    },
    overrideAccess: true,
    req,
  })

  await req.payload.update({
    collection: 'project-swms',
    id: doc.id,
    data: {
      currentVersion: version.id,
      activatedAt: doc.activatedAt ?? new Date().toISOString(),
    },
    context: { skipVersioning: true },
    overrideAccess: true,
    req,
  })

  return doc
}
