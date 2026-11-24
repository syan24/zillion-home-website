import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Hidden seed identities. They let a later demo seed find the same project and
 * the same SWMS file after an editor renames them. They are not worker content.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "demo_key" varchar;
   ALTER TABLE "_projects_v" ADD COLUMN IF NOT EXISTS "version_demo_key" varchar;
   CREATE UNIQUE INDEX IF NOT EXISTS "projects_demo_key_idx" ON "projects" USING btree ("demo_key");
   CREATE INDEX IF NOT EXISTS "_projects_v_version_version_demo_key_idx" ON "_projects_v" USING btree ("version_demo_key");
   ALTER TABLE "swms_documents" ADD COLUMN IF NOT EXISTS "seed_key" varchar;
   CREATE UNIQUE INDEX IF NOT EXISTS "swms_documents_seed_key_idx" ON "swms_documents" USING btree ("seed_key");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "swms_documents_seed_key_idx";
   ALTER TABLE "swms_documents" DROP COLUMN IF EXISTS "seed_key";
   DROP INDEX IF EXISTS "_projects_v_version_version_demo_key_idx";
   DROP INDEX IF EXISTS "projects_demo_key_idx";
   ALTER TABLE "_projects_v" DROP COLUMN IF EXISTS "version_demo_key";
   ALTER TABLE "projects" DROP COLUMN IF EXISTS "demo_key";
  `)
}
