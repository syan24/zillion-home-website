import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { DesktopProjectFilter, FilterDrawer } from '@/components/Projects/FilterDrawer'
import { Lightbox } from '@/components/Projects/Lightbox'
import { PlaceholderImage } from '@/components/PlaceholderImage'
import { Button } from '@/components/ui/button'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import {
  hasProjectFilters,
  parseProjectFilters,
  projectFilterHref,
  roomSlugs,
  type ProjectFilters,
} from '@/lib/projects/filters'
import { loadPortfolio } from '@/lib/projects/loadPortfolio'

type Args = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const wrap = 'mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,56px)]'

function photoTitle(text: string) {
  const [first, ...rest] = text.split('\n')
  const second = rest.join(' ').trim()
  if (!second) return first
  return (
    <>
      {first}
      <br />
      <em className="italic text-accent-gold">{second}</em>
    </>
  )
}

function withView(href: string, view: 'project' | 'room') {
  const [path, hash] = href.split('#')
  const next = path.includes('?') ? `${path}&view=${view}` : `${path}?view=${view}`
  return hash ? `${next}#${hash}` : next
}

function countLabel(copy: { imageCount: string; imageCountOne: string }, count: number) {
  const template = count === 1 ? copy.imageCountOne : copy.imageCount
  return template.replace('{count}', String(count))
}

export async function generateMetadata(): Promise<Metadata> {
  const copy = getMessages(await getLocale()).projects
  return { title: copy.metaTitle, description: copy.metaDescription }
}

