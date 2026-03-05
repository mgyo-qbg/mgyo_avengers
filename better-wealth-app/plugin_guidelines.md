# BetterWealth 앱 — Figma Plugin 화면 제작 가이드

작성일: 2026-03-05
대상: 앱-디자이너

---

## 1. 개요 및 목적

요구사항이 들어오면 **Figma Plugin API(code.js)** 를 작성하여 Figma 파일에 화면을 자동으로 그린다.
수동 Figma 작업 없이 코드로 일관된 화면을 빠르게 생성하는 것이 목표다.

### 검증된 접근법
- 홈 화면 스케치 생성 플러그인으로 기본 골자가 검증됨 (2026-03-05)
- 375×812pt (iPhone), VERTICAL auto-layout 루트 프레임 구조 확립
- 오류 해결 이력:
  - `FILL can only be set on children of auto-layout frames` → append 후에만 FILL 설정
  - Border rect가 auto-layout 흐름에 포함되어 탭 밀림 → `layoutPositioning = 'ABSOLUTE'` 적용

---

## 2. 핵심 제약사항 (반드시 준수)

### 디자인 시스템 관련
| 규칙 | 설명 |
|------|------|
| **DS 파일 수정 금지** | wygEtCwUqQJ9p06qsDnBJF 파일에 직접 수정/컴포넌트 생성 불가 |
| **DS 오너 별도** | 디자인 시스템은 별도 오너가 관리 — 우리 권한 밖 |
| **기존 컴포넌트 활용** | DS에 있는 컴포넌트는 `figma.importComponentByKeyAsync(nodeId)`로 가져와 사용 |
| **없는 컴포넌트** | DS에 없는 요소는 대상 파일 내에서만 일반 프레임으로 임시 생성 |

### 플러그인 동작 관련
| 규칙 | 설명 |
|------|------|
| **대상 파일** | mgyo_note (AioSbUjrVBRnqTpFsltOC5) — 여기에만 프레임 생성 |
| **FILL 설정 순서** | `layoutSizingHorizontal/Vertical = 'FILL'`은 항상 `parent.appendChild(child)` 이후에 설정 |
| **절대 배치 요소** | border, badge 등 auto-layout 흐름에서 빠져야 할 요소는 `layoutPositioning = 'ABSOLUTE'` |
| **고정 크기 원칙** | 모든 프레임은 `resize(w, h)`로 명시적 크기 지정, FILL은 루트 auto-layout 자식에만 |

---

## 3. 디자인 시스템 주요 컴포넌트 목록

파일: wygEtCwUqQJ9p06qsDnBJF

### 활용 가능한 기존 컴포넌트 (Node ID)

| 컴포넌트명 | Set ID | 주요 Variant |
|-----------|--------|-------------|
| Navi bar | 179:531 | Type=home navi bar (247:73) |
| Icons/basic-bell | 1146:765 | 알림 아이콘 |
| Icons/basic-setting | 1146:768 | 설정 아이콘 |
| Icons/basic-home | 1146:753 | Bottom nav 홈 |
| Icons/basic-hambuger | 1146:763 | Bottom nav 더보기 |
| Icons/basic-copy1 | 1146:767 | Bottom nav 리포트 |
| Badge | 1429:1529 | Type=Dot/New, Size=Xs |
| img_card | 642:676 | 카드 베이스 |
| Return Rate | 236:65 | up/down, Size=Xs |
| 3d-icon | 238:210 | 빠른 메뉴 아이콘 |
| Cell/List Item | 805:742 | Type=Active, Move Md |
| Text button | 132:660 | Sm, Assistive |
| dividers | 138:1189 | 섹션 구분선 |
| Accordion/Cell | - | 리스트 |
| Checkbox/Toggle/Radio | - | 입력 요소 |
| Textinput | - | 입력 필드 |
| Selection | - | 드롭다운 |
| Tab | - | 탭 컴포넌트 |

### DS에 없는 요소 (대상 파일 내 임시 생성)
- Bottom Navigation Bar (5탭)
- Asset Summary Card (확장형)
- Quick Menu Tile

---

## 4. 컬러 토큰

```js
const C = {
  primary500: { r: 0.180, g: 0.608, b: 1.000 },  // #2E9BFF
  secondary:  { r: 0.180, g: 0.345, b: 1.000 },  // #2E58FF
  green300:   { r: 0.227, g: 0.820, b: 0.663 },  // #3AD1A9
  red:        { r: 1.000, g: 0.322, b: 0.278 },  // #FF5247
  yellow:     { r: 1.000, g: 0.784, b: 0.137 },  // #FFC823
  gray50:     { r: 0.976, g: 0.976, b: 0.976 },  // #F9F9F9
  gray100:    { r: 0.949, g: 0.949, b: 0.949 },  // #F2F2F2
  gray200:    { r: 0.878, g: 0.878, b: 0.878 },  // #E0E0E0
  gray400:    { r: 0.631, g: 0.631, b: 0.631 },  // #A1A1A1
  text300:    { r: 0.671, g: 0.671, b: 0.671 },
  text500:    { r: 0.427, g: 0.427, b: 0.427 },
  text800:    { r: 0.149, g: 0.149, b: 0.149 },
  text900:    { r: 0.012, g: 0.012, b: 0.012 },
  white:      { r: 1.000, g: 1.000, b: 1.000 },
  // Asset 토큰 (파이차트용)
  stockDom, stockOvs, bondDom, bondOvs, cash, etc
};
```

