// #1114 인출설계 설문지 — Figma Plugin v2
// DS 기반 전면 재작성 (2026-03-10)
// 컬러/치수 출처: figma_design_system.md (Figma REST API 전수 조회)

const W = 375;
const H = 812;
const STATUS_H = 44;
const TOPNAV_H = 44;
const TOP_H = STATUS_H + TOPNAV_H;
const PAD = 20;
const CONTENT_W = W - PAD * 2;

// ── Design Tokens (DS 실측값 — figma_design_system.md 기준) ────────────
// hex → figma rgb (0~1 범위)
function hex(r, g, b) { return { r: r/255, g: g/255, b: b/255 }; }

const C = {
  // Primary (#2E9BFF)
  primary50:   hex(246, 250, 255),   // #F6FAFF
  primary100:  hex(235, 245, 255),   // #EBF5FF  ← active 배경
  primary500:  hex( 46, 155, 255),   // #2E9BFF  ← 메인 CTA
  primary700:  hex( 33, 110, 181),   // #216EB5
  // Secondary (#2E58FF)
  secondary500: hex( 46,  88, 255),  // #2E58FF
  // Gray
  gray50:   hex(248, 249, 250),      // #F8F9FA  ← 배경
  gray100:  hex(244, 245, 247),      // #F4F5F7  ← 인풋 비활성
  gray200:  hex(239, 239, 240),      // #EFEFF0  ← 구분선, 트랙
  gray300:  hex(230, 230, 231),      // #E6E6E7  ← 아코디언 bg
  gray400:  hex(214, 215, 219),      // #D6D7DB  ← 보더(비활성), Unchecked
  gray500:  hex(173, 175, 184),      // #ADAFB8
  gray700:  hex( 99,  99, 111),      // #63636F  ← Toast/Snackbar
  // Text
  text300:  hex(144, 144, 148),      // #909094  ← placeholder
  text500:  hex(103, 103, 107),      // #67676B  ← 보조 텍스트
  text800:  hex( 43,  43,  47),      // #2B2B2F  ← 기본 텍스트
  text900:  hex( 23,  23,  27),      // #17171B  ← 강조 텍스트
  // Utility
  green500: hex( 58, 209, 169),      // #3AD1A9
  red500:   hex(255,  82,  71),      // #FF5247
  // Base
  white:    hex(255, 255, 255),
  black:    hex(  3,   3,   3),      // #030303
};

