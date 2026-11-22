import type { Metadata } from 'next'

import { SiteSafetyMenu } from '@/components/SWMS/SiteSafetyMenu'
import { loadWorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { notFound } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { token } = await params
  const swms = await loadWorkerSWMS(token)
  if (!swms) return { title: 'Site safety' }
  return { title: `${swms.projectName} | Site safety` }
}

export default async function SiteSafetyPage({ params }: Args) {
  const { token } = await params
  const swms = await loadWorkerSWMS(token)
  if (!swms) notFound()
  return <SiteSafetyMenu swms={swms} />
}
