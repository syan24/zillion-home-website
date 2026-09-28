import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlaceholderImage } from '@/components/PlaceholderImage'

export const metadata: Metadata = {
  title: 'Projects | Zillion Home',
  description:
    'Browse our portfolio of residential construction, commercial fit-outs, and custom joinery projects across Melbourne.',
}

const featuredCategories = [
  {
    title: 'Residential Projects',
    titleZh: '住宅项目',
    description: 'Home renovations, extensions and new builds',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  },
  {
    title: 'Commercial Projects',
    titleZh: '商业项目',
    description: 'Office fit-outs, retail and hospitality spaces',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
  {
    title: 'Custom Joinery',
    titleZh: '定制橱柜',
    description: 'Kitchens, wardrobes and bespoke cabinetry',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  },
]

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Our Work
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              Projects
            </h1>
            <p className="text-lg text-foreground-soft max-w-xl">
              Explore our portfolio of completed residential, commercial and joinery projects across
              Melbourne.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-background-section flex items-center justify-center">
              <svg
                className="w-10 h-10 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl mb-4">Project Gallery Coming Soon</h2>
            <p className="text-foreground-soft mb-6">
              We&apos;re currently preparing our full project portfolio. In the meantime, browse our
              service categories below or get in touch to discuss your project.
            </p>
            <Button asChild>
              <Link href="/enquiry">Start an Enquiry</Link>
            </Button>
          </div>

          {/* Category Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <div
                key={category.title}
                className="group bg-background-warm rounded overflow-hidden"
              >
                <PlaceholderImage
                  src={category.image}
                  alt={category.title}
                  aspectRatio="4/3"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-6">
                  <h3 className="font-medium mb-1">{category.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{category.titleZh}</p>
                  <p className="text-sm text-foreground-soft">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark text-dark-foreground py-16 lg:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              Have a project in mind?
            </h2>
            <p className="text-dark-foreground/70 mb-8">
              We&apos;d love to hear about your project. Get in touch and let&apos;s discuss how we
              can help bring your vision to life.
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
