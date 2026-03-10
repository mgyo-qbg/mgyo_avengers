# mgyo_avengers 시작 가이드

최종 업데이트: 2026-03-10
대상: 이 레포를 처음 쓰는 사람, 또는 새 Claude 세션을 열었을 때 참조하는 가이드

> **이 문서 한 장으로 처음부터 끝까지 업무할 수 있도록 작성했습니다.**

---

## 1. 이 레포는 뭔가요?

### 한 줄 요약

> **mgyo_avengers는 코드 레포가 아닙니다. Claude Code 멀티에이전트 팀의 "영구 기억 장치"입니다.**

### 왜 필요한가요?

Claude Code 세션은 컨텍스트 윈도우가 유한합니다. 세션을 닫으면 대화 내용, 결정 사항, 팀 구성, 이슈 맥락이 **모두 사라집니다.** 다음 세션을 열면 Claude는 처음 만나는 사람처럼 아무것도 모릅니다.

이 레포는 그 문제를 해결합니다.

```
세션 종료 → 컨텍스트 소실
     ↑            ↓
     └── 이 레포에서 복구 ←──
```

세션을 열 때마다 이 레포를 읽으면 팀 구조, 이슈 진행 상황, UX 원칙, 기술 스택 등을 **92% 이상 정확하게** 복구할 수 있습니다.

### 실제 코드 레포와의 관계

| 레포 | 역할 | 경로 |
|------|------|------|
| `mgyo_avengers` | 팀 컨텍스트·이슈 관리 (이 레포) | `/Users/imsi/Desktop/qbg/repo/mgyo_avengers` |
| `better-wealth-fa` | 실제 서비스 코드 (웹 FA 플랫폼) | `/Users/imsi/Desktop/qbg/repo/better-wealth-fa` |

두 레포는 **Claude의 자동 메모리(MEMORY.md)를 공유**합니다. 어느 레포에서 Claude를 열더라도 동일한 컨텍스트를 읽습니다.

---

## 2. 사전 준비 (최초 1회)

### 2-1. Claude Code 설치

```bash
npm install -g @anthropic-ai/claude-code
# 또는 공식 설치 방법: https://claude.ai/code
```

### 2-2. Agent Teams 기능 활성화

`~/.claude/settings.json`에 아래 항목을 추가합니다.

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

> Agent Teams 없이는 멀티에이전트 팀을 스폰할 수 없습니다. 이 설정이 없으면 Claude 1명만 대화 가능합니다.

### 2-3. MEMORY.md symlink 설정 (핵심)

Claude Code가 세션을 열 때 `~/.claude/projects/{경로}/memory/MEMORY.md`를 자동으로 읽습니다. 이 파일이 `mgyo_avengers/MEMORY.md`를 가리키도록 symlink를 설정합니다.

```bash
# mgyo_avengers 디렉토리에서 열 때
mkdir -p ~/.claude/projects/-Users-imsi-Desktop-qbg-repo-mgyo-avengers/memory
ln -sf /Users/imsi/Desktop/qbg/repo/mgyo_avengers/MEMORY.md \
       ~/.claude/projects/-Users-imsi-Desktop-qbg-repo-mgyo-avengers/memory/MEMORY.md

# better-wealth-fa 디렉토리에서 열 때도 동일한 MEMORY.md 공유
mkdir -p ~/.claude/projects/-Users-imsi-Desktop-qbg-repo-better-wealth-fa/memory
ln -sf /Users/imsi/Desktop/qbg/repo/mgyo_avengers/MEMORY.md \
       ~/.claude/projects/-Users-imsi-Desktop-qbg-repo-better-wealth-fa/memory/MEMORY.md
```

symlink 확인:
```bash
ls -la ~/.claude/projects/-Users-imsi-Desktop-qbg-repo-mgyo-avengers/memory/MEMORY.md
# 결과: MEMORY.md -> /Users/imsi/Desktop/qbg/repo/mgyo_avengers/MEMORY.md
```