export default async function ProjectsPage({ searchParams }: Args) {
  const locale = await getLocale()
  const copy = getMessages(locale).projects
  const params = await searchParams
  const filters = parseProjectFilters(params)
  const viewParam = Array.isArray(params.view) ? params.view[0] : params.view
  const mode = viewParam === 'room' || filters.space ? 'room' : 'project'
  const portfolio = await loadPortfolio(locale, filters)
  const filtered = hasProjectFilters(filters)
  const hero =
    portfolio.covers.find((image) => image.filename === 'DSC03791.jpg') || portfolio.covers[0] || null

  const featured = portfolio.projects.map((project) => {
    const images = portfolio.covers.filter((image) => image.projectSlug === project.slug)
    return {
      ...project,
      cover: images[0] || null,
      count: images.length,
      location: images.find((image) => image.location)?.location || null,
    }
  })

  const chipHref = (next: ProjectFilters, view: 'project' | 'room' = mode) =>
    withView(projectFilterHref(next, 'gallery'), view)

  return (
    <main className="min-h-screen">
      <section className="relative flex min-h-[78vh] items-end overflow-hidden text-[#f5f2ec] md:h-[82vh] md:min-h-[620px]">
        <div className="absolute inset-0">
          <PlaceholderImage
            src={hero?.src}
            alt={hero?.alt || copy.heroAlt}
            className="h-full w-full"
            aspectRatio="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(20,18,15,0.6)] via-[rgba(20,18,15,0.2)] to-[rgba(20,18,15,0.85)]" />
        </div>
        <div className={`${wrap} relative flex flex-col gap-10 pb-14 pt-32`}>
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.4em]">
            <span className="h-px w-12 bg-accent" aria-hidden />
            {copy.eyebrow}
          </p>
          <div className="flex flex-wrap items-end justify-between gap-10">
            <h1 className="max-w-[12ch] font-serif text-[clamp(52px,8vw,128px)] font-light leading-[0.94]">
              {photoTitle(copy.heading)}
            </h1>
            {hero?.projectTitle && (
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#f5f2ec]/85">
                {copy.pictured.replace('{name}', hero.projectTitle)}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className={`${wrap} flex flex-col gap-14 pb-0 pt-[clamp(96px,10vw,150px)]`}>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-6">
            <p className="text-[11px] uppercase tracking-[0.4em] text-accent-tan">— {copy.portfolioEyebrow}</p>
            <h2 className="font-serif text-[clamp(40px,4.6vw,72px)] font-light leading-none">{copy.portfolioHeading}</h2>
          </div>
          <p className="max-w-md text-[15px] leading-8 text-[#5c564d]">{copy.intro}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="group flex flex-col gap-5">
              <div className="aspect-[4/5] overflow-hidden bg-[#d9d2c5]">
                <PlaceholderImage
                  src={project.cover?.src}
                  alt={project.cover?.alt || project.title}
                  aspectRatio="auto"
                  className="h-full w-full motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
                />
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-[#c9c0b0] pt-4">
                <div className="flex flex-col gap-1.5">
                  <span className="font-serif text-[28px] leading-tight">{project.title}</span>
                  <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    {project.type === 'commercial' ? copy.commercial : copy.residential}
                    {project.location ? ` · ${project.location}` : ''}
                  </span>
                </div>
                <span className="font-serif text-[17px] italic text-accent-tan">
                  {countLabel(copy, project.count)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="gallery" className={`${wrap} flex scroll-mt-24 flex-col gap-11 py-[clamp(96px,10vw,150px)]`}>
        <div className="flex flex-col gap-7 border-t border-foreground pt-9">
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <h2 className="font-serif text-[clamp(36px,3.6vw,56px)] font-light leading-none">{copy.gallery}</h2>
            <div className="flex gap-8 text-[11px] uppercase tracking-[0.28em]">
              <Link
                href={chipHref({ ...filters, space: undefined }, 'project')}
                className={mode === 'project' ? 'border-b border-foreground pb-1.5' : 'pb-1.5 text-muted-foreground'}
              >
                {copy.byProject}
              </Link>
              <Link
                href={chipHref({ ...filters, project: undefined, type: undefined }, 'room')}
                className={mode === 'room' ? 'border-b border-foreground pb-1.5' : 'pb-1.5 text-muted-foreground'}
              >
                {copy.byRoom}
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex flex-wrap gap-2.5">
              {mode === 'project' ? (
                <>
                  <StyleChip href={chipHref({ ...filters, project: undefined })} active={!filters.project}>
                    {copy.allProjects}
                  </StyleChip>
                  {portfolio.projects.map((project) => (
                    <StyleChip
                      key={project.slug}
                      href={chipHref({ ...filters, project: project.slug, space: undefined })}
                      active={filters.project === project.slug}
                    >
                      {project.title}
                    </StyleChip>
                  ))}
                </>
              ) : (
                <>
                  <StyleChip href={chipHref({ ...filters, space: undefined }, 'room')} active={!filters.space}>
                    {copy.allSpaces}
                  </StyleChip>
                  {roomSlugs.map((slug) => {
                    const space = portfolio.spaces.find((item) => item.slug === slug)
                    return (
                      <StyleChip
                        key={slug}
                        href={chipHref({ ...filters, space: slug, project: undefined }, 'room')}
                        active={filters.space === slug}
                      >
                        {space?.name || copy.rooms[slug]}
                      </StyleChip>
                    )
                  })}
                </>
              )}
            </div>
            <span className="font-serif text-lg italic text-muted-foreground">
              {countLabel(copy, portfolio.images.length)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterDrawer
              copy={copy}
              filters={filters}
              styles={portfolio.styles}
              spaces={portfolio.spaces}
              projects={portfolio.projects}
            />
            <StyleChip
              href={withView(projectFilterHref({ ...filters, style: undefined }, 'gallery'), mode)}
              active={!filters.style}
            >
              {copy.allStyles}
            </StyleChip>
            {portfolio.styles.map((style) => (
              <StyleChip
                key={style.slug}
                href={withView(projectFilterHref({ ...filters, style: style.slug }, 'gallery'), mode)}
                active={filters.style === style.slug}
              >
                {style.name}
              </StyleChip>
            ))}
            {filtered && (
              <Link href="/projects#gallery" className="px-3 text-sm text-muted-foreground hover:text-foreground">
                {copy.clear}
              </Link>
            )}
          </div>
          <DesktopProjectFilter
            copy={copy}
            filters={filters}
            styles={portfolio.styles}
            spaces={portfolio.spaces}
            projects={portfolio.projects}
          />
        </div>
        {portfolio.images.length ? (
          <Lightbox images={portfolio.images} copy={copy} layout="masonry" />
        ) : (
          <p className="text-foreground-soft">{copy.empty}</p>
        )}
      </section>

      <section className="bg-dark text-dark-foreground">
        <div className={`${wrap} flex flex-col items-center gap-8 py-[clamp(100px,11vw,170px)] text-center`}>
          <p className="text-[11px] uppercase tracking-[0.4em] text-accent">— {copy.bandEyebrow}</p>
          <h2 className="max-w-[14ch] font-serif text-[clamp(44px,5.6vw,92px)] font-light leading-none">
            <BandHeading text={copy.bandHeading} accent={copy.bandAccent} />
          </h2>
          <Button
            asChild
            variant="enquiry"
            className="h-auto rounded-none px-10 py-5 text-[11px] font-normal uppercase tracking-[0.3em] shadow-none"
          >
            <Link href="/enquiry">{copy.enquire}</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

function BandHeading({ text, accent }: { text: string; accent: string }) {
  if (!accent || !text.includes(accent)) return text
  const [before, after] = text.split(accent)
  return (
    <>
      {before}
      <em className="italic text-accent-gold">{accent}</em>
      {after}
    </>
  )
}

function StyleChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'border border-primary bg-primary px-5 py-2.5 text-xs tracking-wide text-primary-foreground'
          : 'border border-[#c9c0b0] px-5 py-2.5 text-xs tracking-wide hover:border-foreground'
      }
    >
      {children}
    </Link>
  )
}
