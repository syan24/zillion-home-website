import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { getMarketing } from '@/content/getMarketing'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

export async function Footer() {
  const locale = await getLocale()
  const copy = getMessages(locale)
  const footerContent = getMarketing(locale).footer
  const footerData = await getCachedGlobal('footer', 1, locale)()
  const navItems = footerData?.navItems ?? []
  const serviceLinks = footerData?.serviceLinks ?? []
  const blurb = footerData?.blurb || footerContent.blurb
  const tagline = footerData?.tagline || footerContent.tagline
  const location = footerData?.location || footerContent.location
  const legal = [
    { name: copy.footer.privacy, href: '/privacy' },
    { name: copy.footer.terms, href: '/terms' },
  ]

  const columnLabel = 'mb-1.5 text-[10px] uppercase tracking-[0.34em] text-accent'
  const itemClass = 'text-sm text-footer-foreground transition-colors hover:text-[#efe9de]'

  return (
    <footer className="mt-auto bg-footer text-footer-foreground">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-[clamp(20px,4vw,56px)] pb-9 pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-5 sm:col-span-2">
            <Link href="/" className="inline-block">
              <Logo variant="light" />
            </Link>
            <p className="max-w-sm text-sm leading-8">{blurb}</p>
            {tagline && <p className="text-sm leading-8">{tagline}</p>}
          </div>

          <div className="flex flex-col gap-3.5 text-sm">
            <h3 className={columnLabel}>{copy.footer.services}</h3>
            {serviceLinks.length > 0
              ? serviceLinks.map(({ link }, i) => <CMSLink key={i} {...link} className={itemClass} />)
              : footerContent.services.map((item) => (
                  <Link key={item.href} href={item.href} className={itemClass}>
                    {item.label}
                  </Link>
                ))}
          </div>

          <div className="flex flex-col gap-3.5 text-sm">
            <h3 className={columnLabel}>{copy.footer.company}</h3>
            {navItems.length > 0
              ? navItems.map(({ link }, i) => <CMSLink key={i} {...link} className={itemClass} />)
              : footerContent.company.map((item) => (
                  <Link key={item.href} href={item.href} className={itemClass}>
                    {item.label}
                  </Link>
                ))}
            {location && <span>{location}</span>}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[#efe9de]/10 pt-7 text-xs tracking-wide">
          <p>
            © {new Date().getFullYear()} Zillion Home. {copy.footer.rights}
          </p>
          <div className="flex gap-7">
            {legal.map((item) => (
              <Link key={item.name} href={item.href} className="transition-colors hover:text-[#efe9de]">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
