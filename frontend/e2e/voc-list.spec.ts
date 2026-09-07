import { test, expect } from '@playwright/test'

test.describe('VOC List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/voc')
  })

  test('displays VOC list page', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/VOC/)

    // 검색바 확인
    await expect(page.getByPlaceholder(/search/i)).toBeVisible()

    // 검색 버튼 확인
    await expect(page.getByRole('button', { name: /search/i })).toBeVisible()
  })

  test('search functionality works', async ({ page }) => {
    // 검색어 입력
    await page.getByPlaceholder(/search/i).fill('login')

    // 검색 버튼 클릭
    await page.getByRole('button', { name: /search/i }).click()

    // 검색 결과 확인 (데이터가 있다고 가정)
    // 실제 데이터베이스에 따라 조정 필요
  })

  test('reset button clears filters', async ({ page }) => {
    // 검색어 입력
    await page.getByPlaceholder(/search/i).fill('test')

    // 리셋 버튼 클릭
    await page.getByRole('button', { name: /reset/i }).click()

    // 검색창이 비어있는지 확인
    await expect(page.getByPlaceholder(/search/i)).toHaveValue('')
  })
})
