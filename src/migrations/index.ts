import * as migration_20260927_132223_initial from './20260927_132223_initial';
import * as migration_20260927_144616_add_media_blob_fields from './20260927_144616_add_media_blob_fields';
import * as migration_20261008_124440_swms_slice from './20261008_124440_swms_slice';
import * as migration_20261008_141215 from './20261008_141215';

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
    name: '20261008_141215'
  },
];
