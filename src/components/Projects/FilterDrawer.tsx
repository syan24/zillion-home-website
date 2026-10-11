'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import type { Messages } from '@/i18n/messages'
import type { ProjectFilters } from '@/lib/projects/filters'
import type { PortfolioProjectOption, PortfolioTerm } from '@/lib/projects/loadPortfolio'

type Copy = Messages['projects']

export function FilterDrawer({
  copy,
  filters,
  styles,
  spaces,
  projects,
}: {
  copy: Copy
  filters: ProjectFilters
  styles: PortfolioTerm[]
  spaces: PortfolioTerm[]
  projects: PortfolioProjectOption[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="md:hidden inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm"
        onClick={() => setOpen(true)}
      >
        {copy.filters}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={copy.close}
            onClick={() => setOpen(false)}
          />
          <form
            action="/projects"
            method="get"
            role="dialog"
            aria-modal="true"
            aria-label={copy.filters}
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto rounded-t-2xl bg-background p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-2xl">{copy.filters}</h2>
              <button type="button" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>
                {copy.close}
              </button>
            </div>
            <FilterFields copy={copy} filters={filters} styles={styles} spaces={spaces} projects={projects} />
            <div className="mt-6 flex gap-3">
              <button type="submit" className="flex-1 rounded bg-primary px-4 py-3 text-sm text-primary-foreground">
                {copy.apply}
              </button>
              <Link href="/projects" className="flex-1 rounded border border-border px-4 py-3 text-center text-sm">
                {copy.clear}
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export function DesktopProjectFilter({
  copy,
  filters,
  styles,
  spaces,
  projects,
}: {
  copy: Copy
  filters: ProjectFilters
  styles: PortfolioTerm[]
  spaces: PortfolioTerm[]
  projects: PortfolioProjectOption[]
}) {
  return (
    <form action="/projects" method="get" className="hidden md:grid md:grid-cols-5 md:items-end md:gap-3">
      <FilterFields copy={copy} filters={filters} styles={styles} spaces={spaces} projects={projects} />
      <div className="flex gap-2">
        <button type="submit" className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground">
          {copy.apply}
        </button>
        <Link href="/projects" className="rounded border border-border px-4 py-2 text-sm">
          {copy.clear}
        </Link>
      </div>
    </form>
  )
}

function FilterFields({
  copy,
  filters,
  styles,
  spaces,
  projects,
}: {
  copy: Copy
  filters: ProjectFilters
  styles: PortfolioTerm[]
  spaces: PortfolioTerm[]
  projects: PortfolioProjectOption[]
}) {
  const selectClass = 'mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm'

  return (
    <>
      <label className="block text-sm">
        {copy.type}
        <select name="type" defaultValue={filters.type || ''} className={selectClass}>
          <option value="">{copy.allTypes}</option>
          <option value="residential">{copy.residential}</option>
          <option value="commercial">{copy.commercial}</option>
        </select>
      </label>
      <label className="mt-4 block text-sm md:mt-0">
        {copy.space}
        <select name="space" defaultValue={filters.space || ''} className={selectClass}>
          <option value="">{copy.allSpaces}</option>
          {spaces.map((space) => (
            <option key={space.slug} value={space.slug}>
              {space.name}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 block text-sm md:mt-0">
        {copy.style}
        <select name="style" defaultValue={filters.style || ''} className={selectClass}>
          <option value="">{copy.allStyles}</option>
          {styles.map((style) => (
            <option key={style.slug} value={style.slug}>
              {style.name}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 block text-sm md:mt-0">
        {copy.project}
        <select name="project" defaultValue={filters.project || ''} className={selectClass}>
          <option value="">{copy.allProjects}</option>
          {projects.map((project) => (
            <option key={project.slug} value={project.slug}>
              {project.title}
            </option>
          ))}
        </select>
      </label>
    </>
  )
}
