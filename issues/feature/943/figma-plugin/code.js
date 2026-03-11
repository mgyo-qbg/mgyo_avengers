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
      if (msg.pages.includes(7))  frames.push(buildPage7());
      if (msg.pages.includes(8))  frames.push(buildPage8());
      if (msg.pages.includes(9))  frames.push(buildPage9());
      if (msg.pages.includes(10)) frames.push(buildPage10());
      if (msg.pages.includes(11)) frames.push(buildPage11());
      if (msg.pages.includes(12)) frames.push(buildPage12());
      if (msg.pages.includes(13)) frames.push(buildPage13());
      if (msg.pages.includes(14)) frames.push(buildPage14());
      if (msg.pages.includes(15)) frames.push(buildPage15());
      if (msg.pages.includes(16)) frames.push(buildPage16());

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

  // DS: buttons Xlarge — 335×52px, r=8, fill=Primary/500
  const btn = hf('CTA Button', CONTENT_W, 52, {
    bg: C.primary500, radius: 8, align: 'CENTER', justify: 'CENTER',
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

// ── Step Indicator ──────────────────────────────────────────────────────
// DS: Progress Bar md — 375×4px, bg=#EFEFF0, fill=Primary/500

function buildStepIndicator(current, total) {
  const wrapper = vf('Step Indicator', W, 32, {
    bg: C.white, gap: 8, pt: 8, pb: 0,
  });

  // 스텝 텍스트: DS Body/Caption — 12px/400
  const label = mkText(current + ' / ' + total, 12, 'medium', C.text500);
  label.textAlignHorizontal = 'CENTER';
  wrapper.appendChild(label);
  label.layoutAlign = 'STRETCH';

  // DS: Progress Bar md — 375×4px
  const barBg = hf('Progress Bar', W, 4, {});
  barBg.fills = solid(C.gray200);
  barBg.clipsContent = true;
  const fillW = Math.round(W * (current / total));
  const barFill = mkRect(fillW, 4, C.primary500);
  barBg.appendChild(barFill);
  barFill.layoutPositioning = 'ABSOLUTE';
  barFill.x = 0;
  barFill.y = 0;
  wrapper.appendChild(barBg);
  barBg.layoutSizingHorizontal = 'FILL';

  return wrapper;
}

// ── Root Frame Builder ──────────────────────────────────────────────────

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

  // DS: Scroll Content — 수직 스크롤 영역, pad=20(H) 24(V)
  const scroll = vf('Scroll Content', W, 100, {
    bg: C.white, clip: true, px: PAD, pt: 28, pb: 28, gap: 20,
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

// P4: 은퇴시기 · 기대수명 · 생활비 (1/8)
function buildPage4() {
  const { root, scroll } = buildRoot('P4 - 은퇴시기/기대수명/생활비', {
    navTitle: '인출설계', ctaLabel: '다음', pageNo: 1, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('은퇴 후 생활 계획을\n알려주세요'));
  scroll.appendChild(buildSubHeader('은퇴 시점과 기대수명에 따라 필요한\n자산 규모와 준비 전략이 달라집니다'));

  // DS: Textinput/Textfield 구조 — label(13px) + field(48px) + helper(12px), gap=6
  const g1 = vf('Field - 은퇴시기', CONTENT_W, 1, { gap: 6 });
  g1.fills = [];
  g1.primaryAxisSizingMode = 'AUTO';
  g1.appendChild(buildLabel('은퇴 예상 시기'));
  g1.appendChild(buildSelectBox('65세'));
  g1.appendChild(buildHelperText('일반적인 은퇴 시기: 60~65세 / 국민연금은 65세부터 감액 없이 수령 가능'));
  scroll.appendChild(g1);

  const g2 = vf('Field - 기대수명', CONTENT_W, 1, { gap: 6 });
  g2.fills = [];
  g2.primaryAxisSizingMode = 'AUTO';
  g2.appendChild(buildLabel('기대수명'));
  g2.appendChild(buildSelectBox('100세'));
  g2.appendChild(buildHelperText('평균 기대수명 남성 81세, 여성 87세 / 평균보다 5~10년 길게 설정 권장'));
  scroll.appendChild(g2);

  const g3 = vf('Field - 월생활비', CONTENT_W, 1, { gap: 6 });
  g3.fills = [];
  g3.primaryAxisSizingMode = 'AUTO';
  g3.appendChild(buildLabel('월 생활비'));
  g3.appendChild(buildTextInput('324', '만원/월'));
  g3.appendChild(buildHelperText('현재 생활비의 70~80% 수준 / 기본 200~300만원 · 중간 300~500만원 · 여유 500~800만원'));
  scroll.appendChild(g3);

  return root;
}

// P5: 국민연금 Y/N (2/8)
function buildPage5() {
  const { root, scroll } = buildRoot('P5 - 국민연금 수령액 여부', {
    navTitle: '인출설계', cta: false, pageNo: 2, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('국민연금 예상 수령액을\n알고 있나요?'));

  const cards = vf('Choice Cards', CONTENT_W, 1, { gap: 12 });
  cards.fills = [];
  cards.primaryAxisSizingMode = 'AUTO';
  cards.appendChild(buildChoiceCard('네, 알고 있어요', false));
  cards.appendChild(buildChoiceCard('아니요, 계산해 볼게요', false));
  scroll.appendChild(cards);

  return root;
}

// P6: 국민연금 계산기 (3/8)
function buildPage6() {
  const { root, scroll } = buildRoot('P6 - 국민연금 계산기', {
    navTitle: '인출설계', ctaLabel: '계산하기', pageNo: 3, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('국민연금 예상액을\n계산해 볼게요'));
  scroll.appendChild(buildSubHeader('은퇴 후 받으실 국민연금을\n계산해드릴게요'));

  const g1 = vf('Field - 연소득', CONTENT_W, 1, { gap: 6 });
  g1.fills = [];
  g1.primaryAxisSizingMode = 'AUTO';
  g1.appendChild(buildLabel('연소득 (세전)'));
  g1.appendChild(buildTextInput('세전 연소득을 입력해 주세요', '만원'));
  scroll.appendChild(g1);

  const g2 = vf('Field - 가입시기', CONTENT_W, 1, { gap: 6 });
  g2.fills = [];
  g2.primaryAxisSizingMode = 'AUTO';
  g2.appendChild(buildLabel('국민연금 최초 가입 시기'));
  const selectRow = hf('Select Row', CONTENT_W, 48, { gap: 8 });
  selectRow.fills = [];
  const halfW = Math.floor((CONTENT_W - 8) / 2);
  selectRow.appendChild(buildSelectBox('2000년', halfW));
  selectRow.appendChild(buildSelectBox('1월', halfW));
  g2.appendChild(selectRow);
  scroll.appendChild(g2);

  const g3 = vf('Field - 납입종료', CONTENT_W, 1, { gap: 6 });
  g3.fills = [];
  g3.primaryAxisSizingMode = 'AUTO';
  g3.appendChild(buildLabel('납입 종료 예정'));
  g3.appendChild(buildReadonlyField('2051년 (은퇴시기 연동)'));
  g3.appendChild(buildHelperText('은퇴시기와 동일하게 적용됩니다'));
  scroll.appendChild(g3);

  scroll.appendChild(buildHelperText('실제 수령액은 국민연금공단 기준과 다를 수 있어요.'));

  return root;
}

// P7: 국민연금 직접입력 (3/8)
function buildPage7() {
  const { root, scroll } = buildRoot('P7 - 국민연금 직접입력', {
    navTitle: '인출설계', ctaLabel: '다음', pageNo: 3, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('국민연금 예상 월수령액을\n입력해 주세요'));
  scroll.appendChild(buildSubHeader('예상 국민연금 월 수령액을\n알려주세요'));

  const group = vf('Field Group', CONTENT_W, 1, { gap: 6 });
  group.fills = [];
  group.primaryAxisSizingMode = 'AUTO';
  group.appendChild(buildLabel('월 수령액 (세전)'));
  group.appendChild(buildTextInput('예상 월수령액을 입력해 주세요', '만원/월'));
  scroll.appendChild(group);

  return root;
}

// P8: 마이데이터 IRP/DC 자산 확인 (4/8)
function buildPage8() {
  const { root, scroll } = buildRoot('P8 - IRP/DC 자산 확인', {
    navTitle: '인출설계', ctaLabel: '다음', pageNo: 4, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('연결된 퇴직연금을\n확인해 주세요'));
  scroll.appendChild(buildSubHeader('마이데이터로 연결된 퇴직연금 계좌입니다.'));

  const accounts = [
    { bank: '삼성증권', type: 'IRP', amount: '2,450만원' },
    { bank: '미래에셋증권', type: 'DC', amount: '3,120만원' },
    { bank: '한국투자증권', type: 'ISA', amount: '890만원' },
  ];

  for (const acc of accounts) {
    // DS: Cell/List Item Active — r=8, bg=#EBF5FF, pad h12/v14
    const card = hf('Account Card', CONTENT_W, 72, {
      bg: C.white, radius: 8, px: 16, align: 'CENTER', gap: 12,
      stroke: C.gray400, strokeW: 1,
    });
    card.primaryAxisAlignItems = 'MIN';

    // DS: Checkbox/Square/Md Checked — 18×18px, r=4, fill=#2E9BFF
    const checkBox = hf('Checkbox', 20, 20, {
      radius: 4, align: 'CENTER', justify: 'CENTER',
      bg: C.primary500,
    });
    const checkMark = mkText('✓', 13, 'bold', C.white);
    checkMark.textAlignHorizontal = 'CENTER';
    checkBox.appendChild(checkMark);
    checkBox.primaryAxisAlignItems = 'CENTER';
    checkBox.counterAxisAlignItems = 'CENTER';
    card.appendChild(checkBox);

    const info = vf('Info', CONTENT_W - 48, 44, { gap: 4 });
    info.fills = [];
    // DS: Subtitle/Small — 14px/600
    info.appendChild(mkText(acc.bank + '  ' + acc.type, 14, 'semibold', C.text900));
    // DS: Body/Caption — 12px/400
    info.appendChild(mkText('평가금액 ' + acc.amount, 12, 'regular', C.text500));
    card.appendChild(info);
    info.layoutSizingHorizontal = 'FILL';

    scroll.appendChild(card);
  }

  scroll.appendChild(buildHelperText('계좌 정보는 마이데이터 기준이며, 실제 잔액과 차이가 있을 수 있어요.'));

  return root;
}

// P9: 근로소득자 여부 (5/8)
function buildPage9() {
  const { root, scroll } = buildRoot('P9 - 근로소득자 여부', {
    navTitle: '인출설계', cta: false, pageNo: 5, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('현재 근로소득이 있나요?'));
  scroll.appendChild(buildSubHeader('퇴직금 예상액 산출에 필요해요.'));

  const cards = vf('Choice Cards', CONTENT_W, 1, { gap: 12 });
  cards.fills = [];
  cards.primaryAxisSizingMode = 'AUTO';
  cards.appendChild(buildChoiceCard('네, 있어요', false));
  cards.appendChild(buildChoiceCard('아니요, 없어요', false));
  scroll.appendChild(cards);

  return root;
}

// P10: 연봉 · 근속연수 (6/8)
function buildPage10() {
  const { root, scroll } = buildRoot('P10 - 연봉/근속연수', {
    navTitle: '인출설계', ctaLabel: '다음', pageNo: 6, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('연봉과 근속연수를\n입력해 주세요'));
  scroll.appendChild(buildSubHeader('입력한 연봉과 근속연수를 바탕으로\n퇴직금을 예상해 드려요.'));

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

// P11: 기타 정기소득 여부 (7/8)
function buildPage11() {
  const { root, scroll } = buildRoot('P11 - 기타 정기소득 여부', {
    navTitle: '인출설계', cta: false, pageNo: 7, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('은퇴 후 기타 정기소득이\n있거나 예정인가요?'));
  scroll.appendChild(buildSubHeader('임대소득, 사업소득, 배당소득 등\n정기적으로 받는 소득이 있다면 알려주세요.'));

  const cards = vf('Choice Cards', CONTENT_W, 1, { gap: 12 });
  cards.fills = [];
  cards.primaryAxisSizingMode = 'AUTO';
  cards.appendChild(buildChoiceCard('네, 있어요', false));
  cards.appendChild(buildChoiceCard('아니요, 없어요', false));
  scroll.appendChild(cards);

  return root;
}

// P12: 기타 정기소득 입력 (7/8)
function buildPage12() {
  const { root, scroll } = buildRoot('P12 - 기타 정기소득 입력', {
    navTitle: '인출설계', ctaLabel: '다음', pageNo: 7, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('기타 정기소득을\n입력해 주세요'));
  scroll.appendChild(buildSubHeader('은퇴 후 정기적으로 받으실 소득을\n알려주세요'));

  const g1 = vf('Field - 연소득', CONTENT_W, 1, { gap: 6 });
  g1.fills = [];
  g1.primaryAxisSizingMode = 'AUTO';
  g1.appendChild(buildLabel('연소득 (세전)'));
  g1.appendChild(buildTextInput('연소득을 입력해 주세요', '만원/년'));
  g1.appendChild(buildHelperText('월세, 임대 수입, 배당금 등 근로소득 외 정기적으로 받는 소득의 연간 합계'));
  scroll.appendChild(g1);

  // 시작/종료 시기 — DS: Readonly (은퇴시기/기대수명 연동)
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
function buildPage13() {
  const { root, scroll } = buildRoot('P13 - 결과 확인', {
    navTitle: '인출설계', ctaLabel: 'FA에게 전달하기', pageNo: 8, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('입력하신 내용을\n확인해 주세요'));
  scroll.appendChild(buildSubHeader('수정이 필요한 항목을 탭하면 해당 화면으로 이동합니다.'));

  const summaryItems = [
    { label: '은퇴 예상 시기', value: '65세' },
    { label: '기대수명', value: '100세' },
    { label: '월 생활비', value: '324만원' },
    { label: '국민연금 월 수령액', value: '120만원 (세전)' },
    { label: '퇴직연금', value: '3개 계좌 / 6,460만원' },
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
function buildPage14() {
  const { root, scroll } = buildRoot('P14 - 약관동의', {
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
function buildPage15() {
  const { root, scroll } = buildRoot('P15 - 전송 로딩', {
    navTitle: '인출설계', cta: false,
  });

  scroll.primaryAxisAlignItems = 'CENTER';
  scroll.counterAxisAlignItems = 'CENTER';

  // 스피너 — DS: Progress Bar 원형 느낌, Primary/500
  const spinnerWrap = hf('Spinner', 72, 72, { align: 'CENTER', justify: 'CENTER' });
  spinnerWrap.fills = [];

  const outerRing = mkEllipse(72, 72, C.gray200);
  spinnerWrap.appendChild(outerRing);
  outerRing.layoutPositioning = 'ABSOLUTE';
  outerRing.x = 0; outerRing.y = 0;

  const arc = mkEllipse(72, 72, C.primary500);
  arc.opacity = 0.35;
  spinnerWrap.appendChild(arc);
  arc.layoutPositioning = 'ABSOLUTE';
  arc.x = 0; arc.y = 0;

  const innerCircle = mkEllipse(52, 52, C.white);
  spinnerWrap.appendChild(innerCircle);
  innerCircle.layoutPositioning = 'ABSOLUTE';
  innerCircle.x = 10; innerCircle.y = 10;

  // 중앙 primary 점
  const centerDot = mkEllipse(14, 14, C.primary500);
  spinnerWrap.appendChild(centerDot);
  centerDot.layoutPositioning = 'ABSOLUTE';
  centerDot.x = 29; centerDot.y = 29;

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
function buildPage16() {
  const { root, scroll } = buildRoot('P16 - 전달 완료', {
    navTitle: '인출설계', ctaLabel: '홈으로 돌아가기',
  });

  scroll.primaryAxisAlignItems = 'CENTER';
  scroll.counterAxisAlignItems = 'CENTER';

  // DS: Utility/Green 500 #3AD1A9
  const checkBg = hf('Check Icon Bg', 72, 72, {
    bg: C.green500, bgOp: 0.15, radius: 100,
    align: 'CENTER', justify: 'CENTER',
  });
  checkBg.primaryAxisAlignItems = 'CENTER';
  checkBg.counterAxisAlignItems = 'CENTER';
  const checkCircle = mkEllipse(44, 44, C.green500);
  checkBg.appendChild(checkCircle);
  checkCircle.layoutPositioning = 'ABSOLUTE';
  checkCircle.x = 14; checkCircle.y = 14;
  const checkMark = mkText('✓', 24, 'bold', C.white);
  checkMark.textAlignHorizontal = 'CENTER';
  checkBg.appendChild(checkMark);
  scroll.appendChild(checkBg);

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
  COL: { L: 100, C: 400, R: 700 },
  COLOR: {
    start:    { bg: hex( 46, 201, 114), text: C.white },
    end:      { bg: hex( 46, 201, 114), text: C.white },
    page:     { bg: C.primary500,       text: C.white },
    action:   { bg: hex(124, 106, 245), text: C.white },
    decision: { bg: hex(245, 189,  13), text: C.text900 },
    terminal: { bg: C.red500,           text: C.white },
  },
};

const FC_NODES = [
  ['ENTRY',        '인출설계 설문\n입력 진입점',              'start',    'C',  0 ],
  ['FA_YN',        '매칭된 FA 유무?',                        'decision', 'C',  1 ],
  ['FA_AUTO',      'qb.event 계정에\nFA 자동 매칭',          'action',   'L',  2 ],
  ['SURVEY_START', '설문입력\n시작 페이지',                  'page',     'C',  3 ],
  ['MYDATA_YN',    '마데 절세형/일반형\n자산 보유?',         'decision', 'C',  4 ],
  ['ASSET_NONE',   '자산없음\n경고 페이지',                  'terminal', 'R',  4 ],
  ['EXPENSE',      '은퇴시기·기대수명\n은퇴 후 생활비 입력', 'page',     'C',  5 ],
  ['NPS_Q',        '국민연금 예상 수령액을\n아시나요?',       'page',     'C',  6 ],
  ['NPS_YN',       '안다 / 모른다?',                         'decision', 'C',  7 ],
  ['NPS_CALC',     '국민연금\n계산기 입력',                  'page',     'L',  8 ],
  ['NPS_DIRECT',   '국민연금\n월수령액 직접입력',            'page',     'R',  8 ],
  ['DC_YN',        'DC 자산\n보유여부?',                     'decision', 'C',  9 ],
  ['IRP_DC',       '마이데이터\nIRP/DC 자산 확인',           'page',     'R', 10 ],
  ['WORKER_Q',     '근로소득자\n이신가요?',                  'page',     'C', 10 ],
  ['WORKER_YN',    '근로소득자?',                            'decision', 'C', 11 ],
  ['SALARY',       '현재연봉·근속연수\n입력 페이지',         'page',     'L', 12 ],
  ['EXTRA_Q',      '기타 정기소득이\n있나요?',               'page',     'C', 13 ],
  ['EXTRA_YN',     '기타 정기소득\n유무?',                   'decision', 'C', 14 ],
  ['EXTRA_INPUT',  '기타 정기소득\n입력 페이지',             'page',     'R', 15 ],
  ['RESULT',       '설문 결과전달\n페이지',                  'page',     'C', 16 ],
  ['TERMS_YN',     'T0054\n약관동의?',                       'decision', 'C', 17 ],
  ['TERMS',        'T0054 약관동의\n페이지',                 'page',     'L', 18 ],
  ['SENDING',      '설문결과\n전송 로딩',                    'page',     'C', 19 ],
  ['DONE',         '설문 결과전달\n완료',                    'page',     'C', 20 ],
  ['HOME',         '베러웰스 홈',                            'end',      'C', 21 ],
];

const FC_EDGES = [
  ['ENTRY',       'FA_YN',       '',       'BOTTOM', 'TOP'   ],
  ['FA_YN',       'FA_AUTO',     'N',      'LEFT',   'TOP'   ],
  ['FA_YN',       'SURVEY_START','Y',      'BOTTOM', 'TOP'   ],
  ['FA_AUTO',     'SURVEY_START','',       'BOTTOM', 'LEFT'  ],
  ['SURVEY_START','MYDATA_YN',   '',       'BOTTOM', 'TOP'   ],
  ['MYDATA_YN',   'ASSET_NONE',  'N',      'RIGHT',  'LEFT'  ],
  ['MYDATA_YN',   'EXPENSE',     'Y',      'BOTTOM', 'TOP'   ],
  ['EXPENSE',     'NPS_Q',       '',       'BOTTOM', 'TOP'   ],
  ['NPS_Q',       'NPS_YN',      '',       'BOTTOM', 'TOP'   ],
  ['NPS_YN',      'NPS_CALC',    'N',      'LEFT',   'TOP'   ],
  ['NPS_YN',      'NPS_DIRECT',  'Y',      'RIGHT',  'TOP'   ],
  ['NPS_CALC',    'DC_YN',       '',       'BOTTOM', 'LEFT'  ],
  ['NPS_DIRECT',  'DC_YN',       '',       'BOTTOM', 'RIGHT' ],
  ['DC_YN',       'IRP_DC',      'Y',      'RIGHT',  'TOP'   ],
  ['DC_YN',       'WORKER_Q',    'N',      'BOTTOM', 'TOP'   ],
  ['IRP_DC',      'EXTRA_Q',     '',       'BOTTOM', 'RIGHT' ],
  ['WORKER_Q',    'WORKER_YN',   '',       'BOTTOM', 'TOP'   ],
  ['WORKER_YN',   'SALARY',      'Y',      'LEFT',   'TOP'   ],
  ['WORKER_YN',   'EXTRA_Q',     'N',      'BOTTOM', 'TOP'   ],
  ['SALARY',      'EXTRA_Q',     '',       'BOTTOM', 'LEFT'  ],
  ['EXTRA_Q',     'EXTRA_YN',    '',       'BOTTOM', 'TOP'   ],
  ['EXTRA_YN',    'EXTRA_INPUT', 'Y',      'RIGHT',  'TOP'   ],
  ['EXTRA_YN',    'RESULT',      'N',      'BOTTOM', 'TOP'   ],
  ['EXTRA_INPUT', 'RESULT',      '',       'BOTTOM', 'RIGHT' ],
  ['RESULT',      'TERMS_YN',    '',       'BOTTOM', 'TOP'   ],
  ['TERMS_YN',    'TERMS',       'N',      'LEFT',   'TOP'   ],
  ['TERMS_YN',    'SENDING',     'Y',      'BOTTOM', 'TOP'   ],
  ['TERMS',       'SENDING',     '',       'BOTTOM', 'LEFT'  ],
  ['SENDING',     'DONE',        '',       'BOTTOM', 'TOP'   ],
  ['DONE',        'HOME',        '',       'BOTTOM', 'TOP'   ],
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
  title.characters = '#1114 인출설계 설문 플로우  (2026-03-09 확정)';
  title.fontSize = 18;
  title.fills = [{ type: 'SOLID', color: C.text900 }];
  title.x = FC.COL.L - FC.NW / 2;
  title.y = -56;
  page.appendChild(title);
  created.push(title);

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
