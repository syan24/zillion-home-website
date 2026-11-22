import type { Metadata } from 'next'

import { SiteReportForm } from '@/components/SWMS/SiteReportForm'
import { loadWorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import type { ReportKind } from '@/lib/swms/siteSafety'
import { notFound } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ token: string }> }

function reportPage(kind: ReportKind, title: string) {
  async function Page({ params }: Args) {
    const { token } = await params
    const swms = await loadWorkerSWMS(token)
    if (!swms) notFound()
    return <SiteReportForm swms={swms} kind={kind} />
  }
  return { Page, metadata: { title } satisfies Metadata }
}

export const incident = reportPage('incident', 'Incident Report')
export const hazard = reportPage('hazard', 'Hazard Identification')
export const toolbox = reportPage('toolbox', 'Toolbox Talk')
