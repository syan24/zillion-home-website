import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_blocks_select_options_icon" AS ENUM('house', 'building', 'layout');
  CREATE TYPE "public"."enum_forms_blocks_radio_options_icon" AS ENUM('house', 'building', 'layout');
  CREATE TYPE "public"."enum_forms_blocks_checkbox_group_options_icon" AS ENUM('house', 'building', 'layout');
  ALTER TABLE "forms_blocks_select_options" ADD COLUMN "icon" "enum_forms_blocks_select_options_icon";
  ALTER TABLE "forms_blocks_select_options" ADD COLUMN "icon_image_id" integer;
  ALTER TABLE "forms_blocks_radio_options" ADD COLUMN "icon" "enum_forms_blocks_radio_options_icon";
  ALTER TABLE "forms_blocks_radio_options" ADD COLUMN "icon_image_id" integer;
  ALTER TABLE "forms_blocks_checkbox_group_options" ADD COLUMN "icon" "enum_forms_blocks_checkbox_group_options_icon";
  ALTER TABLE "forms_blocks_checkbox_group_options" ADD COLUMN "icon_image_id" integer;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio_options" ADD CONSTRAINT "forms_blocks_radio_options_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_group_options" ADD CONSTRAINT "forms_blocks_checkbox_group_options_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "forms_blocks_select_options_icon_image_idx" ON "forms_blocks_select_options" USING btree ("icon_image_id");
  CREATE INDEX "forms_blocks_radio_options_icon_image_idx" ON "forms_blocks_radio_options" USING btree ("icon_image_id");
  CREATE INDEX "forms_blocks_checkbox_group_options_icon_image_idx" ON "forms_blocks_checkbox_group_options" USING btree ("icon_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forms_blocks_select_options" DROP CONSTRAINT "forms_blocks_select_options_icon_image_id_media_id_fk";
  
  ALTER TABLE "forms_blocks_radio_options" DROP CONSTRAINT "forms_blocks_radio_options_icon_image_id_media_id_fk";
  
  ALTER TABLE "forms_blocks_checkbox_group_options" DROP CONSTRAINT "forms_blocks_checkbox_group_options_icon_image_id_media_id_fk";
  
  DROP INDEX "forms_blocks_select_options_icon_image_idx";
  DROP INDEX "forms_blocks_radio_options_icon_image_idx";
  DROP INDEX "forms_blocks_checkbox_group_options_icon_image_idx";
  ALTER TABLE "forms_blocks_select_options" DROP COLUMN "icon";
  ALTER TABLE "forms_blocks_select_options" DROP COLUMN "icon_image_id";
  ALTER TABLE "forms_blocks_radio_options" DROP COLUMN "icon";
  ALTER TABLE "forms_blocks_radio_options" DROP COLUMN "icon_image_id";
  ALTER TABLE "forms_blocks_checkbox_group_options" DROP COLUMN "icon";
  ALTER TABLE "forms_blocks_checkbox_group_options" DROP COLUMN "icon_image_id";
  DROP TYPE "public"."enum_forms_blocks_select_options_icon";
  DROP TYPE "public"."enum_forms_blocks_radio_options_icon";
  DROP TYPE "public"."enum_forms_blocks_checkbox_group_options_icon";`)
}
