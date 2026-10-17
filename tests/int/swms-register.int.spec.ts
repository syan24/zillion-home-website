import { getPayload, type Payload, type PayloadRequest, type Where } from 'payload'
import config from '@/payload.config'
import { exportSWMSRegister } from '@/collections/SWMSAcknowledgements/exportRegister'
import {
  displayText,
  filenameSegment,
  filenameSource,
  registerFilename,
  toRegisterCsv,
} from '@/lib/swms/registerCsv'
import { answerLabel, responseRows } from '@/lib/swms/responseDisplay'
import {
  coerceRegisterWhere,
  mergeRegisterSearch,
  projectFilenameHint,
  singleProjectId,
} from '@/lib/swms/registerQuery'
import {
  demoAcknowledgementClientId,
  demoAcknowledgementRef,
  seedSwmsAcknowledgement,
} from '@/seed/swmsAcknowledgement'
import { seedSwms } from '@/seed/swms'
import { beforeAll, describe, expect, it } from 'vitest'

const signature =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

describe('SWMS register CSV helpers', () => {
  it('writes the register columns and escapes commas', () => {
    const csv = toRegisterCsv([
      {
        acknowledgementAccepted: true,
        project: 'Rosebery Residence',
        projectSwms: 'Construction Works SWMS',
        signedAt: '2026-04-15T01:30:00.000Z',
        submissionRef: 'ACK-1',
        version: 'v1.0',
        workerCompany: 'Demo, Electrical',
        workerName: 'Demo "Alex" Worker',
        workerPhone: '0400 111 222',
        workerTrade: 'Electrician',
      },
    ])

    const [header, row] = csv.trim().split('\r\n')
    expect(header).toBe(
      'submissionRef,signedAt,workerName,workerCompany,workerPhone,workerTrade,project,project SWMS,version,acknowledgement accepted',
    )
    expect(row).toContain('"Demo ""Alex"" Worker"')
    expect(row).toContain('"Demo, Electrical"')
    expect(row?.endsWith(',true')).toBe(true)
  })

  it('names a single-project file and otherwise uses filtered', () => {
    const date = new Date('2026-10-13T02:00:00.000Z')
    expect(registerFilename('Rosebery Residence', date)).toBe(
      'swms-register-rosebery-residence-2026-10-13.csv',
    )
    expect(registerFilename(null, date)).toBe('swms-register-filtered-2026-10-13.csv')
    expect(filenameSegment('  Harbour & House  ')).toBe('harbour-house')
    expect(displayText({ en: 'Rosebery', zh: '其他' })).toBe('Rosebery')
    expect(displayText({ en: '', zh: 'Rosebery Residence' })).toBe('Rosebery Residence')
    expect(filenameSource({ zh: '玫瑰居' }, 'rosebery-residence')).toBe('rosebery-residence')
  })

  it('reads one project id from the list filters', () => {
    expect(singleProjectId({ project: { equals: '12' } })).toBe(12)
    expect(
      singleProjectId({
        and: [{ project: { equals: 4 } }, { workerName: { contains: 'Ann' } }],
      }),
    ).toBe(4)
    expect(
      singleProjectId({
        or: [{ and: [{ project: { equals: '3' } }] }],
      }),
    ).toBe(3)
    expect(
      singleProjectId({
        or: [
          {
            and: [
              {
                project: {
                  equals: { id: 3, title: 'Rosebery Residence', slug: 'rosebery-residence' },
                },
              },
            ],
          },
        ],
      }),
    ).toBe(3)
    expect(singleProjectId({ project: { '[equals]': '9' } } as Where)).toBe(9)
    expect(singleProjectId({ 'project.id': { equals: '8' } })).toBe(8)
    expect(singleProjectId({ project: { id: { equals: 7 } } } as Where)).toBe(7)
    expect(singleProjectId({ project: { equals: { value: '6' } } })).toBe(6)
    expect(projectFilenameHint({ 'project.title': { equals: 'Rosebery Residence' } })).toEqual({
      id: null,
      label: 'Rosebery Residence',
    })
    expect(singleProjectId({ project: { in: ['4', '5'] } })).toBeNull()
    expect(singleProjectId({ workerName: { contains: 'Ann' } })).toBeNull()
    expect(singleProjectId({ project: { not_equals: 4 } })).toBeNull()
    expect(
      coerceRegisterWhere({
        or: [{ and: [{ project: { equals: { id: '3', title: 'Rosebery Residence' } } }] }],
      }),
    ).toEqual({
      or: [{ and: [{ project: { equals: 3 } }] }],
    })
    expect(
      mergeRegisterSearch(['workerName'], 'Ann', { project: { equals: 4 } }),
    ).toEqual({
      and: [{ project: { equals: 4 } }, { or: [{ workerName: { like: 'Ann' } }] }],
    })
  })

  it('labels signed question responses for a reader', () => {
    const rows = responseRows(
      {
        '0.0': 'yes',
        '0.1': 'no',
        '1.0': 'na',
        '2.0': 'accepted',
        '9.9': 'yes',
      },
      [
        {
          title: 'Site safety',
          content: '',
          questions: [
            { question: 'Have you completed the site induction?', type: 'yes-no', required: true, correctAnswer: 'yes' },
            { question: 'Are you wearing the required PPE?', type: 'yes-no', required: true, correctAnswer: 'yes' },
          ],
        },
        {
          title: 'Hazards and controls',
          content: '',
          questions: [
            {
              question: 'Do the height controls apply today?',
              type: 'yes-no-na',
              required: true,
              correctAnswer: 'any',
            },
          ],
        },
        {
          title: 'Acknowledgement',
          content: '',
          questions: [
            {
              question: 'I will follow the controls in this SWMS.',
              type: 'acknowledgement',
              required: true,
              correctAnswer: 'yes',
            },
          ],
        },
      ],
    )

    expect(rows.map((row) => [row.sectionTitle, row.question, row.answerLabel])).toEqual([
      ['Site safety', 'Have you completed the site induction?', 'Yes'],
      ['Site safety', 'Are you wearing the required PPE?', 'No'],
      ['Hazards and controls', 'Do the height controls apply today?', 'Not applicable'],
      ['Acknowledgement', 'I will follow the controls in this SWMS.', 'Accepted'],
      [null, null, 'Yes'],
    ])
    expect(rows[4]?.key).toBe('9.9')
    expect(answerLabel('')).toBe('No answer')
    expect(JSON.stringify(rows)).not.toContain('{"0.0"')
  })
})

