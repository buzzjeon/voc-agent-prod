import { test, expect } from '@playwright/test'

test.describe('User Journey', () => {
  test('complete user flow from home to dashboard', async ({ page }) => {
    // 1. 홈페이지 접속
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('VOC Agent')

    // 2. Get Started 클릭
    await page.getByRole('link', { name: /get started/i }).click()
    await expect(page).toHaveURL(/\/dashboard/)

    // 3. 대시보드 로드 확인
    await expect(page.locator('body')).toBeVisible()
  })

  test('navigation between pages', async ({ page }) => {
    // 홈페이지에서 시작
    await page.goto('/')

    // Get Started로 이동
    await page.getByRole('link', { name: /get started/i }).click()
    await expect(page).toHaveURL(/\/dashboard/)

    // 뒤로 가기
    await page.goBack()
    await expect(page).toHaveURL('/')

    // 앞으로 가기
    await page.goForward()
    await expect(page).toHaveURL(/\/dashboard/)
  })
})