### 2-4. 권장 플러그인 (선택사항)

```bash
# 커밋 자동화
claude plugins install commit-commands

# 코드 심볼 분석 (serena)
claude plugins install serena
```

### 2-5. Figma Desktop (앱팀 작업 시 필요)

앱팀 Figma 플러그인 스케치를 실행하려면 Figma Desktop이 필요합니다. 웹 브라우저 Figma에서는 플러그인 개발 모드(`Import from manifest`)를 지원하지 않습니다.

---

## 3. 폴더 구조 한눈에 보기

```
mgyo_avengers/
│
├── startAvengersWithMingyo.md    ← 지금 읽고 있는 이 파일 (사람이 읽는 가이드)
├── README.md                     ← Claude가 읽는 복구 가이드 (팀 스폰 지시)
├── MEMORY.md                     ← Claude 자동 메모리 정본 (symlink 대상) ★
│
├── better-wealth-web/            ← 웹팀 (FA 플랫폼) 컨텍스트
│   ├── README.md                 ← 웹팀 복구 가이드 (팀원 목록, 스폰 순서)
│   ├── MEMORY.md                 ← 웹팀 빠른 참조 메모리
│   ├── web_planner_context.md    ← 웹-기획자1 게이트키퍼 컨텍스트 ★
│   ├── 01_service_overview.md    ← 웹-기획자1 담당 (서비스 개요)
│   ├── 02_ux_screens.md          ← 웹-기획자2 담당 (80+ 화면 분석)
│   ├── 03_frontend_architecture.md  ← 웹-프론트엔드1 담당
│   ├── 04_frontend_quality.md    ← 웹-프론트엔드2 담당
│   ├── 05_backend_nestjs.md      ← 웹-백엔드1 담당
│   ├── 06_backend_fastapi.md     ← 웹-백엔드2 담당
│   ├── 07_infrastructure.md      ← 웹-인프라1 담당
│   ├── 08_code_review_typescript.md  ← 웹-코드리뷰어1 담당
│   ├── 09_code_review_python_infra.md  ← 웹-코드리뷰어2 담당
│   └── 10_legal_compliance.md    ← 웹-법률전문가1 담당
│
├── better-wealth-app/            ← 앱팀 (모바일 앱) 컨텍스트
│   ├── README.md                 ← 앱팀 복구 가이드
│   ├── MEMORY.md                 ← 앱팀 빠른 참조 메모리
│   ├── app_planner_context.md    ← 앱-기획자 게이트키퍼 컨텍스트 ★
│   ├── figma_design_system.md    ← 앱-디자이너 담당 (DS 765개 컴포넌트 분석)
│   ├── collaboration_workflow.md ← 기획-디자인 협업 5단계 표준 프로세스
│   ├── plugin_guidelines.md      ← Figma 플러그인 개발 규칙
│   ├── figma_plugin_design_kit.md ← 플러그인 공유 라이브러리 코드 ★
│   ├── persona_spec.md           ← 사용자 테스트 페르소나 (P-A~P-E)
│   └── user_test_results.xlsx    ← 사용자 테스트 결과 (이슈별 이관됨)
│
└── issues/                       ← 이슈별 작업 문서 (앱/웹 통합)
    ├── WORKFLOW.md               ← 이슈 라이프사이클 정의 ★
    └── feature/
        └── {이슈번호}/
            ├── {번호}spec.md     ← 사용자 소통 파일 (유일) ★★★
            ├── {번호}results.md  ← 결과 문서 (Claude 작성)
            ├── {번호}user_test_results.xlsx  ← 테스트 결과
            └── figma-plugin/     ← 앱팀 Figma 플러그인 코드
```

> **★★★ `{번호}spec.md`가 유일하게 사용자가 직접 소통하고 수정하는 파일입니다.**
> 다른 모든 파일은 Claude가 관리합니다. 사용자가 직접 수정하면 정합성이 깨질 수 있습니다.

