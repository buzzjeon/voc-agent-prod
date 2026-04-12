# VOC Agent RAG Service

Python FastAPI 기반 하이브리드 검색 엔진과 Claude API를 활용한 IT 기술지원 가이드 자동 생성 서비스입니다.

## 주요 기능

### 1. 하이브리드 검색 엔진
- **FAISS 벡터 검색**: multilingual-e5-large-instruct 모델 (1024차원)
- **BM25 키워드 검색**: 토큰 기반 정확한 키워드 매칭
- **하이브리드 스코어링**: alpha=0.1 (BM25 지배적, 90% 가중치)
- **Recall@20 최적화**: 상위 20개 문서 검색에 최적화

### 2. Claude API 통합
- Claude 3.5 Sonnet을 사용한 가이드 생성
- VOC 정보 + 검색 결과를 컨텍스트로 활용
- 구조화된 출력: 문제/원인/절차/해결/출처

### 3. RESTful API
- `/search`: 문서 검색
- `/generate`: 가이드 생성
- `/search-and-generate`: 통합 엔드포인트
- `/health`: 헬스체크

## 기술 스택

- **Framework**: FastAPI 0.115.0
- **Embedding**: sentence-transformers 3.3.1
- **Vector DB**: FAISS 1.9.0
- **Keyword Search**: rank-bm25 0.2.2
- **LLM**: Anthropic Claude API 0.40.0
- **Server**: Uvicorn 0.32.0

## 프로젝트 구조

```
backend/
├── app/
│   ├── __init__.py          # 패키지 초기화
│   ├── main.py              # FastAPI 애플리케이션
│   ├── models.py            # Pydantic 데이터 모델
│   ├── rag.py               # RAG 검색 엔진
│   ├── llm.py               # Claude API 통합
│   └── data.py              # 샘플 문서 데이터 (50개)
├── requirements.txt         # Python 의존성
├── Dockerfile              # Docker 이미지 정의
├── .env.example            # 환경변수 템플릿
├── .gitignore              # Git 제외 파일
└── README.md               # 프로젝트 문서
```

## 설치 및 실행

### 1. 환경 설정

Python 3.11 이상이 필요합니다.

```bash
# 가상환경 생성
python -m venv venv

# 가상환경 활성화
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

### 2. 환경변수 설정

`.env` 파일을 생성하고 API 키를 설정합니다:

```bash
cp .env.example .env
```

`.env` 파일 편집:
```env
ANTHROPIC_API_KEY=your_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
EMBEDDING_MODEL=intfloat/multilingual-e5-large-instruct
HYBRID_ALPHA=0.1
DEFAULT_TOP_K=20
```

### 3. 서버 실행

```bash
# 개발 모드 (자동 재시작)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 또는 Python으로 직접 실행
python -m app.main
```

서버가 시작되면 다음 URL로 접속할 수 있습니다:
- API 문서: http://localhost:8000/docs
- ReDoc 문서: http://localhost:8000/redoc
- 헬스체크: http://localhost:8000/health

### 4. Docker 실행

```bash
# Docker 이미지 빌드
docker build -t voc-agent-backend .

# 컨테이너 실행
docker run -d \
  -p 8000:8000 \
  -e ANTHROPIC_API_KEY=your_api_key_here \
  --name voc-agent \
  voc-agent-backend

# 로그 확인
docker logs -f voc-agent
```

## API 사용 예시

### 1. 헬스체크

```bash
curl http://localhost:8000/health
```

응답:
```json
{
  "status": "ok",
  "embedding_model": "intfloat/multilingual-e5-large-instruct",
  "claude_model": "claude-3-5-sonnet-20241022",
  "index_size": 50
}
```

### 2. 문서 검색

```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Windows 부팅이 안됩니다",
    "top_k": 5
  }'
```

응답:
```json
[
  {
    "doc_id": "doc_001",
    "title": "Windows 10 부팅 오류 해결",
    "content": "Windows 10에서 부팅 오류가 발생하는 경우...",
    "score": 0.856,
    "source": "Microsoft KB12345"
  },
  ...
]
```

### 3. 가이드 생성

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "voc_title": "Windows 부팅 실패",
    "voc_description": "컴퓨터를 켜면 검은 화면만 나오고 부팅이 되지 않습니다.",
    "search_results": [...]
  }'
```

응답:
```json
{
  "problem": "Windows 부팅 과정에서 검은 화면이 표시되며...",
  "cause": "부팅 오류의 주요 원인은...",
  "procedure": "1. 안전 모드로 진입...\n2. 시스템 파일 검사...",
  "solution": "문제 해결을 위해서는...",
  "sources": "Microsoft KB12345, Windows Update Troubleshooting"
}
```

### 4. 통합 검색 및 생성

```bash
curl -X POST "http://localhost:8000/search-and-generate?voc_title=Windows%20%EB%B6%80%ED%8C%85%20%EC%8B%A4%ED%8C%A8&voc_description=%EC%BB%B4%ED%93%A8%ED%84%B0%EB%A5%BC%20%EC%BC%9C%EB%A9%B4%20%EA%B2%80%EC%9D%80%20%ED%99%94%EB%A9%B4%EB%A7%8C%20%EB%82%98%EC%98%B5%EB%8B%88%EB%8B%A4&top_k=20"
```

## Python 클라이언트 예시

