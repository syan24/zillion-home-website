import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Contact Us | Zillion Home',
  description:
    'Get in touch with Zillion Home. Start an enquiry to discuss your residential, commercial or joinery project.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Contact Us
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              Get in touch
            </h1>
            <p className="text-lg text-foreground-soft max-w-xl mx-auto">
              Ready to discuss your project? We&apos;re here to help. Start an enquiry and our team
              will get back to you soon.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Enquiry Card */}
              <div className="bg-background-warm p-8 rounded">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl mb-4">Start a Project Enquiry</h2>
                <p className="text-foreground-soft mb-6">
                  Tell us about your project requirements and we&apos;ll provide expert guidance on
                  the best approach for your needs.
                </p>
                <Button asChild className="w-full">
                  <Link href="/enquiry">Start an Enquiry →</Link>
                </Button>
              </div>

              {/* Location Card */}
              <div className="bg-background-warm p-8 rounded">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl mb-4">Our Location</h2>
                <p className="text-foreground-soft mb-4">
                  Based in Melbourne, we service residential and commercial projects across the
                  greater Melbourne area.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Melbourne, Victoria</p>
                  <p className="text-muted-foreground">Australia</p>
                </div>
              </div>
            </div>

            {/* Services Quick Links */}
            <div className="mt-12 pt-12 border-t border-border">
              <h3 className="font-serif text-xl mb-6 text-center">Our Services</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Residential Construction', href: '/services#residential' },
                  { title: 'Commercial Fit-out', href: '/services#commercial' },
                  { title: 'Custom Joinery', href: '/services#joinery' },
                  { title: 'Interior Fit-out', href: '/services#interior' },
                ].map((service) => (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="p-4 bg-background-section rounded text-center hover:bg-background-warm transition-colors"
                  >
                    <span className="text-sm">{service.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
