import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Schema only. The following migration copies the corrected feedback baseline
 * once. Rolling this back restores the placeholder column and drops the seed
 * locks. It does not restore copy an editor, or that baseline, already changed.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "content_seeded" boolean DEFAULT false;
   ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "content_seeded" boolean DEFAULT false;
   ALTER TABLE "forms_blocks_select_locales" ADD COLUMN IF NOT EXISTS "placeholder" varchar;
   UPDATE "forms_blocks_select_locales" AS locale
   SET "placeholder" = parent."placeholder"
   FROM "forms_blocks_select" AS parent
   WHERE locale."_parent_id" = parent."id"
     AND locale."placeholder" IS NULL
     AND parent."placeholder" IS NOT NULL;
   ALTER TABLE "forms_blocks_select" DROP COLUMN IF EXISTS "placeholder";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_select" ADD COLUMN IF NOT EXISTS "placeholder" varchar;
   UPDATE "forms_blocks_select" AS parent
   SET "placeholder" = locale."placeholder"
   FROM "forms_blocks_select_locales" AS locale
   WHERE locale."_parent_id" = parent."id"
     AND locale."_locale" = 'en'
     AND parent."placeholder" IS NULL;
   ALTER TABLE "forms_blocks_select_locales" DROP COLUMN IF EXISTS "placeholder";
   ALTER TABLE "header" DROP COLUMN IF EXISTS "content_seeded";
   ALTER TABLE "footer" DROP COLUMN IF EXISTS "content_seeded";`)
}
