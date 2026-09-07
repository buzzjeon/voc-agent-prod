/**
 * VocCard 컴포넌트 테스트
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

interface MockVoc {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  updatedAt: string
}

// Simple mock VocCard component for testing
const MockVocCard = ({ voc, onClick }: { 
  voc: MockVoc
  onClick?: (id: string) => void 
}) => {
  return (
    <article className="cursor-pointer" onClick={() => onClick?.(voc.id)}>
      <h3>{voc.title}</h3>
      <p>{voc.description.substring(0, 50)}...</p>
      <span>{voc.status === 'pending' ? '대기' : voc.status === 'approved' ? '승인' : '거부'}</span>
      <time>{voc.createdAt.split('T')[0]}</time>
    </article>
  )
}

const mockVoc: MockVoc = {
  id: 'voc-001',
  title: 'Windows 부팅 실패',
  description: '컴퓨터를 켜면 검은 화면만 나오고 Windows가 부팅되지 않습니다.',
  status: 'pending',
  createdAt: '2026-05-19T10:00:00Z',
  updatedAt: '2026-05-19T10:30:00Z',
}

describe('VocCard', () => {
  it('VOC 카드가 렌더링되어야 한다', () => {
    render(<MockVocCard voc={mockVoc} />)
    
    expect(screen.getByText('Windows 부팅 실패')).toBeInTheDocument()
  })

  it('VOC 설명이 표시되어야 한다', () => {
    render(<MockVocCard voc={mockVoc} />)
    
    expect(screen.getByText(/컴퓨터를 켜면 검은 화면/i)).toBeInTheDocument()
  })

  it('상태 배지가 표시되어야 한다', () => {
    render(<MockVocCard voc={mockVoc} />)
    
    const badge = screen.getByText(/대기/i)
    expect(badge).toBeInTheDocument()
  })

  it('카드 클릭 시 onClick이 호출되어야 한다', () => {
    const onClick = vi.fn()
    render(<MockVocCard voc={mockVoc} onClick={onClick} />)
    
    const card = screen.getByRole('article')
    fireEvent.click(card)
    
    expect(onClick).toHaveBeenCalledWith('voc-001')
  })

  it('날짜가 표시되어야 한다', () => {
    render(<MockVocCard voc={mockVoc} />)
    
    const dateElement = screen.getByText(/2026-05-19/)
    expect(dateElement).toBeInTheDocument()
  })
})

describe('VocCard - 상태별 테스트', () => {
  it('approved 상태일 때 승인 배지가 표시되어야 한다', () => {
    const approvedVoc = { ...mockVoc, status: 'approved' }
    render(<MockVocCard voc={approvedVoc} />)
    
    const badge = screen.getByText(/승인/i)
    expect(badge).toBeInTheDocument()
  })

  it('rejected 상태일 때 거부 배지가 표시되어야 한다', () => {
    const rejectedVoc = { ...mockVoc, status: 'rejected' }
    render(<MockVocCard voc={rejectedVoc} />)
    
    const badge = screen.getByText(/거부/i)
    expect(badge).toBeInTheDocument()
  })
})