export function relationID(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
    return Number(value)
  }
  if (value && typeof value === 'object' && 'id' in value) {
    return relationID((value as { id: unknown }).id)
  }
  return null
}
