# Frontend Components

프론트엔드 컴포넌트 목록 및 파일 경로

## 생성일
2026-04-12

## 타입 정의

### `/lib/types.ts`
- `VOC`: JIRA VOC 데이터 타입
- `Guide`: AI 생성 가이드 타입
- `ApiResponse<T>`: API 응답 래퍼
- `ApiError`: API 에러 타입
- `DashboardStats`: 대시보드 통계

### `/lib/constants.ts`
- VOC 상태/우선순위 라벨
- 가이드 상태 라벨
- 카테고리 옵션
- API 베이스 URL

### `/lib/api.ts`
- API 클라이언트 함수
- `getVOCs()`, `getVOC(id)`
- `getGuides()`, `getGuide(id)`
- `generateGuide()`, `approveGuide()`
- `getDashboardStats()`

### `/lib/mock-data.ts`
- 개발용 Mock 데이터
- `mockVOCs`, `mockGuides`, `mockDashboardStats`

## UI 기본 컴포넌트

### `/components/ui/button.tsx`
- **Props**: `variant`, `size`
- **Variants**: primary, secondary, outline, ghost, danger
- **Sizes**: sm, md, lg

### `/components/ui/card.tsx`
- **Components**: Card, CardHeader, CardBody, CardFooter
- **Props**: `hover` (optional)

### `/components/ui/badge.tsx`
- **Props**: `variant`
- **Variants**: default, success, warning, danger, info

### `/components/ui/table.tsx`
- **Components**: Table, TableHeader, TableBody, TableRow, TableHead, TableCell

## 기능 컴포넌트

### `/components/header.tsx`
- 전역 헤더
- 네비게이션 링크 (Dashboard, VOC, Guides)

### `/components/search-bar.tsx` (Client Component)
- **Props**: `onSearch`, `categories`, `statuses`, `priorities`, `showPriority`
- 검색어, 카테고리, 상태, 우선순위 필터

### `/components/voc-card.tsx`
- **Props**: `voc` (VOC 타입)
- VOC 카드 표시 (priority badge, status badge, 요약)

### `/components/guide-editor.tsx` (Client Component)
- **Props**: `guide`, `onSave`, `readOnly`
- Markdown 에디터 (textarea 기반)
- 필드: title, problem, cause, procedure, solution, sources

### `/components/approval-workflow.tsx` (Client Component)
- **Props**: `guide`, `onApprove`, `onReject`
- 승인/거부 버튼 + 피드백 입력

## 훅

### `/hooks/use-vocs.ts` (Client Hook)
- **Options**: `category`, `status`, `priority`, `search`, `useMock`
- **Returns**: `{ vocs, loading, error }`
- API 에러 시 mock 데이터로 폴백

### `/hooks/use-guides.ts` (Client Hook)
- **Options**: `status`, `vocId`, `useMock`
- **Returns**: `{ guides, loading, error }`

### `/hooks/use-generate-guide.ts` (Client Hook)
- **Returns**: `{ generate, loading, error, guide }`
- `generate(vocId)` 함수로 AI 가이드 생성

## 페이지

### `/app/page.tsx`
- 랜딩 페이지
- 서비스 소개, Get Started 버튼

### `/app/(dashboard)/layout.tsx`
- 대시보드 레이아웃
- Header + main content area

### `/app/(dashboard)/dashboard/page.tsx` (Client Component)
- 대시보드 홈
- 통계 카드 (Total VOCs, Pending Guides, Approved Guides, Resolved VOCs)
- Quick Actions, Recent Activity

### `/app/(dashboard)/voc/page.tsx` (Client Component)
- VOC 목록
- SearchBar + VOCCard 그리드
- 필터링: 카테고리, 상태, 우선순위, 검색

### `/app/(dashboard)/voc/[id]/page.tsx` (Client Component)
- VOC 상세
- 설명, 카테고리, 상태, 우선순위
- AI 가이드 생성 버튼
- 관련 가이드 목록

### `/app/(dashboard)/guides/page.tsx` (Client Component)
- 가이드 목록
- SearchBar + 가이드 카드 리스트
- 필터링: 상태

### `/app/(dashboard)/guides/[id]/page.tsx` (Client Component)
- 가이드 상세
- GuideEditor (readOnly)
- ApprovalWorkflow (pending_approval 상태일 때)
- Metadata 정보

## 라우팅

- `/` → 랜딩 페이지
- `/dashboard` → 대시보드 홈
- `/voc` → VOC 목록
- `/voc/[id]` → VOC 상세
- `/guides` → 가이드 목록
- `/guides/[id]` → 가이드 상세

**Note**: `(dashboard)` route group은 URL 경로에 포함되지 않음

## 개발 모드

- `useMock: true` 옵션 사용 시 mock 데이터로 동작
- API 연결 실패 시 자동으로 mock 데이터로 폴백
- 실제 백엔드 연동 전 UI 확인 가능
