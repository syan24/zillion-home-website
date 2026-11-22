import { isTradeValue, type TradeValue } from '@/lib/swms/trades'

export const SITE_SAFETY_MENU = [
  { slug: 'sign-in', en: 'Sign-in / Out', zh: '签到 / 签退' },
  { slug: 'induction', en: 'Site Induction', zh: '现场入场培训' },
  { slug: 'documents', en: 'SWMS & Safety Documents', zh: 'SWMS 与安全文件' },
  { slug: 'incident', en: 'Incident Report', zh: '事故报告' },
  { slug: 'hazard', en: 'Hazard Identification', zh: '危害识别' },
  { slug: 'toolbox', en: 'Toolbox Talk', zh: '工具箱会议' },
] as const

export type SwmsDocumentRef = {
  id: number
  accessToken: string
  title: string
  trades: string[]
  fileVersion: number
  versionLabel: string
}

export type ConfirmationRef = {
  documentId: number
  fileVersion: number
}

export function siteSafetyHref(token: string, slug = ''): string {
  return slug ? `/swms/${token}/${slug}` : `/swms/${token}`
}

export function scrolledToEnd(metrics: {
  scrollTop: number
  clientHeight: number
  scrollHeight: number
}): boolean {
  if (metrics.scrollHeight <= 0 || metrics.clientHeight <= 0) return false
  return metrics.scrollTop + metrics.clientHeight >= metrics.scrollHeight - 16
}

/** The acknowledgement checkbox stays hidden until the last PDF page has been scrolled into view. */
export function acknowledgementUnlocked(reachedEnd: boolean): boolean {
  return reachedEnd
}

type TradeResult = { ok: true; value: TradeValue[] } | { ok: false; error: string }

export function validateSelectedTrades(selected: unknown, enabled: readonly string[]): TradeResult {
  if (!Array.isArray(selected) || selected.length === 0) {
    return { ok: false, error: 'Select at least one trade. 请至少选择一个工种。' }
  }

  const enabledSet = new Set(enabled.filter(isTradeValue))
  const unique: TradeValue[] = []
  for (const value of selected) {
    if (!isTradeValue(value) || !enabledSet.has(value)) {
      return { ok: false, error: 'Choose a trade that is enabled for this project. 请选择本项目已启用的工种。' }
    }
    if (!unique.includes(value)) unique.push(value)
  }

  return { ok: true, value: unique }
}

export function documentsForTrades<T extends { trades: string[] }>(
  documents: readonly T[],
  trades: readonly string[],
): T[] {
  const selected = new Set(trades)
  return documents.filter((document) => document.trades.some((trade) => selected.has(trade)))
}

export function pendingDocumentConfirmations<T extends SwmsDocumentRef>(
  documents: readonly T[],
  trades: readonly string[],
  confirmations: readonly ConfirmationRef[],
): T[] {
  return documentsForTrades(documents, trades).filter(
    (document) =>
      !confirmations.some(
        (confirmation) =>
          confirmation.documentId === document.id &&
          confirmation.fileVersion === document.fileVersion,
      ),
  )
}

export type ReportKind = 'incident' | 'hazard' | 'toolbox'

export function isReportKind(value: unknown): value is ReportKind {
  return value === 'incident' || value === 'hazard' || value === 'toolbox'
}

export function reportKindLabel(kind: ReportKind): { en: string; zh: string } {
  if (kind === 'incident') return { en: 'Incident Report', zh: '事故报告' }
  if (kind === 'hazard') return { en: 'Hazard Identification', zh: '危害识别' }
  return { en: 'Toolbox Talk', zh: '工具箱会议' }
}

const DESCRIPTION_MAX = 2000

export function validateReportDescription(value: unknown): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof value !== 'string') {
    return { ok: false, error: 'Enter a short description. 请填写简短说明。' }
  }
  const description = value.replace(/\s+/g, ' ').trim()
  if (description.length < 2 || description.length > DESCRIPTION_MAX) {
    return { ok: false, error: 'Enter a short description. 请填写简短说明。' }
  }
  return { ok: true, value: description }
}

export function validateOccurredAt(value: unknown, now = new Date()): { ok: true; value: string } | { ok: false; error: string } {
  const raw = typeof value === 'string' && value.trim() ? value.trim() : now.toISOString()
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: 'Enter a valid time. 请填写有效时间。' }
  }
  if (date.getTime() > now.getTime() + 5 * 60 * 1000) {
    return { ok: false, error: 'The time cannot be in the future. 时间不能晚于现在。' }
  }
  return { ok: true, value: date.toISOString() }
}
