'use client'

import { useField } from '@payloadcms/ui'
import React from 'react'

type SignaturePreviewFieldProps = {
  path: string
}

export default function SignaturePreviewField({ path }: SignaturePreviewFieldProps) {
  const { value } = useField<string>({ path })
  const signature = typeof value === 'string' ? value : ''

  if (!signature.startsWith('data:image/')) {
    return <p>No signature captured.</p>
  }

  return (
    <div>
      <p style={{ marginBottom: '8px' }}>
        <strong>Signature</strong>
      </p>
      {/* Stored signature data URL. Not a remote image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Worker signature"
        src={signature}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#fff',
          border: '1px solid #e5e5e5',
        }}
      />
    </div>
  )
}
