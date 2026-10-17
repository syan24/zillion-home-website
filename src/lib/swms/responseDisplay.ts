import { questionKey, snapshotSections } from '@/lib/swms/content'

export type ResponseRow = {
  key: string
  sectionTitle: string | null
  question: string | null
  answerLabel: string
}

export function answerLabel(value: unknown): string {
  if (value === 'yes') return 'Yes'
  if (value === 'no') return 'No'
  if (value === 'na') return 'Not applicable'
  if (value === 'accepted') return 'Accepted'
  if (value == null || value === '') return 'No answer'
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return 'No answer'
}

/**
 * Question text comes from the signed SWMS version. Stored keys that are not on that
 * version stay visible so an answer is never dropped.
 */
export function responseRows(responses: unknown, sections: unknown): ResponseRow[] {
  const snapshot = snapshotSections(sections)
  const record = responseRecord(responses)
  const rows: ResponseRow[] = []
  const seen = new Set<string>()

  snapshot.forEach((section, sectionIndex) => {
    section.questions.forEach((question, questionIndex) => {
      const key = questionKey(sectionIndex, questionIndex)
      seen.add(key)
      rows.push({
        key,
        sectionTitle: section.title,
        question: question.question,
        answerLabel: answerLabel(record[key]),
      })
    })
  })

  for (const key of Object.keys(record).sort()) {
    if (seen.has(key)) continue
    rows.push({
      key,
      sectionTitle: null,
      question: null,
      answerLabel: answerLabel(record[key]),
    })
  }

  return rows
}

function responseRecord(responses: unknown): Record<string, unknown> {
  if (!responses || typeof responses !== 'object' || Array.isArray(responses)) return {}
  return responses as Record<string, unknown>
}
