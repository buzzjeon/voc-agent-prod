import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
  // 기본 렌더링 테스트
  describe('Rendering', () => {
    it('renders badge with text content', () => {
      render(<Badge>New</Badge>)
      const badge = screen.getByText('New')
      expect(badge).toBeInTheDocument()
    })

    it('applies default variant styles', () => {
      const { container } = render(<Badge>Default</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
    })

    it('renders with custom className', () => {
      const { container } = render(<Badge className="custom-class">Custom</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('custom-class')
    })
  })

  // Variant 테스트 - 모든 변형 확인
  describe('Variants', () => {
    it('applies success variant styles', () => {
      const { container } = render(<Badge variant="success">Success</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('applies warning variant styles', () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800')
    })

    it('applies danger variant styles', () => {
      const { container } = render(<Badge variant="danger">Error</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('applies info variant styles', () => {
      const { container } = render(<Badge variant="info">Info</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
    })

    it('applies default variant when not specified', () => {
      const { container } = render(<Badge>No Variant</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
    })
  })

  // 스타일 클래스 테스트
  describe('Styling', () => {
    it('has rounded-full class for pill shape', () => {
      const { container } = render(<Badge>Pill</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('rounded-full')
    })

    it('has inline-flex for layout', () => {
      const { container } = render(<Badge>Inline</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('inline-flex')
    })

    it('has text-xs font-medium for typography', () => {
      const { container } = render(<Badge>Small Text</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('text-xs', 'font-medium')
    })

    it('has proper padding', () => {
      const { container } = render(<Badge>Padded</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('px-2.5', 'py-0.5')
    })
  })

  // 접근성 테스트
  describe('Accessibility', () => {
    it('passes through additional HTML attributes', () => {
      render(<Badge aria-label="Status: New" data-testid="status-badge">New</Badge>)
      const badge = screen.getByLabelText('Status: New')
      expect(badge).toHaveAttribute('data-testid', 'status-badge')
    })

    it('supports custom id', () => {
      const { container } = render(<Badge id="custom-id">With ID</Badge>)
      const badge = container.querySelector('span')
      expect(badge).toHaveAttribute('id', 'custom-id')
    })
  })

  // 콘텐츠 테스트
  describe('Content', () => {
    it('renders single word', () => {
      render(<Badge>Single</Badge>)
      expect(screen.getByText('Single')).toBeInTheDocument()
    })

    it('renders multiple words', () => {
      render(<Badge>Multiple Words Here</Badge>)
      expect(screen.getByText('Multiple Words Here')).toBeInTheDocument()
    })

    it('renders numbers', () => {
      render(<Badge>42</Badge>)
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('renders special characters', () => {
      render(<Badge>C++ & Java</Badge>)
      expect(screen.getByText('C++ & Java')).toBeInTheDocument()
    })

    it('renders emoji', () => {
      render(<Badge>🚀 New</Badge>)
      expect(screen.getByText('🚀 New')).toBeInTheDocument()
    })
  })

  // ref 전달 테스트
  describe('Ref Forwarding', () => {
    it('forwards ref to span element', () => {
      const ref = { current: null as HTMLSpanElement | null }
      render(<Badge ref={ref}>With Ref</Badge>)

      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
      expect(ref.current?.textContent).toBe('With Ref')
    })
  })

  // 복합 테스트
  describe('Combined Props', () => {
    it('combines variant and custom className', () => {
      const { container } = render(
        <Badge variant="success" className="extra-class">
          Combined
        </Badge>
      )
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'extra-class')
    })

    it('applies all props together', () => {
      const { container } = render(
        <Badge variant="danger" className="test-class" data-value="error">
          Error
        </Badge>
      )
      const badge = container.querySelector('span')
      expect(badge).toHaveClass('bg-red-100', 'text-red-800', 'test-class')
      expect(badge).toHaveAttribute('data-value', 'error')
    })
  })

  // 실제 사용 시나리오 테스트
  describe('Real-world Scenarios', () => {
    it('displays status badge correctly', () => {
      render(<Badge variant="success">Active</Badge>)
      const badge = screen.getByText('Active')
      expect(badge).toHaveClass('bg-green-100', 'text-green-800')
    })

    it('displays priority badge correctly', () => {
      render(<Badge variant="danger">Urgent</Badge>)
      const badge = screen.getByText('Urgent')
      expect(badge).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('displays category badge correctly', () => {
      render(<Badge variant="info">Feature</Badge>)
      const badge = screen.getByText('Feature')
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
    })
  })
})
