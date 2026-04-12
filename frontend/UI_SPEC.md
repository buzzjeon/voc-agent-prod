# VOC Agent UI Specification

## 개요

VOC Agent 시스템의 페이지별 레이아웃과 컴포넌트 계층 구조를 정의합니다.

---

## 페이지 구조 개요

| 페이지 | 경로 | 주요 기능 |
|--------|------|-----------|
| 대시보드 | `/dashboard` | VOC 통계 요약, 최근 VOC 목록 |
| VOC 목록 | `/voc` | VOC 검색/필터링, 전체 목록 조회 |
| VOC 상세 & 가이드 생성 | `/voc/[id]` | VOC 상세 정보, 가이드 생성 워크플로우 |
| 가이드 목록 | `/guides` | 가이드 검색/필터링, 상태별 조회 |
| 가이드 상세 & 승인 | `/guides/[id]` | 가이드 미리보기, 승인/반려 워크플로우 |
| 로그인 | `/login` | 사용자 인증 |

---

## 1. 대시보드 (`/dashboard`)

### 레이아웃 구조
```
┌─────────────────────────────────────────────┐
│ Header (네비게이션)                          │
├──────────┬──────────────────────────────────┤
│          │  페이지 제목: "대시보드"           │
│          │                                    │
│ Sidebar  │  통계 카드 3개 (가로 배치)         │
│          │  ┌──────┐ ┌──────┐ ┌──────┐      │
│ - 대시보드 │  │신규VOC│ │진행중│ │완료  │      │
│ - VOC    │  └──────┘ └──────┘ └──────┘      │
│ - 가이드  │                                   │
│          │  카테고리별 VOC 분포 차트          │
│          │  ┌────────────────────────┐      │
│          │  │  Bar Chart             │      │
│          │  └────────────────────────┘      │
│          │                                    │
│          │  최근 VOC 목록                     │
│          │  ┌────────────────────────┐      │
│          │  │ DataTable (5행)        │      │
│          │  └────────────────────────┘      │
└──────────┴──────────────────────────────────┘
```

### 컴포넌트 계층
```
DashboardPage
├─ Header
│  ├─ Logo
│  ├─ Navigation
│  └─ UserMenu
├─ Sidebar
│  └─ NavLinks[]
└─ Main
   ├─ PageTitle (h1: "대시보드")
   ├─ StatsGrid
   │  ├─ StatCard (신규 VOC)
   │  ├─ StatCard (진행중)
   │  └─ StatCard (완료)
   ├─ ChartSection
   │  ├─ SectionTitle (h2: "카테고리별 분포")
   │  └─ BarChart
   └─ RecentVOCSection
      ├─ SectionTitle (h2: "최근 VOC")
      └─ DataTable
         ├─ TableHeader
         ├─ TableBody
         │  └─ TableRow[]
         └─ ViewAllLink
```

### 주요 요소

#### StatCard
- **레이아웃**: `Card` + `flex flex-col`
- **내용**: 
  - 아이콘 (w-10 h-10)
  - 레이블 (text-sm text-gray-600)
  - 숫자 (text-3xl font-bold)
  - 변화율 (text-sm text-green-600 또는 text-red-600)
- **크기**: 최소 높이 `h-32`
- **반응형**: 
  - 모바일: 1열
  - 태블릿: 2열
  - 데스크톱: 3열

#### 차트
- **라이브러리**: Recharts 또는 Chart.js
- **타입**: 수평 막대 그래프
- **데이터**: 카테고리별 VOC 개수
- **높이**: `h-64`

#### 최근 VOC 테이블
- **컬럼**: ID, 제목, 카테고리, 상태, 생성일
- **행 수**: 최대 5개
- **액션**: 각 행 클릭 시 `/voc/[id]`로 이동

---

## 2. VOC 목록 (`/voc`)

