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
      <div className="lg:grid lg:grid-cols-2 lg:min-h-[calc(100vh-5rem)]">
        {/* Left: Hero Section */}
        <div className="relative bg-background-warm">
          {/* Background Image */}
          <div className="absolute inset-0">
            <PlaceholderImage
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
              alt="Modern kitchen interior"
              className="h-full"
              aspectRatio="auto"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background-warm/95 via-background-warm/80 to-transparent lg:bg-gradient-to-t lg:from-background-warm/90 lg:via-background-warm/60 lg:to-transparent" />
          </div>

          {/* Content */}
          <div className="relative px-6 py-16 lg:px-12 lg:py-24 lg:h-full lg:flex lg:flex-col lg:justify-end">
            <div className="max-w-md">
              <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
                Let&apos;s Create Together
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                Start an
                <br />
                Enquiry
              </h1>
              <p className="text-foreground-soft">
                Tell us about your project and our team will be in touch to discuss your needs,
                provide guidance and next steps.
              </p>
            </div>

            {/* Decorative Text */}
            <div className="hidden lg:block absolute bottom-12 left-12">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Tailored Joinery
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                For Better Living
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="bg-background">
          <div className="px-6 py-12 lg:px-12 lg:py-16 lg:max-w-2xl">
            <div className="mb-10">
              <p className="text-sm tracking-widest uppercase text-muted-foreground mb-2">
                Contact Us
              </p>
              <h2 className="font-serif text-2xl md:text-3xl mb-2">
                Tell us about your project
              </h2>
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
    </main>
  )
}
