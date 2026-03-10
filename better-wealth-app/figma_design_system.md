# 베러웰스앱 Figma 디자인 시스템 — 완전 참조 문서

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**
> 수정이 필요하면 Claude에게 요청하세요.

파일명: [베러웰스앱] NEW 디자인 시스템
File Key: `wygEtCwUqQJ9p06qsDnBJF`
최종 수정: 2026-02-11 | 분석 업데이트: 2026-03-10 (Figma REST API 전수 조회)
총 컴포넌트셋: 98개 | 총 컴포넌트: 765개 | 스타일: 124개

> ⚠️ Figma DS 파일은 읽기 전용. 절대 수정 불가.

---

## 1. 페이지 구조 (총 30개 페이지)

| 분류 | 페이지 |
|------|--------|
| Overview | Cover, Index |
| Updates 🔴 | 25.08 ~ 25.12 월별 변경 이력 |
| Foundation | Color, Typography, Shadows, Radius, Spacing, Grid |
| Component (WIP) | Banner, Button, Checkbox, Input, Radio, Tab, Tag/Badge, Toast/Snackbar, Toggle, Accordion, Tooltip, Pagination, Scroll, Divider, Cell, Selection, Progress, Navi |

---

## 2. 디자인 토큰

### 2-1. 컬러 스타일 (86개)

> FILL 스타일 전체. hex 값은 Figma REST API `/v1/files/{key}/nodes` 실측.

#### Primary (Blue)
| 토큰 | Hex |
|------|-----|
| Primary/50 | `#F6FAFF` |
| Primary/100 | `#EBF5FF` |
| Primary/200 | `#D5EBFF` |
| Primary/300 | `#9FD1FF` |
| Primary/400 | `#58AFFF` |
| Primary/500 | `#2E9BFF` |
| Primary/600 | `#2A8DE8` |
| Primary/700 | `#216EB5` |
| Primary/800 | `#19558C` |
| Primary/900 | `#13416B` |
| Primary/Light | `#50B6FF` |
| Primary/Dark | `#298CE6` |

#### Secondary (Indigo)
| 토큰 | Hex |
|------|-----|
| Secondary/50 | `#EAEEFF` |
| Secondary/100 | `#BECBFF` |
| Secondary/200 | `#9FB2FF` |
| Secondary/300 | `#738FFF` |
| Secondary/400 | `#5879FF` |
| Secondary/500 | `#2E58FF` |
| Secondary/600 | `#2A50E8` |
| Secondary/700 | `#213EB5` |
| Secondary/800 | `#19308C` |
| Secondary/900 | `#13256B` |
| Secondary/Light | `#6B89FF` |
| Secondary/Dark | `#1A40D6` |

#### Gray (Neutral)
| 토큰 | Hex |
|------|-----|
| Gray/50 | `#F8F9FA` |
| Gray/100 | `#F4F5F7` |
| Gray/200 | `#EFEFF0` |
| Gray/300 | `#E6E6E7` |
| Gray/400 | `#D6D7DB` |
| Gray/500 | `#ADAFB8` |
| Gray/600 | `#858794` |
| Gray/700 | `#63636F` |
| Gray/800 | `#404351` |
| Gray/900 | `#2A2C32` |

#### Text
| 토큰 | Hex |
|------|-----|
| Text/Text 50 | `#E0E0E3` |
| Text/Text 100 | `#B8B8BC` |
| Text/Text 200 | `#A4A4A8` |
| Text/Text 300 | `#909094` |
| Text/Text 400 | `#7C7C80` |
| Text/Text 500 | `#67676B` |
| Text/Text 600 | `#535357` |
| Text/Text 700 | `#3F3F43` |
| Text/Text 800 | `#2B2B2F` |
| Text/Text 900 | `#17171B` |

#### Utility — Red
| 토큰 | Hex |
|------|-----|
| Utility/Red 100 | `#FFF3F1` |
| Utility/Red 200 | `#FFEEED` |
| Utility/Red 300 | `#FFC9C6` |
| Utility/Red 400 | `#FF8267` |
| Utility/Red 500 | `#FF5247` |
| Utility/Red dark | `#AB382C` |

