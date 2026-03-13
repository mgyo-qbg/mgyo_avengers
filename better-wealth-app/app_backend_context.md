# 앱-백엔드1 컨텍스트

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**
> 수정이 필요하면 Claude에게 요청하세요.


작성일: 2026-03-12
최종 업데이트: 2026-03-12
레포 경로: `/Users/imsi/Desktop/qbg/repo/better-backend`

---

## 역할 및 책임

- better-backend 레포 전체 아키텍처, 도메인, API 엔드포인트, DB 스키마 파악
- 신규 이슈 개발 시 백엔드 연동 포인트 및 영향 범위 분석
- API 변경/신규 개발 시 프론트엔드·기획자와 인터페이스 협의

---

## 레포 개요

| 항목 | 내용 |
|------|------|
| **레포 경로** | `/Users/imsi/Desktop/qbg/repo/better-backend` |
| **타입** | Yarn Workspaces NestJS 모노레포 |
| **Node** | 18.20.2 |
| **TypeScript** | 4.3.5 |
| **HTTP 서버** | Fastify v9 (Express 대체) |
| **빌드** | SWC (Speedy Web Compiler) |
| **패키지 관리** | Yarn Workspaces |

---

## 앱 구성 (6개 + 부가 앱)

| 앱 | 포트 | 역할 |
|----|------|------|
| `main` | 13100 | 메인 REST API (인증, 사용자, MyData, 자산) |
| `asset` | 13200 | 자산 전용 API (펀드, 연금, 보험, 암호화폐) |
| `alliance` | 13300 | 제휴사 API (증권사, 은행, FA 플랫폼) |
| `batch` | 23200 | 배치 작업 서버 (Cron, CLI, HTTP) |
| `nudge` | 13550 | 푸시 알림 (Python FastAPI) |
| `admin` | 14200 | 백오피스 관리자 |

---

## 공유 라이브러리 (libs/ — 23개, `@bd/*` 네임스페이스)

| 라이브러리 | 역할 |
|-----------|------|
| `@bd/common` | DTO, 상수, 예외 |
| `@bd/shared` | ApiConfigService, 글로벌 서비스 |
| `@bd/util` | 변환/암호화/포맷팅 유틸 |
| `@bd/log` | Pino 로깅, 이벤트 서비스 |
| `@bd/cache` | Redis 캐시, Bull 큐 |
| `@bd/mongo` | Mongoose 설정 |
| `@bd/guards` | JWT/Role 가드 (auth.guard.ts, auth-admin.guards.ts, auth-alliance.guards.ts) |
| `@bd/decorators` | @AuthUser(), 커스텀 데코레이터 |
| `@bd/push` | Firebase 푸시 알림 |
| `@bd/mydata` | MyData 통합 라이브러리 |
| `@bd/strategies` | Passport JWT 전략 |

---

## 주요 도메인 & API

### 인증 (apps/main/src/modules/auth/)
- `POST /api/v1/auth/login` — CI/DI + PIN 로그인 → JWT 발급
- `GET /api/v1/auth/me` — 현재 사용자 정보 (JWT Guard 필요)
- `POST /api/v1/auth/fido` — 지문 정보 등록
- `POST /api/v1/auth/pin-verify` — PIN 검증
- `POST /api/v1/auth/logout` — 로그아웃

### 사용자 (apps/main/src/modules/users/)
- `GET /api/v1/user/investment-tendency` — 투자 성향 조회
- `POST /api/v1/user/investment-tendency` — 투자 성향 저장
- `GET /api/v1/user/banner-list` — 배너 조회
- 약관 동의, 상담 신청, 프로필 관련

### MyData (apps/main/src/modules/mydata/)
- `GET /api/v1/mdauth/individual/status` — 연동 상태 확인
- `POST /api/v1/mdauth/individual/request` — 인증 요청
- `GET /api/v1/mdauth/individual/callback` — OAuth 콜백
- `GET /api/v1/mdjiwon/account/{accountId}` — 지원 API 계정 정보
- TCP 마이크로서비스 엔드포인트 (포트 2003)

### 자산 (apps/asset/src/modules/)
- `GET /api/v1/assets` — 전체 자산 목록
- `GET /api/v1/assets/fund` — 펀드 자산
- `GET /api/v1/assets/pension` — 연금 (국민연금, DC, IRP, DB)
- `GET /api/v1/assets/insurance` — 보험
- 암호화폐, 부동산, 기타 자산

