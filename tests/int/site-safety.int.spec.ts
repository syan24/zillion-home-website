/** @vitest-environment node */
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { beforeAll, describe, expect, it } from 'vitest'

import { buildTextPdf } from '@/lib/swms/demoPdf'
import {
  acknowledgementUnlocked,
  documentsForTrades,
  pendingDocumentConfirmations,
  scrolledToEnd,
  validateSelectedTrades,
} from '@/lib/swms/siteSafety'
import {
  confirmSwmsVersions,
  createSiteReport,
  recordAttendance,
  saveInduction,
} from '@/lib/swms/siteSafetyRecords'

const signature =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

let payload: Payload

describe('site safety rules', () => {
  it('keeps the SWMS acknowledgement hidden until the last page is in view', () => {
    expect(scrolledToEnd({ scrollTop: 0, clientHeight: 0, scrollHeight: 0 })).toBe(false)
    expect(scrolledToEnd({ scrollTop: 0, clientHeight: 400, scrollHeight: 1600 })).toBe(false)
    expect(scrolledToEnd({ scrollTop: 1184, clientHeight: 400, scrollHeight: 1600 })).toBe(true)
    expect(acknowledgementUnlocked(false)).toBe(false)
    expect(acknowledgementUnlocked(true)).toBe(true)
  })

  it('accepts several enabled trades and rejects a trade that is hidden', () => {
    const enabled = ['electrical-mechanical', 'interior-fitout']
    const accepted = validateSelectedTrades(['interior-fitout', 'electrical-mechanical', 'interior-fitout'], enabled)
    expect(accepted.ok).toBe(true)
    if (accepted.ok) expect(accepted.value).toEqual(['interior-fitout', 'electrical-mechanical'])
    expect(validateSelectedTrades(['landscaping'], enabled).ok).toBe(false)
    expect(validateSelectedTrades([], enabled).ok).toBe(false)
  })

  it('asks for a new file version without repeating documents that are unchanged', () => {
    const documents = [
      { id: 1, accessToken: 'a', title: 'Heights', trades: ['electrical-mechanical'], fileVersion: 2, versionLabel: 'v2' },
      { id: 2, accessToken: 'b', title: 'Fit-out', trades: ['interior-fitout'], fileVersion: 1, versionLabel: 'v1' },
    ]
    const pending = pendingDocumentConfirmations(documents, ['electrical-mechanical', 'interior-fitout'], [
      { documentId: 1, fileVersion: 1 },
      { documentId: 2, fileVersion: 1 },
    ])
    expect(pending.map((document) => document.id)).toEqual([1])
    expect(documentsForTrades(documents, ['interior-fitout']).map((document) => document.id)).toEqual([2])
  })

  it('builds a readable demo PDF', () => {
    const pdf = buildTextPdf([['SWMS demo', 'Page 1'], ['Page 2']])
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
    expect(pdf.includes(Buffer.from('Page 2'))).toBe(true)
  })
})

