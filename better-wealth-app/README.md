# 베러웰스앱(BetterWealth App) — 팀 컨텍스트 복구 가이드

서비스: 베러웰스 모바일 앱
최종 업데이트: 2026-03-09

## 팀 구성

| 에이전트명 | 역할 | 담당 파일 |
|-----------|------|---------|
| 앱팀-리드 | 팀 코디네이터 | (이 README) |
| 앱-기획자 | 화면 플로우, 제약사항, 입력 스펙 정의 / Figma 코멘트 관리 | app_planner_context.md |
| 앱-디자이너 | Figma 디자인 시스템 분석, 플러그인 스케치 생성 | figma_design_system.md |

## 복구 방법

### 1. 앱팀-리드 스폰

```
이름: 앱팀-리드
역할: general-purpose
지시: /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-app/README.md를 읽고
      팀 구조를 파악하라. 팀원 이름은 앱- 프리픽스로 시작한다.
      파악 완료 후 team-lead에게 보고하고 대기하라.
```

### 2. 팀원 스폰

| 에이전트명 | 담당 파일 경로 |
|-----------|-------------|
| 앱-기획자 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-app/app_planner_context.md |
| 앱-디자이너 | /Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-app/figma_design_system.md |

스폰 후 collaboration_workflow.md를 읽어 협업 방식을 숙지하도록 지시할 것.

## 컨텍스트 파일 목록

| 파일 | 설명 |
|------|------|
| app_planner_context.md | 앱-기획자 작업 이력 (플로우, 제약사항, Figma 코멘트 ID) |
| figma_design_system.md | 앱-디자이너 디자인 시스템 분석 결과 |
| collaboration_workflow.md | 기획-디자인 협업 표준 워크플로우 (5단계) |
| plugin_guidelines.md | Figma 플러그인 개발 핵심 규칙 |
| home_screen_layout_spec.md | 홈 화면 레이아웃 스펙 |
| persona_spec.md | 사용자 테스트 페르소나 스펙 (P-A~P-E, 커버리지 매트릭스) |
| user_test_results.xlsx | 사용자 테스트 결과 (차수별 이슈, 페르소나별 기록) |

## Figma 플러그인

플러그인은 이 레포에서 git으로 관리한다.

```
figma-plugin/
├── home/    # 홈 화면 생성 플러그인 (구버전)
└── survey/  # #1114 인출설계 설문지 플러그인 (현재 사용)
```

Figma Desktop에서 플러그인 import: Plugins → Development → Import from manifest
- **인출설계 설문지**: `figma-plugin/survey/manifest.json`
- **홈 화면**: `figma-plugin/home/manifest.json`

> Figma Desktop에서 이 레포 경로를 직접 참조하도록 import할 것.
> 구버전 경로(`/Users/imsi/Desktop/betterwealth-figma-plugin/`)는 더 이상 사용하지 않음.

## Figma 정보

- **디자인 시스템 파일**: [베러웰스앱] NEW 디자인 시스템 (Key: wygEtCwUqQJ9p06qsDnBJF) — 수정 금지
- **기획 작업 파일**: mgyo_note (Key: AioSbUjrVBRnqTpFsltOC5)

> Figma Personal Access Token은 보안상 저장하지 않음. 필요 시 재발급.