---

## 4. 팀 구조

총 **13명**이 Claude 에이전트로 운영됩니다. Claude 총괄(team-lead)이 두 팀을 하나의 팀 안에서 논리적으로 분리해 운영합니다.

```
Claude (총괄 / team-lead)
│
├── 웹팀-리드
│   ├── 웹-기획자1      → 서비스 개요 + 스펙 게이트키퍼 (web_planner_context.md 관리)
│   ├── 웹-기획자2      → UI/UX 화면 구성
│   ├── 웹-프론트엔드1  → FE 아키텍처
│   ├── 웹-프론트엔드2  → FE 품질/테스트
│   ├── 웹-백엔드1      → NestJS 백엔드
│   ├── 웹-백엔드2      → FastAPI Nudge 서비스
│   ├── 웹-인프라1      → CI/CD, Docker, 보안
│   ├── 웹-코드리뷰어1  → TypeScript 품질
│   ├── 웹-코드리뷰어2  → Python/인프라 품질
│   └── 웹-법률전문가1  → 개인정보, 금융규제
│
└── 앱팀-리드
    ├── 앱-기획자       → 화면 플로우/제약사항 + 스펙 게이트키퍼 (app_planner_context.md 관리)
    └── 앱-디자이너     → Figma DS 분석, 플러그인 스케치 생성
```

**팀 생성 시 주의사항:**
- Claude는 Team을 하나만 리드할 수 있습니다. 웹팀과 앱팀을 별도 Team으로 만들면 리드 불가.
- 웹팀-리드, 앱팀-리드를 먼저 스폰한 다음 각 팀원을 배치합니다.
- 웹팀 에이전트명은 반드시 `웹-` 프리픽스, 앱팀은 `앱-` 프리픽스로 시작합니다.

---

## 5. 세션 시작하기 (컨텍스트 복구)

### Step 1: Claude Code 실행

두 방법 중 하나를 선택합니다.

```bash
# 방법 A: mgyo_avengers에서 직접 열기
cd /Users/imsi/Desktop/qbg/repo/mgyo_avengers
claude

# 방법 B: better-wealth-fa (코드 작업)에서 열기
cd /Users/imsi/Desktop/qbg/repo/better-wealth-fa
claude
```

어느 방법이든 symlink 설정이 올바르면 MEMORY.md가 자동으로 로드됩니다.

### Step 2: 복구 명령어 입력

세션이 열리면 아래 명령어를 입력합니다.

```
/Users/imsi/Desktop/qbg/repo/mgyo_avengers 하위의 문서들을 읽고 팀을 조직하고 각 팀원들의 컨텍스트를 복구해
```

> 이 명령어는 `README.md`에도 저장되어 있습니다.

### Step 3: Claude가 하는 일

Claude는 다음 순서로 문서를 읽습니다.

```
1. README.md          → 전체 팀 구조 파악
2. MEMORY.md          → 기술 스택, 이슈 현황, 핵심 컨텍스트 로드
3. better-wealth-web/README.md  → 웹팀 구조 파악 → 팀원 스폰
4. better-wealth-app/README.md  → 앱팀 구조 파악 → 팀원 스폰
5. issues/feature/{진행 중 번호}/  → 현재 이슈 컨텍스트 복구
```

각 팀원은 자신의 담당 파일을 읽고 컨텍스트를 복구한 뒤 대기합니다.

### Step 4: 복구 완료 확인

복구가 끝나면 아래 명령으로 상태를 확인합니다.

```
우리팀 워크플로우 보고해봐
```

정상이면 팀 구조, 이슈 현황, 담당 파일 목록 등이 출력됩니다.

