# 베러웰스웹(BetterWealth FA) — 팀 컨텍스트 복구 가이드

서비스: 재무 어드바이저(FA)용 B2B SaaS 플랫폼 (웹)
레포지토리: /Users/imsi/Desktop/qbg/repo/better-wealth-fa
분석 일자: 2026-03-05

## 팀 구성

| 에이전트명 | 역할 | 담당 파일 |
|-----------|------|---------|
| 웹팀-리드 | 팀 코디네이터 | (이 README) |
| 웹-기획자1 | 기획자 (서비스 개요) | 01_service_overview.md |
| 웹-기획자2 | 기획자 (UI/UX) | 02_ux_screens.md |
| 웹-프론트엔드1 | 프론트개발자 (아키텍처) | 03_frontend_architecture.md |
| 웹-프론트엔드2 | 프론트개발자 (품질/테스트) | 04_frontend_quality.md |
| 웹-백엔드1 | 백엔드개발자 (NestJS) | 05_backend_nestjs.md |
| 웹-백엔드2 | 백엔드개발자 (FastAPI) | 06_backend_fastapi.md |
| 웹-인프라1 | 인프라엔지니어 (CI/CD, Docker) | 07_infrastructure.md |
| 웹-코드리뷰어1 | 코드리뷰어 (TypeScript) | 08_code_review_typescript.md |
| 웹-코드리뷰어2 | 코드리뷰어 (Python/인프라) | 09_code_review_python_infra.md |
| 웹-법률전문가1 | 법률전문가 (개인정보/금융규제) | 10_legal_compliance.md |

전체 요약: SUMMARY.md

## 복구 방법

### 1. 웹팀-리드 스폰

```
이름: 웹팀-리드
역할: general-purpose
지시: /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-web/README.md를 읽고
      팀 구조를 파악하라. 팀원 이름은 웹- 프리픽스로 시작한다.
      파악 완료 후 team-lead에게 보고하고 대기하라.
```

### 2. 팀원 10명 동시 스폰

| 에이전트명 | 담당 파일 경로 |
|-----------|-------------|
| 웹-기획자1 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-web/01_service_overview.md |
| 웹-기획자2 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-web/02_ux_screens.md |
| 웹-프론트엔드1 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-web/03_frontend_architecture.md |
| 웹-프론트엔드2 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-web/04_frontend_quality.md |
| 웹-백엔드1 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-web/05_backend_nestjs.md |
| 웹-백엔드2 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-web/06_backend_fastapi.md |
| 웹-인프라1 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-web/07_infrastructure.md |
| 웹-코드리뷰어1 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-web/08_code_review_typescript.md |
| 웹-코드리뷰어2 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-web/09_code_review_python_infra.md |
| 웹-법률전문가1 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-web/10_legal_compliance.md |

## 즉각 조치 필요 이슈 (Critical 6건)

| # | 이슈 | 담당 | 파일 위치 |
|---|------|------|---------|
| 1 | .env Git 노출 (JWT/DB/AWS 시크릿) | 웹-인프라1 | environments/.env.*, apps/be-fastapi/.env.* |
| 2 | CustomerFamily 성명/생년월일 미암호화 | 웹-백엔드1 | prisma/schema.prisma |
| 3 | TestCustomer CI/전화번호 평문 저장 | 웹-백엔드1 | prisma/schema.prisma |
| 4 | CORS 전체 허용 (NestJS + FastAPI) | 웹-백엔드1/웹-백엔드2 | main.ts, main.py |
| 5 | 비밀번호 재설정 Guard 미적용 | 웹-백엔드1 | advisor-user.controller.ts:105-131 |
| 6 | FastAPI pickle RCE 취약점 | 웹-백엔드2 | fncache.py |

## 프로젝트 구조

```
apps/
├── be-nest/         # NestJS (famain 13700 + fabatch 23400)
├── fe-react-app/    # React 18 + Vite + TypeScript
└── be-fastapi/      # Python FastAPI (Nudge, 13550)
packages/
├── shared-consts/
├── email-template/
└── excel-to-json/
```

## 로컬 실행 방법

```bash
# 필요 Docker 컨테이너: MySQL(3406), Redis(6379), MongoDB(27017)
# MongoDB는 db-mongo 컨테이너 사용 (다른 레포에서 공유)
# .env.local MONGO_URL: mongodb -> localhost 변경 필요
# Prisma 클라이언트: pnpm prisma:local:generate (최초 1회)
pnpm start:local
```
