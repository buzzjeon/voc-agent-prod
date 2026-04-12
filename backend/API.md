# API Documentation

VOC Agent Backend REST API 상세 문서입니다.

## Base URL

```
http://localhost:8000
```

## Authentication

현재 버전에서는 인증이 필요하지 않습니다. (향후 추가 예정)

## Content Type

모든 요청과 응답은 `application/json` 형식을 사용합니다.

---

## Endpoints

### 1. Root

기본 API 정보를 반환합니다.

**Endpoint:** `GET /`

**Response:**

```json
{
  "message": "VOC Agent RAG Service",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "search": "/search",
    "generate": "/generate",
    "docs": "/docs"
  }
}
```

**Example:**

```bash
curl http://localhost:8000/
```

---

### 2. Health Check

서비스 상태를 확인합니다.

**Endpoint:** `GET /health`

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| status | string | 서비스 상태 ("ok" or "error") |
| embedding_model | string | 사용 중인 임베딩 모델 이름 |
| claude_model | string | 사용 중인 Claude 모델 이름 |
| index_size | integer | 인덱스된 문서 수 |

**Success Response (200):**

```json
{
  "status": "ok",
  "embedding_model": "intfloat/multilingual-e5-large-instruct",
  "claude_model": "claude-3-5-sonnet-20241022",
  "index_size": 50
}
```

**Error Response (503):**

```json
{
  "detail": "Service unavailable: {error_message}"
}
```

**Example:**

```bash
curl http://localhost:8000/health
```

---

### 3. Search Documents

하이브리드 검색(FAISS + BM25)을 수행합니다.

**Endpoint:** `POST /search`

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| query | string | Yes | - | 검색 쿼리 |
| top_k | integer | No | 20 | 반환할 결과 수 (1-100) |

**Request Example:**

```json
{
  "query": "Windows 부팅이 안됩니다",
  "top_k": 10
}
```

**Response:**

배열 형식으로 검색 결과를 반환합니다.

| Field | Type | Description |
|-------|------|-------------|
| doc_id | string | 문서 ID |
| title | string | 문서 제목 |
| content | string | 문서 내용 |
| score | float | 관련도 점수 (0-1) |
| source | string | 문서 출처 |

**Success Response (200):**

```json
[
  {
    "doc_id": "doc_001",
    "title": "Windows 10 부팅 오류 해결",
    "content": "Windows 10에서 부팅 오류가 발생하는 경우...",
    "score": 0.856,
    "source": "Microsoft KB12345"
  },
  {
    "doc_id": "doc_010",
    "title": "Windows Update 설치 실패",
    "content": "Windows Update가 설치되지 않는 경우...",
    "score": 0.742,
    "source": "Windows Update Troubleshooting"
  }
]
```

**Error Response (500):**

```json
{
  "detail": "Search error: {error_message}"
}
```

**Examples:**