### 레이아웃 구조
```
┌─────────────────────────────────────────────┐
│ Header                                      │
├──────────┬──────────────────────────────────┤
│          │  페이지 제목: "VOC 목록"           │
│          │                                    │
│          │  검색 및 필터 영역                 │
│ Sidebar  │  ┌──────────────────────────┐    │
│          │  │ SearchBar + Filters      │    │
│          │  └──────────────────────────┘    │
│          │                                    │
│          │  VOC 테이블                        │
│          │  ┌──────────────────────────┐    │
│          │  │ DataTable (10-20행)      │    │
│          │  │                          │    │
│          │  │                          │    │
│          │  └──────────────────────────┘    │
│          │                                    │
│          │  페이지네이션                      │
│          │  [< 1 2 3 ... 10 >]              │
└──────────┴──────────────────────────────────┘
```

### 컴포넌트 계층
```
VOCListPage
├─ Header
├─ Sidebar
└─ Main
   ├─ PageHeader
   │  ├─ PageTitle (h1: "VOC 목록")
   │  └─ ActionButton ("새 VOC 등록")
   ├─ FilterSection
   │  ├─ SearchBar
   │  │  └─ Input (placeholder: "제목 또는 내용 검색")
   │  ├─ CategoryFilter
   │  │  └─ Select (전체/네트워크/서버/애플리케이션...)
   │  ├─ StatusFilter
   │  │  └─ Select (전체/신규/진행중/완료)
   │  └─ DateRangeFilter
   │     ├─ DateInput (시작일)
   │     └─ DateInput (종료일)
   ├─ VOCTable (DataTable)
   │  ├─ TableHeader
   │  │  ├─ Column: ID (정렬 가능)
   │  │  ├─ Column: 제목
   │  │  ├─ Column: 카테고리
   │  │  ├─ Column: 상태
   │  │  ├─ Column: 생성일 (정렬 가능)
   │  │  └─ Column: 액션
   │  └─ TableBody
   │     └─ TableRow[]
   │        ├─ Cell: ID
   │        ├─ Cell: 제목 (링크)
   │        ├─ Cell: CategoryBadge
   │        ├─ Cell: StatusBadge
   │        ├─ Cell: 날짜
   │        └─ Cell: ActionButtons
   └─ Pagination
      ├─ PrevButton
      ├─ PageNumbers[]
      └─ NextButton
```

### 주요 요소

#### SearchBar
- **레이아웃**: `flex items-center gap-2`
- **구성**: 
  - Search 아이콘 (w-5 h-5)
  - Input 필드 (flex-1)
  - 검색 버튼 (선택사항)
- **동작**: 엔터키 또는 버튼 클릭 시 검색 실행

#### Filter Section
- **레이아웃**: `flex flex-wrap gap-4`
- **반응형**:
  - 모바일: 세로 스택
  - 태블릿 이상: 가로 배치

#### DataTable
- **행 높이**: `h-12`
- **테두리**: 각 행 하단 `border-b border-gray-200`
- **호버**: `hover:bg-gray-50 cursor-pointer`
- **정렬**: 컬럼 헤더 클릭 시 오름차순/내림차순 토글
- **모바일**: 카드 레이아웃으로 전환

---

## 3. VOC 상세 & 가이드 생성 (`/voc/[id]`)

### 레이아웃 구조
```
┌─────────────────────────────────────────────┐
│ Header                                      │
├──────────┬──────────────────────────────────┤
│          │  뒤로가기 버튼                     │
│          │  페이지 제목: "VOC 상세"           │
│          │                                    │
│ Sidebar  │  2열 그리드 (lg 이상)              │
│          │  ┌──────────┬───────────────┐    │
│          │  │ VOC 정보 │ 가이드 생성   │    │
│          │  │          │               │    │
│          │  │ - 제목   │ RAG 검색결과  │    │
│          │  │ - 내용   │               │    │
│          │  │ - 카테고리│ ┌──────────┐ │    │
│          │  │ - 상태   │ │ 참고문서1 │ │    │
│          │  │ - 생성일 │ │ 참고문서2 │ │    │
│          │  │          │ └──────────┘ │    │
│          │  │ [가이드  │               │    │
│          │  │  생성]   │ 가이드 에디터 │    │
│          │  │          │ ┌──────────┐ │    │
│          │  │          │ │ Markdown │ │    │
│          │  │          │ │ Editor   │ │    │
│          │  │          │ └──────────┘ │    │
│          │  │          │ [저장] [취소]│    │
│          │  └──────────┴───────────────┘    │
└──────────┴──────────────────────────────────┘
```

