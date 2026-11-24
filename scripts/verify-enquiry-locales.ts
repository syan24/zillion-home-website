/**
 * Proves the English enquiry form was showing the copied Chinese demo
 * placeholders, that the one-off repair fixes only those strings, and that a
 * later custom value or blank survives two seeds and a restart.
 *
 * The server must already be `next start` on http://localhost:3000.
 * Usage: pnpm exec tsx scripts/verify-enquiry-locales.ts apply|check|restore
 */
import 'dotenv/config'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import fs from 'fs'

import { repairEnquiryLocaleLeak } from '@/lib/enquiry/repairLocaleLeak'
import { seedDemo } from '@/seed/demo'
import type { Form } from '@/payload-types'

const base = 'http://localhost:3000'
const statePath = '/tmp/verify-enquiry-locales.json'
const customEn = 'Editor budget EN'
const customZh = '编辑预算'

type State = {
  formID: number
  enFields: Form['fields']
  zhFields: Form['fields']
  enSubmit: string | null | undefined
  zhSubmit: string | null | undefined
  enConfirmation: Form['confirmationMessage']
  zhConfirmation: Form['confirmationMessage']
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
  console.log(`ok ${message}`)
}

async function html(locale: 'en' | 'zh') {
  const response = await fetch(`${base}/enquiry`, {
    headers: { cookie: `locale=${locale}` },
    cache: 'no-store',
  })
  return { status: response.status, body: await response.text() }
}

async function readForm(payload: Payload, id: number, locale: 'en' | 'zh') {
  return payload.findByID({
    collection: 'forms',
    id,
    locale,
    fallbackLocale: false,
    depth: 0,
    overrideAccess: true,
  })
}

function withPlaceholder(fields: Form['fields'], name: string, placeholder: string) {
  return (fields || []).map((field) =>
    field.blockType === 'select' && field.name === name ? { ...field, placeholder } : field,
  )
}

async function apply(payload: Payload) {
  const found = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { enquiryForm: { equals: true } },
  })
  const form = found.docs[0]
  if (!form) throw new Error('Enquiry form is missing.')
  const en = await readForm(payload, form.id, 'en')
  const zh = await readForm(payload, form.id, 'zh')
  const state: State = {
    formID: form.id,
    enFields: en.fields,
    zhFields: zh.fields,
    enSubmit: en.submitButtonLabel,
    zhSubmit: zh.submitButtonLabel,
    enConfirmation: en.confirmationMessage,
    zhConfirmation: zh.confirmationMessage,
  }
  fs.writeFileSync(statePath, JSON.stringify(state))
  console.log(`saved restore state ${statePath}`)

  await payload.update({
    collection: 'forms',
    id: form.id,
    locale: 'en',
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: {
      fields: withPlaceholder(
        withPlaceholder(en.fields, 'budget', '请选择预算范围'),
        'timeline',
        '请选择预计开始时间',
      ),
    },
  })
  const brokenEn = await html('en')
  const brokenZh = await html('zh')
  assert(brokenEn.status === 200 && brokenEn.body.includes('请选择预算范围'), 'English page shows the copied Chinese budget placeholder')
  assert(brokenEn.body.includes('请选择预计开始时间'), 'English page shows the copied Chinese timeline placeholder')
  assert(brokenZh.body.includes('请选择预算范围'), 'Chinese page still shows its own budget placeholder')

  const repaired = await repairEnquiryLocaleLeak(payload)
  console.log(repaired)
  const fixedEn = await html('en')
  const fixedZh = await html('zh')
  assert(fixedEn.body.includes('Select budget range'), 'English budget placeholder is the saved English demo')
  assert(fixedEn.body.includes('Select expected start'), 'English timeline placeholder is the saved English demo')
  assert(!fixedEn.body.includes('请选择预算范围'), 'English page no longer shows the Chinese budget placeholder')
  assert(fixedZh.body.includes('请选择预算范围'), 'Chinese budget placeholder stays Chinese')
  assert(fixedZh.body.includes('请选择预计开始时间'), 'Chinese timeline placeholder stays Chinese')
  assert(fixedEn.body.includes('Approximate budget'), 'English budget label stays English')
  assert(fixedZh.body.includes('预计预算'), 'Chinese budget label stays Chinese')
  assert(fixedEn.body.includes('Name') && fixedZh.body.includes('姓名'), 'name labels stay in their own locale')

  const currentEn = await readForm(payload, form.id, 'en')
  const currentZh = await readForm(payload, form.id, 'zh')
  await payload.update({
    collection: 'forms',
    id: form.id,
    locale: 'en',
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: { fields: withPlaceholder(currentEn.fields, 'budget', customEn) },
  })
  await payload.update({
    collection: 'forms',
    id: form.id,
    locale: 'zh',
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: {
      fields: withPlaceholder(withPlaceholder(currentZh.fields, 'budget', customZh), 'timeline', ''),
    },
  })
  const customPageEn = await html('en')
  const customPageZh = await html('zh')
  assert(customPageEn.body.includes(customEn), 'custom English placeholder is visible without a rebuild')
  assert(!customPageEn.body.includes(customZh), 'Chinese custom placeholder is not shown on English')
  assert(customPageZh.body.includes(customZh), 'custom Chinese placeholder is visible without a rebuild')
  assert(!customPageZh.body.includes('请选择预计开始时间'), 'cleared Chinese timeline placeholder stays empty')
  assert(!customPageZh.body.includes('Select expected start'), 'cleared Chinese timeline does not fall back to English')

  await seedDemo(payload)
  await seedDemo(payload)
  console.log('two seedDemo runs finished')
  const seededEn = await html('en')
  const seededZh = await html('zh')
  assert(seededEn.body.includes(customEn), 'custom English placeholder survived two seeds')
  assert(seededZh.body.includes(customZh), 'custom Chinese placeholder survived two seeds')
  assert(!seededZh.body.includes('请选择预计开始时间'), 'cleared Chinese placeholder survived two seeds')
}

async function check() {
  const en = await html('en')
  const zh = await html('zh')
  assert(en.status === 200 && zh.status === 200, 'enquiry responds after restart')
  assert(en.body.includes(customEn), 'custom English placeholder survived restart')
  assert(zh.body.includes(customZh), 'custom Chinese placeholder survived restart')
  assert(!zh.body.includes('请选择预计开始时间'), 'cleared Chinese placeholder survived restart')
  assert(!en.body.includes('请选择预算范围'), 'English page does not show the Chinese budget placeholder')
}

async function restore(payload: Payload) {
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8')) as State
  await payload.update({
    collection: 'forms',
    id: state.formID,
    locale: 'en',
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: {
      fields: state.enFields,
      submitButtonLabel: state.enSubmit,
      confirmationMessage: state.enConfirmation,
    },
  })
  await payload.update({
    collection: 'forms',
    id: state.formID,
    locale: 'zh',
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: {
      fields: state.zhFields,
      submitButtonLabel: state.zhSubmit,
      confirmationMessage: state.zhConfirmation,
    },
  })
  const en = await html('en')
  assert(en.body.includes('Select budget range'), 'restored English budget placeholder is served')
  assert(!en.body.includes(customEn), 'custom English placeholder is gone')
  console.log('restored')
}

const mode = process.argv[2] || 'apply'
const payload = mode === 'check' ? null : await getPayload({ config })
if (mode === 'apply') await apply(payload as Payload)
else if (mode === 'check') await check()
else if (mode === 'restore') await restore(payload as Payload)
else throw new Error(`Unknown mode ${mode}`)
process.exit(0)
