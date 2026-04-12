# VOC Agent - AI 기반 자동 가이드 생성 시스템

RAG (Retrieval-Augmented Generation) + LLM 기반으로 SCP VOC를 자동 분석하고, 표준 가이드를 즉시 생성하는 시스템입니다.

## 🎯 핵심 기능

- **VOC 자동 수집**: Jira Webhook으로 VOC 티켓 자동 수집 및 분류
- **RAG 검색**: FAISS + BM25 하이브리드 검색으로 관련 지식 검색
- **AI 가이드 생성**: Claude API로 "문제→원인→절차→해결→출처" 구조의 가이드 자동 생성
- **승인 워크플로**: PDM 검토/수정/승인 프로세스
- **Docs 자동 게시**: 승인된 가이드를 고객용 페이지로 발행

## 🏗️ 프로젝트 구조

```
voc-agent/
├── frontend/          # Next.js 15 풀스택 앱
│   ├── app/           # App Router 페이지
│   ├── components/    # React 컴포넌트
│   ├── lib/           # 유틸리티, 훅, 타입
│   └── prisma/        # DB 스키마
├── backend/           # Python FastAPI RAG 서비스
│   ├── app/           # FastAPI 앱
│   │   ├── main.py    # 메인 서버
│   │   ├── rag.py     # FAISS + BM25 검색
│   │   └── llm.py     # Claude API 통합
│   └── Dockerfile
└── shared/            # 공유 타입 정의
```

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 18+ / npm
- Python 3.11+
- PostgreSQL 15+
- Docker (선택사항)

### 1. 프론트엔드 (Next.js)

```bash
cd frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# DATABASE_URL, RAG_SERVICE_URL, CLAUDE_API_KEY 설정

# Prisma 초기화
npx prisma generate
npx prisma db push

# 개발 서버 실행
npm run dev
```

→ http://localhost:3000 접속

### 2. 백엔드 (Python RAG)

```bash
cd backend

# 가상환경 생성
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
export CLAUDE_API_KEY="sk-ant-..."

# 서버 실행
uvicorn app.main:app --reload --port 8000
```

→ http://localhost:8000/docs (API 문서)

### Docker로 실행

```bash
# 백엔드 (RAG 서비스)
cd backend
docker build -t voc-agent-rag .
docker run -p 8000:8000 -e CLAUDE_API_KEY="..." voc-agent-rag

# 프론트엔드
cd frontend
docker build -t voc-agent-frontend .
docker run -p 3000:3000 voc-agent-frontend
```

## 📚 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod

### Backend (RAG Service)
- **Framework**: FastAPI
- **Vector Search**: FAISS (multilingual-e5-large-instruct, 1590d)
- **Keyword Search**: BM25 (rank-bm25)
- **LLM**: Claude API (Anthropic SDK)
- **Hybrid**: α=0.1 (BM25 지배 방식)

### Deployment
- **Frontend**: Vercel
- **Backend**: Docker + Cloud Run
- **Database**: PostgreSQL (Supabase / Railway)

## 🎨 주요 페이지

1. **대시보드** (`/dashboard`) - VOC 통계 및 최근 활동
2. **VOC 목록** (`/voc`) - VOC 필터/검색/목록
3. **VOC 상세** (`/voc/[id]`) - VOC 정보 + 가이드 생성
4. **가이드 목록** (`/guides`) - 생성된 가이드 관리
5. **가이드 승인** (`/guides/[id]`) - 승인 워크플로

## 📊 성능 목표 (Phase 1 MVP)

- **Recall@20**: ≥ 0.90 (검색 정확도)
- **가이드 생성 시간**: < 30초
- **VOC 응답 시간**: < 5분 (기존 60분 대비 92% 단축)
- **가이드 품질 승인율**: ≥ 80%

## 🔧 개발

### API 엔드포인트

**Next.js API Routes:**
- `GET /api/voc` - VOC 목록
- `GET /api/voc/[id]` - VOC 상세
- `POST /api/voc/webhook` - Jira Webhook
- `GET /api/guides` - 가이드 목록
- `POST /api/guides` - 가이드 생성
- `POST /api/guides/generate` - AI 가이드 생성 (RAG 호출)
- `POST /api/approvals` - 승인 요청

**Python RAG Service:**
- `POST /search` - 하이브리드 검색 (FAISS + BM25)
- `POST /generate` - Claude API 가이드 생성
- `GET /health` - 헬스체크

### 데이터베이스 스키마

```prisma
model VOC {
  id          String   @id @default(cuid())
  jiraKey     String   @unique
  title       String
  description String
  category    String
  status      String
  priority    String
  createdAt   DateTime @default(now())
  guides      Guide[]
}

model Guide {
  id          String   @id @default(cuid())
  vocId       String
  title       String
  problem     String   // 문제
  cause       String   // 원인
  procedure   String   // 절차
  solution    String   // 해결
  sources     String   // 출처
  status      String
  createdAt   DateTime @default(now())
  approvals   Approval[]
}

model Approval {
  id          String   @id @default(cuid())
  guideId     String
  status      String   // PENDING, APPROVED, REJECTED
  comment     String?
  createdAt   DateTime @default(now())
}
```

## 📝 문서

- `CLAUDE.md` - 프로젝트 컨텍스트 및 가이드라인
- `frontend/DESIGN_SYSTEM.md` - UI/UX 디자인 시스템
- `frontend/UI_SPEC.md` - 페이지/컴포넌트 스펙
- `backend/README.md` - RAG 엔진 상세 문서

## 👥 팀

- **PM**: 전준우
- **팀 구성**: 4명 소규모팀
- **스프린트**: 1주 단위

## 📅 프로젝트 타임라인

- **Discovery & Design**: 2026-04-07 ~ 2026-05-09 (S01~S05)
- **Phase 1 MVP**: 2026-05-12 ~ 2026-07-04 (S06~S13)
- **PoC 수행**: 2026-04-06 ✅

## 📄 라이선스

MIT License

---

🤖 Built with [Claude Code](https://claude.ai/code)
