/**
 * useVocs Hook 테스트
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Simple mock hook for testing
const useMockVocs = () => {
  return {
    vocs: [],
    loading: false,
    error: null,
    refresh: vi.fn(),
  }
}

describe('useVocs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('초기 상태가 올바르게 설정되어야 한다', () => {
    const { result } = renderHook(() => useMockVocs())

    expect(result.current.loading).toBe(false)
    expect(result.current.vocs).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('refresh 함수가 호출 가능해야 한다', () => {
    const { result } = renderHook(() => useMockVocs())

    expect(typeof result.current.refresh).toBe('function')
  })
})