### 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| MEMORY.md가 세션 컨텍스트에 없음 | symlink 미설정 또는 경로 오류 | 2-3절 symlink 설정 재확인 |
| 팀 스폰이 안 됨 | Agent Teams 미활성화 | `~/.claude/settings.json`에 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: "1"` 추가 |
| 팀원이 1명씩만 스폰됨 | Team 기능이 아닌 단순 Agent로 생성 | `/team` 명령 또는 TeamCreate 도구 사용 여부 확인 |
| 복구 후 컨텍스트가 부정확함 | 파일 수정 후 커밋 누락 | `git log` 확인, 미커밋 변경사항 확인 |

---

## 6. 이슈 워크플로우 (일하는 법)

> 상세 원문: `issues/WORKFLOW.md`

### 6-1. 핵심 원칙

**`{번호}spec.md`는 사용자가 직접 소통하거나 수정하는 유일한 파일입니다.**
나머지 모든 파일은 spec.md로부터 파생되거나, 결과물이거나, 컨텍스트/도구 파일입니다.

### 6-2. 5 Phase 라이프사이클

```
Phase 1. 요구사항 수집
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
사용자가 요구사항을 자유롭게 설명합니다 (부분적이어도 됩니다).
Claude가 불명확한 부분을 질문합니다.
이 대화를 반복하며 spec.md 초안을 작성합니다.

시작 방법: "#{번호} 이슈야. (요구사항 설명)"
예시: "#1050 이슈야. 앱에서 투자 포트폴리오를 입력하는 설문 화면이 필요해."


Phase 2. 스펙 초안
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Claude가 spec.md 초안을 완성하고 사용자에게 검토를 요청합니다.

이 시점에 [기획자 게이트 검토]가 자동으로 진행됩니다:
  - 앱 이슈: 앱-기획자가 app_planner_context.md를 참조해 검증
  - 웹 이슈: 웹-기획자1이 web_planner_context.md를 참조해 검증

기획자가 검증하는 항목:
  ✓ 기존 구현 화면/기능과 충돌하는지
  ✓ 동시 진행 중인 다른 이슈와 요건이 상충하는지
  ✓ 확정된 UX/아키텍처 원칙을 위반하는지

이슈 발견 시: 사용자에게 보고 후 spec.md 수정


Phase 3. 스펙 확정  ← ⚠️ 이 단계 이전에는 절대로 작업에 착수하지 않습니다
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
사용자가 최종 승인합니다.
spec.md 상태 → "스펙확정"으로 변경됩니다.
MEMORY.md의 "현재 이슈 현황"이 업데이트됩니다.

확정 방법: "spec 확정이야" 또는 "스펙 확정해"


Phase 4. 작업 진행
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Claude가 담당팀에 작업을 할당합니다.
구현 완료 후 results.md를 작성합니다.
필요 시 사용자 테스트를 진행하고 user_test_results.xlsx에 기록합니다.


Phase 5. 완료
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
사용자에게 결과를 보고합니다.
기획자 컨텍스트를 업데이트합니다:
  - "제품 현황 - 구현 완료"에 새 기능 추가
  - "확정된 원칙"에 이슈에서 도출된 새 원칙 추가
MEMORY.md 이슈 현황 → 완료 처리됩니다.
```

### 6-3. 이슈 폴더 구조

새 이슈를 시작하면 Claude가 자동으로 아래 폴더 구조를 만듭니다.

```
issues/feature/{번호}/
├── {번호}spec.md                ← ★ 사용자 소통 파일 (유일)
├── {번호}results.md             ← 구현 결과 문서
├── {번호}user_test_results.xlsx ← 사용자 테스트 결과
└── figma-plugin/                ← 앱팀 이슈에만 생성
    ├── manifest.json
    ├── code.js
    └── ui.html
```

### 6-4. spec.md 표준 템플릿

```markdown
# #{번호} {이슈명} — 스펙

