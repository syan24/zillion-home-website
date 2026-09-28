'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

interface HeaderNavProps {
  data: HeaderType
  mobile?: boolean
}

const defaultNavItems = [
  { href: '/', label: 'Home' },
  { href: '/services#residential', label: 'Residential' },
  { href: '/services#commercial', label: 'Commercial' },
  { href: '/services#joinery', label: 'Custom Joinery' },
  { href: '/services#interior', label: 'Interior Fit-out' },
]

const secondaryNavItems = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About Us' },
]

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, mobile = false }) => {
  const [locale, setLocale] = useState<'en' | 'zh'>('en')
  const cmsNavItems = data?.navItems || []

  const navItems = cmsNavItems.length > 0 ? cmsNavItems : null

  return (
    <nav
      className={cn(
        mobile ? 'flex flex-col gap-4' : 'flex items-center gap-6',
        'text-sm font-medium',
      )}
    >
      {/* Primary Navigation - Services */}
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

      {/* Secondary Navigation */}
      {!navItems && (
        <div className={cn(
          mobile ? 'flex flex-col gap-3 pt-3 border-t border-border' : 'flex items-center gap-5',
          'text-muted-foreground'
        )}>
          {secondaryNavItems.map((item) => (
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

      {/* Language Toggle & CTA */}
      <div className={cn(mobile ? 'flex flex-col gap-3 pt-3 border-t border-border' : 'flex items-center gap-4')}>
        {/* Language Toggle */}
        <div className="flex items-center gap-1 text-sm">
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={cn(
              'px-2 py-1 rounded transition-colors',
              locale === 'en'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
            aria-label="Switch to English"
          >
            EN
          </button>
          <span className="text-border">|</span>
          <button
            type="button"
            onClick={() => setLocale('zh')}
            className={cn(
              'px-2 py-1 rounded transition-colors',
              locale === 'zh'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
            aria-label="切换到中文"
          >
            中文
          </button>
        </div>

        {/* Enquiry CTA - Marketing beige variant */}
        <Button asChild variant="enquiry" className={cn(mobile && 'w-full')}>
          <Link href="/enquiry">Start an Enquiry →</Link>
        </Button>
      </div>
    </nav>
  )
}
