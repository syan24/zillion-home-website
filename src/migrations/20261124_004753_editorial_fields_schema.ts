import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_page_types_value" AS ENUM('residential', 'commercial', 'joinery');
  CREATE TABLE "pages_blocks_service_details_locales" (
  	"features_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_service_details_locales" (
  	"features_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_locales" (
  	"enquiry_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_page_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" "enum_projects_page_types_value" NOT NULL,
  	"active" boolean DEFAULT true
  );
  
  CREATE TABLE "projects_page_types_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_seeded" boolean DEFAULT false,
  	"hero_id" integer,
  	"enquire_url" varchar DEFAULT '/enquiry',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_page_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_accent" varchar,
  	"intro" varchar,
  	"hero_alt" varchar,
  	"by_project" varchar,
  	"by_room" varchar,
  	"type_heading" varchar,
  	"filter_heading" varchar,
  	"band_eyebrow" varchar,
  	"band_heading" varchar,
  	"band_accent" varchar,
  	"enquire_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "enquiry_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_seeded" boolean DEFAULT false,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "enquiry_page_locales" (
  	"overlay_eyebrow" varchar,
  	"overlay_title" varchar,
  	"overlay_accent" varchar,
  	"overlay_body" varchar,
  	"overlay_line1" varchar,
  	"overlay_line2" varchar,
  	"image_alt" varchar,
  	"form_eyebrow" varchar,
  	"form_heading" varchar,
  	"form_intro" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "enquiry_notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"notify_to" varchar,
  	"notify_from" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_cta_band" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_blocks_cta_band_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_cta_band_locales" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_headline_accent" varchar;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_blocks_cta_band_locales" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_cta_band_locales" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_headline_accent" varchar;
  ALTER TABLE "header" ADD COLUMN "enquiry_url" varchar DEFAULT '/enquiry';
  ALTER TABLE "pages_blocks_service_details_locales" ADD CONSTRAINT "pages_blocks_service_details_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_details_locales" ADD CONSTRAINT "_pages_v_blocks_service_details_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_page_types" ADD CONSTRAINT "projects_page_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_page_types_locales" ADD CONSTRAINT "projects_page_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_page_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_page" ADD CONSTRAINT "projects_page_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_page_locales" ADD CONSTRAINT "projects_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "enquiry_page" ADD CONSTRAINT "enquiry_page_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiry_page_locales" ADD CONSTRAINT "enquiry_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."enquiry_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_blocks_service_details_locales_locale_parent_id_unique" ON "pages_blocks_service_details_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_service_details_locales_locale_parent_id_uni" ON "_pages_v_blocks_service_details_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_page_types_order_idx" ON "projects_page_types" USING btree ("_order");
  CREATE INDEX "projects_page_types_parent_id_idx" ON "projects_page_types" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_page_types_locales_locale_parent_id_unique" ON "projects_page_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_page_hero_idx" ON "projects_page" USING btree ("hero_id");
  CREATE UNIQUE INDEX "projects_page_locales_locale_parent_id_unique" ON "projects_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "enquiry_page_image_idx" ON "enquiry_page" USING btree ("image_id");
  CREATE UNIQUE INDEX "enquiry_page_locales_locale_parent_id_unique" ON "enquiry_page_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_cta_band_image_idx" ON "pages_blocks_cta_band" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_cta_band_image_idx" ON "_pages_v_blocks_cta_band" USING btree ("image_id");
`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_service_details_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_details_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_page_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_page_types_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "enquiry_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "enquiry_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "enquiry_notifications" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_service_details_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_service_details_locales" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "projects_page_types" CASCADE;
  DROP TABLE "projects_page_types_locales" CASCADE;
  DROP TABLE "projects_page" CASCADE;
  DROP TABLE "projects_page_locales" CASCADE;
  DROP TABLE "enquiry_page" CASCADE;
  DROP TABLE "enquiry_page_locales" CASCADE;
  DROP TABLE "enquiry_notifications" CASCADE;
  ALTER TABLE "pages_blocks_cta_band" DROP CONSTRAINT "pages_blocks_cta_band_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_cta_band" DROP CONSTRAINT "_pages_v_blocks_cta_band_image_id_media_id_fk";
  
  DROP INDEX "pages_blocks_cta_band_image_idx";
  DROP INDEX "_pages_v_blocks_cta_band_image_idx";
  ALTER TABLE "pages_blocks_cta_band" DROP COLUMN "image_id";
  ALTER TABLE "pages_blocks_cta_band_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_cta_band_locales" DROP COLUMN "image_alt";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_headline_accent";
  ALTER TABLE "_pages_v_blocks_cta_band" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_blocks_cta_band_locales" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_cta_band_locales" DROP COLUMN "image_alt";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_headline_accent";
  ALTER TABLE "header" DROP COLUMN "enquiry_url";
  DROP TYPE "public"."enum_projects_page_types_value";`)
}
