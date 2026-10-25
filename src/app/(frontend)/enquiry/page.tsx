import type { Metadata } from 'next'
import configPromise from '@payload-config'
import React from 'react'
import { getPayload } from 'payload'

import { goldPhrase } from '@/components/Marketing/sections'
import { PlaceholderImage } from '@/components/PlaceholderImage'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'
import { loadEnquiryForm } from '@/lib/enquiry/loadForm'

import { EnquiryForm } from './EnquiryForm'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const copy = getMessages(await getLocale()).enquiry
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
  }
}

export default async function EnquiryPage() {
  const locale = await getLocale()
  const copy = getMessages(locale).enquiry
  const payload = await getPayload({ config: configPromise })
  const form = await loadEnquiryForm(payload, locale)

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative bg-[#1c1a17] text-[#f5f2ec]">
        <div className="relative h-[72vh] min-h-[560px] overflow-hidden lg:sticky lg:top-0 lg:h-screen">
          <PlaceholderImage
            src="/api/media/file/kew-kitchen.jpg"
            alt={copy.imageAlt}
            className="absolute inset-0 h-full w-full"
            aspectRatio="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(20,18,15,0.35)] via-[rgba(20,18,15,0.2)] to-[rgba(20,18,15,0.85)]" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end gap-7 px-[clamp(24px,4vw,64px)] pb-14 pt-32">
            <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.4em]">
              <span className="h-px w-12 bg-accent" aria-hidden />
              {copy.overlayEyebrow}
            </p>
            <h1 className="w-full max-w-[9ch] font-serif text-[clamp(52px,6.4vw,104px)] font-light leading-[0.95] tracking-[-0.01em]">
              {goldPhrase(
                copy.overlayTitle.replace(/^Start an Enquiry\.?$/i, 'Start an enquiry.'),
                copy.overlayAccent,
              )}
            </h1>
            <p className="max-w-md text-base leading-7 text-[#f5f2ec]/90">{copy.overlayBody}</p>
            <div className="flex flex-wrap gap-10 border-t border-[#f5f2ec]/30 pt-6 text-[11px] uppercase tracking-[0.26em]">
              <span>{copy.overlayLine1}</span>
              <span>{copy.overlayLine2}</span>
            </div>
          </div>
        </div>
      </aside>

      <section className="flex w-full max-w-[820px] flex-col gap-12 px-[clamp(24px,5vw,88px)] pb-[clamp(64px,8vw,120px)] pt-32 lg:pt-40">
        <div className="flex flex-col gap-5">
          <p className="text-[11px] uppercase tracking-[0.4em] text-accent-tan">— {copy.formEyebrow}</p>
          <h2 className="font-serif text-[clamp(36px,3.8vw,56px)] font-light leading-tight">{copy.formHeading}</h2>
          <p className="max-w-xl text-[15px] leading-8 text-[#5c564d]">{copy.formIntro}</p>
        </div>
        <EnquiryForm copy={copy} form={form} directUpload={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
      </section>
    </main>
  )
}
