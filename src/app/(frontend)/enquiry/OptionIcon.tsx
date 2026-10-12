import { isEnquiryIcon, type EnquiryIcon } from '@/lib/enquiry/icons'

const paths: Record<EnquiryIcon, string> = {
  house:
    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  building:
    'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  layout:
    'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
}

export function OptionIcon({
  icon,
  iconUrl,
  inline = false,
}: {
  icon?: string
  iconUrl?: string
  inline?: boolean
}) {
  const frame = inline ? 'inline-flex shrink-0' : 'flex justify-center mb-2'
  const size = inline ? 'w-5 h-5' : 'w-6 h-6'

  if (iconUrl) {
    return (
      <span className={`${frame} text-foreground-soft`}>
        {/* Decorative. The option label is the accessible name. Blob and local media URLs both need a plain image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconUrl} alt="" className={`${size} object-contain`} />
      </span>
    )
  }

  if (!isEnquiryIcon(icon)) return null

  return (
    <span className={`${frame} text-foreground-soft`} aria-hidden>
      <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={paths[icon]} />
      </svg>
    </span>
  )
}
