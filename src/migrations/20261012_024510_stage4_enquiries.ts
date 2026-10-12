import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_enquiries_scope" AS ENUM('full-joinery', 'kitchen', 'wardrobe', 'bathroom-vanity', 'tv-unit', 'other');
  CREATE TYPE "public"."enum_enquiries_spaces" AS ENUM('kitchen', 'wardrobe', 'bathroom-vanity');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'contacted', 'qualified', 'closed');
  CREATE TYPE "public"."enum_enquiries_locale" AS ENUM('en', 'zh');
  CREATE TYPE "public"."enum_enquiries_project_type" AS ENUM('residential', 'commercial', 'joinery');
  CREATE TYPE "public"."enum_enquiries_budget_range" AS ENUM('under-50k', '50k-100k', '100k-250k', '250k-500k', 'over-500k');
  CREATE TYPE "public"."enum_enquiries_expected_start" AS ENUM('asap', '1-3-months', '3-6-months', '6-12-months', 'planning');
  CREATE TYPE "public"."enum_enquiries_notification_status" AS ENUM('pending', 'sent', 'skipped', 'failed');
  CREATE TABLE "enquiry_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"original_name" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'enquiry-files/',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "enquiries_scope" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_enquiries_scope",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "enquiries_spaces" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_enquiries_spaces",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"submission_reference" varchar NOT NULL,
  	"client_submission_id" varchar NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"status" "enum_enquiries_status" DEFAULT 'new' NOT NULL,
  	"locale" "enum_enquiries_locale" DEFAULT 'en' NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar,
  	"email" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"project_type" "enum_enquiries_project_type" NOT NULL,
  	"project_type_detail" varchar,
  	"notes" varchar,
  	"budget_range" "enum_enquiries_budget_range",
  	"expected_start" "enum_enquiries_expected_start",
  	"internal_notes" varchar,
  	"notification_status" "enum_enquiries_notification_status" DEFAULT 'pending' NOT NULL,
  	"notification_detail" varchar,
  	"submitter_ip" varchar,
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "enquiries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"enquiry_files_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "enquiry_files_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "enquiries_id" integer;
  ALTER TABLE "enquiries_scope" ADD CONSTRAINT "enquiries_scope_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "enquiries_spaces" ADD CONSTRAINT "enquiries_spaces_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "enquiries_rels" ADD CONSTRAINT "enquiries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "enquiries_rels" ADD CONSTRAINT "enquiries_rels_enquiry_files_fk" FOREIGN KEY ("enquiry_files_id") REFERENCES "public"."enquiry_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "enquiry_files_updated_at_idx" ON "enquiry_files" USING btree ("updated_at");
  CREATE INDEX "enquiry_files_created_at_idx" ON "enquiry_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "enquiry_files_filename_idx" ON "enquiry_files" USING btree ("filename");
  CREATE INDEX "enquiries_scope_order_idx" ON "enquiries_scope" USING btree ("order");
  CREATE INDEX "enquiries_scope_parent_idx" ON "enquiries_scope" USING btree ("parent_id");
  CREATE INDEX "enquiries_spaces_order_idx" ON "enquiries_spaces" USING btree ("order");
  CREATE INDEX "enquiries_spaces_parent_idx" ON "enquiries_spaces" USING btree ("parent_id");
  CREATE UNIQUE INDEX "enquiries_submission_reference_idx" ON "enquiries" USING btree ("submission_reference");
  CREATE UNIQUE INDEX "enquiries_client_submission_id_idx" ON "enquiries" USING btree ("client_submission_id");
  CREATE INDEX "enquiries_submitted_at_idx" ON "enquiries" USING btree ("submitted_at");
  CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");
  CREATE INDEX "enquiries_email_idx" ON "enquiries" USING btree ("email");
  CREATE INDEX "enquiries_project_type_idx" ON "enquiries" USING btree ("project_type");
  CREATE INDEX "enquiries_submitter_ip_idx" ON "enquiries" USING btree ("submitter_ip");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "enquiries_rels_order_idx" ON "enquiries_rels" USING btree ("order");
  CREATE INDEX "enquiries_rels_parent_idx" ON "enquiries_rels" USING btree ("parent_id");
  CREATE INDEX "enquiries_rels_path_idx" ON "enquiries_rels" USING btree ("path");
  CREATE INDEX "enquiries_rels_enquiry_files_id_idx" ON "enquiries_rels" USING btree ("enquiry_files_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiry_files_fk" FOREIGN KEY ("enquiry_files_id") REFERENCES "public"."enquiry_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_enquiry_files_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiry_files_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "enquiry_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "enquiries_scope" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "enquiries_spaces" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "enquiries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "enquiries_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "enquiry_files" CASCADE;
  DROP TABLE "enquiries_scope" CASCADE;
  DROP TABLE "enquiries_spaces" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "enquiries_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_enquiry_files_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_enquiries_fk";
  
  DROP INDEX "payload_locked_documents_rels_enquiry_files_id_idx";
  DROP INDEX "payload_locked_documents_rels_enquiries_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "enquiry_files_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "enquiries_id";
  DROP TYPE "public"."enum_enquiries_scope";
  DROP TYPE "public"."enum_enquiries_spaces";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_enquiries_locale";
  DROP TYPE "public"."enum_enquiries_project_type";
  DROP TYPE "public"."enum_enquiries_budget_range";
  DROP TYPE "public"."enum_enquiries_expected_start";
  DROP TYPE "public"."enum_enquiries_notification_status";`)
}
