# VOC Agent Design System

## 개요

VOC Agent 시스템의 디자인 언어와 UI 토큰을 정의합니다. 모든 프론트엔드 컴포넌트는 이 시스템을 기준으로 구현합니다.

---

## 1. 컬러 팔레트

### Primary (SCP 브랜드 블루)
- **Primary 50**: `#EFF6FF` - `bg-blue-50`
- **Primary 100**: `#DBEAFE` - `bg-blue-100`
- **Primary 200**: `#BFDBFE` - `bg-blue-200`
- **Primary 500**: `#3B82F6` - `bg-blue-500` (기본 브랜드 색상)
- **Primary 600**: `#2563EB` - `bg-blue-600` (호버 상태)
- **Primary 700**: `#1D4ED8` - `bg-blue-700` (액티브 상태)
- **Primary 900**: `#1E3A8A` - `bg-blue-900`

### Secondary (중립 그레이)
- **Gray 50**: `#F9FAFB` - `bg-gray-50` (배경)
- **Gray 100**: `#F3F4F6` - `bg-gray-100` (카드 배경)
- **Gray 200**: `#E5E7EB` - `bg-gray-200` (구분선)
- **Gray 400**: `#9CA3AF` - `text-gray-400` (보조 텍스트)
- **Gray 600**: `#4B5563` - `text-gray-600` (서브 텍스트)
- **Gray 900**: `#111827` - `text-gray-900` (본문 텍스트)

### Status Colors
- **Success 500**: `#10B981` - `bg-green-500`
- **Success 100**: `#D1FAE5` - `bg-green-100`
- **Warning 500**: `#F59E0B` - `bg-amber-500`
- **Warning 100**: `#FEF3C7` - `bg-amber-100`
- **Error 500**: `#EF4444` - `bg-red-500`
- **Error 100**: `#FEE2E2` - `bg-red-100`
- **Info 500**: `#6366F1` - `bg-indigo-500`
- **Info 100**: `#E0E7FF` - `bg-indigo-100`

---

## 2. 타이포그래피

### 폰트 패밀리
- **Primary**: `Pretendard Variable` (한글/영문)
- **Fallback**: `Inter`, `-apple-system`, `system-ui`
- **Monospace**: `"JetBrains Mono"`, `"Fira Code"`, `monospace` (코드 블록)

### 폰트 크기 (Tailwind 기준)
```css
text-xs    → 0.75rem (12px)   /* 캡션, 뱃지 */
text-sm    → 0.875rem (14px)  /* 보조 텍스트, 라벨 */
text-base  → 1rem (16px)      /* 본문 텍스트 */
text-lg    → 1.125rem (18px)  /* 소제목 */
text-xl    → 1.25rem (20px)   /* 카드 제목 */
text-2xl   → 1.5rem (24px)    /* 섹션 제목 */
text-3xl   → 1.875rem (30px)  /* 페이지 제목 */
```

### 폰트 두께
```css
font-normal   → 400  /* 본문 */
font-medium   → 500  /* 강조 텍스트, 버튼 */
font-semibold → 600  /* 제목, 헤더 */
font-bold     → 700  /* 중요 정보 */
```

### 라인 하이트
```css
leading-tight  → 1.25   /* 제목 */
leading-normal → 1.5    /* 본문 */
leading-relaxed → 1.625 /* 긴 텍스트 블록 */
```

---

## 3. 간격 시스템 (4px 베이스)

### Spacing Scale
```css
0   → 0px
1   → 0.25rem (4px)
2   → 0.5rem (8px)
3   → 0.75rem (12px)
4   → 1rem (16px)    /* 기본 단위 */
5   → 1.25rem (20px)
6   → 1.5rem (24px)
8   → 2rem (32px)
10  → 2.5rem (40px)
12  → 3rem (48px)
16  → 4rem (64px)
```

