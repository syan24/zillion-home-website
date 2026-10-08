import React, { Fragment } from 'react'
import Link from 'next/link'

import { PlaceholderImage } from '@/components/PlaceholderImage'
import { Button } from '@/components/ui/button'
import { CategoryIcon, ProcessIcon } from '@/components/Marketing/icons'

export type MarketingImage = { src?: string | null; alt?: string | null }

export type MarketingLink = {
  label?: string | null
  href?: string | null
  variant?: 'enquiry' | 'outline' | 'default' | null
}

function lines(text?: string | null) {
  if (!text) return null
  return text.split('\n').map((line, index) => (
    <Fragment key={`${line}-${index}`}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ))
}

function paragraphs(text?: string | null) {
  return (text || '')
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function MarketingLinks({
  links,
  align = 'start',
  tone = 'light',
  size = 'lg',
}: {
  links?: MarketingLink[] | null
  align?: 'start' | 'center'
  tone?: 'dark' | 'light'
  size?: 'default' | 'lg'
}) {
  const visible = (links || []).filter((link) => link.label && link.href)
  if (!visible.length) return null

  return (
    <div className={align === 'center' ? 'flex flex-wrap justify-center gap-4' : 'flex flex-wrap gap-4'}>
      {visible.map((link) => (
        <Button
          key={`${link.href}-${link.label}`}
          asChild
          size={size}
          variant={link.variant || 'enquiry'}
          className={
            tone === 'dark' && link.variant === 'outline'
              ? 'border-dark-foreground/30 text-dark-foreground hover:bg-dark-foreground/10 hover:text-dark-foreground'
              : undefined
          }
        >
          <Link href={link.href || '/enquiry'}>{link.label}</Link>
        </Button>
      ))}
    </div>
  )
}

export function HomeHero({
  eyebrow,
  headline,
  description,
  image,
  badgePrimary,
  badgeSecondary,
  badgeMuted,
  links,
}: {
  eyebrow?: string | null
  headline?: string | null
  description?: string | null
  image?: MarketingImage | null
  badgePrimary?: string | null
  badgeSecondary?: string | null
  badgeMuted?: string | null
  links?: MarketingLink[] | null
}) {
  const showBadge = badgePrimary || badgeSecondary || badgeMuted

  return (
    <section className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <PlaceholderImage
          src={image?.src || undefined}
          alt={image?.alt || ''}
          className="h-full w-full"
          aspectRatio="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/55 md:from-background/95 md:via-background/70 md:to-transparent" />
      </div>

      <div className="container relative z-10 py-16 lg:py-24">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">{eyebrow}</p>
          )}
          {headline && (
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6">
              {lines(headline)}
            </h1>
          )}
          {description && <p className="text-lg text-foreground-soft max-w-md mb-8">{description}</p>}
          <MarketingLinks links={links} />
        </div>
      </div>

      {showBadge && (
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-end text-right">
          <div className="bg-background/90 backdrop-blur px-4 py-3 rounded">
            {badgePrimary && (
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">{badgePrimary}</p>
            )}
            {badgeSecondary && (
              <p className="text-xs font-medium uppercase tracking-[0.15em]">{badgeSecondary}</p>
            )}
            {badgeMuted && (
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{badgeMuted}</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export function ServiceCards({
  eyebrow,
  heading,
  cards,
}: {
  eyebrow?: string | null
  heading?: string | null
  cards?: {
    title?: string | null
    subtitle?: string | null
    description?: string | null
    href?: string | null
    image?: MarketingImage | null
  }[] | null
}) {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container">
        <div className="mb-12">
          {eyebrow && (
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{eyebrow}</p>
          )}
          {heading && <h2 className="font-serif text-3xl md:text-4xl">{heading}</h2>}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(cards || []).map((card) => (
            <Link
              key={card.title || card.href}
              href={card.href || '/services'}
              className="group block bg-background-warm rounded overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="overflow-hidden">
                <PlaceholderImage
                  src={card.image?.src || undefined}
                  alt={card.image?.alt || card.title || ''}
                  aspectRatio="4/3"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg mb-1 group-hover:text-accent transition-colors">
                  {card.title}
                </h3>
                {card.subtitle && <p className="text-xs text-muted-foreground mb-2">{card.subtitle}</p>}
                {card.description && <p className="text-sm text-foreground-soft">{card.description}</p>}
                <span className="inline-flex items-center justify-center w-8 h-8 mt-4 rounded-full border border-foreground/20 text-foreground group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
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
  )
}

export function PageIntro({
  layout = 'text',
  eyebrow,
  heading,
  headingAccent,
  description,
  image,
}: {
  layout?: 'split' | 'text' | null
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  description?: string | null
  image?: MarketingImage | null
}) {
  const copy = (
    <>
      {eyebrow && (
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">{eyebrow}</p>
      )}
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
        {lines(heading)}
        {headingAccent && (
          <>
            {heading ? <br /> : null}
            <span className="italic text-accent">{headingAccent}</span>
          </>
        )}
      </h1>
      {description && (
        <p className={`text-lg text-foreground-soft ${layout === 'split' ? 'max-w-lg' : 'max-w-xl'}`}>
          {description}
        </p>
      )}
    </>
  )

  return (
    <section className="bg-background-warm py-16 lg:py-24">
      <div className="container">
        {layout === 'split' ? (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>{copy}</div>
            <PlaceholderImage
              src={image?.src || undefined}
              alt={image?.alt || ''}
              aspectRatio="4/3"
              className="rounded"
            />
          </div>
        ) : (
          <div className="max-w-3xl">{copy}</div>
        )}
      </div>
    </section>
  )
}

export function ProseSection({
  eyebrow,
  heading,
  body,
}: {
  eyebrow?: string | null
  heading?: string | null
  body?: string | null
}) {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">{eyebrow}</p>
          )}
          {heading && <h2 className="font-serif text-3xl md:text-4xl mb-6">{heading}</h2>}
          <div className="prose prose-lg text-foreground-soft">
            {paragraphs(body).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function CapabilityList({
  eyebrow,
  heading,
  items,
}: {
  eyebrow?: string | null
  heading?: string | null
  items?: { title?: string | null; description?: string | null }[] | null
}) {
  return (
    <section className="bg-background-warm py-16 lg:py-24">
      <div className="container">
        <div className="mb-12">
          {eyebrow && (
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{eyebrow}</p>
          )}
          {heading && <h2 className="font-serif text-3xl md:text-4xl">{heading}</h2>}
        </div>
        <div className="grid sm:grid-cols-2 gap-8">
          {(items || []).map((item, index) => (
            <div key={item.title || index} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-background flex items-center justify-center text-sm font-medium text-accent">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-foreground-soft">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SplitFeature({
  variant = 'briefs',
  eyebrow,
  heading,
  headingAccent,
  body,
  image,
  items,
  links,
}: {
  variant?: 'briefs' | 'checklist' | 'darkCopy' | null
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  body?: string | null
  image?: MarketingImage | null
  items?: {
    title?: string | null
    subtitle?: string | null
    image?: MarketingImage | null
  }[] | null
  links?: MarketingLink[] | null
}) {
  if (variant === 'checklist') {
    return (
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              {eyebrow && (
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">{eyebrow}</p>
              )}
              <h2 className="font-serif text-3xl md:text-4xl mb-6">
                {lines(heading)}
                {headingAccent && (
                  <>
                    {heading ? <br /> : null}
                    <span className="italic">{headingAccent}</span>
                  </>
                )}
              </h2>
              <div className="space-y-4 text-foreground-soft">
                {paragraphs(body).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 space-y-4">
                {(items || []).map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
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
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <PlaceholderImage
              src={image?.src || undefined}
              alt={image?.alt || ''}
              aspectRatio="3/4"
              className="rounded"
            />
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'darkCopy') {
    const bodyParagraphs = paragraphs(body)
    return (
      <section className="bg-dark text-dark-foreground py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              {eyebrow && (
                <p className="text-xs tracking-[0.2em] uppercase text-accent mb-4">{eyebrow}</p>
              )}
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
                {lines(heading)}
                {headingAccent && (
                  <>
                    {heading ? <br /> : null}
                    <span className="italic">{headingAccent}</span>
                  </>
                )}
              </h2>
              {bodyParagraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === bodyParagraphs.length - 1
                      ? 'text-dark-foreground/80 mb-8'
                      : 'text-dark-foreground/80 mb-6'
                  }
                >
                  {paragraph}
                </p>
              ))}
              <MarketingLinks links={links} />
            </div>
            <PlaceholderImage
              src={image?.src || undefined}
              alt={image?.alt || ''}
              aspectRatio="4/3"
              className="rounded"
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background-warm py-16 lg:py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="relative">
            <PlaceholderImage
              src={image?.src || undefined}
              alt={image?.alt || ''}
              aspectRatio="3/4"
              className="rounded"
            />
          </div>
          <div className="lg:sticky lg:top-32">
            {eyebrow && (
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">{eyebrow}</p>
            )}
            {heading && <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-2">{heading}</h2>}
            {headingAccent && (
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl italic text-accent mb-6">
                {headingAccent}
              </h2>
            )}
            <div className="text-foreground-soft mb-8 max-w-lg space-y-4">
              {paragraphs(body).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="space-y-4">
              {(items || []).map((item) => (
                <div key={item.title} className="flex items-center gap-4">
                  <PlaceholderImage
                    src={item.image?.src || undefined}
                    alt={item.image?.alt || item.title || ''}
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
  )
}

export function ProcessSection({
  variant = 'split',
  eyebrow,
  heading,
  body,
  trustItems,
  steps,
}: {
  variant?: 'split' | 'centered' | null
  eyebrow?: string | null
  heading?: string | null
  body?: string | null
  trustItems?: {
    title?: string | null
    description?: string | null
    image?: MarketingImage | null
  }[] | null
  steps?: { title?: string | null; description?: string | null }[] | null
}) {
  if (variant === 'centered') {
    return (
      <section className="bg-background-warm py-16 lg:py-24 border-t border-border">
        <div className="container">
          <div className="text-center mb-12">
            {eyebrow && (
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{eyebrow}</p>
            )}
            {heading && <h2 className="font-serif text-3xl md:text-4xl">{heading}</h2>}
          </div>
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {(steps || []).map((step, index) => (
              <div key={step.title || index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background text-accent font-medium text-lg mb-4">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="font-medium mb-1">{step.title}</h3>
                {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
          <div>
            {eyebrow && (
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{eyebrow}</p>
            )}
            {heading && <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">{heading}</h2>}
            {body && <p className="text-foreground-soft max-w-lg">{body}</p>}
          </div>
          <div className="space-y-4">
            {(trustItems || []).map((item) => (
              <div key={item.title} className="flex items-center gap-4">
                <PlaceholderImage
                  src={item.image?.src || undefined}
                  alt={item.image?.alt || item.title || ''}
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
        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-border" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
            {(steps || []).map((step, index) => (
              <div key={step.title || index} className="relative text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background-section text-foreground-soft mb-4 relative z-10">
                  <ProcessIcon index={index} />
                </div>
                <div className="text-sm font-medium text-accent mb-1">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="font-medium text-sm">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function CategoryBar({
  eyebrow,
  heading,
  items,
}: {
  eyebrow?: string | null
  heading?: string | null
  items?: { title?: string | null }[] | null
}) {
  return (
    <section className="border-t border-b border-border py-8">
      <div className="container">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            {eyebrow && (
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">{eyebrow}</p>
            )}
            {heading && (
              <p className="text-sm font-medium uppercase tracking-wide">{lines(heading)}</p>
            )}
          </div>
          <div className="hidden md:flex items-center gap-8">
            {(items || []).map((item, index) => (
              <div key={item.title || index} className="text-center">
                <div className="flex justify-center mb-2 text-accent">
                  <CategoryIcon index={index} />
                </div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function CtaBand({
  tone = 'dark',
  heading,
  body,
  links,
}: {
  tone?: 'dark' | 'light' | null
  heading?: string | null
  body?: string | null
  links?: MarketingLink[] | null
}) {
  const dark = tone !== 'light'

  return (
    <section className={dark ? 'bg-dark text-dark-foreground py-16 lg:py-24' : 'bg-background py-16 lg:py-24'}>
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {heading && (
            <h2
              className={
                dark
                  ? 'font-serif text-3xl md:text-4xl lg:text-5xl mb-6'
                  : 'font-serif text-3xl md:text-4xl mb-6'
              }
            >
              {heading}
            </h2>
          )}
          {body && (
            <p className={dark ? 'text-dark-foreground/70 mb-8' : 'text-foreground-soft mb-8'}>{body}</p>
          )}
          <MarketingLinks align="center" links={links} tone={dark ? 'dark' : 'light'} />
        </div>
      </div>
    </section>
  )
}

export function ServiceDetails({
  services,
}: {
  services?: {
    anchor?: string | null
    title?: string | null
    subtitle?: string | null
    description?: string | null
    features?: { text?: string | null }[] | null
    image?: MarketingImage | null
    enquireLabel?: string | null
  }[] | null
}) {
  return (
    <>
      {(services || []).map((service, index) => (
        <section
          key={service.anchor || service.title || index}
          id={service.anchor || undefined}
          className={`py-16 lg:py-24 ${index % 2 === 0 ? 'bg-background' : 'bg-background-warm'}`}
        >
          <div className="container">
            <div
              className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
            >
              <div>
                {service.subtitle && <p className="text-sm text-muted-foreground mb-2">{service.subtitle}</p>}
                <h2 className="font-serif text-3xl md:text-4xl mb-4">{service.title}</h2>
                {service.description && <p className="text-foreground-soft mb-8">{service.description}</p>}
                {!!service.features?.length && (
                  <div className="mb-8">
                    <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
                      What we deliver
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <li key={feature.text} className="flex items-center gap-2 text-sm">
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
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {service.enquireLabel && (
                  <Button asChild>
                    <Link href="/enquiry">{service.enquireLabel}</Link>
                  </Button>
                )}
              </div>
              <PlaceholderImage
                src={service.image?.src || undefined}
                alt={service.image?.alt || service.title || ''}
                aspectRatio="4/3"
                className="rounded"
              />
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
