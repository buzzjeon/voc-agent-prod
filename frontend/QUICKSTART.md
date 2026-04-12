# VOC Agent Frontend - Quick Start Guide

## 프로젝트 개요

Next.js 16 기반 VOC (Voice of Customer) 관리 시스템 프론트엔드

## 빠른 시작

### 1. 개발 서버 실행

```bash
npm run dev
```

서버가 실행되면 브라우저에서 http://localhost:3000 접속

### 2. 주요 페이지

- **랜딩 페이지**: http://localhost:3000
- **대시보드**: http://localhost:3000/dashboard
- **VOC 목록**: http://localhost:3000/voc
- **가이드 목록**: http://localhost:3000/guides

## 주요 기능

### VOC 관리
- VOC 목록 조회 및 필터링 (카테고리, 상태, 우선순위)
- VOC 상세 정보 확인
- AI 가이드 자동 생성

### 가이드 관리
- AI 생성 가이드 목록 조회
- 가이드 상세 확인
- 승인/거부 워크플로

### 대시보드
- 전체 통계 요약
- Quick Actions
- Recent Activity

## Mock 데이터 모드

현재 백엔드 없이도 UI를 확인할 수 있도록 mock 데이터가 포함되어 있습니다.

### Mock 데이터 위치
- `/lib/mock-data.ts`
  - `mockVOCs`: 5개의 샘플 VOC
  - `mockGuides`: 3개의 샘플 가이드
  - `mockDashboardStats`: 대시보드 통계

### Mock 데이터 사용 예시

```typescript
// VOC 목록 (Mock)
const { vocs } = useVOCs({ useMock: true })

// 가이드 목록 (Mock)
const { guides } = useGuides({ useMock: true })
```

## 파일 구조

```
frontend/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # 대시보드 route group
│   │   ├── dashboard/page.tsx    # 대시보드 홈
│   │   ├── voc/page.tsx          # VOC 목록
│   │   ├── voc/[id]/page.tsx     # VOC 상세
│   │   ├── guides/page.tsx       # 가이드 목록
│   │   └── guides/[id]/page.tsx  # 가이드 상세
│   └── page.tsx                  # 랜딩 페이지
├── components/                   # React 컴포넌트
│   ├── ui/                       # 기본 UI 컴포넌트
│   └── [기능 컴포넌트들]
├── hooks/                        # 커스텀 훅
│   ├── use-vocs.ts
│   ├── use-guides.ts
│   └── use-generate-guide.ts
└── lib/                          # 유틸리티 & 타입
    ├── types.ts
    ├── constants.ts
    ├── api.ts
    └── mock-data.ts
```

## 주요 컴포넌트

### UI 컴포넌트
- `Button`: 버튼 (variants: primary, secondary, outline, ghost, danger)
- `Card`: 카드 (CardHeader, CardBody, CardFooter)
- `Badge`: 뱃지 (variants: default, success, warning, danger, info)
- `Table`: 테이블 (TableHeader, TableBody, TableRow, TableHead, TableCell)

### 기능 컴포넌트
- `Header`: 전역 헤더 + 네비게이션
- `SearchBar`: 검색 및 필터
- `VOCCard`: VOC 카드 표시
- `GuideEditor`: 가이드 편집기 (readOnly 모드 지원)
- `ApprovalWorkflow`: 승인/거부 워크플로

## API 훅

### useVOCs(options)
```typescript
const { vocs, loading, error } = useVOCs({
  category: 'Authentication',
  status: 'new',
  priority: 'urgent',
  search: 'login',
  useMock: true  // Mock 데이터 사용
})
```

### useGuides(options)
```typescript
const { guides, loading, error } = useGuides({
  status: 'pending_approval',
  vocId: '3',
  useMock: true
})
```

### useGenerateGuide()
```typescript
const { generate, loading, error } = useGenerateGuide()

const handleGenerate = async () => {
  const guide = await generate(vocId)
  console.log('Generated:', guide)
}
```

## 스타일링

Tailwind CSS 4를 사용하며, 다음 컬러 팔레트를 따릅니다:

- **Primary**: Blue (700)
- **Success**: Green (600)
- **Warning**: Yellow (600)
- **Danger**: Red (600)
- **Info**: Blue (600)

## 개발 팁

### 1. 새 페이지 추가
```typescript
// app/(dashboard)/new-page/page.tsx
'use client'  // 인터랙션 필요 시

export default function NewPage() {
  return <div>New Page</div>
}
```

### 2. 새 API 훅 추가
```typescript
// hooks/use-my-data.ts
'use client'

import { useState, useEffect } from 'react'

export function useMyData() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // fetch logic
  }, [])
  
  return { data, loading }
}
```

### 3. 새 컴포넌트 추가
```typescript
// components/my-component.tsx
interface MyComponentProps {
  title: string
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>
}
```

## 백엔드 연동

백엔드가 준비되면 다음 단계를 진행하세요:

### 1. 환경 변수 설정
`.env.local` 파일 생성:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Mock 모드 비활성화
각 페이지/컴포넌트에서 `useMock: false` 로 변경:
```typescript
// Before
const { vocs } = useVOCs({ useMock: true })

// After
const { vocs } = useVOCs({ useMock: false })
```

또는 전역 설정 변경:
```typescript
// lib/constants.ts
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development' ? false : true
```

### 3. API 응답 shape 확인
backend-dev에게 확인 필요:
- VOC 목록: `VOC[]` or `{ data: VOC[] }`?
- 필드명: `camelCase` or `snake_case`?
- 에러 응답 포맷

### 4. 타입 조정 (필요 시)
`lib/types.ts` 에서 타입 정의 수정

## 테스트

### 수동 테스트 체크리스트
- [ ] 랜딩 페이지 렌더링
- [ ] 대시보드 통계 표시
- [ ] VOC 목록 조회
- [ ] VOC 필터링 (카테고리, 상태, 우선순위)
- [ ] VOC 검색
- [ ] VOC 상세 페이지
- [ ] 가이드 생성 버튼 클릭
- [ ] 가이드 목록 조회
- [ ] 가이드 상세 페이지
- [ ] 가이드 승인/거부
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)

## 문제 해결

### 개발 서버가 시작되지 않음
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 삭제
rm -rf .next
npm run dev
```

### Tailwind CSS 스타일이 적용되지 않음
- `app/globals.css` 파일 확인
- `@import "tailwindcss";` 구문 포함 여부 확인

### 타입 에러
```bash
# TypeScript 캐시 삭제
rm -rf .next
npm run dev
```

## 추가 리소스

- **상세 구현 문서**: `IMPLEMENTATION.md`
- **컴포넌트 문서**: `_workspace/02_frontend_components.md`
- **API 훅 문서**: `_workspace/02_frontend_hooks.md`
- **Next.js 공식 문서**: https://nextjs.org/docs

## 지원

문제가 발생하면 다음을 확인하세요:
1. `IMPLEMENTATION.md` - 전체 구현 내역
2. `_workspace/*.md` - 상세 문서
3. Console 로그 - 브라우저 개발자 도구
4. 터미널 에러 메시지