#### Utility — Green
| 토큰 | Hex |
|------|-----|
| Utility/Green 100 | `#EFFBF8` |
| Utility/Green 200 | `#EBFAF6` |
| Utility/Green 300 | `#E1F8F2` |
| Utility/Green 400 | `#C2F1E4` |
| Utility/Green 500 | `#3AD1A9` |
| Utility/Green dark | `#2C9D7F` |

#### Utility — Yellow
| 토큰 | Hex |
|------|-----|
| Utility/Yellow 100 | `#FFFAE9` |
| Utility/Yellow 200 | `#FFF8D3` |
| Utility/Yellow 300 | `#FFEFA6` |
| Utility/Yellow 400 | `#FFDA59` |
| Utility/Yellow 500 | `#FFC823` |
| Utility/Yellow dark | `#E4AB00` |

#### Black / White
| 토큰 | Hex |
|------|-----|
| Black | `#030303` |
| White | `#FFFFFF` |

#### Asset (포트폴리오 차트용)
| 토큰 | Hex |
|------|-----|
| Asset/Bond Domestic | `#3BA0FF` |
| Asset/Bond Overseas | `#7DE1FF` |
| Asset/Cash | `#FFDD6F` |
| Asset/Etc | `#FFC18F` |
| Asset/Stock Domestic | `#FF657E` |
| Asset/Stock Overseas | `#FF9A8F` |
| Asset/Unclassified | `#CBCED1` |

#### Chart (1~15번)
| 토큰 | Hex |
|------|-----|
| Chart/1 | `#8C73F1` |
| Chart/2 | `#84C2FE` |
| Chart/3 | `#487FFF` |
| Chart/4 | `#93E36B` |
| Chart/5 | `#53CABF` |
| Chart/6 | `#A8B5E7` |
| Chart/7 | `#F4E38B` |
| Chart/8 | `#F9C26B` |
| Chart/9 | `#FF9E8A` |
| Chart/10 | `#FFB8A8` |
| Chart/11 | `#F28BA8` |
| Chart/12 | `#F4B8FF` |
| Chart/13 | `#B1F0FE` |
| Chart/14 | `#A0B5C9` |
| Chart/15 | `#AF98C8` |

---

### 2-2. 타이포그래피 스타일 (29개)

> 모두 **Pretendard** 폰트. lineHeight는 fontSize 대비 %. letterSpacing은 px.

#### Heading
| 스타일 | fontSize | fontWeight | lineHeight | letterSpacing |
|--------|----------|------------|------------|---------------|
| Heading/1 | 36px | 700 | 140% | -0.4 |
| Heading/2 | 32px | 700 | 140% | -0.4 |
| Heading/3 | 28px | 700 | 140% | -0.4 |

#### Title
| 스타일 | fontSize | fontWeight | lineHeight | letterSpacing |
|--------|----------|------------|------------|---------------|
| Title/2xlarge | 26px | 700 | 140% | -0.3 |
| Title/Xlarge | 24px | 700 | 140% | -0.3 |
| Title/Large | 22px | 700 | 140% | -0.2 |
| Title/Medium | 20px | 700 | 140% | -0.2 |
| Title/Regular | 18px | 700 | 140% | -0.2 |
| Title/Small | 16px | 700 | 150% | 0 |
| Title/Xsmall | 14px | 700 | 150% | 0 |
| Title/2xsmall | 13px | 700 | 150% | 0 |
| Title/3xsmall | 12px | 700 | 150% | 0 |

#### Subtitle
| 스타일 | fontSize | fontWeight | lineHeight | letterSpacing |
|--------|----------|------------|------------|---------------|
| Subtitle/2xlarge | 24px | 600 | 140% | -0.3 |
| Subtitle/Xlarge | 22px | 600 | 140% | -0.2 |
| Subtitle/Large | 20px | 600 | 140% | -0.2 |
| Subtitle/Medium | 18px | 600 | 140% | -0.2 |
| Subtitle/Regular | 16px | 600 | 150% | -0.2 |
| Subtitle/Small | 14px | 600 | 150% | -0.2 |
| Subtitle/Xsmall | 13px | 600 | 150% | -0.2 |
| Subtitle/2xsmall | 12px | 600 | 150% | -0.2 |

