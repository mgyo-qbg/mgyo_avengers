# 베러웰스앱 — Figma Plugin Design Kit

> **⚠️ 이 문서는 Claude가 관리합니다. 직접 수정하지 마세요.**  
> 수정이 필요하면 Claude에게 요청하세요. 사용자가 직접 수정할 수 있는 유일한 파일은 이슈별 `{번호}spec.md`입니다.


작성일: 2026-03-10
최종 업데이트: 2026-03-10
검증 기준: #943 인출설계 설문지 플러그인 (issues/feature/943/figma-plugin/)

---

## 개요

새 이슈의 Figma 플러그인을 만들 때 이 파일의 **공유 라이브러리 코드 블록**을 복사해서
`code.js` 상단에 붙여넣고, 이슈별 `buildPage*` 함수만 추가 작성한다.

### 설계 원칙

- DS 컴포넌트를 `importComponentByKeyAsync`로 가져오지 **않는다**
  → 플러그인이 DS 변경에 취약해지고, 스케치 목적에 over-engineering
- DS의 **색상 토큰 / 타이포그래피 값**만 참조해서 primitive로 직접 구현
- 모든 수치(크기, 패딩, 반경)는 이 문서의 상수·컴포넌트를 그대로 따른다

---

## 1. 레이아웃 상수

```js
const W          = 375;   // 화면 너비 (iPhone 기준)
const H          = 812;   // 화면 높이
const STATUS_H   = 44;    // 상태 바 높이
const TOPNAV_H   = 44;    // 탑 내비 높이
const CTA_H      = 88;    // CTA 버튼 영역 (버튼 52 + 상하 패딩)
const TOP_H      = STATUS_H + TOPNAV_H;  // 88
const PAD        = 20;    // 기본 좌우 패딩
const CONTENT_W  = W - PAD * 2;          // 335 (콘텐츠 영역 너비)
```

---

## 2. 컬러 토큰

DS 파일 `wygEtCwUqQJ9p06qsDnBJF` 의 Fill 스타일 값 기준.

```js
const C = {
  // Primary (#2E9BFF)
  primary500: { r: 0.180, g: 0.608, b: 1.000 },

  // Secondary (#2E58FF)
  secondary:  { r: 0.180, g: 0.345, b: 1.000 },

  // Utility
  green300:   { r: 0.227, g: 0.820, b: 0.663 },  // #3AD1A9
  red:        { r: 1.000, g: 0.322, b: 0.278 },  // #FF5247
  yellow:     { r: 1.000, g: 0.784, b: 0.137 },  // #FFC823

  // Gray
  gray50:     { r: 0.976, g: 0.976, b: 0.976 },  // #F9F9F9
  gray100:    { r: 0.949, g: 0.949, b: 0.949 },  // #F2F2F2
  gray200:    { r: 0.878, g: 0.878, b: 0.878 },  // #E0E0E0
  gray400:    { r: 0.631, g: 0.631, b: 0.631 },  // #A1A1A1

  // Text (text700은 없음 — text800 사용할 것)
  text300:    { r: 0.671, g: 0.671, b: 0.671 },  // placeholder
  text500:    { r: 0.427, g: 0.427, b: 0.427 },  // 보조 텍스트
  text800:    { r: 0.149, g: 0.149, b: 0.149 },  // 레이블
  text900:    { r: 0.012, g: 0.012, b: 0.012 },  // 본문/헤더 (#030303)

  // Base
  white:      { r: 1.000, g: 1.000, b: 1.000 },
};
```

---

## 3. 타이포그래피

폰트: **Pretendard** (미설치 시 Inter fallback 자동 적용)

| 역할 | 크기 | 굵기 | 함수 호출 예시 |
|------|------|------|--------------|
| 섹션 헤더 | 20pt | bold | `buildSectionHeader(text)` |
| 서브 헤더 | 14pt | regular | `buildSubHeader(text)` |
| 입력 레이블 | 13pt | semibold | `buildLabel(text)` |
| 본문 / 입력값 | 14pt | regular | — |
| 선택카드 텍스트 | 15pt | semibold | — |
| CTA 버튼 | 16pt | semibold | `buildCTA(label)` |
| 탑 내비 타이틀 | 16pt | semibold | `buildTopNavBack(title)` |
| 헬퍼 텍스트 | 12pt | regular | `buildHelperText(text)` |
| 스텝 인디케이터 | 12pt | medium | `buildStepIndicator(cur, total)` |

