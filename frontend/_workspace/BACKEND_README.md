# VOC Agent Backend Implementation

## 구현 완료 항목

### ✅ 1. Prisma 스키마
**파일**: `prisma/schema.prisma`

5개 모델 구현:
- `User`: 사용자 정보 (ADMIN, PDM, ENGINEER)
- `VOC`: Jira VOC 티켓
- `Guide`: VOC 해결 가이드
- `Approval`: 가이드 승인 프로세스
- `Document`: RAG용 문서 저장소

모든 관계 설정 및 인덱스 포함.

---

### ✅ 2. API Routes (RESTful)

#### VOC API
- `GET /api/voc` - VOC 목록 조회 (필터링, 페이징)
- `GET /api/voc/[id]` - VOC 상세 조회
- `POST /api/voc/webhook` - Jira Webhook 수신 (202 Accepted)

#### Guide API
- `GET /api/guides` - 가이드 목록 조회
- `POST /api/guides` - 가이드 생성 (201 Created)
- `GET /api/guides/[id]` - 가이드 상세 조회
- `PATCH /api/guides/[id]` - 가이드 수정
- `DELETE /api/guides/[id]` - 가이드 삭제 (204 No Content)
- `POST /api/guides/generate` - AI 가이드 생성 (RAG 호출, 202 Accepted)

#### Approval API
- `POST /api/approvals` - 승인 요청 생성 (201 Created)
- `PATCH /api/approvals/[id]` - 승인/반려 처리

---

### ✅ 3. 공통 유틸리티

#### `lib/prisma.ts`
- Prisma Client 싱글톤 인스턴스
- 개발/프로덕션 환경 분리

#### `lib/utils/api-response.ts`
- 통일된 API 응답 형식
- 에러 응답 헬퍼 함수
- 타입 안전한 응답 생성

#### `lib/utils/state-machine.ts`
- VOC/Guide/Approval 상태 전이 검증
- `STATE_TRANSITIONS` 상수 정의
- `isValidTransition()` 헬퍼 함수

#### `lib/utils/validation.ts`
- Zod 스키마 기반 입력 검증
- 모든 API 엔드포인트별 validation schema

---

### ✅ 4. Mock 데이터
**파일**: `lib/mock-data/seed.ts`

테스트용 시드 데이터:
- 3명의 사용자 (Admin, PDM, Engineer)
- 3개의 VOC (COMPUTE, STORAGE, NETWORK)
- 2개의 Guide (APPROVED, PUBLISHED)
- 2개의 Approval
- 3개의 Document (RAG용)

---

### ✅ 5. 환경 변수
**파일**: `.env.example`

설정된 환경 변수:
- `DATABASE_URL` - PostgreSQL 연결 문자열
- `RAG_SERVICE_URL` - RAG 서비스 엔드포인트
- `CLAUDE_API_KEY` - Claude API 키
- `NEXTAUTH_SECRET` - NextAuth 시크릿
- `JIRA_WEBHOOK_SECRET` - Jira Webhook 검증

---

### ✅ 6. 문서화
- `_workspace/02_api_spec.md` - 전체 API 스펙
- `_workspace/02_db_schema.md` - DB 스키마 ERD
- `_workspace/02_state_machine.md` - 상태 전이 맵

---

## 설치 및 실행

### 1. Prisma 초기화
```bash
npx prisma generate
```

### 2. 데이터베이스 마이그레이션
```bash
npx prisma migrate dev --name init
```

### 3. 시드 데이터 삽입
```bash
npx tsx lib/mock-data/seed.ts
```

### 4. 개발 서버 실행
```bash
npm run dev
```

---

## API 테스트

### VOC 목록 조회
```bash
curl http://localhost:3000/api/voc?status=NEW&page=1&limit=10
```

### VOC 상세 조회
```bash
curl http://localhost:3000/api/voc/[id]
```

### Jira Webhook 테스트
```bash
curl -X POST http://localhost:3000/api/voc/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "webhookEvent": "jira:issue_created",
    "issue": {
      "key": "VOC-123",
      "fields": {
        "summary": "Test issue",
        "description": "Test description",
        "priority": { "name": "High" },
        "reporter": { "displayName": "John Doe" },
        "customfield_category": "COMPUTE"
      }
    }
  }'
```

