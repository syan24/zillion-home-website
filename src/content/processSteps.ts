/**
 * One process list for Home and Services.
 * English matches the Services page CMS copy (Design Canvas titles:
 * Consultation, Planning, Construction, Joinery, Handover).
 */
export type ProcessStep = {
  title: string
  description: string
}

export const ourProcessSteps: ProcessStep[] = [
  { title: 'Consultation', description: 'We meet to understand your project needs' },
  { title: 'Planning', description: 'Detailed planning and design coordination' },
  { title: 'Construction', description: 'Quality construction with regular updates' },
  { title: 'Joinery', description: 'Custom joinery and finishing touches' },
  { title: 'Handover', description: 'Final walkthrough and project completion' },
]

export const ourProcessStepsZh: ProcessStep[] = [
  { title: '沟通', description: '见面了解项目需求' },
  { title: '规划', description: '详细规划并协调设计' },
  { title: '施工', description: '按品质施工，并定期更新' },
  { title: '木作', description: '定制木作与收尾' },
  { title: '交付', description: '最终验收并完成项目' },
]

/** Titles seeded on Home before it shared the Services list. */
export const legacyHomeProcessTitles = {
  en: ['Consultation', 'Planning & Coordination', 'Construction / Fit-out', 'Joinery & Finishes', 'Handover'],
  zh: ['沟通', '规划与协调', '施工 / 装修', '木作与收尾', '交付'],
} as const

export type ProcessLocale = keyof typeof legacyHomeProcessTitles

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function readProcessSteps(layout: unknown): ProcessStep[] {
  if (!Array.isArray(layout)) return []

  for (const block of layout) {
    if (!isRecord(block) || block.blockType !== 'processSection' || !Array.isArray(block.steps)) continue

    const steps: ProcessStep[] = []
    for (const step of block.steps) {
      if (!isRecord(step) || typeof step.title !== 'string' || !step.title.trim()) continue
      steps.push({
        title: step.title.trim(),
        description: typeof step.description === 'string' ? step.description.trim() : '',
      })
    }
    if (steps.length) return steps
  }

  return []
}

export function isLegacyHomeProcess(steps: unknown, locale: ProcessLocale) {
  if (!Array.isArray(steps)) return false
  const legacy = legacyHomeProcessTitles[locale]
  if (steps.length !== legacy.length) return false

  return steps.every((step, index) => {
    if (!isRecord(step) || typeof step.title !== 'string') return false
    return step.title.trim() === legacy[index]
  })
}

/**
 * Rewrites a Home layout's process steps when they are still the old demo list.
 * Edited titles are left alone. Step ids are kept so localized rows stay paired.
 */
export function alignHomeProcessLayout(
  layout: unknown,
  locale: ProcessLocale,
  canonical: ProcessStep[],
): { changed: boolean; layout: unknown } {
  if (!Array.isArray(layout) || canonical.length < 5) return { changed: false, layout }

  let changed = false
  const next = layout.map((block) => {
    if (!isRecord(block) || block.blockType !== 'processSection' || !isLegacyHomeProcess(block.steps, locale)) {
      return block
    }
    const existing = block.steps
    if (!Array.isArray(existing)) return block

    changed = true
    return {
      ...block,
      steps: canonical.map((step, index) => {
        const current = existing[index]
        const id = isRecord(current) ? current.id : undefined
        return {
          ...(typeof id === 'string' || typeof id === 'number' ? { id } : {}),
          title: step.title,
          description: step.description,
        }
      }),
    }
  })

  return { changed, layout: changed ? next : layout }
}
