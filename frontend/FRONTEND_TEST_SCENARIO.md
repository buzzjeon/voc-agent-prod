# Frontend 테스트 시나리오

## 📋 테스트 개요

| 항목 | 내용 |
|-----|------|
| **프레임워크** | Next.js 16 (App Router) |
| **테스트 도구** | Vitest + Testing Library |
| **UI 라이브러리** | React 19 |
| **스타일링** | Tailwind CSS 4 |

---

## 🗂️ 테스트 구조

```
frontend/test/
├── setup.ts                    # 테스트 설정
├── unit/                       # 단위 테스트
│   ├── components/             # 컴포넌트 테스트
│   └── hooks/                  # 훅 테스트
├── integration/                 # 통합 테스트
│   └── api/                    # API 연동 테스트
└── e2e/                        # E2E 테스트
    └── scenarios/              # 사용자 시나리오
```

---

## 🧪 테스트 시나리오

### 1. 컴포넌트 단위 테스트

#### 1.1 UI 컴포넌트 (`components/ui/`)

| 컴포넌트 | 테스트 항목 |
|---------|-----------|
| `Button` | 렌더링, 클릭 이벤트, disabled 상태, variant 스타일 |
| `Card` | 렌더링, children 표시, hover 효과 |
| `Badge` | 렌더링, 색상 variant, 텍스트 표시 |
| `Table` | 렌더링, 정렬, 행 클릭, 빈 상태 |

#### 1.2 비즈니스 컴포넌트 (`components/`)

| 컴포넌트 | 테스트 항목 |
|---------|-----------|
| `Header` | 로고 표시, 네비게이션 메뉴, 활성 상태 |
| `SearchBar` | 입력 처리, 검색 실행, debounce, clear |
| `VocCard` | VOC 정보 표시, 상태 배지, 클릭 이벤트 |
| `GuideEditor` | 편집 기능, 저장, 미리보기 |
| `ApprovalWorkflow` | 승인/거부 버튼, 상태 변경 |

---

### 2. Hooks 테스트

| Hook | 테스트 항목 |
|------|-----------|
| `useVocs` | VOC 목록 조회, 로딩 상태, 에러 처리 |
| `useGuides` | 가이드 목록 조회, CRUD 작업 |
| `useGenerateGuide` | 가이드 생성, 진행 상태, 결과 처리 |

---

### 3. API 통합 테스트

#### 3.1 Dashboard API

```
GET  /api/dashboard/stats     - 대시보드 통계 조회
GET  /api/dashboard/recent    - 최근 VOC 목록
```

#### 3.2 VOC API

```
GET  /api/voc                 - VOC 목록 조회
GET  /api/voc/:id             - VOC 상세 조회
POST /api/voc                  - VOC 생성
PUT  /api/voc/:id             - VOC 수정
DELETE /api/voc/:id           - VOC 삭제
```

#### 3.3 Guides API

```
GET  /api/guides              - 가이드 목록 조회
GET  /api/guides/:id          - 가이드 상세 조회
POST /api/guides               - 가이드 생성
PUT  /api/guides/:id          - 가이드 수정
DELETE /api/guides/:id        - 가이드 삭제
```

#### 3.4 Approvals API

```
GET  /api/approvals           - 승인 대기 목록
POST /api/approvals/:id/approve - 승인 처리
POST /api/approvals/:id/reject  - 거부 처리
```

---

### 4. 페이지 통합 테스트

#### 4.1 메인 페이지 (`/`)

- [ ] 페이지 렌더링
- [ ] 검색바 표시
- [ ] 최근 VOC 목록 표시
- [ ] 네비게이션 동작

#### 4.2 대시보드 (`/dashboard`)

- [ ] 통계 카드 표시
- [ ] 차트 렌더링
- [ ] 최근 활동 목록

#### 4.3 VOC 목록 (`/dashboard/voc`)

- [ ] VOC 목록 테이블 표시
- [ ] 검색 필터 동작
- [ ] 페이지네이션
- [ ] VOC 상세 이동

#### 4.4 가이드 목록 (`/dashboard/guides`)

- [ ] 가이드 목록 표시
- [ ] 가이드 생성 버튼
- [ ] 가이드 편집 기능

---

### 5. E2E 사용자 시나리오

#### 시나리오 1: VOC 검색 및 가이드 생성

```
1. 메인 페이지 접속
2. 검색바에 키워드 입력
3. 검색 결과 확인
4. VOC 선택
5. 가이드 생성 요청
6. 생성된 가이드 확인
7. 가이드 저장
```

#### 시나리오 2: 승인 워크플로우

```
1. 대시보드 접속
2. 승인 대기 목록 확인
3. 가이드 상세 보기
4. 승인/거부 선택
5. 코멘트 입력
6. 승인 처리 완료
```

#### 시나리오 3: 가이드 편집

```
1. 가이드 목록 접속
2. 가이드 선택
3. 편집 모드 진입
4. 내용 수정
5. 미리보기 확인
6. 저장
```

---

## 🚀 테스트 실행 명령어

```powershell
cd frontend

# 의존성 설치
npm install

# 단위 테스트 실행
npm run test

# 테스트 UI 모드
npm run test:ui

# 커버리지 포함
npm run test:coverage

# 개발 서버 실행 (통합 테스트용)
npm run dev
```

---

## 📊 테스트 체크리스트

### Phase 1: 컴포넌트 테스트
- [ ] Button 컴포넌트
- [ ] Card 컴포넌트
- [ ] Badge 컴포넌트
- [ ] Table 컴포넌트
- [ ] Header 컴포넌트
- [ ] SearchBar 컴포넌트
- [ ] VocCard 컴포넌트

### Phase 2: Hooks 테스트
- [ ] useVocs
- [ ] useGuides
- [ ] useGenerateGuide

### Phase 3: API 통합 테스트
- [ ] Dashboard API
- [ ] VOC API
- [ ] Guides API
- [ ] Approvals API

### Phase 4: 페이지 테스트
- [ ] 메인 페이지
- [ ] 대시보드 페이지
- [ ] VOC 목록 페이지
- [ ] 가이드 목록 페이지

### Phase 5: E2E 테스트
- [ ] VOC 검색 시나리오
- [ ] 가이드 생성 시나리오
- [ ] 승인 워크플로우 시나리오

---

## 🔧 테스트 환경 설정

### Backend 서버 실행 필요

```powershell
# 터미널 1: Backend 실행
cd backend
uvicorn app.main:app --reload --port 8000

# 터미널 2: Frontend 실행
cd frontend
npm run dev
```

### 환경 변수 (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
