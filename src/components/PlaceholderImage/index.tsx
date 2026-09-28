import React from 'react'
import { cn } from '@/utilities/ui'

interface PlaceholderImageProps {
  src?: string
  alt?: string
  className?: string
  aspectRatio?: 'square' | '4/3' | '3/4' | '16/9' | '3/2' | 'auto'
  overlay?: boolean
  label?: string
  children?: React.ReactNode
}

const aspectRatioClasses = {
  square: 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '3/4': 'aspect-[3/4]',
  '16/9': 'aspect-video',
  '3/2': 'aspect-[3/2]',
  auto: '',
}

export function PlaceholderImage({
  src,
  alt = '',
  className,
  aspectRatio = '4/3',
  overlay = false,
  label,
  children,
}: PlaceholderImageProps) {
  const hasImage = src && src.length > 0

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-background-section',
        aspectRatioClasses[aspectRatio],
        className,
      )}
    >
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            {label ? (
              <>
                <p className="text-sm">{label}</p>
                <p className="text-xs mt-1 opacity-70">CMS Media</p>
              </>
            ) : (
              <p className="text-xs">Image placeholder</p>
            )}
          </div>
        </div>
      )}

      {overlay && hasImage && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      )}

      {children}
    </div>
  )
}