### 레이아웃 적용 가이드
- **컴포넌트 내부 패딩**: `p-4` (16px)
- **카드 패딩**: `p-6` (24px)
- **섹션 간격**: `gap-8` (32px)
- **페이지 컨테이너**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **모달 패딩**: `p-8` (32px)

---

## 4. Border Radius

```css
rounded-none → 0px
rounded-sm   → 0.125rem (2px)  /* 뱃지 */
rounded      → 0.25rem (4px)   /* 버튼 */
rounded-md   → 0.375rem (6px)  /* 입력 필드 */
rounded-lg   → 0.5rem (8px)    /* 카드 */
rounded-xl   → 0.75rem (12px)  /* 대형 컨테이너 */
rounded-full → 9999px          /* 아바타, 태그 */
```

---

## 5. Shadow System

```css
shadow-sm  → 0 1px 2px rgba(0,0,0,0.05)      /* 미세한 구분 */
shadow     → 0 1px 3px rgba(0,0,0,0.1)       /* 기본 카드 */
shadow-md  → 0 4px 6px rgba(0,0,0,0.1)       /* 드롭다운 */
shadow-lg  → 0 10px 15px rgba(0,0,0,0.1)     /* 모달 */
shadow-xl  → 0 20px 25px rgba(0,0,0,0.1)     /* 팝업 */
```

---

## 6. 컴포넌트 목록

### 6.1 기본 UI 컴포넌트

#### Button
- **Variants**: Primary, Secondary, Outline, Ghost, Danger
- **Sizes**: sm (h-8 px-3), md (h-10 px-4), lg (h-12 px-6)
- **States**: default, hover, active, disabled, loading

#### Input
- **Types**: text, email, password, textarea
- **States**: default, focus, error, disabled
- **Sizes**: sm (h-8), md (h-10), lg (h-12)

#### Select / Dropdown
- **States**: closed, open, selected
- **Features**: 검색 기능, 다중 선택 지원

#### Badge
- **Variants**: 상태별 색상 (대기/진행중/완료/승인됨/반려)
- **Sizes**: sm (h-5 px-2 text-xs), md (h-6 px-3 text-sm)

### 6.2 레이아웃 컴포넌트

#### Card
- **Padding**: p-6
- **Border**: rounded-lg border border-gray-200
- **Shadow**: shadow

#### Modal / Dialog
- **Overlay**: bg-black/50 backdrop-blur-sm
- **Container**: bg-white rounded-xl shadow-xl p-8
- **Max Width**: max-w-lg, max-w-2xl, max-w-4xl

#### Sidebar
- **Width**: w-64 (256px)
- **Mobile**: 전체 화면 오버레이

### 6.3 도메인 특화 컴포넌트

#### VOCCard
VOC 정보를 표시하는 카드 컴포넌트
- **구조**: 제목, 카테고리 뱃지, 상태 뱃지, 날짜
- **Actions**: 상세보기 버튼

#### GuideEditor
Markdown 기반 가이드 편집기
- **Sections**: 문제/원인/절차/해결/출처
- **Features**: 실시간 미리보기, 문법 하이라이팅

#### ApprovalWorkflow
승인 프로세스 상태 표시
- **States**: 대기 → 검토중 → 승인됨/반려
- **Visual**: 스텝 인디케이터 (1 → 2 → 3)

#### SearchBar
검색 및 필터 컴포넌트
- **Features**: 키워드 검색, 카테고리 필터, 상태 필터, 날짜 범위
- **Layout**: Flex row with gap-4

#### DataTable
데이터 테이블 컴포넌트
- **Features**: 정렬, 페이지네이션, 행 선택
- **Columns**: 동적 설정 가능
- **Mobile**: 스택 레이아웃으로 전환

#### StatusBadge
상태 표시 뱃지
- **대기**: bg-gray-100 text-gray-700
- **진행중**: bg-blue-100 text-blue-700
- **완료**: bg-green-100 text-green-700
- **승인됨**: bg-indigo-100 text-indigo-700
- **반려**: bg-red-100 text-red-700
- **게시됨**: bg-emerald-100 text-emerald-700

