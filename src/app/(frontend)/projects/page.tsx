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

const projectTypes = [
  {
    title: 'Residential Projects',
    titleZh: '住宅项目',
    description: 'Home renovations, extensions and new builds across Melbourne',
    href: '/projects/residential',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
  },
  {
    title: 'Commercial Projects',
    titleZh: '商业项目',
    description: 'Office fit-outs, retail and hospitality spaces',
    href: '/projects/commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80',
  },
]

const roomTypes = [
  {
    title: 'Kitchen',
    titleZh: '厨房',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    href: '/projects/room/kitchen',
  },
  {
    title: 'Bathroom',
    titleZh: '卫生间',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
    href: '/projects/room/bathroom',
  },
  {
    title: 'Living',
    titleZh: '客厅',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
    href: '/projects/room/living',
  },
  {
    title: 'Bedroom',
    titleZh: '卧室',
    image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80',
    href: '/projects/room/bedroom',
  },
  {
    title: 'Wardrobe & Joinery',
    titleZh: '衣柜与定制柜',
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&q=80',
    href: '/projects/room/wardrobe',
  },
  {
    title: 'Laundry',
    titleZh: '洗衣房',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80',
    href: '/projects/room/laundry',
  },
  {
    title: 'Home Office',
    titleZh: '家庭办公',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80',
    href: '/projects/room/home-office',
  },
  {
    title: 'Outdoor',
    titleZh: '户外空间',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80',
    href: '/projects/room/outdoor',
  },
]

const styleFilters = ['All Styles', 'Modern', 'Minimalist', 'Contemporary', 'Classic']

export default function ProjectsPage() {
  return (
    <main className="min-h-screen scroll-smooth">
      {/* Hero Section */}
      <section className="relative bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Projects
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
                真实项目，
                <br />
                启发更好的生活方式。
              </h1>
              <p className="text-lg text-foreground-soft max-w-lg">
                Explore our portfolio of residential and commercial projects, or browse by room to
                find inspiration for your space.
              </p>
            </div>
            <div className="relative">
              <PlaceholderImage
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80"
                alt="Project showcase"
                aspectRatio="4/3"
                className="rounded"
              />
            </div>
          </div>

          {/* Anchor Tab Navigation */}
          <nav className="flex justify-center gap-4 mt-12 pt-8 border-t border-border">
            <a
              href="#by-project"
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-background border border-border hover:border-accent hover:bg-background-section transition-all group"
            >
              <span className="w-10 h-10 rounded-full bg-background-section group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              <div className="text-left">
                <p className="font-medium text-sm">By Project</p>
                <p className="text-xs text-muted-foreground">按项目类型浏览</p>
              </div>
            </a>
            <a
              href="#by-room"
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-background border border-border hover:border-accent hover:bg-background-section transition-all group"
            >
              <span className="w-10 h-10 rounded-full bg-background-section group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </span>
              <div className="text-left">
                <p className="font-medium text-sm">By Room</p>
                <p className="text-xs text-muted-foreground">按空间浏览</p>
              </div>
            </a>
          </nav>
        </div>
      </section>

      {/* By Project Section */}
      <section id="by-project" className="bg-background py-16 lg:py-24 scroll-mt-24">
        <div className="container">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              By Project
            </p>
            <p className="text-sm text-muted-foreground">按项目类型浏览，查看完整案例</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projectTypes.map((project) => (
              <Link
                key={project.title}
                href={project.href}
                className="group block relative overflow-hidden rounded"
              >
                <PlaceholderImage
                  src={project.image}
                  alt={project.title}
                  aspectRatio="16/9"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif text-2xl md:text-3xl mb-1">{project.title}</h3>
                  <p className="text-sm text-white/80 mb-2">{project.titleZh}</p>
                  <p className="text-sm text-white/70">{project.description}</p>
                  <span className="inline-flex items-center justify-center w-10 h-10 mt-4 rounded-full border border-white/30 text-white group-hover:bg-accent group-hover:border-accent transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* By Room Section */}
      <section id="by-room" className="bg-background-warm py-16 lg:py-24 scroll-mt-24">
        <div className="container">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              By Room
            </p>
            <p className="text-sm text-muted-foreground">按空间浏览，从不同生活场景中寻找灵感</p>
          </div>

          {/* Style Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Style filters">
            {styleFilters.map((style, index) => (
              <button
                key={style}
                type="button"
                role="tab"
                aria-selected={index === 0}
                className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
                  index === 0
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-foreground/30 hover:bg-background-section'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {roomTypes.map((room) => (
              <Link
                key={room.title}
                href={room.href}
                className="group block relative overflow-hidden rounded aspect-square"
              >
                <PlaceholderImage
                  src={room.image}
                  alt={room.title}
                  aspectRatio="square"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-medium text-white">{room.title}</h3>
                  <p className="text-xs text-white/70">{room.titleZh}</p>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
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
            <Button asChild variant="enquiry" size="lg">
              <Link href="/enquiry">Start an Enquiry →</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
