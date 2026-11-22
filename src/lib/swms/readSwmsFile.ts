import fs from 'fs/promises'
import path from 'path'

import { swmsUploadsDir } from '@/collections/SWMSFiles'

type StoredFile = {
  filename?: string | null
  mimeType?: string | null
  url?: string | null
}

export async function readSwmsFile(
  file: StoredFile,
): Promise<{ bytes: Buffer; mimeType: string; filename: string } | null> {
  const mimeType = file.mimeType || 'application/octet-stream'
  const filename = file.filename || 'swms.pdf'

  if (file.url && /^https?:\/\//.test(file.url)) {
    const response = await fetch(file.url)
    if (!response.ok) return null
    return { bytes: Buffer.from(await response.arrayBuffer()), mimeType, filename }
  }

  if (!file.filename) return null
  const root = path.resolve(swmsUploadsDir)
  const filePath = path.resolve(root, file.filename)
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) return null

  try {
    const bytes = await fs.readFile(filePath)
    return { bytes, mimeType, filename }
  } catch {
    return null
  }
}
