'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

type ProjectType = 'residential' | 'commercial' | 'joinery' | null

const projectTypes = [
  {
    id: 'residential' as const,
    label: 'Residential',
    labelZh: '住宅空间',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    id: 'commercial' as const,
    label: 'Commercial',
    labelZh: '商业空间',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    id: 'joinery' as const,
    label: 'Custom Joinery',
    labelZh: '定制橱柜',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
  },
]

const scopeOptions = [
  { id: 'full-joinery', label: 'Full Joinery', labelZh: '全屋定制' },
  { id: 'kitchen', label: 'Kitchen', labelZh: '厨房' },
  { id: 'wardrobe', label: 'Wardrobe', labelZh: '衣柜' },
  { id: 'bathroom-vanity', label: 'Bathroom Vanity', labelZh: '浴室柜' },
  { id: 'tv-unit', label: 'TV Unit', labelZh: '电视柜' },
  { id: 'other', label: 'Other', labelZh: '其他' },
]

const budgetRanges = [
  { value: '', label: 'Select budget range', labelZh: '请选择预算范围' },
  { value: 'under-50k', label: 'Under $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: '100k-250k', label: '$100,000 - $250,000' },
  { value: '250k-500k', label: '$250,000 - $500,000' },
  { value: 'over-500k', label: 'Over $500,000' },
]

const timelineOptions = [
  { value: '', label: 'Select expected start', labelZh: '请选择预计开始时间' },
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: '1-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: '6-12-months', label: '6-12 months' },
  { value: 'planning', label: 'Just planning' },
]

export function EnquiryForm() {
  const [projectType, setProjectType] = useState<ProjectType>(null)
  const [selectedScope, setSelectedScope] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const toggleScope = (scopeId: string) => {
    setSelectedScope((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId],
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission delay (TODO: implement actual submission)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="font-serif text-2xl mb-4">Thank you for your enquiry</h3>
        <p className="text-foreground-soft mb-2">
          We&apos;ve received your project details and will be in touch soon.
        </p>
        <p className="text-sm text-muted-foreground">
          Typically within 1-2 business days
        </p>
      </div>
    )
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          姓名 Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="请输入您的姓名"
          className="w-full px-4 py-3 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      {/* Contact Details */}
      <div>
        <p className="text-sm font-medium mb-3">联系方式 Contact Details *</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="手机号码 Mobile Number"
              className="w-full px-4 py-3 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="邮箱地址 Email Address"
              className="w-full px-4 py-3 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
        </div>
      </div>

      {/* Project Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          项目地址 / 区域 Project Address / Suburb <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="请输入项目地址或所在区域"
          className="w-full px-4 py-3 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      {/* Project Type */}
      <div>
        <p className="text-sm font-medium mb-3">
          项目类型 Project Type <span className="text-destructive">*</span>
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
              <div className="flex justify-center mb-2 text-foreground-soft">{type.icon}</div>
              <span className="font-medium text-sm block">{type.label}</span>
              <span className="text-xs text-muted-foreground">{type.labelZh}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scope of Work */}
      <div>
        <p className="text-sm font-medium mb-3">工作范围 Scope of Work</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {scopeOptions.map((scope) => (
            <label
              key={scope.id}
              className={cn(
                'flex items-center gap-3 px-4 py-3 border rounded cursor-pointer transition-all',
                selectedScope.includes(scope.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-input hover:border-foreground/30',
              )}
            >
              <input
                type="checkbox"
                checked={selectedScope.includes(scope.id)}
                onChange={() => toggleScope(scope.id)}
                className="sr-only"
              />
              <div
                className={cn(
                  'w-4 h-4 border rounded flex items-center justify-center flex-shrink-0',
                  selectedScope.includes(scope.id)
                    ? 'bg-primary border-primary'
                    : 'border-input',
                )}
              >
                {selectedScope.includes(scope.id) && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-sm block">{scope.label}</span>
                <span className="text-xs text-muted-foreground">{scope.labelZh}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Budget & Timeline */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-1">
            预计预算 Approximate Budget
          </label>
          <select
            id="budget"
            name="budget"
            className="w-full px-4 py-3 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {budgetRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium mb-1">
            期望时间 Expected Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            className="w-full px-4 py-3 bg-background border border-input rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          项目描述 Project Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="请简单描述您的项目需求、面积、风格偏好或任何其他信息..."
          className="w-full px-4 py-3 bg-background border border-input rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {/* File Upload Placeholder */}
      <div>
        <label className="block text-sm font-medium mb-1">
          上传照片 / 图纸 / 文件 Upload Photos / Drawings / Documents
        </label>
        <div className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-foreground/30 transition-colors cursor-pointer">
          <div className="flex justify-center mb-3">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">点击上传文件或拖拽到此处</p>
          <p className="text-xs text-muted-foreground mt-1">
            支持格式: PDF, PNG, JPG, DWG (最多 10 个文件, 每个不超过 10MB)
          </p>
          <p className="text-xs text-accent mt-3">File upload functionality coming soon</p>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting || !projectType}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            <>提交 Submit Enquiry →</>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          By submitting this form, you agree to our privacy policy and consent to being contacted
          about your enquiry.
        </p>
      </div>
    </form>
  )
}
