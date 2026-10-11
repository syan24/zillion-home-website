export function publicProjectLocation(project: {
  showAddressPublicly?: boolean | null
  address?: string | null
  suburb?: string | null
}) {
  if (project.showAddressPublicly && project.address?.trim()) return project.address.trim()
  return project.suburb?.trim() || null
}
