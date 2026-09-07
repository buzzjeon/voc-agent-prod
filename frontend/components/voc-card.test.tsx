import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VOCCard } from '@/components/voc-card'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('VOCCard Component', () => {
  const mockVOC = {
    id: 'voc-123',
    jiraKey: 'VOC-001',
    title: 'Login page not loading',
    description: 'Users are unable to access the login page due to a timeout error.',
    category: 'Authentication',
    priority: 'high',
    status: 'analyzing',
    createdAt: '2026-05-19T10:00:00Z',
  }

  // 기본 렌더링 테스트
  describe('Rendering', () => {
    it('renders VOC card with all information', () => {
      render(<VOCCard voc={mockVOC} />)

      expect(screen.getByText('VOC-001')).toBeInTheDocument()
      expect(screen.getByText('Login page not loading')).toBeInTheDocument()
      expect(screen.getByText(/Users are unable to access/)).toBeInTheDocument()
      expect(screen.getByText('Authentication')).toBeInTheDocument()
    })

    it('renders as a link to VOC detail page', () => {
      render(<VOCCard voc={mockVOC} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/voc/voc-123')
    })

    it('displays formatted date', () => {
      render(<VOCCard voc={mockVOC} />)
      const dateString = new Date(mockVOC.createdAt).toLocaleDateString()
      expect(screen.getByText(dateString)).toBeInTheDocument()
    })
  })

  // Priority Badge 테스트
  describe('Priority Badge', () => {
    it('displays urgent priority with danger variant', () => {
      const urgentVOC = { ...mockVOC, priority: 'urgent' }
      render(<VOCCard voc={urgentVOC} />)

      const badge = screen.getByText('URGENT')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('displays high priority with warning variant', () => {
      const highVOC = { ...mockVOC, priority: 'high' }
      render(<VOCCard voc={highVOC} />)

      const badge = screen.getByText('HIGH')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800')
    })

    it('displays medium priority with info variant', () => {
      const mediumVOC = { ...mockVOC, priority: 'medium' }
      render(<VOCCard voc={mediumVOC} />)

      const badge = screen.getByText('MEDIUM')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
    })

    it('displays low priority with default variant', () => {
      const lowVOC = { ...mockVOC, priority: 'low' }
      render(<VOCCard voc={lowVOC} />)

      const badge = screen.getByText('LOW')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
    })
  })

  // Status Badge 테스트
  describe('Status Badge', () => {
    it('displays resolved status with success variant', () => {
      const resolvedVOC = { ...mockVOC, status: 'resolved' }
      render(<VOCCard voc={resolvedVOC} />)

      const badge = screen.getByText('RESOLVED')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('displays guide_generated status with info variant', () => {
      const generatedVOC = { ...mockVOC, status: 'guide_generated' }
      render(<VOCCard voc={generatedVOC} />)

      const badge = screen.getByText('GUIDE GENERATED')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
    })

    it('displays analyzing status with warning variant', () => {
      const analyzingVOC = { ...mockVOC, status: 'analyzing' }
      render(<VOCCard voc={analyzingVOC} />)

      const badge = screen.getByText('ANALYZING')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800')
    })

    it('displays unknown status with default variant', () => {
      const unknownVOC = { ...mockVOC, status: 'unknown_status' }
      render(<VOCCard voc={unknownVOC} />)

      const badge = screen.getByText('UNKNOWN STATUS')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
    })
  })

  // 콘텐츠 테스트
  describe('Content Display', () => {
    it('truncates long titles with line-clamp-2', () => {
      const longTitleVOC = {
        ...mockVOC,
        title: 'This is a very long title that should be truncated to two lines when displayed in the card component',
      }
      render(<VOCCard voc={longTitleVOC} />)

      const title = screen.getByText(/This is a very long title/)
      expect(title).toHaveClass('line-clamp-2')
    })

    it('truncates long descriptions with line-clamp-3', () => {
      const longDescVOC = {
        ...mockVOC,
        description: 'This is a very long description that should be truncated to three lines when displayed in the card component. It contains multiple sentences and should demonstrate the line clamping functionality properly.',
      }
      render(<VOCCard voc={longDescVOC} />)

      const description = screen.getByText(/This is a very long description/)
      expect(description).toHaveClass('line-clamp-3')
    })

    it('displays category in styled container', () => {
      render(<VOCCard voc={mockVOC} />)
      const category = screen.getByText('Authentication')
      expect(category).toHaveClass('bg-gray-100', 'px-2', 'py-1', 'rounded')
    })

    it('displays jira key in monospace font', () => {
      render(<VOCCard voc={mockVOC} />)
      const jiraKey = screen.getByText('VOC-001')
      expect(jiraKey).toHaveClass('font-mono', 'text-gray-500')
    })
  })

  // 레이아웃 테스트
  describe('Layout', () => {
    it('renders badges in correct order', () => {
      render(<VOCCard voc={mockVOC} />)

      const badges = screen.getAllByRole('generic').filter(el => el.classList.contains('inline-flex'))
      expect(badges.length).toBeGreaterThanOrEqual(2)
    })

    it('applies hover effect to card', () => {
      const { container } = render(<VOCCard voc={mockVOC} />)
      const card = container.querySelector('.hover\\:shadow-lg')
      expect(card).toBeInTheDocument()
    })
  })

  // 접근성 테스트
  describe('Accessibility', () => {
    it('has proper link structure for navigation', () => {
      render(<VOCCard voc={mockVOC} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/voc/voc-123')
    })

    it('maintains semantic structure', () => {
      render(<VOCCard voc={mockVOC} />)

      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })
  })

  // 다양한 데이터 시나리오
  describe('Different Data Scenarios', () => {
    it('handles empty description gracefully', () => {
      const emptyDescVOC = { ...mockVOC, description: '' }
      render(<VOCCard voc={emptyDescVOC} />)

      expect(screen.getByText('Login page not loading')).toBeInTheDocument()
    })

    it('handles special characters in title', () => {
      const specialCharVOC = {
        ...mockVOC,
        title: 'Error: "Cannot read property" & [undefined]',
      }
      render(<VOCCard voc={specialCharVOC} />)

      expect(screen.getByText(/Error: "Cannot read property"/)).toBeInTheDocument()
    })

    it('handles unicode characters', () => {
      const unicodeVOC = {
        ...mockVOC,
        title: '한글 제목 🚀 Test',
        description: '日本語の説明 中文描述',
      }
      render(<VOCCard voc={unicodeVOC} />)

      expect(screen.getByText('한글 제목 🚀 Test')).toBeInTheDocument()
      expect(screen.getByText('日本語の説明 中文描述')).toBeInTheDocument()
    })

    it('handles very old dates', () => {
      const oldDateVOC = {
        ...mockVOC,
        createdAt: '2020-01-01T00:00:00Z',
      }
      render(<VOCCard voc={oldDateVOC} />)

      const dateString = new Date(oldDateVOC.createdAt).toLocaleDateString()
      expect(screen.getByText(dateString)).toBeInTheDocument()
    })
  })

  // 실제 사용 시나리오
  describe('Real-world Usage', () => {
    it('displays typical VOC card correctly', () => {
      const typicalVOC = {
        id: 'voc-456',
        jiraKey: 'VOC-789',
        title: 'Payment gateway timeout',
        description: 'Customers report payment failures during checkout process.',
        category: 'Payments',
        priority: 'urgent',
        status: 'resolved',
        createdAt: '2026-05-18T15:30:00Z',
      }

      render(<VOCCard voc={typicalVOC} />)

      expect(screen.getByText('VOC-789')).toBeInTheDocument()
      expect(screen.getByText('Payment gateway timeout')).toBeInTheDocument()
      expect(screen.getByText('URGENT')).toBeInTheDocument()
      expect(screen.getByText('RESOLVED')).toBeInTheDocument()
      expect(screen.getByText('Payments')).toBeInTheDocument()
    })

    it('links to correct detail page', () => {
      render(<VOCCard voc={mockVOC} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/voc/voc-123')
    })
  })
})
