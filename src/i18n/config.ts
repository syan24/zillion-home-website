export const locales = ['en', 'zh'] as const

export type SiteLocale = (typeof locales)[number]

export const defaultLocale: SiteLocale = 'en'

export const localeCookie = 'locale'

export function isSiteLocale(value: string | null | undefined): value is SiteLocale {
  return value === 'en' || value === 'zh'
}

/** `zh` is Simplified Chinese. The document language uses the BCP 47 tag. */
export function htmlLang(locale: SiteLocale): 'en' | 'zh-CN' {
  return locale === 'zh' ? 'zh-CN' : 'en'
}
