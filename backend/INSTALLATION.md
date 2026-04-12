# Installation and Deployment Guide

VOC Agent Backend의 상세 설치 및 배포 가이드입니다.

## 목차

1. [시스템 요구사항](#시스템-요구사항)
2. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
3. [Docker 배포](#docker-배포)
4. [클라우드 배포](#클라우드-배포)
5. [문제 해결](#문제-해결)
6. [성능 튜닝](#성능-튜닝)

---

## 시스템 요구사항

### 최소 사양
- **OS**: Linux, macOS, Windows 10/11
- **Python**: 3.11 이상
- **RAM**: 4GB
- **디스크**: 5GB 여유 공간
- **네트워크**: 인터넷 연결 (모델 다운로드 및 API 호출)

### 권장 사양
- **RAM**: 8GB 이상
- **CPU**: 4코어 이상
- **디스크**: 10GB 여유 공간 (SSD 권장)

---

## 로컬 개발 환경 설정

### 1단계: Python 설치 확인

```bash
# Python 버전 확인
python3 --version  # macOS/Linux
python --version   # Windows

# 3.11 이상이어야 함
```

Python이 설치되어 있지 않은 경우:
- **macOS**: `brew install python@3.11`
- **Ubuntu/Debian**: `sudo apt-get install python3.11`
- **Windows**: [python.org](https://www.python.org/downloads/)에서 다운로드

### 2단계: 프로젝트 디렉토리로 이동

```bash
cd /path/to/voc-agent/backend
```

### 3단계: 가상환경 생성

#### macOS/Linux

```bash
# 가상환경 생성
python3 -m venv venv

# 가상환경 활성화
source venv/bin/activate

# 활성화 확인 (프롬프트에 (venv) 표시)
which python
# 출력: /path/to/voc-agent/backend/venv/bin/python
```

#### Windows

```bash
# 가상환경 생성
python -m venv venv

# 가상환경 활성화
venv\Scripts\activate

# 활성화 확인
where python
# 출력: C:\path\to\voc-agent\backend\venv\Scripts\python.exe
```

### 4단계: 의존성 설치

```bash
# pip 업그레이드
pip install --upgrade pip

# 의존성 설치 (약 2-3분 소요)
pip install -r requirements.txt
```

**설치되는 주요 패키지:**
- FastAPI: 웹 프레임워크
- Uvicorn: ASGI 서버
- sentence-transformers: 텍스트 임베딩
- FAISS: 벡터 검색 엔진
- rank-bm25: BM25 알고리즘
- anthropic: Claude API SDK
- pydantic: 데이터 검증

### 5단계: 환경변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집
nano .env  # 또는 vim, code, notepad 등
```

**.env 파일 내용:**

```env
# 필수: Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here

# 선택 사항 (기본값 있음)
CLAUDE_MODEL=claude-3-5-sonnet-20241022
EMBEDDING_MODEL=intfloat/multilingual-e5-large-instruct
EMBEDDING_DIM=1024
HYBRID_ALPHA=0.1
DEFAULT_TOP_K=20
HOST=0.0.0.0
PORT=8000
```

**API 키 발급:**
1. [Anthropic Console](https://console.anthropic.com/)에 로그인
2. "API Keys" 메뉴 선택
3. "Create Key" 버튼 클릭
4. 생성된 키를 복사하여 .env 파일에 입력

### 6단계: 서버 실행

#### 방법 1: Uvicorn 직접 실행

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**옵션 설명:**
- `--reload`: 코드 변경 시 자동 재시작 (개발용)
- `--host 0.0.0.0`: 모든 네트워크 인터페이스에서 접근 허용
- `--port 8000`: 포트 번호

#### 방법 2: Python 모듈로 실행

```bash
python -m app.main
```

#### 방법 3: 실행 스크립트 사용

**macOS/Linux:**
```bash
chmod +x run.sh
./run.sh
```

**Windows:**
```bash
run.bat
```

#### 방법 4: Make 사용

```bash
make run
```

### 7단계: 동작 확인

**브라우저에서 확인:**
- API 문서: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

**터미널에서 확인:**
```bash
# 새 터미널 창에서
curl http://localhost:8000/health
```

**예상 출력:**
```json
{
  "status": "ok",
  "embedding_model": "intfloat/multilingual-e5-large-instruct",
  "claude_model": "claude-3-5-sonnet-20241022",
  "index_size": 50
}
```

### 8단계: 테스트 실행

```bash
# 새 터미널에서 (가상환경 활성화 후)
python test_api.py
```

---

## Docker 배포

### 사전 요구사항

Docker와 Docker Compose 설치:
- **macOS/Windows**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: Docker Engine + Docker Compose

```bash
# 설치 확인
docker --version
docker-compose --version
```

### 방법 1: Docker Compose (권장)

#### 1. 환경변수 설정

```bash
# .env 파일에 API 키 설정
echo "ANTHROPIC_API_KEY=sk-ant-api03-your-key" > .env
```

#### 2. 컨테이너 실행

```bash
# 빌드 및 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 상태 확인
docker-compose ps
```

#### 3. 중지 및 재시작

```bash
# 중지
docker-compose stop

# 재시작
docker-compose start

# 완전히 제거
docker-compose down
```

### 방법 2: Docker 직접 사용

#### 1. 이미지 빌드

```bash
docker build -t voc-agent-backend:latest .
```

**빌드 옵션:**
```bash
# 캐시 없이 빌드
docker build --no-cache -t voc-agent-backend:latest .

# 특정 플랫폼용 빌드
docker build --platform linux/amd64 -t voc-agent-backend:latest .
```

#### 2. 컨테이너 실행

```bash
docker run -d \
  --name voc-agent \
  -p 8000:8000 \
  -e ANTHROPIC_API_KEY=sk-ant-api03-your-key \
  -e CLAUDE_MODEL=claude-3-5-sonnet-20241022 \
  --restart unless-stopped \
  voc-agent-backend:latest
```

**옵션 설명:**
- `-d`: 백그라운드 실행
- `--name`: 컨테이너 이름
- `-p 8000:8000`: 포트 매핑 (호스트:컨테이너)
- `-e`: 환경변수 설정
- `--restart unless-stopped`: 자동 재시작

#### 3. 컨테이너 관리

```bash
# 로그 확인
docker logs -f voc-agent

# 컨테이너 내부 접속
docker exec -it voc-agent /bin/bash

# 중지
docker stop voc-agent

# 시작
docker start voc-agent

# 제거
docker rm -f voc-agent
```

### Docker 이미지 최적화

#### Multi-stage Build (Dockerfile 수정)

```dockerfile
# Builder stage
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Runtime stage
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY app/ ./app/
ENV PATH=/root/.local/bin:$PATH
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 클라우드 배포

### AWS ECS/Fargate

#### 1. ECR에 이미지 푸시

```bash
# ECR 로그인
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# 이미지 태그
docker tag voc-agent-backend:latest \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/voc-agent:latest

# 푸시
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/voc-agent:latest
```

#### 2. ECS Task Definition

```json
{
  "family": "voc-agent",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "2048",
  "memory": "4096",
  "containerDefinitions": [{
    "name": "voc-agent",
    "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/voc-agent:latest",
    "portMappings": [{
      "containerPort": 8000,
      "protocol": "tcp"
    }],
    "environment": [{
      "name": "ANTHROPIC_API_KEY",
      "value": "sk-ant-api03-..."
    }],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/voc-agent",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }]
}
```

#### 3. Application Load Balancer 설정

Target Group Health Check:
- Path: `/health`
- Interval: 30초
- Timeout: 5초
- Healthy threshold: 2

### Google Cloud Run

```bash
# 프로젝트 설정
gcloud config set project YOUR_PROJECT_ID

# 이미지 빌드 및 푸시
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/voc-agent

# Cloud Run 배포
gcloud run deploy voc-agent \
  --image gcr.io/YOUR_PROJECT_ID/voc-agent \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --set-env-vars ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Azure Container Instances

```bash
# Resource Group 생성
az group create --name voc-agent-rg --location eastus

# Container 배포
az container create \
  --resource-group voc-agent-rg \
  --name voc-agent \
  --image voc-agent-backend:latest \
  --cpu 2 \
  --memory 4 \
  --port 8000 \
  --environment-variables ANTHROPIC_API_KEY=sk-ant-api03-... \
  --dns-name-label voc-agent
```

---

## 문제 해결

### 1. 모델 다운로드 실패

**증상:**
```
Error downloading model from huggingface.co
```

**해결방법:**
```bash
# Hugging Face 캐시 초기화
rm -rf ~/.cache/huggingface/

# 환경변수 설정
export HF_ENDPOINT=https://hf-mirror.com  # China mirror

# 프록시 설정
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080

# 재시도
python -m app.main
```

### 2. Out of Memory

**증상:**
```
Killed
numpy.core._exceptions._ArrayMemoryError
```

**해결방법:**

1. 더 작은 모델 사용:
```env
EMBEDDING_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
EMBEDDING_DIM=384
```

2. Docker 메모리 제한 증가:
```bash
docker run -m 4g ...
```

3. Swap 메모리 활성화 (Linux):
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 3. Port Already in Use

**증상:**
```
Error: [Errno 48] Address already in use
```

**해결방법:**

**macOS/Linux:**
```bash
# 포트 사용 프로세스 확인
lsof -ti:8000

# 프로세스 종료
kill -9 $(lsof -ti:8000)

# 또는 다른 포트 사용
uvicorn app.main:app --port 8080
```

**Windows:**
```bash
# 포트 사용 프로세스 확인
netstat -ano | findstr :8000

# 프로세스 종료 (PID 확인 후)
taskkill /PID <PID> /F
```

### 4. ANTHROPIC_API_KEY Not Found

**증상:**
```
ValueError: ANTHROPIC_API_KEY environment variable must be set
```

**해결방법:**

1. .env 파일 확인:
```bash
cat .env | grep ANTHROPIC_API_KEY
```

2. 환경변수 직접 설정:
```bash
# Unix
export ANTHROPIC_API_KEY=sk-ant-api03-...

# Windows
set ANTHROPIC_API_KEY=sk-ant-api03-...
```

3. Docker의 경우:
```bash
docker run -e ANTHROPIC_API_KEY=sk-ant-api03-... ...
```

### 5. Import Error

**증상:**
```
ModuleNotFoundError: No module named 'xxx'
```

**해결방법:**

1. 가상환경 활성화 확인:
```bash
which python  # Unix
where python  # Windows
```

2. 의존성 재설치:
```bash
pip install -r requirements.txt --force-reinstall
```

### 6. CUDA/GPU 관련 오류

**증상:**
```
RuntimeError: CUDA out of memory
```

**해결방법:**

FAISS-CPU 버전 사용 (requirements.txt에 이미 설정됨):
```
faiss-cpu==1.9.0
```

GPU 버전이 필요한 경우:
```
faiss-gpu==1.9.0
```

---

## 성능 튜닝

### 1. Uvicorn Workers

다중 워커로 처리량 증가:

```bash
uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 4
```

**권장 워커 수:** CPU 코어 수 × 2 + 1

### 2. FAISS 최적화

```python
# app/rag.py에서

# GPU 사용 (가능한 경우)
import faiss
self.faiss_index = faiss.index_cpu_to_gpu(
    faiss.StandardGpuResources(),
    0,
    self.faiss_index
)

# 인덱스 압축 (정확도 약간 감소, 속도 증가)
quantizer = faiss.IndexFlatIP(embeddings.shape[1])
self.faiss_index = faiss.IndexIVFFlat(quantizer, embeddings.shape[1], 10)
self.faiss_index.train(embeddings)
self.faiss_index.add(embeddings)
```

### 3. 캐싱

Redis 캐싱 추가 (향후):

```python
import redis
r = redis.Redis(host='localhost', port=6379)

def search_with_cache(query, top_k):
    cache_key = f"search:{query}:{top_k}"
    cached = r.get(cache_key)
    if cached:
        return json.loads(cached)
    
    results = hybrid_search(query, top_k)
    r.setex(cache_key, 3600, json.dumps(results))
    return results
```

### 4. 프로덕션 설정

```bash
# Gunicorn 사용 (Uvicorn보다 안정적)
pip install gunicorn

gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120 \
  --keepalive 5
```

---

## 보안 체크리스트

배포 전 확인사항:

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] API 키가 코드에 하드코딩되지 않았는가?
- [ ] CORS 설정이 적절한가? (프로덕션에서는 특정 도메인만 허용)
- [ ] HTTPS를 사용하는가?
- [ ] Rate Limiting이 설정되었는가?
- [ ] 로그에 민감한 정보가 포함되지 않는가?
- [ ] 헬스체크 엔드포인트가 작동하는가?
- [ ] 에러 메시지가 너무 상세하지 않은가?

---

## 다음 단계

설치가 완료되었다면:

1. **API 문서 확인**: http://localhost:8000/docs
2. **테스트 실행**: `python test_api.py`
3. **프론트엔드 연동**: REST API를 사용하여 프론트엔드 연결
4. **모니터링 설정**: 로그 및 메트릭 수집
5. **백업 설정**: 중요 데이터 백업

---

**도움이 필요하신가요?**
- GitHub Issues에 질문 등록
- README.md 및 ARCHITECTURE.md 참고

Happy Deploying! 🚀
