/**
 * Proves Admin saves for the new editorial fields show on a running
 * `next start` without a rebuild. A second process write does not refresh
 * that server's cache.
 *
 * Usage: pnpm exec tsx scripts/verify-editorial-http.ts apply|check|restore
 */
import 'dotenv/config'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import fs from 'fs'

import { seedDemo } from '@/seed/demo'
import { seedTestUser, testUser } from '../tests/helpers/seedUser'

const base = 'http://localhost:3000'
const statePath = '/tmp/verify-editorial-http-state.json'

const proofProjects = 'Proof projects EN'
const proofProjectsZh = '证明项目'
const hiddenProjects = 'Hidden projects EN'
const proofType = 'Proof type'
const proofEnquiry = 'Proof enquiry'
const proofEnquiryZh = '证明咨询'
const proofForm = 'Proof form heading'
const proofFormZh = '证明表单标题'
const proofBand = 'Proof band'
const proofBandZh = '证明条'
const proofFeatures = 'Proof deliver'
const proofSpace = 'Proof sunroom'
const proofSpaceZh = '证明阳光房'
const proofNotify = 'staff-only-proof@example.com'

type State = {
  projectsEn: { eyebrow?: string | null; intro?: string | null; hero?: number | null; enquireLabel?: string | null }
  projectsZh: { eyebrow?: string | null; intro?: string | null }
  types: { id?: string | null; value?: string | null; label?: string | null; active?: boolean | null }[]
  enquiryEn: { formHeading?: string | null }
  enquiryZh: { formHeading?: string | null }
  headerEn: string
  headerZh: string
  homeId: number
  servicesId: number
  ctaEn: string
  ctaZh: string
  ctaImage: number | null
  featuresEn: string
  featuresZh: string
  spaceId: number
  spaceActive: boolean
  spaceOrder: number | null
  spaceName: string
  spaceSlug: string
  createdSpaceId?: number
  swappedHeroFile: string
  swmsPath: string
}

function log(line: string) {
  console.log(line)
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
  log(`ok ${message}`)
}

async function html(path: string, locale: 'en' | 'zh') {
  const response = await fetch(`${base}${path}`, {
    headers: { cookie: `locale=${locale}` },
    cache: 'no-store',
  })
  return { status: response.status, body: await response.text(), type: response.headers.get('content-type') || '' }
}

async function waitFor(path: string, locale: 'en' | 'zh', needle: string, present: boolean) {
  let last = await html(path, locale)
  for (let attempt = 0; attempt < 8; attempt++) {
    if (last.status === 200 && last.body.includes(needle) === present) return last
    await new Promise((resolve) => setTimeout(resolve, 250))
    last = await html(path, locale)
  }
  return last
}

