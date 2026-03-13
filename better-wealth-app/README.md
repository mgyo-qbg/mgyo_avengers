# 베러웰스앱(BetterWealth App) — 팀 컨텍스트 복구 가이드

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**  
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.


서비스: 베러웰스 모바일 앱
최종 업데이트: 2026-03-13

## 팀 구성

| 에이전트명 | 역할 | 담당 파일 |
|-----------|------|---------|
| 앱팀-리드 | 팀 코디네이터 | (이 README) |
| 앱-기획자 | 화면 플로우, 제약사항, 입력 스펙 정의 / Figma 코멘트 관리 / 스펙 게이트키퍼 | app_planner_context.md |
| 앱-디자이너 | Figma 디자인 시스템 분석, 플러그인 스케치 생성 | figma_design_system.md |
| 앱-백엔드1 | better-backend 아키텍처, 주요 모듈, API, DB 스키마 파악 | app_backend_context.md |
| 앱-프론트엔드1 | 앱↔백엔드 연동 API 엔드포인트, 인증 흐름, DTO 파악 | app_frontend_context.md |
| 앱-인프라1 | better-backend 인프라, Docker, CI/CD, 보안 이슈 파악 | app_infra_context.md |

## 복구 방법

### 1. 앱팀-리드 스폰

```
이름: 앱팀-리드
역할: general-purpose
지시: {MGYO_REPO}/better-wealth-app/README.md를 읽고
      팀 구조를 파악하라. 팀원 5명(앱-기획자/앱-디자이너/앱-백엔드1/앱-프론트엔드1/앱-인프라1)을 스폰하라.
      파악 완료 후 team-lead에게 보고하고 대기하라.
```

### 2. 팀원 스폰

| 에이전트명 | 스폰 프롬프트 |
|-----------|------------|
| 앱-기획자 | 아래 두 파일을 순서대로 읽고 내용을 완전히 숙지하라: 1) {MGYO_REPO}/better-wealth-app/app_planner_context.md 2) {MGYO_REPO}/better-wealth-app/collaboration_workflow.md / 너의 역할은 베러웰스 모바일 앱의 화면 플로우, 제약사항, 입력 스펙을 정의하고 Figma 코멘트를 관리하는 기획자다. Figma 기획 작업 파일 Key: AioSbUjrVBRnqTpFsltOC5 (mgyo_note) / 숙지 완료 후 team-lead에게 "앱-기획자 컨텍스트 복구 완료." 라고 보고하고 대기하라. |
| 앱-디자이너 | 아래 두 파일을 순서대로 읽고 내용을 완전히 숙지하라: 1) {MGYO_REPO}/better-wealth-app/figma_design_system.md 2) {MGYO_REPO}/better-wealth-app/collaboration_workflow.md / 너의 역할은 베러웰스 모바일 앱의 Figma 디자인 시스템을 분석하고 플러그인을 통해 스케치를 생성하는 디자이너다. DS 파일 Key: wygEtCwUqQJ9p06qsDnBJF (수정 금지) / 숙지 완료 후 team-lead에게 "앱-디자이너 컨텍스트 복구 완료." 라고 보고하고 대기하라. |
| 앱-백엔드1 | {MGYO_REPO}/better-wealth-app/app_backend_context.md를 읽고 내용을 완전히 숙지하라. / 너의 역할은 베러웰스 앱 백엔드 레포(better-backend, {APP_REPO})의 아키텍처, 주요 모듈, API 엔드포인트, DB 스키마를 담당하는 백엔드 개발자다. / 숙지 완료 후 team-lead에게 "앱-백엔드1 컨텍스트 복구 완료." 라고 보고하고 대기하라. |
| 앱-프론트엔드1 | {MGYO_REPO}/better-wealth-app/app_frontend_context.md를 읽고 내용을 완전히 숙지하라. / 너의 역할은 베러웰스 모바일 앱과 better-backend 간의 연동 API, 인증 흐름, DTO를 담당하는 프론트엔드 개발자다. / 숙지 완료 후 team-lead에게 "앱-프론트엔드1 컨텍스트 복구 완료." 라고 보고하고 대기하라. |
| 앱-인프라1 | {MGYO_REPO}/better-wealth-app/app_infra_context.md를 읽고 내용을 완전히 숙지하라. / 너의 역할은 better-backend 레포의 인프라, Docker, CI/CD, 환경변수 관리, 보안 이슈를 담당하는 인프라 엔지니어다. / 숙지 완료 후 team-lead에게 "앱-인프라1 컨텍스트 복구 완료." 라고 보고하고 대기하라. |

## 컨텍스트 파일 목록

| 파일 | 설명 |
|------|------|
| MEMORY.md | 앱팀 프로젝트 메모리 (빠른 참조용 요약) |
| app_planner_context.md | 앱-기획자 작업 이력 (플로우, 제약사항, Figma 코멘트 ID) |
| figma_design_system.md | 앱-디자이너 디자인 시스템 분석 결과 |
| collaboration_workflow.md | 기획-디자인 협업 표준 워크플로우 (5단계) |
| plugin_guidelines.md | Figma 플러그인 개발 핵심 규칙 |
| figma_plugin_design_kit.md | 플러그인 공유 라이브러리 (색상토큰·컴포넌트 함수·레이아웃 상수) — 새 플러그인 작성 시 필독 |
| persona_spec.md | 사용자 테스트 페르소나 스펙 (P-A~P-E, 커버리지 매트릭스) |
| user_test_results.xlsx | 사용자 테스트 결과 (차수별 이슈, 페르소나별 기록) |
| app_backend_context.md | 앱-백엔드1 컨텍스트 (better-backend 아키텍처, API, DB, 도메인) |
| app_frontend_context.md | 앱-프론트엔드1 컨텍스트 (앱↔백엔드 연동, 인증 흐름, DTO) |
| app_infra_context.md | 앱-인프라1 컨텍스트 (Docker, CI/CD, 보안, 환경변수) |

## Figma 플러그인

플러그인은 이슈 폴더 안에서 이슈별로 관리한다.

```
issues/feature/{이슈번호}/figma-plugin/
├── manifest.json
├── code.js
└── ui.html
```

Figma Desktop에서 플러그인 import: Plugins → Development → Import from manifest
→ 해당 이슈 폴더의 `figma-plugin/manifest.json` 경로 지정

**현재 등록된 플러그인**
- **#943 인출설계 설문지**: `issues/feature/943/figma-plugin/manifest.json`

## Figma 정보

- **디자인 시스템 파일**: [베러웰스앱] NEW 디자인 시스템 (Key: wygEtCwUqQJ9p06qsDnBJF) — 수정 금지
- **기획 작업 파일**: mgyo_note (Key: AioSbUjrVBRnqTpFsltOC5)

> Figma Personal Access Token은 보안상 저장하지 않음. 필요 시 재발급.
