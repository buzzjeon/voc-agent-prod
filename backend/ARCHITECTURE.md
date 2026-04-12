# VOC Agent Backend Architecture

## 시스템 개요

VOC Agent는 IT 기술지원 문서를 검색하고 Claude AI를 활용하여 자동으로 문제 해결 가이드를 생성하는 RAG(Retrieval-Augmented Generation) 시스템입니다.

## 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Application                      │
│                    (Frontend / API Client)                   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Application                      │
│  ┌────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   main.py  │  │  models.py  │  │   Health Check      │  │
│  │  (Routing) │  │  (Schemas)  │  │   /health           │  │
│  └──────┬─────┘  └─────────────┘  └─────────────────────┘  │
│         │                                                     │
│    ┌────┴────┐                                               │
│    ▼         ▼                                               │
│  ┌────────────────────┐        ┌──────────────────────┐     │
│  │    RAG Engine      │        │   Claude Generator   │     │
│  │     (rag.py)       │        │      (llm.py)        │     │
│  │                    │        │                      │     │
│  │  ┌──────────────┐ │        │  ┌────────────────┐  │     │
│  │  │    FAISS     │ │        │  │  Anthropic API │  │     │
│  │  │   Vector DB  │ │        │  │     Client     │  │     │
│  │  └──────────────┘ │        │  └────────┬───────┘  │     │
│  │                    │        │           │          │     │
│  │  ┌──────────────┐ │        └───────────┼──────────┘     │
│  │  │    BM25      │ │                    │                 │
│  │  │   Keyword    │ │                    │                 │
│  │  │   Search     │ │                    │                 │
│  │  └──────────────┘ │                    │                 │
│  └────────────────────┘                    │                 │
│           │                                │                 │
│           ▼                                ▼                 │
│  ┌────────────────────┐        ┌──────────────────────┐     │
│  │   Sample Data      │        │   Claude 3.5 Sonnet  │     │
│  │    (data.py)       │        │   (External API)     │     │
│  │   50 Documents     │        └──────────────────────┘     │
│  └────────────────────┘                                      │
└─────────────────────────────────────────────────────────────┘
```

## 핵심 컴포넌트

### 1. FastAPI Application (main.py)

**책임사항:**
- HTTP 요청 라우팅
- 요청 검증 및 응답 직렬화
- CORS 처리
- 에러 핸들링
- 서비스 초기화

**주요 엔드포인트:**

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/` | GET | API 정보 |
| `/health` | GET | 헬스체크 |
| `/search` | POST | 문서 검색 |
| `/generate` | POST | 가이드 생성 |
| `/search-and-generate` | POST | 통합 처리 |

### 2. RAG Search Engine (rag.py)

**책임사항:**
- 문서 임베딩 및 인덱싱
- FAISS 벡터 검색
- BM25 키워드 검색
- 하이브리드 스코어 계산
- 결과 랭킹 및 반환

**검색 프로세스:**

```python
def hybrid_search(query, top_k):
    # 1. 벡터 검색
    vector_results = faiss_search(query, top_k * 2)
    
    # 2. BM25 검색
    bm25_results = bm25_search(query, top_k * 2)
    
    # 3. 스코어 정규화
    normalized_vector = normalize(vector_results)
    normalized_bm25 = normalize(bm25_results)
    
    # 4. 하이브리드 스코어 계산
    # alpha = 0.1 (BM25 90%, Vector 10%)
    for doc in all_docs:
        score = (1 - alpha) * bm25_score + alpha * vector_score
    
    # 5. 정렬 및 반환
    return top_k_docs_by_score
```

**하이브리드 스코어링 공식:**

```
final_score = (1 - α) × BM25_score + α × Vector_score

where:
  α = 0.1 (BM25 dominant)
  BM25_score ∈ [0, 1] (normalized)
  Vector_score ∈ [0, 1] (normalized)
```

### 3. Claude Generator (llm.py)

**책임사항:**
- Claude API 클라이언트 관리
- 프롬프트 구성
- API 호출 및 에러 처리
- 응답 파싱 및 구조화

**프롬프트 전략:**

1. **컨텍스트 제공**
   - VOC 정보 (제목, 설명)
   - 검색된 문서들 (제목, 내용, 출처, 스코어)

