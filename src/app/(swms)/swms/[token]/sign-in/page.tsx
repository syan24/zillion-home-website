import type { Metadata } from 'next'

import { SignInOutForm } from '@/components/SWMS/SignInOutForm'
import { loadWorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { notFound } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ token: string }> }

export const metadata: Metadata = { title: 'Sign-in / Out' }

export default async function SignInPage({ params }: Args) {
  const { token } = await params
  const swms = await loadWorkerSWMS(token)
  if (!swms) notFound()
  return <SignInOutForm swms={swms} />
}
