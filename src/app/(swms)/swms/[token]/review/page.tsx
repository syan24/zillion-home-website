import type { Metadata } from 'next'

import { ReconfirmSwms } from '@/components/SWMS/ReconfirmSwms'
import { loadWorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { notFound } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ token: string }> }

export const metadata: Metadata = { title: 'Review updated SWMS' }

export default async function ReviewPage({ params }: Args) {
  const { token } = await params
  const swms = await loadWorkerSWMS(token)
  if (!swms) notFound()
  return <ReconfirmSwms token={swms.token} />
}
