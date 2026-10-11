import type { Payload } from 'payload'

import { seedPortfolio } from '@/seed/portfolio'
import { seedSwms } from '@/seed/swms'
import { seedWebsite } from '@/seed/website'

export async function seedDemo(payload: Payload) {
  console.log('Seeding website baseline...')
  await seedWebsite(payload)
  console.log('Seeding project portfolio...')
  await seedPortfolio(payload)
  console.log('Seeding SWMS demo...')
  await seedSwms(payload)
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  console.log('Demo URLs:')
  console.log(`${base}/`)
  console.log(`${base}/about`)
  console.log(`${base}/services`)
  console.log(`${base}/enquiry`)
  console.log(`${base}/projects`)
  console.log(`${base}/projects?type=residential&style=modern`)
  console.log(`${base}/swms`)
}
