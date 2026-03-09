// #1114 인출설계 설문지 — Figma Plugin
// 대상 파일: mgyo_note (AioSbUjrVBRnqTpFsltOC5) / 베러웰스 App (0DVyXyoWEbXXNOZF0H92Ic)
// 가이드: plugin_guidelines.md 준수

const W = 375;
const H = 812;
const STATUS_H = 44;
const TOPNAV_H = 44;
const CTA_H = 88; // CTA 버튼 영역 (52 + 패딩)
const TOP_H = STATUS_H + TOPNAV_H;
const PAD = 20;
const CONTENT_W = W - PAD * 2;

const C = {
  primary500: { r: 0.180, g: 0.608, b: 1.000 },
  secondary:  { r: 0.180, g: 0.345, b: 1.000 },
  green300:   { r: 0.227, g: 0.820, b: 0.663 },
  red:        { r: 1.000, g: 0.322, b: 0.278 },
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

      // 가로 400px 간격으로 배치
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

// ── Shared Components ──────────────────────────────────────────────────

function buildStatusBar() {
  const f = hf('Status Bar', W, STATUS_H, { bg: C.white, justify: 'CENTER', align: 'CENTER' });
  const t = mkText('9:41', 15, 'semibold', C.text900);
  t.textAlignHorizontal = 'CENTER';
  f.appendChild(t);
  return f;
}

function buildTopNavBack(title) {
  const f = hf('Top Nav', W, TOPNAV_H, {
    bg: C.white, align: 'CENTER', pl: 4, pr: 16, gap: 4,
  });

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

function buildSectionHeader(text) {
  return mkText(text, 20, 'bold', C.text900);
}

function buildSubHeader(text) {
  const t = mkText(text, 14, 'regular', C.text500);
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  return t;
}

function buildLabel(text) {
  return mkText(text, 13, 'semibold', C.text800);
}

function buildSelectBox(placeholder, w) {
  w = w || CONTENT_W;
  const box = hf('Select Box', w, 48, {
    bg: C.white, radius: 10, px: 16, align: 'CENTER', justify: 'SPACE_BETWEEN',
    stroke: C.gray200, strokeW: 1,
  });
  box.primaryAxisAlignItems = 'SPACE_BETWEEN';

  const txt = mkText(placeholder, 14, 'regular', C.text800);
  box.appendChild(txt);
  txt.layoutSizingHorizontal = 'FILL';

  const chevron = mkText('v', 12, 'regular', C.gray400);
  box.appendChild(chevron);

  return box;
}

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

function buildChoiceCard(text, isSelected) {
  const card = hf('Choice Card', CONTENT_W, 72, {
    bg: C.white, radius: 12, px: 20, align: 'CENTER', justify: 'SPACE_BETWEEN',
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

function buildHelperText(text) {
  return mkText(text, 12, 'regular', C.text500);
}


function buildPicker(options) {
  const pickerW = CONTENT_W;
  const itemW = Math.floor((pickerW - (options.length - 1)) / options.length);
  const picker = hf('Picker', pickerW, 52, {
    bg: C.gray100, radius: 12, gap: 1,
  });

  options.forEach((label, i) => {
    const isFirst = i === 0;
    const item = hf('Picker-' + label, itemW, 50, {
      align: 'CENTER', justify: 'CENTER',
      bg: isFirst ? C.white : C.gray100,
      radius: 10,
    });
    const txt = mkText(label, 15, isFirst ? 'semibold' : 'regular',
      isFirst ? C.text900 : C.text500);
    txt.textAlignHorizontal = 'CENTER';
    item.appendChild(txt);
    picker.appendChild(item);
  });

  return picker;
}

// ── Root Frame Builder ─────────────────────────────────────────────────

function buildStepIndicator(current, total) {
  const STEP_H = 28;
  const wrapper = vf('Step Indicator', W, STEP_H, {
    bg: C.white, gap: 6, pt: 8, pb: 0,
  });

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
  barFill.x = 0;
  barFill.y = 0;
  wrapper.appendChild(barBg);
  barBg.layoutSizingHorizontal = 'FILL';

  return wrapper;
}

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
    const step = buildStepIndicator(opts.pageNo, opts.pageTotal || 10);
    root.appendChild(step);
    step.layoutSizingHorizontal = 'FILL';
  }

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
// PAGE BUILDERS — 확정 기획 스펙 (2026-03-09)
// P1~P3: 진입/조건, P4~P13: 설문(1/8~8/8), P14~P16: 후처리
// ══════════════════════════════════════════════════════════════════════

// P1: 설문 시작
function buildPage1() {
  const { root, scroll } = buildRoot('P1 - 설문 시작', {
    navTitle: '인출설계', ctaLabel: '시작하기',
  });

  scroll.appendChild(buildSectionHeader('은퇴 후 자산 인출 전략을\n설계해 볼까요?'));
  scroll.appendChild(buildSubHeader('몇 가지 질문에 답하면, 맞춤 인출 전략을\n제안해 드릴게요. (약 3분 소요)'));

  const timeCard = hf('Time Info', CONTENT_W, 48, {
    bg: C.gray50, radius: 10, px: 16, align: 'CENTER', gap: 8,
  });
  const clockIcon = mkEllipse(20, 20, C.primary500);
  timeCard.appendChild(clockIcon);
  timeCard.appendChild(mkText('약 3분 소요', 14, 'medium', C.text800));
  scroll.appendChild(timeCard);

  return root;
}

// P3: 자산없음 경고
function buildPage3() {
  const { root, scroll } = buildRoot('P3 - 자산없음 경고', {
    navTitle: '인출설계', ctaLabel: '마이데이터 연결하기',
  });

  scroll.primaryAxisAlignItems = 'CENTER';
  scroll.counterAxisAlignItems = 'CENTER';

  const warnWrap = hf('Warn Icon', 64, 64, { align: 'CENTER', justify: 'CENTER' });
  warnWrap.fills = [];
  const warnBg = mkEllipse(64, 64, C.red);
  warnBg.opacity = 0.12;
  warnWrap.appendChild(warnBg);
  warnBg.layoutPositioning = 'ABSOLUTE';
  warnBg.x = 0;
  warnBg.y = 0;
  const warnIcon = mkText('!', 28, 'bold', C.red);
  warnIcon.textAlignHorizontal = 'CENTER';
  warnWrap.appendChild(warnIcon);
  scroll.appendChild(warnWrap);

  const header = mkText('연결된 퇴직연금이 없어요', 20, 'bold', C.text900);
  header.textAlignHorizontal = 'CENTER';
  scroll.appendChild(header);

  const sub = mkText('인출설계를 진행하려면 마이데이터로\nIRP, DC, ISA 중 하나 이상의\n계좌가 연결되어야 해요.', 14, 'regular', C.text500);
  sub.textAlignHorizontal = 'CENTER';
  scroll.appendChild(sub);

  scroll.appendChild(buildHelperText('마이데이터에서 퇴직연금 계좌를 연결한 뒤 다시 시도해 주세요.'));

  // 하단 "나중에 하기" 텍스트 링크
  const laterLink = mkText('나중에 하기', 14, 'medium', C.text500);
  laterLink.textAlignHorizontal = 'CENTER';
  laterLink.textDecoration = 'UNDERLINE';
  scroll.appendChild(laterLink);

  return root;
}

// P4: 은퇴시기 · 기대수명 · 생활비 통합 (1/8)
function buildPage4() {
  const { root, scroll } = buildRoot('P4 - 은퇴시기/기대수명/생활비', {
    navTitle: '인출설계', ctaLabel: '다음', pageNo: 1, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('은퇴 후 생활 계획을\n알려주세요'));

  // 은퇴 예상 시기
  const g1 = vf('Field - 은퇴시기', CONTENT_W, 80, { gap: 8 });
  g1.fills = [];
  g1.appendChild(buildLabel('은퇴 예상 시기'));
  g1.appendChild(buildSelectBox('65세'));
  scroll.appendChild(g1);

  const g2 = vf('Field - 기대수명', CONTENT_W, 80, { gap: 8 });
  g2.fills = [];
  g2.appendChild(buildLabel('기대수명'));
  g2.appendChild(buildSelectBox('100세'));
  scroll.appendChild(g2);

  // 월 생활비
  const g3 = vf('Field - 월생활비', CONTENT_W, 100, { gap: 8 });
  g3.fills = [];
  g3.appendChild(buildLabel('월 생활비'));
  g3.appendChild(buildTextInput('324', '만원/월'));
  g3.appendChild(buildHelperText('통계청 2인 가구 기준 평균 소비지출입니다.'));
  scroll.appendChild(g3);

  return root;
}

// P5: 국민연금 Y/N (2/8)
function buildPage5() {
  const { root, scroll } = buildRoot('P5 - 국민연금 수령액 여부', {
    navTitle: '인출설계', cta: false, pageNo: 2, pageTotal: 8,
  });

  scroll.appendChild(buildSectionHeader('국민연금 예상 수령액을\n알고 있나요?'));

  const cards = vf('Choice Cards', CONTENT_W, 160, { gap: 12 });
  cards.fills = [];
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
  scroll.appendChild(buildSubHeader('아래 정보를 입력하면 예상 수령액을\n계산해 드려요.'));

  // 세전 연소득
  const g1 = vf('Field - 연소득', CONTENT_W, 80, { gap: 8 });
  g1.fills = [];
  g1.appendChild(buildLabel('연소득 (세전)'));
  g1.appendChild(buildTextInput('세전 연소득을 입력해 주세요', '만원'));
  scroll.appendChild(g1);

  // 최초 가입 시기 (년 + 월)
  const g2 = vf('Field - 가입시기', CONTENT_W, 80, { gap: 8 });
  g2.fills = [];
  g2.appendChild(buildLabel('국민연금 최초 가입 시기'));
  const selectRow = hf('Select Row', CONTENT_W, 48, { gap: 8 });
  selectRow.fills = [];
  const halfW = Math.floor((CONTENT_W - 8) / 2);
  selectRow.appendChild(buildSelectBox('2000년', halfW));
  selectRow.appendChild(buildSelectBox('1월', halfW));
  g2.appendChild(selectRow);
  scroll.appendChild(g2);

  // 납입 종료 (readonly)
  const g3 = vf('Field - 납입종료', CONTENT_W, 100, { gap: 8 });
  g3.fills = [];
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
  scroll.appendChild(buildSubHeader('국민연금공단 예상연금 조회 결과를\n입력해 주세요.'));

  const group = vf('Field Group', CONTENT_W, 80, { gap: 8 });
  group.fills = [];
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

  // 퇴직연금 카드 리스트
  const accounts = [
    { bank: '삼성증권', type: 'IRP', amount: '2,450만원' },
    { bank: '미래에셋증권', type: 'DC', amount: '3,120만원' },
    { bank: '한국투자증권', type: 'ISA', amount: '890만원' },
  ];

  for (const acc of accounts) {
    const card = hf('Account Card', CONTENT_W, 72, {
      bg: C.white, radius: 12, px: 16, align: 'CENTER', gap: 12,
      stroke: C.gray200, strokeW: 1,
    });
    card.primaryAxisAlignItems = 'MIN';

    // 체크박스 표현
    const checkBox = hf('Checkbox', 22, 22, {
      radius: 4, align: 'CENTER', justify: 'CENTER',
      bg: C.primary500,
    });
    const checkMark = mkText('V', 12, 'bold', C.white);
    checkMark.textAlignHorizontal = 'CENTER';
    checkBox.appendChild(checkMark);
    card.appendChild(checkBox);

    const info = vf('Info', 200, 44, { gap: 2 });
    info.fills = [];
    const topRow = mkText(acc.bank + '  ' + acc.type, 14, 'semibold', C.text900);
    info.appendChild(topRow);
    info.appendChild(mkText('평가금액 ' + acc.amount, 13, 'regular', C.text500));
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

  const cards = vf('Choice Cards', CONTENT_W, 160, { gap: 12 });
  cards.fills = [];
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

  const g1 = vf('Field - 연봉', CONTENT_W, 80, { gap: 8 });
  g1.fills = [];
  g1.appendChild(buildLabel('연봉 (세전)'));
  g1.appendChild(buildTextInput('세전 연봉을 입력해 주세요', '만원'));
  scroll.appendChild(g1);

  const g2 = vf('Field - 근속연수', CONTENT_W, 80, { gap: 8 });
  g2.fills = [];
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

  const cards = vf('Choice Cards', CONTENT_W, 160, { gap: 12 });
  cards.fills = [];
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

  // 소득 유형
  const g0 = vf('Field - 소득유형', CONTENT_W, 80, { gap: 8 });
  g0.fills = [];
  g0.appendChild(buildLabel('소득 유형'));
  g0.appendChild(buildSelectBox('임대소득'));
  scroll.appendChild(g0);

  // 연소득
  const g1 = vf('Field - 연소득', CONTENT_W, 80, { gap: 8 });
  g1.fills = [];
  g1.appendChild(buildLabel('연소득 (세전)'));
  g1.appendChild(buildTextInput('연소득을 입력해 주세요', '만원/년'));
  scroll.appendChild(g1);

  // 소득 시작 시기 (readonly)
  const g2 = vf('Field - 시작시기', CONTENT_W, 100, { gap: 8 });
  g2.fills = [];
  g2.appendChild(buildLabel('소득 시작 시기'));
  g2.appendChild(buildReadonlyField('자동 설정'));
  g2.appendChild(buildHelperText('앞서 입력한 은퇴 시기가 자동 적용돼요'));
  scroll.appendChild(g2);

  // 소득 종료 시기 (readonly)
  const g3 = vf('Field - 종료시기', CONTENT_W, 100, { gap: 8 });
  g3.fills = [];
  g3.appendChild(buildLabel('소득 종료 시기'));
  g3.appendChild(buildReadonlyField('자동 설정'));
  g3.appendChild(buildHelperText('앞서 입력한 기대수명이 자동 적용돼요'));
  scroll.appendChild(g3);

  // + 추가하기 버튼
  const addBtn = hf('Add Button', CONTENT_W, 44, {
    radius: 10, align: 'CENTER', justify: 'CENTER',
    stroke: C.primary500, strokeW: 1,
  });
  addBtn.fills = solid(C.white);
  const addText = mkText('+ 추가하기', 14, 'medium', C.primary500);
  addText.textAlignHorizontal = 'CENTER';
  addBtn.appendChild(addText);
  scroll.appendChild(addBtn);

  scroll.appendChild(buildHelperText('소득이 여러 건이면 추가하기로 항목을 더 입력할 수 있어요.'));

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

  const list = vf('Summary List', CONTENT_W, summaryItems.length * 60, { gap: 0 });
  list.fills = [];

  for (let i = 0; i < summaryItems.length; i++) {
    const item = summaryItems[i];
    const row = hf('Item-' + item.label, CONTENT_W, 52, {
      align: 'CENTER', justify: 'SPACE_BETWEEN', py: 8,
    });
    row.fills = [];
    row.primaryAxisAlignItems = 'SPACE_BETWEEN';

    const leftCol = vf('Left', CONTENT_W - 60, 36, { gap: 2 });
    leftCol.fills = [];
    leftCol.appendChild(mkText(item.label, 12, 'regular', C.text500));
    leftCol.appendChild(mkText(item.value, 15, 'semibold', C.text900));
    row.appendChild(leftCol);
    leftCol.layoutSizingHorizontal = 'FILL';

    const editBtn = hf('Edit Btn', 48, 28, {
      radius: 6, align: 'CENTER', justify: 'CENTER',
      stroke: C.gray200, strokeW: 1,
    });
    editBtn.fills = solid(C.white);
    const editText = mkText('수정', 12, 'medium', C.primary500);
    editText.textAlignHorizontal = 'CENTER';
    editBtn.appendChild(editText);
    row.appendChild(editBtn);

    list.appendChild(row);

    if (i < summaryItems.length - 1) {
      const div = mkRect(CONTENT_W, 1, C.gray100);
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

  // 전체 동의
  const allAgree = hf('All Agree', CONTENT_W, 52, {
    bg: C.gray50, radius: 12, px: 16, align: 'CENTER', gap: 12,
  });
  const allCheck = hf('Checkbox', 22, 22, {
    radius: 4, align: 'CENTER', justify: 'CENTER',
    bg: C.primary500,
  });
  const allCheckMark = mkText('V', 12, 'bold', C.white);
  allCheckMark.textAlignHorizontal = 'CENTER';
  allCheck.appendChild(allCheckMark);
  allAgree.appendChild(allCheck);
  allAgree.appendChild(mkText('전체 동의', 15, 'semibold', C.text900));
  scroll.appendChild(allAgree);

  // 구분선
  scroll.appendChild(mkRect(CONTENT_W, 1, C.gray100));

  // 개별 항목
  const terms = [
    { text: '[필수] 인출설계 서비스 이용약관', checked: true },
    { text: '[필수] 개인정보 수집·이용 동의', checked: true },
    { text: '[필수] 개인정보 제3자 제공 동의', checked: true },
    { text: '[선택] 마케팅 정보 수신 동의', checked: false },
  ];

  for (const term of terms) {
    const row = hf('Term Row', CONTENT_W, 44, {
      align: 'CENTER', justify: 'SPACE_BETWEEN', px: 4,
    });
    row.fills = [];
    row.primaryAxisAlignItems = 'SPACE_BETWEEN';

    const leftPart = hf('Left', 260, 22, { align: 'CENTER', gap: 12 });
    leftPart.fills = [];

    const cb = hf('Checkbox', 22, 22, {
      radius: 4, align: 'CENTER', justify: 'CENTER',
      bg: term.checked ? C.primary500 : C.white,
      stroke: term.checked ? C.primary500 : C.gray200, strokeW: 1,
    });
    if (term.checked) {
      const cm = mkText('V', 12, 'bold', C.white);
      cm.textAlignHorizontal = 'CENTER';
      cb.appendChild(cm);
    }
    leftPart.appendChild(cb);
    leftPart.appendChild(mkText(term.text, 13, 'regular', C.text800));
    row.appendChild(leftPart);
    leftPart.layoutSizingHorizontal = 'FILL';

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

  const spinnerWrap = hf('Spinner', 64, 64, { align: 'CENTER', justify: 'CENTER' });
  spinnerWrap.fills = [];
  const outerRing = mkEllipse(64, 64, C.gray100);
  spinnerWrap.appendChild(outerRing);
  outerRing.layoutPositioning = 'ABSOLUTE';
  outerRing.x = 0;
  outerRing.y = 0;
  const arc = mkEllipse(64, 64, C.primary500);
  arc.opacity = 0.3;
  spinnerWrap.appendChild(arc);
  arc.layoutPositioning = 'ABSOLUTE';
  arc.x = 0;
  arc.y = 0;
  const innerCircle = mkEllipse(48, 48, C.white);
  spinnerWrap.appendChild(innerCircle);
  innerCircle.layoutPositioning = 'ABSOLUTE';
  innerCircle.x = 8;
  innerCircle.y = 8;
  scroll.appendChild(spinnerWrap);

  const loadingHeader = mkText('FA에게 전달하고 있어요', 16, 'semibold', C.text900);
  loadingHeader.textAlignHorizontal = 'CENTER';
  scroll.appendChild(loadingHeader);

  const loadingSub = mkText('잠시만 기다려 주세요.', 14, 'regular', C.text500);
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

  const checkWrap = hf('Check Icon', 72, 72, { align: 'CENTER', justify: 'CENTER' });
  checkWrap.fills = [];
  const checkBg = mkEllipse(72, 72, C.green300);
  checkWrap.appendChild(checkBg);
  checkBg.layoutPositioning = 'ABSOLUTE';
  checkBg.x = 0;
  checkBg.y = 0;
  const checkMark = mkText('V', 28, 'bold', C.white);
  checkMark.textAlignHorizontal = 'CENTER';
  checkWrap.appendChild(checkMark);
  scroll.appendChild(checkWrap);

  const header = mkText('인출설계 첫 걸음을\n내딛으셨어요', 20, 'bold', C.text900);
  header.textAlignHorizontal = 'CENTER';
  scroll.appendChild(header);

  // 임팩트 문구 박스
  const impactBox = vf('Impact Box', CONTENT_W, 100, { gap: 8, px: 20, py: 20, radius: 12 });
  impactBox.fills = [{ type: 'SOLID', color: C.gray50 }];
  const impactText = mkText('은퇴 후 30년,\n준비된 인출 전략이\n노후를 지켜줍니다.', 16, 'semibold', C.text900);
  impactText.textAlignHorizontal = 'CENTER';
  impactText.lineHeight = { value: 150, unit: 'PERCENT' };
  impactBox.appendChild(impactText);
  scroll.appendChild(impactBox);

  const sub = mkText('담당 FA가 맞춤 인출 전략으로\n곧 연락드릴게요.', 14, 'regular', C.text500);
  sub.textAlignHorizontal = 'CENTER';
  scroll.appendChild(sub);

  scroll.appendChild(buildHelperText('평균 1~2영업일 내 연락을 드려요.'));

  return root;
}

// ══════════════════════════════════════════════════════════════════════
// FLOWCHART BUILDER — #1114 인출설계 (2026-03-09 확정 플로우)
// ══════════════════════════════════════════════════════════════════════

const FC = {
  NW: 220, NH: 64,        // 노드 크기
  VG: 56,                 // 수직 간격
  COL: { L: 100, C: 400, R: 700 }, // 열 중심 x
  COLOR: {
    start:    { bg: { r:0.180, g:0.788, b:0.447 }, text: C.white },
    end:      { bg: { r:0.180, g:0.788, b:0.447 }, text: C.white },
    page:     { bg: C.primary500,                  text: C.white },
    action:   { bg: { r:0.486, g:0.416, b:0.961 }, text: C.white },
    decision: { bg: { r:0.961, g:0.741, b:0.051 }, text: C.text900 },
    terminal: { bg: { r:1.000, g:0.322, b:0.278 }, text: C.white },
  },
};

// 노드 정의: [label, type, col, row]
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

// 엣지 정의: [from, to, label, fromMagnet, toMagnet]
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

function fcNodePos(col, row) {
  const STEP = FC.NH + FC.VG;
  return {
    x: FC.COL[col] - FC.NW / 2,
    y: row * STEP,
  };
}

function fcMkNode(label, type) {
  const col = FC.COLOR[type] || FC.COLOR.page;
  const frame = figma.createFrame();

  // layoutMode 먼저 설정 → Figma가 sizeMode를 AUTO로 초기화함
  // → 그 다음 FIXED로 덮어쓰고 resize 호출해야 크기가 유지됨
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

function fcMkLabel(text, x, y) {
  const t = figma.createText();
  try { t.fontName = gf('bold'); } catch (_) {}
  t.characters = text;
  t.fontSize = 11;
  t.fills = [{ type: 'SOLID', color: { r: 0.15, g: 0.15, b: 0.15 } }];
  t.x = x;
  t.y = y;
  return t;
}

// createConnector는 FigJam 전용 — 디자인 파일에서는 vector로 엣지 그림
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

async function buildFlowchart() {
  const page = figma.currentPage;
  const STEP = FC.NH + FC.VG;
  const created = [];

  // 제목
  const title = figma.createText();
  try { title.fontName = gf('bold'); } catch (_) {}
  title.characters = '#1114 인출설계 설문 플로우  (2026-03-09 확정)';
  title.fontSize = 18;
  title.fills = [{ type: 'SOLID', color: { r: 0.01, g: 0.01, b: 0.01 } }];
  title.x = FC.COL.L - FC.NW / 2;
  title.y = -56;
  page.appendChild(title);
  created.push(title);

  // 노드
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

  // 엣지 + 레이블
  for (const [fromId, toId, edgeLabel, fromMagnet, toMagnet] of FC_EDGES) {
    const fn = nodeMap[fromId];
    const tn = nodeMap[toId];
    if (!fn || !tn) continue;

    fcDrawEdge(page, fn, tn, fromMagnet, toMagnet, created);

    if (edgeLabel) {
      const s = fcEdgePt(fn, fromMagnet);
      const e = fcEdgePt(tn, toMagnet);
      const lbl = fcMkLabel(edgeLabel, (s.x + e.x) / 2, (s.y + e.y) / 2 - 14);
      page.appendChild(lbl);
      created.push(lbl);
    }
  }

  figma.viewport.scrollAndZoomIntoView(created);
}
