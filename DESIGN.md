---
# ── REIMAGINE PARENTING — DESIGN SYSTEM ─────────────────────────────────────
# Token values are the canonical source of truth.
# Prose sections explain semantic intent and usage rules.
# Both layers are required reading before touching any UI.

meta:
  brand: Reimagine Parenting
  author: Marissa Schattner
  version: 1.1.0

colors:
  # ── Primary (action / authority)
  navy:        "#5F728D"   # Muted Blue — primary CTA background, nav accent, sidebar active
  navy-2:      "#54647C"   # Muted Blue hover / pressed state
  navy-soft:   "#6B7E9C"   # secondary nav elements, decorative
  navy-tint:   "#C8D1DF"   # badge backgrounds on dark surfaces, decorative separators
  char:        "#2C2A28"   # dashboard sidebar, icon-circle bg

  # ── Backgrounds (clean neutral scale)
  white:       "#FFFFFF"   # alternating section background
  parchment:   "#FDF8F0"
  linen:       "#FFFFFF"   # section-alt background, card surface — now pure white
  cream:       "#F7F7F5"   # Soft White — primary page background
  bone:        "#F2EBDA"   # hover tint
  sand:        "#E8DED0"
  hairline:    "#D9CFB9"   # all 1px borders and dividers

  # ── Text (ink scale)
  ds-text:     "#1F1D1A"   # primary headings and high-emphasis body
  ds-text-2:   "#3A372F"   # secondary body copy, subheadings
  ds-dim:      "#6E6A60"   # captions, italicised metadata, placeholders

  # ── Brand accents (updated 2025)
  sage:        "#9BB39B"   # Sage Green — step-1 circle, "HOW IT WORKS" pill, outcome circles
  sage-light:  "#9BB39B"   # Sage Green (alias merged — same value as sage)
  peach:       "#E98773"   # Coral Clay — step-2 circle, "PARENT STORIES" pill, "HI I'M MARISSA" pill
  straw:       "#EFB63F"   # Sunshine Yellow — step-3 circle, outcome-3 icon

  # ── Extended warmth palette
  amber:       "#D97B2E"   # bold accent; use sparingly for emphasis
  marigold:    "#F0A84A"   # warm highlight; pair with ds-text
  straw-warm:  "#FAE6C0"   # very light straw tint for background washes
  
  # ── Blue accent palette (water / calm)
  slate:       "#1B4A6B"
  river:       "#2E6FA3"
  sky:         "#6AAFD6"
  haze:        "#D0E8F4"
  frost:       "#EEF6FB"

  # ── Earth palette
  bark:        "#2A2217"
  soil:        "#5C4A32"
  clay:        "#A08060"

  # ── Semantic / functional
  destructive: "hsl(0 84% 60%)"
  destructive-foreground: "#FAFAFA"

