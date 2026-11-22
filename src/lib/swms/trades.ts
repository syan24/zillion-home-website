export const TRADE_GROUPS = [
  { value: 'siteworks-demolition', en: 'Siteworks & Demolition', zh: '场地工程与拆除' },
  { value: 'structural-concrete', en: 'Structural & Concrete Works', zh: '结构与混凝土工程' },
  { value: 'roofing-external', en: 'Roofing & External Works', zh: '屋面与外部工程' },
  { value: 'plumbing-drainage', en: 'Plumbing & Drainage', zh: '给排水' },
  { value: 'electrical-mechanical', en: 'Electrical & Mechanical Services', zh: '机电服务' },
  { value: 'internal-linings', en: 'Internal Linings & Wet Areas', zh: '内衬与湿区' },
  { value: 'interior-fitout', en: 'Interior Fit-out & Finishes', zh: '室内装修与饰面' },
  { value: 'landscaping', en: 'Landscaping & External Finishes', zh: '景观与外部饰面' },
] as const

export type TradeValue = (typeof TRADE_GROUPS)[number]['value']

export const tradeSelectOptions = TRADE_GROUPS.map((trade) => ({
  label: trade.en,
  value: trade.value,
}))

export function isTradeValue(value: unknown): value is TradeValue {
  return TRADE_GROUPS.some((trade) => trade.value === value)
}

export function tradeLabel(value: string, locale: 'en' | 'zh' = 'en'): string {
  return TRADE_GROUPS.find((trade) => trade.value === value)?.[locale] ?? value
}

export function tradeLabels(values: readonly string[]): string {
  return values.map((value) => tradeLabel(value, 'en')).join('; ')
}
