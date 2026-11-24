import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

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
export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  // Later fields are part of the current Local API select list. A brand-new
  // database has no pages yet, so this one-off has nothing to correct. The
  // first seed writes the current baseline after every column exists.
  const result = await db.execute<{ count: number }>(sql`SELECT count(*)::int AS count FROM "pages"`)
  const count = Number(result.rows?.[0]?.count ?? 0)
  if (count === 0) return
  await applyEditorBaseline(payload)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  return
}
