# VOC Agent Backend Setup Guide

## 필수 사전 준비

### 1. Node.js 환경
```bash
node --version  # v20 이상 권장
npm --version   # v10 이상 권장
```

### 2. PostgreSQL 데이터베이스
```bash
# Docker를 사용한 PostgreSQL 실행
docker run --name vocagent-db \
  -e POSTGRES_USER=vocagent \
  -e POSTGRES_PASSWORD=vocagent123 \
  -e POSTGRES_DB=vocagent \
  -p 5432:5432 \
  -d postgres:16
```

---

## 설치 단계

### Step 1: 환경 변수 설정
```bash
# .env.example을 .env로 복사
cp .env.example .env

# .env 파일 수정 (필요시)
# DATABASE_URL="postgresql://vocagent:vocagent123@localhost:5432/vocagent"
```

### Step 2: 의존성 설치
```bash
npm install

# tsx 추가 설치 (시드 스크립트 실행용)
npm install -D tsx
```

### Step 3: Prisma Client 생성
```bash
npm run db:generate
```

출력 예시:
```
✔ Generated Prisma Client (v7.7.0)
```

### Step 4: 데이터베이스 마이그레이션
```bash
npm run db:migrate
```

프롬프트에서 마이그레이션 이름 입력: `init`

### Step 5: 시드 데이터 삽입
```bash
npm run db:seed
```

출력 예시:
```
🌱 Seeding database...
✅ Users created
✅ VOCs created
✅ Guides created
✅ Approvals created
✅ Documents created
🎉 Seeding completed successfully!
```

### Step 6: 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## API 동작 확인

### 1. VOC 목록 조회
```bash
curl http://localhost:3000/api/voc
```

예상 응답:
```json
{
  "items": [
    {
      "id": "...",
      "jiraKey": "VOC-001",
      "title": "VM instance creation fails...",
      "status": "IN_PROGRESS",
      ...
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 20
}
```

### 2. 가이드 목록 조회
```bash
curl http://localhost:3000/api/guides
```

### 3. Prisma Studio로 데이터 확인
```bash
npm run db:studio
```

브라우저에서 http://localhost:5555 자동 오픈

---

## 명령어 요약

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run db:generate` | Prisma Client 생성 |
| `npm run db:migrate` | 데이터베이스 마이그레이션 |
| `npm run db:push` | 스키마를 DB에 직접 푸시 (마이그레이션 없이) |
| `npm run db:studio` | Prisma Studio 실행 |
| `npm run db:seed` | Mock 데이터 삽입 |

---

## 트러블슈팅

### 문제: "Can't reach database server"
```bash
# PostgreSQL 실행 확인
docker ps | grep postgres

# PostgreSQL 재시작
docker restart vocagent-db

# .env의 DATABASE_URL 확인
cat .env | grep DATABASE_URL
```

### 문제: "Prisma Client not generated"
```bash
# Prisma Client 재생성
npm run db:generate

# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
npm run db:generate
```

### 문제: "Migration failed"
```bash
# 개발 환경에서 DB 리셋 (모든 데이터 삭제!)
npx prisma migrate reset

# 다시 마이그레이션 및 시드
npm run db:migrate
npm run db:seed
```

### 문제: "tsx not found"
```bash
# tsx 설치
npm install -D tsx

# 또는 직접 실행
npx tsx lib/mock-data/seed.ts
```

---

## 데이터베이스 스키마 변경 시

1. `prisma/schema.prisma` 파일 수정
2. 마이그레이션 생성:
   ```bash
   npm run db:migrate
   ```
3. Prisma Client 재생성 (자동으로 실행됨)

---

## 프로덕션 배포 준비

### 1. 환경 변수 설정
프로덕션 환경의 `.env` 파일 또는 환경 변수:
```bash
DATABASE_URL="postgresql://..."
RAG_SERVICE_URL="https://rag.production.com"
CLAUDE_API_KEY="sk-ant-..."
NEXTAUTH_SECRET="strong-random-secret"
NEXTAUTH_URL="https://vocagent.production.com"
JIRA_WEBHOOK_SECRET="jira-webhook-secret"
```

### 2. 빌드 및 마이그레이션
```bash
# Prisma Client 생성
npm run db:generate

# 프로덕션 마이그레이션
npx prisma migrate deploy

# 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

---

## 다음 단계

1. **API 테스트**: Postman 또는 curl로 모든 엔드포인트 테스트
2. **Frontend 연동**: React Query 훅 구현
3. **인증 구현**: NextAuth.js 설정
4. **RAG 서비스 연동**: `/api/guides/generate` 실제 구현
5. **모니터링 설정**: 로깅 및 에러 추적

---

## 참고 문서

- API 스펙: `_workspace/02_api_spec.md`
- DB 스키마: `_workspace/02_db_schema.md`
- 상태 머신: `_workspace/02_state_machine.md`
- 백엔드 README: `_workspace/BACKEND_README.md`
