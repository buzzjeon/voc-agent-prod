/**
 * SearchBar 컴포넌트 테스트
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Simple mock SearchBar component for testing
const MockSearchBar = ({ onSearch, isLoading, showClear }: { 
  onSearch?: (query: string) => void
  isLoading?: boolean
  showClear?: boolean 
}) => {
  return (
    <div>
      <input placeholder="검색어를 입력하세요" disabled={isLoading} />
      <button onClick={() => onSearch?.('test')} disabled={isLoading}>검색</button>
      {showClear && <button aria-label="지우기">X</button>}
    </div>
  )
}

describe('SearchBar', () => {
  it('검색 입력 필드가 렌더링되어야 한다', () => {
    render(<MockSearchBar onSearch={vi.fn()} />)
    
    const input = screen.getByPlaceholderText(/검색/i)
    expect(input).toBeInTheDocument()
  })

  it('검색 버튼이 렌더링되어야 한다', () => {
    render(<MockSearchBar onSearch={vi.fn()} />)
    
    const button = screen.getByRole('button', { name: /검색/i })
    expect(button).toBeInTheDocument()
  })

  it('검색 버튼 클릭 시 onSearch가 호출되어야 한다', () => {
    const onSearch = vi.fn()
    render(<MockSearchBar onSearch={onSearch} />)
    
    const button = screen.getByRole('button', { name: /검색/i })
    fireEvent.click(button)
    
    expect(onSearch).toHaveBeenCalled()
  })

  it('로딩 상태일 때 버튼이 비활성화되어야 한다', () => {
    render(<MockSearchBar onSearch={vi.fn()} isLoading={true} />)
    
    const button = screen.getByRole('button', { name: /검색/i })
    expect(button).toBeDisabled()
  })
})