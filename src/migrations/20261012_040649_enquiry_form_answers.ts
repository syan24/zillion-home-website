import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_forms_blocks_upload_upload_collection" AS ENUM('enquiry-files');
  CREATE TABLE "forms_blocks_upload_mime_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mime_type" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_upload" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"upload_collection" "enum_forms_blocks_upload_upload_collection" NOT NULL,
  	"width" numeric,
  	"max_file_size" numeric,
  	"required" boolean,
  	"multiple" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_upload_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_radio_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_radio_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_radio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_radio_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox_group_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox_group_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_group_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_uploads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"enquiry_files_id" integer
  );
  
  ALTER TABLE "enquiries" ADD COLUMN "scope" jsonb;
  UPDATE "enquiries" AS enquiry
  SET "scope" = COALESCE(
    (
      SELECT jsonb_agg(to_jsonb(scope_row.value) ORDER BY scope_row."order")
      FROM "enquiries_scope" AS scope_row
      WHERE scope_row.parent_id = enquiry.id
    ),
    '[]'::jsonb
  );
  ALTER TABLE "enquiries_scope" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "enquiries_scope" CASCADE;
  ALTER TABLE "enquiries" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "enquiries" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "enquiries" ALTER COLUMN "address" DROP NOT NULL;
  ALTER TABLE "enquiries" ALTER COLUMN "project_type" SET DATA TYPE varchar USING "project_type"::text;
  ALTER TABLE "enquiries" ALTER COLUMN "project_type" DROP NOT NULL;
  ALTER TABLE "enquiries" ALTER COLUMN "budget_range" SET DATA TYPE varchar USING "budget_range"::text;
  ALTER TABLE "enquiries" ALTER COLUMN "expected_start" SET DATA TYPE varchar USING "expected_start"::text;
  ALTER TABLE "enquiries" ADD COLUMN "additional_answers" jsonb;
  ALTER TABLE "forms" ADD COLUMN "enquiry_form" boolean;
  ALTER TABLE "forms_blocks_upload_mime_types" ADD CONSTRAINT "forms_blocks_upload_mime_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_upload"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_upload" ADD CONSTRAINT "forms_blocks_upload_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_upload_locales" ADD CONSTRAINT "forms_blocks_upload_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_upload"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio_options" ADD CONSTRAINT "forms_blocks_radio_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_radio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio_options_locales" ADD CONSTRAINT "forms_blocks_radio_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_radio_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio" ADD CONSTRAINT "forms_blocks_radio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio_locales" ADD CONSTRAINT "forms_blocks_radio_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_radio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_group_options" ADD CONSTRAINT "forms_blocks_checkbox_group_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox_group"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_group_options_locales" ADD CONSTRAINT "forms_blocks_checkbox_group_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox_group_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_group" ADD CONSTRAINT "forms_blocks_checkbox_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_group_locales" ADD CONSTRAINT "forms_blocks_checkbox_group_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox_group"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_uploads" ADD CONSTRAINT "form_submissions_submission_uploads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_rels" ADD CONSTRAINT "form_submissions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_rels" ADD CONSTRAINT "form_submissions_rels_enquiry_files_fk" FOREIGN KEY ("enquiry_files_id") REFERENCES "public"."enquiry_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "forms_blocks_upload_mime_types_order_idx" ON "forms_blocks_upload_mime_types" USING btree ("_order");
  CREATE INDEX "forms_blocks_upload_mime_types_parent_id_idx" ON "forms_blocks_upload_mime_types" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_upload_order_idx" ON "forms_blocks_upload" USING btree ("_order");
  CREATE INDEX "forms_blocks_upload_parent_id_idx" ON "forms_blocks_upload" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_upload_path_idx" ON "forms_blocks_upload" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_upload_locales_locale_parent_id_unique" ON "forms_blocks_upload_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_radio_options_order_idx" ON "forms_blocks_radio_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_options_parent_id_idx" ON "forms_blocks_radio_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_radio_options_locales_locale_parent_id_unique" ON "forms_blocks_radio_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_radio_order_idx" ON "forms_blocks_radio" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_parent_id_idx" ON "forms_blocks_radio" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_path_idx" ON "forms_blocks_radio" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_radio_locales_locale_parent_id_unique" ON "forms_blocks_radio_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_checkbox_group_options_order_idx" ON "forms_blocks_checkbox_group_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_group_options_parent_id_idx" ON "forms_blocks_checkbox_group_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_group_options_locales_locale_parent_id" ON "forms_blocks_checkbox_group_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_checkbox_group_order_idx" ON "forms_blocks_checkbox_group" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_group_parent_id_idx" ON "forms_blocks_checkbox_group" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_group_path_idx" ON "forms_blocks_checkbox_group" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_group_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_group_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_uploads_order_idx" ON "form_submissions_submission_uploads" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_uploads_parent_id_idx" ON "form_submissions_submission_uploads" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_rels_order_idx" ON "form_submissions_rels" USING btree ("order");
  CREATE INDEX "form_submissions_rels_parent_idx" ON "form_submissions_rels" USING btree ("parent_id");
  CREATE INDEX "form_submissions_rels_path_idx" ON "form_submissions_rels" USING btree ("path");
  CREATE INDEX "form_submissions_rels_enquiry_files_id_idx" ON "form_submissions_rels" USING btree ("enquiry_files_id");
  DROP TYPE "public"."enum_enquiries_scope";
  DROP TYPE "public"."enum_enquiries_project_type";
  DROP TYPE "public"."enum_enquiries_budget_range";
  DROP TYPE "public"."enum_enquiries_expected_start";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_enquiries_scope" AS ENUM('full-joinery', 'kitchen', 'wardrobe', 'bathroom-vanity', 'tv-unit', 'other');
  CREATE TYPE "public"."enum_enquiries_project_type" AS ENUM('residential', 'commercial', 'joinery');
  CREATE TYPE "public"."enum_enquiries_budget_range" AS ENUM('under-50k', '50k-100k', '100k-250k', '250k-500k', 'over-500k');
  CREATE TYPE "public"."enum_enquiries_expected_start" AS ENUM('asap', '1-3-months', '3-6-months', '6-12-months', 'planning');
  CREATE TABLE "enquiries_scope" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_enquiries_scope",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "forms_blocks_upload_mime_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_upload" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_upload_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox_group_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox_group_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox_group" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox_group_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions_submission_uploads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "forms_blocks_upload_mime_types" CASCADE;
  DROP TABLE "forms_blocks_upload" CASCADE;
  DROP TABLE "forms_blocks_upload_locales" CASCADE;
  DROP TABLE "forms_blocks_radio_options" CASCADE;
  DROP TABLE "forms_blocks_radio_options_locales" CASCADE;
  DROP TABLE "forms_blocks_radio" CASCADE;
  DROP TABLE "forms_blocks_radio_locales" CASCADE;
  DROP TABLE "forms_blocks_checkbox_group_options" CASCADE;
  DROP TABLE "forms_blocks_checkbox_group_options_locales" CASCADE;
  DROP TABLE "forms_blocks_checkbox_group" CASCADE;
  DROP TABLE "forms_blocks_checkbox_group_locales" CASCADE;
  DROP TABLE "form_submissions_submission_uploads" CASCADE;
  DROP TABLE "form_submissions_rels" CASCADE;
  ALTER TABLE "enquiries" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "enquiries" ALTER COLUMN "email" SET NOT NULL;
  ALTER TABLE "enquiries" ALTER COLUMN "address" SET NOT NULL;
  ALTER TABLE "enquiries" ALTER COLUMN "project_type" SET DATA TYPE "public"."enum_enquiries_project_type" USING "project_type"::"public"."enum_enquiries_project_type";
  ALTER TABLE "enquiries" ALTER COLUMN "project_type" SET NOT NULL;
  ALTER TABLE "enquiries" ALTER COLUMN "budget_range" SET DATA TYPE "public"."enum_enquiries_budget_range" USING "budget_range"::"public"."enum_enquiries_budget_range";
  ALTER TABLE "enquiries" ALTER COLUMN "expected_start" SET DATA TYPE "public"."enum_enquiries_expected_start" USING "expected_start"::"public"."enum_enquiries_expected_start";
  ALTER TABLE "enquiries_scope" ADD CONSTRAINT "enquiries_scope_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "enquiries_scope_order_idx" ON "enquiries_scope" USING btree ("order");
  CREATE INDEX "enquiries_scope_parent_idx" ON "enquiries_scope" USING btree ("parent_id");
  ALTER TABLE "enquiries" DROP COLUMN "scope";
  ALTER TABLE "enquiries" DROP COLUMN "additional_answers";
  ALTER TABLE "forms" DROP COLUMN "enquiry_form";
  DROP TYPE "public"."enum_forms_blocks_upload_upload_collection";`)
}
