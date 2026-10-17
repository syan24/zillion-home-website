export const REGISTER_CSV_HEADERS = [
  'submissionRef',
  'signedAt',
  'workerName',
  'workerCompany',
  'workerPhone',
  'workerTrade',
  'project',
  'project SWMS',
  'version',
  'acknowledgement accepted',
] as const

export type RegisterCsvRow = {
  acknowledgementAccepted: boolean
  project: string
  projectSwms: string
  signedAt: string
  submissionRef: string
  version: string
  workerCompany: string
  workerName: string
  workerPhone: string
  workerTrade: string
}

export function registerFilename(projectTitle: string | null, date = new Date()): string {
  const day = date.toISOString().slice(0, 10)
  const segment = projectTitle ? filenameSegment(projectTitle) : ''
  return `swms-register-${segment || 'filtered'}-${day}.csv`
}

export function filenameSegment(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
}

export function displayText(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (!value || typeof value !== 'object') return ''

  const record = value as Record<string, unknown>
  const ordered = [record.en, ...Object.values(record).filter((item) => item !== record.en)]
  for (const item of ordered) {
    if (typeof item === 'string' && item.trim()) return item.trim()
  }
  return ''
}

/** English title when it slugifies; otherwise the project slug. */
export function filenameSource(title: unknown, slug?: unknown): string | null {
  const titleText = displayText(title)
  if (titleText && filenameSegment(titleText)) return titleText
  const slugText = displayText(slug)
  if (slugText && filenameSegment(slugText)) return slugText
  return null
}

export function toRegisterCsv(rows: RegisterCsvRow[]): string {
  const lines = [REGISTER_CSV_HEADERS.join(',')]
  for (const row of rows) {
    lines.push(
      [
        csvCell(row.submissionRef),
        csvCell(row.signedAt),
        csvCell(row.workerName),
        csvCell(row.workerCompany),
        csvCell(row.workerPhone),
        csvCell(row.workerTrade),
        csvCell(row.project),
        csvCell(row.projectSwms),
        csvCell(row.version),
        row.acknowledgementAccepted ? 'true' : 'false',
      ].join(','),
    )
  }
  return `${lines.join('\r\n')}\r\n`
}

function csvCell(value: string): string {
  if (/[",\r\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}
