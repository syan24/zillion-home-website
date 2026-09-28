'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

type ProjectType = 'residential' | 'commercial' | 'joinery' | null

const projectTypes = [
  { id: 'residential' as const, label: 'Residential', icon: '🏠', description: 'Home renovations, extensions, new builds' },
  { id: 'commercial' as const, label: 'Commercial', icon: '🏢', description: 'Office fit-outs, retail spaces' },
  { id: 'joinery' as const, label: 'Custom Joinery', icon: '🪑', description: 'Kitchens, wardrobes, cabinetry' },
]

const scopeOptions = [
  'Full Joinery',
  'Kitchen',
  'Wardrobe',
  'Bathroom Vanity',
  'TV Unit',
  'Other',
]

export function EnquiryForm() {
  const [projectType, setProjectType] = useState<ProjectType>(null)
  const [selectedScope, setSelectedScope] = useState<string[]>([])

  const toggleScope = (scope: string) => {
    setSelectedScope((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    )
  }

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          className="w-full px-4 py-3 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      {/* Contact Details */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="0400 000 000"
            className="w-full px-4 py-3 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
      </div>

      {/* Project Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-2">
          Project Address / Suburb <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="Enter project address or suburb"
          className="w-full px-4 py-3 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      {/* Project Type */}
      <div>
        <label className="block text-sm font-medium mb-4">
          Project Type <span className="text-destructive">*</span>
        </label>
        <div className="grid sm:grid-cols-3 gap-4">
          {projectTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setProjectType(type.id)}
              className={cn(
                'p-4 border rounded text-left transition-all',
                projectType === type.id
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-input hover:border-foreground/30',
              )}
            >
              <span className="text-2xl mb-2 block">{type.icon}</span>
              <span className="font-medium block">{type.label}</span>
              <span className="text-xs text-muted-foreground">{type.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scope of Work */}
      <div>
        <label className="block text-sm font-medium mb-4">Scope of Work</label>
        <div className="flex flex-wrap gap-3">
          {scopeOptions.map((scope) => (
            <button
              key={scope}
              type="button"
              onClick={() => toggleScope(scope)}
              className={cn(
                'px-4 py-2 border rounded text-sm transition-all',
                selectedScope.includes(scope)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:border-foreground/30',
              )}
            >
              {scope}
            </button>
          ))}
        </div>
      </div>

      {/* Budget & Timeline */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-2">
            Approximate Budget
          </label>
          <select
            id="budget"
            name="budget"
            className="w-full px-4 py-3 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select budget range</option>
            <option value="under-50k">Under $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-250k">$100,000 - $250,000</option>
            <option value="250k-500k">$250,000 - $500,000</option>
            <option value="over-500k">Over $500,000</option>
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium mb-2">
            Expected Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            className="w-full px-4 py-3 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select expected start</option>
            <option value="asap">As soon as possible</option>
            <option value="1-3-months">1-3 months</option>
            <option value="3-6-months">3-6 months</option>
            <option value="6-12-months">6-12 months</option>
            <option value="planning">Just planning</option>
          </select>
        </div>
      </div>

      {/* Project Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Project Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Tell us about your project requirements, style preferences, or any other information..."
          className="w-full px-4 py-3 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {/* File Upload Placeholder */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Upload Photos / Drawings / Documents
        </label>
        <div className="border-2 border-dashed border-input rounded p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supports: PDF, PNG, JPG, DWG (Max 10 files, 10MB each)
          </p>
          <p className="text-xs text-accent mt-4">
            File upload functionality coming soon
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Submit Enquiry →
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          By submitting this form, you agree to our privacy policy and consent to being contacted
          about your enquiry.
        </p>
      </div>
    </form>
  )
}
