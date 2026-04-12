# VOC Agent State Machine

## 1. VOC Status State Machine

```
┌─────┐     start work     ┌─────────────┐     complete     ┌──────────┐
│ NEW │ ─────────────────> │ IN_PROGRESS │ ───────────────> │ RESOLVED │
└─────┘                     └─────────────┘                  └──────────┘
```

### 상태 정의

- **NEW**: Jira Webhook으로 생성된 초기 상태
- **IN_PROGRESS**: 엔지니어가 작업을 시작한 상태
- **RESOLVED**: 가이드 작성 및 승인 완료로 VOC가 해결된 상태

### 전이 조건

| From | To | Trigger | Validation |
|------|----|---------|-----------| 
| NEW | IN_PROGRESS | 엔지니어가 VOC 할당 받음 | userId 필수 |
| IN_PROGRESS | RESOLVED | Guide가 PUBLISHED 상태로 전환됨 | 최소 1개의 PUBLISHED Guide 필요 |

### 전이 불가 케이스

- RESOLVED → IN_PROGRESS (한번 해결된 VOC는 재오픈 불가)
- NEW → RESOLVED (IN_PROGRESS를 거치지 않고 바로 해결 불가)

---

## 2. Guide Status State Machine

```
┌───────┐    request approval    ┌──────────────────┐
│ DRAFT │ ─────────────────────> │ PENDING_APPROVAL │
└───────┘                         └──────────────────┘
   ^                                      │
   │                                      │
   │ reject                               │ approve
   │                                      ▼
   │                              ┌──────────┐    publish    ┌───────────┐
   └──────────────────────────────│ APPROVED │ ────────────> │ PUBLISHED │
                                  └──────────┘               └───────────┘
```

### 상태 정의

- **DRAFT**: 작성 중인 초기 상태
- **PENDING_APPROVAL**: PDM에게 승인 요청한 상태
- **APPROVED**: PDM이 승인한 상태
- **PUBLISHED**: 최종 발행되어 공개된 상태

### 전이 조건

| From | To | Trigger | Validation |
|------|----|---------|-----------| 
| DRAFT | PENDING_APPROVAL | 작성자가 승인 요청 | 모든 필수 필드 작성 완료 |
| PENDING_APPROVAL | APPROVED | PDM이 승인 | Approval.status = APPROVED |
| PENDING_APPROVAL | DRAFT | PDM이 반려 | Approval.status = REJECTED |
| APPROVED | PUBLISHED | 작성자가 발행 | - |

### 전이 불가 케이스

- DRAFT → APPROVED (PENDING_APPROVAL을 거치지 않고 승인 불가)
- PUBLISHED → (any) (발행 후 상태 변경 불가, 새 버전 생성 필요)
- APPROVED → DRAFT (승인 후 다시 초안으로 되돌리기 불가)

### 상태별 가능한 액션

| Status | Allowed Actions |
|--------|----------------|
| DRAFT | 수정, 삭제, 승인 요청 |
| PENDING_APPROVAL | 조회만 가능 (수정 불가) |
| APPROVED | 발행, 조회 |
| PUBLISHED | 조회만 가능 |

---

## 3. Approval Status State Machine

```
┌─────────┐
│ PENDING │
└─────────┘
     │
     ├──> approve ──> ┌──────────┐
     │                │ APPROVED │
     │                └──────────┘
     │
     └──> reject ───> ┌──────────┐
                      │ REJECTED │
                      └──────────┘
```

### 상태 정의

- **PENDING**: 승인 대기 중
- **APPROVED**: 승인 완료
- **REJECTED**: 반려됨

### 전이 조건

| From | To | Trigger | Validation |
|------|----|---------|-----------| 
| PENDING | APPROVED | 승인자가 승인 | approverId가 PDM 역할 |
| PENDING | REJECTED | 승인자가 반려 | comment 필수 |

### 전이 불가 케이스

- APPROVED → REJECTED (승인 후 반려로 변경 불가)
- REJECTED → APPROVED (반려 후 승인으로 변경 불가)
- APPROVED/REJECTED → PENDING (최종 상태에서 다시 대기로 불가)

### Side Effects

- **APPROVED로 전이 시**: 연결된 Guide의 status가 APPROVED로 변경
- **REJECTED로 전이 시**: 연결된 Guide의 status가 DRAFT로 변경

---

## 4. 상태 전이 구현 상수

### TypeScript 구현 예시

```typescript
export const STATE_TRANSITIONS = {
  VOC: {
    NEW: ['IN_PROGRESS'],
    IN_PROGRESS: ['RESOLVED'],
    RESOLVED: [],
  },
  GUIDE: {
    DRAFT: ['PENDING_APPROVAL'],
    PENDING_APPROVAL: ['APPROVED', 'DRAFT'],
    APPROVED: ['PUBLISHED'],
    PUBLISHED: [],
  },
  APPROVAL: {
    PENDING: ['APPROVED', 'REJECTED'],
    APPROVED: [],
    REJECTED: [],
  },
} as const;

export function isValidTransition(
  entity: 'VOC' | 'GUIDE' | 'APPROVAL',
  from: string,
  to: string
): boolean {
  const allowed = STATE_TRANSITIONS[entity][from as keyof typeof STATE_TRANSITIONS[typeof entity]];
  return allowed?.includes(to) ?? false;
}
```

---

## 5. 비즈니스 규칙

### VOC 해결 조건

VOC가 RESOLVED 상태가 되려면:
1. 최소 1개의 Guide가 PUBLISHED 상태여야 함
2. 해당 Guide는 최소 1개의 APPROVED Approval을 가져야 함

### 승인 프로세스

1. Engineer가 Guide를 DRAFT로 작성
2. Engineer가 승인 요청 → Guide가 PENDING_APPROVAL로 전환
3. PDM이 Approval 생성 (자동 PENDING 상태)
4. PDM이 Approval을 APPROVED/REJECTED로 변경
5. APPROVED면 Guide가 APPROVED로, REJECTED면 DRAFT로 자동 변경
6. APPROVED된 Guide는 Engineer가 PUBLISHED로 발행

### 권한별 액션

| Role | VOC | Guide | Approval |
|------|-----|-------|----------|
| ADMIN | 모든 액션 | 모든 액션 | 모든 액션 |
| ENGINEER | 조회, 할당 | 생성, 수정, 삭제, 발행 | 조회 |
| PDM | 조회 | 조회 | 생성, 승인/반려 |
