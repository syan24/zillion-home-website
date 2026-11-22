'use client'

import { SwmsReviewDialog } from '@/components/SWMS/SwmsReviewDialog'
import type { WorkerSwmsDocument } from '@/lib/swms/loadWorkerSWMS'
import { tradeLabel } from '@/lib/swms/trades'
import { Check, ChevronRight, FileText } from 'lucide-react'
import React, { useState } from 'react'

export function SwmsDocumentList({
  token,
  documents,
  mode,
  confirmed,
  onConfirmed,
}: {
  token: string
  documents: WorkerSwmsDocument[]
  mode: 'confirm' | 'browse'
  confirmed?: Record<string, number>
  onConfirmed?: (accessToken: string, fileVersion: number) => void
}) {
  const [openToken, setOpenToken] = useState<string | null>(null)
  const open = documents.find((document) => document.accessToken === openToken) ?? null
  const nextIndex =
    mode === 'confirm'
      ? documents.findIndex((document) => confirmed?.[document.accessToken] !== document.fileVersion)
      : -1

  return (
    <>
      <ul className="space-y-3">
        {documents.map((document, index) => {
          const done = mode === 'confirm' && confirmed?.[document.accessToken] === document.fileVersion
          const locked = mode === 'confirm' && nextIndex >= 0 && index > nextIndex
          return (
            <li key={document.accessToken}>
              <button
                type="button"
                disabled={locked}
                className="flex w-full items-center gap-3 rounded-lg border border-border bg-white px-4 py-4 text-left disabled:opacity-40"
                onClick={() => setOpenToken(document.accessToken)}
              >
                <FileText className="h-5 w-5 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{document.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {document.versionLabel}
                    {' · '}
                    {document.trades.map((trade) => tradeLabel(trade, 'en')).join(', ')}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {document.trades.map((trade) => tradeLabel(trade, 'zh')).join('、')}
                  </span>
                </span>
                {done ? <Check className="h-4 w-4" aria-label="Confirmed" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />}
              </button>
            </li>
          )
        })}
      </ul>
      {open ? (
        <SwmsReviewDialog
          title={open.title}
          fileUrl={`/swms/${token}/files/${open.accessToken}`}
          mode={mode === 'confirm' && confirmed?.[open.accessToken] === open.fileVersion ? 'browse' : mode}
          onClose={() => setOpenToken(null)}
          onConfirm={() => {
            onConfirmed?.(open.accessToken, open.fileVersion)
            setOpenToken(null)
          }}
        />
      ) : null}
    </>
  )
}
