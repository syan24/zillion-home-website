import { questionKey, type SwmsSectionSnapshot } from '@/lib/swms/content'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const SIGNATURE_PATTERN = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/

export type WorkerDetailsInput = {
  workerName: string
  workerCompany: string
  workerPhone: string
  workerTrade: string
}

type Ok<T> = { ok: true; value: T }
type Err = { ok: false; error: string }

export function validateClientSubmissionId(value: unknown): Ok<string> | Err {
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
    return { ok: false, error: 'The submission could not be verified. Please try again.' }
  }
  return { ok: true, value: value.toLowerCase() }
}

export function validateWorkerDetails(input: {
  workerName: unknown
  workerCompany: unknown
  workerPhone: unknown
  workerTrade: unknown
}): Ok<WorkerDetailsInput> | Err {
  const workerName = cleanText(input.workerName, 120)
  const workerCompany = cleanText(input.workerCompany, 160)
  const workerPhone = cleanText(input.workerPhone, 40)
  const workerTrade = cleanText(input.workerTrade, 80)

  if (workerName.length < 2) {
    return { ok: false, error: 'Enter the worker’s full name.' }
  }
  if (workerPhone && !/^[0-9+().\-\s]+$/.test(workerPhone)) {
    return { ok: false, error: 'Enter a valid contact number or leave it blank.' }
  }

  return {
    ok: true,
    value: { workerName, workerCompany, workerPhone, workerTrade },
  }
}

export function validateResponses(
  sections: SwmsSectionSnapshot[],
  responses: unknown,
): Ok<Record<string, string>> | Err {
  if (!responses || typeof responses !== 'object' || Array.isArray(responses)) {
    return { ok: false, error: 'Answer the SWMS questions before continuing.' }
  }

  const input = responses as Record<string, unknown>
  const clean: Record<string, string> = {}

  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex += 1) {
    const section = sections[sectionIndex]
    if (!section) continue

    for (let questionIndex = 0; questionIndex < section.questions.length; questionIndex += 1) {
      const question = section.questions[questionIndex]
      if (!question) continue
      const key = questionKey(sectionIndex, questionIndex)
      const raw = input[key]
      const value = typeof raw === 'string' ? raw.trim() : ''

      if (!value) {
        if (question.required) {
          return { ok: false, error: `Please answer: ${question.question}` }
        }
        continue
      }

      const allowed =
        question.type === 'yes-no-na'
          ? ['yes', 'no', 'na']
          : question.type === 'acknowledgement'
            ? ['accepted']
            : ['yes', 'no']

      if (!allowed.includes(value)) {
        return { ok: false, error: `Please answer: ${question.question}` }
      }

      clean[key] = value
    }
  }

  return { ok: true, value: clean }
}

export function validateSignature(signature: unknown): Ok<string> | Err {
  if (typeof signature !== 'string') {
    return { ok: false, error: 'Add your signature before submitting.' }
  }
  const value = signature.trim()
  if (value.length < 100 || value.length > 500_000 || !SIGNATURE_PATTERN.test(value)) {
    return { ok: false, error: 'Add your signature before submitting.' }
  }
  return { ok: true, value }
}

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.replace(/\s+/g, ' ').trim()
  if (!trimmed || CONTROL_CHARS.test(trimmed)) return ''
  return trimmed.slice(0, maxLength)
}
