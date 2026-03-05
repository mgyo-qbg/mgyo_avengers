# Python/API/인프라 코드 품질 — 코드리뷰어-유진

## 1. FastAPI 코드 품질

### 코드 구조 — 양호
- 도메인별 라우터: wm/, fin/, ai/, kfr/, misc/
- 각 라우터: route.py (엔드포인트) + model.py (Pydantic) + utils.py (로직) — 일관적
- common/: prisma, logger, cache, error, utils 분리

### 예외 처리 — 보통
- `common/error/model.py`: ErrStatus, ErrType, ErrCode, ErrMsg Enum 체계 — 우수
- 40개 이상 도메인별 에러 코드
- **문제**: `except BaseException` 사용 (`severance/route.py:38`) — KeyboardInterrupt도 잡음, `except Exception`으로 변경 필요
- `unhandled_exception_handler`에서 `str(exc)` 노출 — 내부 정보 외부 노출 위험
- ErrMsg 내 f-string 구문이 정의 시점에 평가 안 됨

### 타입 힌팅 — 양호
- Pydantic v2 BaseModel + Field 활용
- Union[float, int] 등 타입 힌팅 적용
- Python 3.10+ (`str | None`)과 `Optional[str]` 혼용

## 2. API 설계 일관성 (NestJS + FastAPI)

### 에러 응답 포맷 불일치 — 중간 리스크

**NestJS:**
```json
{ "statusCode": 412, "message": "오류 메시지", "messageCode": "ERROR_CODE" }
```

**FastAPI:**
```json
{ "status": 400, "type": "BAD_REQUEST", "title": "...", "url": "...", "code": "TX_SEV_ZR_SEV_AMT", "message": "..." }
```

- 에러 응답 필드명/구조 완전 불일치
- NestJS: 412를 비즈니스 에러 기본값으로 과다 사용 (표준 아님)
- FastAPI: RFC 7807 유사 구조 (더 표준적)
- API 버전 관리: NestJS 없음, FastAPI `/v1/` 사용 — 불일치

### 권고
- RFC 7807 기반 통합 에러 포맷 정의
- API 버전 관리 전략 통일

## 3. DB 쿼리 최적화

### 인덱스 현황 — 양호
- 65개 이상 `@@index`, `@@unique` 정의
- FK 기반 인덱스 체계적 설정
- 암호화 필드용 hash 인덱스 분리 (emailHash, phoneNumHash)

### N+1 문제 — 중간 리스크
**`customer.service.ts:117-210` (`getAdvisorsCustomer`):**
- 한 번의 API 호출에 5개 순차 쿼리: findMany → findMany → paginator → groupBy → queryRaw
- 일부 통합 가능

**`customer.service.ts:340-450`:**
- findFirst → findUnique → findUnique 순차 호출 (include로 통합 가능)

### 암호화 필드 검색 이슈
- `customer.service.ts:157-165`: 암호화된 name, phoneNum, email에 직접 `contains` 검색 시도
- 암호화 필드는 부분 검색 불가, hash 필드 기반 정확 매칭만 가능

### 트랜잭션 사용 — 양호
- 21개 서비스 파일에서 62건 `$transaction` 사용

## 4. 인프라 코드 품질

### NestJS Dockerfile — 양호
- 멀티 스테이지 빌드 (dev → build → prod) — 우수
- pnpm store 캐시 마운트 — 빌드 성능 최적화
- non-root user (node) 실행 — 보안 양호

**문제점:**
- `prisma migrate deploy`를 빌드 단계에서 실행 — 빌드 시 운영 DB 연결 필요, 분리 필요
- Dockerfile.dev 최종 스테이지에 "Production Server" 주석 — 혼란
- PNPM_VER ARG: 멀티스테이지에서 스코프 재선언 필요

### FastAPI Dockerfile — 개선 필요
- 단일 스테이지 빌드
- `python:3.11-bookworm` (~1GB) → `python:3.11-slim-bookworm` (~100MB) 권장
- non-root 사용자 미설정
- 헬스체크 미정의

### docker-compose.yml — 기본 수준
- `version: "3.1"` (deprecated)
- MySQL 비밀번호 하드코딩 (`password`)
- Redis 비밀번호 미설정, 포트 외부 노출
- 헬스체크 미정의 — depends_on이 실제 준비 상태 보장 안 함
- MySQL 데이터 볼륨 퍼시스턴스 미설정

### CI/CD
- `.github/workflows/` 또는 `.gitlab-ci.yml` 없음

## 5. 테스트 커버리지

### FastAPI — 중간
- 유닛 테스트 7개: 세금/연금 계산 위주
- Bruno API 테스트 22개 (CI 통합 어려움)
- AI, 상속세, 대출 등 주요 도메인 미테스트

### NestJS — 매우 부족
- spec 파일 6개: 인프라 라이브러리 위주
- 핵심 모듈(auth, customer, advisor) 테스트 전무
- 인증/인가 플로우 미검증

### 프론트엔드 — 매우 부족
- 테스트 파일 2개

## 6. 문서화 현황

### API 문서 — 양호
- NestJS: Swagger 데코레이터 적용 (production 비활성화)
- FastAPI: 내장 Swagger 자동 생성, Field(description, examples) 활용

### 코드 주석 — 보통
- CLAUDE.md 각 앱별로 잘 작성됨 — 우수
- Python docstring 대부분 누락
- TypeScript JSDoc 거의 없음

### 부재 문서
- API 변경 이력 (CHANGELOG)
- 데이터 모델 ERD
- 외부 연동 인터페이스 명세
- 배포 프로세스 문서

## 최우선 조치

1. CORS 전체 허용 해제 (`allow_origins=["*"]`)
2. 에러 응답 내부 정보 노출 차단 (str(exc) 제거)
3. NestJS/FastAPI 에러 응답 포맷 통일
4. 테스트 커버리지 대폭 확대
5. FastAPI Dockerfile slim 전환 + non-root 설정
6. NestJS Dockerfile에서 prisma migrate 분리