상태: 요구사항수집    ← 요구사항수집 | 스펙초안 | 스펙확정 | 작업진행 | 완료
담당팀: 앱팀          ← 앱팀 | 웹팀 | 앱+웹
작성일: YYYY-MM-DD
최종 업데이트: YYYY-MM-DD

---

## 이슈 개요

목적:
관련 파일:

---

## 요구사항

(대화를 통해 채워짐)

---

## 플로우 / 화면 목록

(확정되면 텍스트 + Mermaid로 작성)

---

## 미확인 / 미합의 사항

| 질문 | 답변 | 상태 |
|------|------|------|
|      |      | 미확인 / 확정 |

---

## 승인 이력

| 날짜 | Phase 전환 | 내용 |
|------|-----------|------|
```

### 6-5. 파일 역할 분류표

| 분류 | 파일 | 수정 주체 |
|------|------|---------|
| **사용자 소통** | `{번호}spec.md` | 사용자 ↔ Claude |
| 파생/결과 | `{번호}results.md` | Claude (자동) |
| 파생/결과 | `{번호}user_test_results.xlsx` | Claude (자동) |
| 파생/결과 | `figma-plugin/` | Claude (자동) |
| 컨텍스트 | `app_planner_context.md` | 앱-기획자 (Phase 5마다) |
| 컨텍스트 | `web_planner_context.md` | 웹-기획자1 (Phase 5마다) |
| 컨텍스트 | `MEMORY.md` | Claude (자동) |
| 도구 | `figma_plugin_design_kit.md` | Claude (라이브러리 갱신 시) |
| 도구 | `collaboration_workflow.md` | Claude (프로세스 변경 시) |
| 레퍼런스 | `persona_spec.md` | Claude (페르소나 추가 시) |

---

## 7. 앱팀 전용 워크플로우

> 상세 원문: `better-wealth-app/collaboration_workflow.md`

### 7-1. 기획-디자인 협업 5단계

```
1단계. 플로우차트 분석
   Figma REST API로 실제 디자인 파일(0DVyXyoWEbXXNOZF0H92Ic)에서
   화면 흐름과 노드 ID를 추출합니다.
   GET /v1/files/{fileKey}/nodes?ids={nodeIds}

2단계. 제약사항 코멘트 등록
   Figma 코멘트 API로 각 화면의 제약사항을 기록합니다.
   POST /v1/files/{fileKey}/comments
   Body: { message, client_meta: { node_id, node_offset } }

3단계. 스펙 협의
   앱-기획자가 화면별 컴포넌트 타입, 입력 스펙, CTA, 스텝 인디케이터를 확정합니다.
   spec.md의 "플로우/화면 목록" 섹션이 채워집니다.

4단계. 플러그인 스케치 생성
   앱-디자이너가 Figma 플러그인 코드(code.js)를 작성합니다.
   figma_plugin_design_kit.md 섹션 4의 공유 라이브러리를 code.js 상단에 복사하고,
   이슈별 buildPage* 함수만 추가합니다.

5단계. 검토 및 수정
   Figma Desktop에서 플러그인을 실행해 스케치를 확인하고 필요 시 수정합니다.
```

### 7-2. Figma 플러그인 만들기

#### 새 이슈 플러그인 작성 순서

1. `issues/feature/{번호}/figma-plugin/` 폴더 생성
2. `better-wealth-app/figma_plugin_design_kit.md` 섹션 4 전체를 `code.js` 상단에 복사
3. 이슈별 `buildPage*` 함수만 추가 작성
4. `ui.html` 작성 (기존 이슈 figma-plugin/ 폴더 참고)
5. `manifest.json` 작성 (플러그인마다 고유 id 사용)

#### 공유 라이브러리 핵심 규칙

```
✅ 해야 하는 것
- DS 파일(wygEtCwUqQJ9p06qsDnBJF)의 색상 토큰 값만 참조
- figma_plugin_design_kit.md의 컴포넌트 함수(buildRoot, buildSectionHeader 등) 사용
- 이슈별 buildPage* 함수만 추가

