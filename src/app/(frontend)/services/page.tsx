import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlaceholderImage } from '@/components/PlaceholderImage'

export const metadata: Metadata = {
  title: 'Our Services | Zillion Home',
  description:
    'Residential construction, commercial fit-out, custom joinery and interior project delivery. Melbourne builder for homes and businesses.',
}

const services = [
  {
    id: 'residential',
    title: 'Residential Construction & Renovation',
    titleZh: '住宅施工与翻新',
    description:
      'From new builds to complete renovations, we deliver residential projects with attention to detail and quality craftsmanship.',
    features: [
      'New home construction',
      'Home extensions and additions',
      'Full house renovations',
      'Structural alterations',
      'Bathroom and kitchen renovations',
      'Outdoor living spaces',
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
  },
  {
    id: 'commercial',
    title: 'Commercial Fit-out',
    titleZh: '商业空间装修',
    description:
      'Professional commercial spaces designed for your business needs. From offices to retail, we create functional and impressive environments.',
    features: [
      'Office fit-outs',
      'Retail store construction',
      'Hospitality venues',
      'Medical and healthcare facilities',
      'Warehouse and industrial spaces',
      'Tenant improvements',
    ],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80',
  },
  {
    id: 'joinery',
    title: 'Custom Joinery & Cabinetry',
    titleZh: '定制橱柜与木作',
    description:
      'Bespoke joinery crafted in our workshop. Whether standalone or as part of a larger project, we deliver precision-made cabinetry tailored to your space.',
    features: [
      'Custom kitchens',
      'Built-in wardrobes',
      'Bathroom vanities',
      'Entertainment units',
      'Home office fit-outs',
      'Bespoke furniture pieces',
    ],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&q=80',
  },
  {
    id: 'interior',
    title: 'Interior Fit-out & Project Delivery',
    titleZh: '室内装修与项目交付',
    description:
      'Complete interior delivery from design coordination to final handover. We manage the entire process so you can focus on your vision.',
    features: [
      'Design coordination',
      'Project management',
      'Trade coordination',
      'Quality assurance',
      'Timeline management',
      'Handover and documentation',
    ],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=80',
  },
]

const processSteps = [
  { number: '01', title: 'Consultation', description: 'We meet to understand your project needs' },
  { number: '02', title: 'Planning', description: 'Detailed planning and design coordination' },
  { number: '03', title: 'Construction', description: 'Quality construction with regular updates' },
  { number: '04', title: 'Joinery', description: 'Custom joinery and finishing touches' },
  { number: '05', title: 'Handover', description: 'Final walkthrough and project completion' },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-background-warm py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Our Services
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              Building residential,
              <br />
              commercial &amp;
              <br />
              <span className="italic text-accent">custom joinery</span>
            </h1>
            <p className="text-lg text-foreground-soft max-w-xl">
              Four core capabilities under one roof. From ground-up construction to precision
              cabinetry, we deliver complete building solutions for homes and businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-16 lg:py-24 ${index % 2 === 0 ? 'bg-background' : 'bg-background-warm'}`}
        >
          <div className="container">
            <div
              className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
            >
              {/* Content */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">{service.titleZh}</p>
                <h2 className="font-serif text-3xl md:text-4xl mb-4">{service.title}</h2>
                <p className="text-foreground-soft mb-8">{service.description}</p>

                <div className="mb-8">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
                    What we deliver
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-accent flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild>
                  <Link href="/enquiry">Enquire about {service.title.split(' ')[0]}</Link>
                </Button>
              </div>

              {/* Image */}
              <PlaceholderImage
                src={service.image}
                alt={service.title}
                aspectRatio="4/3"
                className="rounded"
              />
            </div>
          </div>
        </section>
      ))}

      {/* Process Overview */}
      <section className="bg-background-warm py-16 lg:py-24 border-t border-border">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              How We Work
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">Our process</h2>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {processSteps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background text-accent font-medium text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="font-medium mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Joinery Highlight */}
      <section className="bg-dark text-dark-foreground py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-accent mb-4">
                In-house Capability
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
                Custom joinery,
                <br />
                <span className="italic">crafted in-house</span>
              </h2>
              <p className="text-dark-foreground/80 mb-6">
                Our joinery workshop allows us to deliver bespoke cabinetry with the same quality
                control as our construction work. Whether it&apos;s a standalone kitchen project or
                joinery as part of a complete renovation, everything is built to your specifications.
              </p>
              <p className="text-dark-foreground/80 mb-8">
                This means better coordination, consistent quality, and a single point of
                accountability for your entire project.
              </p>
              <Button asChild variant="enquiry">
                <Link href="/enquiry">Enquire about Custom Joinery →</Link>
              </Button>
            </div>

            <PlaceholderImage
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80"
              alt="Joinery workshop"
              aspectRatio="4/3"
              className="rounded"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Ready to discuss your project?</h2>
            <p className="text-foreground-soft mb-8">
              Tell us about your requirements and we&apos;ll help you understand how we can bring
              your vision to life.
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
