import * as migration_20260927_132223_initial from './20260927_132223_initial';
import * as migration_20260927_144616_add_media_blob_fields from './20260927_144616_add_media_blob_fields';
import * as migration_20261008_124440_swms_slice from './20261008_124440_swms_slice';
import * as migration_20261008_141215 from './20261008_141215';
import * as migration_20261011_054751_stage3_locales_portfolio from './20261011_054751_stage3_locales_portfolio';
import * as migration_20261012_024510_stage4_enquiries from './20261012_024510_stage4_enquiries';
import * as migration_20261012_040649_enquiry_form_answers from './20261012_040649_enquiry_form_answers';
import * as migration_20261012_045448_enquiry_option_icons from './20261012_045448_enquiry_option_icons';
import * as migration_20261119_095308_phase1_core_services from './20261119_095308_phase1_core_services';
import * as migration_20261120_012154_phase2_enquiry_scope_project_type from './20261120_012154_phase2_enquiry_scope_project_type';
import * as migration_20261122_074436_phase3_site_safety from './20261122_074436_phase3_site_safety';
import * as migration_20261123_150000_editor_content_schema from './20261123_150000_editor_content_schema';
import * as migration_20261123_150100_editor_content_baseline from './20261123_150100_editor_content_baseline';
import * as migration_20261124_004753_editorial_fields_schema from './20261124_004753_editorial_fields_schema';
import * as migration_20261124_004800_editorial_fields_backfill from './20261124_004800_editorial_fields_backfill';
import * as migration_20261124_090000_enquiry_locale_leak from './20261124_090000_enquiry_locale_leak';
import * as migration_20261124_130000_swms_seed_keys from './20261124_130000_swms_seed_keys';

export const migrations = [
  {
    up: migration_20260927_132223_initial.up,
    down: migration_20260927_132223_initial.down,
    name: '20260927_132223_initial',
  },
  {
    up: migration_20260927_144616_add_media_blob_fields.up,
    down: migration_20260927_144616_add_media_blob_fields.down,
    name: '20260927_144616_add_media_blob_fields',
  },
  {
    up: migration_20261008_124440_swms_slice.up,
    down: migration_20261008_124440_swms_slice.down,
    name: '20261008_124440_swms_slice',
  },
  {
    up: migration_20261008_141215.up,
    down: migration_20261008_141215.down,
    name: '20261008_141215',
  },
  {
    up: migration_20261011_054751_stage3_locales_portfolio.up,
    down: migration_20261011_054751_stage3_locales_portfolio.down,
    name: '20261011_054751_stage3_locales_portfolio',
  },
  {
    up: migration_20261012_024510_stage4_enquiries.up,
    down: migration_20261012_024510_stage4_enquiries.down,
    name: '20261012_024510_stage4_enquiries',
  },
  {
    up: migration_20261012_040649_enquiry_form_answers.up,
    down: migration_20261012_040649_enquiry_form_answers.down,
    name: '20261012_040649_enquiry_form_answers',
  },
  {
    up: migration_20261012_045448_enquiry_option_icons.up,
    down: migration_20261012_045448_enquiry_option_icons.down,
    name: '20261012_045448_enquiry_option_icons',
  },
  {
    up: migration_20261119_095308_phase1_core_services.up,
    down: migration_20261119_095308_phase1_core_services.down,
    name: '20261119_095308_phase1_core_services',
  },
  {
    up: migration_20261120_012154_phase2_enquiry_scope_project_type.up,
    down: migration_20261120_012154_phase2_enquiry_scope_project_type.down,
    name: '20261120_012154_phase2_enquiry_scope_project_type',
  },
  {
    up: migration_20261122_074436_phase3_site_safety.up,
    down: migration_20261122_074436_phase3_site_safety.down,
    name: '20261122_074436_phase3_site_safety',
  },
  {
    up: migration_20261123_150000_editor_content_schema.up,
    down: migration_20261123_150000_editor_content_schema.down,
    name: '20261123_150000_editor_content_schema',
  },
  {
    up: migration_20261123_150100_editor_content_baseline.up,
    down: migration_20261123_150100_editor_content_baseline.down,
    name: '20261123_150100_editor_content_baseline',
  },
  {
    up: migration_20261124_004753_editorial_fields_schema.up,
    down: migration_20261124_004753_editorial_fields_schema.down,
    name: '20261124_004753_editorial_fields_schema',
  },
  {
    up: migration_20261124_004800_editorial_fields_backfill.up,
    down: migration_20261124_004800_editorial_fields_backfill.down,
    name: '20261124_004800_editorial_fields_backfill',
  },
  {
    up: migration_20261124_090000_enquiry_locale_leak.up,
    down: migration_20261124_090000_enquiry_locale_leak.down,
    name: '20261124_090000_enquiry_locale_leak',
  },
  {
    up: migration_20261124_130000_swms_seed_keys.up,
    down: migration_20261124_130000_swms_seed_keys.down,
    name: '20261124_130000_swms_seed_keys',
  },
];
