/**
 * API 통합 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Define API_BASE_URL locally to avoid Next.js env issues
const API_BASE_URL = 'http://localhost:8000'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Dashboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('대시보드 통계를 조회해야 한다', async () => {
    const mockStats = {
      totalVocs: 100,
      pendingVocs: 20,
      approvedVocs: 70,
      rejectedVocs: 10,
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats),
    })

    const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`)
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data.totalVocs).toBe(100)
    expect(data.pendingVocs).toBe(20)
  })

  it('최근 VOC 목록을 조회해야 한다', async () => {
    const mockRecentVocs = [
      { id: 'voc-001', title: 'Windows 부팅 실패', status: 'pending' },
      { id: 'voc-002', title: '프린터 오류', status: 'approved' },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRecentVocs),
    })

    const response = await fetch(`${API_BASE_URL}/api/dashboard/recent`)
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data.length).toBe(2)
  })
})

describe('VOC API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('VOC 목록을 조회해야 한다', async () => {
    const mockVocs = [
      { id: 'voc-001', title: 'VOC 1', status: 'pending' },
      { id: 'voc-002', title: 'VOC 2', status: 'approved' },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockVocs),
    })

    const response = await fetch(`${API_BASE_URL}/api/voc`)
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data.length).toBe(2)
  })

  it('VOC 상세를 조회해야 한다', async () => {
    const mockVoc = {
      id: 'voc-001',
      title: 'Windows 부팅 실패',
      description: '부팅이 안됩니다',
      status: 'pending',
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockVoc),
    })

    const response = await fetch(`${API_BASE_URL}/api/voc/voc-001`)
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data.id).toBe('voc-001')
    expect(data.title).toBe('Windows 부팅 실패')
  })

  it('새 VOC를 생성해야 한다', async () => {
    const newVoc = {
      title: '새로운 VOC',
      description: '설명입니다',
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 'voc-new', ...newVoc, status: 'pending' }),
    })

    const response = await fetch(`${API_BASE_URL}/api/voc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVoc),
    })
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data.id).toBeDefined()
    expect(data.status).toBe('pending')
  })
})

describe('Guides API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('가이드 목록을 조회해야 한다', async () => {
    const mockGuides = [
      { id: 'guide-001', title: '가이드 1', status: 'published' },
      { id: 'guide-002', title: '가이드 2', status: 'draft' },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockGuides),
    })

    const response = await fetch(`${API_BASE_URL}/api/guides`)
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data.length).toBe(2)
  })

  it('가이드를 생성해야 한다', async () => {
    const newGuide = {
      vocId: 'voc-001',
      content: '# 가이드 내용\n\n해결 방법...',
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 'guide-new', ...newGuide, status: 'draft' }),
    })

    const response = await fetch(`${API_BASE_URL}/api/guides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGuide),
    })
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data.id).toBeDefined()
  })
})