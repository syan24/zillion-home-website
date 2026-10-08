export type SwmsQuestionType = 'yes-no' | 'yes-no-na' | 'acknowledgement'

export type SwmsExpectedAnswer = 'yes' | 'no' | 'any'

export type SwmsQuestionSnapshot = {
  question: string
  type: SwmsQuestionType
  required: boolean
  correctAnswer: SwmsExpectedAnswer
}

export type SwmsSectionSnapshot = {
  title: string
  content: string
  questions: SwmsQuestionSnapshot[]
}

const QUESTION_TYPES = new Set<SwmsQuestionType>(['yes-no', 'yes-no-na', 'acknowledgement'])

export function questionKey(sectionIndex: number, questionIndex: number): string {
  return `${sectionIndex}.${questionIndex}`
}

export function snapshotSections(input: unknown): SwmsSectionSnapshot[] {
  if (!Array.isArray(input)) return []

  return input.flatMap((section) => {
    if (!section || typeof section !== 'object') return []
    const row = section as Record<string, unknown>
    const title = typeof row.title === 'string' ? row.title.trim() : ''
    if (!title) return []

    const questions = Array.isArray(row.questions)
      ? row.questions.flatMap((question) => {
          if (!question || typeof question !== 'object') return []
          const item = question as Record<string, unknown>
          const text = typeof item.question === 'string' ? item.question.trim() : ''
          if (!text) return []
          const type = QUESTION_TYPES.has(item.type as SwmsQuestionType)
            ? (item.type as SwmsQuestionType)
            : 'yes-no'
          const correctAnswer: SwmsExpectedAnswer =
            item.correctAnswer === 'no' || item.correctAnswer === 'any' ? item.correctAnswer : 'yes'

          return [
            {
              question: text,
              type,
              required: item.required !== false,
              correctAnswer,
            },
          ]
        })
      : []

    return [
      {
        title,
        content: typeof row.content === 'string' ? row.content : '',
        questions,
      },
    ]
  })
}

export function contentFingerprint(
  sections: SwmsSectionSnapshot[],
  acknowledgementText: string,
): string {
  return JSON.stringify({
    sections,
    acknowledgementText: acknowledgementText.trim(),
  })
}

export function countQuestions(sections: SwmsSectionSnapshot[]): number {
  return sections.reduce((total, section) => total + section.questions.length, 0)
}
