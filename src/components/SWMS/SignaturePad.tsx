'use client'

import { Button } from '@/components/ui/button'
import React, { useEffect, useRef } from 'react'

type SignaturePadProps = {
  disabled?: boolean
  onChange: (dataUrl: string | null) => void
}

export function SignaturePad({ disabled = false, onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const dirty = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const paint = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      const snapshot = dirty.current ? canvas.toDataURL('image/png') : null
      canvas.width = Math.max(1, Math.floor(rect.width * ratio))
      canvas.height = Math.max(1, Math.floor(rect.height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.lineWidth = 2.4
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.strokeStyle = '#15130e'
      if (snapshot) {
        const image = new Image()
        image.onload = () => {
          context.drawImage(image, 0, 0, rect.width, rect.height)
        }
        image.src = snapshot
      }
    }

    paint()
    window.addEventListener('resize', paint)
    return () => window.removeEventListener('resize', paint)
  }, [])

  const pointFrom = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const exportSignature = () => {
    const canvas = canvasRef.current
    if (!canvas || !dirty.current) {
      onChange(null)
      return
    }
    const copy = document.createElement('canvas')
    copy.width = canvas.width
    copy.height = canvas.height
    const context = copy.getContext('2d')
    if (!context) return
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, copy.width, copy.height)
    context.drawImage(canvas, 0, 0)
    onChange(copy.toDataURL('image/png'))
  }

  const clear = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    dirty.current = false
    onChange(null)
  }

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        aria-label="Signature"
        className="h-44 w-full touch-none rounded-md border border-border bg-white"
        onPointerDown={(event) => {
          if (disabled) return
          const canvas = canvasRef.current
          const context = canvas?.getContext('2d')
          if (!canvas || !context) return
          canvas.setPointerCapture(event.pointerId)
          drawing.current = true
          const point = pointFrom(event)
          context.beginPath()
          context.moveTo(point.x, point.y)
        }}
        onPointerMove={(event) => {
          if (!drawing.current || disabled) return
          const context = canvasRef.current?.getContext('2d')
          if (!context) return
          const point = pointFrom(event)
          context.lineTo(point.x, point.y)
          context.stroke()
          dirty.current = true
        }}
        onPointerUp={() => {
          if (!drawing.current) return
          drawing.current = false
          exportSignature()
        }}
        onPointerCancel={() => {
          drawing.current = false
        }}
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Sign with your finger or mouse.</p>
        <Button type="button" variant="outline" onClick={clear} disabled={disabled}>
          Clear
        </Button>
      </div>
    </div>
  )
}
