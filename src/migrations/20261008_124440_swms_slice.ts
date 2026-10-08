import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_type" AS ENUM('residential', 'commercial');
  CREATE TYPE "public"."enum_projects_project_status" AS ENUM('active', 'completed', 'on-hold');
  CREATE TYPE "public"."enum_swms_templates_sections_questions_type" AS ENUM('yes-no', 'yes-no-na', 'acknowledgement');
  CREATE TYPE "public"."enum_swms_templates_sections_questions_correct_answer" AS ENUM('yes', 'no', 'any');
  CREATE TYPE "public"."enum_swms_templates_status" AS ENUM('active', 'archived');
  CREATE TYPE "public"."enum_project_swms_sections_questions_type" AS ENUM('yes-no', 'yes-no-na', 'acknowledgement');
  CREATE TYPE "public"."enum_project_swms_sections_questions_correct_answer" AS ENUM('yes', 'no', 'any');
  CREATE TYPE "public"."enum_project_swms_status" AS ENUM('draft', 'active', 'superseded', 'archived');
  CREATE TYPE "public"."enum_swms_versions_sections_questions_type" AS ENUM('yes-no', 'yes-no-na', 'acknowledgement');
  CREATE TYPE "public"."enum_swms_versions_sections_questions_correct_answer" AS ENUM('yes', 'no', 'any');
  CREATE TYPE "public"."enum_swms_versions_status" AS ENUM('draft', 'published', 'superseded');
  ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'builder' BEFORE 'highImpact';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'builder' BEFORE 'highImpact';
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"suburb" varchar,
  	"type" "enum_projects_type" DEFAULT 'residential' NOT NULL,
  	"project_status" "enum_projects_project_status" DEFAULT 'active' NOT NULL,
  	"show_address_publicly" boolean DEFAULT false,
  	"summary" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "swms_templates_sections_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"type" "enum_swms_templates_sections_questions_type" DEFAULT 'yes-no' NOT NULL,
  	"required" boolean DEFAULT true,
  	"correct_answer" "enum_swms_templates_sections_questions_correct_answer" DEFAULT 'yes'
  );
  
  CREATE TABLE "swms_templates_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar
  );
  
  CREATE TABLE "swms_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"status" "enum_swms_templates_status" DEFAULT 'active' NOT NULL,
  	"acknowledgement_text" varchar DEFAULT 'I have read and understood this Safe Work Method Statement. I agree to follow the safe work practices outlined above.' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "project_swms_sections_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"type" "enum_project_swms_sections_questions_type" DEFAULT 'yes-no' NOT NULL,
  	"required" boolean DEFAULT true,
  	"correct_answer" "enum_project_swms_sections_questions_correct_answer" DEFAULT 'yes'
  );
  
  CREATE TABLE "project_swms_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar
  );
  
  CREATE TABLE "project_swms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"project_id" integer NOT NULL,
  	"source_template_id" integer,
  	"status" "enum_project_swms_status" DEFAULT 'draft' NOT NULL,
  	"public_token" varchar,
  	"current_version_id" integer,
  	"activated_at" timestamp(3) with time zone,
  	"acknowledgement_text" varchar DEFAULT 'I have read and understood this Safe Work Method Statement. I agree to follow the safe work practices outlined above.' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "swms_versions_sections_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"type" "enum_swms_versions_sections_questions_type" DEFAULT 'yes-no' NOT NULL,
  	"required" boolean DEFAULT true,
  	"correct_answer" "enum_swms_versions_sections_questions_correct_answer" DEFAULT 'yes'
  );
  
  CREATE TABLE "swms_versions_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar
  );
  
  CREATE TABLE "swms_versions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_label" varchar NOT NULL,
  	"project_swms_id" integer NOT NULL,
  	"project_id" integer NOT NULL,
  	"status" "enum_swms_versions_status" DEFAULT 'draft' NOT NULL,
  	"acknowledgement_text" varchar DEFAULT 'I have read and understood this Safe Work Method Statement. I agree to follow the safe work practices outlined above.' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"superseded_at" timestamp(3) with time zone,
  	"published_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "swms_acknowledgements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"submission_ref" varchar,
  	"client_submission_id" varchar NOT NULL,
  	"project_id" integer NOT NULL,
  	"project_swms_id" integer NOT NULL,
  	"swms_version_id" integer NOT NULL,
  	"worker_name" varchar NOT NULL,
  	"worker_company" varchar,
  	"worker_phone" varchar,
  	"worker_trade" varchar,
  	"responses" jsonb NOT NULL,
  	"acknowledgement_accepted" boolean DEFAULT false NOT NULL,
  	"signature" varchar NOT NULL,
  	"signed_at" timestamp(3) with time zone NOT NULL,
  	"metadata_ip_address" varchar,
  	"metadata_user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT IF EXISTS "pages_rels_posts_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT IF EXISTS "pages_rels_categories_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT IF EXISTS "_pages_v_rels_posts_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT IF EXISTS "_pages_v_rels_categories_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_search_fk";
  
  ALTER TABLE "header_rels" DROP CONSTRAINT IF EXISTS "header_rels_posts_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT IF EXISTS "footer_rels_posts_fk";
  
  DROP INDEX IF EXISTS "pages_rels_posts_id_idx";
  DROP INDEX IF EXISTS "pages_rels_categories_id_idx";
  DROP INDEX IF EXISTS "_pages_v_rels_posts_id_idx";
  DROP INDEX IF EXISTS "_pages_v_rels_categories_id_idx";
  DROP INDEX IF EXISTS "redirects_rels_posts_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_categories_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_search_id_idx";
  DROP INDEX IF EXISTS "header_rels_posts_id_idx";
  DROP INDEX IF EXISTS "footer_rels_posts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "swms_templates_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "project_swms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "swms_versions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "swms_acknowledgements_id" integer;
  ALTER TABLE "swms_templates_sections_questions" ADD CONSTRAINT "swms_templates_sections_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."swms_templates_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "swms_templates_sections" ADD CONSTRAINT "swms_templates_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."swms_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_swms_sections_questions" ADD CONSTRAINT "project_swms_sections_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_swms_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_swms_sections" ADD CONSTRAINT "project_swms_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_swms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_swms" ADD CONSTRAINT "project_swms_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_swms" ADD CONSTRAINT "project_swms_source_template_id_swms_templates_id_fk" FOREIGN KEY ("source_template_id") REFERENCES "public"."swms_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_swms" ADD CONSTRAINT "project_swms_current_version_id_swms_versions_id_fk" FOREIGN KEY ("current_version_id") REFERENCES "public"."swms_versions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "swms_versions_sections_questions" ADD CONSTRAINT "swms_versions_sections_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."swms_versions_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "swms_versions_sections" ADD CONSTRAINT "swms_versions_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."swms_versions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "swms_versions" ADD CONSTRAINT "swms_versions_project_swms_id_project_swms_id_fk" FOREIGN KEY ("project_swms_id") REFERENCES "public"."project_swms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "swms_versions" ADD CONSTRAINT "swms_versions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "swms_versions" ADD CONSTRAINT "swms_versions_published_by_id_users_id_fk" FOREIGN KEY ("published_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "swms_acknowledgements" ADD CONSTRAINT "swms_acknowledgements_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "swms_acknowledgements" ADD CONSTRAINT "swms_acknowledgements_project_swms_id_project_swms_id_fk" FOREIGN KEY ("project_swms_id") REFERENCES "public"."project_swms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "swms_acknowledgements" ADD CONSTRAINT "swms_acknowledgements_swms_version_id_swms_versions_id_fk" FOREIGN KEY ("swms_version_id") REFERENCES "public"."swms_versions"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "swms_templates_sections_questions_order_idx" ON "swms_templates_sections_questions" USING btree ("_order");
  CREATE INDEX "swms_templates_sections_questions_parent_id_idx" ON "swms_templates_sections_questions" USING btree ("_parent_id");
  CREATE INDEX "swms_templates_sections_order_idx" ON "swms_templates_sections" USING btree ("_order");
  CREATE INDEX "swms_templates_sections_parent_id_idx" ON "swms_templates_sections" USING btree ("_parent_id");
  CREATE INDEX "swms_templates_updated_at_idx" ON "swms_templates" USING btree ("updated_at");
  CREATE INDEX "swms_templates_created_at_idx" ON "swms_templates" USING btree ("created_at");
  CREATE INDEX "project_swms_sections_questions_order_idx" ON "project_swms_sections_questions" USING btree ("_order");
  CREATE INDEX "project_swms_sections_questions_parent_id_idx" ON "project_swms_sections_questions" USING btree ("_parent_id");
  CREATE INDEX "project_swms_sections_order_idx" ON "project_swms_sections" USING btree ("_order");
  CREATE INDEX "project_swms_sections_parent_id_idx" ON "project_swms_sections" USING btree ("_parent_id");
  CREATE INDEX "project_swms_project_idx" ON "project_swms" USING btree ("project_id");
  CREATE INDEX "project_swms_source_template_idx" ON "project_swms" USING btree ("source_template_id");
  CREATE INDEX "project_swms_status_idx" ON "project_swms" USING btree ("status");
  CREATE UNIQUE INDEX "project_swms_public_token_idx" ON "project_swms" USING btree ("public_token");
  CREATE INDEX "project_swms_current_version_idx" ON "project_swms" USING btree ("current_version_id");
  CREATE INDEX "project_swms_updated_at_idx" ON "project_swms" USING btree ("updated_at");
  CREATE INDEX "project_swms_created_at_idx" ON "project_swms" USING btree ("created_at");
  CREATE INDEX "swms_versions_sections_questions_order_idx" ON "swms_versions_sections_questions" USING btree ("_order");
  CREATE INDEX "swms_versions_sections_questions_parent_id_idx" ON "swms_versions_sections_questions" USING btree ("_parent_id");
  CREATE INDEX "swms_versions_sections_order_idx" ON "swms_versions_sections" USING btree ("_order");
  CREATE INDEX "swms_versions_sections_parent_id_idx" ON "swms_versions_sections" USING btree ("_parent_id");
  CREATE INDEX "swms_versions_project_swms_idx" ON "swms_versions" USING btree ("project_swms_id");
  CREATE INDEX "swms_versions_project_idx" ON "swms_versions" USING btree ("project_id");
  CREATE INDEX "swms_versions_published_by_idx" ON "swms_versions" USING btree ("published_by_id");
  CREATE INDEX "swms_versions_updated_at_idx" ON "swms_versions" USING btree ("updated_at");
  CREATE INDEX "swms_versions_created_at_idx" ON "swms_versions" USING btree ("created_at");
  CREATE UNIQUE INDEX "swms_acknowledgements_submission_ref_idx" ON "swms_acknowledgements" USING btree ("submission_ref");
  CREATE UNIQUE INDEX "swms_acknowledgements_client_submission_id_idx" ON "swms_acknowledgements" USING btree ("client_submission_id");
  CREATE INDEX "swms_acknowledgements_project_idx" ON "swms_acknowledgements" USING btree ("project_id");
  CREATE INDEX "swms_acknowledgements_project_swms_idx" ON "swms_acknowledgements" USING btree ("project_swms_id");
  CREATE INDEX "swms_acknowledgements_swms_version_idx" ON "swms_acknowledgements" USING btree ("swms_version_id");
  CREATE INDEX "swms_acknowledgements_updated_at_idx" ON "swms_acknowledgements" USING btree ("updated_at");
  CREATE INDEX "swms_acknowledgements_created_at_idx" ON "swms_acknowledgements" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_swms_templates_fk" FOREIGN KEY ("swms_templates_id") REFERENCES "public"."swms_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_swms_fk" FOREIGN KEY ("project_swms_id") REFERENCES "public"."project_swms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_swms_versions_fk" FOREIGN KEY ("swms_versions_id") REFERENCES "public"."swms_versions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_swms_acknowledgements_fk" FOREIGN KEY ("swms_acknowledgements_id") REFERENCES "public"."swms_acknowledgements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_swms_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("swms_templates_id");
  CREATE INDEX "payload_locked_documents_rels_project_swms_id_idx" ON "payload_locked_documents_rels" USING btree ("project_swms_id");
  CREATE INDEX "payload_locked_documents_rels_swms_versions_id_idx" ON "payload_locked_documents_rels" USING btree ("swms_versions_id");
  CREATE INDEX "payload_locked_documents_rels_swms_acknowledgements_id_idx" ON "payload_locked_documents_rels" USING btree ("swms_acknowledgements_id");
  ALTER TABLE "pages_rels" DROP COLUMN "posts_id";
  ALTER TABLE "pages_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "posts_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "search_id";
  ALTER TABLE "header_rels" DROP COLUMN "posts_id";
  ALTER TABLE "footer_rels" DROP COLUMN "posts_id";
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_templates_sections_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_templates_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_swms_sections_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_swms_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_swms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_versions_sections_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_versions_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_versions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "swms_acknowledgements" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "swms_templates_sections_questions" CASCADE;
  DROP TABLE "swms_templates_sections" CASCADE;
  DROP TABLE "swms_templates" CASCADE;
  DROP TABLE "project_swms_sections_questions" CASCADE;
  DROP TABLE "project_swms_sections" CASCADE;
  DROP TABLE "project_swms" CASCADE;
  DROP TABLE "swms_versions_sections_questions" CASCADE;
  DROP TABLE "swms_versions_sections" CASCADE;
  DROP TABLE "swms_versions" CASCADE;
  DROP TABLE "swms_acknowledgements" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_swms_templates_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_project_swms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_swms_versions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_swms_acknowledgements_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_swms_templates_id_idx";
  DROP INDEX "payload_locked_documents_rels_project_swms_id_idx";
  DROP INDEX "payload_locked_documents_rels_swms_versions_id_idx";
  DROP INDEX "payload_locked_documents_rels_swms_acknowledgements_id_idx";
  ALTER TABLE "pages_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "search_id" integer;
  ALTER TABLE "header_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "footer_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "swms_templates_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "project_swms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "swms_versions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "swms_acknowledgements_id";
  DROP TYPE "public"."enum_projects_type";
  DROP TYPE "public"."enum_projects_project_status";
  DROP TYPE "public"."enum_swms_templates_sections_questions_type";
  DROP TYPE "public"."enum_swms_templates_sections_questions_correct_answer";
  DROP TYPE "public"."enum_swms_templates_status";
  DROP TYPE "public"."enum_project_swms_sections_questions_type";
  DROP TYPE "public"."enum_project_swms_sections_questions_correct_answer";
  DROP TYPE "public"."enum_project_swms_status";
  DROP TYPE "public"."enum_swms_versions_sections_questions_type";
  DROP TYPE "public"."enum_swms_versions_sections_questions_correct_answer";
  DROP TYPE "public"."enum_swms_versions_status";`)
}
