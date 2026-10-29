'use client'

import { Button, useConfig, useDocumentInfo, useFormModified, useUploadHandlers } from '@payloadcms/ui'
import React, { useEffect, useRef, useState } from 'react'

import { isGalleryImageFile, MAX_GALLERY_UPLOAD, titleFromFilename } from '@/lib/projects/galleryTitle'

import { uploadGalleryFiles, type GalleryUploadError, type UploadedGalleryImage } from './uploadGalleryFiles'

export default function BulkGalleryUpload() {
  const { id, isInitializing } = useDocumentInfo()
  const modified = useFormModified()
  const modifiedRef = useRef(modified)
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const { getUploadHandler } = useUploadHandlers()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [created, setCreated] = useState<UploadedGalleryImage[]>([])
  const [errors, setErrors] = useState<GalleryUploadError[]>([])

  useEffect(() => {
    modifiedRef.current = modified
  }, [modified])

  if (isInitializing) return null

  const saved = id !== undefined && id !== null && `${id}` !== ''

  const upload = async (list: FileList | File[]) => {
    if (!saved || busy || id == null) return
    const incoming = Array.from(list)
    if (incoming.length === 0) return

    const images = incoming.filter((file) => isGalleryImageFile(file))
    const skipped = incoming.filter((file) => !isGalleryImageFile(file))
    const nextErrors: GalleryUploadError[] = skipped.map((file) => ({
      filename: file.name,
      message: 'Only image files can be added to the gallery.',
    }))

    if (images.length > MAX_GALLERY_UPLOAD) {
      setCreated([])
      setErrors([
        {
          filename: '',
          message: `Choose up to ${MAX_GALLERY_UPLOAD} photos at a time.`,
        },
      ])
      return
    }

    if (images.length === 0) {
      setCreated([])
      setErrors(nextErrors.length ? nextErrors : [{ filename: '', message: 'Choose at least one image.' }])
      return
    }

    setBusy(true)
    setCreated([])
    setErrors([])
    setProgress(`Uploading 1 of ${images.length}…`)

    try {
      const result = await uploadGalleryFiles({
        apiRoute: api,
        files: images,
        onProgress: (current, total, filename) => {
          setProgress(`Uploading ${current} of ${total}: ${filename}`)
        },
        projectID: id,
        uploadHandler: getUploadHandler({ collectionSlug: 'media' }),
      })
      const allErrors = [...nextErrors, ...result.errors]
      setCreated(result.created)
      setErrors(allErrors)
      setProgress('')

      if (result.created.length > 0 && allErrors.length === 0 && !modifiedRef.current) {
        window.location.reload()
      }
    } catch {
      setErrors([{ filename: '', message: 'Could not upload these photos. Try again.' }])
      setProgress('')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div
      onDragLeave={() => setDragging(false)}
      onDragOver={(event) => {
        event.preventDefault()
        if (saved && !busy) setDragging(true)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        if (saved && !busy) void upload(event.dataTransfer.files)
      }}
      style={{
        background: dragging ? 'var(--theme-elevation-100)' : 'var(--theme-elevation-50)',
        border: '1px dashed var(--theme-elevation-300)',
        borderRadius: '4px',
        display: 'grid',
        gap: '10px',
        marginBottom: '8px',
        padding: '16px',
      }}
    >
      <div>
        <strong>Add photos</strong>
        <p style={{ margin: '6px 0 0' }}>
          Choose or drop several images. Each file is added to this gallery. The English title comes from the
          file name. Show on the website and Allow download both start on.
        </p>
      </div>
      {saved ? (
        <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Button
            buttonStyle="secondary"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            size="small"
            type="button"
          >
            {busy ? 'Uploading…' : 'Choose photos'}
          </Button>
          <span>{busy ? progress : 'Or drop images here.'}</span>
          <input
            accept="image/*"
            form="project-gallery-bulk-upload"
            hidden
            multiple
            onChange={(event) => {
              event.stopPropagation()
              if (event.target.files) void upload(event.target.files)
            }}
            ref={inputRef}
            type="file"
          />
        </div>
      ) : (
        <p style={{ margin: 0 }}>Save the project first, then you can add several photos at once.</p>
      )}
      {modified && saved ? (
        <p style={{ margin: 0 }}>
          This project has unsaved edits. Photos still upload. Reload only after you save, or those edits are
          discarded.
        </p>
      ) : null}
      <div aria-live="polite">
        {created.length > 0 ? (
          <p style={{ margin: 0 }}>
            Added {created.length} {created.length === 1 ? 'photo' : 'photos'}:{' '}
            {created.map((image) => image.title || titleFromFilename(String(image.mediaID))).join(', ')}.
            {errors.length > 0 || modified ? ' Reload the page to show them in the gallery list.' : null}
          </p>
        ) : null}
        {errors.length > 0 ? (
          <ul style={{ margin: '8px 0 0', paddingLeft: '18px' }}>
            {errors.map((error, index) => (
              <li key={`${error.filename}-${index}`}>
                {error.filename ? `${error.filename}: ` : ''}
                {error.message}
              </li>
            ))}
          </ul>
        ) : null}
        {created.length > 0 && (errors.length > 0 || modified) ? (
          <div style={{ marginTop: '8px' }}>
            <Button buttonStyle="secondary" onClick={() => window.location.reload()} size="small" type="button">
              {modified ? 'Reload and discard unsaved edits' : 'Reload gallery list'}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
