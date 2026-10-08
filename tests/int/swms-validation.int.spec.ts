import { describe, expect, it } from 'vitest'

import { contentFingerprint, questionKey, snapshotSections } from '@/lib/swms/content'
import {
  validateClientSubmissionId,
  validateResponses,
  validateSignature,
  validateWorkerDetails,
} from '@/lib/swms/validateSubmission'

const sections = snapshotSections([
  {
    id: 'section-1',
    title: 'Site safety',
    content: 'Placeholder',
    questions: [
      {
        id: 'q1',
        question: 'Induction complete?',
        type: 'yes-no',
        required: true,
        correctAnswer: 'yes',
      },
      {
        id: 'q2',
        question: 'I will follow the controls.',
        type: 'acknowledgement',
        required: true,
      },
    ],
  },
])

describe('SWMS submission validation', () => {
  it('strips admin row ids from the signed snapshot', () => {
    expect(sections[0]?.questions[0]?.question).toBe('Induction complete?')
    expect(JSON.stringify(sections)).not.toContain('section-1')
  })

  it('requires every required answer and records the response', () => {
    const missing = validateResponses(sections, { [questionKey(0, 0)]: 'yes' })
    expect(missing.ok).toBe(false)

    const accepted = validateResponses(sections, {
      [questionKey(0, 0)]: 'no',
      [questionKey(0, 1)]: 'accepted',
    })
    expect(accepted.ok).toBe(true)
    if (accepted.ok) {
      expect(accepted.value[questionKey(0, 0)]).toBe('no')
    }
  })

  it('rejects a signature that is not a PNG data URL', () => {
    expect(validateSignature('data:image/jpeg;base64,aaaa').ok).toBe(false)
    expect(validateSignature(`data:image/png;base64,${'a'.repeat(120)}`).ok).toBe(true)
  })

  it('requires a worker name and a submission id', () => {
    expect(
      validateWorkerDetails({
        workerName: 'A',
        workerCompany: '',
        workerPhone: '',
        workerTrade: '',
      }).ok,
    ).toBe(false)
    expect(
      validateWorkerDetails({
        workerName: 'Alex Chen',
        workerCompany: 'Zillion Home',
        workerPhone: '0400 000 000',
        workerTrade: 'Carpenter',
      }).ok,
    ).toBe(true)
    expect(validateClientSubmissionId('not-a-uuid').ok).toBe(false)
    expect(validateClientSubmissionId('8d9b6c3e-1f4a-4c2b-9a1e-0b7c6d5e4f30').ok).toBe(true)
  })

  it('changes the version fingerprint when question text changes', () => {
    const updated = snapshotSections([
      {
        title: 'Site safety',
        content: 'Placeholder',
        questions: [
          {
            question: 'Induction complete today?',
            type: 'yes-no',
            required: true,
            correctAnswer: 'yes',
          },
          { question: 'I will follow the controls.', type: 'acknowledgement', required: true },
        ],
      },
    ])
    expect(contentFingerprint(sections, 'I agree')).not.toBe(contentFingerprint(updated, 'I agree'))
  })
})
