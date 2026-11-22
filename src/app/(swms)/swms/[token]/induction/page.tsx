import type { Metadata } from 'next'

import { SWMSWizard } from '@/components/SWMS/SWMSWizard'
import { loadWorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { notFound } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ token: string }> }

export const metadata: Metadata = { title: 'Site Induction' }

export default async function InductionPage({ params }: Args) {
  const { token } = await params
  const swms = await loadWorkerSWMS(token)
  if (!swms) notFound()
  return <SWMSWizard swms={swms} />
}