---

## 5. 타이포그래피

폰트: **Pretendard** (없으면 Inter fallback)

| 스타일명 | 용도 | 크기 | 굵기 |
|---------|------|------|------|
| Heading/2 | 자산 금액 등 대형 숫자 | 26pt | Bold |
| Title/Large | 인사말, 섹션 타이틀 | 20pt | Bold |
| Title/Small | 섹션 헤더 | 15pt | SemiBold |
| Subtitle/Regular | 메뉴 라벨 | 13pt | SemiBold |
| Body/Regular | 본문 | 14pt | Regular |
| Body/Small | 보조 텍스트 | 12pt | Regular |
| Body/Caption | 시간, 메타 | 11pt | Regular |
| Body/Tiny | Bottom Nav 라벨 | 10pt | Regular/SemiBold |

---

## 6. 플러그인 파일 구조

```
/Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-app/figma-plugin/
├── manifest.json          # 플러그인 메타 (단일 커맨드)
├── code.js                # 메인 플러그인 로직
└── ui.html                # 섹션 선택 UI 패널
```

### Figma Desktop 실행 방법
1. mgyo_note 파일(AioSbUjrVBRnqTpFsltOC5) 열기
2. Plugins → Development → Import plugin from manifest...
3. `/Users/imsi/Desktop/qbg/repo/mgyo_avengers/better-wealth-app/figma-plugin/manifest.json` 선택
4. Plugins → Development → BetterWealth 홈 화면 생성

---

## 7. 코드 패턴 (code.js 표준)

### 프레임 생성
```js
// 고정 크기 auto-layout frame
function hf(name, w, h, opts) { /* HORIZONTAL */ }
function vf(name, w, h, opts) { /* VERTICAL   */ }

// FILL은 반드시 appendChild 이후에 설정
parent.appendChild(child);
child.layoutSizingHorizontal = 'FILL'; // ← 반드시 이 순서

// 절대 배치 (auto-layout 흐름 제외)
frame.appendChild(borderRect);
borderRect.layoutPositioning = 'ABSOLUTE';
borderRect.x = 0; borderRect.y = 0;
```

### 루트 프레임 구조 (검증된 패턴)
```
root (VERTICAL auto-layout, 375×812, FIXED)
├── Status Bar    (FIXED 44pt, FILL width)
├── Top Nav       (FIXED 44pt, FILL width)
├── Scroll Area   (FILL height, FILL width, clipsContent=true)
│   └── 콘텐츠들 (절대좌표 배치)
└── Bottom Nav    (FIXED 84pt, FILL width)
```

### 높이 상수
```js
const W        = 375;
const H        = 812;
const TOP_H    = 88;   // StatusBar(44) + TopNav(44)
const BOTTOM_H = 84;   // BottomNav
const SCROLL_H = 640;  // H - TOP_H - BOTTOM_H
```

---

## 8. 화면 제작 프로세스

요구사항이 오면 아래 순서로 진행:

1. **요구사항 분석** — 화면 목적, 포함할 섹션, 데이터 구조 파악
2. **DS 컴포넌트 매핑** — 사용할 수 있는 기존 컴포넌트 확인 (섹션 3 참조)
3. **없는 요소 파악** — DS에 없으면 대상 파일 내 일반 프레임으로 생성 계획
4. **code.js 작성/수정** — 섹션 빌더 함수 단위로 구성
5. **ui.html 업데이트** — 필요 시 섹션 선택 옵션 추가
6. **실행 및 검증** — 사용자가 Figma Desktop에서 직접 실행

---

## 9. 알려진 이슈 및 해결책

| 이슈 | 원인 | 해결 |
|------|------|------|
| `FILL can only be set on children of auto-layout frames` | FILL을 appendChild 이전에 설정 | append 후 설정 |
| 탭/요소가 오른쪽으로 밀림 | border rect가 auto-layout 흐름에 포함됨 | `layoutPositioning = 'ABSOLUTE'` |
| 콘텐츠가 Bottom Nav와 겹침 | 고정 y좌표 방식 + 섹션 높이 합산 오류 | 루트 VERTICAL auto-layout + SCROLL_H 분리 |
| Pretendard 폰트 없음 | 시스템 미설치 | Inter fallback 로직 포함 |

---

## 10. 앞으로의 요구사항 대응 원칙

- 새 화면 요청 → `code.js`에 새 섹션 빌더 추가 또는 새 플러그인 파일 생성
- 기존 화면 수정 → 해당 빌더 함수만 수정
- DS 컴포넌트 활용 시 → `figma.importComponentByKeyAsync(nodeId)` 사용
- DS에 없는 컴포넌트 필요 시 → 대상 파일 내 프레임으로 생성, DS 오너에게 추가 요청 의견 전달
- 여러 화면 요청 시 → manifest `menu` 배열로 복수 커맨드 지원 가능 (필요 시 확장)