### 배치 (apps/batch/src/task/ — 20+ 작업)
- `updateExchangeRate` — 환율 업데이트 (Cron)
- `dailyApiStatistics` — 일일 API 통계
- `matchIrpFundNames` / `matchDcFundNames` — 펀드명 매칭
- `updateUserRegularData` — 사용자 정기 갱신

---

## 데이터베이스

### MySQL (Prisma ORM)
| DB | URL 환경변수 | 역할 |
|----|------------|------|
| 메인 (`betterday_db`) | `DATABASE_URL` | 사용자, 자산, MyData |
| 마켓 (`betterday_market`) | `MARKET_DATABASE_URL` | 펀드/상품 데이터 |
| 백오피스 (`betterday_admin`) | `BO_DATABASE_URL` | 관리자 |
| FA (`betterday_fa`) | `FA_DATABASE_URL` | FA 플랫폼 |
| 읽기전용 | `READ_ONLY_DATABASE_URL` | 복제본 |

### 핵심 테이블 (prisma/schema.prisma — 152개 테이블)
| 테이블 | 역할 |
|--------|------|
| `BDAY_CUST` | 사용자 기본 정보 (암호화 필드 포함) |
| `BDAY_CUST_DVCE` | 사용자 디바이스 |
| `BD_ASSET_REAL_LIST` | 실제 자산 목록 |
| `BDAY_CUST_PNSION` | 연금 정보 |
| `MD_BDAY_CUST_HIST_SUMMARY` | MyData 계좌 요약 |
| `BD_NOTIFICATION` | 푸시 알림 |
| `BDAY_DIAG_CUST` | 진단/설문 결과 |

**필드 암호화** (prisma-field-encryption v1.3.2):
- `/// @encrypted` 마킹된 필드: CUST_NM, MOBILE_NO, EMAIL, CI

### MongoDB (Mongoose)
- 용도: API 로깅, 메트릭, 세션 관리
- 라이브러리: `@bd/mongo`

### Redis
- 캐시 (`cache-manager`), Bull 작업 큐 (`@bd/cache`)

---

## 인증 체계

```
로그인 → access_token (1h) + refresh_token (7d)
API 호출 → Authorization: Bearer {access_token}
Guard → libs/guards/src/auth.guard.ts (PassportJS JWT)
```

**JWT 설정** (환경변수 기반):
- `JWT_SECRET_KEY` — 서명 키
- `JWT_EXPIRATION_TIME=3600` — 1시간
- `JWT_EXPIRATION_TIME_FRONTEND=36000` — 10시간 (FA)
- `JWT_REFRESH_EXPIRATION_TIME=604800` — 7일

---

## 오류 코드 표준

```
400121: AGE_LIMIT               — 나이 제한
400122: FIDO_VERIFICATION_FAIL  — 지문 인증 실패
400123: PIN_MISMATCH            — PIN 불일치
400124: PIN_ABOVE_ERR_CNT       — PIN 오류 횟수 초과
400133: USER_NOT_FOUND_DEVICE_INFO — 디바이스 정보 없음
500001: SERVER_INTERNAL         — 서버 오류
500003: DB_ERR                  — DB 오류
```

---

## API 문서 (Swagger)

- main: `http://localhost:13100/api/v1/docs`
- asset: `http://localhost:13200/api/v1/docs`
- admin: `https://admin.betterday.finset.io/documentation/`
- market: `https://market.betterday.co.kr/api/v1/market/docs`

---

## 로컬 실행

```bash
yarn install --frozen-lockfile
yarn docker:db          # DB만 시작 (MySQL, MongoDB, Redis)
yarn start              # main 앱 (포트 13100)
yarn start:watch        # 핫 리로드
yarn prisma:local:generate  # Prisma 클라이언트 생성 (최초 1회)
```

---

## 기술 문서 위치

`/Users/imsi/Desktop/qbg/repo/better-backend/docs/` (65+ 파일)
- `alliance-api.md` — 제휴사 API
- `mydata-seq-diagram.md` — MyData 시퀀스
- `batch.md` — 배치 가이드
- `prisma-field-encryption.md` — 필드 암호화
- `fido.md` — 생체 인증
- `irp-fund-matching.md` — IRP 펀드 매칭
