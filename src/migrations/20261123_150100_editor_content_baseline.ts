import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

import { applyEditorBaseline } from '@/seed/editorBaseline'

/**
 * One-off content correction. Down does not rewrite pages, navigation, or the
 * enquiry form: those rows are editor data after this migration commits.
 * Seed after this migration only creates missing pages and an empty header or
 * footer. It does not run this correction again.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyEditorBaseline(payload)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  return
}
