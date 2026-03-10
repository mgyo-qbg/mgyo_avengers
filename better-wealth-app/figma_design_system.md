# 베러웰스앱 Figma 디자인 시스템 분석

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**  
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.


파일명: [베러웰스앱] NEW 디자인 시스템
File Key: wygEtCwUqQJ9p06qsDnBJF
최종 수정: 2026-02-11
작성자: ipsae
총 컴포넌트: 765개 | 스타일: 124개

---

## 1. 페이지 구조 (총 27개 페이지)

### Overview
- Cover, Index

### Updates (변경 이력)
- 25.08 ~ 25.12 월별 섹션 (5개월)

### Foundation (6개 페이지)
| 페이지 | 내용 |
|--------|------|
| Color | 컬러 토큰 체계 |
| Icon | 아이콘 131개 (단색 SVG) |
| Img_icon | 이미지 아이콘 115개 (금융기관 심볼 등) |
| Text style | 타이포그래피 스케일 |
| Shadow / Round | 그림자 7단계, 라운드 시스템 |
| Grid | 그리드/스페이싱 시스템 |

### Component (16개 페이지)
| 페이지 | 컴포넌트 수 |
|--------|-----------|
| Accordion/Cell | 11 |
| Badge/Snackbar/Toast | 14 |
| Banner | 31 |
| Button | 167 |
| Calendar | WIP (컴포넌트 미등록) |
| Card | 1 |
| Checkbox/Toggle/Radio | 65 |
| Divider | 5 |
| Loading (Skeleton) | 28 |
| Modal | WIP (섹션만 존재) |
| Navigation | 40 |
| Selection | 44 |
| Tab | 24 |
| Tag/Label | 18 |
| Textinput | 56 |
| Tooltip | 8 |
| Top Navi bar | 3 |

### "추가중........" (WIP)
- Tooltip 2개, label 2개 잔류 — 정리 필요

---

## 2. 컴포넌트 상세

### Button (167개) — 가장 방대
- buttons/: Variant x Radius x Color x Size = 150개
  - Variant: Default/Pressed/Outline/Disabled
  - Radius: R8/R100
  - Color: Primary/Secondary/Gray
  - Size: Xsmall~Xlarge
- Text button/: Size(Xs/Sm/Md) x Variant(Primary/Assistive/Negative/Disable/Icon) = 12개
- Icon button/: Size x Type = 16개
- fixedBtn/: Type(primary/secondary/gray/disabled) x Style(default/double1/double2)
- Modal button/: style(default/double1/double2/double3)

### Checkbox/Toggle/Radio (65개)
- Checkbox: Type(Round/Square/Checkmark) x Size(Xs~Lg) x Status(Checked/Unchecked/Disable/Indeterminate)
- Radio: Status(Checked/Unchecked/Disable) x Size(Xs~Lg)
- Toggle: Active(On/Off) x Size(Default/Sm)

### Icon (131개)
- Arrows 계열: 방향 화살표, 셰브론
- Basic 계열: lock, copy, calendar, eye 등
- Check 계열: checkmark, close, info, alert, warning
- Asset 계열: card, wallet, calculator, piechart, trending (금융 특화)

### Img_icon (115개)
- 금융기관 심볼 (은행/증권/보험/저축은행 등) 약 97개
- 3D 아이콘 (chart, bell, clock, lock 등) 약 12개
- 기타 (인증서, AI, money)

### Selection (44개)
- Select, Select Layer, Resource, Scroll Bar, Select List, Layer

### Textinput (56개)
- Textfield: Type(Default/Error/Disable/Positive/Readonly) x Status(Inactive/Focus/Active/Active Focus)
- Currency: 금액 입력 전용
- Textarea: 여러 줄 입력
- Searchfield: 검색 전용

---

## 3. 컬러 토큰 (86개 FILL 스타일)

| 카테고리 | 토큰 수 | 비고 |
|---------|--------|------|
| Primary | 12 | 50~900 + Dark/Light, #2E9BFF |
| Secondary | 12 | 50~900 + Dark/Light, #2E58FF |
| Gray | 10 | 50~900 |
| Text | 10 | 50~900 |
| Utility/Green | 6 | 100~500 + Dark, #3AD1A9 |
| Utility/Red | 6 | 100~500 + Dark, #FF5247 |
| Utility/Yellow | 6 | 100~500 + Dark, #FFC823 |
| Asset | 7 | Bond Domestic/Overseas, Cash, Etc, Stock Domestic/Overseas, Unclassified |
| Chart | 15 | 차트 전용 팔레트 1~15 |
| Black/White | 2 | #030303 / #FFFFFF |

---

## 4. 타이포그래피 (29개 TEXT 스타일)

폰트: Pretendard

| 카테고리 | 스케일 |
|---------|--------|
| Heading | 1, 2, 3 |
| Title | 3xsmall ~ 2xlarge (9단계) |
| Subtitle | 2xsmall ~ 2xlarge (8단계) |
| Body | Tiny, Caption, 2xsmall ~ 2xlarge (9단계) |

fixedBtn 기준: fontWeight 700, fontSize 18px, lineHeight 140%, letterSpacing -0.2px

---

## 5. 이펙트 (7개) / 그리드 (2개)

이펙트: shadow-sm, shadow, shadow-md, shadow-lg, shadow-xl, shadow-2xl, shadow-tooltip
그리드: Mobile-2 col(default), Mobile-5 col

---

## 6. WIP 현황 및 개선 포인트

### WIP 비율
- 컴포넌트 페이지 16개 중 11개(69%)가 WIP 상태
- Icon, Img_icon, Badge/Snackbar/Toast, Calendar, Card, Checkbox/Toggle/Radio,
  Loading, Navigation, Selection, Tag/Label, Textinput

### 네이밍 오타 (4건)
- "Ractangle" -> Rectangle (Tab 컴포넌트)
- "Satus" -> Status (Currency Textinput)
- "Nomal" -> Normal (Skeleton)
- "basic-hambuger" -> hamburger (Icon)

### 주요 개선 포인트
1. Button 167개 variant — 미사용 조합 정리 권장
2. Modal 컴포넌트 미등록 — 섹션만 존재
3. Calendar 미완성 — 컴포넌트 미등록
4. Card 빈약 — 1개(img_card)만 존재
5. 데스크톱 그리드 없음 — Mobile만 정의
6. "추가중........" 임시 페이지 정리 필요
7. Updates 로그 미갱신 (25.12 이후 없음)
8. Storybook 연동 — Button만 적용 (storybook-better.qbw.co.kr), 전체 확대 필요
