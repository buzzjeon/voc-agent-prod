# Frontend Hooks & API Mapping

API 훅 목록과 엔드포인트 매핑

## 생성일
2026-04-12

## API 훅

### `useVOCs(options)`
**파일**: `/hooks/use-vocs.ts`

**Options**:
- `category?: string` - 카테고리 필터
- `status?: string` - 상태 필터 (new, analyzing, guide_generated, resolved)
- `priority?: string` - 우선순위 필터 (low, medium, high, urgent)
- `search?: string` - 검색어 (title, description, jiraKey)
- `useMock?: boolean` - Mock 데이터 사용 여부

**Returns**:
- `vocs: VOC[]` - VOC 목록
- `loading: boolean` - 로딩 상태
- `error: string | null` - 에러 메시지

**API Endpoint**: `GET /api/voc?category=&status=&priority=&search=`

**Example**:
```typescript
const { vocs, loading, error } = useVOCs({
  status: 'new',
  priority: 'urgent',
  useMock: true
})
```

---

### `useGuides(options)`
**파일**: `/hooks/use-guides.ts`

**Options**:
- `status?: string` - 상태 필터 (draft, pending_approval, approved, rejected)
- `vocId?: string` - 특정 VOC의 가이드만 조회
- `useMock?: boolean` - Mock 데이터 사용 여부

**Returns**:
- `guides: Guide[]` - 가이드 목록
- `loading: boolean` - 로딩 상태
- `error: string | null` - 에러 메시지

**API Endpoint**: `GET /api/guides?status=&vocId=`

**Example**:
```typescript
const { guides, loading, error } = useGuides({
  status: 'pending_approval',
  useMock: true
})
```

---

### `useGenerateGuide()`
**파일**: `/hooks/use-generate-guide.ts`

**Returns**:
- `generate: (vocId: string) => Promise<Guide>` - 가이드 생성 함수
- `loading: boolean` - 로딩 상태
- `error: string | null` - 에러 메시지
- `guide: Guide | null` - 생성된 가이드

**API Endpoint**: `POST /api/guides/generate`

**Request Body**:
```json
{
  "vocId": "string"
}
```

**Response**: `Guide` 객체

**Example**:
```typescript
const { generate, loading, error } = useGenerateGuide()

const handleGenerate = async () => {
  try {
    const guide = await generate(vocId)
    console.log('Guide generated:', guide)
  } catch (err) {
    console.error('Failed:', err)
  }
}
```

---

## API 클라이언트 함수

### VOC APIs

#### `getVOCs(filters?)`
**파일**: `/lib/api.ts`

**Endpoint**: `GET /api/voc`

**Query Params**:
- `category?: string`
- `status?: string`
- `priority?: string`
- `search?: string`

**Response**: `VOC[]`

---

#### `getVOC(id)`
**파일**: `/lib/api.ts`

**Endpoint**: `GET /api/voc/:id`

**Response**: `VOC`

---

### Guide APIs

#### `getGuides(filters?)`
**파일**: `/lib/api.ts`

**Endpoint**: `GET /api/guides`

**Query Params**:
- `status?: string`
- `vocId?: string`

**Response**: `Guide[]`

---

#### `getGuide(id)`
**파일**: `/lib/api.ts`

**Endpoint**: `GET /api/guides/:id`

**Response**: `Guide`

---

#### `generateGuide(data)`
**파일**: `/lib/api.ts`

**Endpoint**: `POST /api/guides/generate`

**Request Body**:
```typescript
{
  vocId: string
}
```

**Response**: `Guide`

---

#### `approveGuide(data)`
**파일**: `/lib/api.ts`

**Endpoint**: `POST /api/guides/:id/approve`

**Request Body**:
```typescript
{
  approved: boolean
  feedback?: string
}
```

**Response**: `Guide`

---

### Dashboard APIs

#### `getDashboardStats()`
**파일**: `/lib/api.ts`

**Endpoint**: `GET /api/dashboard/stats`

**Response**: `DashboardStats`
```typescript
{
  totalVOCs: number
  pendingGuides: number
  approvedGuides: number
  resolvedVOCs: number
}
```

---

## API 응답 타입

### VOC
```typescript
interface VOC {
  id: string
  jiraKey: string
  title: string
  description: string
  category: string
  status: 'new' | 'analyzing' | 'guide_generated' | 'resolved'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  updatedAt: string
}
```

### Guide
```typescript
interface Guide {
  id: string
  vocId: string
  title: string
  problem: string
  cause: string
  procedure: string
  solution: string
  sources: string
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  approvedBy?: string
  approvedAt?: string
}
```

---

## Mock 데이터 모드

모든 훅은 `useMock: true` 옵션을 지원합니다:

```typescript
// Mock 데이터 사용
const { vocs } = useVOCs({ useMock: true })

// 실제 API 호출 (기본값)
const { vocs } = useVOCs({ useMock: false })
```

API 연결 실패 시 자동으로 mock 데이터로 폴백됩니다.

---

## 에러 핸들링

모든 API 함수는 에러 발생 시 `ApiError` 타입을 throw합니다:

```typescript
interface ApiError {
  error: string
  code?: string
}
```

훅은 에러를 catch하고 `error` 상태로 반환합니다:

```typescript
const { vocs, error } = useVOCs()

if (error) {
  console.error('API Error:', error)
  // Mock 데이터로 폴백됨
}
```