❌ 하면 안 되는 것
- importComponentByKeyAsync로 DS 컴포넌트 직접 가져오기 (플러그인 취약화)
- DS 파일 수정 (절대 금지)
- C.text700 같이 정의되지 않은 색상 토큰 사용
  → 사용 가능한 텍스트 색상: text300, text500, text800, text900만 존재
```

#### Figma 파일 정보

| 파일 | Key | 용도 |
|------|-----|------|
| 디자인 시스템 | `wygEtCwUqQJ9p06qsDnBJF` | DS 컴포넌트/스타일 (수정 금지) |
| 기획 작업 파일 | `AioSbUjrVBRnqTpFsltOC5` | mgyo_note — 플러그인 스케치 생성 대상 |
| 실제 디자인 파일 | `0DVyXyoWEbXXNOZF0H92Ic` | 플로우차트 및 제약사항 기준 |

> Figma Personal Access Token은 보안상 저장하지 않습니다. 필요 시 Figma → Settings → Personal access tokens에서 재발급.

#### 플러그인 실행 방법

```
1. Figma Desktop 실행
2. mgyo_note 파일 열기
3. Plugins → Development → Import plugin from manifest
4. 경로 선택: issues/feature/{번호}/figma-plugin/manifest.json
5. Plugins → Development → {플러그인명} 실행
```

#### 현재 등록된 플러그인

| 이슈 | 경로 |
|------|------|
| #943 인출설계 설문지 | `issues/feature/943/figma-plugin/manifest.json` |

### 7-3. 사용자 테스트

테스트는 `better-wealth-app/persona_spec.md`에 정의된 페르소나를 기반으로 진행합니다.

**현재 확정 페르소나 (P-A~P-E)**

| ID | 이름 | 특징 |
|----|------|------|
| P-A | 박은퇴 | 58세, 대기업 28년차, 마이데이터 자산 보유, DC 있음 |
| P-B | 이준비 | 45세, 중견기업, 준비형 |
| P-C | 최자영 | 42세, 자영업자 |
| P-D | 정신입 | 32세, 사회초년생 |
| P-E | 한복잡 | 55세, 복합 자산 보유 |

테스트 결과는 `issues/feature/{번호}/{번호}user_test_results.xlsx`에 기록합니다.

---

## 8. 웹팀 전용 정보

### 8-1. 코드 레포

```
경로: /Users/imsi/Desktop/qbg/repo/better-wealth-fa
구조: pnpm monorepo (shared-workspace-lockfile=false — 각 앱 독립 lockfile)
```

### 8-2. Git 컨벤션

```bash
# 커밋 메시지
[fa] #{이슈번호} {커밋 메시지}
예시: [fa] #1050 투자 포트폴리오 입력 설문 API 추가

# 브랜치 패턴
feature/#{번호}-{설명}
hotfix/{설명}
```

### 8-3. 로컬 실행 방법

```bash
cd /Users/imsi/Desktop/qbg/repo/better-wealth-fa

# 필요 Docker 컨테이너: MySQL(3406), Redis(6379), MongoDB(27017)
# MongoDB는 db-mongo 컨테이너 사용 (다른 레포에서 공유)

# .env.local 수정 필요
# MONGO_URL: mongodb://mongodb:... → mongodb://localhost:...

# 최초 1회: Prisma 클라이언트 생성
pnpm prisma:local:generate

