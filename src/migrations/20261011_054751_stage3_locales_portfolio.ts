import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'zh');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'zh');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_type" AS ENUM('residential', 'commercial');
  CREATE TYPE "public"."enum__projects_v_version_project_status" AS ENUM('active', 'completed', 'on-hold');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('en', 'zh');
  CREATE TABLE "pages_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_page_intro_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_accent" varchar,
  	"description" varchar,
  	"image_alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_service_cards_cards_locales" (
  	"image_alt" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_service_cards_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_split_feature_items_locales" (
  	"image_alt" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_split_feature_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_split_feature_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_accent" varchar,
  	"body" varchar,
  	"image_alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_section_trust_items_locales" (
  	"image_alt" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_section_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_section_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_category_bar_items_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_category_bar_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_band_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_band_locales" (
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_prose_section_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_capability_list_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_capability_list_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_service_details_services_features_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_service_details_services_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"image_alt" varchar,
  	"enquire_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"hero_eyebrow" varchar,
  	"hero_headline" varchar,
  	"hero_description" varchar,
  	"hero_badge_primary" varchar,
  	"hero_badge_secondary" varchar,
  	"hero_badge_muted" varchar,
  	"hero_rich_text" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_page_intro_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_accent" varchar,
  	"description" varchar,
  	"image_alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_service_cards_cards_locales" (
  	"image_alt" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_service_cards_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_split_feature_items_locales" (
  	"image_alt" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_split_feature_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_split_feature_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"heading_accent" varchar,
  	"body" varchar,
  	"image_alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_process_section_trust_items_locales" (
  	"image_alt" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_process_section_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_process_section_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_category_bar_items_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_category_bar_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band_locales" (
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_prose_section_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_capability_list_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_capability_list_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_service_details_services_features_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_service_details_services_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"image_alt" varchar,
  	"enquire_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_headline" varchar,
  	"version_hero_description" varchar,
  	"version_hero_badge_primary" varchar,
  	"version_hero_badge_secondary" varchar,
  	"version_hero_badge_muted" varchar,
  	"version_hero_rich_text" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar,
  	"short_description" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"styles_id" integer,
  	"spaces_id" integer
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_type" "enum__projects_v_version_type" DEFAULT 'residential',
  	"version_address" varchar,
  	"version_suburb" varchar,
  	"version_show_address_publicly" boolean DEFAULT false,
  	"version_featured_image_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_project_status" "enum__projects_v_version_project_status" DEFAULT 'active',
  	"version_summary" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar,
  	"version_short_description" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"styles_id" integer,
  	"spaces_id" integer
  );
  
  CREATE TABLE "styles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "styles_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "spaces" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "spaces_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "project_images" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"project_id" integer NOT NULL,
  	"image_id" integer NOT NULL,
  	"display_order" numeric DEFAULT 0,
  	"published" boolean DEFAULT true,
  	"allow_download" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "project_images_locales" (
  	"title" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "project_images_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"styles_id" integer,
  	"spaces_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_nav_items_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_secondary_nav_items_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_service_links_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_nav_items_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_locales" (
  	"blurb" varchar,
  	"tagline" varchar,
  	"location" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_meta_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk";
  
  DROP INDEX "pages_meta_meta_image_idx";
  DROP INDEX "_pages_v_version_meta_version_meta_image_idx";
  ALTER TABLE "projects" ALTER COLUMN "address" DROP NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "type" DROP NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "project_status" DROP NOT NULL;
  ALTER TABLE "_pages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_pages_v" ADD COLUMN "published_locale" "enum__pages_v_published_locale";
  ALTER TABLE "projects" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "projects" ADD COLUMN "slug" varchar;
  ALTER TABLE "projects" ADD COLUMN "featured_image_id" integer;
  ALTER TABLE "projects" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "projects" ADD COLUMN "display_order" numeric DEFAULT 0;
  ALTER TABLE "projects" ADD COLUMN "_status" "enum_projects_status" DEFAULT 'draft';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "styles_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "spaces_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "project_images_id" integer;
  ALTER TABLE "pages_hero_links_locales" ADD CONSTRAINT "pages_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_intro_locales" ADD CONSTRAINT "pages_blocks_page_intro_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_cards_cards_locales" ADD CONSTRAINT "pages_blocks_service_cards_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_cards_locales" ADD CONSTRAINT "pages_blocks_service_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature_items_locales" ADD CONSTRAINT "pages_blocks_split_feature_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_feature_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature_links_locales" ADD CONSTRAINT "pages_blocks_split_feature_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_feature_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature_locales" ADD CONSTRAINT "pages_blocks_split_feature_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_section_trust_items_locales" ADD CONSTRAINT "pages_blocks_process_section_trust_items_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_section_trust_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_section_steps_locales" ADD CONSTRAINT "pages_blocks_process_section_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_section_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_section_locales" ADD CONSTRAINT "pages_blocks_process_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_bar_items_locales" ADD CONSTRAINT "pages_blocks_category_bar_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_bar_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_bar_locales" ADD CONSTRAINT "pages_blocks_category_bar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band_links_locales" ADD CONSTRAINT "pages_blocks_cta_band_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_band_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band_locales" ADD CONSTRAINT "pages_blocks_cta_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_prose_section_locales" ADD CONSTRAINT "pages_blocks_prose_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_prose_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capability_list_items_locales" ADD CONSTRAINT "pages_blocks_capability_list_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capability_list_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capability_list_locales" ADD CONSTRAINT "pages_blocks_capability_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capability_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_details_services_features_locales" ADD CONSTRAINT "pages_blocks_service_details_services_features_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_details_services_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_details_services_locales" ADD CONSTRAINT "pages_blocks_service_details_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_details_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links_locales" ADD CONSTRAINT "_pages_v_version_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_intro_locales" ADD CONSTRAINT "_pages_v_blocks_page_intro_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_cards_cards_locales" ADD CONSTRAINT "_pages_v_blocks_service_cards_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_cards_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_cards_locales" ADD CONSTRAINT "_pages_v_blocks_service_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature_items_locales" ADD CONSTRAINT "_pages_v_blocks_split_feature_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_feature_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature_links_locales" ADD CONSTRAINT "_pages_v_blocks_split_feature_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_feature_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature_locales" ADD CONSTRAINT "_pages_v_blocks_split_feature_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_section_trust_items_locales" ADD CONSTRAINT "_pages_v_blocks_process_section_trust_items_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_section_trust_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_section_steps_locales" ADD CONSTRAINT "_pages_v_blocks_process_section_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_section_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_section_locales" ADD CONSTRAINT "_pages_v_blocks_process_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_bar_items_locales" ADD CONSTRAINT "_pages_v_blocks_category_bar_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_bar_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_bar_locales" ADD CONSTRAINT "_pages_v_blocks_category_bar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band_links_locales" ADD CONSTRAINT "_pages_v_blocks_cta_band_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_band_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band_locales" ADD CONSTRAINT "_pages_v_blocks_cta_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_prose_section_locales" ADD CONSTRAINT "_pages_v_blocks_prose_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_prose_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capability_list_items_locales" ADD CONSTRAINT "_pages_v_blocks_capability_list_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_capability_list_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capability_list_locales" ADD CONSTRAINT "_pages_v_blocks_capability_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_capability_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_details_services_features_locales" ADD CONSTRAINT "_pages_v_blocks_service_details_services_features_locales_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_details_services_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_details_services_locales" ADD CONSTRAINT "_pages_v_blocks_service_details_services_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_details_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_styles_fk" FOREIGN KEY ("styles_id") REFERENCES "public"."styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_spaces_fk" FOREIGN KEY ("spaces_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_styles_fk" FOREIGN KEY ("styles_id") REFERENCES "public"."styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_spaces_fk" FOREIGN KEY ("spaces_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "styles_locales" ADD CONSTRAINT "styles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "spaces_locales" ADD CONSTRAINT "spaces_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_images" ADD CONSTRAINT "project_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_images_locales" ADD CONSTRAINT "project_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_images_rels" ADD CONSTRAINT "project_images_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."project_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_images_rels" ADD CONSTRAINT "project_images_rels_styles_fk" FOREIGN KEY ("styles_id") REFERENCES "public"."styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_images_rels" ADD CONSTRAINT "project_images_rels_spaces_fk" FOREIGN KEY ("spaces_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_locales" ADD CONSTRAINT "header_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_secondary_nav_items_locales" ADD CONSTRAINT "header_secondary_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_secondary_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_service_links_locales" ADD CONSTRAINT "footer_service_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_service_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items_locales" ADD CONSTRAINT "footer_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_hero_links_locales_locale_parent_id_unique" ON "pages_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_page_intro_locales_locale_parent_id_unique" ON "pages_blocks_page_intro_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_service_cards_cards_locales_locale_parent_id_un" ON "pages_blocks_service_cards_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_service_cards_locales_locale_parent_id_unique" ON "pages_blocks_service_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_split_feature_items_locales_locale_parent_id_un" ON "pages_blocks_split_feature_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_split_feature_links_locales_locale_parent_id_un" ON "pages_blocks_split_feature_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_split_feature_locales_locale_parent_id_unique" ON "pages_blocks_split_feature_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_process_section_trust_items_locales_locale_pare" ON "pages_blocks_process_section_trust_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_process_section_steps_locales_locale_parent_id_" ON "pages_blocks_process_section_steps_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_process_section_locales_locale_parent_id_unique" ON "pages_blocks_process_section_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_category_bar_items_locales_locale_parent_id_uni" ON "pages_blocks_category_bar_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_category_bar_locales_locale_parent_id_unique" ON "pages_blocks_category_bar_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_band_links_locales_locale_parent_id_unique" ON "pages_blocks_cta_band_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_band_locales_locale_parent_id_unique" ON "pages_blocks_cta_band_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_prose_section_locales_locale_parent_id_unique" ON "pages_blocks_prose_section_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_capability_list_items_locales_locale_parent_id_" ON "pages_blocks_capability_list_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_capability_list_locales_locale_parent_id_unique" ON "pages_blocks_capability_list_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_service_details_services_features_locales_local" ON "pages_blocks_service_details_services_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_service_details_services_locales_locale_parent_" ON "pages_blocks_service_details_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_version_hero_links_locales_locale_parent_id_unique" ON "_pages_v_version_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_intro_locales_locale_parent_id_unique" ON "_pages_v_blocks_page_intro_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_service_cards_cards_locales_locale_parent_id" ON "_pages_v_blocks_service_cards_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_service_cards_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_service_cards_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_split_feature_items_locales_locale_parent_id" ON "_pages_v_blocks_split_feature_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_split_feature_links_locales_locale_parent_id" ON "_pages_v_blocks_split_feature_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_split_feature_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_split_feature_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_process_section_trust_items_locales_locale_p" ON "_pages_v_blocks_process_section_trust_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_process_section_steps_locales_locale_parent_" ON "_pages_v_blocks_process_section_steps_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_process_section_locales_locale_parent_id_uni" ON "_pages_v_blocks_process_section_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_category_bar_items_locales_locale_parent_id_" ON "_pages_v_blocks_category_bar_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_category_bar_locales_locale_parent_id_unique" ON "_pages_v_blocks_category_bar_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_band_links_locales_locale_parent_id_uniq" ON "_pages_v_blocks_cta_band_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_band_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_band_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_prose_section_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_prose_section_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_capability_list_items_locales_locale_parent_" ON "_pages_v_blocks_capability_list_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_capability_list_locales_locale_parent_id_uni" ON "_pages_v_blocks_capability_list_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_service_details_services_features_locales_lo" ON "_pages_v_blocks_service_details_services_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_service_details_services_locales_locale_pare" ON "_pages_v_blocks_service_details_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_styles_id_idx" ON "projects_rels" USING btree ("styles_id");
  CREATE INDEX "projects_rels_spaces_id_idx" ON "projects_rels" USING btree ("spaces_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_featured_image_idx" ON "_projects_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_styles_id_idx" ON "_projects_v_rels" USING btree ("styles_id");
  CREATE INDEX "_projects_v_rels_spaces_id_idx" ON "_projects_v_rels" USING btree ("spaces_id");
  CREATE UNIQUE INDEX "styles_slug_idx" ON "styles" USING btree ("slug");
  CREATE INDEX "styles_updated_at_idx" ON "styles" USING btree ("updated_at");
  CREATE INDEX "styles_created_at_idx" ON "styles" USING btree ("created_at");
  CREATE UNIQUE INDEX "styles_locales_locale_parent_id_unique" ON "styles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "spaces_slug_idx" ON "spaces" USING btree ("slug");
  CREATE INDEX "spaces_updated_at_idx" ON "spaces" USING btree ("updated_at");
  CREATE INDEX "spaces_created_at_idx" ON "spaces" USING btree ("created_at");
  CREATE UNIQUE INDEX "spaces_locales_locale_parent_id_unique" ON "spaces_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "project_images_project_idx" ON "project_images" USING btree ("project_id");
  CREATE INDEX "project_images_image_idx" ON "project_images" USING btree ("image_id");
  CREATE INDEX "project_images_updated_at_idx" ON "project_images" USING btree ("updated_at");
  CREATE INDEX "project_images_created_at_idx" ON "project_images" USING btree ("created_at");
  CREATE UNIQUE INDEX "project_images_locales_locale_parent_id_unique" ON "project_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "project_images_rels_order_idx" ON "project_images_rels" USING btree ("order");
  CREATE INDEX "project_images_rels_parent_idx" ON "project_images_rels" USING btree ("parent_id");
  CREATE INDEX "project_images_rels_path_idx" ON "project_images_rels" USING btree ("path");
  CREATE INDEX "project_images_rels_styles_id_idx" ON "project_images_rels" USING btree ("styles_id");
  CREATE INDEX "project_images_rels_spaces_id_idx" ON "project_images_rels" USING btree ("spaces_id");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "header_nav_items_locales_locale_parent_id_unique" ON "header_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "header_secondary_nav_items_locales_locale_parent_id_unique" ON "header_secondary_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_service_links_locales_locale_parent_id_unique" ON "footer_service_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_nav_items_locales_locale_parent_id_unique" ON "footer_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "projects" ADD CONSTRAINT "projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_styles_fk" FOREIGN KEY ("styles_id") REFERENCES "public"."styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_spaces_fk" FOREIGN KEY ("spaces_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_images_fk" FOREIGN KEY ("project_images_id") REFERENCES "public"."project_images"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_featured_image_idx" ON "projects" USING btree ("featured_image_id");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "payload_locked_documents_rels_styles_id_idx" ON "payload_locked_documents_rels" USING btree ("styles_id");
  CREATE INDEX "payload_locked_documents_rels_spaces_id_idx" ON "payload_locked_documents_rels" USING btree ("spaces_id");
  CREATE INDEX "payload_locked_documents_rels_project_images_id_idx" ON "payload_locked_documents_rels" USING btree ("project_images_id");

  -- Keep existing English copy when columns move into locale tables.
  INSERT INTO "pages_hero_links_locales" ("link_label", "_locale", "_parent_id") SELECT "link_label", 'en', "id" FROM "pages_hero_links";
  INSERT INTO "pages_blocks_page_intro_locales" ("eyebrow", "heading", "heading_accent", "description", "image_alt", "_locale", "_parent_id") SELECT "eyebrow", "heading", "heading_accent", "description", "image_alt", 'en', "id" FROM "pages_blocks_page_intro";
  INSERT INTO "pages_blocks_service_cards_cards_locales" ("image_alt", "title", "subtitle", "description", "_locale", "_parent_id") SELECT "image_alt", "title", "subtitle", "description", 'en', "id" FROM "pages_blocks_service_cards_cards";
  INSERT INTO "pages_blocks_service_cards_locales" ("eyebrow", "heading", "_locale", "_parent_id") SELECT "eyebrow", "heading", 'en', "id" FROM "pages_blocks_service_cards";
  INSERT INTO "pages_blocks_split_feature_items_locales" ("image_alt", "title", "subtitle", "_locale", "_parent_id") SELECT "image_alt", "title", "subtitle", 'en', "id" FROM "pages_blocks_split_feature_items";
  INSERT INTO "pages_blocks_split_feature_links_locales" ("label", "_locale", "_parent_id") SELECT "label", 'en', "id" FROM "pages_blocks_split_feature_links";
  INSERT INTO "pages_blocks_split_feature_locales" ("eyebrow", "heading", "heading_accent", "body", "image_alt", "_locale", "_parent_id") SELECT "eyebrow", "heading", "heading_accent", "body", "image_alt", 'en', "id" FROM "pages_blocks_split_feature";
  INSERT INTO "pages_blocks_process_section_trust_items_locales" ("image_alt", "title", "description", "_locale", "_parent_id") SELECT "image_alt", "title", "description", 'en', "id" FROM "pages_blocks_process_section_trust_items";
  INSERT INTO "pages_blocks_process_section_steps_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'en', "id" FROM "pages_blocks_process_section_steps";
  INSERT INTO "pages_blocks_process_section_locales" ("eyebrow", "heading", "body", "_locale", "_parent_id") SELECT "eyebrow", "heading", "body", 'en', "id" FROM "pages_blocks_process_section";
  INSERT INTO "pages_blocks_category_bar_items_locales" ("title", "_locale", "_parent_id") SELECT "title", 'en', "id" FROM "pages_blocks_category_bar_items";
  INSERT INTO "pages_blocks_category_bar_locales" ("eyebrow", "heading", "_locale", "_parent_id") SELECT "eyebrow", "heading", 'en', "id" FROM "pages_blocks_category_bar";
  INSERT INTO "pages_blocks_cta_band_links_locales" ("label", "_locale", "_parent_id") SELECT "label", 'en', "id" FROM "pages_blocks_cta_band_links";
  INSERT INTO "pages_blocks_cta_band_locales" ("heading", "body", "_locale", "_parent_id") SELECT "heading", "body", 'en', "id" FROM "pages_blocks_cta_band";
  INSERT INTO "pages_blocks_prose_section_locales" ("eyebrow", "heading", "body", "_locale", "_parent_id") SELECT "eyebrow", "heading", "body", 'en', "id" FROM "pages_blocks_prose_section";
  INSERT INTO "pages_blocks_capability_list_items_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'en', "id" FROM "pages_blocks_capability_list_items";
  INSERT INTO "pages_blocks_capability_list_locales" ("eyebrow", "heading", "_locale", "_parent_id") SELECT "eyebrow", "heading", 'en', "id" FROM "pages_blocks_capability_list";
  INSERT INTO "pages_blocks_service_details_services_features_locales" ("text", "_locale", "_parent_id") SELECT "text", 'en', "id" FROM "pages_blocks_service_details_services_features";
  INSERT INTO "pages_blocks_service_details_services_locales" ("title", "subtitle", "description", "image_alt", "enquire_label", "_locale", "_parent_id") SELECT "title", "subtitle", "description", "image_alt", "enquire_label", 'en', "id" FROM "pages_blocks_service_details_services";
  INSERT INTO "pages_locales" ("title", "hero_eyebrow", "hero_headline", "hero_description", "hero_badge_primary", "hero_badge_secondary", "hero_badge_muted", "hero_rich_text", "meta_title", "meta_image_id", "meta_description", "_locale", "_parent_id") SELECT "title", "hero_eyebrow", "hero_headline", "hero_description", "hero_badge_primary", "hero_badge_secondary", "hero_badge_muted", "hero_rich_text", "meta_title", "meta_image_id", "meta_description", 'en', "id" FROM "pages";
  INSERT INTO "_pages_v_version_hero_links_locales" ("link_label", "_locale", "_parent_id") SELECT "link_label", 'en', "id" FROM "_pages_v_version_hero_links";
  INSERT INTO "_pages_v_blocks_page_intro_locales" ("eyebrow", "heading", "heading_accent", "description", "image_alt", "_locale", "_parent_id") SELECT "eyebrow", "heading", "heading_accent", "description", "image_alt", 'en', "id" FROM "_pages_v_blocks_page_intro";
  INSERT INTO "_pages_v_blocks_service_cards_cards_locales" ("image_alt", "title", "subtitle", "description", "_locale", "_parent_id") SELECT "image_alt", "title", "subtitle", "description", 'en', "id" FROM "_pages_v_blocks_service_cards_cards";
  INSERT INTO "_pages_v_blocks_service_cards_locales" ("eyebrow", "heading", "_locale", "_parent_id") SELECT "eyebrow", "heading", 'en', "id" FROM "_pages_v_blocks_service_cards";
  INSERT INTO "_pages_v_blocks_split_feature_items_locales" ("image_alt", "title", "subtitle", "_locale", "_parent_id") SELECT "image_alt", "title", "subtitle", 'en', "id" FROM "_pages_v_blocks_split_feature_items";
  INSERT INTO "_pages_v_blocks_split_feature_links_locales" ("label", "_locale", "_parent_id") SELECT "label", 'en', "id" FROM "_pages_v_blocks_split_feature_links";
  INSERT INTO "_pages_v_blocks_split_feature_locales" ("eyebrow", "heading", "heading_accent", "body", "image_alt", "_locale", "_parent_id") SELECT "eyebrow", "heading", "heading_accent", "body", "image_alt", 'en', "id" FROM "_pages_v_blocks_split_feature";
  INSERT INTO "_pages_v_blocks_process_section_trust_items_locales" ("image_alt", "title", "description", "_locale", "_parent_id") SELECT "image_alt", "title", "description", 'en', "id" FROM "_pages_v_blocks_process_section_trust_items";
  INSERT INTO "_pages_v_blocks_process_section_steps_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'en', "id" FROM "_pages_v_blocks_process_section_steps";
  INSERT INTO "_pages_v_blocks_process_section_locales" ("eyebrow", "heading", "body", "_locale", "_parent_id") SELECT "eyebrow", "heading", "body", 'en', "id" FROM "_pages_v_blocks_process_section";
  INSERT INTO "_pages_v_blocks_category_bar_items_locales" ("title", "_locale", "_parent_id") SELECT "title", 'en', "id" FROM "_pages_v_blocks_category_bar_items";
  INSERT INTO "_pages_v_blocks_category_bar_locales" ("eyebrow", "heading", "_locale", "_parent_id") SELECT "eyebrow", "heading", 'en', "id" FROM "_pages_v_blocks_category_bar";
  INSERT INTO "_pages_v_blocks_cta_band_links_locales" ("label", "_locale", "_parent_id") SELECT "label", 'en', "id" FROM "_pages_v_blocks_cta_band_links";
  INSERT INTO "_pages_v_blocks_cta_band_locales" ("heading", "body", "_locale", "_parent_id") SELECT "heading", "body", 'en', "id" FROM "_pages_v_blocks_cta_band";
  INSERT INTO "_pages_v_blocks_prose_section_locales" ("eyebrow", "heading", "body", "_locale", "_parent_id") SELECT "eyebrow", "heading", "body", 'en', "id" FROM "_pages_v_blocks_prose_section";
  INSERT INTO "_pages_v_blocks_capability_list_items_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'en', "id" FROM "_pages_v_blocks_capability_list_items";
  INSERT INTO "_pages_v_blocks_capability_list_locales" ("eyebrow", "heading", "_locale", "_parent_id") SELECT "eyebrow", "heading", 'en', "id" FROM "_pages_v_blocks_capability_list";
  INSERT INTO "_pages_v_blocks_service_details_services_features_locales" ("text", "_locale", "_parent_id") SELECT "text", 'en', "id" FROM "_pages_v_blocks_service_details_services_features";
  INSERT INTO "_pages_v_blocks_service_details_services_locales" ("title", "subtitle", "description", "image_alt", "enquire_label", "_locale", "_parent_id") SELECT "title", "subtitle", "description", "image_alt", "enquire_label", 'en', "id" FROM "_pages_v_blocks_service_details_services";
  INSERT INTO "_pages_v_locales" ("version_title", "version_hero_eyebrow", "version_hero_headline", "version_hero_description", "version_hero_badge_primary", "version_hero_badge_secondary", "version_hero_badge_muted", "version_hero_rich_text", "version_meta_title", "version_meta_image_id", "version_meta_description", "_locale", "_parent_id") SELECT "version_title", "version_hero_eyebrow", "version_hero_headline", "version_hero_description", "version_hero_badge_primary", "version_hero_badge_secondary", "version_hero_badge_muted", "version_hero_rich_text", "version_meta_title", "version_meta_image_id", "version_meta_description", 'en', "id" FROM "_pages_v";
  INSERT INTO "projects_locales" ("title", "_locale", "_parent_id") SELECT "title", 'en', "id" FROM "projects";
  INSERT INTO "forms_blocks_checkbox_locales" ("label", "_locale", "_parent_id") SELECT "label", 'en', "id" FROM "forms_blocks_checkbox";
  INSERT INTO "forms_blocks_country_locales" ("label", "_locale", "_parent_id") SELECT "label", 'en', "id" FROM "forms_blocks_country";
  INSERT INTO "forms_blocks_email_locales" ("label", "_locale", "_parent_id") SELECT "label", 'en', "id" FROM "forms_blocks_email";
  INSERT INTO "forms_blocks_message_locales" ("message", "_locale", "_parent_id") SELECT "message", 'en', "id" FROM "forms_blocks_message";
  INSERT INTO "forms_blocks_number_locales" ("label", "_locale", "_parent_id") SELECT "label", 'en', "id" FROM "forms_blocks_number";
  INSERT INTO "forms_blocks_select_options_locales" ("label", "_locale", "_parent_id") SELECT COALESCE("label", ''), 'en', "id" FROM "forms_blocks_select_options";
  INSERT INTO "forms_blocks_select_locales" ("label", "default_value", "_locale", "_parent_id") SELECT "label", "default_value", 'en', "id" FROM "forms_blocks_select";
  INSERT INTO "forms_blocks_state_locales" ("label", "_locale", "_parent_id") SELECT "label", 'en', "id" FROM "forms_blocks_state";
  INSERT INTO "forms_blocks_text_locales" ("label", "default_value", "_locale", "_parent_id") SELECT "label", "default_value", 'en', "id" FROM "forms_blocks_text";
  INSERT INTO "forms_blocks_textarea_locales" ("label", "default_value", "_locale", "_parent_id") SELECT "label", "default_value", 'en', "id" FROM "forms_blocks_textarea";
  INSERT INTO "forms_emails_locales" ("subject", "message", "_locale", "_parent_id") SELECT COALESCE("subject", ''), "message", 'en', "id" FROM "forms_emails";
  INSERT INTO "forms_locales" ("submit_button_label", "confirmation_message", "_locale", "_parent_id") SELECT "submit_button_label", "confirmation_message", 'en', "id" FROM "forms";
  INSERT INTO "header_nav_items_locales" ("link_label", "_locale", "_parent_id") SELECT COALESCE("link_label", ''), 'en', "id" FROM "header_nav_items";
  INSERT INTO "header_secondary_nav_items_locales" ("link_label", "_locale", "_parent_id") SELECT COALESCE("link_label", ''), 'en', "id" FROM "header_secondary_nav_items";
  INSERT INTO "footer_service_links_locales" ("link_label", "_locale", "_parent_id") SELECT COALESCE("link_label", ''), 'en', "id" FROM "footer_service_links";
  INSERT INTO "footer_nav_items_locales" ("link_label", "_locale", "_parent_id") SELECT COALESCE("link_label", ''), 'en', "id" FROM "footer_nav_items";
  INSERT INTO "footer_locales" ("blurb", "tagline", "location", "_locale", "_parent_id") SELECT "blurb", "tagline", "location", 'en', "id" FROM "footer";
  UPDATE "projects" SET "_status" = 'published';
  UPDATE "projects" AS project SET "slug" = generated.slug
  FROM (
    SELECT "id",
      CASE
        WHEN base = '' THEN 'project-' || "id"::text
        WHEN count(*) OVER (PARTITION BY base) > 1 THEN base || '-' || "id"::text
        ELSE base
      END AS slug
    FROM (
      SELECT "id", trim(both '-' from regexp_replace(lower(COALESCE("title", '')), '[^a-z0-9]+', '-', 'g')) AS base
      FROM "projects"
    ) bases
  ) AS generated
  WHERE project."id" = generated."id" AND (project."slug" IS NULL OR project."slug" = '');

  ALTER TABLE "pages_hero_links" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_page_intro" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_page_intro" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_page_intro" DROP COLUMN "heading_accent";
  ALTER TABLE "pages_blocks_page_intro" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_page_intro" DROP COLUMN "image_alt";
  ALTER TABLE "pages_blocks_service_cards_cards" DROP COLUMN "image_alt";
  ALTER TABLE "pages_blocks_service_cards_cards" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_service_cards_cards" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_service_cards_cards" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_service_cards" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_service_cards" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_split_feature_items" DROP COLUMN "image_alt";
  ALTER TABLE "pages_blocks_split_feature_items" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_split_feature_items" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_split_feature_links" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_split_feature" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_split_feature" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_split_feature" DROP COLUMN "heading_accent";
  ALTER TABLE "pages_blocks_split_feature" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_split_feature" DROP COLUMN "image_alt";
  ALTER TABLE "pages_blocks_process_section_trust_items" DROP COLUMN "image_alt";
  ALTER TABLE "pages_blocks_process_section_trust_items" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_process_section_trust_items" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_process_section_steps" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_process_section_steps" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_process_section" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_process_section" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_process_section" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_category_bar_items" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_category_bar" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_category_bar" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_cta_band_links" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_cta_band" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_cta_band" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_prose_section" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_prose_section" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_prose_section" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_capability_list_items" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_capability_list_items" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_capability_list" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_capability_list" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_service_details_services_features" DROP COLUMN "text";
  ALTER TABLE "pages_blocks_service_details_services" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_service_details_services" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_service_details_services" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_service_details_services" DROP COLUMN "image_alt";
  ALTER TABLE "pages_blocks_service_details_services" DROP COLUMN "enquire_label";
  ALTER TABLE "pages" DROP COLUMN "title";
  ALTER TABLE "pages" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "hero_headline";
  ALTER TABLE "pages" DROP COLUMN "hero_description";
  ALTER TABLE "pages" DROP COLUMN "hero_badge_primary";
  ALTER TABLE "pages" DROP COLUMN "hero_badge_secondary";
  ALTER TABLE "pages" DROP COLUMN "hero_badge_muted";
  ALTER TABLE "pages" DROP COLUMN "hero_rich_text";
  ALTER TABLE "pages" DROP COLUMN "meta_title";
  ALTER TABLE "pages" DROP COLUMN "meta_image_id";
  ALTER TABLE "pages" DROP COLUMN "meta_description";
  ALTER TABLE "_pages_v_version_hero_links" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_page_intro" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_page_intro" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_page_intro" DROP COLUMN "heading_accent";
  ALTER TABLE "_pages_v_blocks_page_intro" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_page_intro" DROP COLUMN "image_alt";
  ALTER TABLE "_pages_v_blocks_service_cards_cards" DROP COLUMN "image_alt";
  ALTER TABLE "_pages_v_blocks_service_cards_cards" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_service_cards_cards" DROP COLUMN "subtitle";
  ALTER TABLE "_pages_v_blocks_service_cards_cards" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_service_cards" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_service_cards" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_split_feature_items" DROP COLUMN "image_alt";
  ALTER TABLE "_pages_v_blocks_split_feature_items" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_split_feature_items" DROP COLUMN "subtitle";
  ALTER TABLE "_pages_v_blocks_split_feature_links" DROP COLUMN "label";
  ALTER TABLE "_pages_v_blocks_split_feature" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_split_feature" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_split_feature" DROP COLUMN "heading_accent";
  ALTER TABLE "_pages_v_blocks_split_feature" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_split_feature" DROP COLUMN "image_alt";
  ALTER TABLE "_pages_v_blocks_process_section_trust_items" DROP COLUMN "image_alt";
  ALTER TABLE "_pages_v_blocks_process_section_trust_items" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_process_section_trust_items" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_process_section_steps" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_process_section_steps" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_process_section" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_process_section" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_process_section" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_category_bar_items" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_category_bar" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_category_bar" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_cta_band_links" DROP COLUMN "label";
  ALTER TABLE "_pages_v_blocks_cta_band" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_cta_band" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_prose_section" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_prose_section" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_prose_section" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_capability_list_items" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_capability_list_items" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_capability_list" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_capability_list" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_service_details_services_features" DROP COLUMN "text";
  ALTER TABLE "_pages_v_blocks_service_details_services" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_service_details_services" DROP COLUMN "subtitle";
  ALTER TABLE "_pages_v_blocks_service_details_services" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_service_details_services" DROP COLUMN "image_alt";
  ALTER TABLE "_pages_v_blocks_service_details_services" DROP COLUMN "enquire_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_eyebrow";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_headline";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_badge_primary";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_badge_secondary";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_badge_muted";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_rich_text";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "projects" DROP COLUMN "title";
  ALTER TABLE "forms_blocks_checkbox" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_country" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_email" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_message" DROP COLUMN "message";
  ALTER TABLE "forms_blocks_number" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select_options" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "default_value";
  ALTER TABLE "forms_blocks_state" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "default_value";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "default_value";
  ALTER TABLE "forms_emails" DROP COLUMN "subject";
  ALTER TABLE "forms_emails" DROP COLUMN "message";
  ALTER TABLE "forms" DROP COLUMN "submit_button_label";
  ALTER TABLE "forms" DROP COLUMN "confirmation_message";
  ALTER TABLE "header_nav_items" DROP COLUMN "link_label";
  ALTER TABLE "header_secondary_nav_items" DROP COLUMN "link_label";
  ALTER TABLE "footer_service_links" DROP COLUMN "link_label";
  ALTER TABLE "footer_nav_items" DROP COLUMN "link_label";
  ALTER TABLE "footer" DROP COLUMN "blurb";
  ALTER TABLE "footer" DROP COLUMN "tagline";
  ALTER TABLE "footer" DROP COLUMN "location";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_hero_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_page_intro_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_cards_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_split_feature_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_split_feature_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_split_feature_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_section_trust_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_section_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_category_bar_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_category_bar_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_band_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_band_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_prose_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_capability_list_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_capability_list_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_details_services_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_details_services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_intro_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_cards_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_split_feature_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_split_feature_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_split_feature_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_process_section_trust_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_process_section_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_process_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_category_bar_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_category_bar_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_band_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_band_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_prose_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_capability_list_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_capability_list_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_details_services_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_service_details_services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "styles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "styles_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "spaces" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "spaces_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_images_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_images_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_country_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_state_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_secondary_nav_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_service_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_nav_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_locales" DISABLE ROW LEVEL SECURITY;
  -- Restore English columns from locale rows before the locale tables are dropped.
  ALTER TABLE "pages_hero_links" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_page_intro" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_page_intro" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_page_intro" ADD COLUMN "heading_accent" varchar;
  ALTER TABLE "pages_blocks_page_intro" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_page_intro" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "pages_blocks_service_cards_cards" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "pages_blocks_service_cards_cards" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_service_cards_cards" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_service_cards_cards" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_service_cards" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_service_cards" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_split_feature_items" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "pages_blocks_split_feature_items" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_split_feature_items" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_split_feature_links" ADD COLUMN "label" varchar;
  ALTER TABLE "pages_blocks_split_feature" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_split_feature" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_split_feature" ADD COLUMN "heading_accent" varchar;
  ALTER TABLE "pages_blocks_split_feature" ADD COLUMN "body" varchar;
  ALTER TABLE "pages_blocks_split_feature" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "pages_blocks_process_section_trust_items" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "pages_blocks_process_section_trust_items" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_process_section_trust_items" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_process_section_steps" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_process_section_steps" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_process_section" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_process_section" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_process_section" ADD COLUMN "body" varchar;
  ALTER TABLE "pages_blocks_category_bar_items" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_category_bar" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_category_bar" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_cta_band_links" ADD COLUMN "label" varchar;
  ALTER TABLE "pages_blocks_cta_band" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_cta_band" ADD COLUMN "body" varchar;
  ALTER TABLE "pages_blocks_prose_section" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_prose_section" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_prose_section" ADD COLUMN "body" varchar;
  ALTER TABLE "pages_blocks_capability_list_items" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_capability_list_items" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_capability_list" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_capability_list" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_service_details_services_features" ADD COLUMN "text" varchar;
  ALTER TABLE "pages_blocks_service_details_services" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_service_details_services" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_service_details_services" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_service_details_services" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "pages_blocks_service_details_services" ADD COLUMN "enquire_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "title" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_headline" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_badge_primary" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_badge_secondary" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_badge_muted" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_rich_text" jsonb;
  ALTER TABLE "pages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "_pages_v_version_hero_links" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_page_intro" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_page_intro" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_page_intro" ADD COLUMN "heading_accent" varchar;
  ALTER TABLE "_pages_v_blocks_page_intro" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_page_intro" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "_pages_v_blocks_service_cards_cards" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "_pages_v_blocks_service_cards_cards" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_service_cards_cards" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "_pages_v_blocks_service_cards_cards" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_service_cards" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_service_cards" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_split_feature_items" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "_pages_v_blocks_split_feature_items" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_split_feature_items" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "_pages_v_blocks_split_feature_links" ADD COLUMN "label" varchar;
  ALTER TABLE "_pages_v_blocks_split_feature" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_split_feature" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_split_feature" ADD COLUMN "heading_accent" varchar;
  ALTER TABLE "_pages_v_blocks_split_feature" ADD COLUMN "body" varchar;
  ALTER TABLE "_pages_v_blocks_split_feature" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "_pages_v_blocks_process_section_trust_items" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "_pages_v_blocks_process_section_trust_items" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_process_section_trust_items" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_process_section_steps" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_process_section_steps" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_process_section" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_process_section" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_process_section" ADD COLUMN "body" varchar;
  ALTER TABLE "_pages_v_blocks_category_bar_items" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_category_bar" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_category_bar" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_cta_band_links" ADD COLUMN "label" varchar;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD COLUMN "body" varchar;
  ALTER TABLE "_pages_v_blocks_prose_section" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_prose_section" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_prose_section" ADD COLUMN "body" varchar;
  ALTER TABLE "_pages_v_blocks_capability_list_items" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_capability_list_items" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_capability_list" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_capability_list" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_service_details_services_features" ADD COLUMN "text" varchar;
  ALTER TABLE "_pages_v_blocks_service_details_services" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_service_details_services" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "_pages_v_blocks_service_details_services" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_service_details_services" ADD COLUMN "image_alt" varchar;
  ALTER TABLE "_pages_v_blocks_service_details_services" ADD COLUMN "enquire_label" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_eyebrow" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_headline" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_badge_primary" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_badge_secondary" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_badge_muted" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_rich_text" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "projects" ADD COLUMN "title" varchar;
  ALTER TABLE "forms_blocks_checkbox" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_country" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_email" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_message" ADD COLUMN "message" jsonb;
  ALTER TABLE "forms_blocks_number" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_select_options" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_blocks_state" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_emails" ADD COLUMN "subject" varchar DEFAULT 'You''ve received a new message.';
  ALTER TABLE "forms_emails" ADD COLUMN "message" jsonb;
  ALTER TABLE "forms" ADD COLUMN "submit_button_label" varchar;
  ALTER TABLE "forms" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "header_nav_items" ADD COLUMN "link_label" varchar;
  ALTER TABLE "header_secondary_nav_items" ADD COLUMN "link_label" varchar;
  ALTER TABLE "footer_service_links" ADD COLUMN "link_label" varchar;
  ALTER TABLE "footer_nav_items" ADD COLUMN "link_label" varchar;
  ALTER TABLE "footer" ADD COLUMN "blurb" varchar;
  ALTER TABLE "footer" ADD COLUMN "tagline" varchar;
  ALTER TABLE "footer" ADD COLUMN "location" varchar;
  UPDATE "pages_hero_links" AS parent SET "link_label" = locale."link_label" FROM "pages_hero_links_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_page_intro" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading", "heading_accent" = locale."heading_accent", "description" = locale."description", "image_alt" = locale."image_alt" FROM "pages_blocks_page_intro_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_service_cards_cards" AS parent SET "image_alt" = locale."image_alt", "title" = locale."title", "subtitle" = locale."subtitle", "description" = locale."description" FROM "pages_blocks_service_cards_cards_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_service_cards" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading" FROM "pages_blocks_service_cards_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_split_feature_items" AS parent SET "image_alt" = locale."image_alt", "title" = locale."title", "subtitle" = locale."subtitle" FROM "pages_blocks_split_feature_items_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_split_feature_links" AS parent SET "label" = locale."label" FROM "pages_blocks_split_feature_links_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_split_feature" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading", "heading_accent" = locale."heading_accent", "body" = locale."body", "image_alt" = locale."image_alt" FROM "pages_blocks_split_feature_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_process_section_trust_items" AS parent SET "image_alt" = locale."image_alt", "title" = locale."title", "description" = locale."description" FROM "pages_blocks_process_section_trust_items_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_process_section_steps" AS parent SET "title" = locale."title", "description" = locale."description" FROM "pages_blocks_process_section_steps_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_process_section" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading", "body" = locale."body" FROM "pages_blocks_process_section_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_category_bar_items" AS parent SET "title" = locale."title" FROM "pages_blocks_category_bar_items_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_category_bar" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading" FROM "pages_blocks_category_bar_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_cta_band_links" AS parent SET "label" = locale."label" FROM "pages_blocks_cta_band_links_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_cta_band" AS parent SET "heading" = locale."heading", "body" = locale."body" FROM "pages_blocks_cta_band_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_prose_section" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading", "body" = locale."body" FROM "pages_blocks_prose_section_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_capability_list_items" AS parent SET "title" = locale."title", "description" = locale."description" FROM "pages_blocks_capability_list_items_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_capability_list" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading" FROM "pages_blocks_capability_list_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_service_details_services_features" AS parent SET "text" = locale."text" FROM "pages_blocks_service_details_services_features_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages_blocks_service_details_services" AS parent SET "title" = locale."title", "subtitle" = locale."subtitle", "description" = locale."description", "image_alt" = locale."image_alt", "enquire_label" = locale."enquire_label" FROM "pages_blocks_service_details_services_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "pages" AS parent SET "title" = locale."title", "hero_eyebrow" = locale."hero_eyebrow", "hero_headline" = locale."hero_headline", "hero_description" = locale."hero_description", "hero_badge_primary" = locale."hero_badge_primary", "hero_badge_secondary" = locale."hero_badge_secondary", "hero_badge_muted" = locale."hero_badge_muted", "hero_rich_text" = locale."hero_rich_text", "meta_title" = locale."meta_title", "meta_image_id" = locale."meta_image_id", "meta_description" = locale."meta_description" FROM "pages_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_version_hero_links" AS parent SET "link_label" = locale."link_label" FROM "_pages_v_version_hero_links_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_page_intro" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading", "heading_accent" = locale."heading_accent", "description" = locale."description", "image_alt" = locale."image_alt" FROM "_pages_v_blocks_page_intro_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_service_cards_cards" AS parent SET "image_alt" = locale."image_alt", "title" = locale."title", "subtitle" = locale."subtitle", "description" = locale."description" FROM "_pages_v_blocks_service_cards_cards_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_service_cards" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading" FROM "_pages_v_blocks_service_cards_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_split_feature_items" AS parent SET "image_alt" = locale."image_alt", "title" = locale."title", "subtitle" = locale."subtitle" FROM "_pages_v_blocks_split_feature_items_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_split_feature_links" AS parent SET "label" = locale."label" FROM "_pages_v_blocks_split_feature_links_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_split_feature" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading", "heading_accent" = locale."heading_accent", "body" = locale."body", "image_alt" = locale."image_alt" FROM "_pages_v_blocks_split_feature_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_process_section_trust_items" AS parent SET "image_alt" = locale."image_alt", "title" = locale."title", "description" = locale."description" FROM "_pages_v_blocks_process_section_trust_items_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_process_section_steps" AS parent SET "title" = locale."title", "description" = locale."description" FROM "_pages_v_blocks_process_section_steps_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_process_section" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading", "body" = locale."body" FROM "_pages_v_blocks_process_section_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_category_bar_items" AS parent SET "title" = locale."title" FROM "_pages_v_blocks_category_bar_items_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_category_bar" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading" FROM "_pages_v_blocks_category_bar_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_cta_band_links" AS parent SET "label" = locale."label" FROM "_pages_v_blocks_cta_band_links_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_cta_band" AS parent SET "heading" = locale."heading", "body" = locale."body" FROM "_pages_v_blocks_cta_band_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_prose_section" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading", "body" = locale."body" FROM "_pages_v_blocks_prose_section_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_capability_list_items" AS parent SET "title" = locale."title", "description" = locale."description" FROM "_pages_v_blocks_capability_list_items_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_capability_list" AS parent SET "eyebrow" = locale."eyebrow", "heading" = locale."heading" FROM "_pages_v_blocks_capability_list_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_service_details_services_features" AS parent SET "text" = locale."text" FROM "_pages_v_blocks_service_details_services_features_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v_blocks_service_details_services" AS parent SET "title" = locale."title", "subtitle" = locale."subtitle", "description" = locale."description", "image_alt" = locale."image_alt", "enquire_label" = locale."enquire_label" FROM "_pages_v_blocks_service_details_services_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "_pages_v" AS parent SET "version_title" = locale."version_title", "version_hero_eyebrow" = locale."version_hero_eyebrow", "version_hero_headline" = locale."version_hero_headline", "version_hero_description" = locale."version_hero_description", "version_hero_badge_primary" = locale."version_hero_badge_primary", "version_hero_badge_secondary" = locale."version_hero_badge_secondary", "version_hero_badge_muted" = locale."version_hero_badge_muted", "version_hero_rich_text" = locale."version_hero_rich_text", "version_meta_title" = locale."version_meta_title", "version_meta_image_id" = locale."version_meta_image_id", "version_meta_description" = locale."version_meta_description" FROM "_pages_v_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "projects" AS parent SET "title" = locale."title" FROM "projects_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms_blocks_checkbox" AS parent SET "label" = locale."label" FROM "forms_blocks_checkbox_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms_blocks_country" AS parent SET "label" = locale."label" FROM "forms_blocks_country_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms_blocks_email" AS parent SET "label" = locale."label" FROM "forms_blocks_email_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms_blocks_message" AS parent SET "message" = locale."message" FROM "forms_blocks_message_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms_blocks_number" AS parent SET "label" = locale."label" FROM "forms_blocks_number_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms_blocks_select_options" AS parent SET "label" = locale."label" FROM "forms_blocks_select_options_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms_blocks_select" AS parent SET "label" = locale."label", "default_value" = locale."default_value" FROM "forms_blocks_select_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms_blocks_state" AS parent SET "label" = locale."label" FROM "forms_blocks_state_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms_blocks_text" AS parent SET "label" = locale."label", "default_value" = locale."default_value" FROM "forms_blocks_text_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms_blocks_textarea" AS parent SET "label" = locale."label", "default_value" = locale."default_value" FROM "forms_blocks_textarea_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms_emails" AS parent SET "subject" = locale."subject", "message" = locale."message" FROM "forms_emails_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "forms" AS parent SET "submit_button_label" = locale."submit_button_label", "confirmation_message" = locale."confirmation_message" FROM "forms_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "header_nav_items" AS parent SET "link_label" = locale."link_label" FROM "header_nav_items_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "header_secondary_nav_items" AS parent SET "link_label" = locale."link_label" FROM "header_secondary_nav_items_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "footer_service_links" AS parent SET "link_label" = locale."link_label" FROM "footer_service_links_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "footer_nav_items" AS parent SET "link_label" = locale."link_label" FROM "footer_nav_items_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "footer" AS parent SET "blurb" = locale."blurb", "tagline" = locale."tagline", "location" = locale."location" FROM "footer_locales" AS locale WHERE locale."_parent_id" = parent."id" AND locale."_locale" = 'en';
  UPDATE "projects" SET "title" = COALESCE("title", '') WHERE "title" IS NULL;
  ALTER TABLE "projects" ALTER COLUMN "title" SET NOT NULL;
  UPDATE "forms_blocks_select_options" SET "label" = COALESCE("label", '') WHERE "label" IS NULL;
  ALTER TABLE "forms_blocks_select_options" ALTER COLUMN "label" SET NOT NULL;
  UPDATE "forms_emails" SET "subject" = COALESCE("subject", '') WHERE "subject" IS NULL;
  ALTER TABLE "forms_emails" ALTER COLUMN "subject" SET NOT NULL;
  UPDATE "header_nav_items" SET "link_label" = COALESCE("link_label", '') WHERE "link_label" IS NULL;
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_label" SET NOT NULL;
  UPDATE "header_secondary_nav_items" SET "link_label" = COALESCE("link_label", '') WHERE "link_label" IS NULL;
  ALTER TABLE "header_secondary_nav_items" ALTER COLUMN "link_label" SET NOT NULL;
  UPDATE "footer_service_links" SET "link_label" = COALESCE("link_label", '') WHERE "link_label" IS NULL;
  ALTER TABLE "footer_service_links" ALTER COLUMN "link_label" SET NOT NULL;
  UPDATE "footer_nav_items" SET "link_label" = COALESCE("link_label", '') WHERE "link_label" IS NULL;
  ALTER TABLE "footer_nav_items" ALTER COLUMN "link_label" SET NOT NULL;
  DROP TABLE "pages_hero_links_locales" CASCADE;
  DROP TABLE "pages_blocks_page_intro_locales" CASCADE;
  DROP TABLE "pages_blocks_service_cards_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_service_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_split_feature_items_locales" CASCADE;
  DROP TABLE "pages_blocks_split_feature_links_locales" CASCADE;
  DROP TABLE "pages_blocks_split_feature_locales" CASCADE;
  DROP TABLE "pages_blocks_process_section_trust_items_locales" CASCADE;
  DROP TABLE "pages_blocks_process_section_steps_locales" CASCADE;
  DROP TABLE "pages_blocks_process_section_locales" CASCADE;
  DROP TABLE "pages_blocks_category_bar_items_locales" CASCADE;
  DROP TABLE "pages_blocks_category_bar_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_band_links_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_band_locales" CASCADE;
  DROP TABLE "pages_blocks_prose_section_locales" CASCADE;
  DROP TABLE "pages_blocks_capability_list_items_locales" CASCADE;
  DROP TABLE "pages_blocks_capability_list_locales" CASCADE;
  DROP TABLE "pages_blocks_service_details_services_features_locales" CASCADE;
  DROP TABLE "pages_blocks_service_details_services_locales" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_version_hero_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_page_intro_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_service_cards_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_service_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_split_feature_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_split_feature_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_split_feature_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_process_section_trust_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_process_section_steps_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_process_section_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_category_bar_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_category_bar_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_prose_section_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_capability_list_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_capability_list_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_service_details_services_features_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_service_details_services_locales" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "styles" CASCADE;
  DROP TABLE "styles_locales" CASCADE;
  DROP TABLE "spaces" CASCADE;
  DROP TABLE "spaces_locales" CASCADE;
  DROP TABLE "project_images" CASCADE;
  DROP TABLE "project_images_locales" CASCADE;
  DROP TABLE "project_images_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "header_nav_items_locales" CASCADE;
  DROP TABLE "header_secondary_nav_items_locales" CASCADE;
  DROP TABLE "footer_service_links_locales" CASCADE;
  DROP TABLE "footer_nav_items_locales" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_featured_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_styles_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_spaces_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_project_images_fk";
  
  DROP INDEX "_pages_v_snapshot_idx";
  DROP INDEX "_pages_v_published_locale_idx";
  DROP INDEX "projects_slug_idx";
  DROP INDEX "projects_featured_image_idx";
  DROP INDEX "projects__status_idx";
  DROP INDEX "payload_locked_documents_rels_styles_id_idx";
  DROP INDEX "payload_locked_documents_rels_spaces_id_idx";
  DROP INDEX "payload_locked_documents_rels_project_images_id_idx";
  ALTER TABLE "projects" ALTER COLUMN "type" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "address" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "project_status" SET NOT NULL;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  ALTER TABLE "_pages_v" DROP COLUMN "snapshot";
  ALTER TABLE "_pages_v" DROP COLUMN "published_locale";
  ALTER TABLE "projects" DROP COLUMN "generate_slug";
  ALTER TABLE "projects" DROP COLUMN "slug";
  ALTER TABLE "projects" DROP COLUMN "featured_image_id";
  ALTER TABLE "projects" DROP COLUMN "featured";
  ALTER TABLE "projects" DROP COLUMN "display_order";
  ALTER TABLE "projects" DROP COLUMN "_status";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "styles_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "spaces_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "project_images_id";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_type";
  DROP TYPE "public"."enum__projects_v_version_project_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";`)
}
