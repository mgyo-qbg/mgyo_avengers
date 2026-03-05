// BetterWealth Design System — New Component Registration Plugin
// 대상 파일: wygEtCwUqQJ9p06qsDnBJF

const W_MOBILE = 375;

const C = {
  primary500: { r: 0.180, g: 0.608, b: 1.000 },
  secondary:  { r: 0.180, g: 0.345, b: 1.000 },
  green300:   { r: 0.227, g: 0.820, b: 0.663 },
  red:        { r: 1.000, g: 0.322, b: 0.278 },
  gray50:     { r: 0.976, g: 0.976, b: 0.976 },
  gray100:    { r: 0.949, g: 0.949, b: 0.949 },
  gray200:    { r: 0.878, g: 0.878, b: 0.878 },
  gray400:    { r: 0.631, g: 0.631, b: 0.631 },
  text500:    { r: 0.427, g: 0.427, b: 0.427 },
  text800:    { r: 0.149, g: 0.149, b: 0.149 },
  text900:    { r: 0.012, g: 0.012, b: 0.012 },
  white:      { r: 1.000, g: 1.000, b: 1.000 },
};

figma.showUI(__html__, { width: 300, height: 360 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'register') {
    try {
      await loadFonts();
      const created = [];
      if (msg.bottomNav) created.push(buildBottomNavSet());
      if (msg.assetCard)  created.push(buildAssetCardSet());
      if (msg.quickTile)  created.push(buildQuickMenuTileSet());

      // 가로로 배치
      let x = 100;
      for (const node of created) {
        node.x = x;
        node.y = 100;
        x += node.width + 80;
      }

      figma.viewport.scrollAndZoomIntoView(created);
      figma.ui.postMessage({ type: 'done', count: created.length });
    } catch (e) {
      figma.ui.postMessage({ type: 'error', msg: e.message });
      console.error(e);
    }
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// ── Fonts ────────────────────────────────────────────────────────────
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
function getFont(w) {
  const m = {
    regular:  { family:'Pretendard', style:'Regular'  },
    medium:   { family:'Pretendard', style:'Medium'   },
    semibold: { family:'Pretendard', style:'SemiBold' },
    bold:     { family:'Pretendard', style:'Bold'     },
  };
  return m[w] || m.regular;
}

// ── Primitives (모두 고정 크기 사용 — FILL 없음) ──────────────────────
function solid(color, opacity) {
  const f = { type:'SOLID', color };
  if (opacity !== undefined) f.opacity = opacity;
  return [f];
}
function mkText(chars, size, weight, color, opacity) {
  const t = figma.createText();
  try { t.fontName = getFont(weight); } catch (_) {}
  t.characters = chars;
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

// auto-layout frame — 고정 크기로만 생성
function hf(name, w, h, opts) {
  opts = opts || {};
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = 'HORIZONTAL';
  f.counterAxisAlignItems = opts.align  || 'CENTER';
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
function vf(name, w, h, opts) {
  opts = opts || {};
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = 'VERTICAL';
  f.counterAxisAlignItems = opts.align  || 'MIN';
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

function noteText(str) {
  const t = figma.createText();
  try { t.fontName = getFont('regular'); } catch (_) {}
  t.characters = str;
  t.fontSize = 11;
  t.fills = solid(C.gray400);
  return t;
}

// ══════════════════════════════════════════════════════════════════════
// 1. BOTTOM NAVIGATION BAR  (5 variants)
// ══════════════════════════════════════════════════════════════════════
function buildBottomNavSet() {
  const TAB_NAMES = ['홈', '고객', '플랜', '리포트', '더보기'];
  const tabW = Math.floor(W_MOBILE / TAB_NAMES.length);

  // 컨테이너
  const container = vf('━━ Bottom Navigation ━━', W_MOBILE * TAB_NAMES.length + 80 * (TAB_NAMES.length - 1) + 64, 280, {
    bg: C.gray50, radius: 12, p: 32, gap: 24,
  });

  const titleT = mkText('Bottom Navigation', 16, 'bold', C.text900);
  container.appendChild(titleT);
  container.appendChild(noteText('각 프레임 선택 → Create Component → Combine as variants'));

  const row = hf('Variants Row', (W_MOBILE + 40) * TAB_NAMES.length, 84, { gap: 40, align: 'MIN' });
  row.fills = [];

  TAB_NAMES.forEach((activeTab) => {
    const frame = hf('Active Tab=' + activeTab, W_MOBILE, 84, {
      bg: C.white, pt: 8, pb: 28, px: 0, justify: 'SPACE_BETWEEN',
    });
    frame.primaryAxisAlignItems = 'SPACE_BETWEEN';

    const border = mkRect(W_MOBILE, 1, C.gray100);
    border.x = 0; border.y = 0;
    frame.appendChild(border);

    TAB_NAMES.forEach((tab) => {
      const isActive = tab === activeTab;
      const col = vf('Tab/' + tab, tabW, 48, {
        gap: 2, py: 6, px: 0, align: 'CENTER', justify: 'CENTER',
      });
      col.fills = [];
      col.counterAxisAlignItems = 'CENTER';
      col.appendChild(mkEllipse(22, 22, isActive ? C.primary500 : C.gray400));
      const lbl = mkText(tab, 10, isActive ? 'semibold' : 'regular',
        isActive ? C.primary500 : C.gray400);
      lbl.textAlignHorizontal = 'CENTER';
      col.appendChild(lbl);
      frame.appendChild(col);
    });
    row.appendChild(frame);
  });

  container.appendChild(row);
  figma.currentPage.appendChild(container);
  return container;
}

// ══════════════════════════════════════════════════════════════════════
// 2. ASSET SUMMARY CARD  (3 variants)
// ══════════════════════════════════════════════════════════════════════
function buildAssetCardSet() {
  const CARD_W = 335;

  const container = vf('━━ Asset Card ━━', CARD_W * 3 + 40 * 2 + 64, 340, {
    bg: C.gray50, radius: 12, p: 32, gap: 24,
  });
  container.appendChild(mkText('Asset Card', 16, 'bold', C.text900));
  container.appendChild(noteText('각 프레임 선택 → Create Component → Combine as variants'));

  const row = hf('Variants Row', CARD_W * 3 + 40 * 2, 200, { gap: 40, align: 'MIN' });
  row.fills = [];

  // Default
  const def = vf('Type=Default', CARD_W, 180, { bg: C.primary500, radius: 16, p: 24, gap: 6, clip: true });
  def.appendChild(mkText('총 관리 자산', 12, 'medium', C.white, 0.75));
  def.appendChild(mkText('₩ 1,245,000,000,000', 20, 'bold', C.white));
  const div1 = mkRect(CARD_W - 48, 1, C.white); div1.opacity = 0.2;
  def.appendChild(div1);
  const retRow = hf('Return Row', CARD_W - 48, 24, { gap: 8, align: 'CENTER' });
  retRow.fills = [];
  const badge = hf('Badge', 60, 20, { radius: 4, px: 6, align: 'CENTER', justify: 'CENTER' });
  badge.fills = solid(C.green300, 0.2);
  badge.appendChild(mkText('+2.34%', 11, 'semibold', C.green300));
  retRow.appendChild(badge);
  retRow.appendChild(mkText('+₩ 28,990,000', 11, 'regular', C.white, 0.8));
  def.appendChild(retRow);
  row.appendChild(def);

  // Compact
  const compact = vf('Type=Compact', CARD_W, 120, { bg: C.primary500, radius: 16, p: 20, gap: 8 });
  compact.appendChild(mkText('총 관리 자산', 12, 'medium', C.white, 0.75));
  compact.appendChild(mkText('₩ 1,245,000,000,000', 18, 'bold', C.white));
  const retRow2 = hf('Return Row', CARD_W - 40, 24, { gap: 8, align: 'CENTER' });
  retRow2.fills = [];
  retRow2.appendChild(mkText('+2.34%', 12, 'semibold', C.green300));
  retRow2.appendChild(mkText('+₩ 28,990,000', 12, 'regular', C.white, 0.8));
  compact.appendChild(retRow2);
  row.appendChild(compact);

  // Skeleton
  const skeleton = vf('Type=Skeleton', CARD_W, 180, { bg: C.gray100, radius: 16, p: 24, gap: 14 });
  const sk = (w, h) => { const r = mkRect(w, h, C.gray200, 6); r.opacity = 0.7; return r; };
  skeleton.appendChild(sk(100, 12));
  skeleton.appendChild(sk(200, 22));
  skeleton.appendChild(sk(140, 12));
  row.appendChild(skeleton);

  container.appendChild(row);
  figma.currentPage.appendChild(container);
  return container;
}

// ══════════════════════════════════════════════════════════════════════
// 3. QUICK MENU TILE  (8 variants: 4 colors × 2 states)
// ══════════════════════════════════════════════════════════════════════
function buildQuickMenuTileSet() {
  const TILE_W = 160;
  const TILE_H = 96;
  const GAP = 16;

  const colors = [
    { name: 'Primary',   dot: C.primary500, label: '은퇴설계',   sub: '캐시플로우 · 연금' },
    { name: 'Green',     dot: C.green300,   label: '투자설계',   sub: '포트폴리오 · 진단' },
    { name: 'Secondary', dot: C.secondary,  label: '블루프린트', sub: '자산 · 목표 현황'  },
    { name: 'Red',       dot: C.red,        label: '리포트',     sub: '맞춤 · 심층 PDF'  },
  ];

  const totalW = (TILE_W * 2 + GAP) * colors.length + GAP * (colors.length - 1) + 64;
  const container = vf('━━ Quick Menu Tile ━━', totalW, 360, {
    bg: C.gray50, radius: 12, p: 32, gap: 24,
  });
  container.appendChild(mkText('Quick Menu Tile', 16, 'bold', C.text900));
  container.appendChild(noteText('각 프레임 선택 → Create Component → Combine as variants'));

  const grid = vf('Variants Grid', totalW - 64, (TILE_H + GAP) * colors.length, { gap: GAP });
  grid.fills = [];

  colors.forEach(({ name, dot, label, sub }) => {
    const row = hf('Color=' + name, (TILE_W * 2 + GAP), TILE_H, { gap: GAP, align: 'MIN' });
    row.fills = [];

    // Default
    const def = vf('Color=' + name + ', State=Default', TILE_W, TILE_H, {
      bg: C.white, radius: 12, p: 16, gap: 8,
    });
    const ibgD = hf('Icon BG', 36, 36, { radius: 10, align: 'CENTER', justify: 'CENTER' });
    ibgD.fills = solid(dot, 0.12);
    const dotD = mkEllipse(14, 14, dot); dotD.x = 11; dotD.y = 11;
    ibgD.appendChild(dotD);
    def.appendChild(ibgD);
    def.appendChild(mkText(label, 13, 'semibold', C.text800));
    def.appendChild(mkText(sub, 10, 'regular', C.text500));
    row.appendChild(def);

    // Pressed
    const pressed = vf('Color=' + name + ', State=Pressed', TILE_W, TILE_H, {
      bg: C.gray100, radius: 12, p: 16, gap: 8,
    });
    const ibgP = hf('Icon BG', 36, 36, { radius: 10, align: 'CENTER', justify: 'CENTER' });
    ibgP.fills = solid(dot, 0.22);
    const dotP = mkEllipse(14, 14, dot); dotP.x = 11; dotP.y = 11;
    ibgP.appendChild(dotP);
    pressed.appendChild(ibgP);
    pressed.appendChild(mkText(label, 13, 'semibold', C.text800));
    pressed.appendChild(mkText(sub, 10, 'regular', C.text500));
    row.appendChild(pressed);

    grid.appendChild(row);
  });

  container.appendChild(grid);
  figma.currentPage.appendChild(container);
  return container;
}