---

## 7. 반응형 브레이크포인트

```css
sm:  640px  /* 모바일 가로 */
md:  768px  /* 태블릿 */
lg:  1024px /* 데스크톱 */
xl:  1280px /* 대형 데스크톱 */
2xl: 1536px /* 초대형 화면 */
```

### 반응형 전략
1. **Mobile First**: 모든 스타일은 모바일 기준으로 작성
2. **Tablet (md)**: 사이드바 표시, 2열 그리드
3. **Desktop (lg)**: 3열 그리드, 고정 사이드바

---

## 8. 애니메이션 & 트랜지션

### Duration
```css
duration-75   → 75ms   /* 즉각적 피드백 */
duration-150  → 150ms  /* 기본 트랜지션 */
duration-300  → 300ms  /* 모달, 드롭다운 */
duration-500  → 500ms  /* 페이지 전환 */
```

### Easing
```css
ease-in      → cubic-bezier(0.4, 0, 1, 1)
ease-out     → cubic-bezier(0, 0, 0.2, 1)      /* 기본 */
ease-in-out  → cubic-bezier(0.4, 0, 0.2, 1)    /* 모달 */
```

### Common Transitions
```css
transition-colors    → 색상 변화 (버튼 hover)
transition-transform → 크기/위치 변화 (드롭다운)
transition-opacity   → 투명도 변화 (모달 오버레이)
transition-all       → 전체 (일반 사용 지양)
```

---

## 9. 아이콘 시스템

### 아이콘 라이브러리
- **Primary**: Lucide React (트리 쉐이킹 지원)
- **Size Classes**: w-4 h-4 (16px), w-5 h-5 (20px), w-6 h-6 (24px)

### 주요 아이콘
- **Navigation**: Home, Search, Settings, User
- **Actions**: Plus, Edit, Trash2, Check, X
- **Status**: AlertCircle, CheckCircle, XCircle, Clock
- **Content**: FileText, MessageSquare, Send

---

## 10. 접근성 (a11y)

### 필수 가이드라인
- **Color Contrast**: WCAG AA 기준 (4.5:1)
- **Focus Indicators**: ring-2 ring-blue-500 ring-offset-2
- **Keyboard Navigation**: 모든 인터랙티브 요소 키보드 접근 가능
- **ARIA Labels**: 아이콘 버튼, 폼 요소에 필수
- **Skip Links**: 메인 콘텐츠로 바로가기

---

## 11. 구현 체크리스트

- [ ] Tailwind CSS v4 설정 완료
- [ ] Pretendard 웹폰트 로드 (app/layout.tsx)
- [ ] 컬러 토큰 커스텀 클래스 정의 (globals.css)
- [ ] 기본 UI 컴포넌트 구현 (Button, Input, Select, Badge)
- [ ] 레이아웃 컴포넌트 구현 (Card, Modal, Sidebar)
- [ ] 도메인 컴포넌트 구현 (VOCCard, GuideEditor 등)
- [ ] 다크모드 지원 (선택사항)

---

## 12. 참고사항

### 기술 스택
- **Framework**: Next.js 16 (App Router)
- **CSS**: Tailwind CSS v4
- **Components**: shadcn/ui 스타일 참고
- **Icons**: Lucide React

### 네이밍 컨벤션
- **컴포넌트**: PascalCase (e.g., `VOCCard.tsx`)
- **파일**: kebab-case for utilities (e.g., `api-client.ts`)
- **CSS 클래스**: Tailwind utility classes only
- **Props**: camelCase

### 파일 구조
```
app/
├── components/
│   ├── ui/           # 기본 UI 컴포넌트
│   ├── layout/       # 레이아웃 컴포넌트
│   └── domain/       # 도메인 특화 컴포넌트
├── lib/              # 유틸리티
└── styles/           # 전역 스타일
```
