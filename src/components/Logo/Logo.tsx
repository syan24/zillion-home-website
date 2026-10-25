import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  variant?: 'dark' | 'light'
  detail?: string
}

export const Logo = ({ className, variant = 'dark', detail }: Props) => {
  const light = variant === 'light'
  const line = detail || (light ? 'Home · Build better living' : 'Home · Melbourne')

  return (
    <span className={cn('flex flex-col gap-1 leading-none', className)}>
      <span
        className={cn(
          'font-serif text-2xl font-normal uppercase tracking-[0.32em]',
          light ? 'text-[#efe9de]' : 'text-current',
        )}
      >
        Zillion
      </span>
      <span
        className={cn(
          'text-[9px] uppercase tracking-[0.5em] opacity-70',
          light ? 'text-[#efe9de]' : 'text-current',
        )}
      >
        {line}
      </span>
    </span>
  )
}
