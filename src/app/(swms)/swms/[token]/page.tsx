import type { Metadata } from 'next'

import { SWMSWizard } from '@/components/SWMS/SWMSWizard'
import { loadWorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { notFound } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    token: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { token } = await params
  const swms = await loadWorkerSWMS(token)
  if (!swms) return { title: 'SWMS not available' }
  return { title: `${swms.projectName} | SWMS` }
}

export default async function SWMSTokenPage({ params }: Args) {
  const { token } = await params
  const swms = await loadWorkerSWMS(token)
  if (!swms) notFound()
  return <SWMSWizard swms={swms} />
}