#### Body
| 스타일 | fontSize | fontWeight | lineHeight | letterSpacing |
|--------|----------|------------|------------|---------------|
| Body/2xlarge | 22px | 400 | 150% | -0.2 |
| Body/Xlarge | 20px | 400 | 150% | -0.2 |
| Body/Large | 18px | 400 | 150% | -0.2 |
| Body/Regular | 16px | 400 | 150% | -0.2 |
| Body/Small | 15px | 400 | 150% | -0.2 |
| Body/Xsmall | 14px | 400 | 150% | -0.2 |
| Body/2xsmall | 13px | 400 | 150% | -0.2 |
| Body/Caption | 12px | 400 | 140% | -0.2 |
| Body/Tiny | 11px | 400 | 140% | -0.2 |

---

### 2-3. 이펙트 스타일 (7개 — DROP_SHADOW)

> offset=(x,y), blur, spread 모두 px. color opacity는 %.

| 스타일 | color | opacity | offset | blur | spread |
|--------|-------|---------|--------|------|--------|
| shadow-sm | #000000 | 8% | (0, 1) | 2px | 0 |
| shadow | #000000 | 10% | (0, 1) | 3px | 0 |
| shadow-md | #000000 | 6% | (0, 3) | 10px | 0 |
| shadow-lg | #000000 | 8% | (0, 5) | 12px | 0 |
| shadow-xl | #000000 | 10% | (0, 3) | 15px | 0 |
| shadow-2xl | #000000 | 10% | (0, 3) | 15px | 0 |
| shadow-tooltip | #ADAFB8 | 60% | (0, 0) | 4px | 0 |

---

## 3. 컴포넌트 상세

> 모든 치수는 `absoluteBoundingBox` 실측값. pad = paddingTop/Right/Bottom/Left, r = cornerRadius, gap = itemSpacing.

---

### 3-1. Button (buttons)

**기본 구조**: 색상(Color) × 사이즈(Size) × 상태(Variant: Default/Pressed/Disabled)
**공통**: r=8, auto-layout 수평, 텍스트 fontWeight=700

#### 사이즈별 치수
| Size | width | height | paddingH | paddingV | fontSize |
|------|-------|--------|----------|----------|----------|
| Xlarge | 335px | 52px | 24 | 12 | 18px |
| Large | 256px | 52px | 16 | 12 | 18px |
| Medium | 96px | 40px | 16 | 8 | 16px |
| Small | 73px | 33px | 16 | 6 | 13px |
| Xsmall | 51px | 26px | 16 | 4 | 12px (fw=600) |

#### 색상별 배경 (Default 상태)
| Color | fill | 용도 |
|-------|------|------|
| Secondary | `#2E58FF` | 보조(인디고) 기본 CTA |
| Primary | `#2E9BFF` | 주요 파란색 CTA |
| Gray | `#E6E6E7` | 비활성/보조 |
| Disabled | `#BECBFF` | 비활성 Secondary |
| Pressed Secondary | `#213EB5` | Pressed 상태 |
| Pressed Gray | `#D6D7DB` | Pressed 상태 |

---

### 3-2. Fixed Button (fixedBtn)

하단 고정 버튼. 화면 전체 너비(375px).

| Type | width | height | padding | gap | inner button fill |
|------|-------|--------|---------|-----|-------------------|
| primary | 375px | 92px | 20 (all) | 8 | `#2E9BFF` |
| secondary | 375px | 92px | 20 (all) | 8 | `#2E58FF` |
| gray | 375px | 92px | 20 (all) | 8 | `#E6E6E7` |
| disabled | 375px | 92px | 20 (all) | 8 | `#D5EBFF` |
| double1 | 375px | 92px | 20 (all) | 8 | (두 버튼) |

- 배경: `#FFFFFF @70%` (반투명 흰색)
- 내부 버튼: 335×52px (buttons Large 동일 치수)

---

### 3-3. Icon Button

아이콘 + 텍스트 조합 버튼. 상/하/좌/우 아이콘 위치 선택.

