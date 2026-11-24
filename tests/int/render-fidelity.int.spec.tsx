import { cleanup, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { HeaderNav } from '@/Header/Nav'
import { CategoryBar, ServiceCards, ServiceDetails } from '@/components/Marketing/sections'
import type { Header } from '@/payload-types'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('editor strings render as stored', () => {
  afterEach(() => {
    cleanup()
  })

  it('shows interior titles and enquire labels instead of hiding or rewriting them', () => {
    render(
      <ServiceCards
        heading="What we do"
        cards={[
          { title: 'Interior Fit-out', href: '/services#interior', description: 'Still shown' },
          { title: '室内装修', href: '/services#rooms' },
        ]}
      />,
    )
    expect(screen.getByText('Interior Fit-out')).toBeTruthy()
    expect(screen.getByText('室内装修')).toBeTruthy()
    expect(screen.getByText('Still shown')).toBeTruthy()

    render(<CategoryBar items={[{ title: '室内交付' }, { title: 'Custom Joinery' }]} />)
    expect(screen.getByText('室内交付')).toBeTruthy()

    render(
      <ServiceDetails
        services={[
          {
            anchor: 'interior',
            title: 'Interior Fit-out & Delivery',
            enquireLabel: 'Enquire about Interior',
          },
          {
            anchor: 'residential',
            title: 'Residential Construction & Renovation',
            enquireLabel: 'Enquire about Residential',
          },
        ]}
      />,
    )
    expect(screen.getByRole('link', { name: 'Enquire about Interior' }).getAttribute('href')).toBe(
      '/enquiry',
    )
    expect(
      screen.getByRole('link', { name: 'Enquire about Residential' }).getAttribute('href'),
    ).toBe('/projects?view=project&type=residential')
  })

  it('keeps a flat header instead of rebuilding an Our Services menu', () => {
    const data = {
      id: 1,
      contentSeeded: true,
      navItems: [
        { id: 'a', link: { type: 'custom', url: '/services#residential', label: 'Keep Residential' } },
        { id: 'b', link: { type: 'custom', url: '/services#commercial', label: 'Keep Commercial' } },
        { id: 'c', link: { type: 'custom', url: '/services#joinery', label: 'Keep Joinery' } },
        { id: 'd', link: { type: 'custom', url: '/services#interior', label: 'Interior Fit-out' } },
      ],
      secondaryNavItems: [],
      updatedAt: '',
      createdAt: '',
    } as Header

    render(<HeaderNav data={data} locale="en" />)
    expect(screen.getByText('Keep Residential')).toBeTruthy()
    expect(screen.getByText('Interior Fit-out')).toBeTruthy()
    expect(screen.queryByText('Our Services')).toBeNull()
    expect(screen.queryByText('Start an Enquiry →')).toBeNull()
  })

  it('does not invent a features label or a header enquiry button', () => {
    render(
      <ServiceDetails
        services={[{ anchor: 'joinery', title: 'Custom Joinery', features: [{ text: 'Wardrobes' }] }]}
      />,
    )
    expect(screen.queryByText('What we deliver')).toBeNull()
    expect(screen.getByText('Wardrobes')).toBeTruthy()

    render(
      <HeaderNav
        data={{ id: 1, navItems: [], secondaryNavItems: [], updatedAt: '', createdAt: '' }}
        locale="en"
      />,
    )
    expect(screen.queryByRole('link', { name: 'Start an Enquiry →' })).toBeNull()
  })
})
