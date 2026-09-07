import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card'

describe('Card Component', () => {
  // 기본 렌더링 테스트
  describe('Card', () => {
    it('renders card with children', () => {
      render(<Card>Card Content</Card>)
      const card = screen.getByText('Card Content')
      expect(card).toBeInTheDocument()
    })

    it('applies default styles', () => {
      const { container } = render(<Card>Default</Card>)
      const card = container.querySelector('div')
      expect(card).toHaveClass('bg-white', 'rounded-lg', 'border', 'border-gray-200', 'shadow-sm')
    })

    it('renders with custom className', () => {
      const { container } = render(<Card className="custom-class">Custom</Card>)
      const card = container.querySelector('div')
      expect(card).toHaveClass('custom-class')
    })

    it('does not apply hover styles by default', () => {
      const { container } = render(<Card>No Hover</Card>)
      const card = container.querySelector('div')
      expect(card).not.toHaveClass('hover:shadow-lg', 'hover:border-gray-300')
    })
  })

  // Hover 효과 테스트
  describe('Card with Hover', () => {
    it('applies hover styles when hover prop is true', () => {
      const { container } = render(<Card hover>Hoverable</Card>)
      const card = container.querySelector('div')
      expect(card).toHaveClass('hover:shadow-lg', 'hover:border-gray-300', 'transition-all', 'cursor-pointer')
    })

    it('combines hover styles with custom className', () => {
      const { container } = render(
        <Card hover className="extra-class">
          Combined
        </Card>
      )
      const card = container.querySelector('div')
      expect(card).toHaveClass('hover:shadow-lg', 'extra-class')
    })
  })

  // CardHeader 테스트
  describe('CardHeader', () => {
    it('renders header with children', () => {
      render(<CardHeader>Header Content</CardHeader>)
      const header = screen.getByText('Header Content')
      expect(header).toBeInTheDocument()
    })

    it('applies header styles', () => {
      const { container } = render(<CardHeader>Header</CardHeader>)
      const header = container.querySelector('div')
      expect(header).toHaveClass('px-6', 'py-4', 'border-b', 'border-gray-200')
    })

    it('renders with custom className', () => {
      const { container } = render(<CardHeader className="custom-header">Custom</CardHeader>)
      const header = container.querySelector('div')
      expect(header).toHaveClass('custom-header')
    })
  })

  // CardBody 테스트
  describe('CardBody', () => {
    it('renders body with children', () => {
      render(<CardBody>Body Content</CardBody>)
      const body = screen.getByText('Body Content')
      expect(body).toBeInTheDocument()
    })

    it('applies body styles', () => {
      const { container } = render(<CardBody>Body</CardBody>)
      const body = container.querySelector('div')
      expect(body).toHaveClass('px-6', 'py-4')
    })

    it('renders with custom className', () => {
      const { container } = render(<CardBody className="custom-body">Custom</CardBody>)
      const body = container.querySelector('div')
      expect(body).toHaveClass('custom-body')
    })
  })

  // CardFooter 테스트
  describe('CardFooter', () => {
    it('renders footer with children', () => {
      render(<CardFooter>Footer Content</CardFooter>)
      const footer = screen.getByText('Footer Content')
      expect(footer).toBeInTheDocument()
    })

    it('applies footer styles', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)
      const footer = container.querySelector('div')
      expect(footer).toHaveClass('px-6', 'py-4', 'border-t', 'border-gray-200')
    })

    it('renders with custom className', () => {
      const { container } = render(<CardFooter className="custom-footer">Custom</CardFooter>)
      const footer = container.querySelector('div')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  // 복합 사용 테스트
  describe('Combined Usage', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>Title</CardHeader>
          <CardBody>Content</CardBody>
          <CardFooter>Actions</CardFooter>
        </Card>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
    })

    it('applies correct borders between sections', () => {
      const { container } = render(
        <Card>
          <CardHeader>Header</CardHeader>
          <CardBody>Body</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      )

      const sections = container.querySelectorAll('div')
      const header = Array.from(sections).find(el => el.textContent === 'Header')
      const footer = Array.from(sections).find(el => el.textContent === 'Footer')

      expect(header).toHaveClass('border-b')
      expect(footer).toHaveClass('border-t')
    })

    it('renders card with only body', () => {
      render(
        <Card>
          <CardBody>Only Body</CardBody>
        </Card>
      )

      expect(screen.getByText('Only Body')).toBeInTheDocument()
    })

    it('renders card with header and body', () => {
      render(
        <Card>
          <CardHeader>Header</CardHeader>
          <CardBody>Body</CardBody>
        </Card>
      )

      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Body')).toBeInTheDocument()
    })

    it('renders card with body and footer', () => {
      render(
        <Card>
          <CardBody>Body</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Body')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })

  // 접근성 테스트
  describe('Accessibility', () => {
    it('passes through additional HTML attributes to Card', () => {
      const { container } = render(<Card data-testid="test-card" role="article">Accessible</Card>)
      const card = container.querySelector('[data-testid="test-card"]')
      expect(card).toHaveAttribute('role', 'article')
    })

    it('passes through additional HTML attributes to CardHeader', () => {
      const { container } = render(<CardHeader aria-level="2">Header</CardHeader>)
      const header = container.querySelector('[aria-level="2"]')
      expect(header).toBeInTheDocument()
    })

    it('passes through additional HTML attributes to CardBody', () => {
      const { container } = render(<CardBody id="body-content">Body</CardBody>)
      const body = container.querySelector('#body-content')
      expect(body).toBeInTheDocument()
    })

    it('passes through additional HTML attributes to CardFooter', () => {
      const { container } = render(<CardFooter aria-label="Card actions">Footer</CardFooter>)
      const footer = container.querySelector('[aria-label="Card actions"]')
      expect(footer).toBeInTheDocument()
    })
  })

  // ref 전달 테스트
  describe('Ref Forwarding', () => {
    it('forwards ref to Card element', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<Card ref={ref}>With Ref</Card>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current?.textContent).toBe('With Ref')
    })

    it('forwards ref to CardHeader element', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<CardHeader ref={ref}>Header Ref</CardHeader>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current?.textContent).toBe('Header Ref')
    })

    it('forwards ref to CardBody element', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<CardBody ref={ref}>Body Ref</CardBody>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current?.textContent).toBe('Body Ref')
    })

    it('forwards ref to CardFooter element', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<CardFooter ref={ref}>Footer Ref</CardFooter>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current?.textContent).toBe('Footer Ref')
    })
  })

  // 실제 사용 시나리오 테스트
  describe('Real-world Scenarios', () => {
    it('renders a typical dashboard card', () => {
      render(
        <Card hover>
          <CardHeader>
            <h3>Statistics</h3>
          </CardHeader>
          <CardBody>
            <p>Total Users: 1,234</p>
          </CardBody>
          <CardFooter>
            <button>View Details</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Statistics')).toBeInTheDocument()
      expect(screen.getByText('Total Users: 1,234')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'View Details' })).toBeInTheDocument()
    })

    it('renders a simple content card', () => {
      render(
        <Card>
          <CardBody>
            <h4>Simple Card</h4>
            <p>This is a simple card with just body content.</p>
          </CardBody>
        </Card>
      )

      expect(screen.getByText('Simple Card')).toBeInTheDocument()
      expect(screen.getByText('This is a simple card with just body content.')).toBeInTheDocument()
    })
  })
})
