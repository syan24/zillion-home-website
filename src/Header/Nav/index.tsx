'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import type { SiteLocale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { setLocale } from '@/i18n/setLocale'

interface HeaderNavProps {
  data: HeaderType
  locale: SiteLocale
  mobile?: boolean
  onDark?: boolean
}

/** Design Canvas header nav: Jost 300, 11px, 0.24em tracking, uppercase. */
const menuType = 'font-sans text-[11px] font-light uppercase tracking-[0.24em]'

const linkClass = cn(menuType, 'text-current no-underline transition-opacity hover:no-underline hover:opacity-70')

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, locale, mobile = false, onDark = false }) => {
  const copy = getMessages(locale)
  const pathname = usePathname()
  const cmsNavItems = data?.navItems || []
  const cmsSecondaryItems = data?.secondaryNavItems || []
  const navItems = cmsNavItems.length > 0 || cmsSecondaryItems.length > 0 ? cmsNavItems : null

  const defaultNavItems = [
    { href: '/', label: locale === 'zh' ? '首页' : 'Home' },
    { href: '/services#residential', label: locale === 'zh' ? '住宅施工' : 'Residential' },
    { href: '/services#commercial', label: locale === 'zh' ? '商业装修' : 'Commercial' },
    { href: '/services#joinery', label: locale === 'zh' ? '定制木作' : 'Custom Joinery' },
    { href: '/services#interior', label: locale === 'zh' ? '室内交付' : 'Interior Fit-out' },
  ]

  const secondaryNavItems = [
    { href: '/projects', label: locale === 'zh' ? '项目' : 'Projects' },
    { href: '/about', label: locale === 'zh' ? '关于我们' : 'About Us' },
  ]

  const active = (href: string) => {
    const path = href.split('#')[0] || '/'
    if (path === '/') return pathname === '/'
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <nav
      className={cn(
        menuType,
        mobile ? 'flex flex-col gap-4' : 'flex flex-wrap items-center justify-end gap-x-7 gap-y-3',
      )}
    >
      <div className={cn(mobile ? 'flex flex-col gap-3' : 'flex flex-wrap items-center gap-x-7 gap-y-2')}>
        {navItems
          ? navItems.map(({ link }, i) => (
              <CMSLink key={i} {...link} appearance="inline" className={linkClass} />
            ))
          : defaultNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(linkClass, active(item.href) && 'border-b border-current pb-1')}
              >
                {item.label}
              </Link>
            ))}
        {(navItems ? cmsSecondaryItems.length > 0 : true) &&
          (navItems
            ? cmsSecondaryItems.map(({ link }, i) => (
                <CMSLink key={`secondary-${i}`} {...link} appearance="inline" className={linkClass} />
              ))
            : secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(linkClass, active(item.href) && 'border-b border-current pb-1')}
                >
                  {item.label}
                </Link>
              )))}
      </div>

      <div className={cn(mobile ? 'flex flex-col gap-3 border-t border-border pt-3' : 'flex items-center gap-5')}>
        <div className={cn(menuType, 'flex items-center gap-2.5 opacity-80')}>
          <form action={setLocale.bind(null, 'en')}>
            <button
              type="submit"
              className={cn(menuType, 'transition-opacity', locale === 'en' ? 'opacity-100' : 'opacity-60 hover:opacity-100')}
              aria-label={copy.switchToEnglish}
              aria-pressed={locale === 'en'}
            >
              EN
            </button>
          </form>
          <span aria-hidden>/</span>
          <form action={setLocale.bind(null, 'zh')}>
            <button
              type="submit"
              className={cn(menuType, 'transition-opacity', locale === 'zh' ? 'opacity-100' : 'opacity-60 hover:opacity-100')}
              aria-label={copy.switchToChinese}
              aria-pressed={locale === 'zh'}
            >
              中文
            </button>
          </form>
        </div>

        <Button
          asChild
          variant={onDark ? 'outlineDark' : 'enquiry'}
          className={cn(
            menuType,
            'h-auto rounded-none px-5 py-3 shadow-none',
            mobile && 'w-full',
            onDark && 'border-current text-current hover:bg-white/10',
          )}
        >
          <Link href="/enquiry">{copy.enquiryCta}</Link>
        </Button>
      </div>
    </nav>
  )
}