typography:
  families:
    display: "Cormorant Garamond, Georgia, serif"    # var(--font-cormorant)
    body:    "Source Serif 4, Georgia, serif"         # var(--font-serif-4)
    ui:      "Inter, system-ui, sans-serif"           # var(--font-inter)

  levels:
    h1:
      fontFamily:   display
      fontWeight:   700
      fontSize:     "clamp(2.6rem, 6vw, 4.4rem)"
      lineHeight:   1.05
      letterSpacing: "-0.02em"
      color:        ds-text
    h2:
      fontFamily:   display
      fontWeight:   700
      fontSize:     "clamp(2.2rem, 5vw, 3.4rem)"     # hero/CTA variant
      lineHeight:   1.05
      letterSpacing: "-0.015em"
      color:        ds-text
    h2-section:
      fontFamily:   display
      fontWeight:   700
      fontSize:     "clamp(2rem, 4vw, 3rem)"          # SecHead pattern
      lineHeight:   1.05
      letterSpacing: "-0.015em"
      color:        ds-text
    h3:
      fontFamily:   display
      fontWeight:   700
      fontSize:     "1.65rem"                          # service column titles
      lineHeight:   1.1
      color:        ds-text
    h3-card:
      fontFamily:   display
      fontWeight:   700
      fontSize:     "1.5rem"                           # step cards
      lineHeight:   1.1
      color:        ds-text
    body-lg:
      fontFamily:   body
      fontWeight:   500
      fontSize:     "1.15rem"
      lineHeight:   1.5
      color:        ds-text-2
    body:
      fontFamily:   body
      fontWeight:   400
      fontSize:     "1.05rem"
      lineHeight:   1.6
      color:        ds-text-2
    body-sm:
      fontFamily:   body
      fontWeight:   400
      fontSize:     "0.98rem"
      lineHeight:   1.6
      color:        ds-text-2
    body-xs:
      fontFamily:   body
      fontWeight:   400
      fontSize:     "0.94rem"
      lineHeight:   1.4
      color:        ds-text
    body-italic:
      fontFamily:   body
      fontWeight:   400
      fontStyle:    italic
      fontSize:     "1.05rem"
      lineHeight:   1.65
      color:        ds-text-2
    label:
      fontFamily:   ui
      fontWeight:   600
      fontSize:     "0.72rem"
      lineHeight:   1
      letterSpacing: ".18em"
      textTransform: uppercase
    label-sm:
      fontFamily:   ui
      fontWeight:   600
      fontSize:     "0.7rem"
      lineHeight:   1
      letterSpacing: ".12em"
      textTransform: uppercase
      color:        ds-dim
    nav-link:
      fontFamily:   ui
      fontWeight:   500
      fontSize:     "0.92rem"
      letterSpacing: "0.02em"
      color:        ds-text-2
    caption:
      fontFamily:   ui
      fontWeight:   600
      fontSize:     "0.78rem"
      letterSpacing: ".22em"
      textTransform: uppercase
      color:        ds-dim

layout:
  maxWidth:
    container:  "1400px"   # outer clamp (container screens.2xl)
    content:    "72rem"    # max-w-6xl — nav, hero, sections
    prose:      "680px"    # section heading + about copy block
    card-grid:  "80rem"    # max-w-5xl — service columns, outcome grid
    testimonial: "56rem"   # max-w-4xl — testimonial grid
  
  horizontalPadding:
    base: "1.5rem"         # px-6 mobile
    sm:   "2.5rem"         # sm:px-10
    lg:   "4rem"           # lg:px-16

  sectionPadding:
    base: "5rem"           # py-20
    sm:   "6rem"           # sm:py-24
    lg:   "7rem"           # lg:py-28

  spacing:
    xs:   "8px"
    sm:   "12px"
    md:   "20px"
    lg:   "32px"
    xl:   "56px"
    "2xl": "80px"

  grid:
    cols-3: "grid-cols-1 sm:grid-cols-3"    # How It Works, Services
    cols-4: "grid-cols-2 sm:grid-cols-4"    # Outcomes
    cols-2: "grid-cols-1 sm:grid-cols-2"    # Testimonials
    gap-default: "gap-10"
    gap-card:    "gap-6"

elevation:
  surface-0: "none"                              # flat bg sections (cream/linen)
  surface-1: "0 1px 3px rgba(0,0,0,0.06)"       # shadow-sm — scrolled nav, cards
  surface-2: "0 4px 12px rgba(0,0,0,0.10)"      # elevated modals, dropdowns
  dark-scrim: "rgba(0,0,0,0.50)"                # mobile drawer backdrop

shapes:
  rounded:
    pill:   "9999px"   # CTAs, pill badges, step circles, icon circles, tags
    card:   "20px"     # testimonial cards, credential callout boxes
    card-lg: "22px"    # larger card variant
    lg:     "8px"      # sidebar nav items, shadcn --radius
    md:     "6px"      # calc(--radius - 2px)
    sm:     "4px"      # calc(--radius - 4px) — role badge, small tags
    none:   "0"        # sharp edges; only for full-bleed layout seams

