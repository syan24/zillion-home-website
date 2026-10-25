import React, { Fragment } from 'react'
import Link from 'next/link'

import { PlaceholderImage } from '@/components/PlaceholderImage'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

export type MarketingImage = { src?: string | null; alt?: string | null }

export type MarketingLink = {
  label?: string | null
  href?: string | null
  variant?: 'enquiry' | 'outline' | 'default' | null
}

const wrap = 'mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,56px)]'
const photoScrim =
  'absolute inset-0 bg-gradient-to-b from-[rgba(20,18,15,0.6)] via-[rgba(20,18,15,0.22)] to-[rgba(20,18,15,0.85)]'
const display = 'font-serif font-light tracking-[-0.01em]'
const linkChrome =
  'h-auto rounded-none px-10 py-5 text-[11px] font-normal uppercase tracking-[0.3em] shadow-none'

const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
const capabilityHrefs = [
  '/services#residential',
  '/services#commercial',
  '/services#joinery',
  '/services#interior',
]

const statementGold = ['living', 'working', 'business', '居住', '工作', '商业']

function goldStatement(text: string) {
  const pattern = new RegExp(`(${statementGold.join('|')})`, 'g')
  return text.split(pattern).map((part, index) =>
    statementGold.includes(part) ? (
      <em key={`${part}-${index}`} className="italic text-accent-tan">
        {part}
      </em>
    ) : (
      <Fragment key={`${part}-${index}`}>{part}</Fragment>
    ),
  )
}

function lines(text?: string | null, gold = false) {
  if (!text) return null
  return text.split('\n').map((line, index) => (
    <Fragment key={`${line}-${index}`}>
      {index > 0 && <br />}
      {gold ? goldStatement(line) : line}
    </Fragment>
  ))
}