figma.showUI(__html__, { width: 320, height: 520 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-flowchart') {
    try {
      await loadFonts();
      await buildFlowchart();
      figma.ui.postMessage({ type: 'fc-done' });
    } catch (e) {
      figma.ui.postMessage({ type: 'error', target: 'fc', msg: e.message });
      console.error(e);
    }
  } else if (msg.type === 'create-pages') {
    try {
      await loadFonts();
      const frames = [];
      if (msg.pages.includes(1))  frames.push(buildPage1());
      if (msg.pages.includes(3))  frames.push(buildPage3());
      if (msg.pages.includes(4))  frames.push(buildPage4());
      if (msg.pages.includes(5))  frames.push(buildPage5());
      if (msg.pages.includes(6))  frames.push(buildPage6());
      if (msg.pages.includes(7))  { frames.push(buildPage7()); frames.push(buildPage7Sheet()); }
      if (msg.pages.includes(8))  frames.push(buildPage8());
      if (msg.pages.includes(9))  frames.push(buildPage9());
      if (msg.pages.includes(10)) frames.push(buildPage10());
      if (msg.pages.includes(11)) frames.push(buildPage11());
      if (msg.pages.includes(12)) frames.push(buildPage12());
      if (msg.pages.includes(13)) frames.push(buildPage13());

      let xOff = 0;
      for (const f of frames) {
        figma.currentPage.appendChild(f);
        f.x = xOff;
        f.y = 0;
        xOff += W + 40;
      }

      figma.viewport.scrollAndZoomIntoView(frames);
      figma.ui.postMessage({ type: 'done', count: frames.length });
      figma.closePlugin(`${frames.length}개 페이지 생성 완료`);
    } catch (e) {
      figma.ui.postMessage({ type: 'error', msg: e.message });
      console.error(e);
    }
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// ── Fonts ──────────────────────────────────────────────────────────────
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

// ── Primitives ─────────────────────────────────────────────────────────
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

function hf(name, w, h, opts) {
  opts = opts || {};
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = 'HORIZONTAL';
  f.counterAxisAlignItems = opts.align || 'CENTER';
  f.primaryAxisAlignItems = opts.justify || 'MIN';
  f.itemSpacing   = opts.gap || 0;
  f.paddingTop    = opts.pt  || opts.py || opts.p || 0;
  f.paddingBottom = opts.pb  || opts.py || opts.p || 0;
  f.paddingLeft   = opts.pl  || opts.px || opts.p || 0;
  f.paddingRight  = opts.pr  || opts.px || opts.p || 0;
  f.fills = opts.bg ? solid(opts.bg, opts.bgOp) : [];
  if (opts.radius) f.cornerRadius = opts.radius;
  if (opts.clip) f.clipsContent = true;
  if (opts.stroke) {
    f.strokes = solid(opts.stroke);
    f.strokeWeight = opts.strokeW || 1;
    f.strokeAlign = 'INSIDE';
  }
  f.resize(w, h);
  return f;
}

function vf(name, w, h, opts) {
  opts = opts || {};
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = 'VERTICAL';
  f.counterAxisAlignItems = opts.align || 'MIN';
  f.primaryAxisAlignItems = opts.justify || 'MIN';
  f.itemSpacing   = opts.gap || 0;
  f.paddingTop    = opts.pt  || opts.py || opts.p || 0;
  f.paddingBottom = opts.pb  || opts.py || opts.p || 0;
  f.paddingLeft   = opts.pl  || opts.px || opts.p || 0;
  f.paddingRight  = opts.pr  || opts.px || opts.p || 0;
  f.fills = opts.bg ? solid(opts.bg, opts.bgOp) : [];
  if (opts.radius) f.cornerRadius = opts.radius;
  if (opts.clip) f.clipsContent = true;
  f.resize(w, h);
  return f;
}

// ── Shared DS Components ────────────────────────────────────────────────
// DS: Navi bar 375×44px, 배경 White

function buildStatusBar() {
  const f = hf('Status Bar', W, STATUS_H, { bg: C.white, justify: 'CENTER', align: 'CENTER' });
  const t = mkText('9:41', 15, 'semibold', C.text900);
  t.textAlignHorizontal = 'CENTER';
  f.appendChild(t);
  return f;
}

function buildTopNavBack(title) {
  // DS: Navi bar / title-center — 375×44px, White
  const f = hf('Top Nav', W, TOPNAV_H, {
    bg: C.white, align: 'CENTER', pl: 4, pr: 16, gap: 4,
  });

  const back = hf('Back Button', 40, 40, { align: 'CENTER', justify: 'CENTER' });
  back.fills = [];
  const arrow = mkText('‹', 22, 'regular', C.text900);
  arrow.textAlignHorizontal = 'CENTER';
  back.appendChild(arrow);
  f.appendChild(back);

  const titleText = mkText(title || '', 16, 'semibold', C.text900);
  f.appendChild(titleText);
  titleText.layoutSizingHorizontal = 'FILL';

  return f;
}


function buildCTA(label) {
  // DS: fixedBtn — 375×92px, pad=20 all, gap=8, bg=#FFFFFF @70%
  const wrapper = hf('CTA Area', W, 92, {
    bg: C.white, bgOp: 0.96,
    px: PAD, pt: 20, pb: 20,
    align: 'CENTER', justify: 'CENTER',
  });

  // Dark navy button matching reference UI (#152A56)
  const navy = hex(21, 42, 86);
  const btn = hf('CTA Button', CONTENT_W, 52, {
    bg: navy, radius: 8, align: 'CENTER', justify: 'CENTER',
  });
  // DS: Title/Regular — 18px/700
  const btnText = mkText(label, 18, 'bold', C.white);
  btnText.textAlignHorizontal = 'CENTER';
  btn.appendChild(btnText);
  wrapper.appendChild(btn);
  btn.layoutSizingHorizontal = 'FILL';

  return wrapper;
}

function buildSectionHeader(text) {
  // DS: Title/Medium — 20px/700
  const t = mkText(text, 20, 'bold', C.text900);
  t.lineHeight = { value: 140, unit: 'PERCENT' };
  t.letterSpacing = { value: -0.2, unit: 'PIXELS' };
  return t;
}

function buildSubHeader(text) {
  // DS: Body/Xsmall — 14px/400, lineHeight 150%
  const t = mkText(text, 14, 'regular', C.text500);
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  t.lineHeight = { value: 150, unit: 'PERCENT' };
  t.letterSpacing = { value: -0.2, unit: 'PIXELS' };
  return t;
}

function buildLabel(text) {
  // DS: Subtitle/Xsmall — 13px/600
  const t = mkText(text, 13, 'semibold', C.text800);
  t.letterSpacing = { value: -0.2, unit: 'PIXELS' };
  return t;
}

function buildSelectBox(placeholder, w) {
  // DS: Selection/Select Layer/Md Active — 106×40px, r=8, stroke=#D6D7DB
  // 인풋 전체 컨테이너 높이는 48px 사용 (Searchfield 기준)
  w = w || CONTENT_W;
  const box = hf('Select Box', w, 48, {
    bg: C.white, radius: 8,
    pl: 16, pr: 14, align: 'CENTER', justify: 'SPACE_BETWEEN',
    stroke: C.gray400, strokeW: 1,
  });
  box.primaryAxisAlignItems = 'SPACE_BETWEEN';

  // DS: Body/Xsmall — 14px/400
  const txt = mkText(placeholder, 14, 'regular', C.text800);
  box.appendChild(txt);
  txt.layoutSizingHorizontal = 'FILL';

  // chevron-down
  const chevron = mkText('⌄', 16, 'regular', C.gray500);
  box.appendChild(chevron);

  return box;
}

function buildTextInput(placeholder, suffix) {
  // DS: Textinput/Textfield — 48px height, r=8
  // Active border: #D6D7DB (Inactive는 #F4F5F7 배경)
  const box = hf('Text Input', CONTENT_W, 48, {
    bg: C.gray100, radius: 8,
    pl: 16, pr: 16, align: 'CENTER', gap: 8,
    stroke: C.gray400, strokeW: 1,
  });

  // DS: Body/Xsmall — 14px/400, text300 = placeholder
  const txt = mkText(placeholder, 14, 'regular', C.text300);
  box.appendChild(txt);
  txt.layoutSizingHorizontal = 'FILL';

  if (suffix) {
    // DS: Body/Xsmall — 14px/400 (suffix/unit)
    const sfx = mkText(suffix, 14, 'medium', C.text500);
    box.appendChild(sfx);
  }

  return box;
}

function buildReadonlyField(value) {
  // DS: Textinput/Textfield Readonly — #F4F5F7, r=8
  const box = hf('Readonly Field', CONTENT_W, 48, {
    bg: C.gray100, radius: 8, px: 16, align: 'CENTER',
  });
  // DS: Body/Xsmall — 14px/400, text500 (읽기전용 = 흐린 텍스트)
  const txt = mkText(value, 14, 'regular', C.text500);
  box.appendChild(txt);
  txt.layoutSizingHorizontal = 'FILL';

  // readonly 아이콘 (잠금 표시)
  const lock = mkText('🔒', 12, 'regular', C.text300);
  box.appendChild(lock);
  return box;
}

function buildChoiceCard(text, isSelected) {
  // DS: Cell/List Item — 327×52px, r=8
  // Active: fill=#EBF5FF (Primary/100), Inactive: fill=White, stroke=#D6D7DB
  const card = hf('Choice Card', CONTENT_W, 60, {
    bg: isSelected ? C.primary100 : C.white,
    radius: 8, px: 20, align: 'CENTER', justify: 'SPACE_BETWEEN',
    stroke: isSelected ? C.primary500 : C.gray400,
    strokeW: isSelected ? 2 : 1,
  });
  card.primaryAxisAlignItems = 'SPACE_BETWEEN';

  // DS: Body/Small — 15px/400 → Subtitle/Small — 14px/600
  const label = mkText(text, 15, 'semibold', isSelected ? C.primary500 : C.text800);
  card.appendChild(label);
  label.layoutSizingHorizontal = 'FILL';

  // DS: Radio/Md — 18×18px
  const radio = hf('Radio', 20, 20, {
    radius: 100,
    bg: isSelected ? C.primary500 : C.white,
    stroke: isSelected ? C.primary500 : C.gray400,
    strokeW: 1.5,
  });
  if (isSelected) {
    const dot = mkEllipse(8, 8, C.white);
    radio.appendChild(dot);
    radio.primaryAxisAlignItems = 'CENTER';
    radio.counterAxisAlignItems = 'CENTER';
  }
  card.appendChild(radio);

  return card;
}

function buildHelperText(text) {
  // DS: Body/Caption — 12px/400, lineHeight 140%
  const t = mkText(text, 12, 'regular', C.text500);
  t.letterSpacing = { value: -0.2, unit: 'PIXELS' };
  t.lineHeight = { value: 140, unit: 'PERCENT' };
  return t;
}

function buildPicker(options) {
  // DS: Tabs/Round 느낌으로 재구성 — bg=#EFEFF0, active item=#FFFFFF
  const pickerW = CONTENT_W;
  const itemW = Math.floor((pickerW - (options.length - 1) * 4) / options.length);
  const picker = hf('Picker', pickerW, 52, {
    bg: C.gray200, radius: 10, gap: 4, p: 3,
  });

  options.forEach((label, i) => {
    const isFirst = i === 0;
    const item = hf('Picker-' + label, itemW, 46, {
      align: 'CENTER', justify: 'CENTER',
      bg: isFirst ? C.white : C.gray200,
      radius: 8,
    });
    if (isFirst) {
      // DS: shadow-sm 효과 흉내
      item.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.08 },
        offset: { x: 0, y: 1 },
        radius: 2,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL',
      }];
    }
    // DS: Subtitle/Small — 14px/600 (active), Body/Xsmall — 14px/400 (inactive)
    const txt = mkText(label, 14, isFirst ? 'semibold' : 'regular',
      isFirst ? C.text900 : C.text500);
    txt.textAlignHorizontal = 'CENTER';
    item.appendChild(txt);
    picker.appendChild(item);
  });

  return picker;
}

// ── Display Question + Sentence ─────────────────────────────────────────
// Reference: large header + optional pre-label + "[값]에 은퇴하고 싶어요." 형태
// preLine: small gray label above (e.g. "만 나이로") — optional
// parts: [{text, hi}] — hi=true → primary500 blue, hi=false → text900
function buildDisplaySentence(preLine, parts) {
  const wrap = vf('Display Sentence', CONTENT_W, 1, { gap: 6 });
  wrap.fills = [];
  wrap.primaryAxisSizingMode = 'AUTO';

  if (preLine) {
    const pre = mkText(preLine, 13, 'medium', C.text500);
    pre.letterSpacing = { value: -0.2, unit: 'PIXELS' };
    wrap.appendChild(pre);
    pre.layoutSizingHorizontal = 'FILL';
  }

  // Build answer line as horizontal auto-layout frame with text pieces
  const line = hf('Answer Line', CONTENT_W, 1, { align: 'CENTER', gap: 0 });
  line.fills = [];
  line.primaryAxisSizingMode = 'AUTO';
  line.counterAxisSizingMode = 'AUTO';

  for (const p of parts) {
    const t = mkText(p.text, 26, 'bold', p.hi ? C.primary500 : C.text900);
    t.letterSpacing = { value: -0.5, unit: 'PIXELS' };
    line.appendChild(t);
  }
  wrap.appendChild(line);

  return wrap;
}

