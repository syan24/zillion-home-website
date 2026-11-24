'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import { asNavItems, navHref, type NavItemRecord } from '@/content/navMenu'
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
  const navItems = asNavItems(data?.navItems)
  const secondaryItems = asNavItems(data?.secondaryNavItems)
  const enquiryLabel = data?.enquiryLabel?.trim() || ''
  const enquiryUrl = data?.enquiryUrl?.trim() || ''

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
        {navItems.map((item, index) => (
          <NavEntry key={item.id || navHref(item) || index} item={item} mobile={mobile} active={active} />
        ))}
        {secondaryItems.map((item, index) => (
          <NavEntry
            key={item.id || `secondary-${navHref(item) || index}`}
            item={item}
            mobile={mobile}
            active={active}
          />
        ))}
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

        {enquiryLabel && enquiryUrl ? (
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
            <Link href={enquiryUrl}>{enquiryLabel}</Link>
          </Button>
        ) : null}
      </div>
    </nav>
  )
}

function linkProps(item: NavItemRecord) {
  return {
    type: item.link?.type,
    url: item.link?.url,
    label: item.link?.label,
    newTab: item.link?.newTab,
    reference: item.link?.reference as React.ComponentProps<typeof CMSLink>['reference'],
  }
}

function NavEntry({
  item,
  mobile,
  active,
}: {
  item: NavItemRecord
  mobile: boolean
  active: (href: string) => boolean
}) {
  const children = item.children || []
  const href = navHref(item)
  if (!children.length) {
    return (
      <CMSLink
        {...linkProps(item)}
        appearance="inline"
        className={cn(linkClass, href && active(href) && 'border-b border-current pb-1')}
      />
    )
  }

  if (mobile) {
    return (
      <div className="flex flex-col gap-3">
        <CMSLink {...linkProps(item)} appearance="inline" className={linkClass} />
        <div className="flex flex-col gap-3 border-l border-border pl-4">
          {children.map((child, index) => (
            <CMSLink key={child.id || navHref(child) || index} {...linkProps(child)} appearance="inline" className={linkClass} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="group relative">
      <CMSLink
        {...linkProps(item)}
        appearance="inline"
        className={cn(linkClass, 'inline-flex items-center gap-1.5', href && active(href) && 'border-b border-current pb-1')}
      >
        <ChevronDown className="h-3 w-3 opacity-70" aria-hidden />
      </CMSLink>
      <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="flex min-w-56 flex-col gap-3 border border-[#d9d2c5] bg-background px-5 py-4 text-foreground">
          {children.map((child, index) => (
            <CMSLink key={child.id || navHref(child) || index} {...linkProps(child)} appearance="inline" className={linkClass} />
          ))}
        </div>
      </div>
    </div>
  )
}