### 컴포넌트 계층
```
VOCDetailPage
├─ Header
├─ Sidebar
└─ Main
   ├─ Breadcrumb
   │  └─ Link[] ("VOC 목록" > "상세")
   ├─ PageTitle (h1: "VOC 상세")
   └─ ContentGrid (grid lg:grid-cols-2 gap-8)
      ├─ VOCInfoSection
      │  └─ VOCCard
      │     ├─ CardHeader
      │     │  ├─ Title
      │     │  └─ StatusBadge
      │     ├─ CardBody
      │     │  ├─ InfoRow: ID
      │     │  ├─ InfoRow: 카테고리
      │     │  ├─ InfoRow: 생성일
      │     │  ├─ Divider
      │     │  └─ ContentSection
      │     │     ├─ Label ("내용")
      │     │     └─ Text
      │     └─ CardFooter
      │        └─ Button ("가이드 생성 시작")
      └─ GuideCreationSection
         ├─ RAGResultsCard
         │  ├─ SectionTitle ("참고 문서")
         │  └─ DocumentList
         │     └─ DocumentItem[]
         │        ├─ Icon (FileText)
         │        ├─ Title
         │        ├─ Snippet
         │        └─ Link ("원본 보기")
         └─ GuideEditor
            ├─ EditorToolbar
            │  └─ Button[] (Bold, Italic, Link, Code...)
            ├─ SectionTabs
            │  ├─ Tab: 문제 (Problem)
            │  ├─ Tab: 원인 (Cause)
            │  ├─ Tab: 절차 (Procedure)
            │  ├─ Tab: 해결 (Solution)
            │  └─ Tab: 출처 (Source)
            ├─ MarkdownEditor
            │  └─ Textarea (h-64 font-mono)
            ├─ PreviewPanel
            │  └─ MarkdownPreview
            └─ ActionButtons
               ├─ Button ("저장", variant: primary)
               └─ Button ("취소", variant: ghost)
```

### 주요 요소

#### VOCCard
- **패딩**: `p-6`
- **구조**: Header + Body + Footer
- **스타일**: `rounded-lg border border-gray-200 shadow`

#### RAG 검색 결과
- **레이아웃**: 세로 스택, 최대 3-5개 문서
- **각 문서**:
  - 제목 (font-medium)
  - 스니펫 (text-sm text-gray-600, 최대 2줄)
  - 관련도 점수 (선택사항)
- **높이**: `max-h-64 overflow-y-auto`

#### GuideEditor
- **탭 구조**: 각 섹션(문제/원인/절차/해결/출처)별 탭
- **에디터**: 
  - Textarea 또는 Rich Text Editor
  - 실시간 Markdown 미리보기 (토글 가능)
  - 문법 하이라이팅
- **자동 저장**: 5초마다 드래프트 저장

---

## 4. 가이드 목록 (`/guides`)

### 레이아웃 구조
```
┌─────────────────────────────────────────────┐
│ Header                                      │
├──────────┬──────────────────────────────────┤
│          │  페이지 제목: "가이드 목록"        │
│          │                                    │
│ Sidebar  │  상태별 탭                         │
│          │  [전체] [대기] [승인됨] [게시됨]   │
│          │                                    │
│          │  검색 및 필터 영역                 │
│          │  ┌──────────────────────────┐    │
│          │  │ SearchBar + Filters      │    │
│          │  └──────────────────────────┘    │
│          │                                    │
│          │  가이드 테이블                     │
│          │  ┌──────────────────────────┐    │
│          │  │ DataTable                │    │
│          │  └──────────────────────────┘    │
│          │                                    │
│          │  페이지네이션                      │
└──────────┴──────────────────────────────────┘
```

