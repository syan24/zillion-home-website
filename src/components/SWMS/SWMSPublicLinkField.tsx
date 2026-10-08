'use client'

import { useFormFields } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

export default function SWMSPublicLinkField() {
  const token = useFormFields(([fields]) => fields.publicToken?.value) as string | undefined
  const status = useFormFields(([fields]) => fields.status?.value) as string | undefined
  const [qrSrc, setQrSrc] = useState('')
  const [copied, setCopied] = useState(false)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = token && origin ? `${origin}/swms/${token}` : ''

  useEffect(() => {
    if (!url) return
    let cancelled = false
    import('qrcode')
      .then((mod) =>
        mod.default.toDataURL(url, {
          margin: 1,
          width: 280,
          color: { dark: '#15130e', light: '#ffffff' },
        }),
      )
      .then((dataUrl) => {
        if (!cancelled) setQrSrc(dataUrl)
      })
      .catch(() => {
        if (!cancelled) setQrSrc('')
      })
    return () => {
      cancelled = true
    }
  }, [url])

  if (!url) {
    return <p>Save this Project SWMS to generate the worker link and QR code.</p>
  }

  return (
    <div style={{ display: 'grid', gap: '12px', maxWidth: '420px' }}>
      <div>
        <strong>Worker link</strong>
        <p style={{ wordBreak: 'break-all', margin: '8px 0' }}>{url}</p>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url)
              setCopied(true)
            } catch {
              setCopied(false)
            }
          }}
        >
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
      {status !== 'active' ? (
        <p>
          Set status to Active before printing. Workers can open this link only while the SWMS is
          active.
        </p>
      ) : null}
      {qrSrc ? (
        // Data URL generated locally from the worker link.
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="QR code for the worker SWMS link" src={qrSrc} width={180} height={180} />
      ) : null}
    </div>
  )
}