2. **역할 설정**
   - IT 기술 지원 전문가 페르소나

3. **출력 형식 지정**
   - 5개 섹션으로 구조화 (문제/원인/절차/해결/출처)
   - 명확한 구분자 사용

4. **지침 제공**
   - 실행 가능한 단계 포함
   - 검색 문서 정보 활용
   - 출처 명시

### 4. Data Models (models.py)

**Pydantic 스키마:**

```python
SearchRequest
├── query: str
└── top_k: int = 20

SearchResult
├── doc_id: str
├── title: str
├── content: str
├── score: float
└── source: str

GenerateRequest
├── voc_title: str
├── voc_description: str
└── search_results: List[SearchResult]

GenerateResponse
├── problem: str
├── cause: str
├── procedure: str
├── solution: str
└── sources: str
```

### 5. Sample Data (data.py)

**문서 구조:**

```python
{
    "doc_id": "doc_XXX",
    "title": "문제 제목",
    "content": "상세 내용 및 해결 방법",
    "source": "출처 정보"
}
```

**문서 카테고리:**
- 운영체제 (Windows, macOS)
- 네트워크 연결
- 하드웨어 문제
- 소프트웨어 설치/설정
- Office 애플리케이션
- 보안 및 백업

## 데이터 플로우

### 검색 플로우 (Search Flow)

```
1. Client Request
   POST /search
   { "query": "Windows 부팅 오류", "top_k": 20 }
   
2. FastAPI Routing
   main.py → search_documents()
   
3. RAG Search
   rag.py → hybrid_search()
   ├── Query Embedding (multilingual-e5-large-instruct)
   ├── FAISS Vector Search (코사인 유사도)
   ├── BM25 Keyword Search (토큰 매칭)
   ├── Score Normalization
   └── Hybrid Scoring (α=0.1)
   
4. Result Ranking
   Top-K 문서 정렬 및 반환
   
5. Response
   [ { doc_id, title, content, score, source }, ... ]
```

### 생성 플로우 (Generation Flow)

```
1. Client Request
   POST /generate
   {
     "voc_title": "...",
     "voc_description": "...",
     "search_results": [...]
   }
   
2. FastAPI Routing
   main.py → generate_guide()
   
3. Prompt Building
   llm.py → _build_prompt()
   ├── VOC 정보 포맷팅
   ├── 검색 결과 컨텍스트 구성
   └── 지침 및 형식 명시
   
4. Claude API Call
   Anthropic SDK → messages.create()
   ├── Model: claude-3-5-sonnet-20241022
   ├── Max Tokens: 2000
   └── Temperature: 0.7
   
5. Response Parsing
   llm.py → _parse_response()
   ├── 섹션 키워드 탐지
   ├── 내용 추출
   └── 구조화된 JSON 생성
   
6. Response
   {
     "problem": "...",
     "cause": "...",
     "procedure": "...",
     "solution": "...",
     "sources": "..."
   }
```

### 통합 플로우 (Combined Flow)

```
1. Client Request
   POST /search-and-generate
   {
     "voc_title": "...",
     "voc_description": "...",
     "top_k": 20
   }
   
2. Internal Search
   검색 플로우 1-4 단계 실행
   
3. Internal Generation
   검색 결과를 사용하여 생성 플로우 3-5 단계 실행
   
4. Response
   생성된 가이드 반환
```

## 성능 특성

### 메모리 사용량

| 컴포넌트 | 메모리 |
|---------|--------|
| FastAPI | ~50MB |
| Sentence Transformer | ~2GB |
| FAISS Index (50 docs) | ~1MB |
| BM25 Index | ~0.5MB |
| **총계** | **~2.5GB** |

### 응답 시간

| 작업 | 시간 |
|------|------|
| 모델 로딩 (시작 시) | ~5초 |
| 인덱스 구축 (시작 시) | ~2초 |
| 검색 요청 | ~65ms |
| 가이드 생성 | ~2-5초 |
| 통합 요청 | ~2-5초 |

### 확장성

**수직 확장 (Vertical Scaling):**
- CPU: 임베딩 계산에 사용
- RAM: 모델 및 인덱스 저장
- 권장: 4GB+ RAM, 2+ CPU cores

