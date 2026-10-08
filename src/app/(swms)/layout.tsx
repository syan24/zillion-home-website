import type { Metadata } from 'next'

import { Logo } from '@/components/Logo/Logo'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { cn } from '@/utilities/ui'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import React from 'react'

import '../(frontend)/globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SWMS | Zillion Home',
  description: 'Read and sign the project Safe Work Method Statement.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SWMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(dmSans.variable, cormorant.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col bg-background-warm text-foreground">
          <header className="border-b border-border bg-background">
            <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-4">
              <Logo />
              <p className="text-right text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                Safe work
                <br />
                Safe sites
              </p>
            </div>
          </header>
          <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">{children}</main>
          <footer className="px-4 py-6 text-center text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
            Safe work · Safe sites · Better builds
          </footer>
        </div>
      </body>
    </html>
  )
}
