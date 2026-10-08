import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { relationID } from '@/lib/swms/relationID'
import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    token: string
  }>
  searchParams: Promise<{
    ref?: string
  }>
}

export const metadata: Metadata = {
  title: 'SWMS submitted',
}

export default async function SWMSCompletePage({ params, searchParams }: Args) {
  const { token } = await params
  const { ref } = await searchParams
  if (!ref) notFound()

  const payload = await getPayload({ config: configPromise })
  const found = await payload.find({
    collection: 'swms-acknowledgements',
    depth: 2,
    limit: 1,
    overrideAccess: true,
    where: {
      submissionRef: { equals: ref },
    },
  })

  const record = found.docs[0]
  const projectSWMS = record?.projectSwms
  const tokenMatches =
    projectSWMS && typeof projectSWMS === 'object' && projectSWMS.publicToken === token
  if (!record || !tokenMatches) notFound()

  const project = record.project
  const projectName = project && typeof project === 'object' ? project.title : 'Project'
  const projectAddress = project && typeof project === 'object' ? project.address : ''
  const version = record.swmsVersion
  const versionLabel = version && typeof version === 'object' ? version.versionLabel : ''

  return (
    <div className="space-y-5 rounded-lg border border-border bg-white p-5">
      <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">Submitted</p>
      <h1 className="font-serif text-4xl">SWMS signed</h1>
      <p className="text-sm leading-relaxed">
        The acknowledgement is stored against this project and SWMS version. You can close this
        page.
      </p>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Reference</dt>
          <dd className="font-medium">{record.submissionRef}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Signed</dt>
          <dd>{formatSignedAt(record.signedAt)} (Sydney time)</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Project</dt>
          <dd>
            {projectName}
            {projectAddress ? <span className="mt-1 block">{projectAddress}</span> : null}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">SWMS version</dt>
          <dd>{versionLabel || relationID(version) || 'Recorded'}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Name</dt>
          <dd>{record.workerName}</dd>
        </div>
      </dl>
      {record.signature?.startsWith('data:image/') ? (
        // The worker's own signature, loaded for this unguessable reference.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="Submitted signature"
          src={record.signature}
          className="w-full rounded-md border border-border bg-white"
        />
      ) : null}
      <Link href="/swms" className="inline-flex text-sm underline">
        Back to project list
      </Link>
    </div>
  )
}

function formatSignedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Australia/Sydney',
  }).format(date)
}