### 컴포넌트 계층
```
GuideListPage
├─ Header
├─ Sidebar
└─ Main
   ├─ PageTitle (h1: "가이드 목록")
   ├─ StatusTabs
   │  ├─ Tab: 전체
   │  ├─ Tab: 대기 (count badge)
   │  ├─ Tab: 승인됨 (count badge)
   │  └─ Tab: 게시됨 (count badge)
   ├─ FilterSection
   │  ├─ SearchBar
   │  ├─ CategoryFilter
   │  └─ DateRangeFilter
   ├─ GuideTable (DataTable)
   │  ├─ TableHeader
   │  │  ├─ Column: ID
   │  │  ├─ Column: 제목
   │  │  ├─ Column: 관련 VOC
   │  │  ├─ Column: 작성자
   │  │  ├─ Column: 상태
   │  │  ├─ Column: 생성일
   │  │  └─ Column: 액션
   │  └─ TableBody
   │     └─ TableRow[]
   └─ Pagination
```

### 주요 요소

#### StatusTabs
- **레이아웃**: `flex gap-2 border-b border-gray-200`
- **각 탭**:
  - 텍스트 + 카운트 뱃지
  - 활성 상태: `border-b-2 border-blue-500 text-blue-600`
  - 비활성: `text-gray-600`
- **클릭 시**: URL 쿼리 파라미터 변경 (`?status=pending`)

#### 가이드 테이블
- **특이사항**: "관련 VOC" 컬럼은 링크로 표시
- **액션 버튼**:
  - 대기 상태: "승인 검토" 버튼
  - 승인됨: "게시" 버튼
  - 게시됨: "수정" 버튼

---

## 5. 가이드 상세 & 승인 (`/guides/[id]`)

### 레이아웃 구조
```
┌─────────────────────────────────────────────┐
│ Header                                      │
├──────────┬──────────────────────────────────┤
│          │  뒤로가기 버튼                     │
│          │  페이지 제목: "가이드 승인"        │
│          │                                    │
│ Sidebar  │  승인 워크플로우 인디케이터        │
│          │  ● ─── ○ ─── ○                   │
│          │  대기  승인  게시                  │
│          │                                    │
│          │  가이드 미리보기                   │
│          │  ┌──────────────────────────┐    │
│          │  │ # 가이드 제목            │    │
│          │  │                          │    │
│          │  │ ## 문제                  │    │
│          │  │ ...                      │    │
│          │  │                          │    │
│          │  │ ## 원인                  │    │
│          │  │ ...                      │    │
│          │  │                          │    │
│          │  │ ## 해결절차              │    │
│          │  │ ...                      │    │
│          │  └──────────────────────────┘    │
│          │                                    │
│          │  승인 액션 영역                    │
│          │  ┌──────────────────────────┐    │
│          │  │ Textarea (승인 코멘트)   │    │
│          │  │ [승인] [수정요청] [반려] │    │
│          │  └──────────────────────────┘    │
└──────────┴──────────────────────────────────┘
```

### 컴포넌트 계층
```
GuideApprovalPage
├─ Header
├─ Sidebar
└─ Main
   ├─ Breadcrumb
   ├─ PageTitle (h1: "가이드 승인")
   ├─ ApprovalWorkflow
   │  └─ Step[]
   │     ├─ StepIndicator (원형)
   │     ├─ StepLabel
   │     └─ StepLine (연결선)
   ├─ GuideMetadata
   │  ├─ InfoRow: 관련 VOC
   │  ├─ InfoRow: 작성자
   │  ├─ InfoRow: 생성일
   │  └─ InfoRow: 현재 상태
   ├─ GuidePreview
   │  ├─ PreviewHeader
   │  │  ├─ Title (h2)
   │  │  └─ EditButton (작성자만 표시)
   │  └─ PreviewContent
   │     ├─ Section: 문제
   │     ├─ Section: 원인
   │     ├─ Section: 해결절차
   │     ├─ Section: 해결방법
   │     └─ Section: 참고출처
   └─ ApprovalActions (승인자만 표시)
      ├─ CommentTextarea
      │  └─ Textarea (placeholder: "승인 코멘트...")
      └─ ActionButtons
         ├─ Button ("승인", variant: primary)
         ├─ Button ("수정 요청", variant: outline)
         └─ Button ("반려", variant: danger)
```

