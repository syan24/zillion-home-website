import type { SiteLocale } from '@/i18n/config'
import {
  aboutContent,
  footerContent,
  headerNav,
  homeContent,
  servicesContent,
} from '@/content/marketing'
import {
  aboutContentZh,
  footerContentZh,
  headerNavZh,
  homeContentZh,
  servicesContentZh,
} from '@/content/marketing.zh'

export function getMarketing(locale: SiteLocale) {
  if (locale === 'zh') {
    return {
      home: homeContentZh,
      about: aboutContentZh,
      services: servicesContentZh,
      header: headerNavZh,
      footer: footerContentZh,
    }
  }

  return {
    home: homeContent,
    about: aboutContent,
    services: servicesContent,
    header: headerNav,
    footer: footerContent,
  }
}
