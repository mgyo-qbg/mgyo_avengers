# 앱-인프라1 컨텍스트

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**
> 수정이 필요하면 Claude에게 요청하세요.


작성일: 2026-03-12
최종 업데이트: 2026-03-12
레포 경로: `/Users/imsi/Desktop/qbg/repo/better-backend`

---

## 역할 및 책임

- better-backend 인프라 구조, Docker, CI/CD, 보안 이슈 파악 및 모니터링
- 신규 이슈 개발 시 인프라 영향도 분석
- 보안 취약점 탐지 및 개선 방향 제시

---

## Docker Compose 구성 (로컬)

### 서비스 (8개)
| 서비스 | 이미지/포트 | 역할 |
|--------|-----------|------|
| `main` | Node.js / 13100 | 메인 REST API |
| `batch` | Node.js / 23200 | 배치 서버 |
| `asset` | Node.js / 13200 | 자산 API |
| `alliance` | Node.js / 13300 | 제휴사 API |
| `nudge` | Python FastAPI / 13550 | 푸시 알림 |
| `web-app` | Nginx / 8080 | 웹 앱 |
| `vkeypad` | Java / 16000 | 가상 키패드 |
| `proxy-server` | — | 리버스 프록시 |

### 데이터베이스 (5개)
| 서비스 | 이미지/포트 | DB명 |
|--------|-----------|------|
| `db` | MySQL 8.0 / 3306 | betterday_db (메인) |
| `market-db` | MySQL 8.0 / 3307 | betterday_market |
| `bo-db` | MySQL 8.0 / 3308 | betterday_admin |
| `mongo` | MongoDB 4.2 / 27017 | (로깅/메트릭) |
| `redis` | Redis 3.2 / 6379 | (캐시/큐) |

### 볼륨 공유
```yaml
volumes:
  - ./apps:/app/apps
  - ./libs:/app/libs
  - ./prisma:/app/prisma
  - ./files:/app/files
```

### 네트워크
- `dmz-net` — 프록시 서버용 DMZ 네트워크

### 로컬 실행
```bash
yarn docker:db      # DB만 시작
yarn docker:all     # 전체 서비스 시작
docker stop batch   # 배치만 중지 (로컬 .env로 실행 시)
```

---

## Dockerfile 전략

| 파일 | 환경 |
|------|------|
| `Dockerfile` | 프로덕션 (멀티스테이지 빌드 최적화) |
| `Dockerfile.local` | 로컬 개발 (핫 리로드, volume mount) |
| `Dockerfile.dev` | 개발 서버 |
| `Dockerfile.srv` | SRV(스테이징) 환경 |

---

## 환경변수 관리

| 파일 | 용도 | 상태 |
|------|------|------|
| `.env.local` | 로컬 도커 기본값 | Git 포함 (로컬 전용 기본값) |
| `.env.development` | 개발 서버 | **⚠️ Git 포함 — 실제 자격증명 노출** |
| `.env.srv` | SRV 환경 | Git 포함 |
| `.env.production` | 프로덕션 | Git 미포함 (`~/turple/deploy/secrets/prd/`) |

### `.env.development` 노출된 민감 정보 (보안 이슈 ⚠️)
```
DB_PASSWORD=Pa55W0rd01
DATABASE_URL="mysql://betterday:Pa55W0rd01@db-7vlrn-fkr.cdb.fin-ntruss.com:3306/..."
MD_CLIENT_SECRET=goQFsGRtm4cD5USjlEL2Lhyl0x22wZyw
MD_JIWON_CALL_CLIENT_SECRET=9rglkYCDmhQQB0w0J5O0cG0Os1LcMaJRAq4i
MD_NAVER_CLIENT_SECRET=0YEOEJgGzZ
MD_KAKAO_CLIENT_SECRET=b7ec594f2c7c4268aabf22d42d0a7055
SENTRY_DNS=https://...@sentry.io/...
MONGO_URL="mongodb://turpleServer:..."
```
→ `.env.*` 파일 전체를 `.gitignore`에 추가해야 함

---

## CI/CD (`.github/workflows/`)