describe('site safety records', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('sends a first visit to induction and lets a returning worker sign in', async () => {
    const site = await buildSite(payload)
    const name = 'Li Wei'
    const phone = '0400 555 010'

    const first = await recordAttendance(payload, { token: site.token, name, phone, direction: 'in' })
    expect(first.ok).toBe(false)
    if (first.ok) return
    expect(first.code).toBe('induction-required')

    const attendance = await payload.find({
      collection: 'site-attendance',
      overrideAccess: true,
      where: { project: { equals: site.projectId } },
    })
    expect(attendance.totalDocs).toBe(0)

    const rejected = await saveInduction(payload, inductionInput(site, { trades: ['landscaping'] }))
    expect(rejected.ok).toBe(false)

    const saved = await saveInduction(payload, inductionInput(site, { confirmed: site.documents }))
    expect(saved.ok).toBe(true)

    const signed = await payload.find({
      collection: 'swms-acknowledgements',
      overrideAccess: true,
      where: { project: { equals: site.projectId } },
    })
    expect(signed.totalDocs).toBe(1)
    expect(signed.docs[0]?.trades).toEqual(['electrical-mechanical', 'interior-fitout'])
    expect(signed.docs[0]?.workerPhoneKey).toBe('0400555010')

    const confirmations = await payload.find({
      collection: 'swms-document-confirmations',
      overrideAccess: true,
      where: { project: { equals: site.projectId } },
    })
    expect(confirmations.totalDocs).toBe(2)
    expect(confirmations.docs.every((doc) => doc.fileVersion === 1)).toBe(true)
    expect(confirmations.docs[0]?.confirmedAt).toBeTruthy()

    const open = await payload.find({
      collection: 'site-attendance',
      overrideAccess: true,
      where: { project: { equals: site.projectId } },
    })
    expect(open.docs[0]?.direction).toBe('in')

    const again = await recordAttendance(payload, {
      token: site.token,
      name,
      phone: '+61 400 555 010',
      direction: 'in',
    })
    expect(again.ok).toBe(true)
    if (again.ok) expect(again.code).toBe('already-in')

    const out = await recordAttendance(payload, { token: site.token, name, phone, direction: 'out' })
    expect(out.ok).toBe(true)
    if (out.ok) expect(out.code).toBe('signed-out')

    const replacement = await uploadPdf(payload, 'replacement.pdf', [['Updated SWMS', 'New version']])
    await payload.update({
      collection: 'swms-documents',
      id: site.heightsId,
      overrideAccess: true,
      data: { file: replacement },
    })
    const updated = await payload.findByID({
      collection: 'swms-documents',
      id: site.heightsId,
      overrideAccess: true,
    })
    expect(updated.fileVersion).toBe(2)
    expect(updated.versionLabel).toBe('v2')

    const returning = await recordAttendance(payload, { token: site.token, name, phone, direction: 'in' })
    expect(returning.ok).toBe(false)
    if (returning.ok) return
    expect(returning.code).toBe('reconfirm-required')
    expect(returning.pending?.map((document) => document.title)).toEqual(['SWMS - Working at heights'])

    const reconfirmed = await confirmSwmsVersions(payload, {
      token: site.token,
      name,
      phone,
      confirmed: [{ accessToken: updated.accessToken || '', fileVersion: 2 }],
    })
    expect(reconfirmed.ok).toBe(true)

    const stillOneInduction = await payload.find({
      collection: 'swms-acknowledgements',
      overrideAccess: true,
      where: { project: { equals: site.projectId } },
    })
    expect(stillOneInduction.totalDocs).toBe(1)

    const signedIn = await recordAttendance(payload, { token: site.token, name, phone, direction: 'in' })
    expect(signedIn.ok).toBe(true)
    if (signedIn.ok) expect(signedIn.code).toBe('signed-in')
  })

  it('stores incident, hazard, and toolbox reports', async () => {
    const site = await buildSite(payload)
    const kinds = ['incident', 'hazard', 'toolbox'] as const
    for (const kind of kinds) {
      const result = await createSiteReport(payload, {
        token: site.token,
        kind,
        name: 'Chen Yu',
        phone: '0411 222 333',
        description: `${kind} note for the test project`,
        occurredAt: '2026-11-20T01:00:00.000Z',
      })
      expect(result.ok).toBe(true)
    }

    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    )
    const withPhoto = await createSiteReport(payload, {
      token: site.token,
      kind: 'hazard',
      name: 'Chen Yu',
      phone: '0411 222 333',
      description: 'Loose board on the stair',
      attachment: { data: png, mimetype: 'image/png', name: 'hazard.png' },
    })
    expect(withPhoto.ok).toBe(true)

    const reports = await payload.find({
      collection: 'site-safety-reports',
      overrideAccess: true,
      sort: 'createdAt',
      where: { project: { equals: site.projectId } },
    })
    expect(reports.totalDocs).toBe(4)
    expect(reports.docs.map((doc) => doc.kind)).toEqual(['incident', 'hazard', 'toolbox', 'hazard'])
    expect(reports.docs[3]?.attachment).toBeTruthy()
    expect(reports.docs[0]?.description).toContain('incident')
  })
})

