'use client'

import { Button } from '@/components/ui/button'
import { acknowledgementUnlocked, scrolledToEnd } from '@/lib/swms/siteSafety'
import React, { useEffect, useId, useRef, useState } from 'react'

type PreviewPage = {
  id: string
  label: string
  height: number
}

export function SwmsReviewDialog({
  title,
  fileUrl,
  mode,
  previewPages,
  onClose,
  onConfirm,
}: {
  title: string
  fileUrl?: string
  mode: 'confirm' | 'browse'
  previewPages?: PreviewPage[]
  onClose: () => void
  onConfirm?: () => void
}) {
  const titleId = useId()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [reachedEnd, setReachedEnd] = useState(false)
  const [checked, setChecked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || previewPages) return
    let cancelled = false

    const render = async () => {
      if (!fileUrl) {
        setError('The SWMS file could not be opened. 无法打开 SWMS 文件。')
        return
      }
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
        ).toString()
        const task = pdfjs.getDocument({ url: fileUrl })
        const pdf = await task.promise
        if (cancelled) {
          await pdf.destroy()
          return
        }
        scroller.replaceChildren()
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber)
          if (cancelled) break
          const viewport = page.getViewport({ scale: 1.4 })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          if (!context) continue
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.width = '100%'
          canvas.style.height = 'auto'
          canvas.dataset.pdfPage = String(pageNumber)
          await page.render({ canvasContext: context, viewport }).promise
          scroller.appendChild(canvas)
        }
        await pdf.destroy()
        requestAnimationFrame(() => {
          if (cancelled || !scrollerRef.current) return
          markIfEnd(scrollerRef.current, setReachedEnd)
        })
      } catch {
        if (!cancelled) setError('The SWMS file could not be opened. 无法打开 SWMS 文件。')
      }
    }

    void render()
    return () => {
      cancelled = true
    }
  }, [fileUrl, previewPages])

  const checkboxVisible = mode === 'confirm' && acknowledgementUnlocked(reachedEnd)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-lg"
      >
        <div className="border-b border-border px-4 py-3">
          <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">SWMS</p>
          <h2 id={titleId} ref={headingRef} tabIndex={-1} className="mt-1 text-lg font-medium outline-none">
            {title}
          </h2>
        </div>
        <div
          ref={scrollerRef}
          data-testid="swms-pdf-scroll"
          className="min-h-48 flex-1 space-y-3 overflow-y-auto bg-background-warm p-3"
          onScroll={(event) => markIfEnd(event.currentTarget, setReachedEnd)}
        >
          {previewPages?.map((page) => (
            <div
              key={page.id}
              data-pdf-page={page.id}
              className="flex items-end rounded-md border border-border bg-white p-4 text-sm"
              style={{ minHeight: page.height }}
            >
              {page.label}
            </div>
          ))}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <div className="space-y-3 border-t border-border px-4 py-4">
          {mode === 'confirm' && !checkboxVisible ? (
            <p className="text-sm text-muted-foreground">
              Scroll to the bottom of the last page. 请滚动到最后一页底部。
            </p>
          ) : null}
          {checkboxVisible ? (
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5"
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
              />
              <span>
                I&apos;ve reviewed and understood the relevant SWMS.
                <span className="mt-1 block text-muted-foreground">我已阅读并理解相关 SWMS。</span>
              </span>
            </label>
          ) : null}
          <div className={mode === 'confirm' ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1'}>
            <Button type="button" variant="outline" className="h-12" onClick={onClose}>
              {mode === 'browse' ? 'Close 关闭' : 'Cancel 取消'}
            </Button>
            {mode === 'confirm' ? (
              <Button
                type="button"
                variant="enquiry"
                className="h-12"
                disabled={!checkboxVisible || !checked}
                onClick={onConfirm}
              >
                Confirm & Close 确认并关闭
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function markIfEnd(element: HTMLElement, setReachedEnd: (value: boolean) => void) {
  if (
    scrolledToEnd({
      scrollTop: element.scrollTop,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    })
  ) {
    setReachedEnd(true)
  }
}
