'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import type { Messages } from '@/i18n/messages'

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

export function EnquiryForm({ copy }: { copy: EnquiryCopy }) {
  const [projectType, setProjectType] = useState<ProjectType>(null)
  const [selectedScope, setSelectedScope] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
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
      </div>
    )
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          {copy.nameLabel} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder={copy.namePlaceholder}
          className={fieldClass}
          required
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-3">{copy.contactLegend} *</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder={copy.phonePlaceholder}
            aria-label={copy.phonePlaceholder}
            className={fieldClass}
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder={copy.emailPlaceholder}
            aria-label={copy.emailPlaceholder}
            className={fieldClass}
            required
          />
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
          placeholder={copy.addressPlaceholder}
          className={fieldClass}
          required
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-3">
          {copy.typeLabel} <span className="text-destructive">*</span>
        </p>
        <div className="grid grid-cols-3 gap-3">
          {projectTypes.map((type) => (
            <button
              key={type.id}
              type="button"
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
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-1">
            {copy.budgetLabel}
          </label>
          <select id="budget" name="budget" className={fieldClass}>
            {copy.budgetOptions.map((range) => (
              <option key={range.value || 'empty'} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium mb-1">
            {copy.timelineLabel}
          </label>
          <select id="timeline" name="timeline" className={fieldClass}>
            {copy.timelineOptions.map((option) => (
              <option key={option.value || 'empty'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          {copy.descriptionLabel}
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder={copy.descriptionPlaceholder}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{copy.uploadLabel}</label>
        <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">{copy.uploadHint}</p>
          <p className="text-xs text-muted-foreground mt-1">{copy.uploadTypes}</p>
          <p className="text-xs text-accent mt-3">{copy.uploadSoon}</p>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !projectType}>
          {isSubmitting ? copy.submitting : copy.submit}
        </Button>
        <p className="text-xs text-muted-foreground mt-4 text-center">{copy.consent}</p>
      </div>
    </form>
  )
}