```python
import requests

# 1. 검색
response = requests.post(
    "http://localhost:8000/search",
    json={
        "query": "프린터가 오프라인 상태입니다",
        "top_k": 10
    }
)
search_results = response.json()

# 2. 가이드 생성
response = requests.post(
    "http://localhost:8000/generate",
    json={
        "voc_title": "프린터 오프라인 문제",
        "voc_description": "네트워크 프린터가 계속 오프라인으로 표시됩니다",
        "search_results": search_results
    }
)
guide = response.json()

print(f"문제: {guide['problem']}")
print(f"해결: {guide['solution']}")
```

## 하이브리드 검색 알고리즘

### 검색 프로세스

1. **쿼리 입력**: 사용자의 검색 쿼리
2. **벡터 검색**: 
   - 쿼리를 multilingual-e5-large-instruct로 임베딩 (1024차원)
   - FAISS IndexFlatIP로 코사인 유사도 계산
   - Top-K 문서 추출
3. **BM25 검색**:
   - 쿼리를 토큰화
   - BM25 알고리즘으로 키워드 매칭 스코어 계산
   - Top-K 문서 추출
4. **하이브리드 스코어링**:
   - 각 방법의 스코어를 [0,1] 범위로 정규화
   - 최종 스코어 = (1-alpha) × BM25 + alpha × Vector
   - alpha=0.1 → BM25 90%, Vector 10% (BM25 지배)
5. **결과 정렬**: 하이브리드 스코어 기준 내림차순 정렬

### 주요 파라미터

- `EMBEDDING_MODEL`: intfloat/multilingual-e5-large-instruct
- `EMBEDDING_DIM`: 1024 (모델 출력 차원)
- `HYBRID_ALPHA`: 0.1 (BM25 가중치 90%)
- `DEFAULT_TOP_K`: 20 (기본 검색 결과 수)

## Claude 가이드 생성

### 프롬프트 구조

```
당신은 IT 기술 지원 전문가입니다.

## VOC 정보
제목: {voc_title}
상세 설명: {voc_description}

## 검색된 관련 문서
[문서 1] {title}
출처: {source}
내용: {content}
관련도: {score}

...

## 작성 지침
1. 문제(Problem): VOC에서 보고된 문제를 명확하게 정의
2. 원인(Cause): 문제가 발생한 가능한 원인들을 분석
3. 절차(Procedure): 단계별 문제 해결 절차를 구체적으로 설명
4. 해결(Solution): 최종 해결 방법과 예방 조치를 요약
5. 출처(Sources): 참고한 문서의 출처를 명시
```

### 응답 파싱

Claude의 응답을 5개 섹션으로 파싱하여 구조화된 JSON으로 반환합니다.

## 샘플 데이터

`app/data.py`에 50개의 IT 기술지원 문서가 포함되어 있습니다:

- Windows 부팅/업데이트 문제
- 네트워크 연결 문제
- 프린터/주변기기 문제
- Office 애플리케이션 문제
- 브라우저/화상회의 문제
- 하드웨어 문제
- 시스템 설정 및 최적화

실제 운영 시에는 이 데이터를 실제 기술지원 문서 데이터베이스로 교체하면 됩니다.

## 성능 최적화

### 초기 로딩 시간

- 임베딩 모델 로딩: ~5초
- FAISS 인덱스 구축: ~2초 (50개 문서 기준)
- BM25 인덱스 구축: ~0.1초

### 검색 성능

- 벡터 검색: ~50ms
- BM25 검색: ~10ms
- 하이브리드 스코어링: ~5ms
- 총 검색 시간: ~65ms

### 가이드 생성 성능

- Claude API 호출: ~2-5초 (토큰 수에 따라 변동)

## 트러블슈팅

### 1. 모델 다운로드 실패

```bash
# Hugging Face 캐시 초기화
rm -rf ~/.cache/huggingface/

# 다시 시도
python -m app.main
```

### 2. ANTHROPIC_API_KEY 오류

```bash
# 환경변수가 설정되었는지 확인
echo $ANTHROPIC_API_KEY

# .env 파일 확인
cat .env
```

### 3. 메모리 부족

임베딩 모델이 메모리를 많이 사용합니다 (약 2GB).
최소 4GB RAM 권장.

### 4. 포트 이미 사용 중

```bash
# 다른 포트로 실행
uvicorn app.main:app --host 0.0.0.0 --port 8080
```

## 개발 및 확장

### 새로운 문서 추가

`app/data.py`의 `SAMPLE_DOCUMENTS` 리스트에 문서를 추가하고 서버를 재시작합니다.

```python
{
    "doc_id": "doc_051",
    "title": "새 문서 제목",
    "content": "문서 내용...",
    "source": "출처 정보"
}
```

### 다른 임베딩 모델 사용

`.env` 파일에서 모델을 변경:

```env
EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
EMBEDDING_DIM=384
```

### 하이브리드 가중치 조정

```env
# BM25 중심 (권장)
HYBRID_ALPHA=0.1

# 균형 잡힌 하이브리드
HYBRID_ALPHA=0.5

# 벡터 검색 중심
HYBRID_ALPHA=0.9
```

## 테스트

```bash
# 헬스체크
curl http://localhost:8000/health

# 간단한 검색 테스트
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "부팅 오류", "top_k": 5}'
```

## 라이선스

MIT License

## 기여

이슈와 PR은 언제든 환영합니다.

## 문의

기술 지원이 필요하시면 이슈를 등록해주세요.

---

**PoC 결과 기반 구현**
- Embedding Model: multilingual-e5-large-instruct (1024차원)
- Hybrid Alpha: 0.1 (BM25 지배, 90% 가중치)
- Recall@20 최적화
- Claude 3.5 Sonnet 통합