describe('SWMS register export', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('rejects an export with no logged-in user', async () => {
    const response = await exportSWMSRegister({
      payload,
      query: { where: { workerName: { contains: 'Demo Worker' } } },
      user: null,
    } as unknown as PayloadRequest)

    expect(response.status).toBe(401)
    expect(response.headers.get('content-type')).toContain('application/json')
    const body = await response.text()
    expect(body).not.toContain('Demo Worker')
    expect(body).not.toContain('submissionRef,signedAt')
  })

  it('exports only the filtered project, version, and signer', async () => {
    const stamp = Date.now()
    const projectA = await makeProject(payload, `Harbour Register ${stamp}`)
    const projectB = await makeProject(payload, `Other Register ${stamp}`)
    const swmsA = await makeSwms(payload, projectA.id, `Harbour SWMS ${stamp}`)
    const swmsB = await makeSwms(payload, projectB.id, `Other SWMS ${stamp}`)
    const versionA = await makeVersion(payload, projectA.id, swmsA.id, 'v9.4')
    const versionB = await makeVersion(payload, projectB.id, swmsB.id, 'v2.0')

    const alpha = await makeAck(payload, {
      projectId: projectA.id,
      projectSwmsId: swmsA.id,
      signedAt: '2026-04-15T01:30:00.000Z',
      versionId: versionA.id,
      workerName: `Alpha Signer ${stamp}`,
    })
    await makeAck(payload, {
      projectId: projectA.id,
      projectSwmsId: swmsA.id,
      signedAt: '2020-01-01T00:00:00.000Z',
      versionId: versionA.id,
      workerName: `Old Signer ${stamp}`,
    })
    const beta = await makeAck(payload, {
      projectId: projectB.id,
      projectSwmsId: swmsB.id,
      signedAt: '2026-04-15T01:30:00.000Z',
      versionId: versionB.id,
      workerName: `Beta Signer ${stamp}`,
    })

    const response = await exportSWMSRegister({
      payload,
      query: {
        where: {
          and: [
            { project: { equals: String(projectA.id) } },
            { projectSwms: { equals: String(swmsA.id) } },
            { swmsVersion: { equals: String(versionA.id) } },
            { workerName: { contains: `Alpha Signer ${stamp}` } },
            { signedAt: { greater_than_equal: '2026-04-01T00:00:00.000Z' } },
            { signedAt: { less_than: '2026-05-01T00:00:00.000Z' } },
          ],
        },
      },
      user: { id: 1 },
    } as unknown as PayloadRequest)

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/csv')
    const filename = response.headers.get('content-disposition')
    expect(filename).toContain(
      `filename="swms-register-${filenameSegment(`Harbour Register ${stamp}`)}-`,
    )
    expect(filename).toContain('.csv"')

    const csv = await response.text()
    const lines = csv.trim().split('\r\n')
    expect(lines[0]).toBe(
      'submissionRef,signedAt,workerName,workerCompany,workerPhone,workerTrade,project,project SWMS,version,acknowledgement accepted',
    )
    expect(lines).toHaveLength(2)
    expect(csv).toContain(alpha.submissionRef)
    expect(csv).toContain(`Alpha Signer ${stamp}`)
    expect(csv).toContain(`Harbour Register ${stamp}`)
    expect(csv).toContain(`Harbour SWMS ${stamp}`)
    expect(csv).toContain('v9.4')
    expect(csv).toContain(',true')
    expect(csv).not.toContain(beta.submissionRef || 'missing-beta')
    expect(csv).not.toContain(`Beta Signer ${stamp}`)
    expect(csv).not.toContain(`Old Signer ${stamp}`)
    expect(csv).not.toContain('v2.0')
  })

  it('names the file from a populated project filter and a bracket equals key', async () => {
    const stamp = Date.now()
    const project = await makeProject(payload, `Rosebery Residence ${stamp}`)
    const swms = await makeSwms(payload, project.id, `Rosebery SWMS ${stamp}`)
    const version = await makeVersion(payload, project.id, swms.id, 'v1.0')
    const ack = await makeAck(payload, {
      projectId: project.id,
      projectSwmsId: swms.id,
      signedAt: '2026-04-15T01:30:00.000Z',
      versionId: version.id,
      workerName: `Rosebery Signer ${stamp}`,
    })

    const populated = await exportSWMSRegister({
      payload,
      query: {
        where: {
          or: [
            {
              and: [
                {
                  project: {
                    equals: {
                      id: project.id,
                      title: `Rosebery Residence ${stamp}`,
                      slug: `rosebery-residence-${stamp}`,
                    },
                  },
                },
              ],
            },
          ],
        },
      },
      user: { id: 1 },
    } as unknown as PayloadRequest)

    expect(populated.status).toBe(200)
    const populatedName = populated.headers.get('content-disposition')
    expect(populatedName).toContain(
      `filename="swms-register-${filenameSegment(`Rosebery Residence ${stamp}`)}-`,
    )
    expect(populatedName).not.toContain('swms-register-filtered-')
    const populatedCsv = await populated.text()
    expect(populatedCsv).toContain(ack.submissionRef)
    expect(populatedCsv).not.toContain('Beta Signer')

    const bracketed = await exportSWMSRegister({
      payload,
      query: {
        where: {
          or: [{ and: [{ project: { '[equals]': String(project.id) } }] }],
        },
      },
      user: { id: 1 },
    } as unknown as PayloadRequest)

    expect(bracketed.headers.get('content-disposition')).toContain(
      `filename="swms-register-${filenameSegment(`Rosebery Residence ${stamp}`)}-`,
    )
    expect(await bracketed.text()).toContain(ack.submissionRef)
  })

  it('keeps acknowledgements append-only and seeds one demo row', async () => {
    await seedSwms(payload)
    const first = await payload.find({
      collection: 'swms-acknowledgements',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        or: [
          { submissionRef: { equals: demoAcknowledgementRef } },
          { clientSubmissionId: { equals: demoAcknowledgementClientId } },
        ],
      },
    })
    expect(first.totalDocs).toBe(1)
    const demo = first.docs[0]
    expect(demo?.workerName).toBe('Demo Worker')
    expect(demo?.acknowledgementAccepted).toBe(true)

    const before = await payload.count({
      collection: 'swms-acknowledgements',
      overrideAccess: true,
    })
    await seedSwmsAcknowledgement(payload)
    const after = await payload.count({
      collection: 'swms-acknowledgements',
      overrideAccess: true,
    })
    expect(after.totalDocs).toBe(before.totalDocs)

    await expect(
      payload.update({
        collection: 'swms-acknowledgements',
        id: demo!.id,
        overrideAccess: true,
        data: { workerName: 'Changed Worker' },
      }),
    ).rejects.toThrow(/append-only/i)

    const unchanged = await payload.findByID({
      collection: 'swms-acknowledgements',
      id: demo!.id,
      depth: 0,
      overrideAccess: true,
    })
    expect(unchanged.workerName).toBe('Demo Worker')

    await expect(
      payload.delete({
        collection: 'swms-acknowledgements',
        id: demo!.id,
        overrideAccess: true,
      }),
    ).rejects.toThrow(/cannot be deleted/i)
  })
})

