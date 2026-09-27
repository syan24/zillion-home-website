import * as migration_20260927_132223_initial from './20260927_132223_initial';
import * as migration_20260927_144616_add_media_blob_fields from './20260927_144616_add_media_blob_fields';

export const migrations = [
  {
    up: migration_20260927_132223_initial.up,
    down: migration_20260927_132223_initial.down,
    name: '20260927_132223_initial',
  },
  {
    up: migration_20260927_144616_add_media_blob_fields.up,
    down: migration_20260927_144616_add_media_blob_fields.down,
    name: '20260927_144616_add_media_blob_fields'
  },
];
