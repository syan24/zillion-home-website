'use client'

import { useSyncExternalStore } from 'react'

const identityKey = (token: string) => `site-safety-identity:${token}`

export type StoredWorkerIdentity = {
  name: string
  phone: string
}

const snapshots = new Map<string, { raw: string | null; value: StoredWorkerIdentity | null }>()

function parseStored(raw: string | null): StoredWorkerIdentity | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { name?: unknown; phone?: unknown }
    if (typeof parsed.name !== 'string' || typeof parsed.phone !== 'string') return null
    if (!parsed.name.trim() || !parsed.phone.trim()) return null
    return { name: parsed.name, phone: parsed.phone }
  } catch {
    return null
  }
}

export function readWorkerIdentity(token: string): StoredWorkerIdentity | null {
  if (typeof window === 'undefined') return null
  const raw = window.sessionStorage.getItem(identityKey(token))
  const cached = snapshots.get(token)
  if (cached && cached.raw === raw) return cached.value
  const value = parseStored(raw)
  snapshots.set(token, { raw, value })
  return value
}

export function writeWorkerIdentity(token: string, identity: StoredWorkerIdentity) {
  const raw = JSON.stringify(identity)
  window.sessionStorage.setItem(identityKey(token), raw)
  snapshots.set(token, { raw, value: identity })
}

export function useStoredWorkerIdentity(token: string): StoredWorkerIdentity | null {
  return useSyncExternalStore(
    () => () => undefined,
    () => readWorkerIdentity(token),
    () => null,
  )
}