// ── Slider (static visual) ───────────────────────────────────────────────
// value: current value, min/max: range, minLabel/maxLabel: text below track
function buildSlider(value, min, max, minLabel, maxLabel) {
  const trackH = 4;
  const thumbD = 22;
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const thumbLeft = Math.round(ratio * (CONTENT_W - thumbD));
  const fillW = Math.round(thumbLeft + thumbD / 2);

  const wrap = vf('Slider', CONTENT_W, 1, { gap: 10, pt: 8 });
  wrap.fills = [];
  wrap.primaryAxisSizingMode = 'AUTO';

  // Track area — free layout (no auto-layout) so children use x/y
  const trackArea = figma.createFrame();
  trackArea.name = 'Track Area';
  trackArea.resize(CONTENT_W, thumbD);
  trackArea.fills = [];
  trackArea.clipsContent = false;

  // Track background
  const trackBg = mkRect(CONTENT_W, trackH, C.gray200, 2);
  trackBg.x = 0; trackBg.y = (thumbD - trackH) / 2;
  trackArea.appendChild(trackBg);

  // Track fill
  if (fillW > 2) {
    const trackFill = mkRect(fillW, trackH, C.primary500, 2);
    trackFill.x = 0; trackFill.y = (thumbD - trackH) / 2;
    trackArea.appendChild(trackFill);
  }

  // Thumb (ellipse)
  const thumb = figma.createEllipse();
  thumb.name = 'Thumb';
  thumb.resize(thumbD, thumbD);
  thumb.fills = solid(C.white);
  thumb.strokes = solid(C.primary500);
  thumb.strokeWeight = 1.5;
  thumb.strokeAlign = 'INSIDE';
  thumb.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.18 },
    offset: { x: 0, y: 2 }, radius: 8, spread: 0,
    visible: true, blendMode: 'NORMAL',
  }];
  thumb.x = thumbLeft; thumb.y = 0;
  trackArea.appendChild(thumb);

  wrap.appendChild(trackArea);
  trackArea.layoutSizingHorizontal = 'FILL';
  trackArea.resize(CONTENT_W, thumbD);

  // Min / Max labels
  const labels = hf('Slider Labels', CONTENT_W, 16, {
    justify: 'SPACE_BETWEEN', align: 'CENTER',
  });
  labels.fills = [];
  const minT = mkText(minLabel, 12, 'regular', C.text300);
  const maxT = mkText(maxLabel, 12, 'regular', C.text300);
  labels.appendChild(minT);
  labels.appendChild(maxT);
  wrap.appendChild(labels);
  labels.layoutSizingHorizontal = 'FILL';

  return wrap;
}

// ── Tip / Info Card ──────────────────────────────────────────────────────
// tag: "은퇴 설계 도움말", title: main content,
// rows: [{label, fillPct(0-100), value}], source: attribution text
function buildTipCard(tag, title, rows, source) {
  const card = vf('Tip Card', CONTENT_W, 1, {
    bg: C.gray100, radius: 12, p: 16, gap: 10,
  });
  card.primaryAxisSizingMode = 'AUTO';

  if (tag) {
    const tagT = mkText(tag, 11, 'semibold', C.text500);
    tagT.letterSpacing = { value: 0.3, unit: 'PIXELS' };
    tagT.textAlignHorizontal = 'LEFT';
    card.appendChild(tagT);
    tagT.layoutSizingHorizontal = 'FILL';
  }

  const titleT = mkText(title, 14, 'bold', C.text900);
  titleT.lineHeight = { value: 140, unit: 'PERCENT' };
  titleT.letterSpacing = { value: -0.2, unit: 'PIXELS' };
  card.appendChild(titleT);
  titleT.layoutSizingHorizontal = 'FILL';

  const INNER_W = CONTENT_W - 32; // card padding 16*2
  const LABEL_W = 74;
  const VAL_W = 44;
  const BAR_W = INNER_W - LABEL_W - VAL_W - 16; // 16 = two gaps of 8

  for (const row of rows) {
    const rowF = hf('Row - ' + row.label, INNER_W, 20, { align: 'CENTER', gap: 8 });
    rowF.fills = [];

    const labelT = mkText(row.label, 12, 'regular', C.text500);
    labelT.resize(LABEL_W, 16);
    labelT.textAutoResize = 'NONE';
    rowF.appendChild(labelT);

    // Bar track — free-layout frame (no auto-layout, no layoutPositioning needed)
    const barTrack = figma.createFrame();
    barTrack.name = 'Bar';
    barTrack.resize(BAR_W, 6);
    barTrack.fills = solid(C.gray200);
    barTrack.cornerRadius = 3;
    barTrack.clipsContent = true;
    const barFill = mkRect(Math.round(BAR_W * (row.fillPct / 100)), 6, C.gray400);
    barFill.x = 0; barFill.y = 0;
    barTrack.appendChild(barFill);
    rowF.appendChild(barTrack);
    barTrack.layoutSizingHorizontal = 'FILL';

    const valT = mkText(row.value, 12, 'semibold', C.text800);
    valT.resize(VAL_W, 16);
    valT.textAlignHorizontal = 'RIGHT';
    valT.textAutoResize = 'NONE';
    rowF.appendChild(valT);

    card.appendChild(rowF);
    rowF.layoutSizingHorizontal = 'FILL';
  }

  if (source) {
    const srcT = mkText(source, 11, 'regular', C.text300);
    srcT.textAlignHorizontal = 'RIGHT';
    card.appendChild(srcT);
    srcT.layoutSizingHorizontal = 'FILL';
  }

  return card;
}

// ── Step Indicator (N / total + 연속형 Progress Bar) ──────────────────
// DS 표준 — figma_plugin_design_kit.md 기준
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

// ── Root Frame Builder ──────────────────────────────────────────────────
// DS 표준 buildRoot: topNavBack + stepIndicator (pageNo 있을 때)
function buildRoot(name, opts) {
  opts = opts || {};
  const hasCTA = opts.cta !== false;
  const hasStep = opts.pageNo !== undefined;

  const root = vf(name, W, H, { bg: C.white, clip: true });

  const statusBar = buildStatusBar();
  root.appendChild(statusBar);
  statusBar.layoutSizingHorizontal = 'FILL';

  const topNav = buildTopNavBack(opts.navTitle || '인출설계');
  root.appendChild(topNav);
  topNav.layoutSizingHorizontal = 'FILL';

  if (hasStep) {
    const step = buildStepIndicator(opts.pageNo, opts.pageTotal || 8);
    root.appendChild(step);
    step.layoutSizingHorizontal = 'FILL';
  }

  // DS: Scroll Content — 수직 스크롤 영역, pad=20(H) 24(V)
  const scroll = vf('Scroll Content', W, 100, {
    bg: C.white, clip: true, px: PAD, pt: 24, pb: 24, gap: 20,
  });
  root.appendChild(scroll);
  scroll.layoutSizingHorizontal = 'FILL';
  scroll.layoutSizingVertical = 'FILL';

  if (hasCTA) {
    const cta = buildCTA(opts.ctaLabel || '다음');
    root.appendChild(cta);
    cta.layoutSizingHorizontal = 'FILL';
  }

  return { root, scroll };
}

// ══════════════════════════════════════════════════════════════════════
// PAGE BUILDERS — v2 (DS 기반, 2026-03-10)
// ══════════════════════════════════════════════════════════════════════

// P1: 설문 시작
function buildPage1() {
  const { root, scroll } = buildRoot('P1 - 설문 시작', {
    navTitle: '인출설계', ctaLabel: '시작하기',
  });

  // DS: Title/Medium — 20px/700, lineHeight 140%
  scroll.appendChild(buildSectionHeader('은퇴 후 자산 인출 전략을\n설계해 볼까요?'));

  // DS: Body/Xsmall — 14px/400
  scroll.appendChild(buildSubHeader('몇 가지 질문에 답하면, 맞춤 인출 전략을\n제안해 드릴게요.'));
  scroll.appendChild(buildSubHeader('편안한 은퇴를 위한 맞춤 설계를\n시작합니다'));

  // DS: Banner/noti — 335×68px, r=12, bg=#F8F9FA
  const infoCard = hf('Info Card', CONTENT_W, 60, {
    bg: C.primary100, radius: 12, px: 16, align: 'CENTER', gap: 12,
  });
  // 시계 아이콘 (원형)
  const iconBg = hf('Icon', 32, 32, {
    radius: 100, bg: C.primary500, align: 'CENTER', justify: 'CENTER',
  });
  const clockTxt = mkText('⏱', 16, 'regular', C.white);
  clockTxt.textAlignHorizontal = 'CENTER';
  iconBg.appendChild(clockTxt);
  infoCard.appendChild(iconBg);
  // DS: Subtitle/Small — 14px/600
  infoCard.appendChild(mkText('약 3분 소요', 14, 'semibold', C.text800));
  scroll.appendChild(infoCard);

  return root;
}

