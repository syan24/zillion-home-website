import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  variant?: 'dark' | 'light'
}

export const Logo = (props: Props) => {
  const { className, variant = 'dark' } = props

  const textColor = variant === 'light' ? 'text-white' : 'text-foreground'

  return (
    <div className={cn('flex flex-col', className)}>
      <span
        className={cn(
          'font-serif text-xl tracking-[0.2em] font-medium uppercase',
          textColor,
        )}
      >
        Zillion Home
      </span>
      <span
        className={cn(
          'text-[10px] tracking-[0.15em] uppercase',
          variant === 'light' ? 'text-white/70' : 'text-muted-foreground',
        )}
      >
        Build Better Living
      </span>
    </div>
  )
}
