import { cookies } from 'next/headers'

import { defaultLocale, isSiteLocale, localeCookie, type SiteLocale } from '@/i18n/config'

export async function getLocale(): Promise<SiteLocale> {
  const store = await cookies()
  const value = store.get(localeCookie)?.value
  return isSiteLocale(value) ? value : defaultLocale
}