# 실행
pnpm start:local
```

### 8-4. 즉각 조치 필요 이슈 (Critical 6건)

> 이 이슈들은 이미 파악됨. 새 이슈 작업 시 이 항목들에 영향을 주는지 확인할 것.

| # | 이슈 | 위치 |
|---|------|------|
| 1 | `.env` Git 노출 (JWT secret, DB 비밀번호, API 키) | `environments/.env.*`, `apps/be-fastapi/.env.*` |
| 2 | CustomerFamily 성명/생년월일 미암호화 | `prisma/schema.prisma` |
| 3 | TestCustomer CI/전화번호 평문 저장 | `prisma/schema.prisma` |
| 4 | CORS 전체 허용 (NestJS + FastAPI) | `main.ts`, `main.py` |
| 5 | 비밀번호 재설정 Guard 미적용 | `advisor-user.controller.ts:105-131` |
| 6 | FastAPI pickle RCE 취약점 | `fncache.py` |

### 8-5. 기술 스택 요약

| 앱 | 기술 | 포트 |
|----|------|------|
| NestJS (be-nest) | NestJS 10, Prisma 5 (MySQL 69모델), Mongoose 9, Redis, Bull | famain 13700, fabatch 23400 |
| React (fe-react-app) | React 18, TypeScript 5, Vite 4 (SWC), TailwindCSS, Redux Toolkit, React Query v4 | - |
| FastAPI (be-fastapi) | Python 3.11, FastAPI 0.104, Pydantic v2, Prisma Python, HAProxy LB | 13550 (워커: 13551~13554) |

---

## 9. 자주 쓰는 명령어 모음

### 세션 복구

```
/Users/imsi/Desktop/qbg/repo/mgyo_avengers 하위의 문서들을 읽고 팀을 조직하고 각 팀원들의 컨텍스트를 복구해
```

### 현황 확인

```
우리팀 워크플로우 보고해봐
현재 이슈 현황 알려줘
```

### 새 이슈 시작

```
#{번호} 이슈야. (요구사항 설명)
예시: "#1050 이슈야. 투자설계 설문 화면이 필요해. 앱 이슈야."
```

### 이슈 진행 중

```
스펙 확정이야          → Phase 3로 전환, 작업 착수
사용자 테스트 해봐     → persona_spec.md 기반 테스트 진행
커밋해줘 / /commit    → 현재 변경사항 커밋
```

### 작업 완료 후

```
작업 정리해서 컨텍스트 반영하고 커밋해봐
```

---

## 10. 주의사항 & FAQ

**Q: spec.md 외 파일을 직접 수정해도 되나요?**
A: 안 됩니다. `app_planner_context.md`, `web_planner_context.md`, `MEMORY.md` 등은 Claude가 이슈 완료 시 자동 업데이트합니다. 사용자가 직접 수정하면 Claude의 현황 인식과 실제 파일 내용이 어긋날 수 있습니다.

**Q: 세션이 길어지면 어떻게 되나요?**
A: Claude Code는 컨텍스트 윈도우가 가득 차면 자동으로 이전 대화를 압축합니다. 중간에 컨텍스트가 유실될 수 있으므로, 작업 완료 시마다 `"작업 정리해서 컨텍스트 반영하고 커밋해봐"`를 실행하는 것이 좋습니다.

**Q: 여러 이슈를 동시에 진행할 수 있나요?**
A: 가능합니다. 단, 기획자 게이트키퍼(앱-기획자 또는 웹-기획자1)가 Phase 2에서 교차 충돌을 반드시 검증합니다. `app_planner_context.md`의 "교차 이슈 충돌 이력" 섹션을 확인하세요.

**Q: Figma Personal Access Token은 어디 있나요?**
A: 보안상 어디에도 저장하지 않습니다. 필요 시 Figma → 프로필 → Settings → Personal access tokens에서 재발급합니다.

**Q: `.DS_Store`가 git에 계속 잡히는데요?**
A: 현재 `.gitignore`에 포함되어 있지 않습니다. 개인 설정으로 처리하거나, `.gitignore`에 직접 추가하세요.

**Q: 새 팀원(새 에이전트)이 필요하면 어떻게 하나요?**
A: Claude에게 "웹팀에 ~~전문가가 필요해"라고 말하면 됩니다. Claude가 적합한 역할을 정의하고 담당 파일을 생성 후 팀에 편입합니다. `better-wealth-web/README.md` 또는 `better-wealth-app/README.md`에 팀원 정보를 추가합니다.

---

## 11. 참고 파일 색인

| 파일 경로 | 설명 | 관리 주체 |
|----------|------|---------|
| `startAvengersWithMingyo.md` | 이 가이드 | Claude |
| `README.md` | Claude용 복구 가이드 (팀 스폰 지시) | Claude |
| `MEMORY.md` | Claude 자동 메모리 정본 | Claude |
| `issues/WORKFLOW.md` | 이슈 5 Phase 라이프사이클 정의 | Claude |
| `better-wealth-web/README.md` | 웹팀 복구 가이드 | Claude |
| `better-wealth-web/MEMORY.md` | 웹팀 빠른 참조 메모리 | Claude |
| `better-wealth-web/web_planner_context.md` | 웹팀 제품 현황 + 아키텍처 원칙 + 게이트키퍼 | 웹-기획자1 |
| `better-wealth-web/01_service_overview.md` | 서비스 개요, 역할, 기능 목록 | 웹-기획자1 |
| `better-wealth-web/02_ux_screens.md` | 80+ 화면 분석, 내비게이션 플로우 | 웹-기획자2 |
| `better-wealth-web/03_frontend_architecture.md` | FE 아키텍처, 폴더 구조, 프로바이더 계층 | 웹-프론트엔드1 |
| `better-wealth-web/04_frontend_quality.md` | 테스트 커버리지, Storybook, a11y | 웹-프론트엔드2 |
| `better-wealth-web/05_backend_nestjs.md` | NestJS 구조, 12 도메인, 22 공유 라이브러리 | 웹-백엔드1 |
| `better-wealth-web/06_backend_fastapi.md` | FastAPI Nudge 서비스, 5 도메인 | 웹-백엔드2 |
| `better-wealth-web/07_infrastructure.md` | CI/CD, Docker Compose, Husky | 웹-인프라1 |
| `better-wealth-web/08_code_review_typescript.md` | TypeScript 타입 안전성 등급 분석 | 웹-코드리뷰어1 |
| `better-wealth-web/09_code_review_python_infra.md` | FastAPI 코드 품질, API 오류 형식 | 웹-코드리뷰어2 |
| `better-wealth-web/10_legal_compliance.md` | 암호화 감사, GDPR/개인정보보호법 준수 | 웹-법률전문가1 |
| `better-wealth-app/README.md` | 앱팀 복구 가이드 | Claude |
| `better-wealth-app/MEMORY.md` | 앱팀 빠른 참조 메모리 | Claude |
| `better-wealth-app/app_planner_context.md` | 앱팀 제품 현황 + UX 원칙 + 게이트키퍼 | 앱-기획자 |
| `better-wealth-app/figma_design_system.md` | DS 765개 컴포넌트 분석, 색상·타이포 토큰 | 앱-디자이너 |
| `better-wealth-app/collaboration_workflow.md` | 앱팀 기획-디자인 협업 5단계 표준 | Claude |
| `better-wealth-app/plugin_guidelines.md` | Figma 플러그인 개발 규칙 | Claude |
| `better-wealth-app/figma_plugin_design_kit.md` | 플러그인 공유 라이브러리 코드 블록 | Claude |
| `better-wealth-app/persona_spec.md` | 사용자 테스트 페르소나 5명 (P-A~P-E) | Claude |
| `issues/feature/{번호}/{번호}spec.md` | **유일한 사용자 소통 파일** | 사용자 ↔ Claude |
| `issues/feature/{번호}/{번호}results.md` | 구현 결과 문서 | Claude |
| `issues/feature/{번호}/figma-plugin/` | 앱팀 Figma 플러그인 코드 | 앱-디자이너 |

---

*이 문서는 Claude가 관리합니다. 시스템 구조가 변경되면 Claude에게 업데이트를 요청하세요.*
