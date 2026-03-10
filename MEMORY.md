# BetterWealth — 프로젝트 메모리

## 팀 컨텍스트 복구 방법

> 세션 종료 후 복구 시: `/Users/imsi/Desktop/qbg/repo/mgyo_avengers` 하위의 문서들을 읽고 팀을 조직하고 각 팀원들의 컨텍스트를 복구해
> **필수**: 복구 시작 전 `/Users/imsi/Desktop/qbg/repo/mgyo_avengers/MEMORY.md` 존재 여부를 확인하고 반드시 읽을 것 (이 파일이 Claude 자동 메모리의 정본이며 `.claude/projects/.../memory/MEMORY.md`와 symlink로 연결됨)

### 컨텍스트 저장 위치

```
/Users/imsi/Desktop/qbg/repo/mgyo_avengers/
├── README.md                          # 전체 팀 구조 및 복구 순서
├── better-wealth-web/                 # 베러웰스웹(FA 플랫폼) 팀
│   ├── README.md                      # 웹팀 복구 가이드 (팀원 목록, 파일 경로)
│   ├── 01_service_overview.md         # 웹-기획자1
│   ├── 02_ux_screens.md               # 웹-기획자2
│   ├── 03_frontend_architecture.md    # 웹-프론트엔드1
│   ├── 04_frontend_quality.md         # 웹-프론트엔드2
│   ├── 05_backend_nestjs.md           # 웹-백엔드1
│   ├── 06_backend_fastapi.md          # 웹-백엔드2
│   ├── 07_infrastructure.md           # 웹-인프라1
│   ├── 08_code_review_typescript.md   # 웹-코드리뷰어1
│   ├── 09_code_review_python_infra.md # 웹-코드리뷰어2
│   ├── 10_legal_compliance.md         # 웹-법률전문가1
└── better-wealth-app/                 # 베러웰스앱 팀
    ├── README.md                      # 앱팀 복구 가이드
    ├── figma_design_system.md         # 앱-디자이너 (Figma 분석 결과)
    └── app_planner_context.md         # 앱-기획자 (플로우, 스펙, 플러그인 수정 이력)
issues/
└── feature/                           # 이슈별 작업 문서 (앱/웹 통합)
    └── 943/                           # #943 인출설계 설문지 (완료)
        ├── 943spec.md
        ├── 943results.md
        ├── 943user_test_results.xlsx
        └── figma-plugin/              # manifest.json, code.js, ui.html
```

## 전체 팀 구조 (총 13명)

```
총괄 (Claude — team-lead)
├── 웹팀-리드
│   ├── 웹-기획자1      (서비스 개요, 기능 목록)
│   ├── 웹-기획자2      (UI/UX, 화면 구성)
│   ├── 웹-프론트엔드1  (FE 아키텍처)
│   ├── 웹-프론트엔드2  (FE 품질/테스트)
│   ├── 웹-백엔드1      (NestJS 백엔드)
│   ├── 웹-백엔드2      (FastAPI Nudge)
│   ├── 웹-인프라1      (CI/CD, Docker, 보안)
│   ├── 웹-코드리뷰어1  (TypeScript 품질)
│   ├── 웹-코드리뷰어2  (Python/인프라 품질)
│   └── 웹-법률전문가1  (개인정보, 금융규제)
└── 앱팀-리드
    ├── 앱-기획자       (화면 플로우, 입력 스펙, 제약사항 — app_planner_context.md)
    └── 앱-디자이너     (Figma 디자인 시스템)
```

### 팀 생성 주의사항
- Claude는 Team을 하나만 리드 가능 -> 두 팀을 하나의 팀 내에서 논리적 분리 운영
- 웹팀-리드, 앱팀-리드를 먼저 스폰 후 각 팀원 배치
- 웹팀 팀원: 웹- 프리픽스 / 앱팀 팀원: 앱- 프리픽스

### 작업 원칙
- 한 문서를 수정할 때 연관된 문서도 함께 확인하고 반영한다 (팀은 한 팀 — 정합성 유지)
- 사용자가 일일이 지적하지 않아도 파생 영향 범위를 스스로 파악해서 처리한다

## 베러웰스웹 프로젝트 핵심