### 가이드 생성
```bash
curl -X POST http://localhost:3000/api/guides \
  -H "Content-Type: application/json" \
  -d '{
    "vocId": "[voc-id]",
    "title": "Solution Guide",
    "problem": "Problem description",
    "cause": "Root cause",
    "procedure": "Step by step",
    "solution": "Final solution",
    "sources": "[{\"title\":\"Doc\",\"url\":\"https://...\"}]",
    "authorId": "[user-id]"
  }'
```

### AI 가이드 생성 (비동기)
```bash
curl -X POST http://localhost:3000/api/guides/generate \
  -H "Content-Type: application/json" \
  -d '{
    "vocId": "[voc-id]",
    "authorId": "[user-id]"
  }'
```

### 승인 요청
```bash
curl -X POST http://localhost:3000/api/approvals \
  -H "Content-Type: application/json" \
  -d '{
    "guideId": "[guide-id]",
    "approverId": "[user-id]"
  }'
```

### 승인 처리
```bash
curl -X PATCH http://localhost:3000/api/approvals/[id] \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED",
    "comment": "Looks good!"
  }'
```

---

## 주요 특징

### 1. 타입 안전성
- Zod를 통한 런타임 타입 검증
- Prisma를 통한 컴파일 타임 타입 안전성
- TypeScript strict mode

### 2. 상태 머신
- 명시적인 상태 전이 규칙
- 잘못된 전이 방지
- 비즈니스 로직 검증

### 3. 에러 핸들링
- 통일된 에러 응답 형식
- 명확한 에러 코드 (INVALID_INPUT, NOT_FOUND, etc)
- 상세한 에러 메시지

### 4. 비동기 처리
- Webhook: 202 Accepted (백그라운드 처리)
- Guide Generation: 202 Accepted (RAG 서비스 호출)

### 5. 페이지네이션
- 모든 목록 API에 page/limit 파라미터
- total count 반환

---

## TODO: 프로덕션 준비

### 인증/인가
- [ ] NextAuth.js 구현
- [ ] JWT 토큰 검증 미들웨어
- [ ] 역할 기반 접근 제어 (RBAC)

### RAG 서비스 연동
- [ ] `/api/guides/generate`에서 실제 RAG 서비스 호출
- [ ] 백그라운드 작업 큐 (Bull, BullMQ)
- [ ] 가이드 생성 상태 추적

### Jira 연동
- [ ] Webhook 서명 검증
- [ ] Jira API 클라이언트
- [ ] 양방향 동기화

### 모니터링
- [ ] API 요청 로깅
- [ ] 에러 추적 (Sentry)
- [ ] 성능 메트릭

### 테스트
- [ ] Unit tests (Jest)
- [ ] Integration tests (API routes)
- [ ] E2E tests (Playwright)

---

## 상태 전이 규칙

### VOC Status
- NEW → IN_PROGRESS (작업 시작)
- IN_PROGRESS → RESOLVED (가이드 발행 완료)

### Guide Status
- DRAFT → PENDING_APPROVAL (승인 요청)
- PENDING_APPROVAL → APPROVED (승인)
- PENDING_APPROVAL → DRAFT (반려)
- APPROVED → PUBLISHED (발행)

### Approval Status
- PENDING → APPROVED (승인)
- PENDING → REJECTED (반려)

---

## 트러블슈팅

### Prisma Client 에러
```bash
# Prisma Client 재생성
npx prisma generate
```

### 데이터베이스 연결 실패
```bash
# .env 파일의 DATABASE_URL 확인
# PostgreSQL 서버 실행 확인
```

### 마이그레이션 충돌
```bash
# 마이그레이션 리셋 (개발 환경에서만!)
npx prisma migrate reset
```

---

## 다음 단계

1. **Frontend 통신**: `_workspace/02_api_spec.md`를 frontend-dev에게 공유
2. **QA 검증**: 각 API 엔드포인트 테스트 요청
3. **RAG 연동**: 백엔드 서비스와 통합
4. **인증 구현**: NextAuth.js 설정