### 주요 요소

#### ApprovalWorkflow
- **레이아웃**: `flex items-center justify-center gap-4`
- **스텝 인디케이터**:
  - 완료: `bg-green-500 border-green-500`
  - 현재: `bg-blue-500 border-blue-500 ring-4 ring-blue-100`
  - 대기: `bg-white border-gray-300`
- **연결선**: `flex-1 h-0.5 bg-gray-300`

#### GuidePreview
- **스타일**: `prose prose-lg max-w-none`
- **각 섹션**:
  - 제목: h3 (text-xl font-semibold)
  - 내용: Markdown 렌더링
  - 구분선: `border-t border-gray-200 pt-6 mt-6`
- **코드 블록**: 문법 하이라이팅 적용

#### ApprovalActions
- **조건 렌더링**: 승인 권한이 있는 사용자에게만 표시
- **댓글 영역**: 
  - 높이: `h-24`
  - 최대 300자
- **버튼 배치**: 오른쪽 정렬, gap-2

---

## 6. 로그인 (`/login`)

### 레이아웃 구조
```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│              ┌──────────────┐              │
│              │              │              │
│              │  VOC Agent   │              │
│              │    로고      │              │
│              │              │              │
│              │  ┌────────┐  │              │
│              │  │이메일  │  │              │
│              │  └────────┘  │              │
│              │  ┌────────┐  │              │
│              │  │비밀번호│  │              │
│              │  └────────┘  │              │
│              │              │              │
│              │  [로그인]    │              │
│              │              │              │
│              └──────────────┘              │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

### 컴포넌트 계층
```
LoginPage
└─ CenterContainer (flex items-center justify-center min-h-screen)
   └─ LoginCard (max-w-md w-full)
      ├─ CardHeader
      │  ├─ Logo
      │  ├─ Title (h1: "VOC Agent")
      │  └─ Subtitle (text-gray-600: "로그인")
      ├─ CardBody
      │  └─ LoginForm
      │     ├─ FormField
      │     │  ├─ Label ("이메일")
      │     │  ├─ Input (type: email)
      │     │  └─ ErrorMessage
      │     ├─ FormField
      │     │  ├─ Label ("비밀번호")
      │     │  ├─ Input (type: password)
      │     │  └─ ErrorMessage
      │     ├─ RememberMeCheckbox
      │     └─ SubmitButton ("로그인")
      └─ CardFooter
         └─ HelpLinks
            └─ Link ("비밀번호 찾기")
```

### 주요 요소

#### LoginCard
- **크기**: `max-w-md w-full`
- **패딩**: `p-8`
- **스타일**: `rounded-xl shadow-xl border border-gray-200`

#### 폼 필드
- **간격**: `space-y-4`
- **입력 필드**: 
  - 높이: `h-12`
  - 테두리: `border-2` (포커스 시 `border-blue-500`)
- **에러 상태**: 
  - 테두리: `border-red-500`
  - 메시지: `text-sm text-red-600`

#### 로그인 버튼
- **크기**: `w-full h-12`
- **스타일**: `bg-blue-500 hover:bg-blue-600 text-white`
- **로딩 상태**: 스피너 아이콘 표시

---

## 7. 공통 레이아웃 요소

### Header
```
Header
├─ Logo (왼쪽)
├─ Navigation (중앙, 데스크톱만)
│  ├─ NavLink: 대시보드
│  ├─ NavLink: VOC
│  └─ NavLink: 가이드
└─ UserMenu (오른쪽)
   ├─ NotificationIcon (뱃지)
   └─ UserAvatar (드롭다운)
      ├─ MenuItem: 프로필
      ├─ MenuItem: 설정
      └─ MenuItem: 로그아웃
