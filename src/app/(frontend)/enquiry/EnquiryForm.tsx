'use client'

import React, { useState, useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import type { Messages } from '@/i18n/messages'
import { countryOptions } from '@/blocks/Form/Country/options'
import { stateOptions } from '@/blocks/Form/State/options'
import { submitEnquiry } from './actions'
import {
  enquiryDraftStorageKey,
  enquiryResultStorageKey,
  MAX_ENQUIRY_FILES,
} from '@/lib/enquiry/options'
import { enquiryFileIssue, incomingEnquiryPath, isEnquirySubmissionId } from '@/lib/enquiry/files'
import {
  mapEnquiryAnswers,
  type EnquiryIssue,
  type PublicEnquiryField,
} from '@/lib/enquiry/validate'
import { OptionIcon } from './OptionIcon'

type EnquiryCopy = Messages['enquiry']

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

function groupFields(fields: PublicEnquiryField[]): PublicEnquiryField[][] {
  const rows: PublicEnquiryField[][] = []
  let pair: PublicEnquiryField[] = []
  const flush = () => {
    if (pair.length === 0) return
    rows.push(pair)
    pair = []
  }
  for (const field of fields) {
    const narrow =
      (field.width ?? 100) <= 50 &&
      field.blockType !== 'upload' &&
      field.blockType !== 'checkboxGroup' &&
      field.blockType !== 'message' &&
      field.blockType !== 'textarea'
    if (narrow) {
      pair.push(field)
      if (pair.length === 2) flush()
    } else {
      flush()
      rows.push([field])
    }
  }
  flush()
  return rows
}

function initialValues(fields: PublicEnquiryField[]) {
  const values: Record<string, string | boolean | string[]> = {}
  for (const field of fields) {
    if (!field.name || field.blockType === 'message' || field.blockType === 'upload') continue
    if (field.blockType === 'checkbox') values[field.name] = false
    else if (field.blockType === 'checkboxGroup') values[field.name] = []
    else values[field.name] = ''
  }
  return values
}

export function EnquiryForm({
  copy,
  form,
  directUpload,
}: {
  copy: EnquiryCopy
  form: { submitButtonLabel: string; fields: PublicEnquiryField[] } | null
  directUpload: boolean
}) {
  const fields = form?.fields ?? []
  const [values, setValues] = useState(() => initialValues(fields))
  const [files, setFiles] = useState<Record<string, File[]>>({})
  const [fileMessage, setFileMessage] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [issues, setIssues] = useState<EnquiryIssue[]>([])
  const storedReference = useSyncExternalStore(subscribeToEnquiryResult, readStoredReference, () => '')

  const setScalar = (name: string, value: string | boolean | string[]) => {
    setValues((current) => ({ ...current, [name]: value }))
  }

  const addFiles = (name: string, list: FileList | File[], field: PublicEnquiryField) => {
    const next = [...(files[name] || [])]
    let message: string | null = null
    const limit =
      typeof field.maxFileSize === 'number' && field.maxFileSize > 0 ? field.maxFileSize : undefined
    for (const file of list) {
      const total = Object.values({ ...files, [name]: next }).reduce((sum, group) => sum + group.length, 0)
      if (total >= MAX_ENQUIRY_FILES) {
        message = copy.fileCount
        break
      }
      if (field.multiple === false && next.length >= 1) {
        message = copy.errors.files
        break
      }
      const issue = enquiryFileIssue(file.name, file.type, file.size)
      if (issue === 'size' || (limit && file.size > limit)) {
        message = copy.fileSize
        continue
      }
      if (issue || !clientMimeAllowed(file, field.mimeTypes)) {
        message = copy.fileType
        continue
      }
      next.push(file)
    }
    setFiles((current) => ({ ...current, [name]: next }))
    setFileMessage(message)
  }

  const issueFor = (name: string) => issues.find((issue) => issue.field === name)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting || !form) return
    const submissionId = ensureSubmissionId()
    const selected = Object.entries(files).flatMap(([field, group]) =>
      group.map((file) => ({ field, name: file.name, type: file.type, size: file.size })),
    )
    const validated = mapEnquiryAnswers({
      fields,
      values,
      files: selected,
      clientSubmissionId: submissionId,
    })
    if (!validated.ok) {
      setIssues(validated.issues)
      if (validated.issues.some((issue) => issue.code === 'files')) setFileMessage(copy.errors.files)
      return
    }

    setIsSubmitting(true)
    setIssues([])
    setFileMessage(null)
    setProgress(null)

    const formData = new FormData()
    formData.set('clientSubmissionId', submissionId)
    for (const [key, value] of Object.entries(values)) {
      if (Array.isArray(value)) {
        for (const item of value) formData.append(key, item)
      } else if (typeof value === 'boolean') {
        formData.set(key, value ? 'true' : '')
      } else {
        formData.set(key, value)
      }
    }

    try {
      const chosen = Object.entries(files).flatMap(([field, group]) => group.map((file) => ({ field, file })))
      if (directUpload && chosen.length > 0) {
        const { upload } = await import('@vercel/blob/client')
        const blobs = []
        for (let index = 0; index < chosen.length; index += 1) {
          const item = chosen[index]
          if (!item) continue
          setProgress(
            copy.uploading.replace('{current}', String(index + 1)).replace('{total}', String(chosen.length)),
          )
          const pathname = incomingEnquiryPath(item.file.name)
          if (!pathname) {
            setIssues([{ field: item.field, code: 'files' }])
            setFileMessage(copy.errors.files)
            return
          }
          const blob = await upload(pathname, item.file, {
            access: 'public',
            contentType: item.file.type || 'application/octet-stream',
            handleUploadUrl: '/enquiry/upload',
            multipart: item.file.size > 4 * 1024 * 1024,
          })
          blobs.push({
            field: item.field,
            url: blob.url,
            pathname: blob.pathname,
            originalName: item.file.name,
            contentType: blob.contentType || item.file.type || 'application/octet-stream',
            size: item.file.size,
          })
        }
        formData.set('blobs', JSON.stringify(blobs))
      } else {
        for (const item of chosen) formData.append(item.field, item.file)
      }

      const result = await submitEnquiry(formData)
      if (!result.ok) {
        setIssues(result.issues)
        if (result.issues.some((issue) => issue.code === 'files')) setFileMessage(copy.errors.files)
        return
      }
      storeEnquiryResult(result.submissionReference)
    } catch {
      setIssues([{ field: 'form', code: 'generic' }])
    } finally {
      setIsSubmitting(false)
      setProgress(null)
    }
  }

  const startAnother = () => {
    clearEnquiryResult()
    setValues(initialValues(fields))
    setFiles({})
    setFileMessage(null)
    setIssues([])
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
        <p className="mt-6 text-sm">
          {copy.referenceLabel} <span className="font-medium tracking-wide">{storedReference}</span>
        </p>
        <Button type="button" variant="outline" className="mt-8" onClick={startAnother}>
          {copy.submitAnother}
        </Button>
      </div>
    )
  }

  if (!form) {
    return <p className="text-foreground-soft">{copy.formUnavailable}</p>
  }

  const formIssues = issues.filter((issue) => issue.field === 'form')

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {formIssues.length > 0 ? (
        <div role="alert" className="text-sm text-destructive space-y-1">
          {formIssues.map((issue) => (
            <p key={`${issue.field}-${issue.code}`}>{issueText(copy, fields, issue)}</p>
          ))}
        </div>
      ) : null}

      {groupFields(fields).map((row) => (
        <div
          key={row.map((field) => field.name || field.blockType).join('-')}
          className={row.length > 1 ? 'grid sm:grid-cols-2 gap-4' : undefined}
        >
          {row.map((field) => (
            <FieldControl
              key={`${field.blockType}-${field.name || 'message'}`}
              field={field}
              copy={copy}
              value={field.name ? values[field.name] : undefined}
              files={field.name ? files[field.name] || [] : []}
              issue={field.name ? issueFor(field.name) : undefined}
              fileMessage={field.blockType === 'upload' ? fileMessage : null}
              progress={field.blockType === 'upload' ? progress : null}
              dragOver={dragOver === field.name}
              onValue={(value) => field.name && setScalar(field.name, value)}
              onFiles={(list) => field.name && addFiles(field.name, list, field)}
              onRemoveFile={(index) =>
                field.name &&
                setFiles((current) => ({
                  ...current,
                  [field.name || '']: (current[field.name || ''] || []).filter((_, itemIndex) => itemIndex !== index),
                }))
              }
              onDragOver={(active) => setDragOver(active && field.name ? field.name : null)}
            />
          ))}
        </div>
      ))}

      <div className="pt-4">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? progress || copy.submitting : form.submitButtonLabel || copy.submit}
        </Button>
        <p className="text-xs text-muted-foreground mt-4 text-center">{copy.consent}</p>
      </div>
    </form>
  )
}

