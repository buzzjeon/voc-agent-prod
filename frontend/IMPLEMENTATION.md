# VOC Agent Frontend Implementation

Next.js 15 기반 VOC Agent 프론트엔드 구현 완료

## 구현일
2026-04-12

## 기술 스택

- **Framework**: Next.js 16.2.3 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **Data Fetching**: Custom hooks (fetch API)

## 프로젝트 구조

```
frontend/
├── app/
│   ├── (dashboard)/              # Route group (URL에 미포함)
│   │   ├── layout.tsx            # 대시보드 레이아웃
│   │   ├── dashboard/
│   │   │   └── page.tsx          # 대시보드 홈
│   │   ├── voc/
│   │   │   ├── page.tsx          # VOC 목록
│   │   │   └── [id]/
│   │   │       └── page.tsx      # VOC 상세
│   │   └── guides/
│   │       ├── page.tsx          # 가이드 목록
│   │       └── [id]/
│   │           └── page.tsx      # 가이드 상세
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 랜딩 페이지
│   └── globals.css               # 글로벌 스타일
├── components/
│   ├── ui/                       # 기본 UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── table.tsx
│   ├── header.tsx                # 헤더
│   ├── search-bar.tsx            # 검색/필터
│   ├── voc-card.tsx              # VOC 카드
│   ├── guide-editor.tsx          # 가이드 에디터
│   └── approval-workflow.tsx     # 승인 워크플로
├── hooks/
│   ├── use-vocs.ts               # VOC 조회 훅
│   ├── use-guides.ts             # 가이드 조회 훅
│   └── use-generate-guide.ts     # 가이드 생성 훅
├── lib/
│   ├── types.ts                  # TypeScript 타입
│   ├── constants.ts              # 상수
│   ├── api.ts                    # API 클라이언트
│   └── mock-data.ts              # Mock 데이터
└── _workspace/
    ├── 02_frontend_components.md # 컴포넌트 문서
    └── 02_frontend_hooks.md      # API 훅 문서
```

## 주요 기능

### 1. 랜딩 페이지 (`/`)
- 서비스 소개
- 주요 기능 설명 (VOC Management, AI Analysis, Approval Flow)
- Get Started 버튼

### 2. 대시보드 (`/dashboard`)
- 통계 카드 (Total VOCs, Pending Guides, Approved Guides, Resolved VOCs)
- Quick Actions
- Recent Activity

### 3. VOC 관리 (`/voc`)
- VOC 목록 조회
- 검색/필터 (카테고리, 상태, 우선순위, 검색어)
- VOC 카드 그리드 뷰
- VOC 상세 페이지 (`/voc/[id]`)
  - 상세 정보 표시
  - AI 가이드 생성 버튼
  - 관련 가이드 목록
  - JIRA 링크

### 4. 가이드 관리 (`/guides`)
- 가이드 목록 조회
- 상태 필터 (Draft, Pending Approval, Approved, Rejected)
- 가이드 상세 페이지 (`/guides/[id]`)
  - 가이드 내용 표시 (문제, 원인, 해결 절차, 솔루션, 출처)
  - 승인/거부 워크플로
  - 피드백 입력

## 컴포넌트 아키텍처

### Server Components (기본)
- 페이지 레이아웃
- 정적 컴포넌트 (Header)

### Client Components ('use client')
- 인터랙티브 컴포넌트 (SearchBar, ApprovalWorkflow)
- API 훅 사용 컴포넌트 (모든 페이지)
- 폼 컴포넌트 (GuideEditor)

## API 연동

### Mock 데이터 모드
현재 구현은 mock 데이터를 사용하여 백엔드 없이 UI 테스트 가능:

```typescript
// Mock 데이터 사용
const { vocs } = useVOCs({ useMock: true })
```

### 실제 API 연동
백엔드 준비 시 `useMock: false` 로 변경:

```typescript
// 실제 API 호출
const { vocs } = useVOCs({ useMock: false })
```

API 실패 시 자동으로 mock 데이터로 폴백됩니다.

