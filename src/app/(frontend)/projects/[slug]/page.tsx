import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { CopyLinkButton } from '@/components/Projects/CopyLinkButton'
import { Lightbox } from '@/components/Projects/Lightbox'
import { PlaceholderImage } from '@/components/PlaceholderImage'
import { Button } from '@/components/ui/button'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import { projectFilterHref } from '@/lib/projects/filters'
import { loadProjectDetail } from '@/lib/projects/loadPortfolio'

type Args = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const detail = await loadProjectDetail(decodeURIComponent(slug), await getLocale())
  if (!detail) return { title: 'Projects | Zillion Home' }
  return {
    title: `${detail.project.title} | Zillion Home`,
    description: detail.project.shortDescription || detail.project.description || undefined,
  }
}

export default async function ProjectDetailPage({ params, searchParams }: Args) {
  const locale = await getLocale()
  const copy = getMessages(locale).projects
  const { slug } = await params
  const query = await searchParams
  const imageParam = Array.isArray(query.image) ? query.image[0] : query.image
  const initialId = imageParam && /^\d+$/.test(imageParam) ? Number(imageParam) : null
  const detail = await loadProjectDetail(decodeURIComponent(slug), locale)
  if (!detail) notFound()

  const { project, images, related } = detail
  const typeLabel = project.type === 'commercial' ? copy.commercial : copy.residential

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-background-warm py-12 lg:py-16">
        <div className="container">
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
            {copy.back}
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">{typeLabel}</p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl">{project.title}</h1>
          {project.location && <p className="mt-3 text-foreground-soft">{project.location}</p>}
          {project.shortDescription && <p className="mt-6 max-w-2xl text-lg">{project.shortDescription}</p>}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.styleSlugs.map((slug, index) => (
              <Link key={slug} href={projectFilterHref({ style: slug }, 'gallery')} className="rounded-full border border-border px-3 py-1 text-sm">
                {project.styleNames[index] || slug}
              </Link>
            ))}
            {project.spaceSlugs.map((slug, index) => (
              <Link key={slug} href={projectFilterHref({ space: slug }, 'gallery')} className="rounded-full border border-border px-3 py-1 text-sm">
                {project.spaceNames[index] || slug}
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <CopyLinkButton path={`/projects/${project.slug}`} label={copy.copyLink} copiedLabel={copy.copied} />
            <Button asChild variant="enquiry">
              <Link href="/enquiry">{copy.enquire}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container">
          {project.description && (
            <div className="mb-10 max-w-3xl space-y-4 text-foreground-soft">
              {project.description.split(/\n\n+/).map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          )}
          {images.length ? (
            <Lightbox images={images} initialId={initialId} copy={copy} />
          ) : (
            <p className="text-foreground-soft">{copy.empty}</p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-background-warm py-16">
          <div className="container">
            <h2 className="mb-8 font-serif text-3xl">{copy.related}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/projects/${item.slug}`} className="block overflow-hidden rounded bg-background">
                  <PlaceholderImage src={item.src || undefined} alt={item.alt} aspectRatio="4/3" />
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {item.type === 'commercial' ? copy.commercial : copy.residential}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl">{item.title}</h3>
                    {item.location && <p className="text-sm text-muted-foreground">{item.location}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
