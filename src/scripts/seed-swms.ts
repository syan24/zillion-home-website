import { getPayload } from 'payload'
import config from '@payload-config'

import { seedSwms } from '@/seed/swms'

try {
  const payload = await getPayload({ config })
  await seedSwms(payload)
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
