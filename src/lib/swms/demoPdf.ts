/** A small text-only PDF used by the idempotent demo seed. Not a legal SWMS. */
export function buildTextPdf(pages: string[][]): Buffer {
  const objects = new Map<number, string>()
  objects.set(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

  const pageIds: number[] = []
  let nextId = 4
  for (const lines of pages) {
    const contentId = nextId
    nextId += 1
    const pageId = nextId
    nextId += 1
    pageIds.push(pageId)

    const commands = ['BT', '/F1 16 Tf', '50 760 Td', '22 TL']
    lines.forEach((line, index) => {
      const safe = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
      commands.push(index === 0 ? `(${safe}) Tj` : `T* (${safe}) Tj`)
    })
    commands.push('ET')
    const stream = commands.join('\n')
    objects.set(
      contentId,
      `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    )
    objects.set(
      pageId,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`,
    )
  }

  objects.set(
    2,
    `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] >>`,
  )
  objects.set(1, '<< /Type /Catalog /Pages 2 0 R >>')

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  const ids = [...objects.keys()].sort((a, b) => a - b)
  for (const id of ids) {
    offsets[id] = Buffer.byteLength(pdf)
    pdf += `${id} 0 obj\n${objects.get(id)}\nendobj\n`
  }

  const xref = Buffer.byteLength(pdf)
  const size = ids.length + 1
  pdf += `xref\n0 ${size}\n`
  pdf += '0000000000 65535 f \n'
  for (const id of ids) {
    pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(pdf)
}