---

## 4. 공유 라이브러리 코드

> **새 플러그인 code.js 상단에 이 블록 전체를 복사한다.**
> 이후 이슈별 `buildPage*` 함수만 추가 작성하면 된다.

```js
// ═══════════════════════════════════════════════════════════
// BetterWealth App — Plugin Design Kit (공유 라이브러리)
// 출처: better-wealth-app/figma_plugin_design_kit.md
// 검증: #943 인출설계 설문지
// ═══════════════════════════════════════════════════════════

const W         = 375;
const H         = 812;
const STATUS_H  = 44;
const TOPNAV_H  = 44;
const CTA_H     = 88;
const TOP_H     = STATUS_H + TOPNAV_H;
const PAD       = 20;
const CONTENT_W = W - PAD * 2;

const C = {
  primary500: { r: 0.180, g: 0.608, b: 1.000 },
  secondary:  { r: 0.180, g: 0.345, b: 1.000 },
  green300:   { r: 0.227, g: 0.820, b: 0.663 },
  red:        { r: 1.000, g: 0.322, b: 0.278 },
  yellow:     { r: 1.000, g: 0.784, b: 0.137 },
  gray50:     { r: 0.976, g: 0.976, b: 0.976 },
  gray100:    { r: 0.949, g: 0.949, b: 0.949 },
  gray200:    { r: 0.878, g: 0.878, b: 0.878 },
  gray400:    { r: 0.631, g: 0.631, b: 0.631 },
  text300:    { r: 0.671, g: 0.671, b: 0.671 },
  text500:    { r: 0.427, g: 0.427, b: 0.427 },
  text800:    { r: 0.149, g: 0.149, b: 0.149 },
  text900:    { r: 0.012, g: 0.012, b: 0.012 },
  white:      { r: 1.000, g: 1.000, b: 1.000 },
};

// ── Fonts ──────────────────────────────────────────────────
async function loadFonts() {
  const list = [
    ['Pretendard','Regular'],['Pretendard','Medium'],
    ['Pretendard','SemiBold'],['Pretendard','Bold'],
    ['Inter','Regular'],['Inter','Medium'],
    ['Inter','Semi Bold'],['Inter','Bold'],
  ];
  for (const [family, style] of list) {
    try { await figma.loadFontAsync({ family, style }); } catch (_) {}
  }
}

function gf(w) {
  const m = {
    regular:  [{ family:'Pretendard', style:'Regular'  }, { family:'Inter', style:'Regular'   }],
    medium:   [{ family:'Pretendard', style:'Medium'   }, { family:'Inter', style:'Medium'    }],
    semibold: [{ family:'Pretendard', style:'SemiBold' }, { family:'Inter', style:'Semi Bold' }],
    bold:     [{ family:'Pretendard', style:'Bold'     }, { family:'Inter', style:'Bold'      }],
  };
  return (m[w] || m.regular)[0];
}

// ── Primitives ─────────────────────────────────────────────
function solid(color, opacity) {
  const f = { type: 'SOLID', color };
  if (opacity !== undefined) f.opacity = opacity;
  return [f];
}

function mkText(chars, size, weight, color, opacity) {
  const t = figma.createText();
  try { t.fontName = gf(weight); } catch (_) {}
  t.characters = String(chars);
  t.fontSize = size;
  t.fills = solid(color, opacity);
  return t;
}

function mkRect(w, h, color, radius, opacity) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = solid(color);
  if (radius) r.cornerRadius = radius;
  if (opacity !== undefined) r.opacity = opacity;
  return r;
}

function mkEllipse(w, h, color) {
  const e = figma.createEllipse();
  e.resize(w, h);
  e.fills = solid(color);
  return e;
}

// hf: HORIZONTAL auto-layout frame
// opts: { gap, px, py, pt, pb, pl, pr, p, align, justify, bg, bgOp, radius, clip, stroke, strokeW }
function hf(name, w, h, opts) {
  opts = opts || {};
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = 'HORIZONTAL';
  f.counterAxisAlignItems = opts.align   || 'CENTER';
  f.primaryAxisAlignItems = opts.justify || 'MIN';
  f.itemSpacing   = opts.gap || 0;
  f.paddingTop    = opts.pt  || opts.py || opts.p || 0;
  f.paddingBottom = opts.pb  || opts.py || opts.p || 0;
  f.paddingLeft   = opts.pl  || opts.px || opts.p || 0;
  f.paddingRight  = opts.pr  || opts.px || opts.p || 0;
  f.fills = opts.bg ? solid(opts.bg, opts.bgOp) : [];
  if (opts.radius) f.cornerRadius = opts.radius;
  if (opts.clip)   f.clipsContent = true;
  if (opts.stroke) { f.strokes = solid(opts.stroke); f.strokeWeight = opts.strokeW || 1; }
  f.resize(w, h);
  return f;
}

// vf: VERTICAL auto-layout frame
function vf(name, w, h, opts) {
  opts = opts || {};
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = 'VERTICAL';
  f.counterAxisAlignItems = opts.align   || 'MIN';
  f.primaryAxisAlignItems = opts.justify || 'MIN';
  f.itemSpacing   = opts.gap || 0;
  f.paddingTop    = opts.pt  || opts.py || opts.p || 0;
  f.paddingBottom = opts.pb  || opts.py || opts.p || 0;
  f.paddingLeft   = opts.pl  || opts.px || opts.p || 0;
  f.paddingRight  = opts.pr  || opts.px || opts.p || 0;
  f.fills = opts.bg ? solid(opts.bg, opts.bgOp) : [];
  if (opts.radius) f.cornerRadius = opts.radius;
  if (opts.clip)   f.clipsContent = true;
  f.resize(w, h);
  return f;
}

// ── Shared UI Components ────────────────────────────────────

function buildStatusBar() {
  const f = hf('Status Bar', W, STATUS_H, { bg: C.white, justify: 'CENTER', align: 'CENTER' });
  const t = mkText('9:41', 15, 'semibold', C.text900);
  t.textAlignHorizontal = 'CENTER';
  f.appendChild(t);
  return f;
}

// 뒤로가기(<) + 타이틀 탑 내비
function buildTopNavBack(title) {
  const f = hf('Top Nav', W, TOPNAV_H, { bg: C.white, align: 'CENTER', pl: 4, pr: 16, gap: 4 });
  const back = hf('Back Button', 40, 40, { align: 'CENTER', justify: 'CENTER' });
  back.fills = [];
  const arrow = mkText('<', 20, 'regular', C.text900);
  arrow.textAlignHorizontal = 'CENTER';
  back.appendChild(arrow);
  f.appendChild(back);
  const titleText = mkText(title || '', 16, 'semibold', C.text900);
  f.appendChild(titleText);
  titleText.layoutSizingHorizontal = 'FILL';
  return f;
}

// Primary CTA 버튼 영역 (하단 고정)
function buildCTA(label) {
  const wrapper = hf('CTA Area', W, CTA_H, {
    bg: C.white, px: PAD, pt: 12, pb: 24, align: 'CENTER', justify: 'CENTER',
  });
  const btn = hf('CTA Button', CONTENT_W, 52, {
    bg: C.primary500, radius: 12, align: 'CENTER', justify: 'CENTER',
  });
  const btnText = mkText(label, 16, 'semibold', C.white);
  btnText.textAlignHorizontal = 'CENTER';
  btn.appendChild(btnText);
  wrapper.appendChild(btn);
  btn.layoutSizingHorizontal = 'FILL';
  return wrapper;
}

// 스텝 인디케이터 (n / total + 프로그레스 바)
function buildStepIndicator(current, total) {
  const STEP_H = 28;
  const wrapper = vf('Step Indicator', W, STEP_H, { bg: C.white, gap: 6, pt: 8, pb: 0 });
  const label = mkText(current + ' / ' + total, 12, 'medium', C.text500);
  label.textAlignHorizontal = 'CENTER';
  wrapper.appendChild(label);
  label.layoutAlign = 'STRETCH';
  const barBg = hf('Progress Bar', W, 3, { radius: 0 });
  barBg.fills = solid(C.gray100);
  barBg.clipsContent = true;
  const fillW = Math.round(W * (current / total));
  const barFill = mkRect(fillW, 3, C.primary500);
  barBg.appendChild(barFill);
  barFill.layoutPositioning = 'ABSOLUTE';
  barFill.x = 0; barFill.y = 0;
  wrapper.appendChild(barBg);
  barBg.layoutSizingHorizontal = 'FILL';
  return wrapper;
}

// 루트 프레임 빌더
// opts: { navTitle, ctaLabel, cta(bool), pageNo, pageTotal }
// 반환: { root, scroll } — scroll에 콘텐츠를 appendChild
function buildRoot(name, opts) {
  opts = opts || {};
  const hasCTA = opts.cta !== false;
  const hasStep = opts.pageNo !== undefined;
  const root = vf(name, W, H, { bg: C.white, clip: true });

  const statusBar = buildStatusBar();
  root.appendChild(statusBar);
  statusBar.layoutSizingHorizontal = 'FILL';

  const topNav = buildTopNavBack(opts.navTitle || '');
  root.appendChild(topNav);
  topNav.layoutSizingHorizontal = 'FILL';

  if (hasStep) {
    const step = buildStepIndicator(opts.pageNo, opts.pageTotal || 8);
    root.appendChild(step);
    step.layoutSizingHorizontal = 'FILL';
  }

  const scroll = vf('Scroll Content', W, 100, {
    bg: C.white, clip: true, px: PAD, pt: 24, pb: 24, gap: 20,
  });
  root.appendChild(scroll);
  scroll.layoutSizingHorizontal = 'FILL';
  scroll.layoutSizingVertical   = 'FILL';

  if (hasCTA) {
    const cta = buildCTA(opts.ctaLabel || '다음');
    root.appendChild(cta);
    cta.layoutSizingHorizontal = 'FILL';
  }

  return { root, scroll };
}

// ── 입력 UI 컴포넌트 ────────────────────────────────────────

// 섹션 헤더 (20pt bold)
function buildSectionHeader(text) { return mkText(text, 20, 'bold', C.text900); }

// 서브 헤더 (14pt regular, 자동 너비)
function buildSubHeader(text) {
  const t = mkText(text, 14, 'regular', C.text500);
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  return t;
}

// 입력 필드 레이블 (13pt semibold)
function buildLabel(text) { return mkText(text, 13, 'semibold', C.text800); }

// 셀렉트박스 (48h, 테두리 gray200, 오른쪽 chevron)
function buildSelectBox(placeholder, w) {
  w = w || CONTENT_W;
  const box = hf('Select Box', w, 48, {
    bg: C.white, radius: 10, px: 16, align: 'CENTER',
    justify: 'SPACE_BETWEEN', stroke: C.gray200, strokeW: 1,
  });
  box.primaryAxisAlignItems = 'SPACE_BETWEEN';
  const txt = mkText(placeholder, 14, 'regular', C.text800);
  box.appendChild(txt);
  txt.layoutSizingHorizontal = 'FILL';
  const chevron = mkText('v', 12, 'regular', C.gray400);
  box.appendChild(chevron);
  return box;
}

// 텍스트 입력 (48h, 테두리 gray200, placeholder + 선택적 suffix 단위)
function buildTextInput(placeholder, suffix) {
  const box = hf('Text Input', CONTENT_W, 48, {
    bg: C.white, radius: 10, px: 16, align: 'CENTER', gap: 8,
    stroke: C.gray200, strokeW: 1,
  });
  const txt = mkText(placeholder, 14, 'regular', C.text300);
  box.appendChild(txt);
  txt.layoutSizingHorizontal = 'FILL';
  if (suffix) {
    const sfx = mkText(suffix, 14, 'medium', C.text500);
    box.appendChild(sfx);
  }
  return box;
}

// 읽기 전용 필드 (48h, 배경 gray50, 테두리 gray100)
function buildReadonlyField(value) {
  const box = hf('Readonly Field', CONTENT_W, 48, {
    bg: C.gray50, radius: 10, px: 16, align: 'CENTER',
    stroke: C.gray100, strokeW: 1,
  });
  const txt = mkText(value, 14, 'regular', C.gray400);
  box.appendChild(txt);
  txt.layoutSizingHorizontal = 'FILL';
  return box;
}

// 선택 카드 (72h, 선택 시 primary 테두리 2px, 미선택 시 gray 1px)
function buildChoiceCard(text, isSelected) {
  const card = hf('Choice Card', CONTENT_W, 72, {
    bg: C.white, radius: 12, px: 20, align: 'CENTER',
    justify: 'SPACE_BETWEEN',
    stroke: isSelected ? C.primary500 : C.gray200,
    strokeW: isSelected ? 2 : 1,
  });
  card.primaryAxisAlignItems = 'SPACE_BETWEEN';
  const label = mkText(text, 15, 'semibold', isSelected ? C.primary500 : C.text800);
  card.appendChild(label);
  label.layoutSizingHorizontal = 'FILL';
  const indicator = mkEllipse(20, 20, isSelected ? C.primary500 : C.gray200);
  card.appendChild(indicator);
  return card;
}

// 헬퍼 텍스트 (12pt regular, text500)
function buildHelperText(text) { return mkText(text, 12, 'regular', C.text500); }

// 세그먼트 피커 (첫 번째 항목 선택 상태로 렌더링)
function buildPicker(options) {
  const itemW = Math.floor((CONTENT_W - (options.length - 1)) / options.length);
  const picker = hf('Picker', CONTENT_W, 52, { bg: C.gray100, radius: 12, gap: 1 });
  options.forEach((label, i) => {
    const isFirst = i === 0;
    const item = hf('Picker-' + label, itemW, 50, {
      align: 'CENTER', justify: 'CENTER',
      bg: isFirst ? C.white : C.gray100, radius: 10,
    });
    const txt = mkText(label, 15, isFirst ? 'semibold' : 'regular',
      isFirst ? C.text900 : C.text500);
    txt.textAlignHorizontal = 'CENTER';
    item.appendChild(txt);
    picker.appendChild(item);
  });
  return picker;
}
```

