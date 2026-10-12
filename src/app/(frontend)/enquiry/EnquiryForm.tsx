'use client'

import React, { useState, useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import type { Messages } from '@/i18n/messages'
import { submitEnquiry } from './actions'
import {
  enquiryDraftStorageKey,
  enquiryResultStorageKey,
  MAX_ENQUIRY_FILES,
} from '@/lib/enquiry/options'
import {
  enquiryFileIssue,
  incomingEnquiryPath,
  isEnquirySubmissionId,
} from '@/lib/enquiry/files'
import { validateEnquiryFields, type EnquiryField } from '@/lib/enquiry/validate'

type ProjectType = 'residential' | 'commercial' | 'joinery' | null
type EnquiryCopy = Messages['enquiry']

const projectTypeIcons = {
  residential: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  commercial: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  ),
  joinery: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
  ),
}

const scopeIds = ['full-joinery', 'kitchen', 'wardrobe', 'bathroom-vanity', 'tv-unit', 'other'] as const

const fieldClass =
  'w-full px-4 py-3 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'

function formatBytes(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function readStorage(key: string) {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    return undefined
  }
}

function clearStorage(key: string) {
  try {
    sessionStorage.removeItem(key)
  } catch {
    return undefined
  }
}

const resultListeners = new Set<() => void>()

function subscribeToEnquiryResult(listener: () => void) {
  resultListeners.add(listener)
  return () => {
    resultListeners.delete(listener)
  }
}

function readStoredReference() {
  const saved = readStorage(enquiryResultStorageKey)
  if (!saved) return ''
  try {
    const parsed = JSON.parse(saved) as { reference?: string }
    return parsed.reference || ''
  } catch {
    return ''
  }
}

function storeEnquiryResult(reference: string) {
  writeStorage(enquiryResultStorageKey, JSON.stringify({ reference }))
  clearStorage(enquiryDraftStorageKey)
  resultListeners.forEach((listener) => listener())
}

function clearEnquiryResult() {
  clearStorage(enquiryResultStorageKey)
  clearStorage(enquiryDraftStorageKey)
  resultListeners.forEach((listener) => listener())
}

function ensureSubmissionId() {
  const existing = readStorage(enquiryDraftStorageKey)
  if (existing && isEnquirySubmissionId(existing)) return existing
  const id = crypto.randomUUID()
  writeStorage(enquiryDraftStorageKey, id)
  return id
}

