# 인프라/CI-CD/배포 — 인프라엔지니어-성민

## CI/CD 현황

**CI/CD 파이프라인 없음:**
- `.github/workflows/` 없음
- `.gitlab-ci.yml` 없음
- 자동화된 빌드/테스트/배포 파이프라인 전무

**로컬 코드 품질 관리 (Husky pre-commit):**
- `pnpm pre-commit` → lint-staged 실행 (prettier + eslint)
- fe-react-app 유닛 테스트 실행
- Python 파일 변경 시 Ruff 린트 실행

## Docker 구성

### docker-compose.yml (루트)
- Compose v3.1 (deprecated)
- 서비스 5개: mysql, redis, be-nest-fa-main, fe-app, nudge
- MySQL 8.0.25 (포트 3406), Redis latest (포트 6379)
- MySQL root password 하드코딩 (`password`) — 변경 필요

### NestJS Dockerfile (famain/fabatch 각 3벌)

| 파일 | 환경 | 포트 |
|------|------|------|
| Dockerfile | production | 13700 / 23400 |
| Dockerfile.dev | development | 13700 / 23400 |
| Dockerfile.local | local | 3000 / 3100 |

**패턴:**
- node:18-alpine 기반
- 3단계 멀티스테이지 (dev → build → prod)
- pnpm 8.6.12, BuildKit 캐시 마운트 활용
- non-root user (node) 실행

**문제점:**
- Dockerfile 내에서 `prisma migrate deploy` 실행 — 빌드 시점 DB 연결 필요 (위험)
- 3벌 Dockerfile 중복 — ARG/환경변수로 통합 가능
- PNPM_VER ARG가 최종 스테이지에서 스코프 밖

### 프론트엔드 Dockerfile
- Nginx 1.21.4-alpine (2021년 버전 — 업데이트 필요)
- `headers-more` 모듈 추가 빌드
- envsubst 기반 설정 주입
- 포트 13040, gzip 압축, `server_tokens off`

### FastAPI Dockerfile
- python:3.11-bookworm (full, ~1GB — slim 권장)
- 단일 스테이지 (멀티스테이지 미적용)
- non-root 사용자 미설정 — 보안 위험
- 포트 13550

## 환경 변수 관리

### 환경별 분리

| 앱 | local | development | production |
|----|-------|-------------|------------|
| be-nest | `environments/.env.local` | `.env.development` | `.env.production` |
| fe-react-app | `.env.localtest` / `.env.localprod` | `.env.development` | `.env.production` |
| be-fastapi | `.env` / `.env.local` | `.env.development` | `.env.production` |

### [심각] .env 파일 Git 노출

`environments/.env.local`이 Git에 커밋되어 있으며 포함된 시크릿:
- JWT secret key (`dsakljdas34df`) — 매우 약한 키
- NCP access/secret key
- Prisma 필드 암호화 키
- AWS S3 access key/secret
- DB 비밀번호
- 각종 API 토큰 (QBWH, Alliance)
- Fluent Manager credential 전체

**개발/운영 환경이 동일한 JWT 시크릿 사용** — 매우 위험

## 모노레포 빌드 시스템

```yaml
# pnpm-workspace.yaml
packages:
  - apps/*
  - packages/*
```

- `.npmrc`: `shared-workspace-lockfile=false` (각 앱 독립 lockfile)
- `pnpm dev` — 모든 앱 병렬 실행

## 배포 현황

**IaC 없음:**
- Terraform, Kubernetes 매니페스트, Helm 차트 없음
- 배포 자동화 스크립트 없음

**배포 힌트 (코드상 단서):**
- `env:prod:copy` 스크립트: `~/turple/deploy/secrets/prd/env.production`에서 시크릿 복사
- Nudge 프로덕션: Supervisor + HAProxy
- 로그: `/var/log/turple/all.log`

## 권고사항 (우선순위순)

1. **[즉각] .env 파일 Git 이력에서 제거** — `git filter-branch` 또는 BFG Repo Cleaner 사용, 노출된 시크릿 즉시 로테이션
2. **[즉각] 시크릿 관리 도구 도입** — AWS Secrets Manager, Vault 또는 최소한 `.gitignore` 적용
3. **[단기] CI/CD 파이프라인 구축** — GitHub Actions로 lint + test + build + deploy 자동화
4. **[단기] Dockerfile 통합** — 3벌 → 단일 파일 + ARG/docker-compose override
5. **[단기] Prisma migrate 분리** — 빌드 단계에서 마이그레이션 제거, 별도 Job으로 분리
6. **[중기] IaC 도입** — Terraform 또는 docker-compose 기반 인프라 코드화
7. **[중기] 이미지 업데이트** — Nginx 최신화, FastAPI Python slim 이미지 전환
8. **[중기] 보안 스캐닝** — npm audit, Snyk, Trivy 등 의존성/컨테이너 보안 스캔

## Node 버전 불일치
- CLAUDE.md: Node 16.x 명시
- Dockerfile: node:18-alpine 사용
- fe-react-app package.json: `>=18 <19`