- **플랫폼**: GitHub Actions
- **PR 체크**: lint, test, build
- **자동 배포**: main 브랜치 푸시 시 트리거
- **Husky**: `.husky/` — Git pre-commit hook

---

## 프로덕션 배포 구조

```
인터넷 → NCP NLB (nlb-finset-prd-16661627)
       → 프라이빗 IP 10.0.2.14
       → main 앱 포트 13100 (TCP)
       → NCP VPC Peering → Finset 백엔드 통신
```

- **클라우드**: NCP (Naver Cloud Platform)
- **Secrets 관리**: `~/turple/deploy/secrets/prd/env.production`

---

## 모니터링 & 로깅

| 도구 | 역할 |
|------|------|
| **Pino** (nestjs-pino v2.5.0) | 구조화 로깅 |
| **Loki** | 로그 중앙화 수집 |
| **Grafana** | 로그 대시보드 |
| **Sentry** (@sentry/node v6.16.1) | 오류 추적 |
| **헬스 체크** | `@bd/health-checker` 커스텀 라이브러리 |

**로컬**: pino-pretty (컬러 출력)
**프로덕션**: Loki 수집 → Grafana 대시보드

**민감 정보 로그 제외**:
```
req.headers.authorization  — JWT 토큰 마스킹
res.body                   — 응답 바디 제외
```

---

## 보안 현황

### ✅ 구현된 보안
| 항목 | 내용 |
|------|------|
| **JWT 인증** | PassportJS + JWT Guard (`libs/guards/src/auth.guard.ts`) |
| **필드 암호화** | prisma-field-encryption — CUST_NM, MOBILE_NO, EMAIL, CI |
| **보안 헤더** | Helmet (CSP, X-Frame-Options, X-Content-Type-Options, HSTS) |
| **역할 기반 접근** | auth-admin.guards.ts, auth-alliance.guards.ts |
| **HMAC 서명** | 제휴사 API 인증 (auth-alliance.guards.ts) |

### ⚠️ 보안 이슈 (조치 필요)

| 심각도 | 이슈 | 위치 | 설명 |
|--------|------|------|------|
| **Critical** | `.env.development` Git 노출 | `.env.development` | DB 비밀번호, MyData 시크릿, Sentry DNS 포함 |
| **High** | CORS 전체 허용 | main, asset, batch, alliance `main.ts` | `origin: '*'` — CSRF 취약 |
| **Medium** | Prisma shadow DB 노출 | `.env.development` | `SHADOW_DATABASE_URL` 포함 |

### CORS 설정 현황
```typescript
// 모든 NestJS 앱 공통
app.enableCors({
  origin: '*',           // ⚠️ 전체 허용
  credentials: true
});
// 권장: origin을 허용 도메인 배열로 제한
```

### Helmet 설정
```typescript
app.getHttpAdapter().getInstance().register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [`'self'`, `'unsafe-inline'`],
      imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
    }
  }
});
```

---

## 주요 환경변수 목록

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | 메인 MySQL 연결 문자열 |
| `MARKET_DATABASE_URL` | 마켓 DB |
| `BO_DATABASE_URL` | 백오피스 DB |
| `MONGO_URL` | MongoDB 연결 문자열 |
| `REDIS_HOST`, `REDIS_PORT` | Redis 연결 |
| `JWT_SECRET_KEY` | JWT 서명 키 |
| `JWT_EXPIRATION_TIME` | 3600 (1h) |
| `JWT_REFRESH_EXPIRATION_TIME` | 604800 (7d) |
| `MD_CLIENT_ID` / `MD_CLIENT_SECRET` | MyData OAuth 자격증명 |
| `FIREBASE_PROJECT_ID` | Firebase 프로젝트 |
| `SENTRY_DNS` | Sentry 오류 추적 DSN |
| `NODE_ENV` | development / production |

---

## 로컬 개발 시 주의사항

1. `.env.local` 사용 (도커 컨테이너 기준 hostname)
2. `MONGO_URL`: 컨테이너명 `mongo` → 로컬 직접 실행 시 `localhost`로 변경
3. Prisma 클라이언트 최초 생성: `yarn prisma:local:generate`
4. `batch` 컨테이너: 로컬 `.env` 직접 실행 시 `docker stop batch` 후 진행
