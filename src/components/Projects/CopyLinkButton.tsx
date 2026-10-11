'use client'

import React, { useState } from 'react'

import { cn } from '@/utilities/ui'

export function CopyLinkButton({
  path,
  label,
  copiedLabel,
  className,
}: {
  path: string
  label: string
  copiedLabel: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded border border-border px-4 py-2 text-sm transition-colors hover:border-accent',
        className,
      )}
      onClick={async () => {
        const url = new URL(path, window.location.origin).toString()
        try {
          await navigator.clipboard.writeText(url)
        } catch {
          window.prompt(label, url)
        }
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? copiedLabel : label}
    </button>
  )
}