components:
  # ── Public CTAs ──────────────────────────────────────────────────────────
  button-primary:
    backgroundColor: navy
    textColor:       linen
    fontFamily:      ui
    fontWeight:      600
    fontSize:        "0.84rem"
    letterSpacing:   ".16em"
    textTransform:   uppercase
    rounded:         pill
    paddingX:        "32px"
    paddingY:        "15px"
    display:         "inline-flex"
    alignItems:      center
    gap:             "12px"
    hover:
      opacity: 0.88
    active:
      opacity: 0.80

  button-primary-sm:
    extends:         button-primary
    fontSize:        "0.72rem"
    letterSpacing:   ".14em"
    paddingX:        "22px"
    paddingY:        "10px"

  button-ghost-navy:
    backgroundColor: transparent
    textColor:       navy
    fontFamily:      ui
    fontWeight:      600
    fontSize:        "0.72rem"
    letterSpacing:   ".16em"
    textTransform:   uppercase
    textDecoration:  none
    hover:
      textDecoration: underline

  # ── Nav ──────────────────────────────────────────────────────────────────
  public-nav:
    height:          "64px"
    backgroundColor: cream
    borderBottom:    "1px solid hairline"
    position:        sticky
    zIndex:          50
    scrolledShadow:  surface-1

  nav-link:
    fontFamily:      ui
    fontWeight:      500
    fontSize:        "0.92rem"
    letterSpacing:   "0.02em"
    textColor:       ds-text-2
    active:
      textColor:     ds-text
    transition:      "color 0.15s ease"

  # ── Pill badges ───────────────────────────────────────────────────────────
  pill:
    rounded:         pill
    paddingX:        "22px"
    paddingY:        "7px"
    fontFamily:      ui
    fontWeight:      600
    fontSize:        "0.72rem"
    letterSpacing:   ".18em"
    textTransform:   uppercase
    variants:
      navy:   { backgroundColor: navy,  textColor: linen }
      char:   { backgroundColor: char,  textColor: linen }
      sage:   { backgroundColor: sage,  textColor: linen }
      cream:  { backgroundColor: linen, textColor: ds-text }
      peach:  { backgroundColor: peach, textColor: ds-text }
      straw:  { backgroundColor: straw, textColor: ds-text }

  # ── Cards ─────────────────────────────────────────────────────────────────
  testimonial-card:
    backgroundColor: linen
    border:          "1px solid hairline"
    rounded:         card
    paddingX:        "32px"
    paddingY:        "32px"
    elevation:       surface-0

  credential-callout:
    backgroundColor: navy-tint
    rounded:         card-lg
    paddingX:        "20px"
    paddingY:        "18px"
    display:         flex
    gap:             "14px"
    alignItems:      center

  # ── Step circles ──────────────────────────────────────────────────────────
  step-circle:
    width:           "52px"
    height:          "52px"
    rounded:         pill
    display:         flex
    alignItems:      center
    justifyContent:  center
    fontFamily:      ui
    fontWeight:      700
    fontSize:        "1rem"
    variants:
      1: { backgroundColor: sage,  textColor: linen }
      2: { backgroundColor: peach, textColor: ds-text }
      3: { backgroundColor: straw, textColor: ds-text }

  icon-circle:
    width:           "80px"
    height:          "80px"
    rounded:         pill
    display:         flex
    alignItems:      center
    justifyContent:  center
    variants:
      sage-light: { backgroundColor: sage-light, iconColor: ds-text }
      peach:      { backgroundColor: peach,      iconColor: ds-text }
      straw:      { backgroundColor: straw,      iconColor: ds-text }
      sage:       { backgroundColor: sage,       iconColor: ds-text }

  icon-circle-sm:
    width:           "48px"
    height:          "48px"
    rounded:         pill
    variants:
      char: { backgroundColor: char, iconColor: linen }

  # ── Section heading pattern ────────────────────────────────────────────────
  section-heading:
    maxWidth:        "680px"
    marginBottom:    "56px"
    textAlign:       center
    layout:          "pill → h2-section → heart-rule → lede"

  heart-rule:
    display:         flex
    alignItems:      center
    gap:             "14px"
    lineWidth:       "80px"
    lineHeight:      "1px"
    heartSize:       "14px"
    variants:
      dark:  { color: ds-text }
      light: { color: linen }

  # ── Tagline ribbon ────────────────────────────────────────────────────────
  tagline-ribbon:
    backgroundColor: navy
    textColor:       linen
    paddingX:        "24px"
    paddingY:        "20px"
    textAlign:       center
    fontFamily:      ui
    fontWeight:      600
    fontSize:        "0.78rem"
    letterSpacing:   ".22em"
    textTransform:   uppercase
    separatorColor:  navy-tint

  # ── Dashboard sidebar ─────────────────────────────────────────────────────
  dashboard-sidebar:
    backgroundColor: char
    width:           "256px"   # w-64
    textColor:       linen
    brandAccent:     navy-tint

    nav-item:
      rounded:       lg
      paddingX:      "12px"
      paddingY:      "10px"
      fontFamily:    ui
      fontSize:      "0.875rem"
      gap:           "12px"
      default:
        textColor:   "rgba(250,245,234,0.65)"
        hover:       { textColor: linen, backgroundColor: "rgba(255,255,255,0.08)" }
      active:
        textColor:   linen
        fontWeight:  500
        backgroundColor: "rgba(74,95,127,0.50)"

    badge:
      width:         "20px"
      height:        "20px"
      rounded:       pill
      backgroundColor: navy-tint
      textColor:     char
      fontSize:      "10px"
      fontWeight:    700

    role-chip:
      rounded:       sm
      paddingX:      "8px"
      paddingY:      "2px"
      backgroundColor: "rgba(200,209,223,0.18)"
      textColor:     navy-tint
      fontSize:      "10px"
      fontWeight:    600
      textTransform: uppercase
      letterSpacing: "0.06em"

  # ── Service columns ───────────────────────────────────────────────────────
  service-column:
    textAlign:       center
    paddingX:        "32px"
    borderRight:     "1px solid hairline"  # all except last column

  # ── Public layout sections ─────────────────────────────────────────────────
  section-cream:
    backgroundColor: cream

  section-linen:
    backgroundColor: linen

  section-navy-cta:
    backgroundColor: navy
    textColor:       linen
    textAlign:       center
