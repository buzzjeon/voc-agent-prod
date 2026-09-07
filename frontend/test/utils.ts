import { vi } from 'vitest'

// Mock Next.js components
export const mockNextComponents = () => {
  vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    ),
  }))

  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }),
    useSearchParams: () => ({
      get: vi.fn(),
      getAll: vi.fn(),
      has: vi.fn(),
      entries: vi.fn(),
      forEach: vi.fn(),
      keys: vi.fn(),
      values: vi.fn(),
      toString: vi.fn(),
    }),
    usePathname: () => '/',
  }))
}

// Mock API calls
export const mockApiCall = <T>(data: T, delay = 0) => {
  return vi.fn(
    (): Promise<T> =>
      new Promise((resolve) => {
        setTimeout(() => resolve(data), delay)
      })
  )
}

// Mock API call with error
export const mockApiCallWithError = (error: Error, delay = 0) => {
  return vi.fn(
    (): Promise<never> =>
      new Promise((_, reject) => {
        setTimeout(() => reject(error), delay)
      })
  )
}

// Create mock VOC data
export const createMockVOC = (overrides = {}) => ({
  id: 'voc-123',
  jiraKey: 'VOC-001',
  title: 'Test VOC',
  description: 'Test description',
  category: 'Test Category',
  priority: 'medium',
  status: 'open',
  createdAt: new Date().toISOString(),
  ...overrides,
})

// Create mock Guide data
export const createMockGuide = (overrides = {}) => ({
  id: 'guide-123',
  vocId: 'voc-123',
  title: 'Test Guide',
  problem: 'Test problem',
  cause: 'Test cause',
  procedure: 'Test procedure',
  solution: 'Test solution',
  sources: 'Test sources',
  status: 'draft',
  createdAt: new Date().toISOString(),
  ...overrides,
})

// Wait for async operations
export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock window.matchMedia for responsive tests
export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// Reset all mocks
export const resetAllMocks = () => {
  vi.clearAllMocks()
  vi.resetAllMocks()
}

// Setup common test environment
export const setupTestEnvironment = () => {
  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return []
    }
    unobserve() {}
  } as any

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any
}