---

## 5. 화면 구조 패턴

### 설문 스텝 화면 (표준)

```
buildRoot('P4 - ...', { navTitle: '인출설계', ctaLabel: '다음', pageNo: 1, pageTotal: 8 })
  └── root (375×812, VERTICAL)
      ├── StatusBar      (44h, FILL)
      ├── Top Nav        (44h, FILL)
      ├── Step Indicator (28h, FILL)  ← pageNo 있을 때만
      ├── Scroll Content (FILL, FILL) ← scroll에 콘텐츠 append
      └── CTA Area       (88h, FILL)  ← cta:false 로 숨길 수 있음
```

### 진입/완료 화면 (스텝 없음)

```
buildRoot('P1 - 설문 시작', { navTitle: '인출설계', ctaLabel: '시작하기' })
  // pageNo 없으면 Step Indicator 미생성
```

### 필드 그룹 패턴

```js
const group = vf('Field - 은퇴시기', CONTENT_W, 80, { gap: 8 });
group.fills = [];
group.appendChild(buildLabel('은퇴 예상 시기'));
group.appendChild(buildSelectBox('65세'));
scroll.appendChild(group);
```

---

## 6. 절대 배치 규칙

auto-layout 흐름에서 빠져야 하는 요소 (배지, 보더, 오버레이 등)는
`layoutPositioning = 'ABSOLUTE'`를 반드시 `appendChild` 이후에 설정한다.

