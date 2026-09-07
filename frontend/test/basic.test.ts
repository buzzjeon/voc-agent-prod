/**
 * 간단한 테스트 - vitest 동작 확인
 */

import { describe, it, expect } from 'vitest'

describe('Basic Test', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2)
  })

  it('should work with strings', () => {
    expect('hello').toBe('hello')
  })
})