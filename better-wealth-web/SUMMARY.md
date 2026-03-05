# BetterWealth FA — 전체 분석 요약 및 액션 아이템

분석 일자: 2026-03-05
팀: 기획자2, 프론트2, 백엔드2, 인프라1, 코드리뷰2, 법률1

## 전체 평가

| 영역 | 등급 | 핵심 이슈 |
|------|------|----------|
| 서비스 기획 | B | 비활성 기능 다수, 네이밍 오타 |
| UI/UX | B- | 온보딩 부재, 모바일 미대응 |
| 프론트엔드 아키텍처 | B+ | Feature-based 우수, 테스트 극빈 |
| 백엔드 (NestJS) | B | 모듈화 우수, 테스트 부재, Guard 누락 |
| 백엔드 (FastAPI) | B- | 인증 없음, CORS 전체 허용, 순환 의존 |
| 인프라/DevOps | D | CI/CD 전무, .env Git 노출 |
| 코드 품질 (TS) | B- | any 남용, Prettier 불일치 |
| 코드 품질 (Python) | B- | 에러 포맷 불일치, N+1 패턴 |
| 법률/컴플라이언스 | C+ | 개인정보 미암호화, 금융규제 미비 |

---

## 액션 아이템

### 즉각 조치 (Critical — 법적/보안 위험)

| # | 항목 | 담당 | 관련 파일 |
|---|------|------|---------|
| 1 | `.env` 파일 Git 이력 제거 + 시크릿 로테이션 | 인프라엔지니어-성민 | `environments/.env.*`, `apps/be-fastapi/.env.*` |
| 2 | CustomerFamily 성명/생년월일 암호화 | 백엔드개발자-태양 | `prisma/schema.prisma`, CustomerFamily 모델 |
| 3 | TestCustomer CI/전화번호 더미 데이터 대체 | 백엔드개발자-태양 | `prisma/schema.prisma`, TestCustomer 모델 |
| 4 | CORS 허용 도메인 제한 (NestJS + FastAPI) | 백엔드개발자-태양/나래 | `apps/famain/src/main.ts`, `apps/nudge/main.py` |
| 5 | 비밀번호 재설정 엔드포인트 Guard 적용 | 백엔드개발자-태양 | `advisor-user.controller.ts:105-131` |
| 6 | FastAPI 내부 에러 정보 외부 노출 차단 | 백엔드개발자-나래 | `common/logger/exception_handlers.py` |

### 단기 개선 (High — 1~2 스프린트)

| # | 항목 | 담당 |
|---|------|------|
| 7 | CI/CD 파이프라인 구축 (GitHub Actions) | 인프라엔지니어-성민 |
| 8 | Rate Limiting 구현 (@nestjs/throttler, slowapi) | 백엔드개발자-태양/나래 |
| 9 | JWT ignoreExpiration: true 제거 | 백엔드개발자-태양 |
| 10 | Prettier 루트 레벨 공통 설정 | 코드리뷰어-준혁 |
| 11 | Dockerfile에서 prisma migrate 분리 | 인프라엔지니어-성민 |
| 12 | 약관 동의 철회 이력 append-only 방식 변경 | 백엔드개발자-태양 |
| 13 | 접근 로그 5년 보존 정책 수립 | 인프라엔지니어-성민 |

### 중기 개선 (Medium — 로드맵)

| # | 항목 | 담당 |
|---|------|------|
| 14 | 테스트 커버리지 확보 (FE + BE + FastAPI) | 프론트개발자-하은/백엔드개발자 전원 |
| 15 | 비활성 기능 로드맵 정리 (활성/폐기 결정) | 기획자-민준/서연 |
| 16 | NestJS/FastAPI 에러 응답 포맷 통일 | 백엔드개발자-태양/나래, 코드리뷰어-유진 |
| 17 | FastAPI 인증 미들웨어 도입 (API Key 또는 mTLS) | 백엔드개발자-나래 |
| 18 | Nudge ↔ NestJS 순환 의존성 해소 | 백엔드개발자-나래/태양 |
| 19 | Dockerfile 통합 (3벌 → ARG 기반 단일) | 인프라엔지니어-성민 |
| 20 | FastAPI Dockerfile: slim 이미지 + non-root | 인프라엔지니어-성민 |
| 21 | BE ESLint no-explicit-any: off → warn | 코드리뷰어-준혁 |
| 22 | 적합성 보고서 기록 체계 구축 (자본시장법) | 백엔드개발자-태양, 법률전문가-혜림 |
| 23 | Customer.address 암호화 | 백엔드개발자-태양 |
| 24 | OpenAI 국외 개인정보 이전 동의 검토 | 법률전문가-혜림 |
| 25 | yfinance 상업적 이용 약관 검토 | 법률전문가-혜림 |
| 26 | 네이밍 오타 수정 (anlaysis, widthdrawal 등) | 프론트개발자-지호/백엔드개발자 |
| 27 | pickle → JSON 직렬화 전환 (fncache.py) | 백엔드개발자-나래 |

---

## 프로젝트 구조 핵심 정보

```
apps/
├── be-nest/         # NestJS (famain + fabatch)
│   ├── 포트: famain 13700, fabatch 23400
│   ├── DB: MySQL (Prisma 69모델), MongoDB, Redis
│   ├── 컨트롤러 49개, 엔드포인트 275개
│   └── 공유 라이브러리 22개
├── fe-react-app/    # React 18 + Vite + TypeScript
│   ├── 828개 TS/TSX 파일
│   ├── Feature-based + Layer-based 아키텍처
│   ├── Redux Toolkit (10 슬라이스) + React Query v4
│   └── Storybook 104개 stories
└── be-fastapi/      # Python FastAPI (Nudge)
    ├── 포트: 13550 (HAProxy → 워커 13551-13554)
    ├── DB: MySQL (Prisma 18모델 — RD_, BD_ 접두사)
    ├── 5개 도메인: wm, fin, ai, kfr, misc
    └── NumPy/SciPy/Numba 기반 금융 계산 엔진

packages/
├── shared-consts/   # 공유 타입/상수 (FE/BE 모두 사용)
├── email-template/
└── excel-to-json/
```

## 주요 외부 연동

| 서비스 | 용도 |
|--------|------|
| 마이데이터 기관 | 금융 데이터 연동 |
| BetterApp | 앱 연동 |
| 카카오 메시지 | 알림 발송 |
| NCP (Naver Cloud) | 메일/SMS |
| OpenAI GPT-4o | AI 투자진단, 은퇴분석 |
| yfinance | 금융 데이터 수집 |
| AWS S3 | 파일 스토리지 |
| QBWH / Alliance | 제휴사 연동 |