- **레포**: /Users/imsi/Desktop/qbg/repo/better-wealth-fa
- **구조**: pnpm monorepo (shared-workspace-lockfile=false)
- **Node**: 실제 18.x 사용 (CLAUDE.md에 16.x 명시 — 불일치)

### 즉각 조치 필요 이슈 (Critical 6건)
1. `.env` Git 노출 — JWT secret, DB 비밀번호, API 키 (`environments/.env.*`, `apps/be-fastapi/.env.*`)
2. CustomerFamily 성명/생년월일 미암호화 — 개인정보보호법 위반
3. TestCustomer CI/전화번호 평문 저장
4. CORS 전체 허용 — NestJS `enableCors()` 무인자, FastAPI `allow_origins=["*"]`
5. 비밀번호 재설정 Guard 미적용 — `advisor-user.controller.ts:105-131`
6. FastAPI pickle RCE 취약점 — `fncache.py`

### 로컬 실행 시 주의
- MongoDB: `db-mongo` 컨테이너 사용 (다른 레포에서 공유, 포트 27017)
- `.env.local` MONGO_URL: `mongodb` -> `localhost` 변경 필요
- Prisma 클라이언트 최초 실행 전 `pnpm prisma:local:generate` 필요

## 이슈 관리 구조

> **`{번호}spec.md`는 사용자가 직접 소통하거나 수정하는 유일한 파일이다.**
> 나머지 모든 파일은 spec.md로부터 파생되거나, 결과물이거나, 컨텍스트/도구 파일이다.

워크플로우 상세: `issues/WORKFLOW.md`

```
issues/
└── feature/
    └── {번호}/
        ├── {번호}spec.md              # 사용자 소통 파일 (유일한 직접 소통 파일)
        ├── {번호}results.md           # 파생/결과 파일
        ├── {번호}user_test_results.xlsx  # 파생/결과 파일
        └── figma-plugin/             # 파생/결과 파일
```

**이슈 라이프사이클 (5단계)**
1. `요구사항수집` — 대화로 요건 파악, spec.md 초안 작성
2. `스펙초안` — 기획자 게이트 검토 (앱: 앱-기획자 / 웹: 웹-기획자1)
3. `스펙확정` — 사용자 최종 승인 → **이 단계 이전에는 작업 착수 금지**
4. `작업진행` — 팀 할당, 구현, results.md 작성
5. `완료` — 사용자 보고, 기획자 컨텍스트 업데이트

**기획자 게이트키퍼**
- 앱 이슈: `better-wealth-app/app_planner_context.md` (앱-기획자)
- 웹 이슈: `better-wealth-web/web_planner_context.md` (웹-기획자1)

**현재 이슈 현황**
| 번호 | 이슈명 | Phase | 담당팀 |
|------|--------|-------|--------|
| #943 | 인출설계 설문지 | 완료 | 앱팀 |

## 앱팀 사용자 테스트 워크플로우

> 사용자 테스트 요청 시 **반드시** `persona_spec.md`를 기본 참고 자료로 사용한다.
> 테스트 결과 및 이슈는 `user_test_results.xlsx`에 기록한다.
> 신규 기능/플로우 테스트 시 관련 페르소나를 persona_spec.md에서 선택하고, 필요 시 새 페르소나를 추가하고 변경 이력도 함께 기록한다.

- 페르소나 스펙: `better-wealth-app/persona_spec.md`
- 테스트 결과: `better-wealth-app/user_test_results.xlsx`
- 현재 확정 페르소나: P-A(박은퇴), P-B(이준비), P-C(최자영), P-D(정신입), P-E(한복잡)

## 앱팀 기획-디자인 협업 워크플로우

워크플로우 문서: `better-wealth-app/collaboration_workflow.md`
기획 컨텍스트: `better-wealth-app/app_planner_context.md`

**Figma 플러그인 경로 (이슈별 관리)**
- 플러그인은 이슈 폴더 안에서 관리: `issues/feature/{번호}/figma-plugin/`
- Figma Desktop import: 해당 이슈 폴더의 `figma-plugin/manifest.json` 경로 지정
- #943 인출설계 설문지: `issues/feature/943/figma-plugin/manifest.json`

