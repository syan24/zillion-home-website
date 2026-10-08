import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { beforeAll, describe, expect, it } from 'vitest'

let payload: Payload

describe('SWMS publishing', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('publishes an immutable version and keeps older signatures on that version', async () => {
    const project = await payload.create({
      collection: 'projects',
      data: {
        title: `SWMS test ${Date.now()}`,
        address: '1 Test Street, Sydney NSW 2000',
        type: 'residential',
        projectStatus: 'active',
        showAddressPublicly: false,
      },
    })

    const template = await payload.create({
      collection: 'swms-templates',
      data: {
        name: `Template ${Date.now()}`,
        status: 'active',
        acknowledgementText: 'Test acknowledgement',
        sections: [
          {
            title: 'Site safety',
            content: 'Placeholder',
            questions: [
              {
                question: 'Induction complete?',
                type: 'yes-no',
                required: true,
                correctAnswer: 'yes',
              },
            ],
          },
        ],
      },
    })

    const draft = await payload.create({
      collection: 'project-swms',
      data: {
        title: 'Test SWMS',
        project: project.id,
        sourceTemplate: template.id,
        status: 'draft',
        acknowledgementText: 'Test acknowledgement',
      },
    })

    expect(draft.publicToken).toBeTruthy()
    expect(draft.sections?.[0]?.title).toBe('Site safety')

    await payload.update({
      collection: 'project-swms',
      id: draft.id,
      data: { status: 'active' },
    })

    const active = await payload.findByID({
      collection: 'project-swms',
      id: draft.id,
    })

    const firstVersionID =
      typeof active.currentVersion === 'object' ? active.currentVersion?.id : active.currentVersion
    expect(firstVersionID).toBeTruthy()

    const firstVersion = await payload.findByID({
      collection: 'swms-versions',
      id: firstVersionID as number,
    })
    expect(firstVersion.status).toBe('published')
    expect(firstVersion.versionLabel).toBe('v1.0')

    await expect(
      payload.update({
        collection: 'swms-versions',
        id: firstVersion.id,
        data: {
          acknowledgementText: 'Changed after signing',
        },
      }),
    ).rejects.toThrow(/immutable/i)

    const unchanged = await payload.findByID({
      collection: 'swms-versions',
      id: firstVersion.id,
    })
    expect(unchanged.acknowledgementText).toBe('Test acknowledgement')

    await payload.update({
      collection: 'project-swms',
      id: draft.id,
      data: {
        acknowledgementText: 'Updated acknowledgement',
      },
    })

    const versions = await payload.find({
      collection: 'swms-versions',
      sort: 'createdAt',
      where: { projectSwms: { equals: draft.id } },
    })
    expect(versions.totalDocs).toBe(2)
    expect(versions.docs[0]?.status).toBe('superseded')
    expect(versions.docs[0]?.acknowledgementText).toBe('Test acknowledgement')
    expect(versions.docs[1]?.status).toBe('published')
    expect(versions.docs[1]?.acknowledgementText).toBe('Updated acknowledgement')

    const refreshed = await payload.findByID({
      collection: 'project-swms',
      id: draft.id,
    })
    expect(refreshed.publicToken).toBe(draft.publicToken)
  })
})
