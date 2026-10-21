import { createElement, type AnchorHTMLAttributes } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    createElement('a', { href, ...props }, children),
}))

import { MarketingLinks } from '@/components/Marketing/sections'
import { buttonVariants } from '@/components/ui/button'

describe('dark CTA outline button contrast', () => {
  it('uses a transparent fill with light text instead of the light outline fill', () => {
    const classes = buttonVariants({ variant: 'outlineDark', size: 'lg' })

    expect(classes).toContain('bg-transparent')
    expect(classes).toContain('text-dark-foreground')
    expect(classes).not.toContain('bg-background')
  })

  it('keeps the light-surface outline button on a light fill', () => {
    const classes = buttonVariants({ variant: 'outline' })

    expect(classes).toContain('bg-background')
    expect(classes).not.toContain('text-dark-foreground')
    expect(classes).not.toContain('bg-transparent')
  })

  it('renders readable secondary labels on dark bands in English and Chinese', () => {
    const { rerender } = render(
      createElement(MarketingLinks, {
        tone: 'dark',
        links: [
          { label: 'Start an Enquiry →', href: '/enquiry', variant: 'enquiry' },
          { label: 'View Our Services', href: '/services', variant: 'outline' },
        ],
      }),
    )

    const services = screen.getByRole('link', { name: 'View Our Services' })
    expect(services.className).toContain('bg-transparent')
    expect(services.className).toContain('text-dark-foreground')
    expect(services.className).not.toContain('bg-background')

    const enquiry = screen.getByRole('link', { name: 'Start an Enquiry →' })
    expect(enquiry.className).toContain('bg-accent')
    expect(enquiry.className).not.toContain('bg-transparent')

    rerender(
      createElement(MarketingLinks, {
        tone: 'dark',
        links: [{ label: '查看服务', href: '/services', variant: 'outline' }],
      }),
    )

    const servicesZh = screen.getByRole('link', { name: '查看服务' })
    expect(servicesZh.className).toContain('bg-transparent')
    expect(servicesZh.className).toContain('text-dark-foreground')
    expect(servicesZh.className).not.toContain('bg-background')
  })

  it('leaves outline buttons on light backgrounds on the light fill', () => {
    render(
      createElement(MarketingLinks, {
        tone: 'light',
        links: [{ label: 'View Our Services', href: '/services', variant: 'outline' }],
      }),
    )

    const services = screen.getByRole('link', { name: 'View Our Services' })
    expect(services.className).toContain('bg-background')
    expect(services.className).not.toContain('text-dark-foreground')
  })
})