// P3: 자산없음 경고
function buildPage3() {
  const { root, scroll } = buildRoot('P3 - 자산없음 경고', {
    navTitle: '인출설계', ctaLabel: '마이데이터 연결하기',
  });

  scroll.primaryAxisAlignItems = 'CENTER';
  scroll.counterAxisAlignItems = 'CENTER';

  // DS: Utility/Red 500 #FF5247, 배경 Utility/Red 100 #FFF3F1
  const warnBg = hf('Warn Icon Bg', 72, 72, {
    bg: C.red500, bgOp: 0.12, radius: 100,
    align: 'CENTER', justify: 'CENTER',
  });
  const warnIcon = mkText('!', 30, 'bold', C.red500);
  warnIcon.textAlignHorizontal = 'CENTER';
  warnBg.appendChild(warnIcon);
  warnBg.primaryAxisAlignItems = 'CENTER';
  warnBg.counterAxisAlignItems = 'CENTER';
  scroll.appendChild(warnBg);

  // DS: Title/Medium — 20px/700
  const header = mkText('연결된 퇴직연금이 없어요', 20, 'bold', C.text900);
  header.textAlignHorizontal = 'CENTER';
  scroll.appendChild(header);

  // DS: Body/Xsmall — 14px/400
  const sub = mkText('인출설계를 진행하려면 마이데이터로\nIRP 또는 DC 계좌가\n연결되어야 해요.', 14, 'regular', C.text500);
  sub.textAlignHorizontal = 'CENTER';
  sub.lineHeight = { value: 150, unit: 'PERCENT' };
  scroll.appendChild(sub);

  scroll.appendChild(buildHelperText('마이데이터에서 퇴직연금 계좌를 연결한 뒤 다시 시도해 주세요.'));

  // 나중에 하기 — DS: Text button/Sm/Primary
  const laterLink = mkText('나중에 하기', 14, 'medium', C.text500);
  laterLink.textAlignHorizontal = 'CENTER';
  laterLink.textDecoration = 'UNDERLINE';
  scroll.appendChild(laterLink);

  return root;
}

// P4: 언제 은퇴하고 싶으신가요? (1/10) — 슬라이더 스타일
function buildPage4() {
  const { root, scroll } = buildRoot('P4 - 은퇴 시기', {
    ctaLabel: '다음', pageNo: 1, pageTotal: 7,
  });

  // Question header
  const qHeader = mkText('언제 은퇴하고 싶으신가요?', 22, 'bold', C.text900);
  qHeader.lineHeight = { value: 135, unit: 'PERCENT' };
  qHeader.letterSpacing = { value: -0.3, unit: 'PIXELS' };
  scroll.appendChild(qHeader);
  qHeader.layoutSizingHorizontal = 'FILL';

  scroll.appendChild(buildSubHeader('은퇴 후 받을 수령 연금을 예상하기 위해 필요한 정보예요.'));

  // Spacer
  const sp = mkRect(CONTENT_W, 16, C.white, 0, 0);
  sp.fills = [];
  scroll.appendChild(sp);

  // Display sentence: "60세에 은퇴하고 싶어요."
  scroll.appendChild(buildDisplaySentence('만 나이로', [
    { text: '60세', hi: true },
    { text: '에 은퇴하고 싶어요.', hi: false },
  ]));

  // Slider: 40~80세, default 60
  scroll.appendChild(buildSlider(60, 40, 80, '40세', '80세'));

  // Tip card
  scroll.appendChild(buildTipCard(
    '은퇴 설계 도움말',
    '대한민국 평균 은퇴 나이는 49세예요.',
    [
      { label: '희망 평균 은퇴', fillPct: 81, value: '65세' },
      { label: '실제 평균 은퇴', fillPct: 45, value: '49세' },
    ],
    '출처: 통계청, 한국리서치'
  ));

  return root;
}

// P4b: 기대수명은 얼마로 생각하시나요? (2/10)
function buildPage5() {
  const { root, scroll } = buildRoot('P5 - 기대수명', {
    ctaLabel: '다음', pageNo: 2, pageTotal: 7,
  });

  const qHeader = mkText('기대수명은 얼마로\n생각하시나요?', 22, 'bold', C.text900);
  qHeader.lineHeight = { value: 135, unit: 'PERCENT' };
  qHeader.letterSpacing = { value: -0.3, unit: 'PIXELS' };
  scroll.appendChild(qHeader);
  qHeader.layoutSizingHorizontal = 'FILL';

  scroll.appendChild(buildSubHeader('은퇴 후 필요한 자산 규모를 계산하기 위해 필요해요.\n평균보다 5~10년 길게 설정하는 걸 권장해요.'));

  const sp = mkRect(CONTENT_W, 16, C.white, 0, 0);
  sp.fills = [];
  scroll.appendChild(sp);

  scroll.appendChild(buildDisplaySentence('건강하게 사는 목표', [
    { text: '90세', hi: true },
    { text: '까지 준비할게요.', hi: false },
  ]));

  // Slider: 70~100세, default 90
  scroll.appendChild(buildSlider(90, 70, 100, '70세', '100세'));

  // Tip card
  scroll.appendChild(buildTipCard(
    '은퇴 설계 도움말',
    '기대수명보다 오래 사실 수도 있어요.',
    [
      { label: '남성 기대수명', fillPct: 81, value: '81세' },
      { label: '여성 기대수명', fillPct: 87, value: '87세' },
    ],
    '출처: 통계청 2023'
  ));

  return root;
}

// P4c: 노후 월 생활비는 얼마나 생각하세요? (3/10)
function buildPage6() {
  const { root, scroll } = buildRoot('P6 - 월 생활비', {
    ctaLabel: '다음', pageNo: 3, pageTotal: 7,
  });

  const qHeader = mkText('은퇴 후 연금을 얼마씩\n받고 싶으세요?', 22, 'bold', C.text900);
  qHeader.lineHeight = { value: 135, unit: 'PERCENT' };
  qHeader.letterSpacing = { value: -0.3, unit: 'PIXELS' };
  scroll.appendChild(qHeader);
  qHeader.layoutSizingHorizontal = 'FILL';

  scroll.appendChild(buildSubHeader('은퇴 시점에 받고 싶은 금액을 입력해 주세요.\n이후 매년 수령 금액이 물가상승률만큼 늘어나요.'));

  const sp = mkRect(CONTENT_W, 16, C.white, 0, 0);
  sp.fills = [];
  scroll.appendChild(sp);

  scroll.appendChild(buildDisplaySentence('60세에 은퇴 후', [
    { text: '매 월 ', hi: false },
    { text: '300만원', hi: true },
    { text: ' 받고 싶어요.', hi: false },
  ]));

  // Slider: 120~1000만원, default 300
  scroll.appendChild(buildSlider(300, 120, 1000, '120만원', '1000만원'));

  // Tip card — NPS reference
  scroll.appendChild(buildTipCard(
    '은퇴 설계 도움말',
    '노후 1인 적정 생활비는 165만원이에요.',
    [
      { label: '최소 생활비', fillPct: 40, value: '120만원' },
      { label: '적정 생활비', fillPct: 55, value: '165만원' },
    ],
    '출처: 국민연금공단'
  ));

  return root;
}

// P5: 국민연금 Y/N (2/8)
// P7: 국민연금 Y/N + 입력 [병합] (4/7)
// "아니요" 선택 시 계산기 필드 펼침 + 인라인 결과 카드 — 스케치는 "아니요"+결과 카드 상태로 표시
// P7: 국민연금 수령 여부 + 월수령액 입력 [병합]
// 선택 무관하게 월수령액 입력폼 항상 표시 / 계산기는 바텀시트 (→ buildPage7Sheet)
function buildPage7() {
  const { root, scroll } = buildRoot('P7 - 국민연금[병합]', {
    ctaLabel: '다음', pageNo: 4, pageTotal: 7,
  });

  scroll.appendChild(buildSectionHeader('국민연금을 수령\n중이신가요?'));
  scroll.appendChild(buildSubHeader('수령 여부와 관계없이 월 수령액을\n입력하거나 계산해 주세요'));

  // Y/N 선택 카드 — "아니요, 수령 전이에요" 선택 상태로 표시
  const cards = vf('Choice Cards', CONTENT_W, 1, { gap: 12 });
  cards.fills = [];
  cards.primaryAxisSizingMode = 'AUTO';
  cards.appendChild(buildChoiceCard('네, 수령 중이에요', false));
  cards.appendChild(buildChoiceCard('아니요, 수령 전이에요', true)); // selected
  scroll.appendChild(cards);

  // 구분선 + 월수령액 입력폼 (선택 후 항상 표시)
  scroll.appendChild(mkRect(CONTENT_W, 1, C.gray200));

  const g1 = vf('Field - 월수령액', CONTENT_W, 1, { gap: 6 });
  g1.fills = [];
  g1.primaryAxisSizingMode = 'AUTO';
  g1.appendChild(buildLabel('월 수령액 (세전)'));
  g1.appendChild(buildTextInput('월 수령액을 입력해 주세요', '만원/월'));
  scroll.appendChild(g1);

  // 계산하기 링크 텍스트 (클릭 시 바텀시트 오픈)
  const calcLink = mkText('국민연금 월 수령금액 계산하기 →', 13, 'semibold', C.primary500);
  scroll.appendChild(calcLink);

  return root;
}

