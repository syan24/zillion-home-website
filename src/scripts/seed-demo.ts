import { getPayload } from 'payload'
import config from '@payload-config'

import { seedDemo } from '@/seed/demo'

try {
  const payload = await getPayload({ config })
  await seedDemo(payload)
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
