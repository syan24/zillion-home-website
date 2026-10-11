import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_page_intro_layout" AS ENUM('text', 'split');
  CREATE TYPE "public"."enum_pages_blocks_split_feature_links_variant" AS ENUM('enquiry', 'outline', 'default');
  CREATE TYPE "public"."enum_pages_blocks_split_feature_variant" AS ENUM('briefs', 'checklist', 'darkCopy');
  CREATE TYPE "public"."enum_pages_blocks_process_section_variant" AS ENUM('split', 'centered');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_links_variant" AS ENUM('enquiry', 'outline', 'default');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_tone" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__pages_v_blocks_page_intro_layout" AS ENUM('text', 'split');
  CREATE TYPE "public"."enum__pages_v_blocks_split_feature_links_variant" AS ENUM('enquiry', 'outline', 'default');
  CREATE TYPE "public"."enum__pages_v_blocks_split_feature_variant" AS ENUM('briefs', 'checklist', 'darkCopy');
  CREATE TYPE "public"."enum__pages_v_blocks_process_section_variant" AS ENUM('split', 'centered');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_links_variant" AS ENUM('enquiry', 'outline', 'default');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_tone" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_header_secondary_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_service_links_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "pages_blocks_page_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_page_intro_layout" DEFAULT 'text',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_accent" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_service_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_service_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_split_feature_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"title" varchar,
  	"subtitle" varchar
  );
  
  CREATE TABLE "pages_blocks_split_feature_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"variant" "enum_pages_blocks_split_feature_links_variant" DEFAULT 'enquiry'
  );
  
  CREATE TABLE "pages_blocks_split_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_split_feature_variant" DEFAULT 'briefs',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_accent" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_process_section_trust_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_process_section_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_process_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_process_section_variant" DEFAULT 'split',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_category_bar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "pages_blocks_category_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_band_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"variant" "enum_pages_blocks_cta_band_links_variant" DEFAULT 'enquiry'
  );
  
  CREATE TABLE "pages_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_pages_blocks_cta_band_tone" DEFAULT 'dark',
  	"heading" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_prose_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_capability_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_capability_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_service_details_services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_service_details_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"enquire_label" varchar
  );
  
  CREATE TABLE "pages_blocks_service_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__pages_v_blocks_page_intro_layout" DEFAULT 'text',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_accent" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_feature_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_feature_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"variant" "enum__pages_v_blocks_split_feature_links_variant" DEFAULT 'enquiry',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_split_feature_variant" DEFAULT 'briefs',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_accent" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_section_trust_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_section_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_process_section_variant" DEFAULT 'split',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_bar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"variant" "enum__pages_v_blocks_cta_band_links_variant" DEFAULT 'enquiry',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum__pages_v_blocks_cta_band_tone" DEFAULT 'dark',
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_prose_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_capability_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_capability_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_details_services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_details_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"enquire_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "header_secondary_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_secondary_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_service_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_service_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  ALTER TABLE "pages" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_headline" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_badge_primary" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_badge_secondary" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_badge_muted" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_eyebrow" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_headline" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_badge_primary" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_badge_secondary" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_badge_muted" varchar;
  ALTER TABLE "footer" ADD COLUMN "blurb" varchar;
  ALTER TABLE "footer" ADD COLUMN "tagline" varchar;
  ALTER TABLE "footer" ADD COLUMN "location" varchar;
  ALTER TABLE "pages_blocks_page_intro" ADD CONSTRAINT "pages_blocks_page_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_intro" ADD CONSTRAINT "pages_blocks_page_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_cards_cards" ADD CONSTRAINT "pages_blocks_service_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_cards_cards" ADD CONSTRAINT "pages_blocks_service_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_cards" ADD CONSTRAINT "pages_blocks_service_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature_items" ADD CONSTRAINT "pages_blocks_split_feature_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature_items" ADD CONSTRAINT "pages_blocks_split_feature_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature_links" ADD CONSTRAINT "pages_blocks_split_feature_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature" ADD CONSTRAINT "pages_blocks_split_feature_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature" ADD CONSTRAINT "pages_blocks_split_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_section_trust_items" ADD CONSTRAINT "pages_blocks_process_section_trust_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_section_trust_items" ADD CONSTRAINT "pages_blocks_process_section_trust_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_section_steps" ADD CONSTRAINT "pages_blocks_process_section_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_section" ADD CONSTRAINT "pages_blocks_process_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_bar_items" ADD CONSTRAINT "pages_blocks_category_bar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_bar" ADD CONSTRAINT "pages_blocks_category_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band_links" ADD CONSTRAINT "pages_blocks_cta_band_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_prose_section" ADD CONSTRAINT "pages_blocks_prose_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capability_list_items" ADD CONSTRAINT "pages_blocks_capability_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capability_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capability_list" ADD CONSTRAINT "pages_blocks_capability_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_details_services_features" ADD CONSTRAINT "pages_blocks_service_details_services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_details_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_details_services" ADD CONSTRAINT "pages_blocks_service_details_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_details_services" ADD CONSTRAINT "pages_blocks_service_details_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_details" ADD CONSTRAINT "pages_blocks_service_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_intro" ADD CONSTRAINT "_pages_v_blocks_page_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_intro" ADD CONSTRAINT "_pages_v_blocks_page_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_cards_cards" ADD CONSTRAINT "_pages_v_blocks_service_cards_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_cards_cards" ADD CONSTRAINT "_pages_v_blocks_service_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_cards" ADD CONSTRAINT "_pages_v_blocks_service_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature_items" ADD CONSTRAINT "_pages_v_blocks_split_feature_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature_items" ADD CONSTRAINT "_pages_v_blocks_split_feature_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature_links" ADD CONSTRAINT "_pages_v_blocks_split_feature_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature" ADD CONSTRAINT "_pages_v_blocks_split_feature_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature" ADD CONSTRAINT "_pages_v_blocks_split_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_section_trust_items" ADD CONSTRAINT "_pages_v_blocks_process_section_trust_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_section_trust_items" ADD CONSTRAINT "_pages_v_blocks_process_section_trust_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_section_steps" ADD CONSTRAINT "_pages_v_blocks_process_section_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_section" ADD CONSTRAINT "_pages_v_blocks_process_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_bar_items" ADD CONSTRAINT "_pages_v_blocks_category_bar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_bar" ADD CONSTRAINT "_pages_v_blocks_category_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band_links" ADD CONSTRAINT "_pages_v_blocks_cta_band_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_prose_section" ADD CONSTRAINT "_pages_v_blocks_prose_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capability_list_items" ADD CONSTRAINT "_pages_v_blocks_capability_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_capability_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capability_list" ADD CONSTRAINT "_pages_v_blocks_capability_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_details_services_features" ADD CONSTRAINT "_pages_v_blocks_service_details_services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_details_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_details_services" ADD CONSTRAINT "_pages_v_blocks_service_details_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_details_services" ADD CONSTRAINT "_pages_v_blocks_service_details_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_details" ADD CONSTRAINT "_pages_v_blocks_service_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_secondary_nav_items" ADD CONSTRAINT "header_secondary_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_service_links" ADD CONSTRAINT "footer_service_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_page_intro_order_idx" ON "pages_blocks_page_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_intro_parent_id_idx" ON "pages_blocks_page_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_intro_path_idx" ON "pages_blocks_page_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_intro_image_idx" ON "pages_blocks_page_intro" USING btree ("image_id");
  CREATE INDEX "pages_blocks_service_cards_cards_order_idx" ON "pages_blocks_service_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_cards_cards_parent_id_idx" ON "pages_blocks_service_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_cards_cards_image_idx" ON "pages_blocks_service_cards_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_service_cards_order_idx" ON "pages_blocks_service_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_cards_parent_id_idx" ON "pages_blocks_service_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_cards_path_idx" ON "pages_blocks_service_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_feature_items_order_idx" ON "pages_blocks_split_feature_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_feature_items_parent_id_idx" ON "pages_blocks_split_feature_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_feature_items_image_idx" ON "pages_blocks_split_feature_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_split_feature_links_order_idx" ON "pages_blocks_split_feature_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_feature_links_parent_id_idx" ON "pages_blocks_split_feature_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_feature_order_idx" ON "pages_blocks_split_feature" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_feature_parent_id_idx" ON "pages_blocks_split_feature" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_feature_path_idx" ON "pages_blocks_split_feature" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_feature_image_idx" ON "pages_blocks_split_feature" USING btree ("image_id");
  CREATE INDEX "pages_blocks_process_section_trust_items_order_idx" ON "pages_blocks_process_section_trust_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_section_trust_items_parent_id_idx" ON "pages_blocks_process_section_trust_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_section_trust_items_image_idx" ON "pages_blocks_process_section_trust_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_process_section_steps_order_idx" ON "pages_blocks_process_section_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_section_steps_parent_id_idx" ON "pages_blocks_process_section_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_section_order_idx" ON "pages_blocks_process_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_section_parent_id_idx" ON "pages_blocks_process_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_section_path_idx" ON "pages_blocks_process_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_category_bar_items_order_idx" ON "pages_blocks_category_bar_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_bar_items_parent_id_idx" ON "pages_blocks_category_bar_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_bar_order_idx" ON "pages_blocks_category_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_bar_parent_id_idx" ON "pages_blocks_category_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_bar_path_idx" ON "pages_blocks_category_bar" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_band_links_order_idx" ON "pages_blocks_cta_band_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_links_parent_id_idx" ON "pages_blocks_cta_band_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_order_idx" ON "pages_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_parent_id_idx" ON "pages_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_path_idx" ON "pages_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_prose_section_order_idx" ON "pages_blocks_prose_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_prose_section_parent_id_idx" ON "pages_blocks_prose_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_prose_section_path_idx" ON "pages_blocks_prose_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_capability_list_items_order_idx" ON "pages_blocks_capability_list_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_capability_list_items_parent_id_idx" ON "pages_blocks_capability_list_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capability_list_order_idx" ON "pages_blocks_capability_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_capability_list_parent_id_idx" ON "pages_blocks_capability_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capability_list_path_idx" ON "pages_blocks_capability_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_service_details_services_features_order_idx" ON "pages_blocks_service_details_services_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_details_services_features_parent_id_idx" ON "pages_blocks_service_details_services_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_details_services_order_idx" ON "pages_blocks_service_details_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_details_services_parent_id_idx" ON "pages_blocks_service_details_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_details_services_image_idx" ON "pages_blocks_service_details_services" USING btree ("image_id");
  CREATE INDEX "pages_blocks_service_details_order_idx" ON "pages_blocks_service_details" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_details_parent_id_idx" ON "pages_blocks_service_details" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_details_path_idx" ON "pages_blocks_service_details" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_intro_order_idx" ON "_pages_v_blocks_page_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_intro_parent_id_idx" ON "_pages_v_blocks_page_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_intro_path_idx" ON "_pages_v_blocks_page_intro" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_intro_image_idx" ON "_pages_v_blocks_page_intro" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_service_cards_cards_order_idx" ON "_pages_v_blocks_service_cards_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_cards_cards_parent_id_idx" ON "_pages_v_blocks_service_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_cards_cards_image_idx" ON "_pages_v_blocks_service_cards_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_service_cards_order_idx" ON "_pages_v_blocks_service_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_cards_parent_id_idx" ON "_pages_v_blocks_service_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_cards_path_idx" ON "_pages_v_blocks_service_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_feature_items_order_idx" ON "_pages_v_blocks_split_feature_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_feature_items_parent_id_idx" ON "_pages_v_blocks_split_feature_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_feature_items_image_idx" ON "_pages_v_blocks_split_feature_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_split_feature_links_order_idx" ON "_pages_v_blocks_split_feature_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_feature_links_parent_id_idx" ON "_pages_v_blocks_split_feature_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_feature_order_idx" ON "_pages_v_blocks_split_feature" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_feature_parent_id_idx" ON "_pages_v_blocks_split_feature" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_feature_path_idx" ON "_pages_v_blocks_split_feature" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_feature_image_idx" ON "_pages_v_blocks_split_feature" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_process_section_trust_items_order_idx" ON "_pages_v_blocks_process_section_trust_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_section_trust_items_parent_id_idx" ON "_pages_v_blocks_process_section_trust_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_section_trust_items_image_idx" ON "_pages_v_blocks_process_section_trust_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_process_section_steps_order_idx" ON "_pages_v_blocks_process_section_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_section_steps_parent_id_idx" ON "_pages_v_blocks_process_section_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_section_order_idx" ON "_pages_v_blocks_process_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_section_parent_id_idx" ON "_pages_v_blocks_process_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_section_path_idx" ON "_pages_v_blocks_process_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_category_bar_items_order_idx" ON "_pages_v_blocks_category_bar_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_bar_items_parent_id_idx" ON "_pages_v_blocks_category_bar_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_bar_order_idx" ON "_pages_v_blocks_category_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_bar_parent_id_idx" ON "_pages_v_blocks_category_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_bar_path_idx" ON "_pages_v_blocks_category_bar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_band_links_order_idx" ON "_pages_v_blocks_cta_band_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_band_links_parent_id_idx" ON "_pages_v_blocks_cta_band_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_order_idx" ON "_pages_v_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_band_parent_id_idx" ON "_pages_v_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_path_idx" ON "_pages_v_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_prose_section_order_idx" ON "_pages_v_blocks_prose_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_prose_section_parent_id_idx" ON "_pages_v_blocks_prose_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_prose_section_path_idx" ON "_pages_v_blocks_prose_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_capability_list_items_order_idx" ON "_pages_v_blocks_capability_list_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_capability_list_items_parent_id_idx" ON "_pages_v_blocks_capability_list_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_capability_list_order_idx" ON "_pages_v_blocks_capability_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_capability_list_parent_id_idx" ON "_pages_v_blocks_capability_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_capability_list_path_idx" ON "_pages_v_blocks_capability_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_service_details_services_features_order_idx" ON "_pages_v_blocks_service_details_services_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_details_services_features_parent_id_idx" ON "_pages_v_blocks_service_details_services_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_details_services_order_idx" ON "_pages_v_blocks_service_details_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_details_services_parent_id_idx" ON "_pages_v_blocks_service_details_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_details_services_image_idx" ON "_pages_v_blocks_service_details_services" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_service_details_order_idx" ON "_pages_v_blocks_service_details" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_details_parent_id_idx" ON "_pages_v_blocks_service_details" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_details_path_idx" ON "_pages_v_blocks_service_details" USING btree ("_path");
  CREATE INDEX "header_secondary_nav_items_order_idx" ON "header_secondary_nav_items" USING btree ("_order");
  CREATE INDEX "header_secondary_nav_items_parent_id_idx" ON "header_secondary_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_service_links_order_idx" ON "footer_service_links" USING btree ("_order");
  CREATE INDEX "footer_service_links_parent_id_idx" ON "footer_service_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_page_intro" CASCADE;
  DROP TABLE "pages_blocks_service_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_service_cards" CASCADE;
  DROP TABLE "pages_blocks_split_feature_items" CASCADE;
  DROP TABLE "pages_blocks_split_feature_links" CASCADE;
  DROP TABLE "pages_blocks_split_feature" CASCADE;
  DROP TABLE "pages_blocks_process_section_trust_items" CASCADE;
  DROP TABLE "pages_blocks_process_section_steps" CASCADE;
  DROP TABLE "pages_blocks_process_section" CASCADE;
  DROP TABLE "pages_blocks_category_bar_items" CASCADE;
  DROP TABLE "pages_blocks_category_bar" CASCADE;
  DROP TABLE "pages_blocks_cta_band_links" CASCADE;
  DROP TABLE "pages_blocks_cta_band" CASCADE;
  DROP TABLE "pages_blocks_prose_section" CASCADE;
  DROP TABLE "pages_blocks_capability_list_items" CASCADE;
  DROP TABLE "pages_blocks_capability_list" CASCADE;
  DROP TABLE "pages_blocks_service_details_services_features" CASCADE;
  DROP TABLE "pages_blocks_service_details_services" CASCADE;
  DROP TABLE "pages_blocks_service_details" CASCADE;
  DROP TABLE "_pages_v_blocks_page_intro" CASCADE;
  DROP TABLE "_pages_v_blocks_service_cards_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_service_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_split_feature_items" CASCADE;
  DROP TABLE "_pages_v_blocks_split_feature_links" CASCADE;
  DROP TABLE "_pages_v_blocks_split_feature" CASCADE;
  DROP TABLE "_pages_v_blocks_process_section_trust_items" CASCADE;
  DROP TABLE "_pages_v_blocks_process_section_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_process_section" CASCADE;
  DROP TABLE "_pages_v_blocks_category_bar_items" CASCADE;
  DROP TABLE "_pages_v_blocks_category_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band" CASCADE;
  DROP TABLE "_pages_v_blocks_prose_section" CASCADE;
  DROP TABLE "_pages_v_blocks_capability_list_items" CASCADE;
  DROP TABLE "_pages_v_blocks_capability_list" CASCADE;
  DROP TABLE "_pages_v_blocks_service_details_services_features" CASCADE;
  DROP TABLE "_pages_v_blocks_service_details_services" CASCADE;
  DROP TABLE "_pages_v_blocks_service_details" CASCADE;
  DROP TABLE "header_secondary_nav_items" CASCADE;
  DROP TABLE "footer_service_links" CASCADE;
  ALTER TABLE "pages" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "hero_headline";
  ALTER TABLE "pages" DROP COLUMN "hero_description";
  ALTER TABLE "pages" DROP COLUMN "hero_badge_primary";
  ALTER TABLE "pages" DROP COLUMN "hero_badge_secondary";
  ALTER TABLE "pages" DROP COLUMN "hero_badge_muted";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_eyebrow";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_headline";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_badge_primary";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_badge_secondary";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_badge_muted";
  ALTER TABLE "footer" DROP COLUMN "blurb";
  ALTER TABLE "footer" DROP COLUMN "tagline";
  ALTER TABLE "footer" DROP COLUMN "location";
  DROP TYPE "public"."enum_pages_blocks_page_intro_layout";
  DROP TYPE "public"."enum_pages_blocks_split_feature_links_variant";
  DROP TYPE "public"."enum_pages_blocks_split_feature_variant";
  DROP TYPE "public"."enum_pages_blocks_process_section_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_band_links_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_band_tone";
  DROP TYPE "public"."enum__pages_v_blocks_page_intro_layout";
  DROP TYPE "public"."enum__pages_v_blocks_split_feature_links_variant";
  DROP TYPE "public"."enum__pages_v_blocks_split_feature_variant";
  DROP TYPE "public"."enum__pages_v_blocks_process_section_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_links_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_tone";
  DROP TYPE "public"."enum_header_secondary_nav_items_link_type";
  DROP TYPE "public"."enum_footer_service_links_link_type";`)
}
