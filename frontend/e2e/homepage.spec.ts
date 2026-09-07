import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads homepage successfully', async ({ page }) => {
    await page.goto('/')

    // 메인 헤딩 확인
    await expect(page.locator('h1')).toContainText('VOC Agent')

    // 부제목 확인
    await expect(page.locator('p')).toContainText('AI-powered Voice of Customer Analysis')

    // Get Started 버튼 확인
    const getStartedButton = page.getByRole('link', { name: /get started/i })
    await expect(getStartedButton).toBeVisible()
  })

  test('navigates to dashboard when clicking Get Started', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /get started/i }).click()

    // 대시보드 URL로 이동 확인
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('displays feature cards', async ({ page }) => {
    await page.goto('/')

    // 세 개의 기능 카드 확인
    await expect(page.getByText('VOC Management')).toBeVisible()
    await expect(page.getByText('AI Analysis')).toBeVisible()
    await expect(page.getByText('Approval Flow')).toBeVisible()
  })
})
