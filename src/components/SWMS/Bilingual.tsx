import React from 'react'

export function Bilingual({
  en,
  zh,
  className = '',
}: {
  en: string
  zh: string
  className?: string
}) {
  return (
    <span className={className}>
      <span className="block">{en}</span>
      <span className="block text-[0.92em] font-normal text-muted-foreground">{zh}</span>
    </span>
  )
}
