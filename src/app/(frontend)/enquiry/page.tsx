import type { Metadata } from 'next'
import React from 'react'
import { EnquiryForm } from './EnquiryForm'

export const metadata: Metadata = {
  title: 'Start an Enquiry | Zillion Home',
  description:
    'Tell us about your project. Our team will be in touch to discuss your needs, provide guidance and next steps.',
}

export default function EnquiryPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background-warm">
        <div className="container py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Hero Content */}
            <div>
              <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
                Let&apos;s Create Together
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                Start an
                <br />
                Enquiry
              </h1>
              <p className="text-lg text-foreground-soft max-w-md">
                Tell us about your project and our team will be in touch to discuss your needs,
                provide guidance and next steps.
              </p>
            </div>

            {/* Right: Image Placeholder */}
            <div className="relative aspect-[4/3] bg-background-section rounded overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <span className="text-sm">Project Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12">
              <p className="text-sm tracking-widest uppercase text-muted-foreground mb-2">
                Contact Us
              </p>
              <h2 className="font-serif text-2xl md:text-3xl">
                Tell us about your project
              </h2>
              <p className="mt-4 text-foreground-soft">
                Please fill out the form below and we&apos;ll get back to you as soon as possible.
                All fields marked with * are required.
              </p>
            </div>

            <EnquiryForm />
          </div>
        </div>
      </section>
    </main>
  )
}