// P7 계산기 바텀시트 상태 — 딤드 오버레이 + 하단 화이트 시트
function buildPage7Sheet() {
  // 1. 루트: 375×812 일반 프레임 (레이아웃 없음) — 다크 오버레이
  const root = figma.createFrame();
  root.name = 'P7 - 계산기[바텀시트]';
  root.resize(W, H);
  root.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.45 }];
  root.clipsContent = true;

  // 2. 바텀시트 패널 — 하단 고정, 상단 모서리 둥글게
  const SHEET_H = 530;
  const sheet = figma.createFrame();
  sheet.name = 'Bottom Sheet';
  sheet.resize(W, SHEET_H);
  sheet.x = 0;
  sheet.y = H - SHEET_H;
  sheet.fills = [{ type: 'SOLID', color: C.white }];
  sheet.topLeftRadius  = 20;
  sheet.topRightRadius = 20;
  sheet.bottomLeftRadius  = 0;
  sheet.bottomRightRadius = 0;
  sheet.layoutMode = 'VERTICAL';
  sheet.paddingLeft   = PAD;
  sheet.paddingRight  = PAD;
  sheet.paddingTop    = 16;
  sheet.paddingBottom = 40;
  sheet.itemSpacing   = 14;
  sheet.primaryAxisSizingMode   = 'FIXED';
  sheet.counterAxisSizingMode   = 'FIXED';
  sheet.clipsContent = true;

  // 핸들 — append 후 layoutAlign 설정
  const handle = figma.createFrame();
  handle.name = 'Handle';
  handle.resize(36, 4);
  handle.fills = [{ type: 'SOLID', color: C.gray300 }];
  handle.cornerRadius = 2;
  sheet.appendChild(handle);
  handle.layoutAlign = 'CENTER';

  // 시트 제목 — append 후 layoutSizingHorizontal 설정
  const titleT = mkText('국민연금 수령액 계산하기', 17, 'bold', C.text900);
  sheet.appendChild(titleT);
  titleT.layoutSizingHorizontal = 'FILL';

  // 연소득
  const g1 = vf('Field - 연소득', CONTENT_W, 1, { gap: 6 });
  g1.fills = [];
  g1.primaryAxisSizingMode = 'AUTO';
  g1.appendChild(buildLabel('연소득 (세전)'));
  g1.appendChild(buildTextInput('세전 연소득을 입력해 주세요', '만원'));
  g1.appendChild(buildHelperText('세금 공제 전 연간 소득 금액이에요. 다음 단계 연봉 입력에 자동 적용돼요.'));
  sheet.appendChild(g1);

  // 최초 가입 시기
  const g2 = vf('Field - 최초가입시기', CONTENT_W, 1, { gap: 6 });
  g2.fills = [];
  g2.primaryAxisSizingMode = 'AUTO';
  g2.appendChild(buildLabel('국민연금 최초 가입 시기'));
  const selRow = hf('Select Row', CONTENT_W, 1, { gap: 8 });
  selRow.fills = [];
  selRow.primaryAxisSizingMode = 'FIXED';
  selRow.counterAxisSizingMode = 'AUTO';
  const selYear  = buildSelectBox('연도 선택');
  const selMonth = buildSelectBox('월 선택');
  selYear.layoutGrow  = 1;
  selMonth.layoutGrow = 1;
  selRow.appendChild(selYear);
  selRow.appendChild(selMonth);
  g2.appendChild(selRow);
  sheet.appendChild(g2);

  // 납입 종료 예정일
  const g3 = vf('Field - 납입종료', CONTENT_W, 1, { gap: 6 });
  g3.fills = [];
  g3.primaryAxisSizingMode = 'AUTO';
  g3.appendChild(buildLabel('납입 종료 예정일'));
  g3.appendChild(buildReadonlyField('은퇴 시기 자동 적용'));
  g3.appendChild(buildHelperText('앞서 입력한 은퇴 시기가 자동 적용돼요'));
  sheet.appendChild(g3);

  // 계산하기 CTA — append 후 layoutSizingHorizontal 설정
  const cta = buildCTA('계산하기');
  sheet.appendChild(cta);
  cta.layoutSizingHorizontal = 'FILL';

  root.appendChild(sheet);
  return root;
}

// P9: 근로소득자 여부 (5/8)
// P11: 근로소득자 질문 + 연봉/근속연수 입력 (병합, 6/8)
// "네" 선택 시 입력 영역 펼침 — 스케치는 펼쳐진 상태로 표시
function buildPage8() {
  const { root, scroll } = buildRoot('P8 - 근로소득자+연봉(병합)', {
    ctaLabel: '다음', pageNo: 5, pageTotal: 7,
  });

  scroll.appendChild(buildSectionHeader('현재 근로소득이 있나요?'));
  scroll.appendChild(buildSubHeader('퇴직금 예상액 산출에 필요해요.'));

  // Y/N 선택 카드 — "네" 선택 상태로 표시
  const cards = vf('Choice Cards', CONTENT_W, 1, { gap: 12 });
  cards.fills = [];
  cards.primaryAxisSizingMode = 'AUTO';
  cards.appendChild(buildChoiceCard('네, 있어요', true));   // selected
  cards.appendChild(buildChoiceCard('아니요, 없어요', false));
  scroll.appendChild(cards);

  // 입력 영역 — "네" 선택 시 펼쳐지는 영역 (앱에서는 Animated 처리)
  const divider = mkRect(CONTENT_W, 1, C.gray200);
  scroll.appendChild(divider);

  const g1 = vf('Field - 연봉', CONTENT_W, 1, { gap: 6 });
  g1.fills = [];
  g1.primaryAxisSizingMode = 'AUTO';
  g1.appendChild(buildLabel('연봉 (세전)'));
  g1.appendChild(buildTextInput('세전 연봉을 입력해 주세요', '만원'));
  scroll.appendChild(g1);

  const g2 = vf('Field - 근속연수', CONTENT_W, 1, { gap: 6 });
  g2.fills = [];
  g2.primaryAxisSizingMode = 'AUTO';
  g2.appendChild(buildLabel('근속연수 (만 연수)'));
  g2.appendChild(buildTextInput('근속연수를 입력해 주세요', '년'));
  g2.appendChild(buildHelperText('현재 재직 중인 회사의 근속연수를 입력해 주세요'));
  scroll.appendChild(g2);

  return root;
}

// P12: 기타 정기소득 질문 + 입력 (병합, 7/8)
// "네" 선택 시 입력 영역 펼침 — 스케치는 펼쳐진 상태로 표시
function buildPage9() {
  const { root, scroll } = buildRoot('P9 - 기타소득(병합)', {
    ctaLabel: '다음', pageNo: 6, pageTotal: 7,
  });

  scroll.appendChild(buildSectionHeader('은퇴 후 기타 정기소득이\n있거나 예정인가요?'));
  scroll.appendChild(buildSubHeader('은퇴 후 정기적으로 받으실 소득을\n알려주세요'));

  // Y/N 선택 카드 — "네" 선택 상태로 표시
  const cards = vf('Choice Cards', CONTENT_W, 1, { gap: 12 });
  cards.fills = [];
  cards.primaryAxisSizingMode = 'AUTO';
  cards.appendChild(buildChoiceCard('네, 있어요', true));   // selected
  cards.appendChild(buildChoiceCard('아니요, 없어요', false));
  scroll.appendChild(cards);

  // 입력 영역 — "네" 선택 시 펼쳐지는 영역 (앱에서는 Animated 처리)
  const divider = mkRect(CONTENT_W, 1, C.gray200);
  scroll.appendChild(divider);

  const g1 = vf('Field - 연소득', CONTENT_W, 1, { gap: 6 });
  g1.fills = [];
  g1.primaryAxisSizingMode = 'AUTO';
  g1.appendChild(buildLabel('연소득 (세전)'));
  g1.appendChild(buildTextInput('연소득을 입력해 주세요', '만원/년'));
  g1.appendChild(buildHelperText('월세, 임대 수입, 배당금 등 근로소득 외 정기적으로 받는 소득의 연간 합계'));
  scroll.appendChild(g1);

  const g2 = vf('Field - 시작시기', CONTENT_W, 1, { gap: 6 });
  g2.fills = [];
  g2.primaryAxisSizingMode = 'AUTO';
  g2.appendChild(buildLabel('소득 시작 시기'));
  g2.appendChild(buildReadonlyField('자동 설정'));
  g2.appendChild(buildHelperText('앞서 입력한 은퇴 시기가 자동 적용돼요'));
  scroll.appendChild(g2);

  const g3 = vf('Field - 종료시기', CONTENT_W, 1, { gap: 6 });
  g3.fills = [];
  g3.primaryAxisSizingMode = 'AUTO';
  g3.appendChild(buildLabel('소득 종료 시기'));
  g3.appendChild(buildReadonlyField('자동 설정'));
  g3.appendChild(buildHelperText('앞서 입력한 기대수명이 자동 적용돼요'));
  scroll.appendChild(g3);

  return root;
}

