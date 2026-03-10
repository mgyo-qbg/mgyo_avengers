# 베러웰스앱 Figma 디자인 시스템 분석

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.


파일명: [베러웰스앱] NEW 디자인 시스템
File Key: wygEtCwUqQJ9p06qsDnBJF
Figma URL: https://www.figma.com/design/wygEtCwUqQJ9p06qsDnBJF/
최종 수정: 2026-02-11
작성자: ipsae
총 컴포넌트셋: 98개 | 총 컴포넌트: 765개 | 스타일: 124개
분석 업데이트: 2026-03-10 (Figma REST API 전수 조회)

> ⚠️ 이 파일은 읽기 전용입니다. 플러그인 개발 시 절대 수정하지 마세요.

---

## 1. 페이지 구조 (총 30개 페이지)

### Overview
- Cover (16:222), Index (16:222 하위)

### Updates 🔴
- 25.08 ~ 25.12 월별 변경 이력 (5개월치)

### ———— Foundation ———— (6개 페이지)

| 페이지 | Node ID | 내용 |
|--------|---------|------|
| Color | 13:672 | 86개 FILL 스타일 (컬러 토큰 체계) |
| Icon 🫥 | 38:174 | 131개 아이콘 (45개 컴포넌트셋) |
| Img_icon 🫥 | 54:2829 | 115개 이미지 아이콘 (3개 컴포넌트셋) |
| Text style | 0:1 | 29개 TEXT 스타일 |
| Shadow / Round | 75:1871 | 7개 이펙트 스타일, 라운드 시스템 |
| Grid | 139:4772 | 2개 그리드 (Mobile 2-col, Mobile 5-col) |

### ———— Component ———— (16개 페이지)

| 페이지 | Node ID | 컴포넌트셋 수 | 총 variants | WIP |
|--------|---------|------------|------------|-----|
| Accordion/Cell | 105:10 | 2 | 11 | — |
| Badge/Snackbar/Toast | 105:166 | 3 | 14 | 🫥 |
| Banner | 190:839 | 5 | 30 | — |
| Button | 106:583 | 5 | 167 | — |
| Calendar | 142:73 | 0 | 0 | 🫥 미등록 |
| Card | 809:3993 | 0 | 1 | 🫥 단일 컴포넌트 |
| Checkbox/Toggle/Radio | 138:1195 | 4 | 65 | 🫥 |
| Divider | 138:1155 | 1 | 5 | — |
| Loading (Skeleton) | 760:545 | 3 | 28 | 🫥 |
| Modal | 106:234 | 0 | — | 섹션만 존재 |
| Navigation | 1730:660 | 6 | 40 | 🫥 |
| Selection | 168:3482 | 6 | 44 | 🫥 |
| Tab | 190:910 | 1 | 24 | — |
| Tag/Label | 190:909 | 2 | 18 | 🫥 |
| Textinput | 150:2434 | 8 | 56 | 🫥 |
| Tooltip | 186:59 | 1 | 8 | — |
| Top Navi bar | 175:810 | 1 | 3 | — |

### 추가중........ (WIP)
- Tooltip (763:743): 임시 2개, Label (label): 임시 2개 — 정리 필요

---

## 2. Foundation 상세

### 2-1. 컬러 토큰 (86개 FILL 스타일)

| 카테고리 | 토큰 수 | 범위 | 대표색 |
|---------|--------|------|--------|
| Primary | 12 | 50~900 + Dark/Light | #2E9BFF |
| Secondary | 12 | 50~900 + Dark/Light | #2E58FF |
| Gray | 10 | 50~900 | — |
| Text | 10 | 50~900 | text900: #030303 |
| Utility/Green | 6 | 100~500 + Dark | #3AD1A9 |
| Utility/Red | 6 | 100~500 + Dark | #FF5247 |
| Utility/Yellow | 6 | 100~500 + Dark | #FFC823 |
| Asset | 7 | Bond/Cash/Stock/Etc/Unclassified | 금융 자산 유형별 |
| Chart | 15 | 차트 팔레트 1~15 | — |
| Black/White | 2 | — | #030303 / #FFFFFF |

