'use client'

import { submitSiteAttendance } from '@/app/(swms)/swms/actions'
import { Bilingual } from '@/components/SWMS/Bilingual'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { WorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { siteSafetyHref } from '@/lib/swms/siteSafety'
import { useStoredWorkerIdentity, writeWorkerIdentity } from '@/lib/swms/workerSession'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export function SignInOutForm({ swms }: { swms: WorkerSWMS }) {
  const router = useRouter()
  const stored = useStoredWorkerIdentity(swms.token)
  const [name, setName] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState<'in' | 'out' | null>(null)
  const nameValue = name ?? stored?.name ?? ''
  const phoneValue = phone ?? stored?.phone ?? ''

  const submit = async (direction: 'in' | 'out') => {
    if (pending) return
    setPending(direction)
    setMessage(null)
    writeWorkerIdentity(swms.token, { name: nameValue, phone: phoneValue })
    const result = await submitSiteAttendance({
      token: swms.token,
      name: nameValue,
      phone: phoneValue,
      direction,
    })
    setPending(null)
    if (!result.ok && result.code === 'induction-required') {
      router.push(siteSafetyHref(swms.token, 'induction'))
      return
    }
    if (!result.ok && result.code === 'reconfirm-required') {
      router.push(siteSafetyHref(swms.token, 'review'))
      return
    }
    setMessage(result.ok ? successCopy(result.code, result.recordedAt) : result.error)
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        void submit('in')
      }}
    >
      <BackToMenu token={swms.token} />
      <div>
        <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
          <Bilingual en="Sign-in / Out" zh="签到 / 签退" />
        </p>
        <h1 className="mt-2 font-serif text-3xl">{swms.projectName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{swms.projectAddress}</p>
      </div>
      <label className="block space-y-2">
        <Bilingual en="Full name" zh="姓名" className="text-sm font-medium" />
        <Input className="h-12 bg-white" value={nameValue} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
      </label>
      <label className="block space-y-2">
        <Bilingual en="Phone" zh="电话" className="text-sm font-medium" />
        <Input className="h-12 bg-white" value={phoneValue} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" required />
      </label>
      <p className="text-sm text-muted-foreground">
        First visit: complete induction. Later visits use this name and phone. 首次进场需完成入场培训，之后凭姓名和电话签到。
      </p>
      {message ? (
        <p className="rounded-md border border-border bg-white px-3 py-3 text-sm" role="status">
          {message}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <Button type="submit" variant="enquiry" className="h-12" disabled={pending !== null}>
          {pending === 'in' ? 'Signing in…' : 'Sign in 签到'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12"
          disabled={pending !== null}
          onClick={() => void submit('out')}
        >
          {pending === 'out' ? 'Signing out…' : 'Sign out 签退'}
        </Button>
      </div>
    </form>
  )
}

function successCopy(code: 'signed-in' | 'signed-out' | 'already-in', recordedAt: string): string {
  const time = formatSydney(recordedAt)
  if (code === 'signed-out') return `Signed out at ${time}. 已签退 ${time}。`
  if (code === 'already-in') return `Already signed in at ${time}. 已于 ${time} 签到。`
  return `Signed in at ${time}. 已签到 ${time}。`
}

function formatSydney(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Australia/Sydney',
  }).format(date)
}

export function BackToMenu({ token }: { token: string }) {
  return (
    <Link href={siteSafetyHref(token)} className="inline-flex items-center gap-1 text-sm">
      <ChevronLeft className="h-4 w-4" aria-hidden />
      <span>Site Safety Menu 现场安全菜单</span>
    </Link>
  )
}
