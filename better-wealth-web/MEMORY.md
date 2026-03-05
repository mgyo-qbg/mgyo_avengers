# BetterWealth FA — 프로젝트 메모리

## 분석 컨텍스트 저장 위치
상세 분석 파일: `/Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-fa/`
- README.md, 01~10 각 팀원 분석, SUMMARY.md (액션 아이템 포함)

## 프로젝트 구조 핵심

- **레포**: /Users/imsi/Desktop/qbg/repo/better-wealth-fa
- **구조**: pnpm monorepo (shared-workspace-lockfile=false — 각 앱 독립 lockfile)
- **앱**: be-nest (NestJS) / fe-react-app (React 18 + Vite) / be-fastapi (Python FastAPI)
- **패키지**: shared-consts (@package/shared-consts), email-template, excel-to-json
- **Node**: 실제 18.x 사용 (CLAUDE.md에 16.x 명시 — 불일치)

## 서비스 개요

**BetterWealth FA**: 재무 어드바이저(FA)용 B2B SaaS 플랫폼
- 역할: FA_ADMIN / ROLE_ADVISOR / ROLE_ABROAD_GBI
- 핵심: 은퇴설계, 투자설계, PDF 리포트, 마이데이터 연동
- AI: OpenAI GPT-4o 연동 (투자진단, 은퇴분석)

## 즉각 조치 필요 이슈 (Critical)

1. `.env` Git 노출 — JWT secret, DB 비밀번호, API 키 포함 (`environments/.env.*`, `apps/be-fastapi/.env.*`)
2. CustomerFamily 성명/생년월일 미암호화 — 개인정보보호법 위반
3. TestCustomer CI/전화번호 평문 저장
4. CORS 전체 허용 — NestJS `enableCors()` 무인자, FastAPI `allow_origins=["*"]`
5. 비밀번호 재설정 Guard 미적용 — `advisor-user.controller.ts:105-131`
6. FastAPI 내부 에러 외부 노출 — `exception_handlers.py` str(exc)

## 주요 기술 스택

### NestJS (be-nest)
- NestJS 10, Prisma 5 (MySQL 69모델), Mongoose 9 (MongoDB), Redis, Bull Queue
- 컨트롤러 49개, 엔드포인트 275개, 공유 라이브러리 22개
- 포트: famain 13700, fabatch 23400
- JWT ignoreExpiration: true (보안 이슈)

### React (fe-react-app)
- React 18, TypeScript 5, Vite 4 (SWC), TailwindCSS 3 + SCSS
- Redux Toolkit (10 슬라이스) + React Query v4 + JwtContext
- 828개 TS/TSX 파일, Storybook 104개 stories
- 테스트 파일 2개 (0.24% 커버리지)

### FastAPI (be-fastapi)
- Python 3.11, FastAPI 0.104, Pydantic v2, Prisma Python
- 포트 13550, HAProxy 로드밸런서 → 워커 13551-13554
- 5개 도메인: wm, fin, ai, kfr, misc
- MySQL 18개 모델 (RD_, BD_ 접두사)
- NestJS와 동일 MySQL 인스턴스 공유

## 팀 컨텍스트

분석일: 2026-03-05
팀명: it-service-dev-team

| 팀원 | 역할 | 분석 영역 |
|------|------|---------|
| 기획자-민준 | 기획자 | 서비스 개요, 기능 목록 |
| 기획자-서연 | 기획자 | UI/UX, 화면 구성 |
| 프론트개발자-지호 | 프론트엔드 | FE 아키텍처 |
| 프론트개발자-하은 | 프론트엔드 | FE 품질/테스트 |
| 백엔드개발자-태양 | 백엔드 | NestJS 구조 |
| 백엔드개발자-나래 | 백엔드 | FastAPI Nudge |
| 인프라엔지니어-성민 | 인프라 | CI/CD, Docker, 보안 |
| 코드리뷰어-준혁 | 코드리뷰 | TypeScript 품질 |
| 코드리뷰어-유진 | 코드리뷰 | Python/인프라 품질 |
| 법률전문가-혜림 | 법률 | 개인정보, 금융규제 |