async function buildSite(payload: Payload) {
  const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const project = await payload.create({
    collection: 'projects',
    overrideAccess: true,
    data: {
      title: `Safety ${stamp}`,
      address: '9 Safety Street, Sydney NSW 2000',
      type: 'residential',
      projectStatus: 'active',
      showAddressPublicly: false,
      enabledTrades: ['electrical-mechanical', 'interior-fitout'],
    },
  })

  const template = await payload.create({
    collection: 'swms-templates',
    overrideAccess: true,
    data: {
      name: `Safety template ${stamp}`,
      status: 'active',
      acknowledgementText: 'Test acknowledgement',
      sections: [
        {
          title: 'Site induction',
          content: 'Placeholder',
          questions: [{ question: 'Induction understood?', type: 'yes-no', required: true, correctAnswer: 'yes' }],
        },
      ],
    },
  })

  const draft = await payload.create({
    collection: 'project-swms',
    overrideAccess: true,
    data: {
      title: `Safety SWMS ${stamp}`,
      project: project.id,
      sourceTemplate: template.id,
      status: 'draft',
      acknowledgementText: 'Test acknowledgement',
    },
  })
  await payload.update({
    collection: 'project-swms',
    id: draft.id,
    overrideAccess: true,
    data: { status: 'active' },
  })
  const active = await payload.findByID({ collection: 'project-swms', id: draft.id, overrideAccess: true })

  const heightsFile = await uploadPdf(payload, `heights-${stamp}.pdf`, [
    ['SWMS - Working at heights', 'Page 1'],
    ['Last page'],
  ])
  const fitoutFile = await uploadPdf(payload, `fitout-${stamp}.pdf`, [['SWMS - Interior fit-out', 'Last page']])
  const heights = await payload.create({
    collection: 'swms-documents',
    overrideAccess: true,
    data: {
      title: 'SWMS - Working at heights',
      project: project.id,
      file: heightsFile,
      trades: ['electrical-mechanical'],
      status: 'active',
      sortOrder: 1,
    },
  })
  const fitout = await payload.create({
    collection: 'swms-documents',
    overrideAccess: true,
    data: {
      title: 'SWMS - Interior fit-out',
      project: project.id,
      file: fitoutFile,
      trades: ['interior-fitout'],
      status: 'active',
      sortOrder: 2,
    },
  })

  const versionId = typeof active.currentVersion === 'object' ? active.currentVersion?.id : active.currentVersion
  if (!active.publicToken || !versionId || !heights.accessToken) {
    throw new Error('Site safety fixture did not publish')
  }

  return {
    token: active.publicToken,
    projectId: project.id,
    heightsId: heights.id,
    versionId,
    documents: [
      { accessToken: heights.accessToken, fileVersion: heights.fileVersion || 1 },
      { accessToken: fitout.accessToken || '', fileVersion: fitout.fileVersion || 1 },
    ],
  }
}

function inductionInput(
  site: { token: string; versionId: number; documents: { accessToken: string; fileVersion: number }[] },
  overrides: { trades?: string[]; confirmed?: { accessToken: string; fileVersion: number }[] } = {},
) {
  return {
    token: site.token,
    versionId: site.versionId,
    clientSubmissionId: crypto.randomUUID(),
    responses: { '0.0': 'yes' },
    workerName: 'Li Wei',
    workerCompany: 'Demo Electrical',
    workerPhone: '0400 555 010',
    trades: overrides.trades ?? ['electrical-mechanical', 'interior-fitout'],
    confirmed: overrides.confirmed ?? site.documents,
    acknowledgementAccepted: true,
    signature,
  }
}

async function uploadPdf(payload: Payload, name: string, pages: string[][]) {
  const pdf = buildTextPdf(pages)
  const file = await payload.create({
    collection: 'swms-files',
    overrideAccess: true,
    data: { alt: name },
    file: {
      data: pdf,
      mimetype: 'application/pdf',
      name,
      size: pdf.length,
    },
  })
  return file.id
}
