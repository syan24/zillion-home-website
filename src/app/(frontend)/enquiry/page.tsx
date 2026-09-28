import type { Metadata } from 'next'
import React from 'react'
import { EnquiryForm } from './EnquiryForm'
import { PlaceholderImage } from '@/components/PlaceholderImage'

export const metadata: Metadata = {
  title: 'Start an Enquiry | Zillion Home',
  description:
    'Tell us about your project. Our team will be in touch to discuss your needs, provide guidance and next steps.',
}

export default function EnquiryPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - contained */}
      <section className="bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Left: Image with Content Overlay */}
            <div className="relative min-h-[400px] lg:min-h-[600px] rounded-lg overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <PlaceholderImage
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
                  alt="Modern kitchen interior"
                  className="h-full rounded-lg"
                  aspectRatio="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-transparent rounded-lg" />
              </div>

              {/* Content Overlay */}
              <div className="relative h-full p-6 lg:p-10 flex flex-col justify-end text-white">
                <p className="text-sm tracking-widest uppercase text-white/70 mb-4">
                  Let&apos;s Create Together
                </p>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
                  Start an
                  <br />
                  Enquiry
                </h1>
                <p className="text-white/80 max-w-md">
                  Tell us about your project and our team will be in touch to discuss your needs,
                  provide guidance and next steps.
                </p>

                {/* Decorative Text */}
                <div className="hidden lg:block mt-8 pt-8 border-t border-white/20">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Tailored Joinery
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    For Better Living
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Form Section */}
            <div className="bg-background rounded-lg p-6 lg:p-10">
              <div className="mb-8">
                <p className="text-sm tracking-widest uppercase text-muted-foreground mb-2">
                  Contact Us
                </p>
                <h2 className="font-serif text-2xl md:text-3xl mb-2">Tell us about your project</h2>
                <p className="text-sm text-muted-foreground">告诉我们您的项目需求</p>
                <p className="mt-4 text-foreground-soft">
                  Please fill out the form below and we&apos;ll get back to you as soon as possible.
                  We&apos;ll provide expert advice and help guide your next steps.
                </p>
              </div>

              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
