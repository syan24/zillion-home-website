import { expect, test } from '@playwright/test'
import config from '@payload-config'
import { getPayload } from 'payload'

test.describe('Marketing baseline', () => {
  test('home, services, and about show the seeded nav and footer', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await expect(page).toHaveTitle(/Zillion Home/)
    await expect(page.getByRole('navigation')).toContainText(/Our Services|我们的服务|Home|首页/)
    await expect(page.locator('footer')).toContainText(/Zillion Home/)
    await expect(page.locator('h1').first()).toBeVisible()

    await page.goto('http://localhost:3000/services')
    await expect(page).toHaveTitle(/Zillion Home/)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()

    await page.goto('http://localhost:3000/about')
    await expect(page).toHaveTitle(/Zillion Home/)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('a seeded SWMS PDF route returns the file', async ({ request }) => {
    const payload = await getPayload({ config })
    const swms = await payload.find({
      collection: 'project-swms',
      depth: 0,
      limit: 50,
      overrideAccess: true,
      where: { status: { equals: 'active' } },
    })
    let publicToken = ''
    let accessToken = ''
    for (const item of swms.docs) {
      if (!item.publicToken || !item.project) continue
      const projectId = typeof item.project === 'object' ? item.project.id : item.project
      const documents = await payload.find({
        collection: 'swms-documents',
        depth: 0,
        limit: 5,
        overrideAccess: true,
        where: {
          and: [{ project: { equals: projectId } }, { status: { equals: 'active' } }],
        },
      })
      const document = documents.docs.find((doc) => doc.accessToken)
      if (document?.accessToken) {
        publicToken = item.publicToken
        accessToken = document.accessToken
        break
      }
    }
    expect(publicToken, 'seed an active project SWMS and PDF before this smoke test').toBeTruthy()
    expect(accessToken, 'seed an active SWMS PDF before this smoke test').toBeTruthy()

    const response = await request.get(
      `http://localhost:3000/swms/${publicToken}/files/${accessToken}`,
    )
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type'] || '').toMatch(/pdf/)
    const body = await response.body()
    expect(body.subarray(0, 4).toString()).toBe('%PDF')
  })
})