export function EnquiryForm({ copy, directUpload }: { copy: EnquiryCopy; directUpload: boolean }) {
  const [projectType, setProjectType] = useState<ProjectType>(null)
  const [selectedScope, setSelectedScope] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [fileMessage, setFileMessage] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<EnquiryField[]>([])
  const storedReference = useSyncExternalStore(subscribeToEnquiryResult, readStoredReference, () => '')

  const projectTypes = [
    { id: 'residential' as const, label: copy.residential },
    { id: 'commercial' as const, label: copy.commercial },
    { id: 'joinery' as const, label: copy.joinery },
  ]

  const toggleScope = (scopeId: string) => {
    setSelectedScope((prev) =>
      prev.includes(scopeId) ? prev.filter((item) => item !== scopeId) : [...prev, scopeId],
    )
  }

  const addFiles = (list: FileList | File[]) => {
    const next = [...files]
    let message: string | null = null
    for (const file of list) {
      if (next.length >= MAX_ENQUIRY_FILES) {
        message = copy.fileCount
        break
      }
      const issue = enquiryFileIssue(file.name, file.type, file.size)
      if (issue === 'size') {
        message = copy.fileSize
        continue
      }
      if (issue) {
        message = copy.fileType
        continue
      }
      next.push(file)
    }
    setFiles(next)
    setFileMessage(message)
  }

  const showErrors = (fields: EnquiryField[]) => {
    setFieldErrors(fields)
    if (fields.includes('files')) setFileMessage(copy.errors.files)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    const submissionId = ensureSubmissionId()

    const formData = new FormData(event.currentTarget)
    formData.set('clientSubmissionId', submissionId)
    formData.set('projectType', projectType ?? '')
    formData.delete('scope')
    for (const scopeId of selectedScope) formData.append('scope', scopeId)
    formData.delete('files')
    formData.delete('blobs')

    const validated = validateEnquiryFields({
      clientSubmissionId: submissionId,
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address'),
      projectType: formData.get('projectType'),
      scope: formData.getAll('scope'),
      notes: formData.get('notes'),
      budget: formData.get('budget'),
      timeline: formData.get('timeline'),
    })
    if (!validated.ok) {
      showErrors(validated.fields)
      return
    }

    const fileIssue = files.find((file) => enquiryFileIssue(file.name, file.type, file.size))
    if (files.length > MAX_ENQUIRY_FILES || fileIssue) {
      showErrors(['files'])
      return
    }

    setIsSubmitting(true)
    setFieldErrors([])
    setFileMessage(null)
    setProgress(null)

    try {
      if (directUpload && files.length > 0) {
        const { upload } = await import('@vercel/blob/client')
        const blobs = []
        for (let index = 0; index < files.length; index += 1) {
          const file = files[index]
          if (!file) continue
          setProgress(
            copy.uploading
              .replace('{current}', String(index + 1))
              .replace('{total}', String(files.length)),
          )
          const pathname = incomingEnquiryPath(file.name)
          if (!pathname) {
            showErrors(['files'])
            return
          }
          const blob = await upload(pathname, file, {
            access: 'public',
            contentType: file.type || 'application/octet-stream',
            handleUploadUrl: '/enquiry/upload',
            multipart: file.size > 4 * 1024 * 1024,
          })
          blobs.push({
            url: blob.url,
            pathname: blob.pathname,
            originalName: file.name,
            contentType: blob.contentType || file.type || 'application/octet-stream',
            size: file.size,
          })
        }
        formData.set('blobs', JSON.stringify(blobs))
      } else {
        for (const file of files) formData.append('files', file)
      }

      const result = await submitEnquiry(formData)
      if (!result.ok) {
        showErrors(result.fields)
        return
      }

      storeEnquiryResult(result.submissionReference)
    } catch {
      showErrors(['generic'])
    } finally {
      setIsSubmitting(false)
      setProgress(null)
    }
  }

  const startAnother = () => {
    clearEnquiryResult()
    setProjectType(null)
    setSelectedScope([])
    setFiles([])
    setFileMessage(null)
    setFieldErrors([])
  }

  if (storedReference) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl mb-4">{copy.thanksTitle}</h3>
        <p className="text-foreground-soft mb-2">{copy.thanksBody}</p>
        <p className="text-sm text-muted-foreground">{copy.thanksTiming}</p>
        {storedReference ? (
          <p className="mt-6 text-sm">
            {copy.referenceLabel}{' '}
            <span className="font-medium tracking-wide">{storedReference}</span>
          </p>
        ) : null}
        <Button type="button" variant="outline" className="mt-8" onClick={startAnother}>
          {copy.submitAnother}
        </Button>
      </div>
    )
  }

  const topErrors = fieldErrors.filter((code) => code === 'rate' || code === 'generic')

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {topErrors.length > 0 ? (
        <div role="alert" className="text-sm text-destructive space-y-1">
          {topErrors.map((code) => (
            <p key={code}>{copy.errors[code]}</p>
          ))}
        </div>
      ) : null}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          {copy.nameLabel} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          placeholder={copy.namePlaceholder}
          aria-invalid={fieldErrors.includes('name')}
          className={fieldClass}
        />
        {fieldErrors.includes('name') ? <p className="text-sm text-destructive mt-2">{copy.errors.name}</p> : null}
      </div>

      <div>
        <p className="text-sm font-medium mb-3">{copy.contactLegend} *</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              placeholder={copy.phonePlaceholder}
              aria-label={copy.phonePlaceholder}
              aria-invalid={fieldErrors.includes('phone')}
              className={fieldClass}
            />
            {fieldErrors.includes('phone') ? (
              <p className="text-sm text-destructive mt-2">{copy.errors.phone}</p>
            ) : null}
          </div>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder={copy.emailPlaceholder}
              aria-label={copy.emailPlaceholder}
              aria-invalid={fieldErrors.includes('email')}
              className={fieldClass}
            />
            {fieldErrors.includes('email') ? (
              <p className="text-sm text-destructive mt-2">{copy.errors.email}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          {copy.addressLabel} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          autoComplete="street-address"
          placeholder={copy.addressPlaceholder}
          aria-invalid={fieldErrors.includes('address')}
          className={fieldClass}
        />
        {fieldErrors.includes('address') ? (
          <p className="text-sm text-destructive mt-2">{copy.errors.address}</p>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-medium mb-3">
          {copy.typeLabel} <span className="text-destructive">*</span>
        </p>
        <input type="hidden" name="projectType" value={projectType ?? ''} />
        <div className="grid grid-cols-3 gap-3">
          {projectTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              aria-pressed={projectType === type.id}
              onClick={() => setProjectType(type.id)}
              className={cn(
                'p-4 border rounded text-center transition-all',
                projectType === type.id
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-input hover:border-foreground/30',
              )}
            >
              <div className="flex justify-center mb-2 text-foreground-soft">{projectTypeIcons[type.id]}</div>
              <span className="font-medium text-sm block">{type.label}</span>
            </button>
          ))}
        </div>
        {fieldErrors.includes('projectType') ? (
          <p className="text-sm text-destructive mt-2">{copy.errors.projectType}</p>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-medium mb-3">{copy.scopeLabel}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {scopeIds.map((scopeId) => (
            <label
              key={scopeId}
              className={cn(
                'flex items-center gap-3 px-4 py-3 border rounded cursor-pointer transition-all',
                selectedScope.includes(scopeId)
                  ? 'border-primary bg-primary/5'
                  : 'border-input hover:border-foreground/30',
              )}
            >
              <input
                type="checkbox"
                name="scope"
                value={scopeId}
                checked={selectedScope.includes(scopeId)}
                onChange={() => toggleScope(scopeId)}
                className="sr-only"
              />
              <div
                className={cn(
                  'w-4 h-4 border rounded flex items-center justify-center flex-shrink-0',
                  selectedScope.includes(scopeId) ? 'bg-primary border-primary' : 'border-input',
                )}
              >
                {selectedScope.includes(scopeId) && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm">{copy.scopes[scopeId]}</span>
            </label>
          ))}
        </div>
        {fieldErrors.includes('scope') ? <p className="text-sm text-destructive mt-2">{copy.errors.scope}</p> : null}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-1">
            {copy.budgetLabel}
          </label>
          <select
            id="budget"
            name="budget"
            aria-invalid={fieldErrors.includes('budget')}
            className={fieldClass}
          >
            {copy.budgetOptions.map((range) => (
              <option key={range.value || 'empty'} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          {fieldErrors.includes('budget') ? (
            <p className="text-sm text-destructive mt-2">{copy.errors.budget}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium mb-1">
            {copy.timelineLabel}
          </label>
          <select
            id="timeline"
            name="timeline"
            aria-invalid={fieldErrors.includes('timeline')}
            className={fieldClass}
          >
            {copy.timelineOptions.map((option) => (
              <option key={option.value || 'empty'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.includes('timeline') ? (
            <p className="text-sm text-destructive mt-2">{copy.errors.timeline}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          {copy.descriptionLabel}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder={copy.descriptionPlaceholder}
          aria-invalid={fieldErrors.includes('notes')}
          className={`${fieldClass} resize-none`}
        />
        {fieldErrors.includes('notes') ? <p className="text-sm text-destructive mt-2">{copy.errors.notes}</p> : null}
      </div>

      <div>
        <p className="block text-sm font-medium mb-1">{copy.uploadLabel}</p>
        <div
          onDragOver={(event) => {
            event.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragOver(false)
            addFiles(event.dataTransfer.files)
          }}
          className={cn(
            'border-2 border-dashed border-input rounded-lg p-8 text-center',
            dragOver && 'border-primary bg-primary/5',
          )}
        >
          <label className="block cursor-pointer">
            <input
              type="file"
              className="sr-only"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.dwg,application/pdf,image/png,image/jpeg"
              onChange={(event) => {
                if (event.target.files) addFiles(event.target.files)
                event.target.value = ''
              }}
            />
            <p className="text-sm text-muted-foreground">{copy.uploadHint}</p>
            <p className="text-xs text-muted-foreground mt-1">{copy.uploadTypes}</p>
          </label>
        </div>
        {files.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between gap-3 text-sm border border-input rounded px-3 py-2"
              >
                <span className="min-w-0 truncate">
                  {file.name} <span className="text-muted-foreground">({formatBytes(file.size)})</span>
                </span>
                <button
                  type="button"
                  className="text-sm text-foreground-soft underline-offset-2 hover:underline"
                  onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                >
                  {copy.removeFile}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {fileMessage ? <p className="text-sm text-destructive mt-2">{fileMessage}</p> : null}
        {progress ? <p className="text-sm text-muted-foreground mt-2">{progress}</p> : null}
      </div>

      <div className="pt-4">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? progress || copy.submitting : copy.submit}
        </Button>
        <p className="text-xs text-muted-foreground mt-4 text-center">{copy.consent}</p>
      </div>
    </form>
  )
}
