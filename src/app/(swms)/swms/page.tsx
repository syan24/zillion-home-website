import type { Metadata } from 'next'

import { ProjectPicker } from '@/components/SWMS/ProjectPicker'
import { listActiveWorkerProjects } from '@/lib/swms/loadWorkerSWMS'
import React from 'react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Choose a project | SWMS',
}

export default async function SWMSEntryPage() {
  const projects = await listActiveWorkerProjects()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
          Site Work Method Statement
        </p>
        <h1 className="mt-2 font-serif text-4xl">SWMS</h1>
        <p className="mt-3 text-sm leading-relaxed text-foreground-soft">
          Scan the project QR code, or choose an active project below. Project name and address come
          from the project record. Workers do not type an address.
        </p>
      </div>
      <ProjectPicker projects={projects} />
    </div>
  )
}
