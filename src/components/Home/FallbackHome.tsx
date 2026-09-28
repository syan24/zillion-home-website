import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const services = [
  {
    title: 'Residential Construction & Renovation',
    titleZh: '住宅施工与翻新',
    description: 'New builds, extensions, renovations and alterations for residential properties.',
    href: '/services#residential',
  },
  {
    title: 'Commercial Fit-out',
    titleZh: '商业空间装修',
    description: 'Office, retail, hospitality and commercial space fit-outs.',
    href: '/services#commercial',
  },
  {
    title: 'Custom Joinery & Cabinetry',
    titleZh: '定制橱柜与木作',
    description: 'Kitchens, wardrobes, vanities, entertainment units and bespoke furniture.',
    href: '/services#joinery',
  },
  {
    title: 'Interior Fit-out & Project Delivery',
    titleZh: '室内装修与项目交付',
    description: 'Complete interior delivery from design coordination to final handover.',
    href: '/services#interior',
  },
]

const processSteps = [
  { number: '01', title: 'Consultation', description: 'Initial meeting to understand your vision' },
  {
    number: '02',
    title: 'Planning & Coordination',
    description: 'Detailed planning and design coordination',
  },
  {
    number: '03',
    title: 'Construction / Fit-out',
    description: 'Quality construction with regular updates',
  },
  { number: '04', title: 'Joinery & Finishes', description: 'Custom joinery and finishing touches' },
  { number: '05', title: 'Handover', description: 'Final walkthrough and project completion' },
]

export function FallbackHome() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-background-warm">
        <div className="container py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
                Residential · Commercial · Joinery
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6">
                Built from the
                <br />
                ground up.
              </h1>
              <p className="text-lg text-foreground-soft max-w-md mb-8">
                Residential construction, renovation, commercial fit-out and custom joinery — built
                with quality, precision and care.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/enquiry">Start an Enquiry</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/projects">View Projects</Link>
                </Button>
              </div>
            </div>

            {/* Right: Hero Image Placeholder */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px]">
              <div className="absolute inset-0 bg-background-section rounded overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm mb-2">Hero Image</p>
                    <p className="text-xs">Add via CMS Media</p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur px-4 py-2 rounded text-xs">
                  <p className="font-medium">Quality Construction</p>
                  <p className="text-muted-foreground">Lasting Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Our Services
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">Four core capabilities</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group block p-6 bg-background-warm rounded hover:bg-background-section transition-colors"
              >
                <h3 className="font-medium mb-2 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">{service.titleZh}</p>
                <p className="text-sm text-foreground-soft">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] bg-background-section rounded overflow-hidden order-2 lg:order-1">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <span className="text-sm">Project Image</span>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Residential / Commercial / Joinery
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
                Different briefs.
                <br />
                <span className="italic">Same care.</span>
              </h2>
              <p className="text-foreground-soft mb-8">
                Zillion Home is a Melbourne-based builder delivering residential construction,
                renovations, commercial fit-outs and custom joinery. We bring construction,
                interiors and joinery together under one team, with a clear process and a close eye
                to every project.
              </p>

              <div className="space-y-4">
                {['Residential', 'Commercial', 'Custom Joinery', 'Interior Fit-out'].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-background-section rounded flex-shrink-0" />
                      <div>
                        <p className="font-medium">{item}</p>
                        <p className="text-xs text-muted-foreground">
                          {item === 'Residential' && 'Construction & Renovation'}
                          {item === 'Commercial' && 'Fit-out'}
                          {item === 'Custom Joinery' && 'Kitchens, Wardrobes & Cabinetry'}
                          {item === 'Interior Fit-out' && 'Complete Project Delivery'}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              The Way We Work
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Clarity at every stage.</h2>
            <p className="text-foreground-soft max-w-2xl">
              From initial consultation to final handover, we coordinate construction, interior
              fit-out and custom joinery to deliver well-managed projects with practical solutions
              and quality workmanship.
            </p>
          </div>

          <div className="grid sm:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="text-4xl font-serif text-accent/30 mb-2">{step.number}</div>
                <h3 className="font-medium mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-full w-full h-px bg-border -translate-x-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                title: 'Qualified & Insured',
                description: 'Registered builder with appropriate insurances',
              },
              {
                title: 'In-house Joinery Capability',
                description: 'Custom kitchens, wardrobes, vanities and more',
              },
              {
                title: 'Quality & Care',
                description: 'Practical solutions, professional delivery',
              },
            ].map((item) => (
              <div key={item.title} className="text-center lg:text-left">
                <div className="w-16 h-16 mx-auto lg:mx-0 bg-background-section rounded mb-4 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark text-dark-foreground py-16 lg:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              Ready to start your project?
            </h2>
            <p className="text-dark-foreground/70 mb-8">
              Tell us about your vision and we&apos;ll help bring it to life.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent-hover text-foreground">
              <Link href="/enquiry">Start an Enquiry</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