async function login(): Promise<string> {
  const response = await fetch(`${base}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password }),
  })
  const json = (await response.json()) as { token?: string }
  if (!response.ok || !json.token) throw new Error(`Login failed ${response.status}`)
  return json.token
}

async function api(token: string, path: string, method: string, body?: unknown) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`${method} ${path} ${response.status} ${text.slice(0, 400)}`)
  return text ? JSON.parse(text) : null
}

function blockList(layout: unknown) {
  return Array.isArray(layout) ? layout : []
}

function withCta(layout: unknown, eyebrow: string) {
  return blockList(layout).map((block) => {
    if (!block || typeof block !== 'object' || (block as { blockType?: string }).blockType !== 'ctaBand') return block
    return { ...block, eyebrow }
  })
}

function withFeatures(layout: unknown, featuresLabel: string) {
  return blockList(layout).map((block) => {
    if (!block || typeof block !== 'object' || (block as { blockType?: string }).blockType !== 'serviceDetails') {
      return block
    }
    return { ...block, featuresLabel }
  })
}

async function swmsPath(payload: Payload) {
  const projects = await payload.find({
    collection: 'project-swms',
    depth: 0,
    limit: 50,
    overrideAccess: true,
    where: { status: { equals: 'active' } },
  })
  for (const project of projects.docs) {
    if (!project.publicToken || !project.project) continue
    const projectId = typeof project.project === 'object' ? project.project.id : project.project
    const docs = await payload.find({
      collection: 'swms-documents',
      depth: 0,
      limit: 5,
      overrideAccess: true,
      where: { and: [{ project: { equals: projectId } }, { status: { equals: 'active' } }] },
    })
    const file = docs.docs.find((item) => item.accessToken)
    if (file?.accessToken) return `/swms/${project.publicToken}/files/${file.accessToken}`
  }
  throw new Error('No public SWMS PDF was found.')
}

async function apply(payload: Payload) {
  await seedTestUser()
  const token = await login()
  const home = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'home' } },
  })
  const services = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'services' } },
  })
  const homeId = home.docs[0]?.id
  const servicesId = services.docs[0]?.id
  if (!homeId || !servicesId) throw new Error('Home or services page is missing.')

  const projectsEn = await payload.findGlobal({ slug: 'projects-page', locale: 'en', depth: 0, overrideAccess: true })
  const projectsZh = await payload.findGlobal({
    slug: 'projects-page',
    locale: 'zh',
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })
  const enquiryEn = await payload.findGlobal({ slug: 'enquiry-page', locale: 'en', depth: 0, overrideAccess: true })
  const enquiryZh = await payload.findGlobal({
    slug: 'enquiry-page',
    locale: 'zh',
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })
  const headerEn = await payload.findGlobal({ slug: 'header', locale: 'en', depth: 0, overrideAccess: true })
  const headerZh = await payload.findGlobal({
    slug: 'header',
    locale: 'zh',
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })
  const homeEn = await payload.findByID({
    collection: 'pages',
    id: homeId,
    depth: 0,
    locale: 'en',
    fallbackLocale: false,
    overrideAccess: true,
  })
  const homeZh = await payload.findByID({
    collection: 'pages',
    id: homeId,
    depth: 0,
    locale: 'zh',
    fallbackLocale: false,
    overrideAccess: true,
  })
  const servicesEn = await payload.findByID({
    collection: 'pages',
    id: servicesId,
    depth: 0,
    locale: 'en',
    fallbackLocale: false,
    overrideAccess: true,
  })
  const servicesZh = await payload.findByID({
    collection: 'pages',
    id: servicesId,
    depth: 0,
    locale: 'zh',
    fallbackLocale: false,
    overrideAccess: true,
  })
  const spaces = await payload.find({
    collection: 'spaces',
    depth: 0,
    limit: 50,
    overrideAccess: true,
    sort: 'displayOrder',
  })
  const space = spaces.docs.find((item) => item.slug === 'kitchen') || spaces.docs[0]
  if (!space) throw new Error('No space exists.')
  const spaceZh = await payload.findByID({
    collection: 'spaces',
    id: space.id,
    locale: 'zh',
    fallbackLocale: false,
    overrideAccess: true,
  })
  const currentHero = typeof projectsEn.hero === 'number' ? projectsEn.hero : null
  const otherMedia = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: currentHero ? { id: { not_equals: currentHero } } : { filename: { exists: true } },
  })
  const swapped = otherMedia.docs[0]
  if (!swapped?.filename || !swapped.id) throw new Error('No alternate media file.')
  const ctaEn = blockList(homeEn.layout).find((block) => (block as { blockType?: string }).blockType === 'ctaBand') as
    | { eyebrow?: string | null; image?: number | null }
    | undefined
  const ctaZh = blockList(homeZh.layout).find((block) => (block as { blockType?: string }).blockType === 'ctaBand') as
    | { eyebrow?: string | null }
    | undefined
  const featuresEn = blockList(servicesEn.layout).find(
    (block) => (block as { blockType?: string }).blockType === 'serviceDetails',
  ) as { featuresLabel?: string | null } | undefined
  const featuresZh = blockList(servicesZh.layout).find(
    (block) => (block as { blockType?: string }).blockType === 'serviceDetails',
  ) as { featuresLabel?: string | null } | undefined

  const state: State = {
    projectsEn: {
      eyebrow: projectsEn.eyebrow,
      intro: projectsEn.intro,
      hero: currentHero,
      enquireLabel: projectsEn.enquireLabel,
    },
    projectsZh: { eyebrow: projectsZh.eyebrow, intro: projectsZh.intro },
    types: (projectsEn.types || []).map((item) => ({
      id: item.id,
      value: item.value,
      label: item.label,
      active: item.active,
    })),
    enquiryEn: { formHeading: enquiryEn.formHeading },
    enquiryZh: { formHeading: enquiryZh.formHeading },
    headerEn: headerEn.enquiryLabel || '',
    headerZh: headerZh.enquiryLabel || '',
    homeId,
    servicesId,
    ctaEn: ctaEn?.eyebrow || '',
    ctaZh: ctaZh?.eyebrow || '',
    ctaImage: typeof ctaEn?.image === 'number' ? ctaEn.image : null,
    featuresEn: featuresEn?.featuresLabel || '',
    featuresZh: featuresZh?.featuresLabel || '',
    spaceId: space.id,
    spaceActive: Boolean(space.active),
    spaceOrder: space.displayOrder ?? null,
    spaceName: space.name,
    spaceSlug: space.slug || '',
    swappedHeroFile: swapped.filename,
    swmsPath: await swmsPath(payload),
  }
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2))
  log(`saved restore state ${statePath}`)

  const types = state.types.map((item, index) =>
    index === 0 ? { ...item, label: proofType, active: false } : { ...item, active: true },
  )
  await api(token, '/api/globals/projects-page?locale=en', 'POST', {
    eyebrow: proofProjects,
    intro: '',
    hero: swapped.id,
    types,
  })
  await api(token, '/api/globals/projects-page?locale=zh', 'POST', {
    eyebrow: proofProjectsZh,
    intro: '',
  })
  const warmedProjects = await waitFor('/projects', 'en', proofProjects, true)
  assert(warmedProjects.body.includes(proofProjects), 'in-process projects save is visible before the cache check')
  await payload.updateGlobal({
    slug: 'projects-page',
    locale: 'en',
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: { eyebrow: hiddenProjects },
  })

  await api(token, '/api/globals/enquiry-page?locale=en', 'POST', { formHeading: proofForm })
  await api(token, '/api/globals/enquiry-page?locale=zh', 'POST', { formHeading: proofFormZh })
  await api(token, '/api/globals/header?locale=en', 'POST', { enquiryLabel: proofEnquiry })
  await api(token, '/api/globals/header?locale=zh', 'POST', { enquiryLabel: proofEnquiryZh })
  await api(token, `/api/pages/${homeId}?locale=en`, 'PATCH', { layout: withCta(homeEn.layout, proofBand) })
  await api(token, `/api/pages/${homeId}?locale=zh`, 'PATCH', { layout: withCta(homeZh.layout, proofBandZh) })
  await api(token, `/api/pages/${servicesId}?locale=en`, 'PATCH', {
    layout: withFeatures(servicesEn.layout, proofFeatures),
  })
  await api(token, `/api/pages/${servicesId}?locale=zh`, 'PATCH', {
    layout: withFeatures(servicesZh.layout, ''),
  })
  await api(token, `/api/spaces/${space.id}?locale=en`, 'PATCH', { active: false })
  const created = (await api(token, '/api/spaces?locale=en', 'POST', {
    name: proofSpace,
    slug: 'proof-sunroom',
    active: true,
    displayOrder: -10,
  })) as { doc: { id: number } }
  state.createdSpaceId = created.doc.id
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2))
  await api(token, `/api/spaces/${created.doc.id}?locale=zh`, 'PATCH', { name: proofSpaceZh })
  await api(token, '/api/globals/enquiry-notifications', 'POST', { notifyTo: proofNotify, notifyFrom: '' })

  const hiddenType = state.types[0]?.value || ''
  const visibleType = state.types[1]?.value || ''
  const projects = await waitFor('/projects', 'en', proofProjects, true)
  assert(projects.body.includes(proofProjects), 'English projects eyebrow updates without a restart')
  assert(!projects.body.includes(hiddenProjects), 'out-of-process projects write stays out of the server cache')
  assert(projects.body.includes(state.swappedHeroFile), 'projects hero uses the saved media file')
  assert(!projects.body.includes(state.projectsEn.intro || '___missing_intro___'), 'cleared English intro stays off the page')
  const room = await html('/projects?view=room', 'en')
  assert(room.body.includes(`value="${hiddenType}"`) === false, 'inactive project type is not a filter option')
  assert(room.body.includes(`value="${visibleType}"`), 'an active project type stays in the filter')
  assert(room.body.includes(proofSpace), 'new active space is an English chip and filter')
  assert(room.body.includes(`value="${space.slug}"`) === false, 'deactivated space is not a filter option')
  const projectsZhPage = await waitFor('/projects?view=room', 'zh', proofProjectsZh, true)
  assert(projectsZhPage.body.includes(proofProjectsZh), 'Chinese projects eyebrow updates without a restart')
  assert(projectsZhPage.body.includes(proofSpaceZh), 'new active space is a Chinese chip')
  assert(projectsZhPage.body.includes(`value="${space.slug}"`) === false, 'deactivated space is not a Chinese filter option')
  const homePage = await waitFor('/', 'en', proofBand, true)
  assert(homePage.body.includes(proofBand), 'home CTA eyebrow updates without a restart')
  assert(homePage.body.includes(proofEnquiry), 'header enquiry label updates without a restart')
  const homeZhPage = await waitFor('/', 'zh', proofBandZh, true)
  assert(homeZhPage.body.includes(proofBandZh), 'Chinese CTA eyebrow updates without a restart')
  assert(homeZhPage.body.includes(proofEnquiryZh), 'Chinese header enquiry label updates without a restart')
  const servicesPage = await waitFor('/services', 'en', proofFeatures, true)
  assert(servicesPage.body.includes(proofFeatures), 'services features label updates without a restart')
  const servicesZhPage = await waitFor('/services', 'zh', '交付内容', false)
  assert(!servicesZhPage.body.includes('交付内容'), 'cleared Chinese features label is not replaced')
  assert(!servicesZhPage.body.includes('What we deliver'), 'cleared Chinese features label does not fall back to English')
  const enquiry = await waitFor('/enquiry', 'en', proofForm, true)
  const enquiryZhPage = await waitFor('/enquiry', 'zh', proofFormZh, true)
  assert(enquiry.body.includes(proofForm), 'English enquiry heading updates without a restart')
  assert(enquiryZhPage.body.includes(proofFormZh), 'Chinese enquiry heading updates without a restart')

  const secret = await fetch(`${base}/api/globals/enquiry-notifications`, { cache: 'no-store' })
  const secretBody = await secret.text()
  assert(secret.status === 403, 'notification settings are not public')
  assert(!secretBody.includes(proofNotify), 'public response does not contain the recipient')
  const pdf = await fetch(`${base}${state.swmsPath}`, { cache: 'no-store' })
  const bytes = new Uint8Array(await pdf.arrayBuffer())
  assert(pdf.status === 200 && (pdf.headers.get('content-type') || '').includes('application/pdf'), 'SWMS PDF route still returns a PDF')
  assert(bytes[0] === 0x25 && bytes[1] === 0x50, 'SWMS body starts with the PDF marker')

  await api(token, '/api/globals/enquiry-notifications', 'POST', { notifyTo: '', notifyFrom: '' })
  log('apply finished')
}

async function check(payload: Payload) {
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8')) as State
  await seedDemo(payload)
  await seedDemo(payload)
  log('two seedDemo runs finished')
  const projects = await html('/projects', 'en')
  const projectsZh = await html('/projects?view=room', 'zh')
  const home = await html('/', 'en')
  const services = await html('/services', 'zh')
  assert(projects.body.includes(proofProjects), 'English projects edit survived seed and restart')
  assert(!projects.body.includes(hiddenProjects), 'hidden out-of-process value was not seeded back')
  assert(!projects.body.includes(state.projectsEn.intro || '___missing_intro___'), 'cleared intro survived seed and restart')
  assert(projectsZh.body.includes(proofSpaceZh), 'added space survived seed and restart')
  assert(!projectsZh.body.includes(`value="${state.spaceSlug}"`), 'deactivated space stays out of the filter after seed')
  assert(home.body.includes(proofBand), 'CTA eyebrow survived seed and restart')
  assert(home.body.includes(proofEnquiry), 'header enquiry label survived seed and restart')
  assert(!services.body.includes('交付内容'), 'cleared features label survived seed and restart')
  const secret = await fetch(`${base}/api/globals/enquiry-notifications`, { cache: 'no-store' })
  assert(secret.status === 403, 'notification settings stay private after restart')
}

async function restore(payload: Payload) {
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8')) as State
  const token = await login()
  await api(token, '/api/globals/projects-page?locale=en', 'POST', {
    eyebrow: state.projectsEn.eyebrow,
    intro: state.projectsEn.intro,
    hero: state.projectsEn.hero,
    types: state.types,
  })
  await api(token, '/api/globals/projects-page?locale=zh', 'POST', {
    eyebrow: state.projectsZh.eyebrow,
    intro: state.projectsZh.intro,
  })
  await api(token, '/api/globals/enquiry-page?locale=en', 'POST', { formHeading: state.enquiryEn.formHeading })
  await api(token, '/api/globals/enquiry-page?locale=zh', 'POST', { formHeading: state.enquiryZh.formHeading })
  await api(token, '/api/globals/header?locale=en', 'POST', { enquiryLabel: state.headerEn })
  await api(token, '/api/globals/header?locale=zh', 'POST', { enquiryLabel: state.headerZh })
  const homeEn = await payload.findByID({
    collection: 'pages',
    id: state.homeId,
    depth: 0,
    locale: 'en',
    fallbackLocale: false,
    overrideAccess: true,
  })
  const homeZh = await payload.findByID({
    collection: 'pages',
    id: state.homeId,
    depth: 0,
    locale: 'zh',
    fallbackLocale: false,
    overrideAccess: true,
  })
  const servicesEn = await payload.findByID({
    collection: 'pages',
    id: state.servicesId,
    depth: 0,
    locale: 'en',
    fallbackLocale: false,
    overrideAccess: true,
  })
  const servicesZh = await payload.findByID({
    collection: 'pages',
    id: state.servicesId,
    depth: 0,
    locale: 'zh',
    fallbackLocale: false,
    overrideAccess: true,
  })
  await api(token, `/api/pages/${state.homeId}?locale=en`, 'PATCH', { layout: withCta(homeEn.layout, state.ctaEn) })
  await api(token, `/api/pages/${state.homeId}?locale=zh`, 'PATCH', { layout: withCta(homeZh.layout, state.ctaZh) })
  await api(token, `/api/pages/${state.servicesId}?locale=en`, 'PATCH', {
    layout: withFeatures(servicesEn.layout, state.featuresEn),
  })
  await api(token, `/api/pages/${state.servicesId}?locale=zh`, 'PATCH', {
    layout: withFeatures(servicesZh.layout, state.featuresZh),
  })
  await api(token, `/api/spaces/${state.spaceId}`, 'PATCH', {
    active: state.spaceActive,
    displayOrder: state.spaceOrder,
  })
  if (state.createdSpaceId) await api(token, `/api/spaces/${state.createdSpaceId}`, 'DELETE')
  await api(token, '/api/globals/enquiry-notifications', 'POST', { notifyTo: '', notifyFrom: '' })
  const projects = await waitFor('/projects', 'en', proofProjects, false)
  assert(!projects.body.includes(proofProjects), 'proof projects eyebrow is gone')
  assert(projects.body.includes(state.projectsEn.intro || ''), 'restored projects intro is served')
  log('restored')
}

const mode = process.argv[2] || 'apply'
const payload = await getPayload({ config })
if (mode === 'apply') await apply(payload)
else if (mode === 'check') await check(payload)
else if (mode === 'restore') await restore(payload)
else throw new Error(`Unknown mode ${mode}`)
process.exit(0)
