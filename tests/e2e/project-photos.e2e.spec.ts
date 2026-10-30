import fs from 'fs'
import os from 'os'
import path from 'path'

import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

import { login } from '../helpers/login'
import { seedTestUser, testUser } from '../helpers/seedUser'

const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

test.describe('Admin project photos', () => {
  test.describe.configure({ mode: 'serial' })
  let page: Page

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(180_000)
    await seedTestUser()
    const context = await browser.newContext()
    page = await context.newPage()
    await login({ page, user: testUser })
  })

  test('adds several photos and one featured image while creating a project', async () => {
    test.setTimeout(180_000)
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'project-photos-'))
    const kitchen = path.join(dir, 'kitchen-hero.png')
    const bath = path.join(dir, 'bath-photo.png')
    const extra = path.join(dir, 'extra-room.png')
    fs.writeFileSync(kitchen, TINY_PNG)
    fs.writeFileSync(bath, TINY_PNG)
    fs.writeFileSync(extra, TINY_PNG)

    const stamp = Date.now()
    await page.goto('http://localhost:3000/admin/collections/projects/create')
    await expect(page.getByRole('button', { name: 'Choose photos' })).toBeVisible({
      timeout: 120_000,
    })
    await expect(page.getByText('Save the project first')).toHaveCount(0)

    await page.locator('#field-title').fill(`Photo create ${stamp}`)
    await page.locator('#field-address').fill(`${stamp} Photo Street`)
    await page.locator('input[type="file"][multiple]').setInputFiles([kitchen, bath])

    await expect(page.getByRole('img', { name: 'kitchen hero' })).toBeVisible()
    await expect(page.getByRole('img', { name: 'bath photo' })).toBeVisible()
    await page.getByRole('button', { name: 'Set as featured image' }).click()
    await expect(page.getByRole('button', { name: 'Featured image', exact: true })).toBeVisible()

    await page.locator('#action-save').click()
    await page.waitForURL(/\/admin\/collections\/projects\/\d+$/, { timeout: 120_000 })

    const projectID = page.url().match(/\/projects\/(\d+)$/)?.[1]
    expect(projectID).toBeTruthy()

    const created = await galleryDocs(page.request, projectID as string)
    expect(created.titles).toEqual(['bath photo', 'kitchen hero'])
    expect(created.featuredImage).toBe(created.mediaIDs[0])

    const featuredCard = page
      .locator('div')
      .filter({ has: page.locator('img[alt="bath photo"]') })
      .last()
    await expect(featuredCard.locator('button[aria-pressed="true"]')).toBeVisible()

    await page.locator('input[type="file"][multiple]').setInputFiles(extra)
    await expect(page.getByRole('img', { name: 'extra room' })).toBeVisible({ timeout: 60_000 })

    const withExtra = await galleryDocs(page.request, projectID as string)
    expect(withExtra.titles).toEqual(['bath photo', 'kitchen hero', 'extra room'])

    const kitchenCard = page
      .locator('div')
      .filter({ has: page.locator('img[alt="kitchen hero"]') })
      .last()
    await kitchenCard.getByRole('button', { name: 'Set as featured image' }).click()
    await expect(page.locator('#action-save-draft')).toBeEnabled()
    await page.locator('#action-save-draft').click()
    await page.waitForResponse(
      (response) =>
        response.url().includes(`/api/projects/${projectID}`) &&
        response.request().method() === 'PATCH' &&
        response.ok(),
    )

    const updated = await galleryDocs(page.request, projectID as string)
    expect(updated.titles).toEqual(['bath photo', 'kitchen hero', 'extra room'])
    expect(updated.featuredImage).toBe(updated.mediaIDs[1])
  })
})

async function galleryDocs(request: APIRequestContext, projectID: string) {
  const projectResponse = await request.get(
    `http://localhost:3000/api/projects/${projectID}?depth=0&draft=true`,
  )
  expect(projectResponse.ok()).toBeTruthy()
  const project = (await projectResponse.json()) as {
    featuredImage?: number | { id?: number } | null
  }
  const featuredImage =
    typeof project.featuredImage === 'object' ? project.featuredImage?.id : project.featuredImage

  const imagesResponse = await request.get(
    `http://localhost:3000/api/project-images?depth=0&limit=20&sort=displayOrder&where[project][equals]=${projectID}`,
  )
  expect(imagesResponse.ok()).toBeTruthy()
  const body = (await imagesResponse.json()) as {
    docs: { image?: number | { id?: number }; title?: string }[]
  }
  return {
    featuredImage,
    mediaIDs: body.docs.map((doc) => (typeof doc.image === 'object' ? doc.image?.id : doc.image)),
    titles: body.docs.map((doc) => doc.title),
  }
}
