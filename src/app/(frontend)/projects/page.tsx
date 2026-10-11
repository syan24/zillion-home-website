import type { Metadata } from 'next'
import Link from 'next/link'
import React, { Fragment } from 'react'

import { DesktopProjectFilter, FilterDrawer } from '@/components/Projects/FilterDrawer'
import { Lightbox } from '@/components/Projects/Lightbox'
import { PlaceholderImage } from '@/components/PlaceholderImage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import {
  hasProjectFilters,
  parseProjectFilters,
  projectFilterHref,
  roomSlugs,
  type ProjectFilters,
} from '@/lib/projects/filters'
import { coverFor, loadPortfolio, type GalleryImage } from '@/lib/projects/loadPortfolio'

type Args = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function lines(text: string) {
  return text.split('\n').map((line, index) => (
    <Fragment key={`${line}-${index}`}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ))
}

export async function generateMetadata(): Promise<Metadata> {
  const copy = getMessages(await getLocale()).projects
  return { title: copy.metaTitle, description: copy.metaDescription }
}

export default async function ProjectsPage({ searchParams }: Args) {
  const locale = await getLocale()
  const copy = getMessages(locale).projects
  const filters = parseProjectFilters(await searchParams)
  const portfolio = await loadPortfolio(locale, filters)
  const filtered = hasProjectFilters(filters)
  const roomLabels = copy.rooms

  const withFilters = (next: ProjectFilters) => projectFilterHref({ ...filters, ...next }, 'gallery')

  return (
    <main className="min-h-screen scroll-smooth">
      <section className="bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">{copy.eyebrow}</p>
              <h1 className="mb-4 font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">{lines(copy.heading)}</h1>
              <p className="max-w-lg text-lg text-foreground-soft">{copy.intro}</p>
            </div>
            <PlaceholderImage
              src={portfolio.covers[0]?.src}
              alt={portfolio.covers[0]?.alt || copy.heroAlt}
              aspectRatio="4/3"
              className="rounded"
            />
          </div>

          <nav className="mt-12 flex flex-col justify-center gap-4 border-t border-border pt-8 sm:flex-row">
            <a href="#by-project" className="flex items-center gap-3 rounded-full border border-border bg-background px-6 py-3 hover:border-accent">
              <span>
                <span className="block text-sm font-medium">{copy.byProject}</span>
                <span className="block text-xs text-muted-foreground">{copy.byProjectHint}</span>
              </span>
            </a>
            <a href="#by-room" className="flex items-center gap-3 rounded-full border border-border bg-background px-6 py-3 hover:border-accent">
              <span>
                <span className="block text-sm font-medium">{copy.byRoom}</span>
                <span className="block text-xs text-muted-foreground">{copy.byRoomHint}</span>
              </span>
            </a>
          </nav>
        </div>
      </section>

      <section className="border-b border-border bg-background py-8">
        <div className="container space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <FilterDrawer
              copy={copy}
              filters={filters}
              styles={portfolio.styles}
              spaces={portfolio.spaces}
              projects={portfolio.projects}
            />
            <StyleChip href={projectFilterHref({ ...filters, style: undefined }, filtered ? 'gallery' : undefined)} active={!filters.style}>
              {copy.allStyles}
            </StyleChip>
            {portfolio.styles.map((style) => (
              <StyleChip
                key={style.slug}
                href={withFilters({ style: style.slug })}
                active={filters.style === style.slug}
              >
                {style.name}
              </StyleChip>
            ))}
          </div>
          <DesktopProjectFilter
            copy={copy}
            filters={filters}
            styles={portfolio.styles}
            spaces={portfolio.spaces}
            projects={portfolio.projects}
          />
        </div>
      </section>

      {filtered && (
        <section id="gallery" className="scroll-mt-24 bg-background py-12 lg:py-16">
          <div className="container">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-serif text-3xl">{copy.results}</h2>
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
                {copy.clear}
              </Link>
            </div>
            {portfolio.images.length ? (
              <Lightbox images={portfolio.images} copy={copy} />
            ) : (
              <p className="text-foreground-soft">{copy.empty}</p>
            )}
          </div>
        </section>
      )}

      <section id="by-project" className="scroll-mt-24 bg-background py-16 lg:py-24">
        <div className="container">
          <div className="mb-8">
            <h2 className="font-serif text-3xl md:text-4xl">{copy.byProject}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{copy.byProjectBody}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <EntryCard
              href={withFilters({ type: 'residential', space: undefined, project: undefined })}
              title={copy.residentialTitle}
              body={copy.residentialBody}
              image={coverFor(portfolio.covers, (image) => image.projectType === 'residential')}
              active={filters.type === 'residential'}
            />
            <EntryCard
              href={withFilters({ type: 'commercial', space: undefined, project: undefined })}
              title={copy.commercialTitle}
              body={copy.commercialBody}
              image={coverFor(portfolio.covers, (image) => image.projectType === 'commercial')}
              active={filters.type === 'commercial'}
            />
          </div>
        </div>
      </section>

      <section id="by-room" className="scroll-mt-24 bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="mb-8">
            <h2 className="font-serif text-3xl md:text-4xl">{copy.byRoom}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{copy.byRoomBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {roomSlugs.map((slug) => {
              const space = portfolio.spaces.find((item) => item.slug === slug)
              return (
                <EntryCard
                  key={slug}
                  href={withFilters({ space: slug, type: undefined, project: undefined })}
                  title={space?.name || roomLabels[slug]}
                  image={coverFor(portfolio.covers, (image) => image.spaceSlugs.includes(slug))}
                  active={filters.space === slug}
                  compact
                />
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

function StyleChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground'
          : 'rounded-full border border-border px-4 py-2 text-sm hover:border-accent'
      }
    >
      {children}
    </Link>
  )
}

function EntryCard({
  href,
  title,
  body,
  image,
  active,
  compact = false,
}: {
  href: string
  title: string
  body?: string
  image: GalleryImage | null
  active: boolean
  compact?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group block overflow-hidden rounded bg-background ${active ? 'ring-2 ring-accent' : ''}`}
    >
      <PlaceholderImage src={image?.src} alt={image?.alt || title} aspectRatio={compact ? '4/3' : '16/9'} />
      <div className={compact ? 'p-3' : 'p-5'}>
        <h3 className="font-serif text-xl group-hover:text-accent">{title}</h3>
        {body && <p className="mt-1 text-sm text-muted-foreground">{body}</p>}
      </div>
    </Link>
  )
}
