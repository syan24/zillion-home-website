import { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedEditorial } from '@/seed/editorial'

/**
 * Copies the wording already shown on the site into the new fields once.
 * If Home does not exist yet, this does nothing and does not mark the fields
 * as seeded. The first demo seed fills them after it creates the pages.
 * Down does not restore or delete that copy.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await seedEditorial(payload)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  return
}
