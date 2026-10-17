'use client'

import { useFormFields } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

import { relationID } from '@/lib/swms/relationID'
import { responseRows, type ResponseRow } from '@/lib/swms/responseDisplay'

type LoadState = 'loading' | 'ready' | 'missing'

export default function AcknowledgementResponsesField() {
  const responses = useFormFields(([fields]) => fields.responses?.value)
  const swmsVersion = useFormFields(([fields]) => fields.swmsVersion?.value)
  const versionID = relationID(swmsVersion)
  const embedded = sectionsFrom(swmsVersion)
  const [loaded, setLoaded] = useState<{ id: number; sections: unknown } | null>(null)
  const [failedId, setFailedId] = useState<number | null>(null)

  useEffect(() => {
    if (embedded || versionID == null) return

    const controller = new AbortController()
    const id = versionID
    fetch(`/api/swms-versions/${id}?depth=0`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('version unavailable')
        return response.json() as Promise<{ sections?: unknown }>
      })
      .then((doc) => {
        setLoaded({ id, sections: doc.sections ?? null })
        setFailedId((current) => (current === id ? null : current))
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setFailedId(id)
      })

    return () => controller.abort()
  }, [embedded, versionID])

  const loadedForVersion = loaded?.id === versionID ? loaded : null
  const state: LoadState = embedded
    ? 'ready'
    : versionID == null || failedId === versionID
      ? 'missing'
      : loadedForVersion
        ? 'ready'
        : 'loading'
  const sections = embedded ?? loadedForVersion?.sections ?? null
  const rows = responseRows(responses, state === 'ready' ? sections : null)
  const groups = groupRows(rows)

  return (
    <div>
      <p style={{ fontWeight: 600, marginBottom: '4px' }}>Question responses</p>
      <p style={{ marginBottom: '12px', marginTop: 0 }}>
        Each question is from the SWMS version this worker signed, with the answer they gave.
      </p>
      {state === 'loading' ? <p>Loading the signed questions.</p> : null}
      {state === 'missing' ? (
        <p>The signed version could not be loaded. Answers are listed with their stored keys.</p>
      ) : null}
      {rows.length === 0 ? <p>No question responses stored.</p> : null}
      {groups.map((group) => (
        <section key={group.title ?? 'stored'} style={{ marginBottom: '16px' }}>
          {group.title ? (
            <p style={{ fontWeight: 600, margin: '0 0 8px' }}>{group.title}</p>
          ) : null}
          <dl style={{ margin: 0 }}>
            {group.rows.map((row) => (
              <div key={row.key} style={{ marginBottom: '10px' }}>
                <dt style={{ margin: 0 }}>
                  {row.question ?? `Stored answer ${row.key}`}
                </dt>
                <dd style={{ margin: '2px 0 0' }}>{row.answerLabel}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}

function sectionsFrom(value: unknown): unknown {
  if (!value || typeof value !== 'object' || !('sections' in value)) return null
  const sections = (value as { sections?: unknown }).sections
  return Array.isArray(sections) ? sections : null
}

function groupRows(rows: ResponseRow[]): Array<{ title: string | null; rows: ResponseRow[] }> {
  const groups: Array<{ title: string | null; rows: ResponseRow[] }> = []
  for (const row of rows) {
    const title = row.sectionTitle
    const current = groups[groups.length - 1]
    if (current && current.title === title) {
      current.rows.push(row)
      continue
    }
    groups.push({ title, rows: [row] })
  }
  return groups
}