**플러그인에서 사용 가능한 C 객체 토큰** (figma_plugin_design_kit.md 참조):
- `C.primary500` (#2E9BFF), `C.secondary` (#2E58FF)
- `C.green300` (#3AD1A9), `C.red` (#FF5247), `C.yellow` (#FFC823)
- `C.gray50` (#F9F9F9), `C.gray100` (#F2F2F2), `C.gray200` (#E0E0E0), `C.gray400` (#A1A1A1)
- `C.text300` (placeholder), `C.text500` (helper), `C.text800` (label), `C.text900` (#030303)
- `C.white`
- ⚠️ `C.text700` 없음 — text800 사용할 것

### 2-2. 타이포그래피 (29개 TEXT 스타일)

폰트: **Pretendard** (Inter fallback)

| 카테고리 | 스케일 | 개수 |
|---------|--------|------|
| Heading | 1, 2, 3 | 3 |
| Title | 3xsmall ~ 2xlarge | 9 |
| Subtitle | 2xsmall ~ 2xlarge | 8 |
| Body | Tiny, Caption, 2xsmall ~ 2xlarge | 9 |

### 2-3. 이펙트 (7개)

shadow-sm, shadow, shadow-md, shadow-lg, shadow-xl, shadow-2xl, shadow-tooltip

### 2-4. 그리드 (2개)

Mobile-2 col (기본), Mobile-5 col

### 2-5. Icon (131개, 45개 컴포넌트셋)

각 아이콘은 컴포넌트셋으로 Size variant를 가짐.

**Arrows 계열 (20개 셋)**
- arrows-back-fill, arrows-back-line
- arrows-caret-back/down/forward/up
- arrows-chevron-down/up-large/small
- arrows-chevron-left/right-large/small
- arrows-left, arrows-right, arrows-leftright, arrows-rightleft, arrows-refresh, arrows-rotate

**Asset 계열 (2개 셋)**
- asset-minus, asset-plus

**Basic 계열 (10개 셋)**
- basic-bell, basic-close, basic-copy1, basic-dot, basic-hambuger(⚠️ 오타: hamburger)
- basic-home, basic-phone, basic-search, basic-setting, blank

**Check 계열 (13개 셋)**
- check-alert-fill/outline
- check-check1/check2
- check-checkmark-fill
- check-close-fill/outline
- check-info-fill/outline
- check-question-fill/outline
- check-triangle-warning-fill/outline

### 2-6. Img_icon (115개, 3개 컴포넌트셋)

**3d-icon** (11개 variants)
- img-icon=bell, clock, light, lock, speaker, ai, bell 2, text 1, text 2, file, chart

**img_icon/symbol** (102개 variants) — 금융기관 심볼
- **은행 (24개)**: KB국민은행, NH농협은행, 신한은행, 우리은행, 카카오뱅크, 케이뱅크, 토스뱅크, 하나은행, 기업은행, iM뱅크, 시티은행, BNK부산은행, MG새마을금고, 수협은행, BNK경남은행, 우체국, SC제일은행, 광주은행, 신협, 전북은행, KDB산업은행, 수협중앙회, 제주은행, 한국장학재단
- **저축은행 (3개)**: SBI저축은행, 웰컴저축은행, 저축은행
- **증권 (23개)**: 삼성증권, KB증권, 메리츠증권, 다올투자증권, LS증권, 우리투자증권, 카카오페이증권, BNK투자증권, 한화투자증권, 신영증권, 교보증권, DB증권, 유진투자증권, 토스증권, 현대차증권, 하나증권, 한국투자증권, 신한투자증권, 유안타증권, 대신증권, 키움증권, 미래에셋증권, NH투자증권, 케이프투자증권
- **생명보험 (18개)**: ABL생명, 푸본현대생명, 처브라이프생명보험, 메트라이프생명, IBK연금보험, iM라이프(구.DGB생명보험), AIA생명, 라이나생명보험, 한화생명보험, KB라이프생명보험, 하나생명보험, 흥국생명보험, 동양생명보험, KDB생명보험, DB생명보험, 미래에셋생명, NH농협생명, 삼성생명, 교보생명, BNP파리바카디프생명, 교보라이프, 신한라이프
- **손해보험 (11개)**: 메리츠화재해상보험, DB손해보험, AXA손해보험, 롯데손해보험, 캐롯손해보험, MG손해보험, 하나손해보험, NH농협손해보험, 에이스아메리칸화재해상보험, 신한EZ손해보험, AIG손해보험, KB손해보험, 삼성화재, 현대해상, 한화손해보험, 우체국보험
- **연금** (1개): 통합연금포털, iBK연금보험
- **가상자산 (3개)**: 빗썸, 바이낸스, 업비트
- **기타 (5개)**: 네이버, 카카오톡, 인증서, SK증권

**Img_icon** (2개 variants)
- Name=img_AI, Name=img-money

---

## 3. Component 상세

### 3-1. Accordion/Cell (11개 총)

**Accordion** (6개 variants)

| variant | Status | Size |
|---------|--------|------|
| — | Open / Close | Sm / Md / Lg |

variants 조합:
- Status=Open, Size=Sm/Md/Lg (3개)
- Status=Close, Size=Sm/Md/Lg (3개)

**Cell/List Item** (5개 variants)

| Type | 설명 |
|------|------|
| Move Sm | 이동 가능 소형 |
| Move Md | 이동 가능 중형 |
| Inactive | 비활성 |
| Active | 활성 |
| Text list | 텍스트 목록형 |

---

### 3-2. Badge/Snackbar/Toast (14개 총)

**Badge** (9개 variants)

| Type | Size |
|------|------|
| Dot | Xs / Sm / Md |
| Number | Xs / Sm / Md |
| New | Xs / Sm / Md |

**Snackbar** (1개 variants)
- Type=Default (단일 variant)

**Toast** (4개 variants)

| Variant |
|---------|
| Normal |
| Positive |
| Warning |
| Negative |

---

### 3-3. Banner (30개 총)

**Banner** (5개 variants)

| Type |
|------|
| text banner |
| noti banner |
| close banner |
| line banner |
| btn banner |

**account-state** (1개 variants)
- state=update-failed (단일 — 계정 업데이트 실패 상태)

**거래방식 표시** (2개 variants)
- color=gray / color=red

**수익률** (15개 variants)

| up&down | Size |
|---------|------|
| plus (+수익) | Xs / Md / Lg |
| minus (-수익) | Xs / Md / Lg |
| up (상승 화살표) | Xs / Md / Lg |
| down (하락 화살표) | Xs / Md / Lg |
| - (보합) | Xs / Md / Lg |

**입출금내역** (7개 variants)

| Status | Currency |
|--------|---------|
| 출금 | 원화 / 달러 |
| 일반 | 원화 / 달러 |
| 입금 | 원화 / 달러 |
| 금액입력필요 | - |

---

### 3-4. Button (167개 총)

**buttons** (120개 variants)

| 축 | 값 |
|----|-----|
| Variant | Default / Pressed / Disabled / Outline |
| Radius | R8 / R100 |
| Color | Primary / Secondary / Gray |
| Size | Xsmall / Small / Medium / Large / Xlarge |

조합: Primary는 4(Variant) × 2(Radius) = 8/Size × 5 = 40개, Secondary+Gray는 4 × 2 × 2 = 16/Size × 5 = 80개 → 총 120개

**fixedBtn** (12개 variants)

| Type | Style |
|------|-------|
| primary / disabled / secondary / gray | default / double1 / double2 |

**Icon button** (16개 variants)

| Size | Type |
|------|------|
| Default / lg / Small / Xsmall | left-square / left-round / right-square / right-round |

**Text button** (15개 variants)

| Size | Variant |
|------|---------|
| Md | Primary / Assistive / Disable / Negative / Icon |
| Sm | Primary / Icon |
| Xs | Primary / Icon |

> 참고: Assistive/Disable/Negative는 Md 전용

**Modal button** (4개 variants)

| style |
|-------|
| default (1개 버튼) |
| double1 (2개 버튼 — 균등) |
| double2 (2개 버튼 — 비균등) |
| double3 (3개 버튼) |

---

### 3-5. Calendar (WIP)

컴포넌트 미등록 — 섹션만 존재. 사용 불가.

---

### 3-6. Card (1개)

단일 컴포넌트 `img_card`만 존재. 컴포넌트셋 없음. 빈약한 상태.

---

### 3-7. Checkbox/Toggle/Radio (65개 총)

**Checkbox** (37개 variants)

| Type | Size | Status |
|------|------|--------|
| Checkmark | Sm / Md / Lg | Checked / Unchecked / Disable |
| Square | Sm / Md / Lg | Checked / Unchecked / Disable / Indeterminate |
| Round | Xs / Sm / Md / Lg | Checked / Unchecked / Disable / Indeterminate |

> 참고: Checkmark는 Indeterminate 없음, Xs 없음

**Radio** (12개 variants)

| Status | Size |
|--------|------|
| Checked / Unchecked / Disable | Xs / Sm / Md / Lg |

**Radio Text** (12개 variants)
- Radio와 동일 축: Status(Checked/Unchecked/Disable) × Size(Xs/Sm/Md/Lg)
- 텍스트 레이블 포함 버전

**toggle** (4개 variants)

| Active | Size |
|--------|------|
| On / Off | Sm / Default |

---

### 3-8. Divider (5개 총)

**dividers** (5개 variants)

| Type |
|------|
| divider 1 |
| divider 2 |
| divider 3 |
| divider 4 |
| divider 5 |

---

### 3-9. Loading/Skeleton (28개 총)

**Skeleton/Text** (24개 variants)

| Size | Length | Align |
|------|--------|-------|
| Sm / Md / Lg | 25% / 50% / 75% / 100% | Left / Right |

**Skeleton/Rectangle** (2개 variants)
- Color=Nomal (⚠️ 오타: Normal) / Color=White

**Skeleton/Circle** (2개 variants)
- Color=Nomal (⚠️ 오타: Normal) / Color=White

---

### 3-10. Modal (WIP)

섹션만 존재, 컴포넌트 미등록. 사용 불가.

---

### 3-11. Navigation (40개 총)

**Progress Bar** (28개 variants)

| percent | size | rounded |
|---------|------|---------|
| 0% / 20% / 40% / 50% / 60% / 80% / 100% | sm / md | none / full |

**dot** (8개 variants, 4개 셋)

| Size | Status | Color | 셋 |
|------|--------|-------|----|
| sm | active / inactive | wh (흰색) | 셋 1 |
| sm | active / inactive | bk (검정) | 셋 2 |
| md | active / inactive | bk (검정) | 셋 3 |
| md | active / inactive | wh (흰색) | 셋 4 |

**pagination_dot** (4개 variants)

| Color | Size |
|-------|------|
| bk / wh | sm / md |

---

### 3-12. Selection (44개 총)

**Selection/Select** (9개 variants)

| Type | Status |
|------|--------|
| Default | Inactive / Focus / Active Focus / Active |
| Error | Inactive / Focus / Active Focus / Active |
| Disable | Inactive |

**Selection/Select Layer** (9개 variants)

| Type | Size |
|------|------|
| Active | Xs / Sm / Md |
| Active Focus | Xs / Sm / Md |
| Text | Xs / Sm / Md |

**Selection/Resource** (6개 variants)

| Size | Status |
|------|--------|
| Xs / Sm / Md | Selected / Inactive |

**Select List** (4개 variants)

| size | state |
|------|-------|
| md / lg | inactive / active |

**Scroll Bar** (6개 variants)

| Size | Location |
|------|---------|
| Sm / Default | Top / Middle / Bottom |

**Layer** (8개 variants)

| Type | Size |
|------|------|
| Layer / Layer Scroll | Xs / Sm / Md / Lg |

---

### 3-13. Tab (24개 총)

**Tabs** (24개 variants)

| Type | Size | Status |
|------|------|--------|
| Line | Small / Default / Large | Active / Inactive |
| Box | Small / Default / Large | Active / Inactive |
| Round | Small / Default / Large | Active / Inactive |
| Ractangle (⚠️ 오타: Rectangle) | Small / Default / Large | Inactive |

> 참고: Ractangle 타입은 Inactive만 존재 (Active 미구현)

---

### 3-14. Tag/Label (18개 총)

**Tag** (16개 variants)

| Color | Size | Type |
|-------|------|------|
| Primary / Secondary / Black / Gray | Md / Sm | Line / Bg |

**Label** (2개 variants)

| Size |
|------|
| Sm |
| Md |

---

### 3-15. Textinput (56개 총)

**Textinput/Textfield** (13개 variants)

| Type | Status |
|------|--------|
| Default | Inactive / Focus / Active / Active Focus |
| Error | Inactive / Focus / Active / Active Focus |
| Disable | Inactive / Active |
| Readonly | Inactive / Active |
| Positive | Active |

**Textinput/Currency** (11개 variants)

> ⚠️ Figma 오타: `Satus` → Status

| Type | Status |
|------|--------|
| Default | Inactive / Focus / Active / Active Focus |
| Error | Inactive / Focus / Active / Active Focus |
| Disable | Inactive / Active |
| Readonly | Inactive |

**Textinput/Textarea** (11개 variants)

| Type | Status |
|------|--------|
| Default | Inactive / Focus / Active / Active Focus |
| Error | Inactive / Focus / Active / Active Focus |
| Disable | Inactive / Active |
| Readonly | Active |

**Textinput/Textfield Button** (11개 variants)

| Type | Status |
|------|--------|
| Default | Inactive / Focus / Active / Active Focus |
| Error | Inactive / Focus / Active / Active Focus |
| Disable | Inactive / Active |
| Positive | Active |

**Searchfield** (2개 variants)
- Status=Inactive / Status=Active

**Textinput/Textarea/Resource** (2개 variants)
- Variants=Counter / Variants=Icon

**Textinput/Resource/Textfield/Inner** (2개 variants)
- Variants=Timer / Variants=Icons

**Textinput/Resource/Textfield/Button** (3개 variants)
- Status=Nomal (⚠️ 오타: Normal) / Status=Assistive / Status=Disable

---

### 3-16. Tooltip (8개 총)

**Tooltip** (8개 variants) — 공식 페이지 기준

| Caret 위치 |
|-----------|
| top-left / top-center / top-right |
| left / right |
| bottom-left / bottom-center / bottom-right |

> 참고: `추가중........` 페이지에도 Tooltip 2개가 임시로 있음 (정리 필요)

---

### 3-17. Top Navi bar (3개 총)

**Navi bar** (3개 variants)

| Type |
|------|
| home navi bar |
| icon-only |
| title-center |

---

## 4. WIP 현황 및 오타 목록

### WIP 컴포넌트 (미완성)

| 컴포넌트 | 상태 | 비고 |
|---------|------|------|
| Calendar | 컴포넌트 미등록 | 섹션만 존재 |
| Modal | 컴포넌트 미등록 | 섹션만 존재 |
| Card | 1개(img_card)만 존재 | 빈약 |
| Tab/Ractangle | Active variant 없음 | Inactive만 존재 |
| 추가중........ 페이지 | Tooltip 2개, Label 2개 임시 잔류 | 정리 필요 |

### Figma 내 오타 목록 (6건)

| 위치 | 오타 | 정확한 표기 |
|------|------|-----------|
| Tab/Tabs | Ractangle | Rectangle |
| Textinput/Currency | Satus | Status |
| Skeleton/Rectangle | Nomal | Normal |
| Skeleton/Circle | Nomal | Normal |
| Textinput/Resource/Textfield/Button | Nomal | Normal |
| Icon/basic-hambuger | hambuger | hamburger |

### 주요 개선 포인트

1. **Button 120개 variants** — 미사용 조합 정리 권장 (특히 Disabled + Outline 조합)
2. **Modal 미등록** — 가장 자주 쓰이는 컴포넌트인데 DS에 없음
3. **Calendar 미완성** — 날짜 선택 UI 필요 시 별도 구현 필요
4. **Card 빈약** — img_card 1개만, 다양한 카드 패턴 추가 필요
5. **데스크톱 그리드 없음** — Mobile 전용
6. **Updates 로그 미갱신** — 25.12 이후 없음
7. **Tab/Ractangle Active 없음** — 미완성 타입
8. **추가중........ 페이지 정리** 필요

---

## 5. 플러그인 개발 시 참고사항

- DS 파일은 **절대 수정 금지** — 토큰 값만 참조
- `importComponentByKeyAsync` **사용 금지** — 플러그인 권한 없음
- 실제 구현 시 `figma_plugin_design_kit.md`의 공유 라이브러리 함수 사용
- 색상 참조: `C.` 객체 (위 2-1 섹션의 플러그인 토큰 목록 참조)
- 폰트: Pretendard 로드 필요 (`figma.loadFontAsync({family: 'Pretendard', style: 'Regular'})`)
