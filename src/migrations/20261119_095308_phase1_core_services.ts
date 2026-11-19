import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_service_cards_variant" AS ENUM('grid', 'pair');
  CREATE TYPE "public"."enum__pages_v_blocks_service_cards_variant" AS ENUM('grid', 'pair');
  CREATE TYPE "public"."enum_header_nav_items_children_link_type" AS ENUM('reference', 'custom');
  ALTER TYPE "public"."enum_projects_type" ADD VALUE 'joinery';
  ALTER TYPE "public"."enum__projects_v_version_type" ADD VALUE 'joinery';
  CREATE TABLE "header_nav_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_children_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "header_nav_items_children_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "pages_blocks_service_cards" ADD COLUMN "variant" "enum_pages_blocks_service_cards_variant" DEFAULT 'grid';
  ALTER TABLE "pages_blocks_service_cards_locales" ADD COLUMN "heading_accent" varchar;
  ALTER TABLE "pages_blocks_service_cards_locales" ADD COLUMN "body" varchar;
  ALTER TABLE "pages_blocks_process_section_locales" ADD COLUMN "trust_eyebrow" varchar;
  ALTER TABLE "pages_blocks_process_section_locales" ADD COLUMN "trust_heading" varchar;
  ALTER TABLE "_pages_v_blocks_service_cards" ADD COLUMN "variant" "enum__pages_v_blocks_service_cards_variant" DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_service_cards_locales" ADD COLUMN "heading_accent" varchar;
  ALTER TABLE "_pages_v_blocks_service_cards_locales" ADD COLUMN "body" varchar;
  ALTER TABLE "_pages_v_blocks_process_section_locales" ADD COLUMN "trust_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_process_section_locales" ADD COLUMN "trust_heading" varchar;
  ALTER TABLE "header_nav_items_children" ADD CONSTRAINT "header_nav_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_children_locales" ADD CONSTRAINT "header_nav_items_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_children"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_nav_items_children_order_idx" ON "header_nav_items_children" USING btree ("_order");
  CREATE INDEX "header_nav_items_children_parent_id_idx" ON "header_nav_items_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_items_children_locales_locale_parent_id_unique" ON "header_nav_items_children_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "header_nav_items_children" CASCADE;
  DROP TABLE "header_nav_items_children_locales" CASCADE;
  ALTER TABLE "projects" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "projects" ALTER COLUMN "type" SET DEFAULT 'residential'::text;
  DROP TYPE "public"."enum_projects_type";
  CREATE TYPE "public"."enum_projects_type" AS ENUM('residential', 'commercial');
  ALTER TABLE "projects" ALTER COLUMN "type" SET DEFAULT 'residential'::"public"."enum_projects_type";
  ALTER TABLE "projects" ALTER COLUMN "type" SET DATA TYPE "public"."enum_projects_type" USING "type"::"public"."enum_projects_type";
  ALTER TABLE "_projects_v" ALTER COLUMN "version_type" SET DATA TYPE text;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_type" SET DEFAULT 'residential'::text;
  DROP TYPE "public"."enum__projects_v_version_type";
  CREATE TYPE "public"."enum__projects_v_version_type" AS ENUM('residential', 'commercial');
  ALTER TABLE "_projects_v" ALTER COLUMN "version_type" SET DEFAULT 'residential'::"public"."enum__projects_v_version_type";
  ALTER TABLE "_projects_v" ALTER COLUMN "version_type" SET DATA TYPE "public"."enum__projects_v_version_type" USING "version_type"::"public"."enum__projects_v_version_type";
  ALTER TABLE "pages_blocks_service_cards" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_service_cards_locales" DROP COLUMN "heading_accent";
  ALTER TABLE "pages_blocks_service_cards_locales" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_process_section_locales" DROP COLUMN "trust_eyebrow";
  ALTER TABLE "pages_blocks_process_section_locales" DROP COLUMN "trust_heading";
  ALTER TABLE "_pages_v_blocks_service_cards" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_service_cards_locales" DROP COLUMN "heading_accent";
  ALTER TABLE "_pages_v_blocks_service_cards_locales" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_process_section_locales" DROP COLUMN "trust_eyebrow";
  ALTER TABLE "_pages_v_blocks_process_section_locales" DROP COLUMN "trust_heading";
  DROP TYPE "public"."enum_pages_blocks_service_cards_variant";
  DROP TYPE "public"."enum__pages_v_blocks_service_cards_variant";
  DROP TYPE "public"."enum_header_nav_items_children_link_type";`)
}
