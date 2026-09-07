import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SearchBar } from '@/components/search-bar'

describe('SearchBar Component', () => {
  let user: ReturnType<typeof userEvent.setup>
  const mockOnSearch = vi.fn()

  beforeEach(() => {
    user = userEvent.setup()
    mockOnSearch.mockClear()
  })

  // 기본 렌더링 테스트
  describe('Rendering', () => {
    it('renders search input field', () => {
      render(<SearchBar onSearch={mockOnSearch} />)
      const searchInput = screen.getByLabelText('Search')
      expect(searchInput).toBeInTheDocument()
    })

    it('renders search and reset buttons', () => {
      render(<SearchBar onSearch={mockOnSearch} />)

      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    })

    it('does not render category select when categories is empty', () => {
      render(<SearchBar onSearch={mockOnSearch} categories={[]} />)
      expect(screen.queryByLabelText('Category')).not.toBeInTheDocument()
    })

    it('does not render status select when statuses is empty', () => {
      render(<SearchBar onSearch={mockOnSearch} statuses={[]} />)
      expect(screen.queryByLabelText('Status')).not.toBeInTheDocument()
    })

    it('does not render priority select when priorities is empty or showPriority is false', () => {
      const { rerender } = render(<SearchBar onSearch={mockOnSearch} priorities={[]} />)
      expect(screen.queryByLabelText('Priority')).not.toBeInTheDocument()

      rerender(<SearchBar onSearch={mockOnSearch} priorities={[{ value: 'high', label: 'High' }]} showPriority={false} />)
      expect(screen.queryByLabelText('Priority')).not.toBeInTheDocument()
    })
  })

  // 필드 렌더링 테스트
  describe('Filter Fields', () => {
    it('renders category select with options', () => {
      const categories = ['Authentication', 'Payments', 'UI']
      render(<SearchBar onSearch={mockOnSearch} categories={categories} />)

      const categorySelect = screen.getByLabelText('Category')
      expect(categorySelect).toBeInTheDocument()

      expect(screen.getByText('All Categories')).toBeInTheDocument()
      expect(screen.getByText('Authentication')).toBeInTheDocument()
      expect(screen.getByText('Payments')).toBeInTheDocument()
      expect(screen.getByText('UI')).toBeInTheDocument()
    })

    it('renders status select with options', () => {
      const statuses = [
        { value: 'open', label: 'Open' },
        { value: 'resolved', label: 'Resolved' },
      ]
      render(<SearchBar onSearch={mockOnSearch} statuses={statuses} />)

      const statusSelect = screen.getByLabelText('Status')
      expect(statusSelect).toBeInTheDocument()

      expect(screen.getByText('All Statuses')).toBeInTheDocument()
      expect(screen.getByText('Open')).toBeInTheDocument()
      expect(screen.getByText('Resolved')).toBeInTheDocument()
    })

    it('renders priority select with options when showPriority is true', () => {
      const priorities = [
        { value: 'urgent', label: 'Urgent' },
        { value: 'high', label: 'High' },
      ]
      render(<SearchBar onSearch={mockOnSearch} priorities={priorities} showPriority={true} />)

      const prioritySelect = screen.getByLabelText('Priority')
      expect(prioritySelect).toBeInTheDocument()

      expect(screen.getByText('All Priorities')).toBeInTheDocument()
      expect(screen.getByText('Urgent')).toBeInTheDocument()
      expect(screen.getByText('High')).toBeInTheDocument()
    })
  })

  // 검색 기능 테스트
  describe('Search Functionality', () => {
    it('calls onSearch with search term when form is submitted', async () => {
      render(<SearchBar onSearch={mockOnSearch} />)

      const searchInput = screen.getByLabelText('Search')
      await user.type(searchInput, 'login error')

      const searchButton = screen.getByRole('button', { name: 'Search' })
      await user.click(searchButton)

      expect(mockOnSearch).toHaveBeenCalledWith({
        search: 'login error',
        category: undefined,
        status: undefined,
        priority: undefined,
      })
    })

    it('calls onSearch with all filters when form is submitted', async () => {
      const categories = ['Authentication']
      const statuses = [{ value: 'open', label: 'Open' }]
      const priorities = [{ value: 'urgent', label: 'Urgent' }]

      render(
        <SearchBar
          onSearch={mockOnSearch}
          categories={categories}
          statuses={statuses}
          priorities={priorities}
        />
      )

      await user.type(screen.getByLabelText('Search'), 'test')
      await user.selectOptions(screen.getByLabelText('Category'), 'Authentication')
      await user.selectOptions(screen.getByLabelText('Status'), 'open')
      await user.selectOptions(screen.getByLabelText('Priority'), 'urgent')

      await user.click(screen.getByRole('button', { name: 'Search' }))

      expect(mockOnSearch).toHaveBeenCalledWith({
        search: 'test',
        category: 'Authentication',
        status: 'open',
        priority: 'urgent',
      })
    })

    it('submits form when pressing Enter in search input', async () => {
      render(<SearchBar onSearch={mockOnSearch} />)

      const searchInput = screen.getByLabelText('Search')
      await user.type(searchInput, 'test query{Enter}')

      expect(mockOnSearch).toHaveBeenCalledWith({
        search: 'test query',
        category: undefined,
        status: undefined,
        priority: undefined,
      })
    })
  })

  // 리셋 기능 테스트
  describe('Reset Functionality', () => {
    it('clears all fields when reset button is clicked', async () => {
      const categories = ['Authentication']
      const statuses = [{ value: 'open', label: 'Open' }]
      const priorities = [{ value: 'urgent', label: 'Urgent' }]

      render(
        <SearchBar
          onSearch={mockOnSearch}
          categories={categories}
          statuses={statuses}
          priorities={priorities}
        />
      )

      // Fill all fields
      await user.type(screen.getByLabelText('Search'), 'test')
      await user.selectOptions(screen.getByLabelText('Category'), 'Authentication')
      await user.selectOptions(screen.getByLabelText('Status'), 'open')
      await user.selectOptions(screen.getByLabelText('Priority'), 'urgent')

      // Click reset
      await user.click(screen.getByRole('button', { name: 'Reset' }))

      // Verify fields are cleared
      expect(screen.getByLabelText('Search')).toHaveValue('')
      expect(screen.getByLabelText('Category')).toHaveValue('')
      expect(screen.getByLabelText('Status')).toHaveValue('')
      expect(screen.getByLabelText('Priority')).toHaveValue('')
    })

    it('calls onSearch with empty object when reset button is clicked', async () => {
      render(<SearchBar onSearch={mockOnSearch} />)

      await user.type(screen.getByLabelText('Search'), 'test')
      await user.click(screen.getByRole('button', { name: 'Reset' }))

      expect(mockOnSearch).toHaveBeenCalledWith({})
    })
  })

  // 입력 상태 관리 테스트
  describe('Input State Management', () => {
    it('updates search input value as user types', async () => {
      render(<SearchBar onSearch={mockOnSearch} />)

      const searchInput = screen.getByLabelText('Search') as HTMLInputElement
      await user.type(searchInput, 'search term')

      expect(searchInput.value).toBe('search term')
    })

    it('updates category selection when user selects option', async () => {
      render(<SearchBar onSearch={mockOnSearch} categories={['Auth', 'Payment']} />)

      const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement
      await user.selectOptions(categorySelect, 'Auth')

      expect(categorySelect.value).toBe('Auth')
    })

    it('updates status selection when user selects option', async () => {
      render(
        <SearchBar onSearch={mockOnSearch} statuses={[{ value: 'open', label: 'Open' }]} />
      )

      const statusSelect = screen.getByLabelText('Status') as HTMLSelectElement
      await user.selectOptions(statusSelect, 'open')

      expect(statusSelect.value).toBe('open')
    })

    it('updates priority selection when user selects option', async () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          priorities={[{ value: 'urgent', label: 'Urgent' }]}
          showPriority={true}
        />
      )

      const prioritySelect = screen.getByLabelText('Priority') as HTMLSelectElement
      await user.selectOptions(prioritySelect, 'urgent')

      expect(prioritySelect.value).toBe('urgent')
    })
  })

  // 플레이스홀더 텍스트 테스트
  describe('Placeholder Text', () => {
    it('displays correct placeholder for search input', () => {
      render(<SearchBar onSearch={mockOnSearch} />)
      const searchInput = screen.getByLabelText('Search')
      expect(searchInput).toHaveAttribute('placeholder', 'Search by title, description...')
    })
  })

  // 접근성 테스트
  describe('Accessibility', () => {
    it('has proper labels for all inputs', () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          categories={['Test']}
          statuses={[{ value: 'test', label: 'Test' }]}
          priorities={[{ value: 'test', label: 'Test' }]}
        />
      )

      expect(screen.getByLabelText('Search')).toBeInTheDocument()
      expect(screen.getByLabelText('Category')).toBeInTheDocument()
      expect(screen.getByLabelText('Status')).toBeInTheDocument()
      expect(screen.getByLabelText('Priority')).toBeInTheDocument()
    })

    it('buttons have accessible names', () => {
      render(<SearchBar onSearch={mockOnSearch} />)

      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    })

    it('form can be submitted via keyboard', async () => {
      render(<SearchBar onSearch={mockOnSearch} />)

      const searchInput = screen.getByLabelText('Search')
      searchInput.focus()
      await user.keyboard('{Enter}')

      expect(mockOnSearch).toHaveBeenCalled()
    })
  })

  // 실제 사용 시나리오
  describe('Real-world Scenarios', () => {
    it('handles typical VOC search workflow', async () => {
      const categories = ['Authentication', 'Payments', 'UI']
      const statuses = [
        { value: 'open', label: 'Open' },
        { value: 'resolved', label: 'Resolved' },
      ]
      const priorities = [
        { value: 'urgent', label: 'Urgent' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
      ]

      render(
        <SearchBar
          onSearch={mockOnSearch}
          categories={categories}
          statuses={statuses}
          priorities={priorities}
        />
      )

      // User searches for login issues in Authentication category
      await user.type(screen.getByLabelText('Search'), 'login timeout')
      await user.selectOptions(screen.getByLabelText('Category'), 'Authentication')
      await user.click(screen.getByRole('button', { name: 'Search' }))

      expect(mockOnSearch).toHaveBeenCalledWith({
        search: 'login timeout',
        category: 'Authentication',
        status: undefined,
        priority: undefined,
      })
    })

    it('allows user to filter by multiple criteria', async () => {
      const categories = ['Payments']
      const statuses = [{ value: 'open', label: 'Open' }]
      const priorities = [{ value: 'urgent', label: 'Urgent' }]

      render(
        <SearchBar
          onSearch={mockOnSearch}
          categories={categories}
          statuses={statuses}
          priorities={priorities}
        />
      )

      await user.selectOptions(screen.getByLabelText('Category'), 'Payments')
      await user.selectOptions(screen.getByLabelText('Status'), 'open')
      await user.selectOptions(screen.getByLabelText('Priority'), 'urgent')
      await user.click(screen.getByRole('button', { name: 'Search' }))

      expect(mockOnSearch).toHaveBeenCalledWith({
        search: undefined,
        category: 'Payments',
        status: 'open',
        priority: 'urgent',
      })
    })

    it('allows user to clear filters and start over', async () => {
      render(
        <SearchBar
          onSearch={mockOnSearch}
          categories={['Test']}
          statuses={[{ value: 'test', label: 'Test' }]}
          priorities={[{ value: 'test', label: 'Test' }]}
        />
      )

      // Apply filters
      await user.type(screen.getByLabelText('Search'), 'test')
      await user.selectOptions(screen.getByLabelText('Category'), 'Test')
      await user.selectOptions(screen.getByLabelText('Status'), 'test')
      await user.selectOptions(screen.getByLabelText('Priority'), 'test')

      // Reset
      await user.click(screen.getByRole('button', { name: 'Reset' }))

      // Verify reset was called
      expect(mockOnSearch).toHaveBeenCalledWith({})

      // Verify fields are empty
      expect(screen.getByLabelText('Search')).toHaveValue('')
      expect(screen.getByLabelText('Category')).toHaveValue('')
      expect(screen.getByLabelText('Status')).toHaveValue('')
      expect(screen.getByLabelText('Priority')).toHaveValue('')
    })
  })
})