### API 엔드포인트 매핑

| 기능 | 메서드 | 엔드포인트 | 구현 함수 |
|------|--------|-----------|----------|
| VOC 목록 조회 | GET | `/api/voc` | `getVOCs()` |
| VOC 상세 조회 | GET | `/api/voc/:id` | `getVOC(id)` |
| 가이드 목록 조회 | GET | `/api/guides` | `getGuides()` |
| 가이드 상세 조회 | GET | `/api/guides/:id` | `getGuide(id)` |
| 가이드 생성 | POST | `/api/guides/generate` | `generateGuide()` |
| 가이드 승인 | POST | `/api/guides/:id/approve` | `approveGuide()` |
| 대시보드 통계 | GET | `/api/dashboard/stats` | `getDashboardStats()` |

## 스타일링

### Tailwind CSS 4
- 커스텀 테마 설정
- 반응형 디자인 (모바일 우선)
- 다크모드 지원 준비

### 컬러 팔레트
- **Primary**: Blue (blue-600, blue-700)
- **Success**: Green (green-100, green-600, green-800)
- **Warning**: Yellow (yellow-100, yellow-600, yellow-800)
- **Danger**: Red (red-100, red-600, red-800)
- **Info**: Blue (blue-100, blue-600, blue-800)

## 개발 및 실행

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

### 프로덕션 실행
```bash
npm start
```

### Lint
```bash
npm run lint
```

## 환경 변수

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## TODO: 백엔드 연동 체크리스트

### backend-dev에게 확인 필요
1. **API 응답 shape 확인**
   - VOC 목록: `VOC[]` 직접 반환 or `{ data: VOC[] }` 래핑?
   - Guide 목록: `Guide[]` 직접 반환 or `{ data: Guide[] }` 래핑?

2. **필드명 확인**
   - snake_case (DB) → camelCase (API) 변환 여부
   - 예: `created_at` → `createdAt`

3. **에러 응답 포맷**
   - 현재 가정: `{ error: string, code?: string }`

4. **인증/인가**
   - JWT 토큰 필요 여부
   - Authorization 헤더 처리

5. **CORS 설정**
   - 프론트엔드 origin 허용 확인

### 백엔드 연동 시 수정 필요 파일
1. `/lib/api.ts` - API 베이스 URL 설정
2. `/hooks/*.ts` - `useMock: false` 로 변경
3. 타입 정의 수정 (필요 시)

## 테스트 계획

### qa-inspector에게 검증 요청
1. 랜딩 페이지 렌더링
2. 대시보드 통계 표시
3. VOC 목록 조회 및 필터링
4. VOC 상세 페이지
5. 가이드 생성 플로우
6. 가이드 목록 조회
7. 가이드 승인/거부 플로우
8. 반응형 디자인 (모바일/태블릿/데스크톱)

## 알려진 이슈

1. **Mock 데이터 한계**: 실제 데이터베이스 없이 필터링/검색은 클라이언트에서만 동작
2. **가이드 생성**: AI 통합 전까지 mock 응답만 반환
3. **인증**: 현재 로그인 기능 미구현

## 향후 개선 사항

1. **성능 최적화**
   - React Query 또는 SWR 도입 (캐싱, 재검증)
   - 이미지 최적화
   - Code splitting

2. **사용성 개선**
   - 로딩 스켈레톤 컴포넌트
   - 토스트 알림 시스템
   - 페이지네이션

3. **기능 추가**
   - 로그인/로그아웃
   - VOC 생성/수정
   - 가이드 수동 편집
   - 다운로드 기능 (PDF/Markdown)
   - 검색 자동완성

4. **테스트**
   - Jest + React Testing Library
   - E2E 테스트 (Playwright)

## 참고 문서

- `_workspace/02_frontend_components.md` - 컴포넌트 상세 문서
- `_workspace/02_frontend_hooks.md` - API 훅 및 엔드포인트 매핑
- `lib/types.ts` - TypeScript 타입 정의
- `lib/mock-data.ts` - Mock 데이터 예시
