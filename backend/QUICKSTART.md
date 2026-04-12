# Quick Start Guide

VOC Agent Backend를 5분 안에 실행하는 가이드입니다.

## Prerequisites

- Python 3.11 이상
- pip
- (선택) Docker

## 1단계: 프로젝트 클론

```bash
cd /path/to/voc-agent/backend
```

## 2단계: 가상환경 생성 및 활성화

### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

## 3단계: 의존성 설치

```bash
pip install -r requirements.txt
```

설치되는 주요 패키지:
- FastAPI (웹 프레임워크)
- Uvicorn (ASGI 서버)
- sentence-transformers (임베딩 모델)
- FAISS (벡터 검색)
- rank-bm25 (키워드 검색)
- anthropic (Claude API)

## 4단계: 환경변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집
nano .env  # 또는 원하는 에디터 사용
```

최소 설정:
```env
ANTHROPIC_API_KEY=sk-ant-api03-your-api-key-here
```

## 5단계: 서버 실행

### 방법 1: 직접 실행

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 방법 2: 스크립트 사용

**macOS/Linux:**
```bash
chmod +x run.sh
./run.sh
```

**Windows:**
```bash
run.bat
```

### 방법 3: Make 사용

```bash
make run
```

### 방법 4: Docker

```bash
docker-compose up -d
```

## 6단계: 확인

브라우저에서 다음 URL을 열어 확인:

- **API 문서**: http://localhost:8000/docs
- **헬스체크**: http://localhost:8000/health
- **API 정보**: http://localhost:8000/

## 7단계: 테스트

새 터미널에서 테스트 스크립트 실행:

```bash
python test_api.py
```

또는 curl로 간단히 테스트:

```bash
# 헬스체크
curl http://localhost:8000/health

# 검색 테스트
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "부팅 오류", "top_k": 5}'
```

## 문제 해결

### 1. ModuleNotFoundError

```bash
# 가상환경이 활성화되었는지 확인
which python  # Unix
where python  # Windows

# 의존성 재설치
pip install -r requirements.txt
```

### 2. Port already in use

```bash
# 다른 포트 사용
uvicorn app.main:app --port 8080

# 또는 기존 프로세스 종료
lsof -ti:8000 | xargs kill  # macOS/Linux
```

### 3. ANTHROPIC_API_KEY not set

```bash
# .env 파일 확인
cat .env

# 환경변수 직접 설정
export ANTHROPIC_API_KEY=sk-ant-...  # Unix
set ANTHROPIC_API_KEY=sk-ant-...    # Windows
```

### 4. Out of memory

임베딩 모델이 약 2GB RAM을 사용합니다. 메모리가 부족한 경우:
- 더 작은 모델 사용: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (384차원)
- Docker 메모리 제한 증가

## 다음 단계

1. **API 문서 탐색**: http://localhost:8000/docs에서 모든 엔드포인트 확인
2. **샘플 데이터 수정**: `app/data.py`에서 문서 추가/수정
3. **설정 조정**: `.env`에서 모델 및 검색 파라미터 튜닝
4. **프론트엔드 연동**: REST API를 통해 프론트엔드와 통합

## 주요 명령어 요약

```bash
# 설치
pip install -r requirements.txt

# 실행
uvicorn app.main:app --reload

# 테스트
python test_api.py

# Docker
docker-compose up -d

# 정리
make clean
```

## 참고 자료

- 전체 문서: `README.md`
- 아키텍처: `ARCHITECTURE.md`
- API 문서: http://localhost:8000/docs (서버 실행 후)

## 지원

문제가 발생하면 GitHub Issues에 등록해주세요.

---

Happy Coding! 🚀