---

# Reimagine Parenting — Design System

## 1. Overview

**Brand personality:** Warm authority. Compassionate expertise. Calm confidence.

Reimagine Parenting is Marissa's parent-coaching practice serving neurodiverse families (ages 3–12). The brand must feel simultaneously *professional* and *approachable* — a trusted guide, not a clinical institution. Parents arrive anxious; the design must lower their heart rate, not raise it.

**Aesthetic direction:** Editorial warmth. The palette draws from natural materials — cream paper, linen cloth, dried sage, soft wood — giving the site a tactile, hand-crafted quality that reads premium without being cold. Serif typography carries the editorial voice. Inter handles functional UI without intruding on the warmth.

**Emotional target:** By the time a parent has scrolled the homepage, they should feel: *"This person understands me. I can trust her. I know what to do next."*

**Three surface contexts:**
- **Public** (`/(public)`) — editorial, warm, conversion-focused. Cream/linen bg alternation. Cormorant Garamond leads.
- **Portal** (`/(portal)`) — gentle, supportive, parent-facing. Same warm palette, slightly more structured.
- **Dashboard** (`/(dashboard)`) — utilitarian, dark sidebar, coach-facing. Char sidebar against warm main content area.

---

## 2. Colors

### Semantic roles

**Navy** (`#5F728D`) is the **primary action color**. Use it for the one most-important CTA per screen, the navigation accent, and the dashboard sidebar active state. Never use it for decorative blocks or backgrounds at scale — that dilutes its authority signal.

**Char** (`#2C2A28`) is the **dark surface** color — exclusively the dashboard sidebar and dark pill badges. It is warm-black, not neutral-black; it reads as intentional, not harsh.

**Cream** (`#F7F7F5`) and **Linen** (`#FFFFFF`) are the **background surfaces**. They alternate section by section on the public site to create rhythm without visual clutter. Cream is the base; Linen is the alt. Never use both on the same section.

**Sage** (`#9BB39B`), **Peach** (`#E98773`), and **Straw** (`#EFB63F`) are **brand accents**. They appear in step circles, section pill badges, outcome icon circles, and quote icons. They add playfulness and warmth without competing with navy for action priority. Never use them as button backgrounds for primary CTAs.

**Hairline** (`#D9CFB9`) is the **only border color**. All 1px dividers, card outlines, and column separators use this value. Do not use any other color for borders.