// P13: 설문 결과 확인 (8/8)
function buildPage10() {
  const { root, scroll } = buildRoot('P10 - 결과 확인', {
    ctaLabel: 'FA에게 전달하기', pageNo: 7, pageTotal: 7,
  });

  scroll.appendChild(buildSectionHeader('입력하신 내용을\n확인해 주세요'));
  scroll.appendChild(buildSubHeader('수정이 필요한 항목을 탭하면 해당 화면으로 이동합니다.'));

  const summaryItems = [
    { label: '은퇴 예상 시기', value: '65세' },
    { label: '기대수명', value: '100세' },
    { label: '월 생활비', value: '324만원' },
    { label: '국민연금 월 수령액', value: '120만원 (세전)' },
{ label: '근로소득', value: '연봉 5,000만원 / 근속 15년' },
    { label: '기타 정기소득', value: '없음' },
  ];

  // DS: Divider 2 — 1px 구분선, bg=#EFEFF0
  const list = vf('Summary List', CONTENT_W, 1, { gap: 0 });
  list.fills = [];
  list.primaryAxisSizingMode = 'AUTO';

  for (let i = 0; i < summaryItems.length; i++) {
    const item = summaryItems[i];
    const row = hf('Item-' + item.label, CONTENT_W, 56, {
      align: 'CENTER', py: 10,
    });
    row.fills = [];
    row.primaryAxisAlignItems = 'SPACE_BETWEEN';

    const leftCol = vf('Left', CONTENT_W - 60, 36, { gap: 3 });
    leftCol.fills = [];
    // DS: Body/Caption — 12px/400
    leftCol.appendChild(mkText(item.label, 12, 'regular', C.text500));
    // DS: Subtitle/Small — 14px/600
    leftCol.appendChild(mkText(item.value, 14, 'semibold', C.text900));
    row.appendChild(leftCol);
    leftCol.layoutSizingHorizontal = 'FILL';

    // DS: Text button/Sm/Primary — 44px height, 12px text
    const editBtn = hf('Edit Btn', 44, 30, {
      radius: 6, align: 'CENTER', justify: 'CENTER',
      stroke: C.gray400, strokeW: 1,
    });
    editBtn.fills = solid(C.white);
    const editText = mkText('수정', 12, 'semibold', C.primary500);
    editText.textAlignHorizontal = 'CENTER';
    editBtn.appendChild(editText);
    row.appendChild(editBtn);

    list.appendChild(row);

    if (i < summaryItems.length - 1) {
      // DS: 1px 구분선 #EFEFF0
      const div = mkRect(CONTENT_W, 1, C.gray200);
      list.appendChild(div);
    }
  }

  scroll.appendChild(list);

  return root;
}

// P14: T0054 약관동의
function buildPage11() {
  const { root, scroll } = buildRoot('P11 - 약관동의', {
    navTitle: '약관 동의', ctaLabel: '동의하고 전달하기',
  });

  scroll.appendChild(buildSectionHeader('인출설계 서비스 이용을 위해\n약관에 동의해 주세요'));

  // 전체 동의 — DS: Cell/List Item Active 느낌, bg=#EBF5FF
  const allAgree = hf('All Agree', CONTENT_W, 52, {
    bg: C.primary100, radius: 8, px: 16, align: 'CENTER', gap: 12,
    stroke: C.primary500, strokeW: 1,
  });
  // DS: Checkbox/Square/Md Checked
  const allCheck = hf('Checkbox', 20, 20, {
    radius: 4, align: 'CENTER', justify: 'CENTER',
    bg: C.primary500,
  });
  allCheck.primaryAxisAlignItems = 'CENTER';
  allCheck.counterAxisAlignItems = 'CENTER';
  const allCheckMark = mkText('✓', 13, 'bold', C.white);
  allCheckMark.textAlignHorizontal = 'CENTER';
  allCheck.appendChild(allCheckMark);
  allAgree.appendChild(allCheck);
  // DS: Subtitle/Small — 14px/600
  allAgree.appendChild(mkText('전체 동의', 14, 'semibold', C.text900));
  scroll.appendChild(allAgree);

  // DS: Divider 2 — 1px #EFEFF0
  scroll.appendChild(mkRect(CONTENT_W, 1, C.gray200));

  const terms = [
    { text: '[필수] 인출설계 서비스 이용약관', checked: true },
    { text: '[필수] 개인정보 수집·이용 동의', checked: true },
    { text: '[필수] 개인정보 제3자 제공 동의', checked: true },
    { text: '[선택] 마케팅 정보 수신 동의', checked: false },
  ];

  for (const term of terms) {
    const row = hf('Term Row', CONTENT_W, 48, {
      align: 'CENTER', px: 4,
    });
    row.fills = [];
    row.primaryAxisAlignItems = 'SPACE_BETWEEN';

    const leftPart = hf('Left', CONTENT_W - 40, 24, { align: 'CENTER', gap: 12 });
    leftPart.fills = [];

    // DS: Checkbox/Square Checked/Unchecked
    const cb = hf('Checkbox', 20, 20, {
      radius: 4, align: 'CENTER', justify: 'CENTER',
      bg: term.checked ? C.primary500 : C.white,
      stroke: term.checked ? C.primary500 : C.gray400, strokeW: 1,
    });
    cb.primaryAxisAlignItems = 'CENTER';
    cb.counterAxisAlignItems = 'CENTER';
    if (term.checked) {
      const cm = mkText('✓', 13, 'bold', C.white);
      cm.textAlignHorizontal = 'CENTER';
      cb.appendChild(cm);
    }
    leftPart.appendChild(cb);
    // DS: Body/Caption — 12px/400
    leftPart.appendChild(mkText(term.text, 12, 'regular', C.text800));
    row.appendChild(leftPart);
    leftPart.layoutSizingHorizontal = 'FILL';

    // DS: Text button/Xs/Primary — 12px
    const viewLink = mkText('보기', 12, 'medium', C.text500);
    viewLink.textDecoration = 'UNDERLINE';
    row.appendChild(viewLink);

    scroll.appendChild(row);
  }

  scroll.appendChild(buildHelperText('필수 항목에 모두 동의해야 서비스를 이용할 수 있어요.'));

  return root;
}

// P15: 전송 로딩
function buildPage12() {
  const { root, scroll } = buildRoot('P12 - 전송 로딩', {
    navTitle: '인출설계', cta: false,
  });

  scroll.primaryAxisAlignItems = 'CENTER';
  scroll.counterAxisAlignItems = 'CENTER';

  // 스피너 — free-layout frame (no layoutPositioning needed)
  const spinnerWrap = figma.createFrame();
  spinnerWrap.name = 'Spinner';
  spinnerWrap.resize(72, 72);
  spinnerWrap.fills = [];
  spinnerWrap.clipsContent = false;

  const outerRing = mkEllipse(72, 72, C.gray200);
  outerRing.x = 0; outerRing.y = 0;
  spinnerWrap.appendChild(outerRing);

  const arc = mkEllipse(72, 72, C.primary500);
  arc.opacity = 0.35;
  arc.x = 0; arc.y = 0;
  spinnerWrap.appendChild(arc);

  const innerCircle = mkEllipse(52, 52, C.white);
  innerCircle.x = 10; innerCircle.y = 10;
  spinnerWrap.appendChild(innerCircle);

  const centerDot = mkEllipse(14, 14, C.primary500);
  centerDot.x = 29; centerDot.y = 29;
  spinnerWrap.appendChild(centerDot);

  scroll.appendChild(spinnerWrap);

  // DS: Subtitle/Regular — 16px/600
  const loadingHeader = mkText('회원님의 은퇴 후 30년을\n준비하고 있어요', 16, 'semibold', C.text900);
  loadingHeader.textAlignHorizontal = 'CENTER';
  loadingHeader.lineHeight = { value: 150, unit: 'PERCENT' };
  scroll.appendChild(loadingHeader);

  // DS: Body/Xsmall — 14px/400
  const loadingSub = mkText('담당 FA에게 전달 중이에요.', 14, 'regular', C.text500);
  loadingSub.textAlignHorizontal = 'CENTER';
  scroll.appendChild(loadingSub);

  return root;
}

