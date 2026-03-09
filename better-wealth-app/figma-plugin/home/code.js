// BetterWealth App - Home Screen Generator Plugin
// 375 x 812pt | 디자인 시스템 컬러 토큰 적용

const W = 375;
const H = 812;
const TOP_H    = 88;   // StatusBar(44) + TopNav(44)
const BOTTOM_H = 84;   // BottomNav
const SCROLL_H = H - TOP_H - BOTTOM_H; // 640pt — 스크롤 영역

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
  stockDom:   { r: 0.180, g: 0.608, b: 1.000 },
  stockOvs:   { r: 0.180, g: 0.345, b: 1.000 },
  bondDom:    { r: 0.227, g: 0.820, b: 0.663 },
  bondOvs:    { r: 0.455, g: 0.643, b: 0.918 },
  cash:       { r: 1.000, g: 0.784, b: 0.137 },
};

figma.showUI(__html__, { width: 300, height: 340 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-home-screen') {
    try {
      await createHomeScreen(msg.options || {});
      figma.ui.postMessage({ type: 'done', text: '홈 화면 생성 완료!' });
      figma.closePlugin('BetterWealth 홈 화면 완료');
    } catch (e) {
      figma.ui.postMessage({ type: 'done', text: '오류: ' + e.message });
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

// ── Primitives ───────────────────────────────────────────────────────
function solid(color, opacity) {
  const f = { type: 'SOLID', color };
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

// 고정 크기 auto-layout frame (FILL 사용 안 함 — 부모에 append 후 호출자가 설정)
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
  f.fills = opts.bg ? solid(opts.bg) : [];
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
  f.fills = opts.bg ? solid(opts.bg) : [];
  if (opts.radius) f.cornerRadius = opts.radius;
  if (opts.clip) f.clipsContent = true;
  f.resize(w, h);
  return f;
}

// ── Section Builders ─────────────────────────────────────────────────

function buildStatusBar() {
  const f = hf('Status Bar', W, 44, { bg: C.white, justify: 'CENTER', align: 'CENTER' });
  const t = mkText('9:41', 15, 'semibold', C.text900);
  t.textAlignHorizontal = 'CENTER';
  f.appendChild(t);
  return f;
}

function buildTopNav() {
  const f = hf('Top Navigation Bar', W, 44, {
    bg: C.white, align: 'CENTER', justify: 'SPACE_BETWEEN', pl: 20, pr: 16,
  });
  f.primaryAxisAlignItems = 'SPACE_BETWEEN';

  const logo = mkText('BetterWealth', 18, 'bold', C.primary500);
  f.appendChild(logo);
  logo.layoutSizingHorizontal = 'FILL'; // append 후 설정

  const right = hf('Right Icons', 80, 44, { align: 'CENTER', justify: 'MAX', gap: 4 });
  right.fills = [];
  right.primaryAxisAlignItems = 'MAX';

  const bellWrap = hf('Bell', 36, 36, { align: 'CENTER', justify: 'CENTER' });
  bellWrap.fills = [];
  bellWrap.appendChild(mkEllipse(24, 24, C.gray100));
  const dot = mkEllipse(7, 7, C.red);
  dot.x = 22; dot.y = 6;
  bellWrap.appendChild(dot);
  right.appendChild(bellWrap);

  const settingWrap = hf('Setting', 36, 36, { align: 'CENTER', justify: 'CENTER' });
  settingWrap.fills = [];
  settingWrap.appendChild(mkEllipse(24, 24, C.gray100));
  right.appendChild(settingWrap);
  f.appendChild(right);
  return f;
}

function buildGreeting(name) {
  const f = vf('Greeting', W, 64, { gap: 6, pl: 20, pr: 20, pt: 12, pb: 8 });
  f.appendChild(mkText('안녕하세요, ' + name + ' FA님', 20, 'bold', C.text900));
  f.appendChild(mkText('오늘의 자산 현황을 확인하세요', 14, 'regular', C.text500));
  return f;
}

function buildAssetCard() {
  // wrapper: 좌우 패딩만 담당, 높이는 카드(160) + 상하여백(20+12)
  const wrapper = vf('Asset Card Wrapper', W, 192, { pl: 20, pr: 20, pt: 16, pb: 16 });
  wrapper.fills = [];

  const card = hf('Asset Summary Card', W - 40, 160, {
    bg: C.primary500, radius: 16, p: 20, gap: 12, align: 'CENTER', clip: true,
  });

  // Left col
  const LEFT_W = W - 40 - 48 - 20 - 12; // wrapper내 card 너비 - 오른쪽pie - 패딩 - gap
  const left = vf('Left Col', LEFT_W, 120, { gap: 8 });
  left.fills = [];

  left.appendChild(mkText('총 관리 자산', 12, 'medium', C.white, 0.75));
  left.appendChild(mkText('₩ 1,245,000,000,000', 20, 'bold', C.white));

  const divLine = mkRect(LEFT_W, 1, C.white);
  divLine.opacity = 0.2;
  left.appendChild(divLine);

  const retRow = hf('Return Row', LEFT_W, 22, { gap: 8, align: 'CENTER' });
  retRow.fills = [];
  const badge = hf('Badge', 58, 20, { radius: 4, px: 6, align: 'CENTER', justify: 'CENTER' });
  badge.fills = solid(C.green300, 0.2);
  badge.appendChild(mkText('+2.34%', 11, 'semibold', C.green300));
  retRow.appendChild(badge);
  retRow.appendChild(mkText('+₩ 28,990,000', 11, 'regular', C.white, 0.8));
  left.appendChild(retRow);
  card.appendChild(left);

  // Pie chart
  const pie = vf('Pie Chart', 64, 64, { align: 'CENTER', justify: 'CENTER' });
  pie.fills = [];
  const slices = [
    { color: C.stockDom, s: 64 },
    { color: C.stockOvs, s: 52 },
    { color: C.bondDom,  s: 40 },
    { color: C.bondOvs,  s: 28 },
    { color: C.cash,     s: 16 },
  ];
  for (const sl of slices) {
    const e = mkEllipse(sl.s, sl.s, sl.color);
    e.x = (64 - sl.s) / 2;
    e.y = (64 - sl.s) / 2;
    pie.appendChild(e);
  }
  const hole = mkEllipse(16, 16, C.primary500);
  hole.x = 24; hole.y = 24;
  pie.appendChild(hole);
  card.appendChild(pie);

  wrapper.appendChild(card);
  return wrapper;
}

function buildQuickMenu() {
  // pt(16) + header(24) + gap(12) + row(80) + gap(12) + row(80) + pb(8) = 232pt
  const TILE_H = 80;
  const section = vf('Quick Menu Section', W, 232, { gap: 12, pl: 20, pr: 20, pt: 16, pb: 8 });
  section.fills = [];

  const header = hf('Menu Header', W - 40, 24, { align: 'CENTER', justify: 'SPACE_BETWEEN' });
  header.fills = [];
  header.primaryAxisAlignItems = 'SPACE_BETWEEN';
  const title = mkText('바로가기', 15, 'semibold', C.text900);
  header.appendChild(title);
  title.layoutSizingHorizontal = 'FILL';
  section.appendChild(header);

  const tileW = Math.floor((W - 40 - 12) / 2); // (335 - 12) / 2 = 161

  const menus = [
    { label: '은퇴설계',   sub: '캐시플로우 · 연금', dot: C.primary500 },
    { label: '투자설계',   sub: '포트폴리오 · 진단',  dot: C.secondary  },
    { label: '블루프린트', sub: '자산 · 목표 현황',   dot: C.green300   },
    { label: '리포트',     sub: '맞춤 · 심층 PDF',   dot: C.red        },
  ];

  for (let r = 0; r < 2; r++) {
    const row = hf('Menu Row ' + (r + 1), W - 40, TILE_H, { gap: 12, align: 'MIN' });
    row.fills = [];

    for (let c = 0; c < 2; c++) {
      const d = menus[r * 2 + c];
      const tile = vf('Tile-' + d.label, tileW, TILE_H, {
        bg: C.white, radius: 12, pt: 14, pb: 14, pl: 14, pr: 14, gap: 6,
      });
      const iconBg = hf('Icon BG', 32, 32, { radius: 8, align: 'CENTER', justify: 'CENTER' });
      iconBg.fills = solid(d.dot, 0.12);
      const iconDot = mkEllipse(12, 12, d.dot);
      iconDot.x = 10; iconDot.y = 10;
      iconBg.appendChild(iconDot);
      tile.appendChild(iconBg);
      tile.appendChild(mkText(d.label, 13, 'semibold', C.text800));
      tile.appendChild(mkText(d.sub, 10, 'regular', C.text500));
      row.appendChild(tile);
    }
    section.appendChild(row);
  }
  return section;
}

function buildDivider() {
  const d = mkRect(W, 8, C.gray50);
  d.name = 'Section Divider';
  return d;
}

function buildActivitySection(availableH) {
  // 남은 높이에 맞춰 동적으로 크기 결정
  const h = availableH || 160;
  const section = vf('Recent Activity', W, h, { pl: 20, pr: 20, pt: 16, pb: 0, gap: 0, clip: true });
  section.fills = [];

  const header = hf('Activity Header', W - 40, 32, {
    align: 'CENTER', justify: 'SPACE_BETWEEN', pb: 8,
  });
  header.fills = [];
  header.primaryAxisAlignItems = 'SPACE_BETWEEN';
  const ht = mkText('최근 활동', 15, 'semibold', C.text900);
  header.appendChild(ht);
  ht.layoutSizingHorizontal = 'FILL';
  header.appendChild(mkText('전체보기 >', 12, 'regular', C.primary500));
  section.appendChild(header);

  const items = [
    { name: '김민준 고객', action: '포트폴리오 리밸런싱 완료', time: '2시간 전',  dotColor: C.primary500 },
    { name: '이서연 고객', action: '새 상담 요청',             time: '5시간 전',  dotColor: C.secondary  },
    { name: '리포트 발송', action: '맞춤 리포트 3건 완료',     time: '어제',       dotColor: C.gray200    },
  ];

  for (let i = 0; i < items.length; i++) {
    const d = items[i];
    const row = hf('Activity-' + (i + 1), W - 40, 52, { align: 'CENTER', gap: 12, pt: 8, pb: 8 });
    row.fills = [];
    row.appendChild(mkEllipse(34, 34, d.dotColor));

    const col = vf('TextCol', W - 40 - 34 - 12 - 56 - 12, 34, { gap: 3 });
    col.fills = [];
    col.appendChild(mkText(d.name, 13, 'semibold', C.text800));
    col.appendChild(mkText(d.action, 12, 'regular', C.text500));
    row.appendChild(col);
    col.layoutSizingHorizontal = 'FILL'; // append 후 설정

    row.appendChild(mkText(d.time, 11, 'regular', C.text300));
    section.appendChild(row);

    if (i < items.length - 1) {
      section.appendChild(mkRect(W - 40, 1, C.gray100));
    }
  }
  return section;
}

function buildBottomNav() {
  const f = hf('Bottom Navigation Bar', W, BOTTOM_H, {
    bg: C.white, pt: 8, pb: 28, px: 0, justify: 'SPACE_BETWEEN',
  });
  f.primaryAxisAlignItems = 'SPACE_BETWEEN';

  // 상단 구분선 — absolute 배치 (auto-layout 흐름 제외)
  const border = mkRect(W, 1, C.gray100);
  f.appendChild(border);
  border.layoutPositioning = 'ABSOLUTE';
  border.x = 0; border.y = 0;

  const tabs = ['홈', '고객', '플랜', '리포트', '더보기'];
  const tabW = Math.floor(W / tabs.length);

  for (let i = 0; i < tabs.length; i++) {
    const isActive = i === 0;
    const col = vf('Tab-' + tabs[i], tabW, 48, { gap: 2, py: 6, px: 4, align: 'CENTER', justify: 'CENTER' });
    col.fills = [];
    col.counterAxisAlignItems = 'CENTER';
    col.appendChild(mkEllipse(22, 22, isActive ? C.primary500 : C.gray400));
    const lbl = mkText(tabs[i], 10, isActive ? 'semibold' : 'regular',
      isActive ? C.primary500 : C.gray400);
    lbl.textAlignHorizontal = 'CENTER';
    col.appendChild(lbl);
    f.appendChild(col);
  }
  return f;
}

// ── Main ─────────────────────────────────────────────────────────────
async function createHomeScreen(options) {
  await loadFonts();

  // ── 루트: VERTICAL auto-layout (W x H 고정)
  const root = figma.createFrame();
  root.name = 'BetterWealth App / Home (v1)';
  root.resize(W, H);
  root.layoutMode = 'VERTICAL';
  root.primaryAxisSizingMode = 'FIXED';
  root.counterAxisSizingMode = 'FIXED';
  root.itemSpacing = 0;
  root.fills = solid(C.gray50);
  root.clipsContent = true;

  // append 후 FILL/FIXED 설정 헬퍼
  function addFixed(child, h) {
    root.appendChild(child);
    child.layoutSizingHorizontal = 'FILL';
    child.layoutSizingVertical   = 'FIXED';
    child.resize(W, h);
  }
  function addFill(child) {
    root.appendChild(child);
    child.layoutSizingHorizontal = 'FILL';
    child.layoutSizingVertical   = 'FILL';
  }

  // 1. Status Bar
  addFixed(buildStatusBar(), 44);

  // 2. Top Nav
  if (options.topNav !== false) addFixed(buildTopNav(), 44);

  // 3. Scroll Content (FILL — bottom nav 위까지 자동으로 채워짐)
  const scrollContent = vf('Scroll Content', W, SCROLL_H, {
    bg: C.gray50, gap: 0, clip: true,
  });
  scrollContent.primaryAxisSizingMode = 'FIXED';

  let contentY = 0;
  function placeInScroll(node, h) {
    node.x = 0;
    node.y = contentY;
    scrollContent.appendChild(node);
    contentY += h;
  }

  if (options.greeting  !== false) placeInScroll(buildGreeting('김철수'), 64);
  if (options.asset     !== false) placeInScroll(buildAssetCard(), 192);
  if (options.quickMenu !== false) placeInScroll(buildQuickMenu(), 232);
  if (options.divider   !== false) placeInScroll(buildDivider(), 8);

  // Activity: 남은 공간만큼만
  if (options.activity !== false) {
    const remainH = SCROLL_H - contentY;
    if (remainH > 60) {
      placeInScroll(buildActivitySection(remainH), remainH);
    }
  }

  addFill(scrollContent);   // FILL로 Bottom Nav 바로 위까지 채움

  // 4. Bottom Nav — 루트 auto-layout 마지막 자식, 항상 하단
  if (options.bottomNav !== false) addFixed(buildBottomNav(), BOTTOM_H);

  figma.currentPage.appendChild(root);
  figma.viewport.scrollAndZoomIntoView([root]);
}
