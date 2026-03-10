# BetterWealth App — 프로젝트 메모리

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**  
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.


## 컨텍스트 저장 위치

상세 분석 파일: `{MGYO_REPO}/better-wealth-app/`
- README.md, app_planner_context.md, figma_design_system.md 등

## 서비스 개요

**BetterWealth App**: 고객용 모바일 앱 (React Native)
- 핵심: 마이데이터 연동, 은퇴설계, 인출설계, 투자설계
- FA 플랫폼(better-wealth-fa)과 연동

## Figma 파일 정보

| 파일 | Key | 용도 |
|------|-----|------|
| 디자인 시스템 | wygEtCwUqQJ9p06qsDnBJF | DS 컴포넌트/스타일 (수정 금지) |
| 기획 캔버스 | AioSbUjrVBRnqTpFsltOC5 | mgyo_note — 플로우차트, 스케치 대상 |
| 실제 디자인 파일 | 0DVyXyoWEbXXNOZF0H92Ic | 플로우차트 및 제약사항 기준 |

- Figma Personal Access Token: 보안상 저장하지 않음 (필요 시 재발급)

## 디자인 시스템 핵심

- 765개 컴포넌트, 124개 스타일 (FILL 86, TEXT 29, EFFECT 7, GRID 2)
- 폰트: Pretendard (Inter fallback), Primary: #2E9BFF, Secondary: #2E58FF
- WIP 69% (16개 페이지 중 11개 완료)

## 팀 컨텍스트

| 에이전트명 | 역할 | 담당 파일 |
|-----------|------|---------|
| 앱-기획자 | 화면 플로우, 제약사항 / 스펙 게이트키퍼 / 교차 이슈 정합성 검증 | app_planner_context.md |
| 앱-디자이너 | Figma 디자인 시스템 분석, 플러그인 스케치 생성 | figma_design_system.md |

## 주요 참조 파일

| 파일 | 설명 |
|------|------|
| `collaboration_workflow.md` | 기획-디자인 협업 5단계 표준 워크플로우 |
| `figma_plugin_design_kit.md` | 플러그인 공유 라이브러리 (새 플러그인 작성 시 필독) |
| `plugin_guidelines.md` | Figma Plugin API 핵심 규칙 |
| `persona_spec.md` | 사용자 테스트 페르소나 스펙 (P-A~P-E) |
| `figma_design_system.md` | DS 파일 분석 결과 (컬러, 컴포넌트, 타이포) |

## 이슈 관리

이슈별 작업 문서: `issues/feature/{번호}/` (앱/웹 통합)
- `{번호}spec.md`, `{번호}results.md`, `{번호}user_test_results.xlsx`, `figma-plugin/`

현재 이슈: `issues/feature/943/` — #943 인출설계 설문지 (완료)
