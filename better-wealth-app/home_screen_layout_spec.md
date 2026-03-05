# BetterWealth App - Main Home Screen Layout Specification

## Overview

- Device: Mobile (375 x 812pt, iPhone)
- Grid: Mobile-2 col(default) (Style ID: 262:495)
- Font: Pretendard
- Background: White (#FFFFFF, Style: 53:2769)

---

## Screen Layout (Top to Bottom)

### 1. Status Bar (System)
- Height: 44pt
- System default (time, signal, battery)

---

### 2. Top Navigation Bar
- **Component**: `Navi bar` (Component Set ID: `179:531`)
- **Variant**: `Type=home navi bar` (Component ID: `247:73`)
- **Size**: W:375 x H:44
- **Left**: BetterWealth logo
- **Right**: bell icon (`Icons/basic-bell`, `1146:765`) + Badge(`Type=Dot, Size=Xs`, `1429:1528`), setting icon (`Icons/basic-setting`, `1146:768`)
- **Colors**: Background White, Icon color Text/Text 800 (`53:2778`)

---

### 3. User Greeting Section
- Position: Y:88, Padding: 20pt horizontal, Height: 64pt
- Line 1: "Hello, [FA Name]" - `Title/Large` (`13:604`), Text/Text 900 (`53:2779`)
- Line 2: "Today's asset summary" - `Body/Regular` (`13:666`), Text/Text 500 (`53:2775`)

---

### 4. Asset Summary Card
- **Base**: `img_card` (`642:676`) - extended
- **Size**: W:335 x H:180 (margin 20pt each side)
- **Background**: Primary/500 (#2E9BFF, `53:2753`)
- **Border Radius**: 16pt
- **Shadow**: `shadow-md` (`104:5`)

**Inner elements:**

| Element | Typography | Color |
|---------|-----------|-------|
| "Total managed assets" label | Subtitle/Small (`13:655`) | White alpha 70% |
| "12,450,000,000 KRW" | Heading/2 (`13:600`) | White (`53:2769`) |
| Return rate component | `236:65` variant `up&down=up, Size=Xs` (`236:63`) | Utility/Green 300 (`53:2782`) |
| "+2.34%" value | Body/Regular (`13:666`) | Utility/Green 300 |
| Return amount | Body/Small (`13:667`) | White alpha 80% |
| Mini pie chart | Custom | Asset/* color tokens |

**Asset Color Tokens for Pie Chart:**
- Stock Domestic: `53:2826`
- Stock Overseas: `53:2827`
- Bond Domestic: `53:2822`
- Bond Overseas: `53:2823`
- Cash: `53:2824`
- Etc: `53:2825`

---

### 5. Quick Menu Grid (2x2)
- Position: Below card, margin-top 24pt
- Grid: 2 columns, gap 12pt, padding 20pt horizontal
- Each tile: W:160 x H:96

| Menu | Icon (3d-icon Set: `238:210`) | Label Style |
|------|-------------------------------|-------------|
| Retirement Planning | chart variant | Subtitle/Regular (`13:654`) |
| Investment Planning | money variant | Subtitle/Regular (`13:654`) |
| Blueprint | clock variant | Subtitle/Regular (`13:654`) |
| Report | bell variant | Subtitle/Regular (`13:654`) |

- Tile background: Gray/50 (`53:2763`), radius 12pt, shadow-sm (`104:3`)
- Icon: 40x40pt centered top
- Label: Text/Text 800 (`53:2778`), centered bottom, gap 8pt
- Pressed: Gray/100 (`53:2759`)

---

### 6. Section Divider
- **Component**: `dividers` (`138:1189`)
- Height: 8pt, Color: Gray/50 (`53:2763`)
- Margin: top 24pt, bottom 16pt

---

### 7. Recent Activity Section
- **Header**: "Recent Activity" `Title/Small` (`13:607`), Text/Text 900 + "More" `Text button` (`132:660`, `Size=Sm, Variant=Assistive`, `797:269`)
- Padding: 20pt horizontal

**List Items (3-5 items):**
- **Component**: `Cell/List Item` (`805:742`)
- Variant: `Type=Active` (`805:740`) or `Type=Move Md` (`805:504`)
- Height: ~64pt each

| Item | Badge | Time |
|------|-------|------|
| Client A portfolio rebalancing complete | Badge `Type=New, Size=Xs` (`1429:1523`) | Body/Caption (`13:670`) |
| Client B new consultation request | Badge `Type=Dot, Size=Xs` (`1429:1528`) | Body/Caption |
| Report dispatch complete (3) | none | Body/Caption |

- Title: Text/Text 800, Description: Text/Text 500, Time: Text/Text 300 (`53:2772`)
- Divider between items: Gray/100, 1pt

---

### 8. Bottom Safe Area Spacer
- Height: 84pt (nav + safe area)

---

### 9. Bottom Navigation Bar
- **Note**: Not in design system. Needs new creation.
- Size: W:375 x H:56 + Safe Area 28pt = 84pt
- Background: White, Shadow: `shadow-lg` (`105:6`) top, Border-top: Gray/100 0.5pt

| Tab | Icon Set ID | Label | Active | Inactive |
|-----|------------|-------|--------|----------|
| Home | `Icons/basic-home` (`1146:753`) | Home | Primary/500 (`53:2753`) | Gray/400 (`53:2762`) |
| Clients | custom | Clients | Primary/500 | Gray/400 |
| Planning | custom | Planning | Primary/500 | Gray/400 |
| Report | `Icons/basic-copy1` (`1146:767`) | Report | Primary/500 | Gray/400 |
| More | `Icons/basic-hambuger` (`1146:763`) | More | Primary/500 | Gray/400 |

- Icon: 24x24pt, Label: Body/Tiny (`13:671`), Gap: 2pt
- Active: Primary/500, fontWeight 600
- Inactive: Gray/400

---

## Layout Wireframe (ASCII)

```
+-------------------------------------------+  0pt
|            Status Bar (44pt)              |
+-------------------------------------------+  44pt
| [Logo]              [Bell+Badge] [Setting]|  Navi bar (44pt)
+-------------------------------------------+  88pt
| Hello, Kim FA                             |
| Today's asset summary                     |  (64pt)
+-------------------------------------------+  152pt
| +---------------------------------------+ |
| | Total managed assets   [Mini PieChart]| |
| | 12,450,000,000 KRW                    | |
| | +2.34%  1,200,000 KRW                 | |  (180pt, Primary bg)
| +---------------------------------------+ |
+-------------------------------------------+  356pt
| +--------+  +--------+                    |
| | [icon] |  | [icon] |                    |
| |Retire  |  |Invest  |                    |  (96pt)
| +--------+  +--------+                    |
| +--------+  +--------+                    |
| | [icon] |  | [icon] |                    |
| |Blueprint| |Report  |                    |  (96pt)
| +--------+  +--------+                    |
+-------------------------------------------+  572pt
| ========= divider (8pt) ================ |
+-------------------------------------------+  596pt
| Recent Activity                  More >   |
|-------------------------------------------|
| [Badge] Client A rebalancing    2hrs ago  |
|-------------------------------------------|
| [Badge] Client B consultation   5hrs ago  |
|-------------------------------------------|
| Report dispatch (3)             yesterday |
+-------------------------------------------+
|           (scroll area)                   |
+-------------------------------------------+  728pt
| [Home] [Clients] [Plan] [Report] [More]  |  Bottom Nav (84pt)
+-------------------------------------------+  812pt
```

---

## Component Reference Summary

### Existing (from wygEtCwUqQJ9p06qsDnBJF)

| Component | Set ID | Used Variant |
|-----------|--------|-------------|
| Navi bar | 179:531 | Type=home navi bar (247:73) |
| Icons/basic-bell | 1146:765 | Notification |
| Icons/basic-setting | 1146:768 | Settings |
| Icons/basic-home | 1146:753 | Bottom nav |
| Icons/basic-hambuger | 1146:763 | Bottom nav |
| Badge | 1429:1529 | Dot/Xs, New/Xs |
| img_card | 642:676 | Asset card base |
| Return Rate | 236:65 | up/down, Size=Xs |
| 3d-icon | 238:210 | Quick menu |
| Cell/List Item | 805:742 | Active, Move Md |
| Text button | 132:660 | Sm, Assistive |
| dividers | 138:1189 | Section divider |

### New Components Needed

| Component | Priority |
|-----------|----------|
| Bottom Navigation Bar | HIGH |
| Asset Summary Card (extended) | HIGH |
| Quick Menu Tile | MEDIUM |

---

## Implementation Notes

1. Figma REST API is read-only. Frame/component creation requires Figma Plugin API or manual work.
2. Bottom Nav component is missing from design system. Create and register.
3. Asset Summary Card extends `img_card` significantly. Separate component recommended.
4. 3D icons (`238:210`) map to financial actions (chart=retirement, money=investment).
5. Return rate component (`236:65`) supports up/down/plus/minus in 3 sizes - use directly.
6. Only Top Navi bar has Storybook integration. New components should also be registered.