| Size | Type | width | height | pad H | pad V | r | gap | fontSize |
|------|------|-------|--------|-------|-------|---|-----|----------|
| Default | left/right-square | 105px | 40px | 14 | 8 | 6 | 8 | 16px/600 |
| Default | left/right-round | 105px | 40px | 14 | 8 | 100 | 8 | 16px/600 |
| lg | left/right-square | 119px | 45px | 16 | 10 | 6 | 8 | 18px/600 |
| lg | left/right-round | 119px | 45px | 16 | 10 | 100 | 8 | 18px/600 |

- 아이콘 사이즈: Default=20×20, lg=24×24
- 기본 fill: `#2E9BFF`

---

### 3-4. Text Button

텍스트만 또는 텍스트+아이콘 조합의 인라인 버튼.

| Size | Variant | width | height | pad H | pad V | gap | fontSize |
|------|---------|-------|--------|-------|-------|-----|----------|
| Md | Icon | 145px | 40px | 16 | 8 | 8 | 16px/400 |
| Md | Primary | 50px | 40px | 4 | 8 | 8 | 16px/600 |
| Sm | Icon | 123px | 29px | 12 | 4 | 8 | 14px/400 |
| Sm | Primary | 44px | 37px | 4 | 8 | 8 | 14px/600 |
| Xs | Icon | 102px | 26px | 8 | 4 | 8 | 12px/400 |

- 배경 없음(투명), 텍스트 컬러는 Primary/500(`#2E9BFF`) 또는 Text/Text 700(`#3F3F43`)
- Icon variant: 오른쪽에 화살표 아이콘(chevron-right) 포함

---

### 3-5. Text Input

**공통 구조**: 상단 라벨 + 입력 필드 + 하단 헬퍼텍스트 (gap=6)
**컨테이너**: 303×101px (Textarea: 303×189px)

#### Textfield (13 variants)
| Status | fill | stroke |
|--------|------|--------|
| Inactive | `#F4F5F7` | - |
| Focus | `#FFFFFF` | `#2E9BFF` |
| Active | `#FFFFFF` | `#D6D7DB` |
| Positive | `#FFFFFF` | `#3AD1A9` |
| Error | `#FFFFFF` | `#FF5247` |
| Disable | `#F4F5F7` | - |
| Readonly | `#F4F5F7` | - |

- 입력 필드 내부: pad t12/r14/b12/l14, r=8, height ≈ 48px

#### Currency (11 variants) — 금액 입력
- 구조 동일 (303×101px), 오른쪽에 단위 텍스트 표시

#### Textarea (11 variants) — 멀티라인
- 303×189px, 필드 내부 높이 ≈ 136px

#### Textfield Button (11 variants) — 오른쪽에 버튼
- 303×101px, 필드 + Small 버튼 조합

#### Searchfield (2 variants)
| Status | width | height | pad H | pad V | r | fill |
|--------|-------|--------|-------|-------|---|------|
| Inactive/Active | 335px | 48px | 16 | 12 | 8 | `#F8F9FA` |

- 왼쪽 돋보기 아이콘 포함, gap=8

#### Selection/Select (9 variants) — 드롭다운 인풋
- 303×101px (Textfield와 동일 구조), 오른쪽에 chevron-down 아이콘

---

### 3-6. Checkbox

**Square 타입** (r=4, 실제 사용 권장):
| Size | Dimensions | Status | fill | stroke |
|------|-----------|--------|------|--------|
| Md | 18×18px | Checked | `#2E9BFF` | - |
| Md | 18×18px | Unchecked | - | `#D6D7DB` |
| Md | 18×18px | Disable | `#D6D7DB` | - |
| Sm | 16×16px | Checked | `#2E9BFF` | - |
| Sm | 16×16px | Unchecked | - | `#D6D7DB` |

**Checkmark 타입** (원형 체크마크):
| Size | Dimensions |
|------|-----------|
| Lg | 22×22px |
| Md | 18×18px |
| Sm | 16×16px |
| Xs | 14×14px |

---

### 3-7. Radio

