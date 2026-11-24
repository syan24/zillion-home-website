import { Bilingual } from '@/components/SWMS/Bilingual'
import { siteSafetyHref, SITE_SAFETY_MENU } from '@/lib/swms/siteSafety'
import type { WorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { ChevronRight, ClipboardCheck, FileText, LogIn, MapPin, MessageSquare, ShieldAlert, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ICONS = {
  'sign-in': LogIn,
  induction: ClipboardCheck,
  documents: FileText,
  incident: TriangleAlert,
  hazard: ShieldAlert,
  toolbox: MessageSquare,
} as const

export function SiteSafetyMenu({ swms }: { swms: WorkerSWMS }) {
  const chineseName = swms.projectNameZh && swms.projectNameZh !== swms.projectName ? swms.projectNameZh : ''

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-white p-5">
        <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
          Current project
          <span className="mt-1 block normal-case tracking-normal">当前项目</span>
        </p>
        <h1 className="mt-3 font-serif text-3xl">{swms.projectName}</h1>
        {chineseName ? <p className="mt-1 text-sm text-muted-foreground">{chineseName}</p> : null}
        <p className="mt-3 text-sm">
          {swms.title}
          <span className="text-muted-foreground"> · {swms.versionLabel}</span>
        </p>
        <p className="mt-3 flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{swms.projectAddress}</span>
        </p>
      </div>

      <div>
        <h2 className="font-serif text-2xl">
          Site Safety Menu
          <span className="mt-1 block text-base text-muted-foreground">现场安全菜单</span>
        </h2>
      </div>

      <ul className="space-y-3">
        {SITE_SAFETY_MENU.map((item) => {
          const Icon = ICONS[item.slug]
          return (
            <li key={item.slug}>
              <Link
                href={siteSafetyHref(swms.token, item.slug)}
                className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-4 transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <Bilingual en={item.en} zh={item.zh} className="min-w-0 flex-1 text-sm font-medium" />
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