```bash
# cURL
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "프린터 오프라인",
    "top_k": 5
  }'

# Python
import requests

response = requests.post(
    "http://localhost:8000/search",
    json={"query": "네트워크 연결 끊김", "top_k": 10}
)
results = response.json()

# JavaScript
fetch('http://localhost:8000/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Outlook 동기화 오류',
    top_k: 15
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 4. Generate Guide

VOC 정보와 검색 결과를 바탕으로 문제 해결 가이드를 생성합니다.

**Endpoint:** `POST /generate`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| voc_title | string | Yes | VOC 제목 |
| voc_description | string | Yes | VOC 상세 설명 |
| search_results | array | Yes | 검색 결과 배열 (SearchResult[]) |

**Request Example:**

```json
{
  "voc_title": "Windows 부팅 실패",
  "voc_description": "컴퓨터를 켜면 검은 화면만 나오고 Windows가 부팅되지 않습니다.",
  "search_results": [
    {
      "doc_id": "doc_001",
      "title": "Windows 10 부팅 오류 해결",
      "content": "Windows 10에서 부팅 오류가 발생하는 경우...",
      "score": 0.856,
      "source": "Microsoft KB12345"
    }
  ]
}
```

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| problem | string | 문제 정의 |
| cause | string | 원인 분석 |
| procedure | string | 해결 절차 |
| solution | string | 해결 방법 요약 |
| sources | string | 참고 출처 |

**Success Response (200):**

```json
{
  "problem": "사용자의 Windows 10 시스템이 부팅 과정에서 검은 화면을 표시하며 정상적으로 시작되지 않는 문제가 발생하고 있습니다.",
  "cause": "이 문제는 다음과 같은 원인으로 발생할 수 있습니다:\n1. 손상된 시스템 파일\n2. 잘못된 부팅 구성\n3. 하드웨어 드라이버 문제\n4. 디스크 오류",
  "procedure": "1. 안전 모드로 부팅\n   - 전원을 켠 후 F8 키를 반복해서 누릅니다\n   - '안전 모드'를 선택합니다\n\n2. 시스템 파일 검사 실행\n   - 관리자 권한으로 명령 프롬프트를 엽니다\n   - 'sfc /scannow' 명령을 입력하고 실행합니다\n   - 검사가 완료될 때까지 기다립니다\n\n3. 부팅 복구 실행\n   - Windows 복구 환경으로 부팅합니다\n   - '문제 해결' > '고급 옵션' > '시작 복구'를 선택합니다",
  "solution": "안전 모드로 진입하여 시스템 파일 검사(sfc /scannow)를 실행하고, 필요시 시작 복구를 통해 부팅 구성을 복원합니다. 문제가 지속되면 하드웨어 진단을 권장합니다.",
  "sources": "Microsoft KB12345, Windows Update Troubleshooting"
}
```

**Error Responses:**

**500 - API Key Not Configured:**

```json
{
  "detail": "ANTHROPIC_API_KEY not configured"
}
```

**500 - Generation Error:**

```json
{
  "detail": "Generation error: {error_message}"
}
```

**Examples:**

```bash
# cURL
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d @request.json

# Python
import requests

# 먼저 검색 수행
search_response = requests.post(
    "http://localhost:8000/search",
    json={"query": "프린터 오프라인", "top_k": 10}
)
search_results = search_response.json()

# 가이드 생성
generate_response = requests.post(
    "http://localhost:8000/generate",
    json={
        "voc_title": "프린터 오프라인 문제",
        "voc_description": "네트워크 프린터가 계속 오프라인으로 표시됩니다",
        "search_results": search_results
    }
)
guide = generate_response.json()
print(guide['solution'])
```

---

### 5. Search and Generate (Combined)

검색과 가이드 생성을 한 번에 수행하는 통합 엔드포인트입니다.

**Endpoint:** `POST /search-and-generate`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| voc_title | string | Yes | - | VOC 제목 |
| voc_description | string | Yes | - | VOC 상세 설명 |
| top_k | integer | No | 20 | 검색할 문서 수 |

**Response:**

`/generate` 엔드포인트와 동일한 형식

**Success Response (200):**

```json
{
  "problem": "...",
  "cause": "...",
  "procedure": "...",
  "solution": "...",
  "sources": "..."
}
```

**Error Responses:**

**404 - No Results:**

```json
{
  "detail": "No relevant documents found"
}
```

**500 - API Key Not Configured:**

```json
{
  "detail": "ANTHROPIC_API_KEY not configured"
}
```

**500 - Processing Error:**

```json
{
  "detail": "Search and generate error: {error_message}"
}
```

**Examples:**

```bash
# cURL (URL 인코딩 필요)
curl -X POST "http://localhost:8000/search-and-generate?voc_title=USB%20%EC%9D%B8%EC%8B%9D%20%EC%95%88%EB%90%A8&voc_description=USB%20%EB%A9%94%EB%AA%A8%EB%A6%AC%EA%B0%80%20%EC%9D%B8%EC%8B%9D%EB%90%98%EC%A7%80%20%EC%95%8A%EC%8A%B5%EB%8B%88%EB%8B%A4&top_k=15"

# Python
import requests

