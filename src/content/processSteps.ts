/**
 * One process list for Home and Services.
 * The four steps are the 2026-11-17 client copy: Consultation, Planning,
 * Construction, Handover.
 */
export type ProcessStep = {
  title: string
  description: string
}

export const ourProcessSteps: ProcessStep[] = [
  {
    title: 'Consultation',
    description: 'We start by understanding your project goals, priorities, budget and timeframe.',
  },
  {
    title: 'Planning',
    description:
      'We define the scope, review documentation and coordinate design, construction and trade requirements as needed.',
  },
  {
    title: 'Construction',
    description:
      'We manage the building works, coordinate trades and oversee installations and finishing details throughout the project.',
  },
  {
    title: 'Handover',
    description: 'We review the completed works, address outstanding details and prepare the project for handover.',
  },
]

export const ourProcessStepsZh: ProcessStep[] = [
  { title: '沟通', description: '我们先了解您的项目目标、优先事项、预算和工期。' },
  { title: '规划', description: '我们确定范围，审阅资料，并按需要协调设计、施工和各工种的要求。' },
  { title: '施工', description: '我们管理施工作业，协调各工种，并在整个项目中跟进安装和收尾细节。' },
  { title: '交付', description: '我们复查已完成的工程，处理遗留细节，并为项目交付做好准备。' },
]

/** Titles seeded on Home before it shared the Services list. */
export const legacyHomeProcessTitles = {
  en: ['Consultation', 'Planning & Coordination', 'Construction / Fit-out', 'Joinery & Finishes', 'Handover'],
  zh: ['沟通', '规划与协调', '施工 / 装修', '木作与收尾', '交付'],
} as const

/** The five-step list Home and Services shared before the 2026-11-17 feedback. */
export const previousSharedProcessTitles = {
  en: ['Consultation', 'Planning', 'Construction', 'Joinery', 'Handover'],
  zh: ['沟通', '规划', '施工', '木作', '交付'],
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

function titlesMatch(steps: unknown, expected: readonly string[]) {
  if (!Array.isArray(steps) || steps.length !== expected.length) return false
  return steps.every((step, index) => {
    if (!isRecord(step) || typeof step.title !== 'string') return false
    return step.title.trim() === expected[index]
  })
}

export function isLegacyHomeProcess(steps: unknown, locale: ProcessLocale) {
  return titlesMatch(steps, legacyHomeProcessTitles[locale])
}

export function isPreviousSharedProcess(steps: unknown, locale: ProcessLocale) {
  return titlesMatch(steps, previousSharedProcessTitles[locale])
}

export function isReplaceableProcess(steps: unknown, locale: ProcessLocale) {
  return isLegacyHomeProcess(steps, locale) || isPreviousSharedProcess(steps, locale)
}

/**
 * Keeps ids so localized rows stay paired. A five-step list drops the fourth
 * title (Joinery) and keeps the last id on Handover.
 */
export function remapProcessSteps(existing: unknown[], canonical: ProcessStep[]) {
  const ids = existing.map((step) => {
    if (!isRecord(step)) return undefined
    return typeof step.id === 'string' || typeof step.id === 'number' ? step.id : undefined
  })

  return canonical.map((step, index) => {
    const id = index < canonical.length - 1 ? ids[index] : ids[ids.length - 1]
    return {
      ...(id !== undefined ? { id } : {}),
      title: step.title,
      description: step.description,
    }
  })
}

/**
 * Rewrites a layout's process steps when they are still a known five-step list.
 * Edited titles are left alone.
 */
export function alignHomeProcessLayout(
  layout: unknown,
  locale: ProcessLocale,
  canonical: ProcessStep[],
): { changed: boolean; layout: unknown } {
  if (!Array.isArray(layout) || canonical.length < 4) return { changed: false, layout }

  let changed = false
  const next = layout.map((block) => {
    if (!isRecord(block) || block.blockType !== 'processSection' || !isReplaceableProcess(block.steps, locale)) {
      return block
    }
    const existing = block.steps
    if (!Array.isArray(existing)) return block

    changed = true
    return {
      ...block,
      steps: remapProcessSteps(existing, canonical),
    }
  })

  return { changed, layout: changed ? next : layout }
}
