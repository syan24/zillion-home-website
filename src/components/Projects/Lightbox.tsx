'use client'

import React, { useEffect, useState } from 'react'

import type { Messages } from '@/i18n/messages'
import type { GalleryImage } from '@/lib/projects/loadPortfolio'

import { CopyLinkButton } from './CopyLinkButton'

type Copy = Messages['projects']

export function Lightbox({
  images,
  initialId,
  copy,
}: {
  images: GalleryImage[]
  initialId?: number | null
  copy: Copy
}) {
  const [openId, setOpenId] = useState<number | null>(initialId ?? null)
  const index = images.findIndex((image) => image.id === openId)
  const image = index >= 0 ? images[index] : null

  useEffect(() => {
    if (!image) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null)
      if (event.key === 'ArrowRight') setOpenId(images[(index + 1) % images.length]?.id ?? null)
      if (event.key === 'ArrowLeft') setOpenId(images[(index - 1 + images.length) % images.length]?.id ?? null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [image, images, index])

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((item) => (
          <figure key={item.id} className="overflow-hidden rounded bg-background-warm">
            <button type="button" className="block w-full text-left" onClick={() => setOpenId(item.id)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} className="aspect-[4/3] w-full object-cover" />
            </button>
            <figcaption className="flex items-start justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.projectTitle}</p>
              </div>
              <button type="button" className="text-sm text-accent" onClick={() => setOpenId(item.id)}>
                {copy.viewProject}
              </button>
            </figcaption>
          </figure>
        ))}
      </div>

      {image && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0" aria-label={copy.closeLightbox} onClick={() => setOpenId(null)} />
          <div className="relative z-10 w-full max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt={image.alt} className="max-h-[75vh] w-full object-contain" />
            <div className="mt-4 flex flex-col gap-3 text-white md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-serif text-2xl">{image.title}</p>
                {image.caption && <p className="text-sm text-white/75">{image.caption}</p>}
                <a href={`/projects/${image.projectSlug}`} className="text-sm text-accent">
                  {image.projectTitle}
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded border border-white/30 px-3 py-2 text-sm"
                  onClick={() => setOpenId(images[(index - 1 + images.length) % images.length]?.id ?? null)}
                >
                  {copy.previous}
                </button>
                <button
                  type="button"
                  className="rounded border border-white/30 px-3 py-2 text-sm"
                  onClick={() => setOpenId(images[(index + 1) % images.length]?.id ?? null)}
                >
                  {copy.next}
                </button>
                <CopyLinkButton
                  path={`/projects/${image.projectSlug}?image=${image.id}`}
                  label={copy.shareImage}
                  copiedLabel={copy.copied}
                  className="border-white/30 text-white hover:border-white"
                />
                {image.downloadHref && (
                  <a href={image.downloadHref} className="rounded bg-white px-3 py-2 text-sm text-black">
                    {copy.download}
                  </a>
                )}
                <button type="button" className="rounded border border-white/30 px-3 py-2 text-sm" onClick={() => setOpenId(null)}>
                  {copy.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
