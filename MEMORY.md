# BetterWealth — 프로젝트 메모리

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**  
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.


## 팀 컨텍스트 복구 방법

> 세션 종료 후 복구 시: `{MGYO_REPO}` 하위의 문서들을 읽고 팀을 조직하고 각 팀원들의 컨텍스트를 복구해
> **필수**: 복구 시작 전 `{MGYO_REPO}/MEMORY.md` 존재 여부를 확인하고 반드시 읽을 것 (이 파일이 Claude 자동 메모리의 정본이며 `.claude/projects/.../memory/MEMORY.md`와 symlink로 연결됨)
> **경로 확인**: 복구 전 사용자에게 MGYO_REPO / FA_REPO / APP_REPO 세 경로를 반드시 확인할 것 (README.md 참조)

### 컨텍스트 저장 위치

```
{MGYO_REPO}/
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
    ├── app_planner_context.md         # 앱-기획자 (플로우, 스펙, 플러그인 수정 이력)
    ├── app_backend_context.md         # 앱-백엔드1 (better-backend 아키텍처, API, DB)
    ├── app_frontend_context.md        # 앱-프론트엔드1 (앱↔백엔드 연동 API, DTO)
    └── app_infra_context.md           # 앱-인프라1 (인프라, Docker, CI/CD, 보안)
issues/
└── feature/                           # 이슈별 작업 문서 (앱/웹 통합)
    └── 943/                           # #943 인출설계 설문지 (완료)
        ├── 943spec.md
        ├── 943results.md
        ├── 943user_test_results.xlsx
        └── figma-plugin/              # manifest.json, code.js, ui.html
```

## 전체 팀 구조 (총 17명)

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
    ├── 앱-디자이너     (Figma 디자인 시스템)
    ├── 앱-백엔드1      (better-backend 아키텍처, API, DB — app_backend_context.md)
    ├── 앱-프론트엔드1  (앱↔백엔드 연동 API, DTO — app_frontend_context.md)
    └── 앱-인프라1      (better-backend 인프라, Docker, CI/CD, 보안 — app_infra_context.md)
```

### 팀 생성 주의사항
- Claude는 Team을 하나만 리드 가능 -> 두 팀을 하나의 팀 내에서 논리적 분리 운영
- 웹팀-리드, 앱팀-리드를 먼저 스폰 후 각 팀원 배치
- 웹팀 팀원: 웹- 프리픽스 / 앱팀 팀원: 앱- 프리픽스

### 작업 원칙
- 한 문서를 수정할 때 연관된 문서도 함께 확인하고 반영한다 (팀은 한 팀 — 정합성 유지)
- 사용자가 일일이 지적하지 않아도 파생 영향 범위를 스스로 파악해서 처리한다

## 베러웰스웹 프로젝트 핵심

- **레포**: {FA_REPO}
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

## #943 인출설계 설문지 (앱 #1114) — 현황 요약

- **상태**: 완료 (사용자 테스트 5차, 이슈 0건)
- **화면**: P1, P3~P13 (12개) + P7 바텀시트 오버레이
- **플로우**: DC=N 7단계 / DC=Y 6단계(P8 스킵), 프로그레스 바 숫자 없음
- **P7 핵심**: 국민연금 수령여부+월수령액 병합, 납입종료=만60세 해당달(birthYear+59)
- **상세**: `issues/feature/943/943spec.md` / `app_planner_context.md` 참조
- **플러그인**: `issues/feature/943/figma-plugin/` — FC_NODES 25개/FC_EDGES 30개/FC_SUBGRAPHS 3개

## 베러웰스앱 디자인 시스템

- Figma Key: `wygEtCwUqQJ9p06qsDnBJF` (수정 금지) — 상세: `better-wealth-app/figma_design_system.md`

## 회의록 관리

> **🔒 총괄(사용자) 전용 — 팀원 접근/스폰 시 포함 금지**

- 저장: `{MGYO_REPO}/meetings/` / 인덱스: `meetings/README.md`
- 파일명: `YYYY-MM-DD_HHMM_주제명.md`
- 트리거: "나 회의했어. 내용정리할래" → Claude가 날짜/시각/참석자/내용 질문 후 정리