async function makeProject(payload: Payload, title: string) {
  return payload.create({
    collection: 'projects',
    data: {
      address: '1 Test Street, Sydney NSW 2000',
      projectStatus: 'active',
      showAddressPublicly: false,
      title,
      type: 'residential',
    },
  })
}

async function makeSwms(payload: Payload, projectId: number, title: string) {
  return payload.create({
    collection: 'project-swms',
    data: {
      acknowledgementText: 'Test acknowledgement',
      project: projectId,
      status: 'draft',
      title,
    },
  })
}

async function makeVersion(payload: Payload, projectId: number, projectSwmsId: number, label: string) {
  return payload.create({
    collection: 'swms-versions',
    data: {
      acknowledgementText: 'Test acknowledgement',
      project: projectId,
      projectSwms: projectSwmsId,
      sections: [
        {
          content: 'Placeholder',
          questions: [
            {
              correctAnswer: 'yes',
              question: 'Induction complete?',
              required: true,
              type: 'yes-no',
            },
          ],
          title: 'Site safety',
        },
      ],
      status: 'published',
      versionLabel: label,
    },
  })
}

async function makeAck(
  payload: Payload,
  args: {
    projectId: number
    projectSwmsId: number
    signedAt: string
    versionId: number
    workerName: string
  },
) {
  return payload.create({
    collection: 'swms-acknowledgements',
    overrideAccess: true,
    data: {
      acknowledgementAccepted: true,
      clientSubmissionId: crypto.randomUUID(),
      project: args.projectId,
      projectSwms: args.projectSwmsId,
      responses: { '0.0': 'yes' },
      signature,
      signedAt: args.signedAt,
      swmsVersion: args.versionId,
      workerCompany: 'Test Co',
      workerName: args.workerName,
      workerPhone: '0400 000 001',
      workerTrade: 'Carpenter',
    },
  })
}
