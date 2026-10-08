import Link from 'next/link'
import React from 'react'

export default function SWMSNotFound() {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-white p-5">
      <h1 className="font-serif text-3xl">SWMS not available</h1>
      <p className="text-sm text-muted-foreground">
        This link is invalid, or the SWMS is not active. Ask your supervisor for a current QR code,
        or choose a project from the list.
      </p>
      <Link href="/swms" className="inline-flex h-12 items-center text-sm underline">
        Choose a project
      </Link>
    </div>
  )
}
