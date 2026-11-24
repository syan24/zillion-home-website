import type { Metadata } from 'next'

import { BackToMenu } from '@/components/SWMS/SignInOutForm'
import { SwmsDocumentList } from '@/components/SWMS/SwmsDocumentList'
import { Bilingual } from '@/components/SWMS/Bilingual'
import { loadWorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { notFound } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ token: string }> }

export const metadata: Metadata = { title: 'SWMS & Safety Documents' }

export default async function DocumentsPage({ params }: Args) {
  const { token } = await params
  const swms = await loadWorkerSWMS(token)
  if (!swms) notFound()

  return (
    <div className="space-y-5">
      <BackToMenu token={swms.token} />
      <div>
        <h1 className="font-serif text-3xl">
          <Bilingual en="SWMS & Safety Documents" zh="SWMS 与安全文件" />
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {swms.projectName}
          {swms.projectNameZh && swms.projectNameZh !== swms.projectName ? (
            <span className="mt-1 block">{swms.projectNameZh}</span>
          ) : null}
          <span className="mt-1 block">
            {swms.title}
            <span> · {swms.versionLabel}</span>
          </span>
          <span className="mt-1 block">{swms.projectAddress}</span>
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Browse the files for this project. Induction review is separate. 此处可浏览本项目文件，与入场培训中的确认分开。
        </p>
      </div>
      {swms.documents.length === 0 ? (
        <p className="rounded-lg border border-border bg-white px-4 py-6 text-sm">
          No SWMS files have been uploaded for this project. 本项目尚未上传 SWMS 文件。
        </p>
      ) : (
        <SwmsDocumentList token={swms.token} documents={swms.documents} mode="browse" />
      )}
    </div>
  )
}
