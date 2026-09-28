'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BuilderHeroProps {
  headline?: string
  subheadline?: string
  description?: string
}

const services = [
  {
    title: 'Residential Construction & Renovation',
    titleZh: '住宅施工与翻新',
    href: '/services#residential',
  },
  {
    title: 'Commercial Fit-out',
    titleZh: '商业空间装修',
    href: '/services#commercial',
  },
  {
    title: 'Custom Joinery & Cabinetry',
    titleZh: '定制橱柜与木作',
    href: '/services#joinery',
  },
  {
    title: 'Interior Fit-out & Project Delivery',
    titleZh: '室内装修与项目交付',
    href: '/services#interior',
  },
]

export const BuilderHero: React.FC<BuilderHeroProps> = ({
  headline = 'Built from the ground up.',
  subheadline = 'Residential · Commercial · Joinery',
  description = 'Residential construction, renovation, commercial fit-out and custom joinery — built with quality, precision and care.',
}) => {
  return (
    <section className="relative">
      {/* Hero Content */}
      <div className="bg-background-warm">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 py-16 lg:py-24">
            {/* Left: Text Content */}
            <div className="flex flex-col justify-center">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
                {subheadline}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6">
                {headline}
              </h1>
              <p className="text-lg text-foreground-soft max-w-md mb-8">{description}</p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/enquiry">Start an Enquiry</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/projects">View Projects</Link>
                </Button>
              </div>
            </div>

            {/* Right: Image Placeholder */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px]">
              <div className="absolute inset-0 bg-background-section rounded-sm overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm mb-2">Hero Image</p>
                    <p className="text-xs">Configure via CMS</p>
                  </div>
                </div>
                {/* Quality badge placeholder */}
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur px-4 py-2 rounded text-xs">
                  <p className="font-medium">Quality Construction</p>
                  <p className="text-muted-foreground">Lasting Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-background py-16 lg:py-20">
        <div className="container">
          <div className="mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              更清晰的四大核心服务
            </p>
            <p className="text-sm text-foreground-soft">
              Our four core services, displayed prominently to help visitors quickly understand what
              we do.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group relative aspect-[4/3] bg-background-section rounded overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium text-sm mb-1 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white/70 text-xs">{service.titleZh}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tagline Section */}
      <div className="bg-background-warm py-12 lg:py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                More Than Spaces
              </p>
              <h2 className="font-serif text-2xl md:text-3xl">
                We build better living,
                <br />
                working and business spaces.
              </h2>
            </div>
            <div className="flex flex-wrap gap-8 lg:gap-12 text-center">
              {[
                { label: 'Residential Construction', icon: '🏠' },
                { label: 'Renovation', icon: '🔨' },
                { label: 'Commercial Fit-out', icon: '🏢' },
                { label: 'Custom Joinery', icon: '🪑' },
                { label: 'Interior Fit-out & Delivery', icon: '✨' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs text-muted-foreground max-w-[80px]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
