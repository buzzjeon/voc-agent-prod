# Frontend Testing Guide

프론트엔드 테스트 환경이 구축되었습니다. Vitest + React Testing Library를 사용하여 컴포넌트 및 기능 테스트를 작성할 수 있습니다.

## 📦 설치된 패키지

- **vitest** ^4.1.6 - 빠른 테스트 프레임워크
- **@testing-library/react** ^16.3.2 - React 컴포넌트 테스트
- **@testing-library/jest-dom** ^6.9.1 - DOM 매처 확장
- **@testing-library/user-event** ^14.6.1 - 사용자 상호작용 시뮬레이션
- **@vitejs/plugin-react** ^6.0.2 - React 플러그인
- **jsdom** ^29.1.1 - DOM 환경 시뮬레이션
- **@vitest/coverage-v8** - 코드 커버리지

## 🚀 테스트 실행

```bash
# Watch mode (변경 시 자동 재실행)
npm test

# 한 번 실행
npm run test:run

# UI 모드 (브라우저에서 결과 확인)
npm run test:ui

# 커버리지 리포트 생성
npm run test:coverage

# 특정 파일만 테스트
npm run test:run -- button.test.tsx

# 특정 테스트만 실행 (패턴 매칭)
npm run test:run -- -t "primary variant"
```

## 📁 테스트 파일 구조

```
frontend/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── button.test.tsx      # 컴포넌트와 같은 위치
│   │   ├── badge.tsx
│   │   ├── badge.test.tsx
│   │   └── card.tsx
│   │       └── card.test.tsx
│   ├── voc-card.tsx
│   │   └── voc-card.test.tsx
│   └── search-bar.tsx
│       └── search-bar.test.tsx
├── app/
│   ├── page.tsx
│   │   └── page.test.tsx
├── test/
│   ├── setup.ts                 # 테스트 설정 파일
│   └── utils.ts                 # 테스트 유틸리티 및 헬퍼
└── vitest.config.ts             # Vitest 설정
```

## 📝 테스트 작성 가이드

### 1. 기본 템플릿

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MyComponent } from '@/components/my-component'

describe('MyComponent', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### 2. 요소 찾기 (Best Practices)

```typescript
// ✅ 좋음 - 역할(role) 기반 쿼리 우선
screen.getByRole('button')
screen.getByRole('textbox', { name: '이메일' })
screen.getByRole('link', { name: /홈/i })

// ⚠️ 필요한 경우 - 텍스트 기반
screen.getByText('특정 텍스트')
screen.getByText(/정규표현식/)

// ❌ 마지막 수단 - test-id (최소한으로 사용)
screen.getByTestId('unique-id')
```

### 3. 사용자 상호작용

```typescript
// 클릭
await user.click(button)

// 타이핑
await user.type(input, '입력값')

// 선택
await user.selectOptions(select, 'option-value')

// 폼 제출
await user.click(submitButton)
```

### 4. Mocking

```typescript
// Next.js Link mock
vi.mock('next/link', () => ({
  default: ({ children, href }) => <a href={href}>{children}</a>,
}))

// API 호출 mock
const mockFetch = vi.fn(() => Promise.resolve({ data: 'test' }))

// Hook mock
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, login: vi.fn() }),
}))
```

### 5. 비동기 테스트

```typescript
it('displays loading state', async () => {
  render(<UserProfile userId="123" />)
  
  expect(screen.getByText('로딩 중...')).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.getByText('홍길동')).toBeInTheDocument()
  })
})
```

## 🎯 테스트 작성 원칙

### 1. 사용자 관점 테스트

```typescript
// ❌ 구현 세부사항 테스트
expect(component.state.isOpen).toBe(true)

// ✅ 사용자가 보는 것 테스트
expect(screen.getByText('메뉴가 열렸습니다')).toBeInTheDocument()
```

### 2. 명확한 테스트 이름

```typescript
// ✅ 좋음
it('shows error message when email is invalid', () => {})

// ❌ 모호함
it('works correctly', () => {})
```

### 3. 테스트 격리

```typescript
beforeEach(() => {
  vi.clearAllMocks()  // 각 테스트 전 mock 초기화
})
```

## 🛠️ 테스트 유틸리티

`test/utils.ts`에서 제공하는 헬퍼 함수:

```typescript
import {
  mockNextComponents,
  mockApiCall,
  createMockVOC,
  createMockGuide,
  waitFor,
  resetAllMocks,
  setupTestEnvironment,
} from '@/test/utils'

// Next.js 컴포넌트 mock
mockNextComponents()

// Mock 데이터 생성
const mockVOC = createMockVOC({ priority: 'urgent' })

// 비동기 대기
await waitFor(1000)
```

## 📊 커버리지

커버리지 목표:
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

현재 커버리지 확인:
```bash
npm run test:coverage
```

HTML 리포트는 `coverage/index.html`에서 확인할 수 있습니다.

## 🔧 설정

### vitest.config.ts

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,              // describe, it 등 전역 사용
    environment: 'jsdom',       // 브라우저 환경 시뮬레이션
    setupFiles: ['./test/setup.ts'],  // 설정 파일
    css: true,                  // CSS 지원
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
    },
  },
})
```

## 📚 예시 테스트

### Button 컴포넌트

```typescript
describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    const { container } = render(<Button variant="danger">Delete</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-red-600')
  })

  it('calls onClick handler', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### SearchBar 컴포넌트

```typescript
describe('SearchBar Component', () => {
  it('submits search form', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    
    render(<SearchBar onSearch={onSearch} categories={['Auth']} />)
    
    await user.type(screen.getByLabelText('Search'), 'login error')
    await user.selectOptions(screen.getByLabelText('Category'), 'Auth')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    
    expect(onSearch).toHaveBeenCalledWith({
      search: 'login error',
      category: 'Auth',
      status: undefined,
      priority: undefined,
    })
  })
})
```

## 🐛 디버깅

### UI 모드 사용

```bash
npm run test:ui
```

브라우저에서 테스트 결과를 시각적으로 확인하고 디버깅할 수 있습니다.

### 디버그 모드

```typescript
it('debugs component', () => {
  render(<MyComponent />)
  screen.debug()  // 현재 DOM 출력
})
```

## 📖 추가 리소스

- [Vitest 공식 문서](https://vitest.dev/)
- [React Testing Library 공식 문서](https://testing-library.com/react)
- [Testing Playground](https://testing-playground.com/) - 적절한 쿼리 선택 연습

## ✅ 체크리스트

새 컴포넌트 테스트 작성 시:
- [ ] 사용자 관점에서 테스트 작성
- [ ] 역할(role) 기반 쿼리 우선 사용
- [ ] 명확한 테스트 이름 사용
- [ ] beforeEach에서 mock 초기화
- [ ] 비동기 작업에 waitFor 사용
- [ ] 접근성 테스트 포함
- [ ] 경계 케이스 테스트
