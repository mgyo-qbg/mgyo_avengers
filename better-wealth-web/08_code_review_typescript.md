# TypeScript 코드 품질 — 코드리뷰어-준혁

## 1. TypeScript 타입 안전성

### 백엔드 (be-nest) — 등급: C+
- tsconfig: `strictNullChecks`, `noImplicitAny`, `strictBindCallApply` — 개별 옵션만 (strict: true 아님)
- `strictFunctionTypes`, `strictPropertyInitialization` 누락
- ESLint: `@typescript-eslint/no-explicit-any: 'off'` — any 완전 허용
- 30개 파일에서 98건 any 사용 (fluent.report.service.ts 15건 집중)

### 프론트엔드 (fe-react-app) — 등급: B-
- tsconfig: `strict: true` — 우수
- ESLint: `no-explicit-any: 1` (warn)
- `no-unsafe-assignment: 0`, `no-unsafe-member-access: 0` — any 전파 허용
- 30개 파일에서 87건 any, 47건 eslint-disable/@ts-ignore

### shared-consts — 등급: B+
- `strict: true`, any 사용 7건 (2개 파일)
- `strictPropertyInitialization: false`
- `as const` 패턴 잘 활용

## 2. Prettier 설정 불일치 (Critical)

| 설정 | be-nest | fe-react-app | shared-consts |
|------|---------|--------------|---------------|
| trailingComma | `"all"` | `'none'` | `"all"` |
| printWidth | 80 (기본) | 100 | 80 (기본) |

- FE와 BE/shared-consts 간 trailingComma 불일치 — 코드 이동 시 포맷 충돌
- 루트 레벨 공통 `.prettierrc` 없음

## 3. ESLint 설정

- BE: `plugin:@typescript-eslint/recommended` + prettier (더 느슨)
- FE: `recommended-type-checked` + TanStack Query + react-hooks (더 엄격)
- shared-consts: 기본 `recommended`만, prettier 통합 없음

## 4. 아키텍처 패턴 일관성 — 등급: B+

### 백엔드 (양호)
- Controller → Service 패턴 일관적
- Guard 체계 잘 구성 (mixin 기반 팩토리 패턴)
- `BasedException` 기반 통일 예외 처리
- 20+개 NestJS 라이브러리로 모듈화 우수
- `...Object.values(modules)` 일괄 임포트 — 의존성 추적 어려움

### 프론트엔드 (양호)
- Provider 계층 명확
- features/ 도메인별 분리
- API + hooks 레이어 분리
- Redux(클라이언트) + React Query(서버) 역할 분리

## 5. shared-consts 활용 — 등급: B

- FE 20+개, BE 20개 파일에서 사용
- 159줄 index.ts에서 대규모 re-export
- 공유 항목: UserRole, CustomerStatus, 금융 도메인 타입, 유틸리티, 폼 스키마
- ESM + CJS 듀얼 빌드

**약점:**
- barrel export가 크고 `export *`와 named export 혼재 — tree-shaking 영향
- types 폴더 내에 enums가 위치하는 혼란스러운 구조

## 6. 보안 취약점

### [HIGH] 비인증 비밀번호 엔드포인트
- `PUT /advisor/my/reset-password` — Guard 없음, email+name만으로 재설정
- `PUT /advisor/my/password` — Guard 없음
- 인라인 `@Body()` 타입 사용 — class-validator 검증 우회
- 파일: `advisor-user.controller.ts:105-131`

### [MEDIUM] JWT localStorage 저장
- XSS 공격 시 토큰 탈취 가능
- `apps/fe-react-app/src/utils/jwtUtils.ts:61`

### [POSITIVE]
- Helmet 미들웨어 적용
- DOMPurify로 HTML sanitization
- prisma-field-encryption으로 민감 필드 암호화
- bcrypt 비밀번호 해싱 (salt round 10)
- 2FA 지원

## 리팩토링 우선순위

### 높은 우선순위
1. 비밀번호 관련 엔드포인트 보안 강화 (rate limiting + 추가 인증)
2. BE ESLint `no-explicit-any: 'off'` → `'warn'` 변경
3. Prettier 루트 레벨 공통 설정 도입

### 중간 우선순위
4. BE tsconfig `strict: true` 전환
5. shared-consts barrel export 정리
6. 인라인 @Body() 타입 → DTO 클래스 변환

### 낮은 우선순위
7. FE `no-unsafe-assignment`, `no-unsafe-member-access` 활성화
8. `react-hooks/exhaustive-deps` 재활성화 검토
9. shared-consts 듀얼 빌드 단순화
