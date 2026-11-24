import { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { repairEnquiryLocaleLeak } from '@/lib/enquiry/repairLocaleLeak'

/**
 * The select placeholder used to be one column. Its Chinese demo value was
 * copied onto every locale row. This puts the English demo string back on the
 * English row only when that row is still exactly that Chinese demo string.
 * A custom placeholder, a blank, and the Chinese row are left alone.
 * Down does not write the Chinese string back.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const result = await repairEnquiryLocaleLeak(payload)
  payload.logger.info(result)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  return
}
