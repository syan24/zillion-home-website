import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlaceholderImage } from '@/components/PlaceholderImage'

const services = [
  {
    title: 'Residential Construction & Renovation',
    titleZh: '住宅施工与翻新',
    description: 'New builds, extensions, renovations and alterations for residential properties.',
    href: '/services#residential',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  },
  {
    title: 'Commercial Fit-out',
    titleZh: '商业空间装修',
    description: 'Office, retail, hospitality and commercial space fit-outs.',
    href: '/services#commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  },
  {
    title: 'Custom Joinery & Cabinetry',
    titleZh: '定制橱柜与木作',
    description: 'Kitchens, wardrobes, vanities, entertainment units and bespoke furniture.',
    href: '/services#joinery',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  },
  {
    title: 'Interior Fit-out & Project Delivery',
    titleZh: '室内装修与项目交付',
    description: 'Complete interior delivery from design coordination to final handover.',
    href: '/services#interior',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
  },
]

const processSteps = [
  {
    number: '01',
    title: 'Consultation',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Planning & Coordination',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Construction / Fit-out',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Joinery & Finishes',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Handover',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
]

const serviceCategories = [
  { title: 'Residential Construction', icon: '🏠' },
  { title: 'Renovation', icon: '🔨' },
  { title: 'Commercial Fit-out', icon: '🏢' },
  { title: 'Custom Joinery', icon: '🪑' },
  { title: 'Interior Fit-out & Delivery', icon: '✨' },
]

const trustSignals = [
  {
    title: 'Qualified & Insured',
    description: 'Registered builder with appropriate insurances',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  },
  {
    title: 'In-house Joinery Capability',
    description: 'Custom kitchens, wardrobes, vanities and more',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    title: 'Quality & Care',
    description: 'Practical solutions, professional delivery',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80',
  },
]

const servicesOverview = [
  { title: 'Residential', subtitle: 'Construction & Renovation' },
  { title: 'Commercial', subtitle: 'Fit-out' },
  { title: 'Custom Joinery', subtitle: 'Kitchens, Wardrobes & Cabinetry' },
  { title: 'Interior Fit-out', subtitle: 'Complete Project Delivery' },
]

export function FallbackHome() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-background-warm">
        <div className="container py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
                Residential / Commercial / Joinery
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

            {/* Right: Hero Image */}
            <div className="relative order-1 lg:order-2">
              <PlaceholderImage
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
                alt="Modern residential architecture"
                aspectRatio="4/3"
                className="lg:aspect-auto lg:min-h-[500px] rounded"
              />
              <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur px-4 py-2 rounded text-xs">
                <p className="font-medium uppercase tracking-wider text-accent">Quality</p>
                <p className="font-medium uppercase tracking-wider">Construction</p>
                <p className="text-muted-foreground uppercase tracking-wider">Lasting Value</p>
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
                className="group block bg-background-warm rounded overflow-hidden hover:shadow-lg transition-shadow"
              >
                <PlaceholderImage
                  src={service.image}
                  alt={service.title}
                  aspectRatio="4/3"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-5">
                  <h3 className="font-medium mb-1 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">{service.titleZh}</p>
                  <p className="text-sm text-foreground-soft">{service.description}</p>
                  <span className="inline-flex items-center text-sm mt-3 text-accent group-hover:translate-x-1 transition-transform">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Different Briefs, Same Care Section */}
      <section className="bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Image */}
            <div className="relative">
              <PlaceholderImage
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
                alt="Modern interior with custom joinery"
                aspectRatio="3/4"
                className="rounded"
              />
            </div>

            {/* Content */}
            <div className="lg:sticky lg:top-32">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Residential / Commercial / Joinery
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-2">Different briefs.</h2>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl italic text-accent mb-6">
                Same care.
              </h2>
              <p className="text-foreground-soft mb-8 max-w-lg">
                Zillion Home is a Melbourne-based builder delivering residential construction,
                renovations, commercial fit-outs and custom joinery. We bring construction,
                interiors and joinery together under one team, with a clear process and a close eye
                on every project.
              </p>

              <div className="space-y-4">
                {servicesOverview.map((item, index) => (
                  <div key={item.title} className="flex items-center gap-4">
                    <PlaceholderImage
                      src={`https://images.unsplash.com/photo-${
                        index === 0
                          ? '1600585154340-be6161a56a0c'
                          : index === 1
                            ? '1497366216548-37526070297c'
                            : index === 2
                              ? '1556909114-f6e7ad7d3136'
                              : '1618221195710-dd6b41faaea6'
                      }?w=200&q=80`}
                      alt={item.title}
                      aspectRatio="4/3"
                      className="w-20 h-14 rounded flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                The Way We Work
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
                Clarity at every stage.
              </h2>
              <p className="text-foreground-soft max-w-lg">
                From initial consultation to final handover, we coordinate construction, interior
                fit-out and custom joinery to deliver well-managed projects with practical solutions
                and quality workmanship.
              </p>
            </div>

            {/* Trust Signals with Images */}
            <div className="space-y-4">
              {trustSignals.map((item) => (
                <div key={item.title} className="flex items-center gap-4">
                  <PlaceholderImage
                    src={item.image}
                    alt={item.title}
                    aspectRatio="4/3"
                    className="w-24 h-16 rounded flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-border" />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
              {processSteps.map((step) => (
                <div key={step.number} className="relative text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background-section text-foreground-soft mb-4 relative z-10">
                    {step.icon}
                  </div>
                  <div className="text-sm font-medium text-accent mb-1">{step.number}</div>
                  <h3 className="font-medium text-sm">{step.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Bar */}
      <section className="border-t border-b border-border py-8">
        <div className="container">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                More than spaces
              </p>
              <p className="text-sm font-medium uppercase tracking-wide">
                We build better living,
                <br />
                working and business spaces.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {serviceCategories.map((category) => (
                <div key={category.title} className="text-center">
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    {category.title}
                  </p>
                </div>
              ))}
            </div>
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
              Tell us about your vision and we&apos;ll help bring it to life with quality
              construction, precision joinery and professional project delivery.
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