response = requests.post(
    "http://localhost:8000/search-and-generate",
    params={
        "voc_title": "배터리 빨리 닳음",
        "voc_description": "노트북 배터리가 1시간도 안 가서 방전됩니다",
        "top_k": 20
    }
)
guide = response.json()

# JavaScript
const params = new URLSearchParams({
  voc_title: '화면 깜빡임',
  voc_description: '모니터 화면이 계속 깜빡입니다',
  top_k: 10
});

fetch(`http://localhost:8000/search-and-generate?${params}`, {
  method: 'POST'
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Validation Errors (422)

Pydantic 검증 실패 시:

```json
{
  "detail": [
    {
      "loc": ["body", "query"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## Rate Limiting

현재 버전에서는 Rate Limiting이 구현되어 있지 않습니다.

프로덕션 배포 시 다음 제한을 권장합니다:
- 검색: 100 requests/minute per IP
- 생성: 10 requests/minute per IP (Claude API 제한 고려)

---

## Pagination

현재 버전에서는 Pagination을 지원하지 않습니다.

`top_k` 파라미터로 반환 결과 수를 제어할 수 있습니다 (최대 100).

---

## CORS

기본 설정은 모든 오리진을 허용합니다:

```python
allow_origins=["*"]
```

프로덕션에서는 특정 도메인만 허용하도록 수정하세요:

```python
allow_origins=["https://yourdomain.com"]
```

---

## Webhooks

현재 버전에서는 Webhooks를 지원하지 않습니다.

---

## SDKs and Client Libraries

### Python Client

```python
import requests

class VOCAgentClient:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
    
    def health_check(self):
        return requests.get(f"{self.base_url}/health").json()
    
    def search(self, query, top_k=20):
        return requests.post(
            f"{self.base_url}/search",
            json={"query": query, "top_k": top_k}
        ).json()
    
    def generate(self, voc_title, voc_description, search_results):
        return requests.post(
            f"{self.base_url}/generate",
            json={
                "voc_title": voc_title,
                "voc_description": voc_description,
                "search_results": search_results
            }
        ).json()
    
    def search_and_generate(self, voc_title, voc_description, top_k=20):
        return requests.post(
            f"{self.base_url}/search-and-generate",
            params={
                "voc_title": voc_title,
                "voc_description": voc_description,
                "top_k": top_k
            }
        ).json()

# 사용 예시
client = VOCAgentClient()
guide = client.search_and_generate(
    voc_title="Windows 부팅 오류",
    voc_description="부팅이 안됩니다",
    top_k=15
)
print(guide['solution'])
```

### JavaScript Client

```javascript
class VOCAgentClient {
  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async healthCheck() {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }

  async search(query, topK = 20) {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: topK })
    });
    return response.json();
  }

  async generate(vocTitle, vocDescription, searchResults) {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voc_title: vocTitle,
        voc_description: vocDescription,
        search_results: searchResults
      })
    });
    return response.json();
  }

  async searchAndGenerate(vocTitle, vocDescription, topK = 20) {
    const params = new URLSearchParams({
      voc_title: vocTitle,
      voc_description: vocDescription,
      top_k: topK
    });
    const response = await fetch(
      `${this.baseUrl}/search-and-generate?${params}`,
      { method: 'POST' }
    );
    return response.json();
  }
}

// 사용 예시
const client = new VOCAgentClient();
const guide = await client.searchAndGenerate(
  'Windows 부팅 오류',
  '부팅이 안됩니다',
  15
);
console.log(guide.solution);
```

---

## Interactive API Documentation

서버 실행 후 다음 URL에서 인터랙티브 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Swagger UI에서는 직접 API를 테스트할 수 있습니다.

---

## Changelog

### Version 1.0.0 (2026-04-12)

Initial release:
- `/search` endpoint for hybrid search
- `/generate` endpoint for guide generation
- `/search-and-generate` combined endpoint
- `/health` health check endpoint
- Support for multilingual-e5-large-instruct embeddings
- Claude 3.5 Sonnet integration

---

## Support

문제가 발생하거나 질문이 있으시면 GitHub Issues에 등록해주세요.

---

**API Version:** 1.0.0  
**Last Updated:** 2026-04-12