function FieldControl({
  field,
  copy,
  value,
  files,
  issue,
  fileMessage,
  progress,
  dragOver,
  onValue,
  onFiles,
  onRemoveFile,
  onDragOver,
}: {
  field: PublicEnquiryField
  copy: EnquiryCopy
  value: string | boolean | string[] | undefined
  files: File[]
  issue?: EnquiryIssue
  fileMessage: string | null
  progress: string | null
  dragOver: boolean
  onValue: (value: string | boolean | string[]) => void
  onFiles: (list: FileList | File[]) => void
  onRemoveFile: (index: number) => void
  onDragOver: (active: boolean) => void
}) {
  const name = field.name || ''
  const label = field.label || name
  const error = issue ? issueText(copy, [field], issue) : null

  if (field.blockType === 'message') {
    if (!field.message || typeof field.message !== 'object') return null
    return <RichText data={field.message as never} enableGutter={false} />
  }

  if (field.blockType === 'checkboxGroup') {
    const selected = Array.isArray(value) ? value : []
    return (
      <div>
        <p className="text-sm font-medium mb-3">
          {label}
          {field.required ? <span className="text-destructive"> *</span> : null}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(field.options || []).map((option) => {
            const checked = selected.includes(option.value)
            return (
              <label
                key={option.value}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 border rounded cursor-pointer transition-all',
                  checked ? 'border-primary bg-primary/5' : 'border-input hover:border-foreground/30',
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() =>
                    onValue(checked ? selected.filter((item) => item !== option.value) : [...selected, option.value])
                  }
                />
                <OptionIcon icon={option.icon} iconUrl={option.iconUrl} inline />
                <span className="text-sm">{option.label}</span>
              </label>
            )
          })}
        </div>
        {error ? <p className="text-sm text-destructive mt-2">{error}</p> : null}
      </div>
    )
  }

  if (field.blockType === 'radio' || (field.blockType === 'select' && name === 'projectType')) {
    const options = field.options || []
    if (options.length > 0 && options.length <= 6) {
      return (
        <div>
          <p className="text-sm font-medium mb-3">
            {label}
            {field.required ? <span className="text-destructive"> *</span> : null}
          </p>
          <div className={cn('grid gap-3', options.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={value === option.value}
                onClick={() => onValue(option.value)}
                className={cn(
                  'p-4 border rounded text-center transition-all',
                  value === option.value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-input hover:border-foreground/30',
                )}
              >
                <OptionIcon icon={option.icon} iconUrl={option.iconUrl} />
                <span className="font-medium text-sm block">{option.label}</span>
              </button>
            ))}
          </div>
          {error ? <p className="text-sm text-destructive mt-2">{error}</p> : null}
        </div>
      )
    }
  }

  if (field.blockType === 'select' || field.blockType === 'country' || field.blockType === 'state' || field.blockType === 'radio') {
    const options =
      field.blockType === 'country'
        ? countryOptions
        : field.blockType === 'state'
          ? stateOptions
          : field.options || []
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium mb-1">
          {label}
          {field.required ? <span className="text-destructive"> *</span> : null}
        </label>
        <select
          id={name}
          value={typeof value === 'string' ? value : ''}
          aria-invalid={Boolean(issue)}
          onChange={(event) => onValue(event.target.value)}
          className={fieldClass}
        >
          <option value="">{field.placeholder || label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? <p className="text-sm text-destructive mt-2">{error}</p> : null}
      </div>
    )
  }

  if (field.blockType === 'checkbox') {
    return (
      <div>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(event) => onValue(event.target.checked)}
          />
          <span>
            {label}
            {field.required ? <span className="text-destructive"> *</span> : null}
          </span>
        </label>
        {error ? <p className="text-sm text-destructive mt-2">{error}</p> : null}
      </div>
    )
  }

  if (field.blockType === 'upload') {
    return (
      <div>
        <p className="block text-sm font-medium mb-1">
          {label}
          {field.required ? <span className="text-destructive"> *</span> : null}
        </p>
        <div
          onDragOver={(event) => {
            event.preventDefault()
            onDragOver(true)
          }}
          onDragLeave={() => onDragOver(false)}
          onDrop={(event) => {
            event.preventDefault()
            onDragOver(false)
            onFiles(event.dataTransfer.files)
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
              multiple={field.multiple !== false}
              accept=".pdf,.png,.jpg,.jpeg,.dwg,application/pdf,image/png,image/jpeg"
              onChange={(event) => {
                if (event.target.files) onFiles(event.target.files)
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
                  onClick={() => onRemoveFile(index)}
                >
                  {copy.removeFile}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {fileMessage || error ? <p className="text-sm text-destructive mt-2">{fileMessage || error}</p> : null}
        {progress ? <p className="text-sm text-muted-foreground mt-2">{progress}</p> : null}
      </div>
    )
  }

  const multiline = field.blockType === 'textarea'
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
        {field.required ? <span className="text-destructive"> *</span> : null}
      </label>
      {multiline ? (
        <textarea
          id={name}
          rows={4}
          value={typeof value === 'string' ? value : ''}
          aria-invalid={Boolean(issue)}
          onChange={(event) => onValue(event.target.value)}
          className={`${fieldClass} resize-none`}
        />
      ) : (
        <input
          id={name}
          type={field.blockType === 'date' ? 'date' : 'text'}
          inputMode={field.blockType === 'email' ? 'email' : field.blockType === 'number' ? 'decimal' : undefined}
          autoComplete={autocompleteFor(name)}
          value={typeof value === 'string' ? value : ''}
          aria-invalid={Boolean(issue)}
          onChange={(event) => onValue(event.target.value)}
          className={fieldClass}
        />
      )}
      {error ? <p className="text-sm text-destructive mt-2">{error}</p> : null}
    </div>
  )
}

function autocompleteFor(name: string) {
  if (name === 'name') return 'name'
  if (name === 'phone') return 'tel'
  if (name === 'email') return 'email'
  if (name === 'address') return 'street-address'
  return undefined
}

function issueText(copy: EnquiryCopy, fields: PublicEnquiryField[], issue: EnquiryIssue): string {
  if (issue.code === 'files') return copy.errors.files
  if (issue.code === 'rate') return copy.errors.rate
  if (issue.code === 'generic') return copy.errors.generic
  if (issue.code === 'email') return copy.errors.email
  if (issue.code === 'phone') return copy.errors.phone
  const field = fields.find((item) => item.name === issue.field)
  const label = field?.label || issue.field
  if (issue.code === 'invalid' || issue.code === 'length') return copy.invalidField.replace('{label}', label)
  if (
    issue.code === 'required' &&
    field &&
    (field.blockType === 'radio' || field.blockType === 'select' || field.blockType === 'checkboxGroup')
  ) {
    return copy.chooseField.replace('{label}', label)
  }
  return copy.requiredField.replace('{label}', label)
}

function clientMimeAllowed(file: File, mimeTypes: string[] | undefined) {
  if (!mimeTypes || mimeTypes.length === 0) return true
  const mime = file.type.toLowerCase()
  const extension = file.name.toLowerCase().split('.').pop() || ''
  return mimeTypes.some((pattern) => {
    const expected = pattern.toLowerCase()
    if (expected.endsWith('/*')) return mime.startsWith(expected.slice(0, -1))
    if (mime && expected === mime) return true
    if (extension === 'dwg' && /dwg|octet-stream|acad/.test(expected)) return true
    if ((extension === 'jpg' || extension === 'jpeg') && expected === 'image/jpeg') return true
    if (extension === 'png' && expected === 'image/png') return true
    if (extension === 'pdf' && expected === 'application/pdf') return true
    return false
  })
}
