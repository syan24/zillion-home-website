'use client'

import {
  Button,
  useConfig,
  useDocumentInfo,
  useForm,
  useFormFields,
  useFormModified,
  useLocale,
  useUploadHandlers,
} from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import {
  isGalleryImageFile,
  MAX_GALLERY_UPLOAD,
  titleFromFilename,
} from '@/lib/projects/galleryTitle'

import {
  galleryCardFromMedia,
  galleryCardsFromDocs,
  mediaIDFromField,
  type GalleryCard,
} from './galleryCards'
import {
  buildGalleryBatch,
  keepFeaturedId,
  withinGalleryLimit,
  type BatchPhoto,
} from './pendingProjectPhotos'
import { projectPhotoCopy } from './projectPhotoCopy'
import {
  uploadGalleryFiles,
  uploadMediaFiles,
  type GalleryUploadError,
  type UploadedGalleryImage,
} from './uploadGalleryFiles'

type PendingPhoto = {
  file: File
  id: string
  previewURL: string
}

const SAVE_BUTTON = '#action-save, #action-save-draft, #publish-locale'

function fileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`
}

function saveButtonFrom(target: EventTarget | null): HTMLButtonElement | null {
  if (!(target instanceof Element)) return null
  const button = target.closest(SAVE_BUTTON)
  return button instanceof HTMLButtonElement ? button : null
}

function belongsToProjectForm(button: HTMLButtonElement, form: HTMLFormElement): boolean {
  if (form.contains(button)) return true
  if (button.id !== 'publish-locale') return false
  return document.querySelector('.drawer--is-open') == null
}

export default function ProjectPhotosField() {
  const { id, isInitializing } = useDocumentInfo()
  const { code: localeCode } = useLocale()
  const copy = projectPhotoCopy(localeCode)
  const modified = useFormModified()
  const modifiedRef = useRef(modified)
  const { dispatchFields, formRef, setModified } = useForm()
  const featuredValue = useFormFields(([fields]) => fields.featuredImage?.value)
  const featuredMediaID = mediaIDFromField(featuredValue)
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const { getUploadHandler } = useUploadHandlers()
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingRef = useRef<PendingPhoto[]>([])
  const featuredRef = useRef<string | null>(null)
  const cacheRef = useRef(new Map<string, { filename: string; mediaID: number }>())
  const armedRef = useRef(false)
  const busyRef = useRef(false)
  const bypassRef = useRef(false)
  const runRef = useRef<(button: HTMLButtonElement | null) => Promise<void>>(async () => undefined)

  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [created, setCreated] = useState<UploadedGalleryImage[]>([])
  const [errors, setErrors] = useState<GalleryUploadError[]>([])
  const [pending, setPending] = useState<PendingPhoto[]>([])
  const [featuredId, setFeaturedId] = useState<string | null>(null)
  const [extraCards, setExtraCards] = useState<GalleryCard[]>([])
  const [gallery, setGallery] = useState<{
    cards: GalleryCard[]
    id: number | string
    status: 'error' | 'ready'
  } | null>(null)
  const [legacyByMedia, setLegacyByMedia] = useState<{
    card: GalleryCard | null
    mediaID: number
  } | null>(null)

  const saved = id !== undefined && id !== null && `${id}` !== ''
  const cards = gallery && saved && gallery.id === id ? gallery.cards : []
  const loading = Boolean(saved && gallery?.id !== id)
  const loadError = Boolean(saved && gallery?.id === id && gallery.status === 'error')
  const featuredInGallery =
    featuredMediaID != null &&
    (cards.some((card) => card.mediaID === featuredMediaID) ||
      extraCards.some((card) => card.mediaID === featuredMediaID))
  const legacy =
    featuredMediaID != null && !featuredInGallery && legacyByMedia?.mediaID === featuredMediaID
      ? legacyByMedia.card
      : null

  useEffect(() => {
    modifiedRef.current = modified
  }, [modified])

  useEffect(() => {
    pendingRef.current = pending
    featuredRef.current = featuredId
  }, [featuredId, pending])

  useEffect(() => {
    return () => {
      for (const photo of pendingRef.current) URL.revokeObjectURL(photo.previewURL)
    }
  }, [])

  useEffect(() => {
    runRef.current = async (button) => {
      if (busyRef.current) return
      const photos = pendingRef.current
      busyRef.current = true
      setBusy(true)
      try {
        if (photos.length === 0) {
          if (armedRef.current) {
            flushSync(() => {
              dispatchFields({ path: 'featuredImage', type: 'UPDATE', value: null })
              dispatchFields({ path: 'galleryBatch', type: 'UPDATE', value: null })
            })
            armedRef.current = false
          }
        } else {
          const missing = photos.filter((photo) => !cacheRef.current.has(fileKey(photo.file)))
          if (missing.length > 0) {
            setErrors([])
            setProgress(copy.savingPhotos)
            const results = await uploadMediaFiles({
              apiRoute: api,
              files: missing.map((photo) => photo.file),
              onProgress: (current, total, filename) => {
                setProgress(copy.progress(current, total, filename))
              },
              uploadHandler: getUploadHandler({ collectionSlug: 'media' }),
            })
            const failures: GalleryUploadError[] = []
            results.forEach((result, index) => {
              const photo = missing[index]
              if (!photo) return
              if (result.mediaID) {
                cacheRef.current.set(fileKey(photo.file), {
                  filename: photo.file.name,
                  mediaID: result.mediaID,
                })
              } else if (result.message) {
                failures.push({ filename: result.filename, message: result.message })
              }
            })
            if (failures.length > 0) {
              setErrors(failures)
              setProgress('')
              return
            }
          }

          const uploaded: BatchPhoto[] = []
          for (const photo of photos) {
            const cached = cacheRef.current.get(fileKey(photo.file))
            if (!cached) {
              setErrors([{ filename: photo.file.name, message: copy.couldNot }])
              setProgress('')
              return
            }
            uploaded.push({ filename: cached.filename, id: photo.id, mediaID: cached.mediaID })
          }
          const batch = buildGalleryBatch(uploaded, featuredRef.current)
          if (!batch) return
          flushSync(() => {
            dispatchFields({ path: 'featuredImage', type: 'UPDATE', value: batch.featuredImage })
            dispatchFields({ path: 'galleryBatch', type: 'UPDATE', value: { items: batch.items } })
          })
          armedRef.current = true
          setProgress('')
        }

        bypassRef.current = true
        if (button) button.click()
        else formRef.current?.requestSubmit()
        bypassRef.current = false
      } catch {
        setErrors([{ filename: '', message: copy.couldNot }])
        setProgress('')
      } finally {
        busyRef.current = false
        setBusy(false)
      }
    }
  })

  useEffect(() => {
    if (isInitializing || saved) return
    const form = formRef.current
    if (!form) return

    const start = (button: HTMLButtonElement | null) => {
      if (bypassRef.current) return
      const needsBatch = pendingRef.current.length > 0 || armedRef.current
      if (!needsBatch) return
      if (busyRef.current) return
      void runRef.current(button)
    }

    const onClick = (event: MouseEvent) => {
      const button = saveButtonFrom(event.target)
      if (!button || button.disabled) return
      if (!belongsToProjectForm(button, form)) return
      if (bypassRef.current) return
      const needsBatch = pendingRef.current.length > 0 || armedRef.current
      if (!needsBatch) return
      event.preventDefault()
      event.stopPropagation()
      if (!busyRef.current) start(button)
    }

    const onSubmit = (event: SubmitEvent) => {
      if (bypassRef.current) return
      const needsBatch = pendingRef.current.length > 0 || armedRef.current
      if (!needsBatch) return
      event.preventDefault()
      event.stopPropagation()
      if (busyRef.current) return
      const submitter = event.submitter instanceof HTMLButtonElement ? event.submitter : null
      start(submitter)
    }

    document.addEventListener('click', onClick, true)
    form.addEventListener('submit', onSubmit, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      form.removeEventListener('submit', onSubmit, true)
    }
  }, [formRef, isInitializing, saved])

  useEffect(() => {
    if (!saved || id == null) return
    const controller = new AbortController()
    const params = new URLSearchParams({
      depth: '1',
      'fallback-locale': 'en',
      limit: '200',
      locale: localeCode,
      sort: 'displayOrder',
    })
    params.set('where[project][equals]', String(id))
    const url = formatAdminURL({ apiRoute: api, path: `/project-images?${params.toString()}` })
    void fetch(url, { credentials: 'include', signal: controller.signal })
      .then(async (response) => {
        if (controller.signal.aborted) return
        const json: unknown = await response.json().catch(() => null)
        if (!response.ok) {
          setGallery({ cards: [], id, status: 'error' })
          return
        }
        const docs = json && typeof json === 'object' && 'docs' in json ? json.docs : []
        setGallery({ cards: galleryCardsFromDocs(docs), id, status: 'ready' })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        if (error instanceof DOMException && error.name === 'AbortError') return
        setGallery({ cards: [], id, status: 'error' })
      })
    return () => controller.abort()
  }, [api, id, localeCode, saved])

  useEffect(() => {
    if (!saved || featuredMediaID == null || featuredInGallery) return
    const controller = new AbortController()
    const mediaID = featuredMediaID
    const url = formatAdminURL({ apiRoute: api, path: `/media/${mediaID}?depth=0` })
    void fetch(url, { credentials: 'include', signal: controller.signal })
      .then(async (response) => {
        if (controller.signal.aborted) return
        const json: unknown = await response.json().catch(() => null)
        setLegacyByMedia({
          card: response.ok ? galleryCardFromMedia(json) : null,
          mediaID,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        if (error instanceof DOMException && error.name === 'AbortError') return
      })
    return () => controller.abort()
  }, [api, featuredInGallery, featuredMediaID, saved])

  if (isInitializing) return null

  const rememberPending = (next: PendingPhoto[], nextFeatured: string | null) => {
    pendingRef.current = next
    featuredRef.current = nextFeatured
    setPending(next)
    setFeaturedId(nextFeatured)
  }

  const addPending = (list: FileList | File[]) => {
    const incoming = Array.from(list)
    if (incoming.length === 0 || busy) return
    const images = incoming.filter((file) => isGalleryImageFile(file))
    const skipped = incoming.filter((file) => !isGalleryImageFile(file))
    const nextErrors: GalleryUploadError[] = skipped.map((file) => ({
      filename: file.name,
      message: copy.onlyImages,
    }))

    if (images.length > 0 && !withinGalleryLimit(pending.length, images.length)) {
      setCreated([])
      setErrors([{ filename: '', message: copy.tooMany(MAX_GALLERY_UPLOAD) }])
      return
    }
    if (images.length === 0) {
      setCreated([])
      setErrors(nextErrors.length ? nextErrors : [{ filename: '', message: copy.chooseOne }])
      return
    }

    const added: PendingPhoto[] = images.map((file) => ({
      file,
      id: crypto.randomUUID(),
      previewURL: URL.createObjectURL(file),
    }))
    const next = [...pending, ...added]
    rememberPending(
      next,
      keepFeaturedId(
        next.map((photo) => photo.id),
        featuredId,
      ),
    )
    setErrors(nextErrors)
    setCreated([])
    setModified(true)
  }

  const removePending = (photoId: string) => {
    const photo = pending.find((item) => item.id === photoId)
    if (photo) URL.revokeObjectURL(photo.previewURL)
    cacheRef.current.delete(photo ? fileKey(photo.file) : '')
    const next = pending.filter((item) => item.id !== photoId)
    rememberPending(
      next,
      keepFeaturedId(
        next.map((item) => item.id),
        featuredId,
      ),
    )
  }

  const uploadSaved = async (list: FileList | File[]) => {
    if (!saved || busy || id == null) return
    const incoming = Array.from(list)
    if (incoming.length === 0) return

    const images = incoming.filter((file) => isGalleryImageFile(file))
    const skipped = incoming.filter((file) => !isGalleryImageFile(file))
    const nextErrors: GalleryUploadError[] = skipped.map((file) => ({
      filename: file.name,
      message: copy.onlyImages,
    }))

    if (images.length > MAX_GALLERY_UPLOAD) {
      setCreated([])
      setErrors([{ filename: '', message: copy.tooMany(MAX_GALLERY_UPLOAD) }])
      return
    }
    if (images.length === 0) {
      setCreated([])
      setErrors(nextErrors.length ? nextErrors : [{ filename: '', message: copy.chooseOne }])
      return
    }

    setBusy(true)
    setCreated([])
    setErrors([])
    setProgress(copy.progress(1, images.length, images[0]?.name ?? ''))

    try {
      const result = await uploadGalleryFiles({
        apiRoute: api,
        files: images,
        onProgress: (current, total, filename) => {
          setProgress(copy.progress(current, total, filename))
        },
        projectID: id,
        uploadHandler: getUploadHandler({ collectionSlug: 'media' }),
      })
      const allErrors = [...nextErrors, ...result.errors]
      setCreated(result.created)
      setErrors(allErrors)
      setProgress('')
      if (result.created.length > 0) {
        setExtraCards((current) => [
          ...current,
          ...result.created.map((image) => ({
            key: `new-${image.id}`,
            mediaID: image.mediaID,
            src: null,
            title: image.title || titleFromFilename(String(image.mediaID)),
          })),
        ])
      }
      if (result.created.length > 0 && allErrors.length === 0 && !modifiedRef.current) {
        window.location.reload()
      }
    } catch {
      setErrors([{ filename: '', message: copy.couldNot }])
      setProgress('')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const takeFiles = (list: FileList | File[]) => {
    if (saved) void uploadSaved(list)
    else addPending(list)
    if (inputRef.current) inputRef.current.value = ''
  }

  const selectSaved = (mediaID: number) => {
    if (mediaID === featuredMediaID) return
    dispatchFields({ path: 'featuredImage', type: 'UPDATE', value: mediaID })
    setModified(true)
  }

  const savedCards = [...cards]
  for (const extra of extraCards) {
    if (!savedCards.some((card) => card.mediaID === extra.mediaID)) savedCards.push(extra)
  }

  const shown = saved
    ? [
        ...(legacy && !savedCards.some((card) => card.mediaID === legacy.mediaID)
          ? [
              {
                featured: true,
                key: legacy.key,
                note: copy.legacyFeatured,
                onFeature: () => selectSaved(legacy.mediaID),
                onRemove: undefined,
                src: legacy.src,
                title: legacy.title,
              },
            ]
          : []),
        ...savedCards.map((card) => ({
          featured: card.mediaID === featuredMediaID,
          key: card.key,
          note: undefined,
          onFeature: () => selectSaved(card.mediaID),
          onRemove: undefined,
          src: card.src,
          title: card.title,
        })),
      ]
    : pending.map((photo) => ({
        featured: photo.id === featuredId,
        key: photo.id,
        note: undefined,
        onFeature: () => {
          featuredRef.current = photo.id
          setFeaturedId(photo.id)
        },
        onRemove: () => removePending(photo.id),
        src: photo.previewURL,
        title: titleFromFilename(photo.file.name),
      }))

  return (
    <div
      onDragLeave={() => setDragging(false)}
      onDragOver={(event) => {
        event.preventDefault()
        if (!busy) setDragging(true)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        if (!busy) takeFiles(event.dataTransfer.files)
      }}
      style={{
        background: dragging ? 'var(--theme-elevation-100)' : 'var(--theme-elevation-50)',
        border: '1px dashed var(--theme-elevation-300)',
        borderRadius: '4px',
        display: 'grid',
        gap: '12px',
        marginBottom: '8px',
        padding: '16px',
      }}
    >
      <div>
        <strong id="project-photos-label">{copy.title}</strong>
        <p style={{ margin: '6px 0 0' }}>{copy.intro}</p>
        <p style={{ margin: '6px 0 0' }}>{saved ? copy.editHint : copy.createHint}</p>
      </div>
      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Button
          buttonStyle="secondary"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          size="small"
          type="button"
        >
          {busy ? copy.chooseBusy : copy.choose}
        </Button>
        <span>{busy ? progress || copy.savingPhotos : copy.drop}</span>
        <input
          accept="image/*"
          aria-labelledby="project-photos-label"
          form="project-gallery-bulk-upload"
          hidden
          multiple
          onChange={(event) => {
            event.stopPropagation()
            if (event.target.files) takeFiles(event.target.files)
          }}
          ref={inputRef}
          type="file"
        />
      </div>
      {saved && modified ? <p style={{ margin: 0 }}>{copy.unsaved}</p> : null}
      {loading ? <p style={{ margin: 0 }}>{copy.loading}</p> : null}
      {loadError ? <p style={{ margin: 0 }}>{copy.loadFailed}</p> : null}
      {shown.length === 0 && saved && !loading ? <p style={{ margin: 0 }}>{copy.noneYet}</p> : null}
      {shown.length > 0 ? (
        <div
          aria-label={copy.title}
          role="group"
          style={{
            display: 'grid',
            gap: '10px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
          }}
        >
          {shown.map((photo) => (
            <div
              key={photo.key}
              style={{
                border: photo.featured
                  ? '2px solid var(--theme-elevation-800)'
                  : '1px solid var(--theme-elevation-150)',
                borderRadius: '4px',
                display: 'grid',
                gap: '8px',
                padding: '8px',
              }}
            >
              {photo.src ? (
                // Stored media URLs are not limited to the Next image remote patterns.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={photo.title}
                  src={photo.src}
                  style={{ aspectRatio: '4 / 3', objectFit: 'cover', width: '100%' }}
                />
              ) : (
                <div
                  style={{
                    alignItems: 'center',
                    aspectRatio: '4 / 3',
                    background: 'var(--theme-elevation-100)',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  {photo.title}
                </div>
              )}
              <span>{photo.title}</span>
              {photo.note ? <span>{photo.note}</span> : null}
              <Button
                buttonStyle={photo.featured ? 'primary' : 'secondary'}
                extraButtonProps={{ 'aria-pressed': photo.featured }}
                onClick={photo.onFeature}
                size="small"
                type="button"
              >
                {photo.featured ? copy.featured : copy.setFeatured}
              </Button>
              {photo.onRemove ? (
                <Button buttonStyle="secondary" onClick={photo.onRemove} size="small" type="button">
                  {copy.remove}
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      <div aria-live="polite">
        {created.length > 0 ? (
          <p style={{ margin: 0 }}>
            {copy.added(
              created.length,
              created
                .map((image) => image.title || titleFromFilename(String(image.mediaID)))
                .join(', '),
            )}
            {errors.length > 0 || modified ? copy.reloadListHint : null}
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
            <Button
              buttonStyle="secondary"
              onClick={() => window.location.reload()}
              size="small"
              type="button"
            >
              {modified ? copy.reloadDiscard : copy.reloadList}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
