'use client'

import { submitSiteAttendance, submitSwmsReconfirm } from '@/app/(swms)/swms/actions'
import { BackToMenu } from '@/components/SWMS/SignInOutForm'
import { SwmsDocumentList } from '@/components/SWMS/SwmsDocumentList'
import { Button } from '@/components/ui/button'
import type { WorkerSwmsDocument } from '@/lib/swms/loadWorkerSWMS'
import { siteSafetyHref } from '@/lib/swms/siteSafety'
import { useStoredWorkerIdentity, writeWorkerIdentity } from '@/lib/swms/workerSession'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export function ReconfirmSwms({ token }: { token: string }) {
  const router = useRouter()
  const stored = useStoredWorkerIdentity(token)
  const [name, setName] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [pendingDocs, setPendingDocs] = useState<WorkerSwmsDocument[] | null>(null)
  const [confirmed, setConfirmed] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const nameValue = name ?? stored?.name ?? ''
  const phoneValue = phone ?? stored?.phone ?? ''

  const loadPending = async (event?: React.FormEvent) => {
    event?.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    writeWorkerIdentity(token, { name: nameValue, phone: phoneValue })
    const result = await submitSiteAttendance({ token, name: nameValue, phone: phoneValue, direction: 'in' })
    setBusy(false)
    if (!result.ok && result.code === 'reconfirm-required') {
      setPendingDocs((result.pending ?? []).map((document) => ({ ...document })))
      return
    }
    if (!result.ok && result.code === 'induction-required') {
      router.push(siteSafetyHref(token, 'induction'))
      return
    }
    if (result.ok) {
      setDone(true)
      return
    }
    setError(result.error)
  }

  const finish = async () => {
    if (!pendingDocs || busy) return
    setBusy(true)
    setError(null)
    const result = await submitSwmsReconfirm({
      token,
      name: nameValue,
      phone: phoneValue,
      confirmed: pendingDocs.map((document) => ({
        accessToken: document.accessToken,
        fileVersion: confirmed[document.accessToken] ?? document.fileVersion,
      })),
    })
    if (!result.ok) {
      setBusy(false)
      setError(result.error)
      return
    }
    const signIn = await submitSiteAttendance({ token, name: nameValue, phone: phoneValue, direction: 'in' })
    setBusy(false)
    if (!signIn.ok) {
      setError(signIn.error)
      return
    }
    setDone(true)
  }

  const ready = pendingDocs?.every((document) => confirmed[document.accessToken] === document.fileVersion) ?? false

  return (
    <div className="space-y-5">
      <BackToMenu token={token} />
      <div>
        <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">Updated SWMS 更新的 SWMS</p>
        <h1 className="mt-2 font-serif text-3xl">Review the changed documents</h1>
        <p className="mt-2 text-sm text-muted-foreground">确认变更后的文件即可，无需重新填写整套问卷。</p>
      </div>
      {done ? (
        <div className="space-y-4 rounded-lg border border-border bg-white p-5">
          <p>Signed in. The updated SWMS is confirmed. 已签到，更新的 SWMS 已确认。</p>
          <Button type="button" variant="enquiry" className="h-12 w-full" onClick={() => router.push(siteSafetyHref(token))}>
            Back to menu 返回菜单
          </Button>
        </div>
      ) : pendingDocs === null ? (
        <form className="space-y-4" onSubmit={loadPending}>
          <label className="block space-y-2 text-sm font-medium">
            Full name 姓名
            <input className="h-12 w-full rounded-md border border-input bg-white px-3 font-normal" value={nameValue} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            Phone 电话
            <input className="h-12 w-full rounded-md border border-input bg-white px-3 font-normal" value={phoneValue} onChange={(event) => setPhone(event.target.value)} inputMode="tel" required />
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" variant="enquiry" className="h-12 w-full" disabled={busy}>
            Continue 继续
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <SwmsDocumentList
            token={token}
            documents={pendingDocs}
            mode="confirm"
            confirmed={confirmed}
            onConfirmed={(accessToken, fileVersion) => setConfirmed((current) => ({ ...current, [accessToken]: fileVersion }))}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="button" variant="enquiry" className="h-12 w-full" disabled={!ready || busy} onClick={() => void finish()}>
            {busy ? 'Saving…' : 'Confirm and sign in 确认并签到'}
          </Button>
        </div>
      )}
    </div>
  )
}