// P16: 전달 완료
function buildPage13() {
  const { root, scroll } = buildRoot('P13 - 전달 완료', {
    navTitle: '인출설계', ctaLabel: '홈으로 돌아가기',
  });

  scroll.primaryAxisAlignItems = 'CENTER';
  scroll.counterAxisAlignItems = 'CENTER';

  // DS: Utility/Green 500 — nested auto-layout (no layoutPositioning needed)
  const checkOuter = hf('Check Outer', 72, 72, {
    bg: C.green500, bgOp: 0.15, radius: 100,
    align: 'CENTER', justify: 'CENTER',
  });
  checkOuter.primaryAxisAlignItems = 'CENTER';
  checkOuter.counterAxisAlignItems = 'CENTER';
  const checkInner = hf('Check Inner', 44, 44, {
    bg: C.green500, radius: 100,
    align: 'CENTER', justify: 'CENTER',
  });
  checkInner.primaryAxisAlignItems = 'CENTER';
  checkInner.counterAxisAlignItems = 'CENTER';
  const checkMark = mkText('✓', 24, 'bold', C.white);
  checkMark.textAlignHorizontal = 'CENTER';
  checkInner.appendChild(checkMark);
  checkOuter.appendChild(checkInner);
  scroll.appendChild(checkOuter);

  // DS: Title/Medium — 20px/700
  const header = mkText('인출설계 첫 걸음을\n내딛으셨어요', 20, 'bold', C.text900);
  header.textAlignHorizontal = 'CENTER';
  header.lineHeight = { value: 140, unit: 'PERCENT' };
  scroll.appendChild(header);

  // 임팩트 박스 — DS: Banner/text — r=16, bg=#EBF5FF (Primary/100), pad=16
  const impactBox = vf('Impact Box', CONTENT_W, 1, {
    gap: 0, px: 20, py: 20, radius: 16,
  });
  impactBox.fills = [{ type: 'SOLID', color: C.primary100 }];
  impactBox.primaryAxisSizingMode = 'AUTO';
  // DS: Subtitle/Regular — 16px/600
  const impactText = mkText('은퇴 후 30년,\n준비된 인출 전략이\n노후를 지켜줍니다.', 16, 'semibold', C.text900);
  impactText.textAlignHorizontal = 'CENTER';
  impactText.lineHeight = { value: 150, unit: 'PERCENT' };
  impactBox.appendChild(impactText);
  scroll.appendChild(impactBox);

  // DS: Body/Xsmall — 14px/400
  const reportSub = mkText('입력하신 정보를 바탕으로 맞춤 은퇴 설계\n리포트를 준비하겠습니다', 14, 'regular', C.text800);
  reportSub.textAlignHorizontal = 'CENTER';
  reportSub.lineHeight = { value: 150, unit: 'PERCENT' };
  scroll.appendChild(reportSub);

  const sub = mkText('담당 FA가 맞춤 인출 전략으로\n곧 연락드릴게요.', 14, 'regular', C.text500);
  sub.textAlignHorizontal = 'CENTER';
  scroll.appendChild(sub);

  scroll.appendChild(buildHelperText('평균 1~2영업일 내 연락을 드려요.'));

  return root;
}

// ══════════════════════════════════════════════════════════════════════
// FLOWCHART BUILDER — 기존과 동일
// ══════════════════════════════════════════════════════════════════════

const FC = {
  NW: 220, NH: 64,
  VG: 56,
  COL: { LL: -200, L: 100, C: 400, R: 700 },
  COLOR: {
    start:    { bg: hex( 46, 201, 114), text: C.white },
    end:      { bg: hex( 46, 201, 114), text: C.white },
    page:     { bg: C.primary500,       text: C.white },
    action:   { bg: hex(124, 106, 245), text: C.white },
    decision: { bg: hex(245, 189,  13), text: C.text900 },
    terminal: { bg: C.red500,           text: C.white },
  },
};

// FC_NODES — 943spec.md Mermaid 1:1 매핑 (25개)
const FC_NODES = [
  ['ENTRY',      '인출설계 설문\n입력 진입점',               'start',    'C',   0 ],
  ['FA_YN',      '매칭된 FA 유무?',                         'decision', 'C',   1 ],
  ['FA_AUTO',    'qb.event 계정에\nFA 자동 매칭',           'action',   'L',   2 ],
  ['P1',         'P1 설문 시작\n페이지',                     'page',     'C',   3 ],
  ['MYDATA_YN',  '마데 절세형/일반형\n자산 보유?',          'decision', 'C',   4 ],
  ['P3',         'P3 자산없음\n경고 페이지',                 'terminal', 'R',   4 ],
  ['P4',         'P4 은퇴시기',                              'page',     'C',   5 ],
  ['P5',         'P5 기대수명',                              'page',     'C',   6 ],
  ['P6',         'P6 월 생활비',                             'page',     'C',   7 ],
  // --- P7 subgraph ---
  ['NPS_YN',     '국민연금 예상 수령액을\n알고 있나요?',     'decision', 'C',   8 ],
  ['NPS_YES',    '월수령액\n직접 입력 펼침',                 'action',   'L',   9 ],
  ['NPS_NO',     '계산기 입력 +\n인라인 결과 펼침',          'action',   'R',   9 ],
  // --- P7 end ---
  ['DC_YN',      'DC 자산 보유?\n마이데이터 기준',          'decision', 'C',  10 ],
  // --- P8 subgraph (left) ---
  ['WORK_YN',    '현재 근로소득이\n있나요?',                 'decision', 'L',  11 ],
  ['WORK_YES',   '연봉·근속연수\n입력 펼침',                 'action',   'LL', 12 ],
  ['WORK_NO',    '입력 없음',                                'action',   'L',  12 ],
  // --- P8 end ---
  // --- P9 subgraph ---
  ['EXTRA_YN',   '은퇴 후 기타\n정기소득이 있나요?',         'decision', 'C',  13 ],
  ['EXTRA_YES',  '연소득·시작/종료\n입력 펼침',              'action',   'L',  14 ],
  ['EXTRA_NO',   '입력 없음',                                'action',   'R',  14 ],
  // --- P9 end ---
  ['P10',        'P10 설문\n결과 확인',                      'page',     'C',  15 ],
  ['TERMS_YN',   'T0054\n약관동의?',                        'decision', 'C',  16 ],
  ['P11',        'P11 T0054\n약관동의',                      'page',     'L',  17 ],
  ['P12',        'P12 전송 로딩',                            'page',     'C',  18 ],
  ['P13',        'P13 전달 완료',                            'page',     'C',  19 ],
  ['HOME',       '베러웰스 홈',                              'end',      'C',  20 ],
];

