import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_enabled_trades" AS ENUM('siteworks-demolition', 'structural-concrete', 'roofing-external', 'plumbing-drainage', 'electrical-mechanical', 'internal-linings', 'interior-fitout', 'landscaping');
  CREATE TYPE "public"."enum__projects_v_version_enabled_trades" AS ENUM('siteworks-demolition', 'structural-concrete', 'roofing-external', 'plumbing-drainage', 'electrical-mechanical', 'internal-linings', 'interior-fitout', 'landscaping');
  CREATE TYPE "public"."enum_swms_documents_trades" AS ENUM('siteworks-demolition', 'structural-concrete', 'roofing-external', 'plumbing-drainage', 'electrical-mechanical', 'internal-linings', 'interior-fitout', 'landscaping');
  CREATE TYPE "public"."enum_swms_documents_status" AS ENUM('active', 'archived');
  CREATE TYPE "public"."enum_swms_acknowledgements_trades" AS ENUM('siteworks-demolition', 'structural-concrete', 'roofing-external', 'plumbing-drainage', 'electrical-mechanical', 'internal-linings', 'interior-fitout', 'landscaping');
  CREATE TYPE "public"."enum_swms_document_confirmations_trades" AS ENUM('siteworks-demolition', 'structural-concrete', 'roofing-external', 'plumbing-drainage', 'electrical-mechanical', 'internal-linings', 'interior-fitout', 'landscaping');
  CREATE TYPE "public"."enum_swms_document_confirmations_source" AS ENUM('induction', 'reconfirm');
  CREATE TYPE "public"."enum_site_attendance_direction" AS ENUM('in', 'out');
  CREATE TYPE "public"."enum_site_safety_reports_kind" AS ENUM('incident', 'hazard', 'toolbox');
  CREATE TABLE "projects_enabled_trades" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projects_enabled_trades",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_enabled_trades" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__projects_v_version_enabled_trades",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "swms_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"prefix" varchar DEFAULT 'swms-files/',
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
  
  CREATE TABLE "swms_documents_trades" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_swms_documents_trades",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "swms_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"project_id" integer NOT NULL,
  	"file_id" integer NOT NULL,
  	"status" "enum_swms_documents_status" DEFAULT 'active' NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"file_version" numeric DEFAULT 1,
  	"version_label" varchar,
  	"access_token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "swms_acknowledgements_trades" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_swms_acknowledgements_trades",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "swms_document_confirmations_trades" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_swms_document_confirmations_trades",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "swms_document_confirmations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project_id" integer NOT NULL,
  	"document_id" integer NOT NULL,
  	"file_id" integer NOT NULL,
  	"file_version" numeric NOT NULL,
  	"version_label" varchar NOT NULL,
  	"document_title" varchar NOT NULL,
  	"worker_name" varchar NOT NULL,
  	"worker_phone" varchar NOT NULL,
  	"worker_name_key" varchar NOT NULL,
  	"worker_phone_key" varchar NOT NULL,
  	"confirmed_at" timestamp(3) with time zone NOT NULL,
  	"source" "enum_swms_document_confirmations_source" DEFAULT 'induction' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_attendance" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project_id" integer NOT NULL,
  	"project_swms_id" integer NOT NULL,
  	"worker_name" varchar NOT NULL,
  	"worker_phone" varchar NOT NULL,
  	"worker_name_key" varchar NOT NULL,
  	"worker_phone_key" varchar NOT NULL,
  	"direction" "enum_site_attendance_direction" NOT NULL,
  	"recorded_at" timestamp(3) with time zone NOT NULL,
  	"metadata_ip_address" varchar,
  	"metadata_user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_safety_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_site_safety_reports_kind" NOT NULL,
  	"summary" varchar NOT NULL,
  	"project_id" integer NOT NULL,
  	"worker_name" varchar NOT NULL,
  	"worker_phone" varchar NOT NULL,
  	"worker_name_key" varchar NOT NULL,
  	"worker_phone_key" varchar NOT NULL,
  	"occurred_at" timestamp(3) with time zone NOT NULL,
  	"description" varchar NOT NULL,
  	"attachment_id" integer,
  	"metadata_ip_address" varchar,
  	"metadata_user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "swms_acknowledgements" ADD COLUMN "worker_name_key" varchar;
  ALTER TABLE "swms_acknowledgements" ADD COLUMN "worker_phone_key" varchar;
  ALTER TABLE "swms_acknowledgements" ADD COLUMN "swms_confirmations" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "swms_files_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "swms_documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "swms_document_confirmations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "site_attendance_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "site_safety_reports_id" integer;
  ALTER TABLE "projects_enabled_trades" ADD CONSTRAINT "projects_enabled_trades_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_enabled_trades" ADD CONSTRAINT "_projects_v_version_enabled_trades_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "swms_documents_trades" ADD CONSTRAINT "swms_documents_trades_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."swms_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "swms_documents" ADD CONSTRAINT "swms_documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "swms_documents" ADD CONSTRAINT "swms_documents_file_id_swms_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."swms_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "swms_acknowledgements_trades" ADD CONSTRAINT "swms_acknowledgements_trades_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."swms_acknowledgements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "swms_document_confirmations_trades" ADD CONSTRAINT "swms_document_confirmations_trades_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."swms_document_confirmations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "swms_document_confirmations" ADD CONSTRAINT "swms_document_confirmations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "swms_document_confirmations" ADD CONSTRAINT "swms_document_confirmations_document_id_swms_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."swms_documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "swms_document_confirmations" ADD CONSTRAINT "swms_document_confirmations_file_id_swms_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."swms_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_attendance" ADD CONSTRAINT "site_attendance_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_attendance" ADD CONSTRAINT "site_attendance_project_swms_id_project_swms_id_fk" FOREIGN KEY ("project_swms_id") REFERENCES "public"."project_swms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_safety_reports" ADD CONSTRAINT "site_safety_reports_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_safety_reports" ADD CONSTRAINT "site_safety_reports_attachment_id_swms_files_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."swms_files"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_enabled_trades_order_idx" ON "projects_enabled_trades" USING btree ("order");
  CREATE INDEX "projects_enabled_trades_parent_idx" ON "projects_enabled_trades" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_enabled_trades_order_idx" ON "_projects_v_version_enabled_trades" USING btree ("order");
  CREATE INDEX "_projects_v_version_enabled_trades_parent_idx" ON "_projects_v_version_enabled_trades" USING btree ("parent_id");
  CREATE INDEX "swms_files_updated_at_idx" ON "swms_files" USING btree ("updated_at");
  CREATE INDEX "swms_files_created_at_idx" ON "swms_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "swms_files_filename_idx" ON "swms_files" USING btree ("filename");
  CREATE INDEX "swms_documents_trades_order_idx" ON "swms_documents_trades" USING btree ("order");
  CREATE INDEX "swms_documents_trades_parent_idx" ON "swms_documents_trades" USING btree ("parent_id");
  CREATE INDEX "swms_documents_project_idx" ON "swms_documents" USING btree ("project_id");
  CREATE INDEX "swms_documents_file_idx" ON "swms_documents" USING btree ("file_id");
  CREATE UNIQUE INDEX "swms_documents_access_token_idx" ON "swms_documents" USING btree ("access_token");
  CREATE INDEX "swms_documents_updated_at_idx" ON "swms_documents" USING btree ("updated_at");
  CREATE INDEX "swms_documents_created_at_idx" ON "swms_documents" USING btree ("created_at");
  CREATE INDEX "swms_acknowledgements_trades_order_idx" ON "swms_acknowledgements_trades" USING btree ("order");
  CREATE INDEX "swms_acknowledgements_trades_parent_idx" ON "swms_acknowledgements_trades" USING btree ("parent_id");
  CREATE INDEX "swms_document_confirmations_trades_order_idx" ON "swms_document_confirmations_trades" USING btree ("order");
  CREATE INDEX "swms_document_confirmations_trades_parent_idx" ON "swms_document_confirmations_trades" USING btree ("parent_id");
  CREATE INDEX "swms_document_confirmations_project_idx" ON "swms_document_confirmations" USING btree ("project_id");
  CREATE INDEX "swms_document_confirmations_document_idx" ON "swms_document_confirmations" USING btree ("document_id");
  CREATE INDEX "swms_document_confirmations_file_idx" ON "swms_document_confirmations" USING btree ("file_id");
  CREATE INDEX "swms_document_confirmations_worker_name_key_idx" ON "swms_document_confirmations" USING btree ("worker_name_key");
  CREATE INDEX "swms_document_confirmations_worker_phone_key_idx" ON "swms_document_confirmations" USING btree ("worker_phone_key");
  CREATE INDEX "swms_document_confirmations_updated_at_idx" ON "swms_document_confirmations" USING btree ("updated_at");
  CREATE INDEX "swms_document_confirmations_created_at_idx" ON "swms_document_confirmations" USING btree ("created_at");
  CREATE INDEX "site_attendance_project_idx" ON "site_attendance" USING btree ("project_id");
  CREATE INDEX "site_attendance_project_swms_idx" ON "site_attendance" USING btree ("project_swms_id");
  CREATE INDEX "site_attendance_worker_name_key_idx" ON "site_attendance" USING btree ("worker_name_key");
  CREATE INDEX "site_attendance_worker_phone_key_idx" ON "site_attendance" USING btree ("worker_phone_key");
  CREATE INDEX "site_attendance_updated_at_idx" ON "site_attendance" USING btree ("updated_at");
  CREATE INDEX "site_attendance_created_at_idx" ON "site_attendance" USING btree ("created_at");
  CREATE INDEX "site_safety_reports_kind_idx" ON "site_safety_reports" USING btree ("kind");
  CREATE INDEX "site_safety_reports_project_idx" ON "site_safety_reports" USING btree ("project_id");
  CREATE INDEX "site_safety_reports_worker_name_key_idx" ON "site_safety_reports" USING btree ("worker_name_key");
  CREATE INDEX "site_safety_reports_worker_phone_key_idx" ON "site_safety_reports" USING btree ("worker_phone_key");
  CREATE INDEX "site_safety_reports_attachment_idx" ON "site_safety_reports" USING btree ("attachment_id");
  CREATE INDEX "site_safety_reports_updated_at_idx" ON "site_safety_reports" USING btree ("updated_at");
  CREATE INDEX "site_safety_reports_created_at_idx" ON "site_safety_reports" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_swms_files_fk" FOREIGN KEY ("swms_files_id") REFERENCES "public"."swms_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_swms_documents_fk" FOREIGN KEY ("swms_documents_id") REFERENCES "public"."swms_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_swms_document_confirmations_fk" FOREIGN KEY ("swms_document_confirmations_id") REFERENCES "public"."swms_document_confirmations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_attendance_fk" FOREIGN KEY ("site_attendance_id") REFERENCES "public"."site_attendance"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_safety_reports_fk" FOREIGN KEY ("site_safety_reports_id") REFERENCES "public"."site_safety_reports"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "swms_acknowledgements_worker_name_key_idx" ON "swms_acknowledgements" USING btree ("worker_name_key");
  CREATE INDEX "swms_acknowledgements_worker_phone_key_idx" ON "swms_acknowledgements" USING btree ("worker_phone_key");
  CREATE INDEX "payload_locked_documents_rels_swms_files_id_idx" ON "payload_locked_documents_rels" USING btree ("swms_files_id");
  CREATE INDEX "payload_locked_documents_rels_swms_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("swms_documents_id");
  CREATE INDEX "payload_locked_documents_rels_swms_document_confirmation_idx" ON "payload_locked_documents_rels" USING btree ("swms_document_confirmations_id");
  CREATE INDEX "payload_locked_documents_rels_site_attendance_id_idx" ON "payload_locked_documents_rels" USING btree ("site_attendance_id");
  CREATE INDEX "payload_locked_documents_rels_site_safety_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("site_safety_reports_id");`)

  await db.execute(sql`
   UPDATE "swms_acknowledgements"
   SET
     "worker_name_key" = lower(regexp_replace(btrim("worker_name"), '[[:space:]]+', ' ', 'g')),
     "worker_phone_key" = CASE
       WHEN length(regexp_replace(coalesce("worker_phone", ''), '[^0-9]', '', 'g')) = 11
         AND regexp_replace(coalesce("worker_phone", ''), '[^0-9]', '', 'g') LIKE '61%'
       THEN '0' || substring(regexp_replace(coalesce("worker_phone", ''), '[^0-9]', '', 'g') from 3)
       ELSE regexp_replace(coalesce("worker_phone", ''), '[^0-9]', '', 'g')
     END
   WHERE "worker_name_key" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_enabled_trades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_enabled_trades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_documents_trades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_acknowledgements_trades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_document_confirmations_trades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_document_confirmations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_attendance" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_safety_reports" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_enabled_trades" CASCADE;
  DROP TABLE "_projects_v_version_enabled_trades" CASCADE;
  DROP TABLE "swms_files" CASCADE;
  DROP TABLE "swms_documents_trades" CASCADE;
  DROP TABLE "swms_documents" CASCADE;
  DROP TABLE "swms_acknowledgements_trades" CASCADE;
  DROP TABLE "swms_document_confirmations_trades" CASCADE;
  DROP TABLE "swms_document_confirmations" CASCADE;
  DROP TABLE "site_attendance" CASCADE;
  DROP TABLE "site_safety_reports" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_swms_files_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_swms_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_swms_document_confirmations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_site_attendance_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_site_safety_reports_fk";
  
  DROP INDEX "swms_acknowledgements_worker_name_key_idx";
  DROP INDEX "swms_acknowledgements_worker_phone_key_idx";
  DROP INDEX "payload_locked_documents_rels_swms_files_id_idx";
  DROP INDEX "payload_locked_documents_rels_swms_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_swms_document_confirmation_idx";
  DROP INDEX "payload_locked_documents_rels_site_attendance_id_idx";
  DROP INDEX "payload_locked_documents_rels_site_safety_reports_id_idx";
  ALTER TABLE "swms_acknowledgements" DROP COLUMN "worker_name_key";
  ALTER TABLE "swms_acknowledgements" DROP COLUMN "worker_phone_key";
  ALTER TABLE "swms_acknowledgements" DROP COLUMN "swms_confirmations";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "swms_files_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "swms_documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "swms_document_confirmations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "site_attendance_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "site_safety_reports_id";
  DROP TYPE "public"."enum_projects_enabled_trades";
  DROP TYPE "public"."enum__projects_v_version_enabled_trades";
  DROP TYPE "public"."enum_swms_documents_trades";
  DROP TYPE "public"."enum_swms_documents_status";
  DROP TYPE "public"."enum_swms_acknowledgements_trades";
  DROP TYPE "public"."enum_swms_document_confirmations_trades";
  DROP TYPE "public"."enum_swms_document_confirmations_source";
  DROP TYPE "public"."enum_site_attendance_direction";
  DROP TYPE "public"."enum_site_safety_reports_kind";`)
}
