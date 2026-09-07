import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  // 1. 기본 렌더링 테스트 - 사용자 관점
  describe('Rendering', () => {
    it('renders button with text content', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
    })

    it('applies primary variant styles by default', () => {
      const { container } = render(<Button>Primary</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-blue-600', 'text-white')
    })

    it('renders with custom className', () => {
      const { container } = render(<Button className="custom-class">Custom</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  // 2. Variant 테스트 - 모든 변형 확인
  describe('Variants', () => {
    it('applies primary variant styles', () => {
      const { container } = render(<Button variant="primary">Primary</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'focus:ring-blue-500')
    })

    it('applies secondary variant styles', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-gray-600', 'hover:bg-gray-700', 'focus:ring-gray-500')
    })

    it('applies outline variant styles', () => {
      const { container } = render(<Button variant="outline">Outline</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('border-2', 'border-gray-300', 'text-gray-700')
    })

    it('applies ghost variant styles', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('text-gray-700', 'hover:bg-gray-100')
    })

    it('applies danger variant styles', () => {
      const { container } = render(<Button variant="danger">Delete</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500')
    })
  })

  // 3. Size 테스트 - 모든 크기 확인
  describe('Sizes', () => {
    it('applies small size styles', () => {
      const { container } = render(<Button size="sm">Small</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
    })

    it('applies medium size styles (default)', () => {
      const { container } = render(<Button size="md">Medium</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('px-4', 'py-2', 'text-base')
    })

    it('applies large size styles', () => {
      const { container } = render(<Button size="lg">Large</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
    })
  })

  // 4. 상호작용 테스트 - 사용자 행동 시뮬레이션
  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      const button = screen.getByRole('button', { name: /click me/i })
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} disabled>Disabled</Button>)

      const button = screen.getByRole('button', { name: /disabled/i })
      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('passes event to onClick handler', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Submit</Button>)

      const button = screen.getByRole('button', { name: /submit/i })
      await user.click(button)

      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'click',
        })
      )
    })
  })

  // 5. Disabled 상태 테스트
  describe('Disabled State', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button', { name: /disabled button/i })
      expect(button).toBeDisabled()
    })

    it('applies disabled styles', () => {
      const { container } = render(<Button disabled>Disabled</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
    })
  })

  // 6. 접근성 테스트
  describe('Accessibility', () => {
    it('has proper ARIA role', () => {
      render(<Button>Accessible</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('passes through additional HTML attributes', () => {
      render(<Button aria-label="Close dialog" data-testid="close-btn">×</Button>)
      const button = screen.getByLabelText('Close dialog')
      expect(button).toHaveAttribute('data-testid', 'close-btn')
    })

    it('is focusable element', () => {
      render(<Button>Focusable</Button>)
      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })
  })

  // 7. ref 전달 테스트
  describe('Ref Forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = { current: null as HTMLButtonElement | null }
      render(<Button ref={ref}>With Ref</Button>)

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current?.textContent).toBe('With Ref')
    })
  })

  // 8. 복합 테스트 - 여러 prop 조합
  describe('Combined Props', () => {
    it('applies both variant and size correctly', () => {
      const { container } = render(
        <Button variant="danger" size="lg">
          Delete All
        </Button>
      )
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-red-600', 'px-6', 'py-3', 'text-lg')
    })

    it('combines all props together', () => {
      const { container } = render(
        <Button variant="outline" size="sm" disabled className="extra-class">
          Combined
        </Button>
      )
      const button = container.querySelector('button')
      expect(button).toHaveClass(
        'border-2',
        'px-3',
        'py-1.5',
        'text-sm',
        'extra-class',
        'disabled:opacity-50'
      )
      expect(button).toBeDisabled()
    })
  })
})