**Text scale**: `ds-text` (#1F1D1A) for headings and highest-emphasis copy; `ds-text-2` (#3A372F) for body and supporting copy; `ds-dim` (#6E6A60) for captions, italicized metadata, and helper text.

### Contrast requirements (WCAG AA minimum)
- Navy on Linen: verified ≥ 4.5:1
- Char on Linen: verified ≥ 4.5:1
- ds-text on Cream: verified ≥ 4.5:1
- Linen text on Navy background: verified ≥ 4.5:1
- ds-dim on Cream: verify before using for anything other than decorative/non-essential text

---

## 3. Typography

### Font families
- **Display** (`Cormorant Garamond`, `var(--font-cormorant)`) — all headings h1 through h3. Loaded via Next.js `next/font/google` at weights 400/500/600/700, normal and italic.
- **Body** (`Source Serif 4`, `var(--font-serif-4)`) — all paragraph copy, testimonials, body text. Weights 300/400/500/600.
- **UI** (`Inter`, `var(--font-ui)`) — buttons, nav links, labels, badges, sidebar, captions. All interface chrome. Loaded as `system-ui` fallback.

### Usage rules
Display headings carry the brand voice and emotional weight. Never use Inter for headings — not even for small section headings. Never use Cormorant for button labels or UI chrome.

Body copy uses Source Serif 4, not Inter. Source Serif 4 has editorial warmth; Inter reads clinical in long-form. Use Inter only where function demands it: buttons, nav, pills, UI labels.

**Letter spacing on uppercase labels** is non-negotiable. All uppercase UI labels carry explicit `letterSpacing` values (`.12em`–`.22em`). Without it, the tight caps feel amateurish. With it, they feel editorial.

**Fluid type** via `clamp()` is required for h1 and h2. Never fix heading sizes at a single breakpoint.

---

## 4. Layout & Spacing

### Grid model
The layout uses a 12-column implicit grid via CSS Flexbox and Tailwind's responsive grid utilities. No explicit 12-col class grid — sections control their own column count.

Responsive column progression:
- 1 col (mobile) → 2 col (testimonials) or 3 col (steps, services) or 4 col (outcomes) at `sm:` (640px)
- Gap between cards: `gap-10` (2.5rem) for large card grids, `gap-6` (1.5rem) for tighter card grids

### Max-widths
- All sections constrain content at `max-w-6xl` (72rem) with `mx-auto`
- Prose (about copy, section headings): `max-w-[680px]`
- Horizontal padding scales: `px-6 sm:px-10 lg:px-16`

### Spacing scale
All spacing traces to the scale in the YAML front matter. Never use arbitrary pixel values inline unless clamp() is required. The spacing scale (`xs` through `2xl`) covers all common use cases.

### Section vertical rhythm
Public sections alternate cream/linen backgrounds. Their vertical padding is always `py-20 sm:py-24` (standard) or `py-20 sm:py-24 lg:py-28` (hero-level). Never compress a section below `py-16` — the white space is intentional; it communicates confidence, not inefficiency.

---

## 5. Elevation & Depth

This design system uses **minimal elevation**. The warmth comes from color, not shadow depth. Shadows are functional signals, not decorative.

**surface-0** (no shadow): All page sections. Cards that sit flush against a contrasting bg.

**surface-1** (`shadow-sm`): The sticky nav header when the user has scrolled (signals "above the page"). Cards that need subtle lift against a same-hue background.

**surface-2**: Reserved for modals and dropdowns. Not used in current public pages.

**Dark scrim** (`rgba(0,0,0,0.50)`): Mobile drawer backdrop only.

**Never invent new shadow values.** If something needs more depth, reconsider whether it should be depth at all — try a border or a color contrast shift instead.

---

## 6. Shapes

### Border radius philosophy
The system uses **two dominant shapes**: pill (9999px) and card (20–22px). This duality is intentional and expressive:
- **Pill** signals softness, friendliness, and action. Every CTA, badge, tag, and circular element uses it.
- **Card** (20–22px) signals containment and warmth — a softer alternative to rectangular boxes.

**Never mix pill and sharp-corner elements** in the same component. A card with a pill badge is fine (two separate elements). A button that is pill on one side and square on another is not acceptable.

**Never apply hairline borders to pill buttons** — the shape itself defines the boundary.

The shadcn `--radius` token (0.5rem / 8px) governs internal UI elements (sidebar nav items, shadcn components). Do not override it for shadcn components.

---

## 7. Components

### button-primary
The primary CTA button. Navy background, linen text, full-pill shape, uppercase Inter label with tracking.

```
backgroundColor: #5F728D
textColor:       #FFFFFF
rounded:         9999px
paddingX:        32px
paddingY:        15px
fontFamily:      Inter
fontWeight:      600
fontSize:        0.84rem
letterSpacing:   .16em
textTransform:   uppercase
hover:           opacity 0.88
active:          opacity 0.80
```

**button-primary-sm**: Same as above but `paddingX: 22px`, `paddingY: 10–11px`, `fontSize: 0.72rem`, `letterSpacing: .14em`. Used in the nav header.

### pill
Inline badge/label element. Always uppercase Inter. Six variants (see YAML). The `cream` variant (linen bg, ds-text) is used on dark (navy) section backgrounds. The `char` variant signals "Hi, I'm Marissa" personal branding.

### section-heading (SecHead pattern)
```
pill badge (centered)
h2-section (centered, maxWidth 680)
heart-rule (centered)
[optional: lede paragraph]
marginBottom: 56px
```
The heart-rule is a branded divider: two 80px hairlines flanking a 14px filled heart SVG. Always appears below the section title, above the lede. Never omit it in a SecHead.

### testimonial-card
```
backgroundColor: #FFFFFF (linen)
border:          1px solid #D9CFB9
borderRadius:    20px
padding:         32px
```
Opens with a sage-light heart icon (20×20). Quote in `body-italic`. Byline in `label-sm` (ds-dim).

### service-column
Centered text. No card border. Columns separated by `1px solid hairline` vertical rules (right border on all except last). Never add background color to individual service columns — they read against the parent section's linen bg.

### dashboard-sidebar
Char (#2C2A28) background, 256px wide. The brand lockup inside uses `navy-tint` for "Reimagine" label and `linen` for "Parenting." Nav items are `rounded-lg` (8px), not pill — the pill shape is exclusive to public-facing elements.

Active nav item: `bg-[#5F728D]/50` (navy at 50% opacity) + linen text.
Inactive nav item: linen at 65% opacity, transitions to 100% on hover with `bg-white/8`.

---

## 8. Do's and Don'ts

### Do
- **Do** alternate section backgrounds strictly: cream → linen → cream → linen. Never repeat the same bg in adjacent sections.
- **Do** use `clamp()` for h1 and h2 font sizes. The design must be fluid, not breakpoint-stepped for headings.
- **Do** ensure every uppercase label has explicit `letterSpacing` applied. `.14em` minimum; `.18–.22em` for prominent labels.
- **Do** use the heart-rule in every SecHead. It is a brand signature, not optional decoration.
- **Do** trace every pixel value back to a named token. Inline hex values in component files are a code smell — they belong in CSS custom properties or Tailwind config aliases.
- **Do** use pill shape for all public-facing CTAs and badges. Reserve `rounded-lg` (8px) for dashboard/internal UI.
- **Do** use Source Serif 4 for all body copy on public and portal surfaces. It reads warmer than Inter at body sizes.
- **Do** keep navy as the single primary action signal per screen. If multiple CTAs exist, one is navy and the rest are ghost/text.

### Don't
- **Don't** use navy as a decorative background on large areas (except the tagline ribbon and final CTA section, which are intentional brand moments). Over-using navy dilutes its action signal.
- **Don't** use Cormorant Garamond for UI labels, buttons, nav links, or any interactive chrome. It is purely editorial/heading.
- **Don't** use Inter for body copy. Source Serif 4 is the body font. Inter is the UI font.
- **Don't** mix rounded corners and pill corners on the same element. Internally consistent components only.
- **Don't** invent shadow values. Use surface-0, surface-1, or surface-2 from the elevation scale.
- **Don't** use any color for 1px dividers or card borders except `hairline` (#D9CFB9).
- **Don't** use sage, peach, or straw as primary CTA backgrounds. They are accent colors for decorative circles and pill badges only.
- **Don't** reduce section vertical padding below `py-16`. The breathing room is intentional.
- **Don't** add `font-style: italic` to UI/Inter text. Italic is a body-serif affordance.
- **Don't** hardcode hex values in component files. Add them to `globals.css` as CSS custom properties and reference via `var()`.
- **Don't** use the blue accent palette (slate, river, sky, haze, frost) without explicit design rationale. It is reserved for future feature differentiation (e.g., a calming-focused module) and has not been used in the current design.
