import { getPayload } from 'payload'
import config from '@payload-config'

import { seedDemo } from '@/seed/demo'

const enabled = (process.env.SEED_DEMO || '').toLowerCase() === 'true'

if (!enabled) {
  console.log('SEED_DEMO is not "true". Skipping demo seed.')
  process.exit(0)
}

try {
  const payload = await getPayload({ config })
  await seedDemo(payload)
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