// FC_EDGES — 943spec.md Mermaid 1:1 매핑 (30개)
const FC_EDGES = [
  ['ENTRY',     'FA_YN',    '',           'BOTTOM', 'TOP'   ],
  ['FA_YN',     'FA_AUTO',  'N',          'LEFT',   'TOP'   ],
  ['FA_YN',     'P1',       'Y',          'BOTTOM', 'TOP'   ],
  ['FA_AUTO',   'P1',       '',           'BOTTOM', 'LEFT'  ],
  ['P1',        'MYDATA_YN','',           'BOTTOM', 'TOP'   ],
  ['MYDATA_YN', 'P3',       'N',          'RIGHT',  'LEFT'  ],
  ['MYDATA_YN', 'P4',       'Y',          'BOTTOM', 'TOP'   ],
  ['P4',        'P5',       '',           'BOTTOM', 'TOP'   ],
  ['P5',        'P6',       '',           'BOTTOM', 'TOP'   ],
  ['P6',        'NPS_YN',   '',           'BOTTOM', 'TOP'   ],
  // P7 subgraph 내부
  ['NPS_YN',    'NPS_YES',  '네',         'LEFT',   'TOP'   ],
  ['NPS_YN',    'NPS_NO',   '아니요',     'RIGHT',  'TOP'   ],
  // P7 → DC_YN (양쪽 경로 수렴)
  ['NPS_YES',   'DC_YN',    '',           'BOTTOM', 'TOP'   ],
  ['NPS_NO',    'DC_YN',    '',           'BOTTOM', 'TOP'   ],
  // DC=Y 바이패스 (RIGHT→RIGHT 직선, x=510)
  ['DC_YN',     'EXTRA_YN', 'Y P8스킵',  'RIGHT',  'RIGHT' ],
  // DC=N → P8 subgraph
  ['DC_YN',     'WORK_YN',  'N',          'LEFT',   'TOP'   ],
  // P8 subgraph 내부
  ['WORK_YN',   'WORK_YES', '네',         'LEFT',   'TOP'   ],
  ['WORK_YN',   'WORK_NO',  '아니요',     'BOTTOM', 'TOP'   ],
  // P8 → P9 수렴
  ['WORK_YES',  'EXTRA_YN', '',           'BOTTOM', 'TOP'   ],
  ['WORK_NO',   'EXTRA_YN', '',           'BOTTOM', 'TOP'   ],
  // P9 subgraph 내부
  ['EXTRA_YN',  'EXTRA_YES','네',         'LEFT',   'TOP'   ],
  ['EXTRA_YN',  'EXTRA_NO', '아니요',     'RIGHT',  'TOP'   ],
  // P9 → P10 수렴
  ['EXTRA_YES', 'P10',      '',           'BOTTOM', 'TOP'   ],
  ['EXTRA_NO',  'P10',      '',           'BOTTOM', 'TOP'   ],
  ['P10',       'TERMS_YN', '',           'BOTTOM', 'TOP'   ],
  ['TERMS_YN',  'P11',      'N',          'LEFT',   'TOP'   ],
  ['TERMS_YN',  'P12',      'Y',          'BOTTOM', 'TOP'   ],
  ['P11',       'P12',      '',           'BOTTOM', 'LEFT'  ],
  ['P12',       'P13',      '1초',        'BOTTOM', 'TOP'   ],
  ['P13',       'HOME',     '',           'BOTTOM', 'TOP'   ],
];

// FC_SUBGRAPHS — P7/P8/P9 배경 프레임 (Mermaid subgraph 대응)
const FC_SUBGRAPHS = [
  { label: 'P7  국민연금 입력 [병합]', rows: [8, 9],   cols: ['L', 'R']  },
  { label: 'P8  근로소득 입력 [병합]', rows: [11, 12], cols: ['LL', 'L'] },
  { label: 'P9  기타소득 입력 [병합]', rows: [13, 14], cols: ['L', 'R']  },
];

function fcEdgePt(node, magnet) {
  return {
    x: node.x + (magnet === 'LEFT' ? 0 : magnet === 'RIGHT' ? node.width  : node.width  / 2),
    y: node.y + (magnet === 'TOP'  ? 0 : magnet === 'BOTTOM' ? node.height : node.height / 2),
  };
}

function fcDrawEdge(page, fn, tn, fromMagnet, toMagnet, created) {
  const s = fcEdgePt(fn, fromMagnet);
  const e = fcEdgePt(tn, toMagnet);
  let d;
  if (Math.abs(s.x - e.x) < 2) {
    d = `M ${s.x} ${s.y} L ${e.x} ${e.y}`;
  } else if (fromMagnet === 'LEFT' || fromMagnet === 'RIGHT') {
    d = `M ${s.x} ${s.y} L ${e.x} ${s.y} L ${e.x} ${e.y}`;
  } else {
    const mid = s.y + (e.y - s.y) / 2;
    d = `M ${s.x} ${s.y} L ${s.x} ${mid} L ${e.x} ${mid} L ${e.x} ${e.y}`;
  }
  const vec = figma.createVector();
  vec.vectorPaths = [{ windingRule: 'NONE', data: d }];
  vec.strokes = [{ type: 'SOLID', color: { r: 0.35, g: 0.35, b: 0.35 } }];
  vec.strokeWeight = 1.5;
  vec.fills = [];
  page.appendChild(vec);
  created.push(vec);
}

function fcMkNode(label, type) {
  const col = FC.COLOR[type] || FC.COLOR.page;
  const frame = figma.createFrame();
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisAlignItems = 'CENTER';
  frame.counterAxisAlignItems = 'CENTER';
  frame.itemSpacing = 2;
  frame.paddingLeft = 12;
  frame.paddingRight = 12;
  frame.primaryAxisSizingMode = 'FIXED';
  frame.counterAxisSizingMode = 'FIXED';
  frame.resize(FC.NW, FC.NH);
  frame.fills = [{ type: 'SOLID', color: col.bg }];
  frame.cornerRadius = type === 'decision' ? 32 : 8;

  label.split('\n').forEach(line => {
    const t = figma.createText();
    try { t.fontName = gf('semibold'); } catch (_) {}
    t.characters = line;
    t.fontSize = 11;
    t.fills = [{ type: 'SOLID', color: col.text }];
    t.textAlignHorizontal = 'CENTER';
    frame.appendChild(t);
    t.layoutSizingHorizontal = 'FILL';
  });

  return frame;
}

async function buildFlowchart() {
  const page = figma.currentPage;
  const STEP = FC.NH + FC.VG;
  const created = [];

  const title = figma.createText();
  try { title.fontName = gf('bold'); } catch (_) {}
  title.characters = '#1114 인출설계 설문 플로우  (2026-03-11 확정)';
  title.fontSize = 18;
  title.fills = [{ type: 'SOLID', color: C.text900 }];
  title.x = FC.COL.L - FC.NW / 2;
  title.y = -56;
  page.appendChild(title);
  created.push(title);

  // subgraph 배경 프레임 (노드보다 먼저 렌더링)
  for (const sg of FC_SUBGRAPHS) {
    const PAD = 20;
    const x0 = FC.COL[sg.cols[0]] - FC.NW / 2 - PAD;
    const x1 = FC.COL[sg.cols[1]] + FC.NW / 2 + PAD;
    const y0 = sg.rows[0] * STEP - 30;
    const y1 = (sg.rows[1] + 1) * STEP - FC.VG + 10;
    const bg = figma.createFrame();
    bg.resize(x1 - x0, y1 - y0);
    bg.x = x0;
    bg.y = y0;
    bg.fills = [{ type: 'SOLID', color: hex(249, 249, 249), opacity: 0.8 }];
    bg.strokes = [{ type: 'SOLID', color: hex(204, 204, 204) }];
    bg.strokeWeight = 1;
    bg.dashPattern = [6, 4];
    bg.cornerRadius = 12;
    bg.clipsContent = false;
    const lbl = figma.createText();
    try { lbl.fontName = gf('semibold'); } catch (_) {}
    lbl.characters = sg.label;
    lbl.fontSize = 11;
    lbl.fills = [{ type: 'SOLID', color: C.text500 }];
    lbl.x = x0 + 8;
    lbl.y = y0 + 6;
    page.appendChild(bg);
    page.appendChild(lbl);
    created.push(bg);
    created.push(lbl);
  }

  const nodeMap = {};
  for (const [id, label, type, col, row] of FC_NODES) {
    const node = fcMkNode(label, type);
    node.name = id;
    node.x = FC.COL[col] - FC.NW / 2;
    node.y = row * STEP;
    page.appendChild(node);
    nodeMap[id] = node;
    created.push(node);
  }

  for (const [fromId, toId, edgeLabel, fromMagnet, toMagnet] of FC_EDGES) {
    const fn = nodeMap[fromId];
    const tn = nodeMap[toId];
    if (!fn || !tn) continue;
    fcDrawEdge(page, fn, tn, fromMagnet, toMagnet, created);
    if (edgeLabel) {
      const s = fcEdgePt(fn, fromMagnet);
      const e = fcEdgePt(tn, toMagnet);
      const lbl = figma.createText();
      try { lbl.fontName = gf('bold'); } catch (_) {}
      lbl.characters = edgeLabel;
      lbl.fontSize = 11;
      lbl.fills = [{ type: 'SOLID', color: C.text800 }];
      lbl.x = (s.x + e.x) / 2;
      lbl.y = (s.y + e.y) / 2 - 14;
      page.appendChild(lbl);
      created.push(lbl);
    }
  }

  figma.viewport.scrollAndZoomIntoView(created);
}
