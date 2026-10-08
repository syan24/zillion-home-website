import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { footerContent } from '@/content/marketing'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

const legal = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
]

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems ?? []
  const serviceLinks = footerData?.serviceLinks ?? []
  const blurb = footerData?.blurb || footerContent.blurb
  const tagline = footerData?.tagline || footerContent.tagline
  const location = footerData?.location || footerContent.location

  return (
    <footer className="mt-auto border-t border-border bg-dark text-dark-foreground">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <Logo variant="light" />
            </Link>
            <p className="mt-4 text-sm text-dark-foreground/70 max-w-xs">{blurb}</p>
            {tagline && <p className="mt-4 text-sm text-dark-foreground/70">{tagline}</p>}
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Services</h3>
            <ul className="mt-4 space-y-3">
              {serviceLinks.length > 0
                ? serviceLinks.map(({ link }, i) => (
                    <li key={i}>
                      <CMSLink
                        {...link}
                        className="text-sm text-dark-foreground/70 hover:text-dark-foreground transition-colors"
                      />
                    </li>
                  ))
                : footerContent.services.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-dark-foreground/70 hover:text-dark-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-3">
              {navItems.length > 0
                ? navItems.map(({ link }, i) => (
                    <li key={i}>
                      <CMSLink
                        {...link}
                        className="text-sm text-dark-foreground/70 hover:text-dark-foreground transition-colors"
                      />
                    </li>
                  ))
                : footerContent.company.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-dark-foreground/70 hover:text-dark-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Get in Touch</h3>
            <div className="mt-4 space-y-3">
              <Link
                href="/enquiry"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Start an Enquiry →
              </Link>
              <p className="text-sm text-dark-foreground/70">{location}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-dark-foreground/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-dark-foreground/60">
              © {new Date().getFullYear()} Zillion Home. All rights reserved.
            </p>
            <div className="flex gap-6">
              {legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs text-dark-foreground/60 hover:text-dark-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