| Size | Dimensions | gap |
|------|-----------|-----|
| Lg | 22×22px | 8 |
| Md | 18×18px | 8 |
| Sm | 16×16px | 8 |
| Xs | 14×14px | 8 |

**Radio Text** (라디오 + 텍스트 레이블):
| Size | width | height |
|------|-------|--------|
| Lg | 109px | 30px |
| Md | 94px | 24px |

- Checked: 내부 원 `#2E9BFF`, 외부 링 `#2E9BFF`
- Unchecked: 외부 링 `#D6D7DB`
- Disable: `#D6D7DB`

---

### 3-8. Toggle

| Size | width | height | Active fill | Inactive fill |
|------|-------|--------|------------|---------------|
| Sm | 36px | 24px | `#2E9BFF` | `#D6D7DB` |
| Default | 52px | 33px | `#2E9BFF` | `#D6D7DB` |

- 핸들(thumb): 흰색 원

---

### 3-9. Tabs

#### Line 타입 (하단 밑줄)
| Size | width | height | pad T | pad B | Active stroke | Inactive stroke |
|------|-------|--------|-------|-------|--------------|----------------|
| Small | 22px | 38px | 8 | 10 | `#2E9BFF` | `#EFEFF0` |
| Default | 28px | 42px | 8 | 10 | `#2E9BFF` | `#EFEFF0` |
| Large | 34px | 46px | 8 | 10 | `#2E9BFF` | `#EFEFF0` |

#### Box 타입 (상단 밑줄, 박스형)
| Size | width | height | pad H | pad T | pad B | Active stroke | Inactive stroke |
|------|-------|--------|-------|-------|-------|--------------|----------------|
| Small | 46px | 34px | 12 | 6 | 12 | `#030303` | - |
| Default | 52px | 38px | 12 | 6 | 12 | `#030303` | - |
| Large | 58px | 42-46px | 12 | 6 | 12 | `#030303` | - |

#### Round 타입 (pill 형태)
| Size | width | height | pad H | pad V | r | Active fill | Inactive fill | Inactive stroke |
|------|-------|--------|-------|-------|---|------------|--------------|----------------|
| Small | 38px | 24px | 8 | 2 | 200 | `#2E9BFF` | `#FFFFFF` | `#A4A4A8` |
| Default | 60px | 32px | 16 | 4 | 200 | `#2E9BFF` | `#FFFFFF` | `#A4A4A8` |
| Large | 70px | 40px | 18 | 6 | 200 | `#2E9BFF` | `#FFFFFF` | `#A4A4A8` |

#### Rectangle 타입 (각진 형태)
| Size | width | height | pad H | pad V | r | Active fill | Inactive stroke |
|------|-------|--------|-------|-------|---|------------|----------------|
| Small | 38px | 24px | 8 | 2 | 4 | `#030303` | `#A4A4A8` |
| Default | 52px | 32px | 12 | 4 | 4 | `#030303` | `#A4A4A8` |
| Large | 70px | 40px | 18 | 6 | 4 | `#030303` | `#A4A4A8` |

---

### 3-10. Label / Tag

**Label (태그형 레이블)**:
| Size | width | height | pad H | pad V | r | fill |
|------|-------|--------|-------|-------|---|------|
| Sm | 37px | 17px | 4 | - | 4 | `#58AFFF` |
| Md | 46px | 22px | 8 | 2 | 4 | `#58AFFF` |

---

### 3-11. Badge

**Number/New 타입 (알림 뱃지)**:
| Size | width | height | r | fill |
|------|-------|--------|---|------|
| Xs | 16px | 16px | 100 | `#FF5247` |
| Sm | 20px | 20px | 100 | `#FF5247` |
| Md | 24px | 24px | 100 | `#FF5247` |

**Dot 타입 (점 표시)**:
| Size | width | height | pad |
|------|-------|--------|-----|
| Xs | 20px | 20px | 8 |
| Sm | 20px | 20px | 7 |
| Md | 24px | 24px | 6 |

---

### 3-12. Toast

| Variant | width | height | pad H | pad V | r | fill |
|---------|-------|--------|-------|-------|---|------|
| Normal/Positive/Warning/Negative | 257px | 48px | 20 | 12 | 100 | `#63636F` |

