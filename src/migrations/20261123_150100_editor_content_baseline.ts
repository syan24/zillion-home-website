import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

import { applyEditorBaseline } from '@/seed/editorBaseline'

/**
 * One-off content correction. It rewrites a value only when that value is still
 * a known pre-feedback string or shape. The list is in docs/03-assumptions.md (G3).
 * It does not change a Services CTA tone, a custom capability-list heading, a
 * custom footer label, or a scope project type an editor already saved.
 * Down does not rewrite pages, navigation, or the enquiry form, and there is
 * no backup of the values this migration changes. Seed after this migration
 * only creates missing pages and an empty header or footer.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyEditorBaseline(payload)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  return
}
