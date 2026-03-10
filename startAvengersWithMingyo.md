# mgyo_avengers 시작 가이드

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.

최종 업데이트: 2026-03-10

---

## 이 레포는 뭔가요?

Claude Code 세션을 닫으면 대화 맥락이 모두 사라집니다. 이 레포는 그 문제를 해결하는 **팀 컨텍스트 저장소**입니다.

- `mgyo_avengers` — 팀 컨텍스트·이슈 관리 (이 레포)
- `better-wealth-fa` — 실제 서비스 코드 (FA 플랫폼)

두 레포는 동일한 `MEMORY.md`를 공유합니다. 어디서 Claude를 열든 같은 컨텍스트를 읽습니다.

---

## 초기 설정 (최초 1회)

### 1. Agent Teams 활성화

`~/.claude/settings.json`에 추가:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### 2. MEMORY.md symlink 설정

```bash
# mgyo_avengers에서 열 때
mkdir -p ~/.claude/projects/-Users-imsi-Desktop-qbg-repo-mgyo-avengers/memory
ln -sf /Users/imsi/Desktop/qbg/repo/mgyo_avengers/MEMORY.md \
       ~/.claude/projects/-Users-imsi-Desktop-qbg-repo-mgyo-avengers/memory/MEMORY.md

# better-wealth-fa에서 열 때
mkdir -p ~/.claude/projects/-Users-imsi-Desktop-qbg-repo-better-wealth-fa/memory
ln -sf /Users/imsi/Desktop/qbg/repo/mgyo_avengers/MEMORY.md \
       ~/.claude/projects/-Users-imsi-Desktop-qbg-repo-better-wealth-fa/memory/MEMORY.md
```

---

## 세션 시작하기

**1. Claude Code 실행**

```bash
cd /Users/imsi/Desktop/qbg/repo/mgyo_avengers
claude
```

**2. 복구 명령 입력**

```
/Users/imsi/Desktop/qbg/repo/mgyo_avengers 하위의 문서들을 읽고 팀을 조직하고 각 팀원들의 컨텍스트를 복구해
```

**3. 복구 확인**

```
우리팀 워크플로우 보고해봐
```

---

## 일하는 법

이슈는 **5 Phase**로 진행됩니다. 상세 정의: `issues/WORKFLOW.md`

| Phase | 내용 | 사용자 행동 |
|-------|------|-----------|
| 1. 요구사항 수집 | Claude와 대화로 요건 파악 | `"#1050 이슈야. 투자 설문 화면이 필요해."` |
| 2. 스펙 초안 | Claude가 spec.md 작성 + 기획자 검토 | 검토 결과 확인 후 수정 요청 |
| 3. 스펙 확정 | **이 단계 이전 작업 착수 없음** | `"스펙 확정이야"` |
| 4. 작업 진행 | 팀 할당 → 구현 → results.md 작성 | 중간 보고 확인 |
| 5. 완료 | 결과 보고 + 컨텍스트 업데이트 | `"작업 정리해서 컨텍스트 반영하고 커밋해봐"` |

> **사용자가 직접 수정하는 파일은 `{번호}spec.md` 하나뿐입니다.** 나머지는 모두 Claude가 관리합니다.

---

## 자주 쓰는 명령어

```bash
# 새 이슈 시작
"#1050 이슈야. (요구사항 설명)"

# 스펙 확정
"스펙 확정이야"

# 현황 확인
"현재 이슈 현황 알려줘"

# 커밋
/commit

# 컨텍스트 저장
"작업 정리해서 컨텍스트 반영하고 커밋해봐"
```

---

## 폴더 구조

```
mgyo_avengers/
├── MEMORY.md                  ← Claude 자동 메모리 (symlink 대상)
├── README.md                  ← Claude용 복구 가이드
├── better-wealth-web/         ← 웹팀 컨텍스트 (01~10 분석 파일, web_planner_context.md)
├── better-wealth-app/         ← 앱팀 컨텍스트 (app_planner_context.md, figma 관련)
└── issues/
    ├── WORKFLOW.md            ← 이슈 워크플로우 상세 정의
    └── feature/{번호}/
        ├── {번호}spec.md      ← ✅ 유일한 사용자 소통 파일
        ├── {번호}results.md
        └── figma-plugin/      ← 앱팀 이슈에만 존재
```

팀 구조 상세: `README.md` / 앱팀 워크플로우 상세: `better-wealth-app/collaboration_workflow.md`

---

## 주의사항

- **spec.md 외 파일을 직접 수정하지 마세요.** Claude의 현황 인식과 어긋납니다.
- 세션이 길어지면 컨텍스트가 압축됩니다. 작업 완료 시마다 컨텍스트 저장 명령을 실행하세요.
- Figma PAT는 보안상 저장하지 않습니다. 필요 시 Figma → Settings → Personal access tokens에서 재발급.