- 텍스트 컬러: White(`#FFFFFF`)
- 화면 중앙 하단에 표시

---

### 3-13. Snackbar

| Type | width | height | pad H | pad V | r | fill |
|------|-------|--------|-------|-------|---|------|
| Default | 335px | 67px | 16 | 12 | 12 | `#63636F` |

- 텍스트 + 버튼 조합 (Toast보다 넓음)

---

### 3-14. Accordion

| Size | Status | width | height | pad | r | gap | fill |
|------|--------|-------|--------|-----|---|-----|------|
| Lg | Close | 319px | 52px | 16 | 14 | 8 | `#E6E6E7` |
| Lg | Open | 319px | 201px | 16 | 14 | 8 | `#E6E6E7` |
| Md | Close | 323px | 52px | 14 | 12 | 8 | `#E6E6E7` |
| Md | Open | 323px | 179px | 14 | 12 | 8 | `#E6E6E7` |
| Sm | Close | 323px | 52px | 12 | 8 | 8 | `#E6E6E7` |
| Sm | Open | 323px | 133px | 12 | 8 | 8 | `#E6E6E7` |

---

### 3-15. Tooltip

| Caret 방향 | width | height |
|-----------|-------|--------|
| top-left/center/right | 68px | 72px |
| bottom-left/center/right | 68px | 72px |
| right | 73px | 67px |
| left | 73px | 67px |

