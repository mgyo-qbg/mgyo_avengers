# BetterWealth 앱 — Figma Plugin 개발 가이드

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**  
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.


작성일: 2026-03-05
최종 업데이트: 2026-03-10

---

## 1. 개요

요구사항이 들어오면 **Figma Plugin API(code.js)** 를 작성하여 Figma 파일에 화면을 자동으로 그린다.
수동 Figma 작업 없이 코드로 일관된 화면을 빠르게 생성하는 것이 목표다.

**검증된 플러그인**: #943 인출설계 설문지 (`issues/feature/943/figma-plugin/`)

---

## 2. 핵심 원칙

### DS 활용 방식

| 원칙 | 설명 |
|------|------|
| **DS 파일 수정 금지** | `wygEtCwUqQJ9p06qsDnBJF` 파일에 직접 수정/컴포넌트 생성 불가 |
| **토큰 참조 방식** | DS 컴포넌트를 import하지 않는다. 색상·타이포 **값(토큰)만** 참조해서 primitive로 직접 구현 |
| **공유 라이브러리 사용** | `figma_plugin_design_kit.md` 섹션 4의 코드 블록을 code.js 상단에 복사해서 시작 |

> `importComponentByKeyAsync`는 사용하지 않는다.
> 플러그인이 DS 구조 변경에 취약해지고, 스케치 목적에 불필요한 복잡성을 추가한다.

### Figma Plugin API 규칙

| 규칙 | 설명 |
|------|------|
| **대상 파일** | mgyo_note (`AioSbUjrVBRnqTpFsltOC5`) — 여기에 프레임 생성 |
| **FILL 설정 순서** | `layoutSizingHorizontal/Vertical = 'FILL'`은 항상 `parent.appendChild(child)` 이후에 설정 |
| **절대 배치 요소** | border, badge 등 auto-layout 흐름에서 빠져야 할 요소는 `layoutPositioning = 'ABSOLUTE'` (append 이후) |
| **고정 크기 원칙** | 모든 프레임은 `resize(w, h)`로 명시적 크기 지정 |

---

## 3. 이슈별 플러그인 폴더 구조

플러그인은 이슈 폴더 안에서 관리한다:

```
issues/feature/{이슈번호}/figma-plugin/
├── manifest.json   # 플러그인 메타 (name, id, main, ui)
├── code.js         # 공유 라이브러리 + 이슈별 buildPage* 함수
└── ui.html         # 페이지/섹션 선택 UI 패널
```

Figma Desktop 실행: Plugins → Development → Import plugin from manifest
→ `issues/feature/{번호}/figma-plugin/manifest.json`

---

## 4. 새 플러그인 작성 순서

1. **스펙 파악** — `{번호}spec.md` 읽고 화면 목록, 플로우, 입력 스펙 파악
2. **폴더 생성** — `issues/feature/{번호}/figma-plugin/`
3. **code.js 작성**
   - `figma_plugin_design_kit.md` 섹션 4 전체 복사 → 상단에 붙여넣기
   - 이슈별 `buildPage*` 함수 추가 (공유 컴포넌트 함수 재사용)
4. **ui.html 작성** — `issues/feature/943/figma-plugin/ui.html` 참고, 화면 목록 교체
5. **manifest.json** — name, id(고유값), main("code.js"), ui("ui.html")
6. **Figma Desktop에서 import 후 실행 확인**

---

## 5. 알려진 이슈 및 해결책

| 이슈 | 원인 | 해결 |
|------|------|------|
| `FILL can only be set on children of auto-layout frames` | FILL을 appendChild 이전에 설정 | append 후 설정 |
| 요소가 오른쪽으로 밀림 | border rect가 auto-layout 흐름에 포함됨 | `layoutPositioning = 'ABSOLUTE'` |
| 콘텐츠가 CTA 버튼과 겹침 | 루트 VERTICAL + scroll FILL 미적용 | `buildRoot()` 패턴 그대로 사용 |
| Pretendard 폰트 없음 | 시스템 미설치 | `loadFonts()`에 Inter fallback 내장 |

---

## 6. 공유 컴포넌트 레퍼런스

`figma_plugin_design_kit.md` 참조. 주요 함수 목록:

| 함수 | 역할 |
|------|------|
| `buildRoot(name, opts)` | 루트 프레임 (StatusBar+TopNav+StepIndicator+Scroll+CTA) 생성, `{root, scroll}` 반환 |
| `buildCTA(label)` | Primary 버튼 영역 (88h) |
| `buildStepIndicator(cur, total)` | 스텝 카운터 + 프로그레스 바 |
| `buildSectionHeader(text)` | 섹션 헤더 (20pt bold) |
| `buildSubHeader(text)` | 서브 헤더 (14pt regular) |
| `buildLabel(text)` | 입력 레이블 (13pt semibold) |
| `buildSelectBox(placeholder, w)` | 셀렉트박스 (48h) |
| `buildTextInput(placeholder, suffix)` | 텍스트 입력 (48h) |
| `buildReadonlyField(value)` | 읽기 전용 필드 (48h, gray50 배경) |
| `buildChoiceCard(text, isSelected)` | 선택 카드 (72h) |
| `buildHelperText(text)` | 헬퍼 텍스트 (12pt) |
| `buildPicker(options)` | 세그먼트 피커 (52h) |
| `hf(name, w, h, opts)` | HORIZONTAL auto-layout 프레임 |
| `vf(name, w, h, opts)` | VERTICAL auto-layout 프레임 |
| `mkText(chars, size, weight, color)` | 텍스트 노드 |
| `mkRect(w, h, color, radius)` | 사각형 노드 |
| `mkEllipse(w, h, color)` | 원형 노드 |
