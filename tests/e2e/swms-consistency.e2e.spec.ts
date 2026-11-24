import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

type CheckState = {
  token: string
  fitoutToken: string
  address: string
  zh: string
  swmsTitle: string
  question: string
  docTitle: string
  hiddenTitle: string
}

const statePath = '/tmp/swms-consistency.json'

test('saved SWMS fields show on the worker pages and survive two seeds', async ({ page }) => {
  test.setTimeout(240000)
  run('mutate')
  const state = JSON.parse(readFileSync(statePath, 'utf8')) as CheckState
  const base = `http://localhost:3000/swms/${state.token}`

  try {
    const menu = await page.goto(base)
    expect(menu?.status()).toBe(200)
    await expect(page.getByRole('heading', { name: 'Rosebery Residence' })).toBeVisible()
    await expect(page.getByText(state.zh)).toBeVisible()
    await expect(page.getByText(state.address)).toBeVisible()
    await expect(page.getByText(state.swmsTitle)).toBeVisible()
    await expect(page.getByRole('link', { name: /Incident Report/ })).toBeVisible()

    await page.goto(`${base}/documents`)
    await expect(page.getByText(state.docTitle)).toBeVisible()
    await expect(page.getByText(state.hiddenTitle)).toHaveCount(0)

    await page.goto(`${base}/incident`)
    await expect(page.getByText(state.address)).toBeVisible()

    await page.goto(`${base}/induction`)
    await expect(page.getByText(/Landscaping & External Finishes/)).toBeVisible()
    await expect(page.getByText(/Electrical & Mechanical Services/)).toHaveCount(0)
    await page.getByRole('checkbox', { name: /Landscaping & External Finishes/ }).check()
    await page.getByRole('button', { name: /Next/ }).click()
    await page.getByRole('textbox', { name: /Full name/ }).fill('Consistency Worker')
    await page.getByRole('textbox', { name: /Phone/ }).fill('0400 111 222')
    await page.getByRole('button', { name: /Next/ }).click()
    await page.getByRole('button', { name: /Next/ }).click()
    await expect(page.getByText(state.question)).toBeVisible()

    run('clear-trades')
    await page.goto(`${base}/induction`)
    await expect(page.getByText(/no trades enabled yet/i)).toBeVisible()

    run('reseed')
    await page.reload()
    await expect(page.getByText(/no trades enabled yet/i)).toBeVisible()
    await page.goto(`${base}/documents`)
    await expect(page.getByText(state.docTitle)).toBeVisible()
    await expect(page.getByText(state.address)).toBeVisible()
    await expect(page.getByText(state.hiddenTitle)).toHaveCount(0)

    const pdf = await page.request.get(`${base}/files/${state.fitoutToken}`)
    expect(pdf.status()).toBe(200)
    expect(pdf.headers()['content-type']).toContain('application/pdf')
    expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-')

    const missing = await page.request.get(`${base}/files/not-a-real-token-0000000000`)
    expect(missing.status()).toBe(404)
    const unknownProject = await page.request.get(
      'http://localhost:3000/swms/not-a-real-project-token-0001',
    )
    expect(unknownProject.status()).toBe(404)
    const closed = await page.request.get(
      'http://localhost:3000/api/swms-files/file/swms-interior-fit-out.pdf',
    )
    expect(closed.status()).toBe(403)
  } finally {
    run('restore')
  }
})

function run(mode: string) {
  execFileSync('pnpm', ['payload', 'run', 'src/scripts/swms-consistency.ts'], {
    env: { ...process.env, SWMS_CHECK: mode },
    stdio: 'inherit',
  })
}