- 배경: `#2A2C32` (Gray/900), 텍스트: White
- 그림자: `shadow-tooltip` (#ADAFB8 @60%, blur=4)
- gap=-1 (카렛 overlap 처리)

---

### 3-16. Pagination Dot

| Color | Size | width | height | gap |
|-------|------|-------|--------|-----|
| bk (검정) | md | 90px | 10px | 10 |
| bk (검정) | sm | 70px | 6px | 10 |
| wh (흰색) | md | 90px | 10px | 10 |
| wh (흰색) | sm | 70px | 6px | 10 |

- Active dot: Primary/500(`#2E9BFF`), Inactive dot: Gray/300(`#E6E6E7`)

---

### 3-17. Scroll Bar

| Size | width | height | pad H | pad V |
|------|-------|--------|-------|-------|
| Sm | 6px | 160px | 2 | 4 |
| Default | 10px | 160px | 2 | 4 |

- Location: Top/Middle/Bottom (thumb 위치 변형)
- 트랙: `#EFEFF0`, 썸: `#ADAFB8`

---

### 3-18. Dividers

| Type | width | height | pad T | pad B | 용도 |
|------|-------|--------|-------|-------|------|
| divider 1 | 375px | 40px | 20 | 20 | 섹션 간 넓은 구분선 |
| divider 2 | 375px | 16px | 8 | 8 | 일반 구분선 |
| divider 3 | 375px | 36px | 12 | 12 | 중간 구분선 |
| divider 4 | 375px | 0px | - | - | 라인만 (패딩 없음) |
| divider 5 | 375px | 8px | - | - | 좁은 구분 영역 |

- 구분선 컬러: Gray/200(`#EFEFF0`)

---

### 3-19. Cell / List Item

| Type | width | height | pad H | pad V | r | fill |
|------|-------|--------|-------|-------|---|------|
| Inactive | 327px | 52px | 12 | 14 | 8 | - (transparent) |
| Active | 327px | 52px | 12 | 14 | 8 | `#EBF5FF` |
| Move Sm | 327px | 46px | 12 | 12 | 8 | `#E6E6E7` |
| Move Md | 327px | 56px | 14 | 16 | 8 | `#E6E6E7` |

- Active 텍스트 컬러: Primary/500(`#2E9BFF`)
- 오른쪽 화살표 아이콘 포함 (Move 타입)

---

### 3-20. Selection / Select Layer

드롭다운 레이어 항목 (Select 입력 컴포넌트의 옵션 리스트).

| Size | Type | width | height | pad H (l) | pad H (r) | pad V | r | fill | stroke |
|------|------|-------|--------|-----------|-----------|-------|---|------|--------|
| Xs | Active | 79px | 29px | 12 | 10 | 6 | 8 | `#FFFFFF` | `#D6D7DB` |
| Xs | Active Focus | 79px | 29px | 12 | 10 | 6 | 8 | `#F6FAFF` | `#2E9BFF` |
| Sm | Active | 92px | 37px | 14 | 12 | 8 | 8 | `#FFFFFF` | `#D6D7DB` |
| Sm | Active Focus | 92px | 37px | 14 | 12 | 8 | 8 | `#F6FAFF` | `#2E9BFF` |
| Md | Active | 106px | 40px | 16 | 14 | 8 | 8 | `#FFFFFF` | `#D6D7DB` |
| Md | Active Focus | 106px | 40px | 16 | 14 | 8 | 8 | `#F6FAFF` | `#2E9BFF` |

---

### 3-21. Select List

드롭다운 리스트 항목 (전체 너비).

| Size | State | width | height | pad H | pad V | r | fill | stroke |
|------|-------|-------|--------|-------|-------|---|------|--------|
| md | inactive | 335px | 56px | 16 | 16 | 8 | `#F4F5F7` | - |
| md | active | 335px | 56px | 16 | 16 | 8 | `#EBF5FF` | `#2E9BFF` |
| lg | inactive | 335px | 68px | 18 | 20 | 8 | `#F4F5F7` | - |
| lg | active | 335px | 68px | 18 | 20 | 8 | `#EBF5FF` | `#2E9BFF` |

---

### 3-22. Banner

| Type | width | height | pad H | pad V | r | fill |
|------|-------|--------|-------|-------|---|------|
| text banner | 335px | 113px | 18 | 16 | 16 | `#EBF5FF` (Primary/100) |
| noti banner | 335px | 68px | 12 | 12 | 12 | `#F8F9FA` (Gray/50) |
| close banner | 335px | 79px | l16/r35 | 16 | 12 | `#EFEFF0` (Gray/200) |
| line banner | 375px | 42px | 20 | 10 | - | - (full width) |

- text banner: 아이콘 + 텍스트, 파란 배경 강조 배너
- noti banner: 알림형, 회색 배경
- close banner: 닫기 버튼 있음 (오른쪽 padding 35px)
- line banner: 전체 너비, 테두리 없음

---

### 3-23. Layer (드롭다운 패널)

| Size | Type | width | height | r | fill | stroke |
|------|------|-------|--------|---|------|--------|
| Xs | Layer | 79px | 191px | 6 | `#FFFFFF` | `#F4F5F7` |
| Xs | Layer Scroll | 79px | 170px | 6 | `#FFFFFF` | `#F4F5F7` |
| Sm | Layer | 92px | 211px | 6 | `#FFFFFF` | `#F4F5F7` |
| Sm | Layer Scroll | 92px | 186px | 6 | `#FFFFFF` | `#F4F5F7` |
| Md | Layer | 106px | ~230px | 6 | `#FFFFFF` | `#F4F5F7` |
| Md | Layer Scroll | 106px | ~200px | 6 | `#FFFFFF` | `#F4F5F7` |

- 내부에 Selection/Select Layer 항목 반복 배치

---

### 3-24. Progress Bar

| Size | rounded | width | height | track fill |
|------|---------|-------|--------|------------|
| sm | none/full | 375px | 2px | `#EFEFF0` |
| md | none/full | 375px | 4px | `#EFEFF0` |

- percent: 0%~100% (28개 variant)
- Progress fill: `#2E9BFF` (Primary/500)
- rounded=full: r=100, rounded=none: r=0

---

### 3-25. Navi Bar (상단 앱바)

| Type | width | height |
|------|-------|--------|
| home navi bar | 375px | 44px |
| icon-only | 375px | 44px |
| title-center | 375px | 44px |

- 배경: White, 하단 테두리: Gray/200
- icon-only: 왼쪽 뒤로가기 아이콘 or 닫기 아이콘
- title-center: 중앙 타이틀 + 좌/우 아이콘

---

## 4. 컴포넌트 사용 패턴 (플러그인 스케치 작성 지침)

### 4-1. 컬러 토큰 → 실제 Hex 매핑 빠른 참조

| 용도 | 토큰 | Hex |
|------|------|-----|
| 기본 파란색 CTA | Primary/500 | `#2E9BFF` |
| 보조 인디고 CTA | Secondary/500 | `#2E58FF` |
| 비활성/경계선 | Gray/400 | `#D6D7DB` |
| 배경(카드) | Gray/50 | `#F8F9FA` |
| 배경(비활성 인풋) | Gray/100 | `#F4F5F7` |
| 강조 배경(파랑) | Primary/100 | `#EBF5FF` |
| 경고/오류 | Utility/Red 500 | `#FF5247` |
| 성공 | Utility/Green 500 | `#3AD1A9` |
| 본문 텍스트 | Text/Text 900 | `#17171B` |
| 보조 텍스트 | Text/Text 500 | `#67676B` |
| 비활성 텍스트 | Text/Text 300 | `#909094` |

### 4-2. 컴포넌트 선택 지침

- **CTA 버튼**: `buttons` (Size × Color) + 필요 시 `fixedBtn` (고정 하단)
- **텍스트 입력**: `Textinput/Textfield` (기본), `Textinput/Currency` (금액), `Textinput/Textarea` (멀티라인)
- **드롭다운 선택**: `Selection/Select` (인풋) + `Layer` + `Selection/Select Layer` (항목)
- **선택지 목록**: `Select List` (전체 너비 리스트)
- **선택 컨트롤**: `Checkbox` (다중), `Radio` (단일), `toggle` (on/off)
- **탭 내비게이션**: `Tabs/Line` (기본), `Tabs/Round` (pill 스타일)
- **레이블/태그**: `Label` (Small/Medium 크기)
- **알림 뱃지**: `Badge` (Number: 숫자, Dot: 점)
- **피드백**: `Toast` (일시적), `Snackbar` (액션 포함)
- **접기/펼치기**: `Accordion` (Sm/Md/Lg)
- **구분**: `dividers` (1~5 타입, 용도별 높이)
- **목록 항목**: `Cell/List Item` (Inactive/Active/Move)
- **진행 표시**: `Progress Bar` (sm=2px, md=4px)
- **안내 말풍선**: `Tooltip` (카렛 방향 8종)
- **배너**: `Banner` (text/noti/close/line)

### 4-3. 폰트 스택 요약

```
fontFamily: "Pretendard"
fontWeight: 700=Title/Heading, 600=Subtitle, 400=Body
lineHeight: 140%=제목계열, 150%=본문계열
letterSpacing: 0~-0.4px (작은 글씨일수록 작게)
```

### 4-4. 간격/반지름 원칙

- **r=8**: 기본 컴포넌트 (인풋, 버튼, 리스트 항목)
- **r=12**: 큰 컨테이너 (Snackbar, Accordion Md, Banner noti)
- **r=16**: 카드형 배너 (Banner text)
- **r=100**: 완전 pill (Toggle, Toast, Round Tabs)
- **gap=8**: 대부분의 컴포넌트 내부 간격
- **pad=16**: 인풋 기본 패딩 (h), **pad=12~14**: 리스트 아이템

---

## 5. WIP 현황 (Work In Progress)

| 페이지 | 완성도 |
|--------|--------|
| Foundation (Color/Typography/Effect) | ✅ 완성 |
| Button, Fixed Button, Icon Button, Text Button | ✅ 완성 |
| Textinput (Textfield/Currency/Textarea) | ✅ 완성 |
| Checkbox, Radio, Toggle | ✅ 완성 |
| Tabs (Line/Box/Round/Rectangle) | ✅ 완성 |
| Label, Badge | ✅ 완성 |
| Toast, Snackbar | ✅ 완성 |
| Accordion | ✅ 완성 |
| Banner | ✅ 완성 |
| Select List, Layer, Selection | ✅ 완성 |
| Progress Bar | ✅ 완성 |
| Navi Bar | ✅ 완성 |
| Tooltip, Pagination, Scroll Bar | ✅ 완성 |
| Dividers, Cell/List Item | ✅ 완성 |
| Modal, BottomSheet, Chart 컴포넌트 등 | 🚧 WIP (페이지 미완성) |
