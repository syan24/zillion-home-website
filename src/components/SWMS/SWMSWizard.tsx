'use client'

import { submitSWMSAcknowledgement } from '@/app/(swms)/swms/actions'
import { SignaturePad } from '@/components/SWMS/SignaturePad'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { countQuestions, questionKey, type SwmsQuestionSnapshot } from '@/lib/swms/content'
import type { WorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'

type Step = 'confirm' | 'questions' | 'details' | 'signature'

const STEPS: { id: Step; label: string }[] = [
  { id: 'confirm', label: 'Project / Address' },
  { id: 'questions', label: 'SWMS Questions' },
  { id: 'details', label: 'Worker Details' },
  { id: 'signature', label: 'Signature' },
]

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
  const [step, setStep] = useState<Step>('confirm')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [workerName, setWorkerName] = useState('')
  const [workerCompany, setWorkerCompany] = useState('')
  const [workerPhone, setWorkerPhone] = useState('')
  const [workerTrade, setWorkerTrade] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const previousRef = useSyncExternalStore(
    () => () => undefined,
    () => window.sessionStorage.getItem(`swms-last-ref:${swms.token}`),
    () => null,
  )

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

  const current = questions[questionIndex]
  const stepNumber = STEPS.findIndex((item) => item.id === step) + 1

  useEffect(() => {
    headingRef.current?.focus()
  }, [step, questionIndex])

  const goNextQuestion = () => {
    if (!current) return
    if (current.question.required && !responses[current.key]) {
      setError('Choose an answer to continue.')
      return
    }
    setError(null)
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1)
      return
    }
    setStep('details')
  }

  const submit = async () => {
    if (pending) return
    if (!accepted) {
      setError('Confirm the acknowledgement before submitting.')
      return
    }
    if (!signature) {
      setError('Add your signature before submitting.')
      return
    }
    if (workerName.trim().length < 2) {
      setError('Enter the worker’s full name.')
      setStep('details')
      return
    }

    setPending(true)
    setError(null)
    if (!submissionId.current) submissionId.current = crypto.randomUUID()

    const result = await submitSWMSAcknowledgement({
      token: swms.token,
      versionId: swms.versionId,
      clientSubmissionId: submissionId.current,
      responses,
      workerName,
      workerCompany,
      workerPhone,
      workerTrade,
      acknowledgementAccepted: true,
      signature,
    })

    if (!result.ok) {
      setPending(false)
      setError(result.error)
      if (result.code === 'version-changed') submissionId.current = null
      return
    }

    window.sessionStorage.setItem(`swms-last-ref:${swms.token}`, result.submissionRef)
    router.push(`/swms/${swms.token}/complete?ref=${encodeURIComponent(result.submissionRef)}`)
  }

  return (
    <div className="space-y-6">
      <ol className="grid grid-cols-4 gap-2" aria-label="SWMS progress">
        {STEPS.map((item, index) => {
          const active = item.id === step
          const complete = index < stepNumber - 1
          return (
            <li key={item.id} className="text-center">
              <span
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                  active || complete ? 'bg-accent text-white' : 'bg-white text-muted-foreground'
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`mt-1 block text-[11px] leading-tight ${active ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {item.label}
              </span>
            </li>
          )
        })}
      </ol>

      {previousRef && step === 'confirm' ? (
        <p className="rounded-md border border-border bg-white px-3 py-3 text-sm">
          A signature was submitted in this browser:{' '}
          <a
            className="underline"
            href={`/swms/${swms.token}/complete?ref=${encodeURIComponent(previousRef)}`}
          >
            {previousRef}
          </a>
          . Another worker can continue below.
        </p>
      ) : null}

      <section className="rounded-lg border border-border bg-white p-5 shadow-sm">
        {step === 'confirm' ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                Site Work Method Statement
              </p>
              <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-serif text-3xl outline-none">
                Confirm the project
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Check the project name and address, then start the SWMS. The address comes from the
                project record.
              </p>
            </div>
            <div className="rounded-md bg-background-warm p-4">
              <p className="text-lg font-medium">{swms.projectName}</p>
              <p className="mt-1 text-sm">{swms.projectAddress}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {swms.title} · {swms.versionLabel} · {countQuestions(swms.sections)} questions
              </p>
            </div>
            <Button
              type="button"
              variant="enquiry"
              className="h-12 w-full text-base"
              onClick={() => setStep('questions')}
            >
              Start SWMS
            </Button>
          </div>
        ) : null}

        {step === 'questions' && current ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                SWMS Questions · {questionIndex + 1} / {questions.length}
              </p>
              <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-serif text-3xl outline-none">
                {current.sectionTitle}
              </h1>
              {current.sectionContent ? (
                <p className="mt-2 text-sm text-muted-foreground">{current.sectionContent}</p>
              ) : null}
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
                  if (questionIndex === 0) setStep('confirm')
                  else setQuestionIndex((index) => index - 1)
                }}
              >
                Back
              </Button>
              <Button type="button" variant="enquiry" className="h-12" onClick={goNextQuestion}>
                Next
              </Button>
            </div>
          </div>
        ) : null}

        {step === 'details' ? (
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              if (workerName.trim().length < 2) {
                setError('Enter the worker’s full name.')
                return
              }
              setError(null)
              setStep('signature')
            }}
          >
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
                Worker Details
              </p>
              <h1 ref={headingRef} tabIndex={-1} className="mt-2 font-serif text-3xl outline-none">
                Your details
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {swms.projectName} · {swms.projectAddress}
              </p>
            </div>
            <Field label="Full name" required>
              <Input
                className="h-12 bg-white"
                value={workerName}
                onChange={(event) => setWorkerName(event.target.value)}
                autoComplete="name"
                required
              />
            </Field>
            <Field label="Company / employer">
              <Input
                className="h-12 bg-white"
                value={workerCompany}
                onChange={(event) => setWorkerCompany(event.target.value)}
                autoComplete="organization"
              />
            </Field>
            <Field label="Contact phone">
              <Input
                className="h-12 bg-white"
                value={workerPhone}
                onChange={(event) => setWorkerPhone(event.target.value)}
                autoComplete="tel"
                inputMode="tel"
              />
            </Field>
            <Field label="Trade / role">
              <Input
                className="h-12 bg-white"
                value={workerTrade}
                onChange={(event) => setWorkerTrade(event.target.value)}
              />
            </Field>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12"
                onClick={() => {
                  setError(null)
                  setStep('questions')
                  setQuestionIndex(Math.max(questions.length - 1, 0))
                }}
              >
                Back
              </Button>
              <Button type="submit" variant="enquiry" className="h-12">
                Next
              </Button>
            </div>
          </form>
        ) : null}

        {step === 'signature' ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">Signature</p>
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
              <span>I have read this SWMS and agree to follow it.</span>
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
                <span className="block text-muted-foreground">Name</span>
                {workerName || '—'}
              </p>
              <p>
                <span className="block text-muted-foreground">Date</span>
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
                  <button
                    type="button"
                    className="underline"
                    onClick={() => window.location.reload()}
                  >
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
                onClick={() => setStep('details')}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="default"
                className="h-12"
                disabled={pending}
                onClick={submit}
              >
                {pending ? 'Submitting…' : 'Submit SWMS'}
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
    <div className="space-y-2">
      <Label>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
    </div>
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
      <label
        className={`flex min-h-12 items-center gap-3 rounded-md border px-3 py-3 ${value === 'accepted' ? 'border-primary bg-background-warm' : 'border-border'}`}
      >
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={value === 'accepted'}
          onChange={(event) => onChange(event.target.checked ? 'accepted' : '')}
        />
        <span>I acknowledge</span>
      </label>
    )
  }

  const options =
    question.type === 'yes-no-na'
      ? [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'na', label: 'Not applicable' },
        ]
      : [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
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
