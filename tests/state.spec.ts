import { test, expect } from '@playwright/test'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/')
})

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/React State Update Timing Issue/)
})

test('더블클릭 테스트', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Click me' })

  await button.click()
  await delay(10)
  await button.click()

  await expect(page.getByText('Count: 2')).toBeVisible()
})
