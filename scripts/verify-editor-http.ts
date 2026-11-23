/**
 * Proves an authenticated save on the running production server changes
 * English and Chinese HTML without a redeploy, and that a separate process
 * write does not clear the server's header/footer cache.
 *
 * The server must already be `next start` on http://localhost:3000.
 * Usage: pnpm exec tsx scripts/verify-editor-http.ts apply|check|restore
 */
import 'dotenv/config'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import fs from 'fs'

import { seedDemo } from '@/seed/demo'
import { testUser, seedTestUser } from '../tests/helpers/seedUser'

const base = 'http://localhost:3000'
const statePath = '/tmp/verify-editor-http-state.json'

const markerA = 'Cache Marker A'
const markerB = 'Cache Marker B'
const liveEn = 'Cache Live EN'
const liveZh = '缓存现网'
const liveHeadlineEn = 'Cache live headline'
const liveHeadlineZh = '缓存现网标题'
const removedBlurb = 'Cache proof blurb to remove'

type State = {
  headerLabel: string
  headerLabelZh: string
  headlineEn: string
  headlineZh: string
  blurb: string
  pageId: number
}

function log(line: string) {
  console.log(line)
}

async function html(path: string, locale: 'en' | 'zh') {
  const response = await fetch(`${base}${path}`, {
    headers: { cookie: `locale=${locale}` },
    cache: 'no-store',
  })
  const body = await response.text()
  return { status: response.status, body }
}

