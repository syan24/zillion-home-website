/**
 * Checks a newly migrated and seeded database, then proves a second seed
 * keeps an edit and a cleared field. Point DATABASE_URL at that database.
 */
import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

import { seedDemo } from '@/seed/demo'
import { loadPortfolio } from '@/lib/projects/loadPortfolio'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
  console.log(`ok ${message}`)
}

const payload = await getPayload({ config })
const projects = await payload.findGlobal({ slug: 'projects-page', locale: 'en', depth: 0, overrideAccess: true })
const projectsZh = await payload.findGlobal({
  slug: 'projects-page',
  locale: 'zh',
  fallbackLocale: false,
  depth: 0,
  overrideAccess: true,
})
const header = await payload.findGlobal({ slug: 'header', locale: 'en', depth: 0, overrideAccess: true })
const notifications = await payload.findGlobal({ slug: 'enquiry-notifications', overrideAccess: true })
assert(projects.contentSeeded === true, 'fresh seed marks projects copy as seeded')
assert(projects.eyebrow === 'Projects', 'fresh English projects eyebrow is the current wording')
assert(projectsZh.eyebrow === '项目', 'fresh Chinese projects eyebrow is the current wording')
assert(projectsZh.byProject === '按项目', 'fresh Chinese by-project label is localized')
assert(header.enquiryLabel === 'Start an Enquiry →', 'fresh header enquiry label is filled')
assert(!notifications.notifyTo && !notifications.notifyFrom, 'fresh notification fields stay empty')

const home = await payload.find({
  collection: 'pages',
  depth: 0,
  limit: 1,
  locale: 'en',
  overrideAccess: true,
  where: { slug: { equals: 'home' } },
})
const services = await payload.find({
  collection: 'pages',
  depth: 0,
  limit: 1,
  locale: 'zh',
  fallbackLocale: false,
  overrideAccess: true,
  where: { slug: { equals: 'services' } },
})
const cta = (home.docs[0]?.layout || []).find((block) => block.blockType === 'ctaBand')
const details = (services.docs[0]?.layout || []).find((block) => block.blockType === 'serviceDetails')
assert(cta?.blockType === 'ctaBand' && cta.eyebrow === 'Begin a project', 'fresh home band eyebrow is filled')
assert(details?.blockType === 'serviceDetails' && details.featuresLabel === '交付内容', 'fresh Chinese features label is filled')
const portfolio = await loadPortfolio('en', {})
assert(portfolio.spaces.some((space) => space.slug === 'office'), 'office is included with the other active spaces')
assert(portfolio.spaces.length > 8, 'space chips are not capped at the old eight slugs')

await payload.updateGlobal({
  slug: 'projects-page',
  locale: 'en',
  overrideAccess: true,
  context: { disableRevalidate: true },
  data: { eyebrow: 'Editor kept', intro: '' },
})
await seedDemo(payload)
await seedDemo(payload)
const again = await payload.findGlobal({
  slug: 'projects-page',
  locale: 'en',
  fallbackLocale: false,
  depth: 0,
  overrideAccess: true,
})
assert(again.eyebrow === 'Editor kept', 'second seed keeps an edited projects eyebrow')
assert(!again.intro, 'second seed does not restore a cleared projects intro')
console.log('pristine baseline passed')
process.exit(0)
