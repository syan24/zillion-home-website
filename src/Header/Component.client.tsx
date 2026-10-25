'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utilities/ui'

import type { SiteLocale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'

interface HeaderClientProps {
  data: Header
  locale: SiteLocale
}

function photoHeader(pathname: string) {
  return pathname === '/' || pathname === '/about' || pathname === '/services' || pathname === '/projects'
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, locale }) => {
  const copy = getMessages(locale)
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)
  const [scrolled, setScrolled] = useState(false)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMobileMenuOpen(false)
  }
  const overHero = photoHeader(pathname) && !scrolled && !mobileMenuOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300',
        overHero
          ? 'border-transparent bg-transparent text-[#f5f2ec]'
          : 'border-[#d9d2c5] bg-[#f5f2ec]/95 text-foreground backdrop-blur-sm',
      )}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-8 px-[clamp(20px,4vw,56px)] py-[22px]">
        <Link href="/" className="flex items-center text-current">
          <Logo />
        </Link>

        <div className="hidden lg:flex lg:items-center">
          <HeaderNav data={data} locale={locale} onDark={overHero} />
        </div>

        <button
          type="button"
          className="p-2 lg:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? copy.closeMenu : copy.openMenu}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#d9d2c5] bg-[#f5f2ec] px-[clamp(20px,4vw,56px)] py-4 text-foreground lg:hidden">
          <HeaderNav data={data} locale={locale} mobile />
        </div>
      )}
    </header>
  )
}