async function htmlIncludes(path: string, locale: 'en' | 'zh', needle: string, present: boolean) {
  let last = ''
  for (let attempt = 0; attempt < 8; attempt++) {
    const page = await html(path, locale)
    last = page.body
    if (page.status === 200 && page.body.includes(needle) === present) return page
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  return { status: 200, body: last }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
  log(`ok ${message}`)
}

async function login(): Promise<string> {
  const response = await fetch(`${base}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password }),
  })
  const json = (await response.json()) as { token?: string; errors?: unknown }
  if (!response.ok || !json.token) {
    throw new Error(`Login failed ${response.status} ${JSON.stringify(json.errors || json)}`)
  }
  return json.token
}

async function api(token: string, path: string, method: string, body?: unknown) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`${method} ${path} ${response.status} ${text.slice(0, 500)}`)
  return text ? JSON.parse(text) : null
}

async function homePage(payload: Payload) {
  const found = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'home' } },
  })
  const page = found.docs[0]
  if (!page) throw new Error('Home page is missing. Run pnpm seed:demo first.')
  return page
}

async function apply(payload: Payload) {
  await seedTestUser()
  const page = await homePage(payload)
  const header = await payload.findGlobal({ slug: 'header', locale: 'en', overrideAccess: true })
  const headerZh = await payload.findGlobal({
    slug: 'header',
    locale: 'zh',
    fallbackLocale: false,
    overrideAccess: true,
  })
  const footer = await payload.findGlobal({ slug: 'footer', locale: 'en', overrideAccess: true })
  const enPage = await payload.findByID({
    collection: 'pages',
    id: page.id,
    locale: 'en',
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })
  const zhPage = await payload.findByID({
    collection: 'pages',
    id: page.id,
    locale: 'zh',
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })
  const currentLabel = header.navItems?.[0]?.link?.label || ''
  const state: State = {
    headerLabel: currentLabel.startsWith('Cache ') ? 'Home' : currentLabel,
    headerLabelZh: headerZh.navItems?.[0]?.link?.label || '',
    headlineEn: (enPage.hero as { headline?: string } | undefined)?.headline || '',
    headlineZh: (zhPage.hero as { headline?: string } | undefined)?.headline || '',
    blurb: footer.blurb || '',
    pageId: page.id,
  }
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2))
  log(`saved restore state ${statePath}`)

  const token = await login()
  const baseNav = header.navItems || []
  const withLabel = (label: string) =>
    baseNav.map((item, index) =>
      index === 0 ? { ...item, link: { ...item.link, label } } : item,
    )
  await api(token, '/api/globals/header?locale=en', 'POST', { navItems: withLabel(markerA) })
  const warmed = await htmlIncludes('/', 'en', markerA, true)
  assert(warmed.status === 200, 'warm English home')
  assert(warmed.body.includes(markerA), 'in-process save is visible before the cache check')

  await payload.updateGlobal({
    slug: 'header',
    locale: 'en',
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: { navItems: withLabel(markerB) },
  })
  const stale = await html('/', 'en')
  assert(stale.body.includes(markerA), 'server cache still serves the previous header label')
  assert(!stale.body.includes(markerB), 'out-of-process header write stays out of the server cache')

  const liveNav = withLabel(liveEn)
  await api(token, '/api/globals/header?locale=en', 'POST', { navItems: liveNav })
  const zhNav = (headerZh.navItems || []).map((item, index) =>
    index === 0 ? { ...item, link: { ...item.link, label: liveZh } } : item,
  )
  await api(token, '/api/globals/header?locale=zh', 'POST', { navItems: zhNav })
  const after = await htmlIncludes('/', 'en', liveEn, true)
  const afterZh = await htmlIncludes('/', 'zh', liveZh, true)
  assert(after.body.includes(liveEn), 'in-process header save replaces the cached English label')
  assert(afterZh.body.includes(liveZh), 'in-process header save replaces the cached Chinese label')

  await api(token, `/api/pages/${page.id}?locale=en`, 'PATCH', {
    hero: { ...(enPage.hero as object), headline: liveHeadlineEn },
  })
  await api(token, `/api/pages/${page.id}?locale=zh`, 'PATCH', {
    hero: { ...(zhPage.hero as object), headline: liveHeadlineZh },
  })
  const headEn = await htmlIncludes('/', 'en', liveHeadlineEn, true)
  const headZh = await htmlIncludes('/', 'zh', liveHeadlineZh, true)
  assert(headEn.body.includes(liveHeadlineEn), 'English hero headline updates without a restart')
  assert(headZh.body.includes(liveHeadlineZh), 'Chinese hero headline updates without a restart')

  await api(token, '/api/globals/footer?locale=en', 'POST', { blurb: removedBlurb })
  const withBlurb = await htmlIncludes('/', 'en', removedBlurb, true)
  assert(withBlurb.body.includes(removedBlurb), 'footer blurb save is visible')
  await api(token, '/api/globals/footer?locale=en', 'POST', { blurb: '' })
  const cleared = await htmlIncludes('/', 'en', removedBlurb, false)
  assert(!cleared.body.includes(removedBlurb), 'clearing the footer blurb is visible')

  await seedDemo(payload)
  await seedDemo(payload)
  log('two seedDemo runs finished')
}

async function check() {
  const en = await html('/', 'en')
  const zh = await html('/', 'zh')
  assert(en.status === 200 && zh.status === 200, 'home responds after restart')
  assert(en.body.includes(liveEn), 'English nav edit survived seed and restart')
  assert(zh.body.includes(liveZh), 'Chinese nav edit survived seed and restart')
  assert(en.body.includes(liveHeadlineEn), 'English headline survived seed and restart')
  assert(zh.body.includes(liveHeadlineZh), 'Chinese headline survived seed and restart')
  assert(!en.body.includes(removedBlurb), 'cleared footer blurb was not recreated')
}

async function restore(payload: Payload) {
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8')) as State
  const header = await payload.findGlobal({ slug: 'header', locale: 'en', overrideAccess: true })
  const headerZh = await payload.findGlobal({
    slug: 'header',
    locale: 'zh',
    fallbackLocale: false,
    overrideAccess: true,
  })
  const enPage = await payload.findByID({
    collection: 'pages',
    id: state.pageId,
    locale: 'en',
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })
  const zhPage = await payload.findByID({
    collection: 'pages',
    id: state.pageId,
    locale: 'zh',
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })
  const token = await login()
  await api(token, '/api/globals/header?locale=en', 'POST', {
    navItems: (header.navItems || []).map((item, index) =>
      index === 0 ? { ...item, link: { ...item.link, label: state.headerLabel } } : item,
    ),
  })
  await api(token, '/api/globals/header?locale=zh', 'POST', {
    navItems: (headerZh.navItems || []).map((item, index) =>
      index === 0 ? { ...item, link: { ...item.link, label: state.headerLabelZh } } : item,
    ),
  })
  await api(token, `/api/pages/${state.pageId}?locale=en`, 'PATCH', {
    hero: { ...(enPage.hero as object), headline: state.headlineEn },
  })
  await api(token, `/api/pages/${state.pageId}?locale=zh`, 'PATCH', {
    hero: { ...(zhPage.hero as object), headline: state.headlineZh },
  })
  await api(token, '/api/globals/footer?locale=en', 'POST', { blurb: state.blurb })
  const en = await html('/', 'en')
  assert(en.body.includes(state.headerLabel), 'restored English nav is served')
  assert(!en.body.includes(liveEn), 'live marker is gone after restore')
  log('restored')
}

const mode = process.argv[2] || 'apply'
const payload = mode === 'check' ? null : await getPayload({ config })
if (mode === 'apply') await apply(payload as Payload)
else if (mode === 'check') await check()
else if (mode === 'restore') await restore(payload as Payload)
else throw new Error(`Unknown mode ${mode}`)
process.exit(0)