**수평 확장 (Horizontal Scaling):**
- 여러 인스턴스를 로드밸런서 뒤에 배치
- 각 인스턴스는 독립적으로 작동
- FAISS 인덱스는 읽기 전용이므로 복제 가능

## 설정 및 환경변수

### 필수 설정

```env
ANTHROPIC_API_KEY=sk-ant-...
```

### 선택적 설정

```env
# 모델 설정
EMBEDDING_MODEL=intfloat/multilingual-e5-large-instruct
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# 검색 설정
HYBRID_ALPHA=0.1        # BM25 가중치 (0.0-1.0)
DEFAULT_TOP_K=20        # 기본 검색 결과 수

# 서버 설정
HOST=0.0.0.0
PORT=8000
```

## 보안 고려사항

### API 키 관리
- 환경변수를 통한 API 키 관리
- `.env` 파일을 `.gitignore`에 추가
- 프로덕션에서는 시크릿 관리 서비스 사용 권장

### CORS 설정
- 현재: 모든 오리진 허용 (`allow_origins=["*"]`)
- 프로덕션: 특정 도메인만 허용하도록 수정 필요

### 입력 검증
- Pydantic을 통한 요청 데이터 검증
- 쿼리 길이 제한 (기본: 제한 없음)
- Top-K 범위 제한 (1-100)

### 에러 처리
- 민감한 정보 노출 방지
- 일반적인 에러 메시지 반환
- 상세 로그는 서버 측에만 기록

## 모니터링 및 로깅

### 헬스체크 엔드포인트

```bash
GET /health

Response:
{
  "status": "ok",
  "embedding_model": "intfloat/multilingual-e5-large-instruct",
  "claude_model": "claude-3-5-sonnet-20241022",
  "index_size": 50
}
```

### 로깅

현재는 기본 Python 로깅 사용:
- 시작 시 초기화 로그
- 검색/생성 작업 로그
- 에러 로그

프로덕션 권장 사항:
- 구조화된 로깅 (JSON 형식)
- 로그 레벨 설정 (DEBUG/INFO/WARNING/ERROR)
- 중앙 로그 수집 시스템 통합

## 배포 옵션

### 1. 로컬 개발

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Docker

```bash
docker build -t voc-agent-backend .
docker run -p 8000:8000 -e ANTHROPIC_API_KEY=xxx voc-agent-backend
```

### 3. Docker Compose

```bash
docker-compose up -d
```

### 4. 클라우드 플랫폼

**AWS:**
- ECS/Fargate: 컨테이너 기반 배포
- Lambda: 서버리스 배포 (콜드 스타트 고려)

**GCP:**
- Cloud Run: 컨테이너 기반 서버리스
- GKE: Kubernetes 클러스터

**Azure:**
- Container Instances
- App Service

## 향후 개선 방향

### 단기 (1-2주)
- [ ] 실제 문서 데이터베이스 연동
- [ ] FAISS 인덱스 영구 저장 (재시작 시 재구축 방지)
- [ ] 검색 결과 캐싱
- [ ] API 키 관리 개선

### 중기 (1-2개월)
- [ ] 사용자 인증 및 권한 관리
- [ ] 검색 히스토리 저장
- [ ] A/B 테스트 프레임워크
- [ ] 성능 모니터링 대시보드

### 장기 (3-6개월)
- [ ] 다중 언어 지원 확대
- [ ] 파인튜닝된 도메인 특화 모델
- [ ] 사용자 피드백 기반 재학습
- [ ] 고급 RAG 기법 (HyDE, Self-RAG 등)

## 참고 자료

### 기술 문서
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [FAISS Documentation](https://github.com/facebookresearch/faiss/wiki)
- [Sentence Transformers](https://www.sbert.net/)
- [Anthropic API Reference](https://docs.anthropic.com/)

### 논문
- "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (Lewis et al., 2020)
- "Precise Zero-Shot Dense Retrieval without Relevance Labels" (Gao et al., 2021)

### 관련 프로젝트
- LangChain
- LlamaIndex
- Haystack

---

**문서 버전:** 1.0.0  
**최종 업데이트:** 2026-04-12  
**작성자:** VOC Agent Development Team
