# NestJS 백엔드 구조 — 백엔드개발자-태양

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**  
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.


## 구조 개요

NestJS 내부 모노레포 (`nest-cli.json` 기반):
- **2개 앱**: famain (REST API) + fabatch (Bull Queue 배치)
- **22개 라이브러리**: 인프라/공통 관심사 분리

## famain 비즈니스 모듈 (12개 도메인)

| 모듈 | 설명 |
|------|------|
| auth | 인증/인가 (로그인, 2FA, 프로필) |
| advisor | 어드바이저 관리 (user, org, office) |
| customer | 고객 관리 (21개 하위 모듈 — 가장 큰 도메인) |
| faadmin | 관리자 기능 |
| model.portfolio | 모델 포트폴리오 |
| mydata.orgs | 마이데이터 기관 |
| pdf | PDF 보고서 |
| betterapp | BetterApp 연동 |
| menu, settings, system, user | 부가 기능 |

## 공유 라이브러리 (22개)

- DB: prisma(MySQL), mongodb, redis.cache
- 인증: auth, guards, strategies, jwt.provider, decorators
- 외부: external.interlock, external.link, http.client, alliance-orgs
- 인프라: app.config, logger, exceptions, interceptors, middlewares, queue, shared, aspect, health.checker

## 모듈 등록 패턴

```typescript
// famain/src/index.ts에서 모든 모듈 export
// famain.module.ts에서 ...Object.values(modules)로 일괄 import
```

## API 엔드포인트

- **컨트롤러 49개 / 엔드포인트 약 275개**

| 도메인 | Base Path |
|--------|-----------|
| 인증 | `/api/v1/auth/*` |
| 어드바이저 | `/advisor/*` |
| 고객 | `/advisor/customer/*` |
| 관리자 | `/api/v1/faadmin/*` |
| 모델 포트폴리오 | `/model/portfolio/*` |
| PDF | `/pdf/*` |
| 시스템 | `/system/*` |

## 데이터베이스

### Prisma (MySQL) — 69개 모델

**주요 패턴:**
- History 패턴: 대부분 핵심 모델에 `*History` 테이블 (변경 이력 추적)
- `prisma-field-encryption`: email, userName, phoneNum 암호화 + hash 필드 분리
- ID: `BigInt @db.UnsignedBigInt`
- DB 테이블명: snake_case (`@@map`)
- `BigInt.prototype.toJSON` monkey-patching (main.ts) — 전역 오염

**도메인별 모델 수:**
- 고객 기본: Customer, CustomerHistory, CustomerFamily, CustomerFamilyMappings
- 재무 정보: CustomerIncome, CustomerSaving, CustomerSpend, CustomerSpendDetail
- 연금: CustomerPublicPension, CustomerRetirementPension
- 자산: CustomerAssets 및 13개 서브 모델 (매우 세분화)
- 은퇴: CustomerRetirement, CustomerRetirementLiving
- 투자: CustomerInvestGoal, CustomerInvestBias, CustomerInvestTendencyEvent

### MongoDB
- BetterTransaction: QBIS API 요청/응답 로깅

### Redis (DB 분리)
- DB3: Bull Queue
- DB10: 일반 캐시
- DB11: Prisma 캐시

## 인증/인가

### Guard 종류 (6개)
- `JwtAuthGuard()` — 기본 JWT 검증
- `JwtAuthGuard(StrategyType.Enum.BETTER_JWT)` — BetterApp JWT
- `AllianceJwtAuthGuard()` — 제휴사 토큰
- `LogoutJwtAuthGuard()` — 로그아웃 처리
- `TwoFactorAuthGuard` — 2FA
- `RolesGuard(UserRole.Enum.ROLE_ADMIN, ...)` — 역할 기반

### 보안 기능
- 비밀번호 5회 실패 시 계정 잠금
- bcrypt 해싱
- 비밀번호 변경 이력 관리
- 2FA 인증번호 Redis 캐시 + 이메일 발송

### 커스텀 데코레이터
- `@AuthUser()`, `@Roles()`, `@Paginator()`

## 주요 이슈

### 높은 우선순위
1. **테스트 파일 6개** (49 컨트롤러, 53 서비스 대비 극빈)
2. **Repository 계층 부재** — Service에서 Prisma 직접 사용, 테스트 어려움
3. **비밀번호 재설정 엔드포인트 Guard 미적용**
   - `PUT /advisor/my/reset-password` — email+name만으로 재설정 가능
   - `PUT /advisor/my/password` — Guard 없음

### 중간 우선순위
4. customer 모듈 비대 (21개 하위 모듈, 27개 엔드포인트 집중)
5. Global Prefix 관리 복잡 (main.ts exclude 목록 20개 이상 하드코딩)
6. jwt.strategy.ts + logout.jwt.strategy.ts에 `ignoreExpiration: true` — 만료 토큰 허용

### 낮은 우선순위
7. `custoemr.sample.controller.ts` (오타)
8. BigInt JSON 직렬화 monkey-patch
9. 파일 명명 규칙 불일치

## 기술 스택
NestJS 10, TypeScript 5.x, Prisma 5 (MySQL), Mongoose 9 (MongoDB), Redis (ioredis), Bull Queue, Passport JWT, bcrypt, Pino logger, Swagger, class-validator/transformer, helmet, compression, AWS SDK, dayjs
