'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import type { SiteLocale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { setLocale } from '@/i18n/setLocale'

interface HeaderNavProps {
  data: HeaderType
  locale: SiteLocale
  mobile?: boolean
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, locale, mobile = false }) => {
  const copy = getMessages(locale)
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

  return (
    <nav
      className={cn(
        mobile ? 'flex flex-col gap-4' : 'flex items-center gap-6',
        'text-sm font-medium',
      )}
    >
      <div className={cn(mobile ? 'flex flex-col gap-3' : 'flex items-center gap-5')}>
        {navItems
          ? navItems.map(({ link }, i) => (
              <CMSLink
                key={i}
                {...link}
                appearance="link"
                className="text-foreground hover:text-foreground-soft transition-colors"
              />
            ))
          : defaultNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-foreground-soft transition-colors"
              >
                {item.label}
              </Link>
            ))}
      </div>

      {(navItems ? cmsSecondaryItems.length > 0 : true) && (
        <div className={cn(
          mobile ? 'flex flex-col gap-3 pt-3 border-t border-border' : 'flex items-center gap-5',
          'text-muted-foreground'
        )}>
          {navItems
            ? cmsSecondaryItems.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="link"
                  className="hover:text-foreground transition-colors"
                />
              ))
            : secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
        </div>
      )}

      <div className={cn(mobile ? 'flex flex-col gap-3 pt-3 border-t border-border' : 'flex items-center gap-4')}>
        <div className="flex items-center gap-1 text-sm">
          <form action={setLocale.bind(null, 'en')}>
            <button
              type="submit"
              className={cn(
                'px-2 py-1 rounded transition-colors',
                locale === 'en'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              aria-label={copy.switchToEnglish}
              aria-pressed={locale === 'en'}
            >
              EN
            </button>
          </form>
          <span className="text-border">|</span>
          <form action={setLocale.bind(null, 'zh')}>
            <button
              type="submit"
              className={cn(
                'px-2 py-1 rounded transition-colors',
                locale === 'zh'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              aria-label={copy.switchToChinese}
              aria-pressed={locale === 'zh'}
            >
              中文
            </button>
          </form>
        </div>

        <Button asChild variant="enquiry" className={cn(mobile && 'w-full')}>
          <Link href="/enquiry">{copy.enquiryCta}</Link>
        </Button>
      </div>
    </nav>
  )
}
