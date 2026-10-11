'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { isSiteLocale, localeCookie, type SiteLocale } from '@/i18n/config'

export async function setLocale(locale: SiteLocale) {
  if (!isSiteLocale(locale)) return

  const store = await cookies()
  store.set(localeCookie, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  revalidatePath('/', 'layout')
}
