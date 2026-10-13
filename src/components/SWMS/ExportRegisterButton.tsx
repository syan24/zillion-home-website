'use client'

import { Button, useListQuery } from '@payloadcms/ui'
import React, { useState } from 'react'

export default function ExportRegisterButton() {
  const { query } = useListQuery()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const onClick = async () => {
    const params = new URLSearchParams()
    if (typeof query?.search === 'string' && query.search) params.set('search', query.search)
    appendSort(params, query?.sort)
    if (query?.where && Object.keys(query.where).length > 0) {
      appendValue(params, 'where', query.where)
    }
    const search = params.toString()
    const href = `/api/swms-acknowledgements/export${search ? `?${search}` : ''}`

    setPending(true)
    setError('')
    try {
      const response = await fetch(href, { credentials: 'include' })
      if (!response.ok) {
        setError('The register could not be exported. Check that you are still logged in.')
        return
      }
      const blob = await response.blob()
      const filename = filenameFrom(response.headers.get('content-disposition'))
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch {
      setError('The register could not be exported. Check your connection and try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
      }}
    >
      <Button buttonStyle="secondary" disabled={pending} onClick={onClick} size="small" type="button">
        {pending ? 'Exporting...' : 'Export CSV'}
      </Button>
      <span>Downloads every acknowledgement that matches the current filters and search.</span>
      {error ? <span>{error}</span> : null}
    </div>
  )
}

function filenameFrom(disposition: string | null): string {
  const match = disposition?.match(/filename="([^"]+)"/)
  return match?.[1] || 'swms-register.csv'
}

function appendSort(params: URLSearchParams, sort: unknown) {
  if (typeof sort === 'string' && sort) {
    params.set('sort', sort)
    return
  }
  if (Array.isArray(sort)) {
    const value = sort.filter((item) => typeof item === 'string' && item).join(',')
    if (value) params.set('sort', value)
  }
}

function appendValue(params: URLSearchParams, key: string, value: unknown) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => appendValue(params, `${key}[${index}]`, item))
    return
  }
  if (value && typeof value === 'object') {
    for (const [child, childValue] of Object.entries(value)) {
      appendValue(params, `${key}[${child}]`, childValue)
    }
    return
  }
  if (value == null) return
  params.append(key, String(value))
}
