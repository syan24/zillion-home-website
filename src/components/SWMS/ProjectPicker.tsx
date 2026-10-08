'use client'

import type { ActiveProjectOption } from '@/lib/swms/loadWorkerSWMS'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'

type ProjectPickerProps = {
  projects: ActiveProjectOption[]
}

export function ProjectPicker({ projects }: ProjectPickerProps) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return projects
    return projects.filter((project) => {
      return (
        project.projectName.toLowerCase().includes(needle) ||
        project.projectAddress.toLowerCase().includes(needle) ||
        project.swmsTitle.toLowerCase().includes(needle)
      )
    })
  }, [projects, query])

  return (
    <div className="space-y-5">
      <label className="block space-y-2">
        <span className="text-sm font-medium">Search projects</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search project name or address"
          className="h-12 w-full rounded-md border border-input bg-white px-3 text-base outline-none ring-ring/30 focus-visible:ring-4"
          autoComplete="off"
        />
      </label>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-border bg-white px-4 py-6 text-sm text-muted-foreground">
          {projects.length === 0
            ? 'No active project SWMS is available yet. Ask your supervisor to publish one, or scan the project QR code.'
            : 'No project matches that search. Choose a project from the list, or scan the project QR code. Addresses cannot be typed in.'}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((project) => (
            <li key={project.token}>
              <Link
                href={`/swms/${project.token}`}
                className="block rounded-lg border border-border bg-white px-4 py-4 transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="block font-medium">{project.projectName}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {project.projectAddress}
                </span>
                <span className="mt-2 block text-xs tracking-wide text-accent-foreground/70 uppercase">
                  {project.swmsTitle}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
