'use client'

import { submitSWMSAcknowledgement } from '@/app/(swms)/swms/actions'
import { BackToMenu } from '@/components/SWMS/SignInOutForm'
import { Bilingual } from '@/components/SWMS/Bilingual'
import { SignaturePad } from '@/components/SWMS/SignaturePad'
import { SwmsDocumentList } from '@/components/SWMS/SwmsDocumentList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { questionKey, type SwmsQuestionSnapshot } from '@/lib/swms/content'
import type { WorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { documentsForTrades } from '@/lib/swms/siteSafety'
import { tradeLabel, type TradeValue } from '@/lib/swms/trades'
import { useStoredWorkerIdentity, writeWorkerIdentity } from '@/lib/swms/workerSession'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'

type Step = 'trades' | 'details' | 'review' | 'questions' | 'signature'

const PROGRESS = [
  { id: 'trades', en: 'Select Trade', zh: '选择工种' },
  { id: 'details', en: 'Your details', zh: '个人信息' },
  { id: 'review', en: 'Review SWMS', zh: '查阅 SWMS' },
  { id: 'sign', en: 'Induction', zh: '入场培训' },
] as const

type FlatQuestion = {
  key: string
  sectionTitle: string
  sectionContent: string
  question: SwmsQuestionSnapshot
}

export function SWMSWizard({ swms }: { swms: WorkerSWMS }) {
  const router = useRouter()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const submissionId = useRef<string | null>(null)
  const [step, setStep] = useState<Step>('trades')
  const [selected, setSelected] = useState<TradeValue[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const stored = useStoredWorkerIdentity(swms.token)
  const [workerName, setWorkerName] = useState<string | null>(null)
  const [workerCompany, setWorkerCompany] = useState('')
  const [workerPhone, setWorkerPhone] = useState<string | null>(null)
  const nameValue = workerName ?? stored?.name ?? ''
  const phoneValue = workerPhone ?? stored?.phone ?? ''
  const [confirmed, setConfirmed] = useState<Record<string, number>>({})
  const [accepted, setAccepted] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const questions = useMemo<FlatQuestion[]>(() => {
    const items: FlatQuestion[] = []
    swms.sections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, index) => {
        items.push({
          key: questionKey(sectionIndex, index),
          sectionTitle: section.title,
          sectionContent: section.content,
          question,
        })
      })
    })
    return items
  }, [swms.sections])

  const matching = useMemo(
    () => documentsForTrades(swms.documents, selected),
    [swms.documents, selected],
  )
  const reviewReady = matching.every((document) => confirmed[document.accessToken] === document.fileVersion)
  const current = questions[questionIndex]
  const progressIndex = step === 'trades' ? 0 : step === 'details' ? 1 : step === 'review' ? 2 : 3

  useEffect(() => {
    headingRef.current?.focus()
  }, [step, questionIndex])

  const toggleTrade = (trade: TradeValue) => {
    setSelected((currentTrades) =>
      currentTrades.includes(trade)
        ? currentTrades.filter((item) => item !== trade)
        : [...currentTrades, trade],
    )
    setError(null)
  }

  const goNextQuestion = () => {
    if (!current) {
      setStep('signature')
      return
    }
    if (current.question.required && !responses[current.key]) {
      setError('Choose an answer to continue. 请选择答案后继续。')
      return
    }
    setError(null)
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1)
      return
    }
    setStep('signature')
  }

  const submit = async () => {
    if (pending) return
    if (!accepted) {
      setError('Confirm the acknowledgement before submitting. 请先确认声明。')
      return
    }
    if (!signature) {
      setError('Add your signature before submitting. 请先签名。')
      return
    }
    setPending(true)
    setError(null)
    writeWorkerIdentity(swms.token, { name: nameValue, phone: phoneValue })
    if (!submissionId.current) submissionId.current = crypto.randomUUID()

    const result = await submitSWMSAcknowledgement({
      token: swms.token,
      versionId: swms.versionId,
      clientSubmissionId: submissionId.current,
      responses,
      workerName: nameValue,
      workerCompany,
      workerPhone: phoneValue,
      trades: selected,
      confirmed: matching.map((document) => ({
        accessToken: document.accessToken,
        fileVersion: document.fileVersion,
      })),
      acknowledgementAccepted: true,
      signature,
    })

    if (!result.ok) {
      setPending(false)
      setError(result.error)
      if (result.code === 'version-changed' || result.code === 'swms-version-changed') {
        submissionId.current = null
      }
      return
    }

    window.sessionStorage.setItem(`swms-last-ref:${swms.token}`, result.submissionRef)
    router.push(`/swms/${swms.token}/complete?ref=${encodeURIComponent(result.submissionRef)}`)
  }

  return (
    <div className="space-y-6">
      <BackToMenu token={swms.token} />
      <p className="text-sm">
        {swms.title}
        <span className="text-muted-foreground"> · {swms.versionLabel}</span>
      </p>
      <ol className="grid grid-cols-4 gap-2" aria-label="Site induction progress">
        {PROGRESS.map((item, index) => {
          const active = index === progressIndex
          const complete = index < progressIndex
          return (
            <li key={item.id} className="text-center">
              <span
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                  active || complete ? 'bg-accent text-accent-foreground' : 'bg-white text-muted-foreground'
                }`}
              >
                {index + 1}
              </span>
              <span className={`mt-1 block text-[11px] leading-tight ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {item.en}
                <span className="mt-0.5 block">{item.zh}</span>
              </span>
            </li>
          )
        })}
      </ol>

      <section className="rounded-lg border border-border bg-white p-5 shadow-sm">
        {step === 'trades' ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                Step 1 of 4 · 第 1 步，共 4 步
              </p>
              <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-serif text-3xl outline-none">
                <Bilingual en="Select Trade" zh="选择工种" />
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose every trade you will work in today. 请选择今天从事的全部工种。
              </p>
            </div>
            {swms.enabledTrades.length === 0 ? (
              <p className="text-sm">
                This project has no trades enabled yet. Ask the supervisor. 本项目尚未启用工种，请联系主管。
              </p>
            ) : (
              <ul className="space-y-3">
                {swms.enabledTrades.map((trade) => {
                  const checked = selected.includes(trade)
                  return (
                    <li key={trade}>
                      <label
                        className={`flex min-h-12 items-start gap-3 rounded-md border px-3 py-3 ${checked ? 'border-primary bg-background-warm' : 'border-border'}`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-5 w-5"
                          checked={checked}
                          onChange={() => toggleTrade(trade)}
                        />
                        <span>
                          <span className="block">{tradeLabel(trade, 'en')}</span>
                          <span className="mt-1 block text-sm text-muted-foreground">{tradeLabel(trade, 'zh')}</span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button
              type="button"
              variant="enquiry"
              className="h-12 w-full"
              disabled={selected.length === 0}
              onClick={() => {
                setError(null)
                setStep('details')
              }}
            >
              Next 下一步
            </Button>
          </div>
        ) : null}

        {step === 'details' ? (
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              if (nameValue.trim().length < 2) {
                setError('Enter the worker’s full name. 请填写姓名。')
                return
              }
              if (phoneValue.replace(/\D/g, '').length < 8) {
                setError('Enter a contact phone number. 请填写联系电话。')
                return
              }
              setError(null)
              writeWorkerIdentity(swms.token, { name: nameValue, phone: phoneValue })
              setStep('review')
            }}
          >
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                Step 2 of 4 · 第 2 步，共 4 步
              </p>
              <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-serif text-3xl outline-none">
                <Bilingual en="Your details" zh="个人信息" />
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {swms.projectName} · {swms.projectAddress}
              </p>
            </div>
            <Field label="Full name 姓名" required>
              <Input className="h-12 bg-white" value={nameValue} onChange={(event) => setWorkerName(event.target.value)} autoComplete="name" required />
            </Field>
            <Field label="Phone 电话" required>
              <Input className="h-12 bg-white" value={phoneValue} onChange={(event) => setWorkerPhone(event.target.value)} autoComplete="tel" inputMode="tel" required />
            </Field>
            <Field label="Company / employer 公司 / 雇主">
              <Input className="h-12 bg-white" value={workerCompany} onChange={(event) => setWorkerCompany(event.target.value)} autoComplete="organization" />
            </Field>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="h-12" onClick={() => setStep('trades')}>
                Back 返回
              </Button>
              <Button type="submit" variant="enquiry" className="h-12">
                Next 下一步
              </Button>
            </div>
          </form>
        ) : null}

        {step === 'review' ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                Step 3 of 4 · 第 3 步，共 4 步
              </p>
              <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-serif text-3xl outline-none">
                <Bilingual en="Review SWMS" zh="查阅 SWMS" />
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Review each SWMS for your trades, in order. 请按顺序确认与所选工种相关的每一份 SWMS。
              </p>
            </div>
            {matching.length === 0 ? (
              <p className="rounded-md bg-background-warm px-3 py-3 text-sm">
                No SWMS files match the selected trades. You can continue the induction. 所选工种暂无 SWMS 文件，可继续入场培训。
              </p>
            ) : (
              <SwmsDocumentList
                token={swms.token}
                documents={matching}
                mode="confirm"
                confirmed={confirmed}
                onConfirmed={(accessToken, fileVersion) =>
                  setConfirmed((currentConfirmed) => ({ ...currentConfirmed, [accessToken]: fileVersion }))
                }
              />
            )}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="h-12" onClick={() => setStep('details')}>
                Back 返回
              </Button>
              <Button
                type="button"
                variant="enquiry"
                className="h-12"
                disabled={!reviewReady}
                onClick={() => {
                  setError(null)
                  setQuestionIndex(0)
                  setStep(questions.length > 0 ? 'questions' : 'signature')
                }}
              >
                Next 下一步
              </Button>
            </div>
          </div>
        ) : null}

        {step === 'questions' && current ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                Site Induction · {questionIndex + 1} / {questions.length}
                <span className="mt-1 block normal-case tracking-normal">现场入场培训</span>
              </p>
              <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-serif text-3xl outline-none">
                {current.sectionTitle}
              </h1>
              {current.sectionContent ? <p className="mt-2 text-sm text-muted-foreground">{current.sectionContent}</p> : null}
            </div>
            <p className="text-lg leading-snug">{current.question.question}</p>
            <QuestionChoices
              question={current.question}
              value={responses[current.key] ?? ''}
              onChange={(value) => {
                setResponses((existing) => ({ ...existing, [current.key]: value }))
                setError(null)
              }}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12"
                onClick={() => {
                  setError(null)
                  if (questionIndex === 0) setStep('review')
                  else setQuestionIndex((index) => index - 1)
                }}
              >
                Back 返回
              </Button>
              <Button type="button" variant="enquiry" className="h-12" onClick={goNextQuestion}>
                Next 下一步
              </Button>
            </div>
          </div>
        ) : null}

        {step === 'signature' ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">Signature 签名</p>
              <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-serif text-3xl outline-none">
                Sign and submit
              </h1>
            </div>
            <p className="text-sm leading-relaxed">{swms.acknowledgementText}</p>
            <label className="flex items-start gap-3 rounded-md border border-border px-3 py-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5"
                checked={accepted}
                onChange={(event) => {
                  setAccepted(event.target.checked)
                  setError(null)
                }}
              />
              <span>I have read this induction and agree to follow it. 我已阅读本入场培训并同意遵守。</span>
            </label>
            <SignaturePad
              disabled={pending}
              onChange={(value) => {
                setSignature(value)
                setError(null)
              }}
            />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p>
                <span className="block text-muted-foreground">Name 姓名</span>
                {nameValue || '—'}
              </p>
              <p>
                <span className="block text-muted-foreground">Date 日期</span>
                {new Intl.DateTimeFormat('en-AU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'Australia/Sydney',
                }).format(new Date())}
              </p>
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}{' '}
                {error.includes('updated') ? (
                  <button type="button" className="underline" onClick={() => window.location.reload()}>
                    Reload the latest version
                  </button>
                ) : null}
              </p>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12"
                disabled={pending}
                onClick={() => {
                  setError(null)
                  if (questions.length === 0) setStep('review')
                  else {
                    setQuestionIndex(questions.length - 1)
                    setStep('questions')
                  }
                }}
              >
                Back 返回
              </Button>
              <Button type="button" variant="enquiry" className="h-12" disabled={pending} onClick={submit}>
                {pending ? 'Submitting…' : 'Submit 提交'}
              </Button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
      {children}
    </label>
  )
}

function QuestionChoices({
  question,
  value,
  onChange,
}: {
  question: SwmsQuestionSnapshot
  value: string
  onChange: (value: string) => void
}) {
  if (question.type === 'acknowledgement') {
    return (
      <label className={`flex min-h-12 items-center gap-3 rounded-md border px-3 py-3 ${value === 'accepted' ? 'border-primary bg-background-warm' : 'border-border'}`}>
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={value === 'accepted'}
          onChange={(event) => onChange(event.target.checked ? 'accepted' : '')}
        />
        <span>I acknowledge 我确认</span>
      </label>
    )
  }

  const options =
    question.type === 'yes-no-na'
      ? [
          { value: 'yes', label: 'Yes 是' },
          { value: 'no', label: 'No 否' },
          { value: 'na', label: 'Not applicable 不适用' },
        ]
      : [
          { value: 'yes', label: 'Yes 是' },
          { value: 'no', label: 'No 否' },
        ]

  return (
    <div className="grid gap-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex min-h-12 items-center gap-3 rounded-md border px-3 py-3 ${value === option.value ? 'border-primary bg-background-warm' : 'border-border'}`}
        >
          <input
            type="radio"
            name={question.question}
            className="h-5 w-5"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}
