import * as migration_20260927_132223_initial from './20260927_132223_initial';
import * as migration_20260927_144616_add_media_blob_fields from './20260927_144616_add_media_blob_fields';
import * as migration_20261008_124440_swms_slice from './20261008_124440_swms_slice';
import * as migration_20261008_141215 from './20261008_141215';
import * as migration_20261011_054751_stage3_locales_portfolio from './20261011_054751_stage3_locales_portfolio';
import * as migration_20261012_024510_stage4_enquiries from './20261012_024510_stage4_enquiries';

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
    name: '20261012_024510_stage4_enquiries'
  },
];
