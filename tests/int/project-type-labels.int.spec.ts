import { describe, expect, it } from 'vitest'

import { labelForProjectType, visibleProjectTypes } from '@/lib/projects/types'

describe('project type presentation', () => {
  const types = [
    { value: 'joinery', label: '定制木作', active: true },
    { value: 'residential', label: '住宅', active: false },
    { value: 'commercial', label: '商业', active: true },
    { value: 'other', label: 'Ignored', active: true },
  ]

  it('lists active types in the saved order', () => {
    expect(visibleProjectTypes(types)).toEqual([
      { value: 'joinery', label: '定制木作' },
      { value: 'commercial', label: '商业' },
    ])
  })

  it('keeps the saved label for a hidden type and does not invent one', () => {
    expect(labelForProjectType('residential', types)).toBe('住宅')
    expect(labelForProjectType('joinery', [])).toBe('')
  })
})
