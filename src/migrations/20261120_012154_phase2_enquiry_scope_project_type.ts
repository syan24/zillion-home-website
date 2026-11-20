import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_blocks_checkbox_group_options_project_type" AS ENUM('residential', 'commercial', 'joinery');
  ALTER TABLE "forms_blocks_checkbox_group_options" ADD COLUMN "project_type" "enum_forms_blocks_checkbox_group_options_project_type";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_checkbox_group_options" DROP COLUMN "project_type";
  DROP TYPE "public"."enum_forms_blocks_checkbox_group_options_project_type";`)
}
