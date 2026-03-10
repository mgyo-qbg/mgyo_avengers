# 앱팀 기획-디자인 협업 워크플로우

작성일: 2026-03-05
참여: 앱-기획자, 앱-디자이너

---

## 개요

플로우차트 작성 → 요구사항 정의 → 스케치 생성의 흐름을 기획자와 디자이너가 협업하여 반복 수행한다.
Figma REST API(코멘트)와 Figma Plugin API(스케치)를 조합하여 사용한다.

---

## 표준 작업 흐름

### 1단계: 플로우차트 분석

- 대상 파일: mgyo_note (AioSbUjrVBRnqTpFsltOC5)
- Figma REST API로 노드 데이터 읽기
  ```bash
  curl -H "X-Figma-Token: {TOKEN}" \
    "https://api.figma.com/v1/files/AioSbUjrVBRnqTpFsltOC5/nodes?ids={NODE_ID}&depth=3"
  ```
- SHAPE_WITH_TEXT(페이지/분기), VECTOR(화살표) 노드를 파싱하여 플로우 재구성
- 화살표 이름 형식: `"A --> B"` 로 flow 파악

### 2단계: 제약사항 코멘트 등록

- 각 페이지 노드 근처에 Figma 코멘트로 제약사항 기록
- REST API로 코멘트 추가:
  ```bash
  curl -X POST \
    -H "X-Figma-Token: {TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"message": "...", "client_meta": {"node_id": "{ID}", "node_offset": {"x": 380, "y": 0}}}' \
    "https://api.figma.com/v1/files/AioSbUjrVBRnqTpFsltOC5/comments"
  ```
- 수정 시: 기존 코멘트 DELETE 후 재등록 (PATCH 미지원)
- 코멘트 형식:
  ```
  [제약사항] 페이지명

  ▸ 항목명
    - 세부 내용
  ⚠️ 주의사항
  ```

### 3단계: 기획자-디자이너 스펙 협의

- 앱-기획자: 각 페이지별 UI 요소 목록 정리 후 앱-디자이너에게 전달
  - 입력 컴포넌트 종류 (TextInput / SelectBox / Picker / ChoiceCard / ReadonlyField)
  - CTA 유무 및 레이블
  - 스텝 인디케이터 필요 여부
  - 필수/옵셔널 여부
- 앱-디자이너: 스펙 기반으로 code.js 작성

### 4단계: Figma 플러그인 스케치 생성

**플러그인 파일 위치**: `issues/feature/{이슈번호}/figma-plugin/`
- `manifest.json`: 플러그인 메타
- `code.js`: 공유 라이브러리 + 이슈별 buildPage* 함수
- `ui.html`: 페이지 선택 UI

**새 이슈 플러그인 작성 시**: `figma_plugin_design_kit.md` 섹션 4 코드 블록을 code.js 상단에 복사 후 buildPage* 함수만 추가.

**표준 프레임 구조**:
```
root (VERTICAL auto-layout, 375×812, FIXED)
├── Status Bar    (44pt, FILL)
├── Top Nav       (44pt, FILL) — 뒤로가기 + 타이틀
├── Step Indicator (28pt, FILL) — pageNo 있을 때만
├── Scroll Area   (FILL, clipsContent=true)
└── CTA Area      (88pt, FILL) — ctaLabel 있을 때만
```

**핵심 규칙** (plugin_guidelines.md 참조):
- FILL은 반드시 `parent.appendChild(child)` 이후에 설정
- 절대배치 요소(프로그레스바 fill 등)는 `layoutPositioning = 'ABSOLUTE'`
- DS 파일(wygEtCwUqQJ9p06qsDnBJF) 수정/컴포넌트 생성 금지

**실행 방법**:
1. Figma Desktop → mgyo_note 파일 열기
2. Plugins → Development → Import plugin from manifest
3. `mgyo_avengers/issues/feature/{이슈번호}/figma-plugin/manifest.json` 선택
4. 실행

### 5단계: 검토 및 수정

- 앱-기획자: 생성된 스케치와 스펙 대조 검토
- 수정 필요 시 앱-디자이너에게 피드백 전달
- team-lead 승인 후 확정

---

## 주요 컴포넌트 함수 (code.js)

| 함수 | 용도 |
|------|------|
| `buildRoot(name, opts)` | 루트 프레임 생성 (opts: navTitle, ctaLabel, pageNo, pageTotal, cta) |
| `buildStepIndicator(current, total)` | 스텝 인디케이터 (N / total + 프로그레스바) |
| `buildSelectBox(placeholder, w)` | 셀렉트박스 |
| `buildTextInput(placeholder, suffix)` | 텍스트 입력 필드 |
| `buildReadonlyField(value)` | 읽기전용 필드 (gray50 배경) |
| `buildPicker(options)` | 가로형 세그먼트 피커 (Yes/No 선택) |
| `buildChoiceCard(text, isSelected)` | 선택 카드 (라디오 스타일) |
| `buildSectionHeader(text)` | 섹션 헤더 (20pt Bold) |
| `buildSubHeader(text)` | 서브 헤더 (14pt Regular, text500) |
| `buildLabel(text)` | 필드 라벨 (13pt SemiBold) |
| `buildHelperText(text)` | 보조 텍스트 (12pt Regular, text500) |

---

## 컬러 토큰 (C.*)

| 토큰 | 값 | 용도 |
|------|-----|------|
| primary500 | #2E9BFF | CTA, 선택 상태, 프로그레스 |
| gray50 | #F9F9F9 | 읽기전용 필드 배경 |
| gray100 | #F2F2F2 | 구분선, 프로그레스 배경 |
| gray200 | #E0E0E0 | 입력 필드 테두리 |
| text300 | - | 플레이스홀더 |
| text500 | - | 보조 텍스트 |
| text800 | - | 기본 텍스트 |
| text900 | - | 강조 텍스트 |
| green300 | #3AD1A9 | 완료 아이콘 |

---

## 이슈별 플러그인 관리

플러그인은 이슈 폴더 안에서 이슈별로 관리한다:

```
issues/feature/{이슈번호}/figma-plugin/
├── manifest.json
├── code.js
└── ui.html
```

새 이슈 플러그인 작성 절차:
1. `{번호}spec.md`에서 화면 목록, 플로우, 입력 스펙 파악
2. `issues/feature/{번호}/figma-plugin/` 폴더 생성
3. `figma_plugin_design_kit.md` 섹션 4 전체를 code.js 상단에 복사
4. 이슈별 `buildPage*` 함수 추가
5. ui.html 작성 (기존 이슈 참고), manifest.json 작성 (고유 id 사용)

**레퍼런스**: `issues/feature/943/figma-plugin/` (#943 인출설계 설문지 — 완료)
