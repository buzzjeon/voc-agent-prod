# VOC Agent Database Schema

## 테이블 구조

### User
사용자 정보

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | String (CUID) | Primary Key |
| email | String (unique) | 이메일 |
| name | String | 이름 |
| role | String | PDM / ENGINEER / ADMIN |
| createdAt | DateTime | 생성일시 |

**Relations:**
- `vocs` (1:N) → VOC.userId
- `guides` (1:N) → Guide.authorId
- `approvals` (1:N) → Approval.approverId

---

### VOC
Jira에서 수신한 VOC 티켓

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | String (CUID) | Primary Key |
| jiraKey | String (unique) | Jira 티켓 키 (예: VOC-123) |
| title | String | 제목 |
| description | Text | 상세 설명 |
| category | String | COMPUTE / STORAGE / NETWORK / etc |
| status | String | NEW / IN_PROGRESS / RESOLVED |
| priority | String | HIGH / MEDIUM / LOW |
| reporter | String | 보고자 이름 |
| createdAt | DateTime | 생성일시 |
| updatedAt | DateTime | 수정일시 |
| userId | String? | 담당자 ID (optional) |

**Relations:**
- `user` (N:1) → User.id
- `guides` (1:N) → Guide.vocId

**Indexes:**
- `jiraKey` (unique)

---

### Guide
VOC 해결 가이드

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | String (CUID) | Primary Key |
| vocId | String | VOC ID (Foreign Key) |
| title | String | 가이드 제목 |
| problem | Text | 문제 상황 |
| cause | Text | 원인 분석 |
| procedure | Text | 해결 절차 |
| solution | Text | 최종 해결 방법 |
| sources | Text | 참고 문서 (JSON 배열 문자열) |
| status | String | DRAFT / PENDING_APPROVAL / APPROVED / PUBLISHED |
| authorId | String | 작성자 ID (Foreign Key) |
| createdAt | DateTime | 생성일시 |
| updatedAt | DateTime | 수정일시 |

**Relations:**
- `voc` (N:1) → VOC.id
- `author` (N:1) → User.id
- `approvals` (1:N) → Approval.guideId

**Indexes:**
- `vocId`
- `authorId`

---

### Approval
가이드 승인 요청

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | String (CUID) | Primary Key |
| guideId | String | 가이드 ID (Foreign Key) |
| approverId | String | 승인자 ID (Foreign Key) |
| status | String | PENDING / APPROVED / REJECTED |
| comment | Text? | 승인/반려 코멘트 (optional) |
| createdAt | DateTime | 생성일시 |
| updatedAt | DateTime | 수정일시 |

**Relations:**
- `guide` (N:1) → Guide.id
- `approver` (N:1) → User.id

**Indexes:**
- `guideId`
- `approverId`

---

### Document
RAG용 문서 저장소

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | String (CUID) | Primary Key |
| title | String | 문서 제목 |
| content | Text | 문서 내용 |
| source | String | SCP_DOCS / CONFLUENCE / FAQ / JIRA |
| url | String? | 원본 URL (optional) |
| category | String | 카테고리 |
| createdAt | DateTime | 생성일시 |
| updatedAt | DateTime | 수정일시 |

**Indexes:**
- `source`
- `category`

---

## ERD 관계도

```
User (1) ─────< (N) VOC
  │                  │
  │                  │
  │                  └─< (N) Guide
  │                           │
  └──────────────────< (N) ──┘
                              │
                              └─< (N) Approval ───> (N:1) User
```

## 주요 제약사항

1. **Unique Constraints:**
   - User.email
   - VOC.jiraKey

2. **Cascade Rules:**
   - VOC 삭제 시 → 연결된 Guide도 삭제 (CASCADE)
   - Guide 삭제 시 → 연결된 Approval도 삭제 (CASCADE)

3. **Default Values:**
   - VOC.status = "NEW"
   - Guide.status = "DRAFT"
   - Approval.status = "PENDING"
