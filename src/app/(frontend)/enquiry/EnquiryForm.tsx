'use client'

import React, { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
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

const labelClass = 'text-[10px] uppercase tracking-[0.32em] text-muted-foreground'
const fieldClass =
  'w-full border-0 border-b border-[#c9c0b0] bg-transparent px-0 py-2.5 text-[17px] text-foreground rounded-none shadow-none placeholder:text-[#a39b8f] focus:border-accent-tan focus:outline-none focus:ring-0'

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

let enquirySnapshot = { raw: '', reference: '', name: '' }

function readEnquirySnapshot() {
  const raw = readStorage(enquiryResultStorageKey) || ''
  if (raw === enquirySnapshot.raw) return enquirySnapshot
  let reference = ''
  let name = ''
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { reference?: string; name?: string }
      reference = parsed.reference || ''
      name = parsed.name || ''
    } catch {
      reference = ''
    }
  }
  enquirySnapshot = { raw, reference, name }
  return enquirySnapshot
}

function readStoredReference() {
  return readEnquirySnapshot().reference
}

function readStoredName() {
  return readEnquirySnapshot().name
}

function storeEnquiryResult(reference: string, name = '') {
  writeStorage(enquiryResultStorageKey, JSON.stringify({ reference, name }))
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
  const storedName = useSyncExternalStore(subscribeToEnquiryResult, readStoredName, () => '')

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
      const given =
        typeof values.name === 'string' ? values.name.trim().split(/\s+/)[0] || '' : ''
      storeEnquiryResult(result.submissionReference, given)
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
      <div className="flex flex-col gap-7 pt-[8vh]">
        {storedName ? (
          <p className="font-serif text-[22px] italic text-accent-tan">
            {copy.thanksName.replace('{name}', storedName)}
          </p>
        ) : null}
        <h2 className="font-serif text-[clamp(40px,4.6vw,68px)] font-light leading-none">{copy.thanksTitle}</h2>
        <p className="max-w-lg text-base leading-8 text-foreground-soft">{copy.thanksBody}</p>
        <p className="text-sm text-muted-foreground">{copy.thanksTiming}</p>
        <p className="text-sm">
          {copy.referenceLabel} <span className="tracking-wide">{storedReference}</span>
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Button asChild className="h-auto rounded-none px-9 py-5 text-[11px] uppercase tracking-[0.3em]">
            <Link href="/projects">{copy.viewProjects}</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-auto rounded-none border-foreground bg-transparent px-9 py-5 text-[11px] uppercase tracking-[0.3em] shadow-none"
            onClick={startAnother}
          >
            {copy.submitAnother}
          </Button>
        </div>
      </div>
    )
  }

  if (!form) {
    return <p className="text-foreground-soft">{copy.formUnavailable}</p>
  }

  const formIssues = issues.filter((issue) => issue.field === 'form')

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      {formIssues.length > 0 ? (
        <div role="alert" className="text-sm text-error space-y-1">
          {formIssues.map((issue) => (
            <p key={`${issue.field}-${issue.code}`}>{issueText(copy, fields, issue)}</p>
          ))}
        </div>
      ) : null}

      {groupFields(fields).map((row) => (
        <div
          key={row.map((field) => field.name || field.blockType).join('-')}
          className={row.length > 1 ? 'grid gap-9 sm:grid-cols-2 sm:gap-x-10' : undefined}
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

      <div className="flex flex-col gap-4 border-t border-border pt-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-sm text-xs leading-7 text-muted-foreground">{copy.consent}</p>
          <Button
            type="submit"
            size="lg"
            className="h-auto rounded-none px-11 py-5 text-[11px] uppercase tracking-[0.3em] hover:bg-accent-tan"
            disabled={isSubmitting}
          >
            {isSubmitting ? progress || copy.submitting : form.submitButtonLabel || copy.submit}
          </Button>
        </div>
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
        <p className={cn(labelClass, 'mb-4', issue && 'text-error')}>
          {label}
          {field.required ? <span className="text-accent-tan"> *</span> : null}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {(field.options || []).map((option) => {
            const checked = selected.includes(option.value)
            return (
              <label
                key={option.value}
                className={cn(
                  'cursor-pointer border px-5 py-2.5 text-[13px] tracking-wide transition-colors',
                  checked
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-[#c9c0b0] bg-transparent text-foreground',
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
        {error ? <p className="text-sm text-error mt-2">{error}</p> : null}
      </div>
    )
  }

  if (field.blockType === 'radio' || (field.blockType === 'select' && name === 'projectType')) {
    const options = field.options || []
    if (options.length > 0 && options.length <= 6) {
      return (
        <div>
          <p className={cn(labelClass, 'mb-4', issue && 'text-error')}>
            {label}
            {field.required ? <span className="text-accent-tan"> *</span> : null}
          </p>
          <div className={cn('grid gap-3', options.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2')}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={value === option.value}
                onClick={() => onValue(option.value)}
                className={cn(
                  'border px-4 py-5 text-center font-serif text-[21px] transition-colors',
                  value === option.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-[#c9c0b0] bg-transparent text-foreground',
                )}
              >
                <OptionIcon icon={option.icon} iconUrl={option.iconUrl} />
                <span className="block">{option.label}</span>
              </button>
            ))}
          </div>
          {error ? <p className="text-sm text-error mt-2">{error}</p> : null}
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
        <label htmlFor={name} className={cn(labelClass, 'mb-2.5 block', issue && 'text-error')}>
          {label}
          {field.required ? <span className="text-accent-tan"> *</span> : null}
        </label>
        <select
          id={name}
          value={typeof value === 'string' ? value : ''}
          aria-invalid={Boolean(issue)}
          onChange={(event) => onValue(event.target.value)}
          className={cn(fieldClass, 'appearance-none', issue && 'border-error')}
        >
          <option value="">{field.placeholder || label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? <p className="text-sm text-error mt-2">{error}</p> : null}
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
            {field.required ? <span className="text-accent-tan"> *</span> : null}
          </span>
        </label>
        {error ? <p className="text-sm text-error mt-2">{error}</p> : null}
      </div>
    )
  }

  if (field.blockType === 'upload') {
    return (
      <div>
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
            'border border-dashed border-[#b9b0a1] bg-background-section px-6 py-9 text-center',
            dragOver && 'border-accent-tan',
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
            <p className="font-serif text-[22px]">{label || copy.uploadLabel}</p>
            <p className="mt-2 text-xs tracking-wide text-muted-foreground">{copy.uploadTypes}</p>
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
        {fileMessage || error ? <p className="text-sm text-error mt-2">{fileMessage || error}</p> : null}
        {progress ? <p className="text-sm text-muted-foreground mt-2">{progress}</p> : null}
      </div>
    )
  }

  const multiline = field.blockType === 'textarea'
  return (
    <div>
      <label htmlFor={name} className={cn(labelClass, 'mb-2.5 block', issue && 'text-error')}>
        {label}
        {field.required ? <span className="text-accent-tan"> *</span> : null}
      </label>
      {multiline ? (
        <textarea
          id={name}
          rows={5}
          value={typeof value === 'string' ? value : ''}
          aria-invalid={Boolean(issue)}
          onChange={(event) => onValue(event.target.value)}
          className={cn(fieldClass, 'resize-y leading-relaxed', issue && 'border-error')}
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
          className={cn(fieldClass, issue && 'border-error')}
        />
      )}
      {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}
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
