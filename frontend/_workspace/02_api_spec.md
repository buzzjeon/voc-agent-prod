# VOC Agent API Specification

## 응답 래핑 규칙
- **모든 성공 응답**: 직접 반환 (래핑 없음)
- **모든 에러 응답**: `{ error: string, code?: string }` 형식

## 필드명 규칙
- DB: snake_case
- API 응답: camelCase
- 변환은 서버에서 자동 처리

## 공통 에러 코드
- `INVALID_INPUT`: 입력 유효성 검증 실패
- `NOT_FOUND`: 리소스를 찾을 수 없음
- `UNAUTHORIZED`: 인증 실패
- `FORBIDDEN`: 권한 부족
- `INTERNAL_ERROR`: 서버 내부 오류

---

## VOC API

### GET /api/voc
VOC 목록 조회

**Query Parameters:**
- `status?: string` - NEW | IN_PROGRESS | RESOLVED
- `category?: string` - COMPUTE | STORAGE | NETWORK
- `priority?: string` - HIGH | MEDIUM | LOW
- `page?: number` - 페이지 번호 (기본값: 1)
- `limit?: number` - 페이지당 개수 (기본값: 20)

**Response 200:**
```typescript
{
  items: Array<{
    id: string;
    jiraKey: string;
    title: string;
    description: string;
    category: string;
    status: string;
    priority: string;
    reporter: string;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

**Response 400:**
```json
{ "error": "Invalid query parameters", "code": "INVALID_INPUT" }
```

래핑: 없음 (직접 반환)
비동기: 없음 (즉시 결과 반환)

---

### GET /api/voc/[id]
VOC 상세 조회

**Response 200:**
```typescript
{
  id: string;
  jiraKey: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  guides: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
}
```

**Response 404:**
```json
{ "error": "VOC not found", "code": "NOT_FOUND" }
```

래핑: 없음
비동기: 없음

---

### POST /api/voc/webhook
Jira Webhook 수신

**Request:**
```typescript
{
  webhookEvent: string;
  issue: {
    key: string;
    fields: {
      summary: string;
      description: string;
      priority: { name: string };
      reporter: { displayName: string };
      customfield_category?: string;
    };
  };
}
```

**Response 202:**
```json
{ "message": "Webhook received", "vocId": "string" }
```

**Response 400:**
```json
{ "error": "Invalid webhook payload", "code": "INVALID_INPUT" }
```

래핑: 없음
비동기: 있음 (VOC 생성 후 202 반환)

---

## Guide API

### GET /api/guides
가이드 목록 조회

**Query Parameters:**
- `vocId?: string` - VOC ID로 필터링
- `status?: string` - DRAFT | PENDING_APPROVAL | APPROVED | PUBLISHED
- `authorId?: string` - 작성자 ID로 필터링
- `page?: number`
- `limit?: number`

**Response 200:**
```typescript
{
  items: Array<{
    id: string;
    vocId: string;
    title: string;
    status: string;
    author: {
      id: string;
      name: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

래핑: 없음
비동기: 없음

---

### POST /api/guides
가이드 생성

**Request:**
```typescript
{
  vocId: string;
  title: string;
  problem: string;
  cause: string;
  procedure: string;
  solution: string;
  sources: string;
  authorId: string;
}
```

**Response 201:**
```typescript
{
  id: string;
  vocId: string;
  title: string;
  problem: string;
  cause: string;
  procedure: string;
  solution: string;
  sources: string;
  status: "DRAFT";
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
```

**Response 400:**
```json
{ "error": "Invalid input", "code": "INVALID_INPUT" }
```

래핑: 없음
비동기: 없음

---

### GET /api/guides/[id]
가이드 상세 조회

**Response 200:**
```typescript
{
  id: string;
  vocId: string;
  voc: {
    id: string;
    jiraKey: string;
    title: string;
  };
  title: string;
  problem: string;
  cause: string;
  procedure: string;
  solution: string;
  sources: string;
  status: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  approvals: Array<{
    id: string;
    status: string;
    comment: string | null;
    approver: {
      id: string;
      name: string;
    };
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

**Response 404:**
```json
{ "error": "Guide not found", "code": "NOT_FOUND" }
```

래핑: 없음
비동기: 없음

---

### PATCH /api/guides/[id]
가이드 수정

**Request:**
```typescript
{
  title?: string;
  problem?: string;
  cause?: string;
  procedure?: string;
  solution?: string;
  sources?: string;
  status?: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "PUBLISHED";
}
```

**Response 200:**
```typescript
{
  id: string;
  // ... 전체 가이드 정보
}
```

**Response 404:**
```json
{ "error": "Guide not found", "code": "NOT_FOUND" }
```

래핑: 없음
비동기: 없음

---

### DELETE /api/guides/[id]
가이드 삭제

**Response 204:**
(No content)

**Response 404:**
```json
{ "error": "Guide not found", "code": "NOT_FOUND" }
```

래핑: 없음
비동기: 없음

---

### POST /api/guides/generate
AI 가이드 생성 (RAG 호출)

**Request:**
```typescript
{
  vocId: string;
  authorId: string;
}
```

**Response 202:**
```json
{
  "message": "Guide generation started",
  "jobId": "string"
}
```

**Response 400:**
```json
{ "error": "Invalid input", "code": "INVALID_INPUT" }
```

**Response 404:**
```json
{ "error": "VOC not found", "code": "NOT_FOUND" }
```

래핑: 없음
비동기: 있음 (백그라운드에서 RAG 호출 후 가이드 생성)

---

## Approval API

### POST /api/approvals
승인 요청 생성

**Request:**
```typescript
{
  guideId: string;
  approverId: string;
}
```

**Response 201:**
```typescript
{
  id: string;
  guideId: string;
  approverId: string;
  status: "PENDING";
  comment: null;
  createdAt: string;
  updatedAt: string;
}
```

**Response 400:**
```json
{ "error": "Invalid input", "code": "INVALID_INPUT" }
```

**Response 404:**
```json
{ "error": "Guide not found", "code": "NOT_FOUND" }
```

래핑: 없음
비동기: 없음

---

### PATCH /api/approvals/[id]
승인/반려 처리

**Request:**
```typescript
{
  status: "APPROVED" | "REJECTED";
  comment?: string;
}
```

**Response 200:**
```typescript
{
  id: string;
  guideId: string;
  approverId: string;
  status: "APPROVED" | "REJECTED";
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}
```

**Response 400:**
```json
{ "error": "Invalid status transition", "code": "INVALID_INPUT" }
```

**Response 404:**
```json
{ "error": "Approval not found", "code": "NOT_FOUND" }
```

래핑: 없음
비동기: 없음

---

## 상태 전이 규칙

### VOC Status
- NEW → IN_PROGRESS (엔지니어가 작업 시작)
- IN_PROGRESS → RESOLVED (가이드 발행 완료)

### Guide Status
- DRAFT → PENDING_APPROVAL (승인 요청)
- PENDING_APPROVAL → APPROVED (승인 완료)
- PENDING_APPROVAL → DRAFT (반려 후 재작성)
- APPROVED → PUBLISHED (발행)

### Approval Status
- PENDING → APPROVED (승인)
- PENDING → REJECTED (반려)