function paragraphs(text?: string | null) {
  return (text || '')
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function marketingButtonVariant(link: MarketingLink, tone: 'dark' | 'light') {
  if (tone === 'dark' && link.variant === 'outline') return 'outlineDark' as const
  if (link.variant === 'outline' || link.variant === 'default') return link.variant
  return 'enquiry' as const
}

function Eyebrow({
  children,
  tone = 'light',
  rule = false,
}: {
  children?: string | null
  tone?: 'light' | 'dark' | 'photo'
  rule?: boolean
}) {
  if (!children) return null
  const color =
    tone === 'photo' ? 'text-accent-gold' : tone === 'dark' ? 'text-accent' : 'text-accent-tan'
  if (rule) {
    return (
      <p className={cn('flex items-center gap-4 text-[11px] uppercase tracking-[0.4em]', color)}>
        <span className="h-px w-12 bg-accent" aria-hidden />
        {children}
      </p>
    )
  }
  const label = children.trim().startsWith('—') ? children : `— ${children}`
  return <p className={cn('text-[11px] uppercase tracking-[0.4em]', color)}>{label}</p>
}

/** One flowing line. A stored newline must not force a break inside a display heading. */
export function goldPhrase(text?: string | null, phrase?: string | null) {
  const value = (text || '').replace(/\s*\n\s*/g, ' ').replace(/[ \t]+/g, ' ').trim()
  const mark = (phrase || '').trim()
  if (!value) return null
  if (!mark) return value
  const index = value.toLowerCase().indexOf(mark.toLowerCase())
  if (index < 0) return value
  return (
    <>
      {value.slice(0, index)}
      <em className="italic text-accent-gold">{value.slice(index, index + mark.length)}</em>
      {value.slice(index + mark.length)}
    </>
  )
}

function homeAccent(headline?: string | null) {
  const value = headline || ''
  if (/ground/i.test(value)) return 'ground'
  if (value.includes('开始')) return '开始'
  return null
}

function flowingTitle(heading?: string | null, accent?: string | null) {
  let lead = (heading || '').replace(/\s*\n\s*/g, ' ').replace(/[ \t]+/g, ' ').trim()
  let mark = (accent || '').replace(/\s*\n\s*/g, ' ').replace(/[ \t]+/g, ' ').trim()
  if (lead === 'Building with' && /^care and precision\.?$/i.test(mark)) {
    lead = 'Building with care & precision.'
    mark = 'care'
  }
  if (mark && lead.toLowerCase().includes(mark.toLowerCase())) return goldPhrase(lead, mark)
  if (lead && mark) return goldPhrase(`${lead} ${mark}`, mark)
  return goldPhrase(lead)
}

function accentHeading(heading?: string | null) {
  const value = (heading || '').trim()
  const match = value.match(/^([^,，]+)[,，]\s*(.+)$/)
  if (!match) return { lead: value, accent: null as string | null }
  return { lead: `${match[1]},`, accent: match[2] }
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
          variant={marketingButtonVariant(link, tone)}
          className={linkChrome}
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
  const badges = [badgePrimary, badgeSecondary, badgeMuted].filter(Boolean)
  const extraLinks = (links || []).filter((link) => link.href !== '/enquiry')

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden text-[#f5f2ec]">
      <div className="absolute inset-0">
        <PlaceholderImage
          src={image?.src || undefined}
          alt={image?.alt || ''}
          className="h-full w-full"
          aspectRatio="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(20,18,15,0.55)] via-[rgba(20,18,15,0.12)] to-[rgba(20,18,15,0.82)]" />
      </div>
      <div className={cn(wrap, 'relative flex flex-col gap-12 pb-14 pt-28')}>
        <div className="flex flex-col gap-7">
          <Eyebrow tone="photo" rule>
            {eyebrow}
          </Eyebrow>
          {headline && (
            <h1 className={cn(display, 'w-full max-w-[12ch] text-[clamp(56px,9vw,148px)] leading-[0.92]')}>
              {goldPhrase(headline, homeAccent(headline))}
            </h1>
          )}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-10 border-t border-[#f5f2ec]/30 pt-7">
          <div className="flex max-w-[440px] flex-col gap-6">
            {description && <p className="text-base leading-7 text-[#f5f2ec]/90">{description}</p>}
            <MarketingLinks links={extraLinks} tone="dark" />
          </div>
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-x-10 gap-y-3 text-[11px] uppercase tracking-[0.28em]">
              {badges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
          )}
        </div>
      </div>
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
    <section id="services" className="bg-background-warm py-[clamp(96px,10vw,150px)]">
      <div className={cn(wrap, 'flex flex-col gap-16')}>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-6">
            <Eyebrow>{eyebrow}</Eyebrow>
            {heading && <h2 className={cn(display, 'text-[clamp(40px,4.6vw,72px)] leading-none')}>{heading}</h2>}
          </div>
          <Link
            href="/services"
            className="border-b border-current pb-1.5 text-[11px] uppercase tracking-[0.28em]"
          >
            {eyebrow?.match(/[\u4e00-\u9fff]/) ? '全部服务' : 'All services'}
          </Link>
        </div>
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {(cards || []).map((card, index) => (
            <Link
              key={card.title || card.href || index}
              href={card.href || '/services'}
              className="group flex flex-col gap-6 text-foreground"
            >
              <div className="aspect-[3/4] overflow-hidden bg-[#d9d2c5]">
                <PlaceholderImage
                  src={card.image?.src || undefined}
                  alt={card.image?.alt || card.title || ''}
                  aspectRatio="auto"
                  className="h-full w-full motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
                />
              </div>
              <div className="flex items-baseline gap-4 border-t border-[#c9c0b0] pt-5">
                <span className="font-serif text-lg italic text-accent-tan">{romans[index] || index + 1}</span>
                <div className="flex flex-col gap-2.5">
                  <h3 className="font-serif text-[28px] font-normal leading-tight">{card.title}</h3>
                  {card.subtitle && <p className="text-sm text-muted-foreground">{card.subtitle}</p>}
                  {card.description && <p className="text-sm leading-7 text-[#5c564d]">{card.description}</p>}
                </div>
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
  measure = 'services',
}: {
  layout?: 'split' | 'text' | null
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  description?: string | null
  image?: MarketingImage | null
  /** About and Services use different canvas measures. The width sits on the heading, not the eyebrow. */
  measure?: 'about' | 'services'
}) {
  if (image?.src || layout === 'split') {
    const about = measure === 'about'
    return (
      <section className="relative flex min-h-[78vh] items-end overflow-hidden text-[#f5f2ec] md:h-[82vh] md:min-h-[620px]">
        <div className="absolute inset-0">
          <PlaceholderImage
            src={image?.src || undefined}
            alt={image?.alt || ''}
            className="h-full w-full"
            aspectRatio="auto"
          />
          <div className={photoScrim} />
        </div>
        <div className={cn(wrap, 'relative flex flex-col gap-10 pb-14 pt-32')}>
          <Eyebrow tone="photo" rule>
            {eyebrow}
          </Eyebrow>
          <div
            className={cn(
                about
                  ? 'flex flex-wrap items-end justify-between gap-10'
                  : 'flex flex-col gap-7',
            )}
          >
            <h1
              className={cn(
                display,
                about
                  ? 'w-full max-w-[11ch] text-[clamp(52px,8vw,128px)] leading-[0.94]'
                  : 'w-full max-w-[14ch] text-[clamp(48px,7vw,112px)] leading-[0.95]',
              )}
            >
              {flowingTitle(heading, headingAccent)}
            </h1>
            {description && <p className="max-w-md text-base leading-7 text-[#f5f2ec]/90">{description}</p>}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background pb-16 pt-32 lg:pb-24">
      <div className={cn(wrap, 'max-w-3xl')}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className={cn(display, 'mt-6 text-[clamp(44px,5vw,72px)] leading-none')}>
          {lines(heading)}
          {headingAccent && (
            <>
              {heading ? <br /> : null}
              <em className="italic text-accent-tan">{headingAccent}</em>
            </>
          )}
        </h1>
        {description && <p className="mt-6 max-w-xl text-lg leading-8 text-foreground-soft">{description}</p>}
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
  const accent = accentHeading(heading)
  return (
    <section className="bg-background py-[clamp(96px,12vw,180px)]">
      <div className={cn(wrap, 'grid items-start gap-12 lg:grid-cols-2 lg:gap-24')}>
        <div className="flex flex-col gap-8">
          <Eyebrow>{eyebrow}</Eyebrow>
          {heading && (
            <h2 className={cn(display, 'text-[clamp(44px,5.4vw,84px)] leading-none')}>
              {accent.accent ? (
                <>
                  {accent.lead} <em className="italic text-accent-tan">{accent.accent}</em>
                </>
              ) : (
                lines(heading)
              )}
            </h2>
          )}
        </div>
        <div className="flex flex-col gap-7 lg:pt-16">
          {paragraphs(body).map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0 && eyebrow
                  ? 'font-serif text-[clamp(24px,2.2vw,32px)] leading-snug text-foreground'
                  : 'max-w-xl text-base leading-8 text-foreground-soft'
              }
            >
              {paragraph}
            </p>
          ))}
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
  const list = items || []
  return (
    <section className="bg-background-warm py-[clamp(96px,10vw,150px)]">
      <div className={cn(wrap, 'flex flex-col gap-14')}>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-6">
            <Eyebrow>{eyebrow}</Eyebrow>
            {heading && <h2 className={cn(display, 'text-[clamp(40px,4.6vw,72px)] leading-none')}>{heading}</h2>}
          </div>
          <Link href="/services" className="border-b border-current pb-1.5 text-[11px] uppercase tracking-[0.28em]">
            {heading?.match(/[\u4e00-\u9fff]/) ? '查看服务' : 'View services'}
          </Link>
        </div>
        <div className="border-b border-[#c9c0b0]">
          {list.map((item, index) => {
            const href = list.length === capabilityHrefs.length ? capabilityHrefs[index] : undefined
            const row = (
              <>
                <span className="font-serif text-[22px] italic text-accent-tan">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-[clamp(26px,2.6vw,40px)] font-normal leading-tight">{item.title}</h3>
                <p className="text-[15px] leading-7 text-[#5c564d]">{item.description}</p>
                <span className="text-right text-xl text-accent-tan" aria-hidden>
                  →
                </span>
              </>
            )
            const className =
              'grid grid-cols-[56px_minmax(0,1.3fr)] gap-x-4 gap-y-3 border-t border-[#c9c0b0] py-8 text-foreground transition-colors hover:text-accent-tan md:grid-cols-[90px_minmax(0,1.3fr)_minmax(0,1fr)_40px] md:items-baseline md:gap-12'
            return href ? (
              <Link key={item.title || index} href={href} className={className}>
                {row}
              </Link>
            ) : (
              <div key={item.title || index} className={className}>
                {row}
              </div>
            )
          })}
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
      <section className="bg-background py-[clamp(96px,11vw,170px)]">
        <div className={cn(wrap, 'grid items-center gap-16 lg:grid-cols-2 lg:gap-24')}>
          <div className="relative">
            <PlaceholderImage
              src={image?.src || undefined}
              alt={image?.alt || ''}
              aspectRatio="3/4"
              className="bg-[#d9d2c5]"
            />
            {image?.alt && (
              <span className="absolute bottom-0 right-0 bg-background py-4 pl-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                {image.alt}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-8">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className={cn(display, 'text-[clamp(40px,4.6vw,72px)] leading-none')}>
              {lines(heading)}
              {headingAccent && (
                <>
                  {heading ? ' ' : null}
                  <em className="italic text-accent-tan">{headingAccent}</em>
                </>
              )}
            </h2>
            <div className="max-w-xl space-y-4 text-base leading-8 text-foreground-soft">
              {paragraphs(body).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="flex flex-col">
              {(items || []).map((item) => (
                <div
                  key={item.title}
                  className="grid gap-3 border-t border-border py-5 md:grid-cols-[minmax(0,200px)_minmax(0,1fr)] md:items-baseline md:gap-6"
                >
                  <span className="font-serif text-2xl">{item.title}</span>
                  <span className="text-sm leading-7 text-[#5c564d]">{item.subtitle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'darkCopy') {
    const bodyParagraphs = paragraphs(body)
    return (
      <section className="bg-background-warm">
        <div className={cn(wrap, 'grid items-center gap-16 py-[clamp(96px,10vw,150px)] lg:grid-cols-2 lg:gap-24')}>
          <div className="flex flex-col gap-8">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className={cn(display, 'text-[clamp(40px,4.6vw,72px)] leading-none')}>
              {lines(heading)}
              {headingAccent && (
                <>
                  {heading ? ' ' : null}
                  <em className="italic text-accent-tan">{headingAccent}</em>
                </>
              )}
            </h2>
            {bodyParagraphs.map((paragraph, index) =>
              index === bodyParagraphs.length - 1 && bodyParagraphs.length > 1 ? (
                <p
                  key={paragraph}
                  className="border-l border-accent-tan pl-6 font-serif text-2xl italic leading-snug text-foreground"
                >
                  {paragraph}
                </p>
              ) : (
                <p key={paragraph} className="max-w-xl text-base leading-8 text-foreground-soft">
                  {paragraph}
                </p>
              ),
            )}
            <MarketingLinks links={links} />
          </div>
          <PlaceholderImage
            src={image?.src || undefined}
            alt={image?.alt || ''}
            aspectRatio="square"
            className="bg-[#d9d2c5]"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background py-[clamp(96px,12vw,180px)]">
      <div className={cn(wrap, 'grid items-center gap-16 lg:grid-cols-2 lg:gap-24')}>
        <div className="flex flex-col gap-10">
          <Eyebrow>{eyebrow}</Eyebrow>
          {(heading || headingAccent) && (
            <h2 className={cn(display, 'text-[clamp(44px,5.4vw,84px)] leading-none')}>
              {lines(heading)}
              {headingAccent && (
                <>
                  {heading ? <br /> : null}
                  <em className="italic text-accent-tan">{headingAccent}</em>
                </>
              )}
            </h2>
          )}
          <div className="max-w-xl space-y-4 text-[17px] leading-8 text-foreground-soft">
            {paragraphs(body).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {!!items?.length && (
            <div className="grid max-w-xl grid-cols-2 gap-6 border-t border-border pt-7 sm:grid-cols-3">
              {items.slice(0, 3).map((item) => (
                <div key={item.title} className="flex flex-col gap-2">
                  <span className="font-serif text-[22px]">{item.title}</span>
                  {item.subtitle && <span className="text-xs tracking-wide text-muted-foreground">{item.subtitle}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <PlaceholderImage
            src={image?.src || undefined}
            alt={image?.alt || ''}
            aspectRatio="3/4"
            className="bg-[#d9d2c5]"
          />
          {image?.alt && (
            <span className="absolute bottom-0 left-0 bg-background py-4 pr-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {image.alt}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

export function ProcessSection({
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
  return (
    <>
      <section id="process" className="bg-dark py-[clamp(96px,10vw,160px)] text-dark-foreground">
        <div className={cn(wrap, 'flex flex-col gap-[clamp(64px,8vw,110px)]')}>
          <div className="grid items-end gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <Eyebrow tone="dark">{eyebrow}</Eyebrow>
              {heading && (
                <h2 className={cn(display, 'text-[clamp(44px,5.4vw,84px)] leading-none')}>{lines(heading)}</h2>
              )}
            </div>
            {body && <p className="max-w-lg text-base leading-8 text-[#b5ac9e]">{body}</p>}
          </div>
          <ol className="grid list-none border-t border-[#efe9de]/20 sm:grid-cols-2 lg:grid-cols-5">
            {(steps || []).map((step, index) => (
              <li key={step.title || index} className="flex flex-col gap-10 py-8 pr-6">
                <span className={cn(display, 'text-[56px] leading-none text-accent')}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-[26px] font-normal leading-tight">{step.title}</h3>
                  {step.description && <p className="text-sm leading-7 text-[#9d9486]">{step.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {!!trustItems?.length && (
        <section className="bg-background py-[clamp(96px,10vw,160px)]">
          <div className={cn(wrap, 'flex flex-col gap-16')}>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
              <Eyebrow>
                {trustItems.some((item) => item.title?.match(/[\u4e00-\u9fff]/)) ? '我们的保证' : 'Our assurances'}
              </Eyebrow>
              <h2 className={cn(display, 'max-w-[16ch] text-[clamp(40px,4.6vw,72px)] leading-none')}>
                {trustItems.some((item) => item.title?.match(/[\u4e00-\u9fff]/))
                  ? '看得见的工艺，感受得到的把握。'
                  : 'Craft you can see. Confidence you can feel.'}
              </h2>
            </div>
            <div className="grid gap-12 md:grid-cols-3">
              {trustItems.map((item) => (
                <div key={item.title} className="flex flex-col gap-6">
                  <PlaceholderImage
                    src={item.image?.src || undefined}
                    alt={item.image?.alt || item.title || ''}
                    aspectRatio="4/3"
                    className="aspect-[5/4] bg-[#d9d2c5]"
                  />
                  <div className="flex flex-col gap-2.5 text-center">
                    <h3 className="font-serif text-[28px] font-normal">{item.title}</h3>
                    <p className="text-sm leading-7 text-[#5c564d]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
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
    <section className="border-y border-border py-[clamp(80px,9vw,140px)]">
      <div className={cn(wrap, 'mx-auto flex max-w-5xl flex-col items-center gap-10 text-center')}>
        <Eyebrow>{eyebrow}</Eyebrow>
        {heading && (
          <p className={cn(display, 'text-[clamp(36px,4.4vw,68px)] leading-[1.12]')}>{lines(heading, true)}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
          {(items || []).map((item, index) => (
            <Fragment key={item.title || index}>
              {index > 0 && <span aria-hidden>·</span>}
              <span>{item.title}</span>
            </Fragment>
          ))}
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
  image,
}: {
  tone?: 'dark' | 'light' | null
  heading?: string | null
  body?: string | null
  links?: MarketingLink[] | null
  image?: MarketingImage | null
}) {
  const photo = Boolean(image?.src)
  const dark = photo || tone !== 'light'
  const chinese = Boolean(heading?.match(/[\u4e00-\u9fff]/) || body?.match(/[\u4e00-\u9fff]/))
  const lastSpace = heading ? heading.lastIndexOf(' ') : -1
  const headingLead = lastSpace > 0 ? heading!.slice(0, lastSpace) : heading
  const headingAccent = lastSpace > 0 ? heading!.slice(lastSpace + 1) : null
  return (
    <section
      className={cn(
        'relative overflow-hidden',
        dark ? 'text-[#f5f2ec]' : 'bg-background text-foreground',
        !photo && dark && 'bg-dark',
      )}
    >
      {photo && (
        <div className="absolute inset-0">
          <PlaceholderImage
            src={image?.src || undefined}
            alt={image?.alt || ''}
            className="h-full w-full"
            aspectRatio="auto"
          />
          <div className="absolute inset-0 bg-[rgba(22,20,17,0.68)]" />
        </div>
      )}
      <div className={cn(wrap, 'relative flex flex-col items-center gap-8 py-[clamp(100px,11vw,170px)] text-center')}>
        <Eyebrow tone={photo ? 'photo' : dark ? 'dark' : 'light'}>
          {chinese ? '开始一个项目' : 'Begin a project'}
        </Eyebrow>
        {heading && (
          <h2 className={cn(display, 'max-w-[16ch] text-[clamp(44px,5.6vw,92px)] leading-none')}>
            {headingLead}
            {headingAccent && (
              <>
                {' '}
                <em className="italic text-accent-gold">{headingAccent}</em>
              </>
            )}
          </h2>
        )}
        {body && (
          <p className={cn('max-w-xl text-base leading-8', dark ? 'text-[#ddd5c8]' : 'text-foreground-soft')}>{body}</p>
        )}
        <MarketingLinks align="center" links={links} tone={dark ? 'dark' : 'light'} />
      </div>
    </section>
  )
}

export function ServiceDetails({
  services,
  featuresLabel = 'What we deliver',
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
  featuresLabel?: string
}) {
  const list = services || []
  return (
    <div className={cn(wrap, 'flex flex-col gap-[clamp(96px,11vw,170px)] py-[clamp(80px,10vw,150px)]')}>
      {list.length > 0 && (
        <nav className="grid border-t border-[#f5f2ec]/0 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((service, index) => (
            <a
              key={service.anchor || service.title || index}
              href={service.anchor ? `#${service.anchor}` : '/services'}
              className="flex items-baseline gap-3 border-t border-border py-5 pr-4 text-[11px] uppercase tracking-[0.26em]"
            >
              <span className="font-serif text-base lowercase italic tracking-normal text-accent-tan">
                {romans[index]}
              </span>
              {service.title}
            </a>
          ))}
        </nav>
      )}
      {list.map((service, index) => (
        <section
          key={service.anchor || service.title || index}
          id={service.anchor || undefined}
          className="scroll-mt-28 grid items-center gap-12 lg:grid-cols-2 lg:gap-24"
        >
          <PlaceholderImage
            src={service.image?.src || undefined}
            alt={service.image?.alt || service.title || ''}
            aspectRatio="3/4"
            className={cn('bg-[#d9d2c5]', index % 2 === 1 && 'lg:order-2')}
          />
          <div className="flex flex-col gap-8">
            <span className="font-serif text-[22px] italic text-accent-tan">
              {romans[index]}
              {service.subtitle ? ` — ${service.subtitle}` : ''}
            </span>
            <h2 className={cn(display, 'text-[clamp(40px,4.4vw,68px)] leading-none')}>{service.title}</h2>
            {service.description && <p className="max-w-lg text-base leading-8 text-foreground-soft">{service.description}</p>}
            {!!service.features?.length && (
              <div>
                <p className="pb-2.5 text-[10px] uppercase tracking-[0.34em] text-muted-foreground">{featuresLabel}</p>
                <ul className="grid list-none sm:grid-cols-2 sm:gap-x-8">
                  {service.features.map((feature) => (
                    <li key={feature.text} className="border-t border-border py-3.5 text-[15px]">
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {service.enquireLabel && (
              <Link href="/enquiry" className="self-start border-b border-current pb-1.5 text-[11px] uppercase tracking-[0.28em]">
                {service.enquireLabel}
              </Link>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
