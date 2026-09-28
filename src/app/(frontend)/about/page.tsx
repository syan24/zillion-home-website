import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlaceholderImage } from '@/components/PlaceholderImage'

export const metadata: Metadata = {
  title: 'About Us | Zillion Home',
  description:
    'Melbourne-based builder delivering residential construction, renovations, commercial fit-outs and custom joinery with quality, precision and care.',
}

const capabilities = [
  {
    title: 'Residential Construction & Renovation',
    description: 'New builds, extensions, renovations and alterations for homes across Melbourne.',
  },
  {
    title: 'Commercial Fit-out',
    description: 'Office, retail, hospitality and commercial spaces tailored to your business.',
  },
  {
    title: 'Custom Joinery & Cabinetry',
    description: 'Kitchens, wardrobes, vanities, and bespoke furniture crafted in-house.',
  },
  {
    title: 'Interior Fit-out & Project Delivery',
    description: 'Complete interior delivery from design coordination to final handover.',
  },
]

const values = [
  {
    title: 'Quality Workmanship',
    description: 'Every project is built to last with attention to detail and precision.',
  },
  {
    title: 'Clear Communication',
    description: 'Regular updates and transparent processes throughout your project.',
  },
  {
    title: 'Practical Solutions',
    description: 'We solve problems efficiently without compromising on quality.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                About Zillion Home
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                Building with
                <br />
                <span className="italic text-accent">care and precision</span>
              </h1>
              <p className="text-lg text-foreground-soft max-w-lg">
                Zillion Home is a Melbourne-based builder bringing construction, interiors and
                joinery together under one team. We deliver residential and commercial projects with
                a clear process and close attention to every detail.
              </p>
            </div>

            <PlaceholderImage
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1000&q=80"
              alt="Construction team at work"
              aspectRatio="4/3"
              className="rounded"
            />
          </div>
        </div>
      </section>

      {/* Builder Positioning */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Who We Are
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6">A builder, not a design studio</h2>
            <div className="prose prose-lg text-foreground-soft">
              <p>
                We are first and foremost builders. From the ground up, we manage construction,
                coordinate trades, and deliver projects on time and on budget. Our in-house joinery
                capability means we can handle everything from structural work to the finest
                cabinetry details — all under one roof.
              </p>
              <p>
                Whether you&apos;re planning a home renovation, a commercial fit-out, or custom
                joinery for your space, we bring the same level of care and professionalism to every
                project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              What We Do
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">Our capabilities</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {capabilities.map((capability, index) => (
              <div key={capability.title} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-background flex items-center justify-center text-sm font-medium text-accent">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="font-medium mb-2">{capability.title}</h3>
                  <p className="text-sm text-foreground-soft">{capability.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Qualifications */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Trust & Qualifications
              </p>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">
                Qualified, insured,
                <br />
                <span className="italic">ready to build</span>
              </h2>
              <div className="space-y-4 text-foreground-soft">
                <p>
                  Zillion Home is a registered builder operating across Melbourne and surrounding
                  areas. We maintain appropriate insurances and comply with all relevant building
                  codes and regulations.
                </p>
                <p>
                  Our in-house joinery workshop allows us to deliver custom cabinetry with the same
                  quality control as our construction work — no outsourcing, no surprises.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {values.map((value) => (
                  <div key={value.title} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{value.title}</p>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <PlaceholderImage
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80"
              alt="Builder with plans on site"
              aspectRatio="3/4"
              className="rounded"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark text-dark-foreground py-16 lg:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              Let&apos;s build something together
            </h2>
            <p className="text-dark-foreground/70 mb-8">
              Ready to start your project? Get in touch and tell us about your vision. We&apos;ll
              provide guidance and help you take the next steps.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent-hover text-foreground">
                <Link href="/enquiry">Start an Enquiry</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-dark-foreground/30 text-dark-foreground hover:bg-dark-foreground/10"
              >
                <Link href="/services">View Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