**새 플러그인 작성 시**
- `better-wealth-app/figma_plugin_design_kit.md` 섹션 4의 공유 라이브러리 코드 복사 → code.js 상단에 붙여넣기
- 이슈별 buildPage* 함수만 추가 작성 → 색상·레이아웃 톤 자동 유지
- DS 컴포넌트 import 사용 금지 (토큰 값만 참조)

**표준 흐름**: 플로우차트 분석(REST API) → 제약사항 코멘트 등록 → 스펙 협의 → 플러그인 스케치 생성 → 검토/수정

**Figma 코멘트 등록**: `POST /v1/files/{fileKey}/comments` with `client_meta.node_id` + `node_offset`
**스케치 실행**: Figma Desktop → mgyo_note → Plugins → Development → Import from manifest
  → manifest 경로: `mgyo_avengers/issues/feature/{번호}/figma-plugin/manifest.json`
  → #943: `mgyo_avengers/issues/feature/943/figma-plugin/manifest.json`

## #943 인출설계 설문지 (앱 #1114) — 플러그인 현황 (2026-03-10)

### 구현된 화면 (P1, P3~P16 — 총 15개, P2 제거됨)
- P1: 설문 시작
- P3: 자산없음 경고
- P4~P13: 설문 입력 스텝 1/8~8/8
- P14~P16: 후처리 (약관동의, 전송 로딩, 전달 완료)

### 주요 제약사항 (Figma 코멘트 기준 — 파일: 0DVyXyoWEbXXNOZF0H92Ic)
- P4 은퇴시기: 55/60/65/70세 **셀렉트박스**, 디폴트 65세
- P4 기대수명: 현재나이+1~100세 **셀렉트박스**, 디폴트 100세
- P4 생활비: 324만원 디폴트 (통계청 2인 가구 기준)
- P6 입력: **연소득**(세전/만원/디폴트없음), 납입종료 readonly(은퇴시기 연동)
- P10 연봉: 계산기 경로면 P6 입력 연소득 자동, 직접입력 경로면 빈값
- P10 서브헤더: "입력한 연봉과 근속연수를 바탕으로 퇴직금을 예상해 드려요."
- P10 근속연수: 현재 재직 중인 회사 기준 만(滿) 연수
- P12: 연소득(세전) **단일 입력** / 소득유형 미표시 / 시작시기=은퇴시기, 종료시기=기대수명 연동(readonly)
- P15 로딩: "회원님의 은퇴 후 30년을 준비하고 있어요" (BIZ 인출전략 목표 30년 반영)
- P16 완료: "인출설계 첫 걸음을 내딛으셨어요" + 임팩트 박스 "은퇴 후 30년, 준비된 인출 전략이 노후를 지켜줍니다."

### 사업팀 예시 문구 반영 (2026-03-10 완료)
P1·P4·P6·P7·P12·P16 서브헤더/헬퍼텍스트 추가·수정 — 상세: `943spec.md` 추가 작업 섹션 참조

### DB형 퇴직금 계산식 (확정)
- 퇴직금 = 일평균임금 × 30일 × 근속연수
- 일평균임금 = (퇴직전연봉/12 × 3) ÷ 90일
- 퇴직전연봉 = 현재연봉 × (1.03)^(퇴직연도-현재연도) (물가상승률 3%)

### 사용자 테스트 (5차 완료 — 이슈 0건)
- 5차 연속 테스트, Major/Minor 이슈 모두 해소

### 플로우차트
- `buildFlowchart()` 함수로 Figma 현재 페이지에 직접 생성
- `figma.createVector()` + `fcDrawEdge()` (createConnector는 FigJam 전용)

## 베러웰스앱 디자인 시스템 핵심

- Figma File Key: wygEtCwUqQJ9p06qsDnBJF
- 765개 컴포넌트, 124개 스타일
- 폰트: Pretendard, Primary: #2E9BFF, Secondary: #2E58FF
- WIP 69% (컴포넌트 페이지 16개 중 11개)
- Figma Personal Access Token: 보안상 저장하지 않음 (필요 시 재발급)

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
- 포트 13550, HAProxy 로드밸런서 -> 워커 13551-13554
- 5개 도메인: wm, fin, ai, kfr, misc
- MySQL 18개 모델 (RD_, BD_ 접두사)