```

- **높이**: `h-16`
- **배경**: `bg-white border-b border-gray-200`
- **스타일**: `sticky top-0 z-50`

### Sidebar
```
Sidebar
├─ NavSection: 메인
│  ├─ NavItem: 대시보드 (Home 아이콘)
│  ├─ NavItem: VOC 목록 (MessageSquare 아이콘)
│  └─ NavItem: 가이드 목록 (FileText 아이콘)
├─ NavSection: 관리
│  ├─ NavItem: 사용자 관리 (Users 아이콘)
│  └─ NavItem: 설정 (Settings 아이콘)
└─ NavSection: 하단
   └─ NavItem: 도움말 (HelpCircle 아이콘)
```

- **너비**: `w-64` (데스크톱), 전체 화면 오버레이 (모바일)
- **배경**: `bg-gray-50 border-r border-gray-200`
- **각 NavItem**:
  - 패딩: `px-4 py-3`
  - 활성: `bg-blue-50 text-blue-600 border-r-2 border-blue-600`
  - 호버: `bg-gray-100`

---

## 8. 반응형 동작

### 모바일 (< 768px)
- Sidebar: 햄버거 메뉴 → 전체 화면 오버레이
- 테이블: 카드 레이아웃으로 전환
- 통계 카드: 1열 스택
- 필터: 세로 스택
- 2열 그리드: 1열로 전환

### 태블릿 (768px - 1024px)
- Sidebar: 고정 표시
- 통계 카드: 2열 그리드
- 테이블: 스크롤 가능

### 데스크톱 (>= 1024px)
- 모든 요소 최적화된 레이아웃
- 통계 카드: 3열 그리드
- 2열 그리드: 유지

---

## 9. 컴포넌트 재사용 맵

| 컴포넌트 | 사용 페이지 |
|---------|------------|
| Header | 모든 페이지 (로그인 제외) |
| Sidebar | 모든 페이지 (로그인 제외) |
| DataTable | 대시보드, VOC 목록, 가이드 목록 |
| StatusBadge | 모든 목록 페이지 |
| SearchBar | VOC 목록, 가이드 목록 |
| Card | 대시보드, VOC 상세, 로그인 |
| Button | 모든 페이지 |
| Modal | 삭제 확인, 알림 등 |

---

## 10. 데이터 요구사항 (백엔드 연동)

### 대시보드
- `GET /api/stats` - 통계 데이터
- `GET /api/voc/recent` - 최근 VOC 5개
- `GET /api/voc/category-distribution` - 카테고리별 분포

### VOC 목록
- `GET /api/voc?page=1&limit=20&status=...&category=...` - VOC 목록 (페이지네이션)

### VOC 상세
- `GET /api/voc/:id` - VOC 상세 정보
- `POST /api/voc/:id/generate-guide` - 가이드 생성 요청
- `GET /api/voc/:id/rag-results` - RAG 검색 결과

### 가이드 목록
- `GET /api/guides?status=...&page=1` - 가이드 목록

### 가이드 상세
- `GET /api/guides/:id` - 가이드 상세
- `POST /api/guides/:id/approve` - 승인
- `POST /api/guides/:id/reject` - 반려
- `PUT /api/guides/:id` - 수정

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

---

## 11. 접근성 고려사항

- 모든 폼 필드에 `<label>` 연결
- 아이콘 버튼에 `aria-label` 추가
- 키보드 네비게이션 지원 (Tab, Enter, Esc)
- 포커스 인디케이터 명확히 표시
- 색상에만 의존하지 않는 정보 전달 (아이콘, 텍스트 병기)
- 스크린 리더 지원 (ARIA 속성)

---

## 12. 에러 상태 처리

### 로딩 상태
- 테이블: 스켈레톤 UI 표시
- 버튼: 스피너 아이콘 + disabled
- 전체 페이지: 중앙 로딩 인디케이터

### 에러 상태
- API 에러: Toast 알림 또는 인라인 에러 메시지
- 404: "해당 VOC/가이드를 찾을 수 없습니다" 페이지
- 권한 없음: "접근 권한이 없습니다" 페이지

### 빈 상태
- 빈 테이블: "등록된 VOC가 없습니다" 메시지 + "새 VOC 등록" 버튼
- 검색 결과 없음: "검색 결과가 없습니다" 메시지
