import type { Metadata } from 'next'
import React, { Fragment } from 'react'

import { PlaceholderImage } from '@/components/PlaceholderImage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

import { EnquiryForm } from './EnquiryForm'

export const maxDuration = 60

export async function generateMetadata(): Promise<Metadata> {
  const copy = getMessages(await getLocale()).enquiry
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
  }
}

function lines(text: string) {
  return text.split('\n').map((line, index) => (
    <Fragment key={`${line}-${index}`}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ))
}

export default async function EnquiryPage() {
  const copy = getMessages(await getLocale()).enquiry

  return (
    <main className="min-h-screen">
      <section className="bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="relative min-h-[400px] lg:min-h-[600px] rounded-lg overflow-hidden">
              <div className="absolute inset-0">
                <PlaceholderImage
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
                  alt={copy.imageAlt}
                  className="h-full rounded-lg"
                  aspectRatio="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-transparent rounded-lg" />
              </div>

              <div className="relative h-full p-6 lg:p-10 flex flex-col justify-end text-white">
                <p className="text-sm tracking-widest uppercase text-white/70 mb-4">{copy.overlayEyebrow}</p>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
                  {lines(copy.overlayTitle)}
                </h1>
                <p className="text-white/80 max-w-md">{copy.overlayBody}</p>
                <div className="hidden lg:block mt-8 pt-8 border-t border-white/20">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">{copy.overlayLine1}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">{copy.overlayLine2}</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 lg:p-10">
              <div className="mb-8">
                <p className="text-sm tracking-widest uppercase text-muted-foreground mb-2">{copy.formEyebrow}</p>
                <h2 className="font-serif text-2xl md:text-3xl mb-2">{copy.formHeading}</h2>
                <p className="mt-4 text-foreground-soft">{copy.formIntro}</p>
              </div>
              <EnquiryForm copy={copy} directUpload={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
