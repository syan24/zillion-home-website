import { describe, expect, it } from 'vitest'

import { getMarketing } from '@/content/getMarketing'
import {
  alignHomeProcessLayout,
  isLegacyHomeProcess,
  legacyHomeProcessTitles,
  ourProcessSteps,
  ourProcessStepsZh,
  readProcessSteps,
} from '@/content/processSteps'

describe('shared process steps', () => {
  it('uses the Services process list on Home in both locales', () => {
    expect(getMarketing('en').home.process.steps).toEqual(getMarketing('en').services.process.steps)
    expect(getMarketing('zh').home.process.steps).toEqual(getMarketing('zh').services.process.steps)
    expect(getMarketing('en').services.process.steps).toEqual(ourProcessSteps)
    expect(getMarketing('zh').services.process.steps).toEqual(ourProcessStepsZh)
    expect(ourProcessSteps.map((step) => step.title)).toEqual([
      'Consultation',
      'Planning',
      'Construction',
      'Joinery',
      'Handover',
    ])
  })

  it('recognises the old Home demo titles and leaves edited titles alone', () => {
    const legacy = legacyHomeProcessTitles.en.map((title) => ({ title }))
    expect(isLegacyHomeProcess(legacy, 'en')).toBe(true)
    expect(isLegacyHomeProcess(ourProcessSteps, 'en')).toBe(false)
    expect(isLegacyHomeProcess(legacyHomeProcessTitles.zh.map((title) => ({ title })), 'zh')).toBe(true)

    const layout = [
      { blockType: 'ctaBand', heading: 'Stay' },
      {
        id: 'process',
        blockType: 'processSection',
        heading: 'Clarity at every stage.',
        steps: legacy.map((step, index) => ({ id: `step-${index}`, title: step.title })),
      },
    ]
    const aligned = alignHomeProcessLayout(layout, 'en', ourProcessSteps)
    expect(aligned.changed).toBe(true)
    expect(readProcessSteps(aligned.layout)).toEqual(ourProcessSteps)
    const block = (aligned.layout as { steps?: { id?: string; title: string }[] }[])[1]
    expect(block.steps?.map((step) => step.id)).toEqual(['step-0', 'step-1', 'step-2', 'step-3', 'step-4'])

    const edited = alignHomeProcessLayout(
      [{ blockType: 'processSection', steps: [{ title: 'Custom step' }] }],
      'en',
      ourProcessSteps,
    )
    expect(edited.changed).toBe(false)
  })
})