```js
parent.appendChild(child);
child.layoutPositioning = 'ABSOLUTE';  // ← append 이후에만
child.x = 0; child.y = 0;
```

FILL 크기 설정도 동일하게 append 이후에만:

```js
parent.appendChild(child);
child.layoutSizingHorizontal = 'FILL'; // ← append 이후에만
```

---

## 7. 플러그인 파일 생성 체크리스트

새 이슈 플러그인 생성 시:

- [ ] `issues/feature/{번호}/figma-plugin/` 폴더 생성
- [ ] `manifest.json` — name, id, main, ui 설정
- [ ] `code.js` — 이 문서 섹션 4 전체 복사 → 이슈별 buildPage* 추가
- [ ] `ui.html` — 페이지 체크박스 목록 (943 ui.html 참고)
- [ ] Figma Desktop: Import from manifest → `issues/feature/{번호}/figma-plugin/manifest.json`

---

## 8. 디자인 시스템 참조 정보

- DS 파일 키: `wygEtCwUqQJ9p06qsDnBJF` (수정 금지)
- 스타일: FILL 86개, TEXT 29개, EFFECT 7개, GRID 2개 (총 124개)
- 컴포넌트: 765개
- 폰트: Pretendard (fallback: Inter)
- DS 분석 문서: `better-wealth-app/figma_design_system.md`
