'use client'

import { submitSiteReport } from '@/app/(swms)/swms/actions'
import { BackToMenu } from '@/components/SWMS/SignInOutForm'
import { Bilingual } from '@/components/SWMS/Bilingual'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { WorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { reportKindLabel, type ReportKind } from '@/lib/swms/siteSafety'
import { useStoredWorkerIdentity, writeWorkerIdentity } from '@/lib/swms/workerSession'
import React, { useState } from 'react'

export function SiteReportForm({ swms, kind }: { swms: WorkerSWMS; kind: ReportKind }) {
  const copy = reportKindLabel(kind)
  const stored = useStoredWorkerIdentity(swms.token)
  const [name, setName] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [occurredAt, setOccurredAt] = useState(localNow)
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [pending, setPending] = useState(false)
  const nameValue = name ?? stored?.name ?? ''
  const phoneValue = phone ?? stored?.phone ?? ''

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError(null)
    writeWorkerIdentity(swms.token, { name: nameValue, phone: phoneValue })
    const data = new FormData(event.currentTarget)
    data.set('token', swms.token)
    data.set('kind', kind)
    data.set('name', nameValue)
    data.set('phone', phoneValue)
    data.set('description', description)
    const parsed = occurredAt ? new Date(occurredAt) : new Date()
    data.set('occurredAt', Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString())
    const result = await submitSiteReport(data)
    setPending(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setDone(true)
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <BackToMenu token={swms.token} />
      <div>
        <h1 className="font-serif text-3xl">
          <Bilingual en={copy.en} zh={copy.zh} />
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {swms.projectName}
          <span className="mt-1 block">{swms.projectAddress}</span>
        </p>
      </div>
      {done ? (
        <p className="rounded-md border border-border bg-white px-3 py-3 text-sm" role="status">
          Saved. A supervisor can read this in the site safety reports. 已保存，主管可在后台查看。
        </p>
      ) : (
        <>
          <Field en="Full name" zh="姓名">
            <Input className="h-12 bg-white" value={nameValue} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
          </Field>
          <Field en="Phone" zh="电话">
            <Input className="h-12 bg-white" value={phoneValue} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" required />
          </Field>
          <Field en="Time" zh="时间">
            <Input className="h-12 bg-white" type="datetime-local" value={occurredAt} onChange={(event) => setOccurredAt(event.target.value)} required />
          </Field>
          <Field en="Short description" zh="简短说明">
            <textarea
              className="min-h-28 w-full rounded-md border border-input bg-white px-3 py-3 text-base outline-none"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </Field>
          <Field en="Photo / attachment" zh="照片 / 附件">
            <Input className="h-12 bg-white" name="attachment" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" />
          </Field>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" variant="enquiry" className="h-12 w-full" disabled={pending}>
            {pending ? 'Saving…' : 'Submit 提交'}
          </Button>
        </>
      )}
    </form>
  )
}

function Field({ en, zh, children }: { en: string; zh: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <Bilingual en={en} zh={zh} className="text-sm font-medium" />
      {children}
    </label>
  )
}

function localNow(): string {
  const date = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
