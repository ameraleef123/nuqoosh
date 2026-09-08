# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Nuqush
**Generated:** 2026-09-08 13:43:46
**Category:** Luxury/Premium Brand
**Design Dials:** Motion 7/10 (Standard)

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#1C1917` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#44403C` | `--color-secondary` |
| On Secondary | `#FFFFFF` | `--color-on-secondary` |
| Accent/CTA | `#A16207` | `--color-accent` |
| On Accent/CTA | `#FFFFFF` | `--color-on-accent` |
| Background | `#FAFAF9` | `--color-background` |
| Foreground | `#0C0A09` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#0C0A09` | `--color-card-foreground` |
| Muted | `#E8ECF0` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border | `#D6D3D1` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#1C1917` | `--color-ring` |

**Color Notes:** Premium black + gold accent [Accent adjusted from #CA8A04]

### Typography

- **Heading Font:** Cormorant
- **Body Font:** Montserrat
- **Mood:** luxury, high-end, fashion, elegant, refined, premium
- **Google Fonts:** [Cormorant + Montserrat](https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #A16207;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #1C1917;
  border: 2px solid #1C1917;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FAFAF9;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #1C1917;
  outline: none;
  box-shadow: 0 0 0 3px #1C191720;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Liquid Glass

**Keywords:** dynamic material, optical glass, translucency, lensing, refraction, fluid morphing, system navigation

**Best For:** Apple-platform navigation, controls, and system-aligned app chrome

**Key Effects:** Lensing and refraction, adaptive translucency, and fluid morph transitions aligned to Apple platform behavior

### Page Pattern

**Pattern Name:** Scroll-Triggered Storytelling

- **Conversion Strategy:** Keep the narrative understandable without scroll-driven effects. Use progress indicator. Mobile: simplify animations. Keep DOM reading order complete; disable parallax and scroll-scrub under reduced motion. Pause scroll animation when offscreen or hidden and render each chapter in its final readable state under reduced motion.
- **CTA Placement:** End of each chapter (mini) + Final climax CTA
- **Section Order:** Intro hook > Chapter 1 (problem) > Chapter 2 (journey) > Chapter 3 (solution) > Climax CTA

---

## Motion

**Stagger List** (Standard) — Trigger: load or scroll | Duration: 300-450ms | Easing: `back.out(1.4)`

```js
gsap.from('.grid-item', { opacity: 0, scale: 0.92, y: 16, duration: 0.4, stagger: { each: 0.06, from: 'start', grid: 'auto' }, ease: 'back.out(1.4)' });
```

**Framework notes:** grid: 'auto' lets GSAP infer rows/columns from a CSS grid layout for a natural wave stagger; Use matchMedia('(prefers-reduced-motion: reduce)') to skip non-essential motion and render the final state immediately

- ✅ Combine with from: 'center' for a bento-grid layout to draw the eye inward first
- ❌ Don't use back.out on dense data tables; the overshoot reads as sloppy on informational UI
- ⚡ Group DOM writes; avoid interleaving layout reads (getBoundingClientRect) between staggered tweens

---

## Anti-Patterns (Do NOT Use)

- ❌ Cheap visuals
- ❌ Fast animations

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile


---
---

# PART 2 — Nuqush Reconciliation (authoritative)

> Part 1 above is the raw `--design-system` output (kept verbatim for provenance). The generator classified the brief as **Luxury/Premium Brand** and proposed Liquid Glass + Cormorant/Montserrat + black/gold. The brief overrides three things: the style spec is the skill's **Glassmorphism** entry (not Liquid Glass), the type system is **Arabic-first**, and the audience is a 19-year-old student, not a luxury shopper. Everything in Part 2 wins over Part 1. Spacing scale, shadow depths, anti-patterns, and the pre-delivery checklist from Part 1 remain in force.

## 2.1 Brand

- **Name:** نُقوش — "inscriptions". Visual anchor: ink on paper, Petra sandstone, Nabataean carving. Arabic-first at first glance.
- **Wordmark:** Amiri 700 (calligraphic, Naskh) rendered to SVG, light + dark variants, with the damma (ُ) on the ن as the single ornamental detail. Latin "Nuqush" is a small IBM Plex Sans label under it, never the primary mark.
- **Voice:** colloquial, warm, second person, no form-speak.

## 2.2 Palette (measured with `scripts/contrast.py`; every pair listed is ≥4.5:1)

### Light (default when system is light)

| Role | Hex | CSS variable | Measured |
|------|-----|--------------|----------|
| Background (paper) | `#FAF7F2` | `--color-background` | — |
| Foreground (ink) | `#1A1523` | `--color-foreground` | 16.72:1 on paper |
| Muted foreground | `#4A4458` | `--color-muted-foreground` | 8.70:1 on paper |
| Primary (ink) | `#1A1523` | `--color-primary` | on-primary `#FAF7F2` 16.72:1 |
| Accent / CTA (indigo) | `#4C3FD1` | `--color-accent` | white on it 7.15:1 · as text on paper 6.69:1 |
| Accent 2 (Petra rose) | `#B8452F` | `--color-accent-2` | white on it 5.34:1 · as text on paper 5.00:1 |
| Highlight (amber, course-project badge) | `#F5B942` | `--color-highlight` | ink on it 10.12:1 |
| Card (opaque fallback) | `#FFFFFF` | `--color-card` | — |
| Border | `rgba(26,21,35,0.10)` | `--color-border` | — |
| Ring | `#4C3FD1` | `--color-ring` | — |
| Destructive | `#DC2626` | `--color-destructive` | white on it (skill default) |

### Dark

| Role | Hex | CSS variable | Measured |
|------|-----|--------------|----------|
| Background (ink) | `#0F0D17` | `--color-background` | — |
| Foreground | `#F4F1FA` | `--color-foreground` | 17.25:1 |
| Muted foreground | `#C4BDD6` | `--color-muted-foreground` | 10.64:1 |
| Primary | `#F4F1FA` | `--color-primary` | on-primary `#0F0D17` |
| Accent / CTA (lavender) | `#A99CFF` | `--color-accent` | as text 8.15:1 · ink on it 7.56:1 |
| Accent 2 (coral) | `#FF8A7A` | `--color-accent-2` | as text 8.41:1 · ink on it 7.80:1 |
| Highlight (amber) | `#F5B942` | `--color-highlight` | as text 10.92:1 · ink on it 10.12:1 |
| Card (opaque fallback) | `#1E1838` | `--color-card` | — |
| Border | `rgba(255,255,255,0.12)` | `--color-border` | — |
| Ring | `#A99CFF` | `--color-ring` | — |

### Mesh / orb colours (what the glass refracts)

| Theme | Orbs | Rule |
|-------|------|------|
| Light | lavender `#C9B8FF` · blush `#F5A79E` · honey `#FFE7B8` · mint `#CFF3E6` | Pastel by design: ink text on `.glass` (α 0.30) over the most saturated orb measured **11.35:1** worst case. |
| Dark | indigo `#6D5DF6` · coral `#F0766A` · amber `#F5B942` · teal `#2DD4BF` | Saturated by design; therefore dark glass is **ink-tinted** (below). Orbs render at `opacity: .75` in dark mode so muted text stays ≥4.5:1 over hotspots. |

> **Implementation note (Phase 1).** In `app/globals.css` the raw tokens carry an `--nq-` prefix
> (`--nq-background`, `--nq-accent`, `--nq-radius-lg`…). Tailwind v4 reserves the `--color-*` and
> `--radius-*` namespaces for its own utility generation, so a raw `--color-background` would be
> self-referential and silently break `bg-background`. The `@theme inline` block bridges
> `--color-* → var(--nq-*)`, which keeps the utilities live across a theme switch. Role names and
> hex values in the table above are unchanged.

## 2.3 Glass tokens (skill Glassmorphism spec, tuned per theme)

```css
:root {                      /* light */
  --glass-bg:         rgba(255,255,255,0.30);   /* skill range 0.10–0.30; measured 11.35:1 worst */
  --glass-bg-subtle:  rgba(255,255,255,0.18);
  --glass-bg-strong:  rgba(255,255,255,0.50);
  --glass-border:     1px solid rgba(255,255,255,0.60);
  --glass-edge:       0 0 0 1px rgba(26,21,35,0.06);          /* definition against pale mesh */
  --glass-blur:       14px;  --glass-blur-subtle: 10px;  --glass-blur-strong: 20px;
  --glass-shadow:     0 8px 32px rgba(26,21,35,0.12);
  --glass-highlight:  inset 0 1px 0 rgba(255,255,255,0.55);
  --glass-fallback:   #FFFFFF;                                  /* @supports not */
}
:root[data-theme="dark"] {
  --glass-bg:         rgba(30,24,48,0.60);   /* ink tint: 5.18:1 worst (over amber), 8.79:1 over indigo */
  --glass-bg-subtle:  rgba(30,24,48,0.45);
  --glass-bg-strong:  rgba(30,24,48,0.72);
  --glass-border:     1px solid rgba(255,255,255,0.14);
  --glass-edge:       none;
  --glass-shadow:     0 8px 32px rgba(0,0,0,0.35);
  --glass-highlight:  inset 0 1px 0 rgba(255,255,255,0.12);
  --glass-fallback:   #1E1838;
}
.glass { background: var(--glass-bg); border: var(--glass-border);
  box-shadow: var(--glass-shadow), var(--glass-highlight), var(--glass-edge);
  -webkit-backdrop-filter: blur(var(--glass-blur)); backdrop-filter: blur(var(--glass-blur)); }
@supports not (backdrop-filter: blur(1px)) { .glass { background: var(--glass-fallback); } }
```

- Layer depth: mesh → orbs → glass → content. **Max 3 stacked glass layers.** Hover: `translateY(-2px)`, border alpha +0.15, blur +2px, 200ms — hover only, never on scroll.
- Rule when a template fails contrast: raise `--glass-bg` alpha (light) or the ink tint (dark). Never change the text colour.

## 2.4 Typography

| Role | Face | Loading | Notes |
|------|------|---------|-------|
| Display / headings (ar + en) | **Cairo** variable (wght 200–1000, slnt) | `next/font/google`, subsets `['arabic','latin']`, `font-display: swap`, one file | Rank 59. Its Latin is drawn to Cairo's Arabic metrics, so mixed-script headings share a baseline. Names at 700–800. |
| Body (ar + en) | **IBM Plex Sans Arabic** 400 / 500 / 700 | `next/font/google`, subsets `['arabic','latin']` | Rank 109. Its Latin **is** IBM Plex Sans (same family, same vertical metrics) — the strongest mixed-script pairing available. |
| Wordmark only | **Amiri** 700 | SVG, no webfont | Calligraphic Naskh. |
| Latin fallback stack | `Inter, system-ui, -apple-system, 'Segoe UI', sans-serif` | not loaded | From the skill's typography search (Classic Elegant body). Only reached if a webfont fails. |

- Per-template pairs rotate among the faces the brief listed (see `templates.md`): Cairo · Almarai · Tajawal · IBM Plex Sans Arabic · Noto Sans Arabic · Noto Kufi Arabic · Noto Naskh Arabic · Amiri · Readex Pro. Every one ships an Arabic + Latin subset (verified via `-d google-fonts`).
- Arabic line-height: body ≥ **1.75**, headings ≥ **1.3**. English: 1.6 / 1.2.
- Scale: display `clamp(2.25rem, 6vw, 3.5rem)` · h1 `clamp(1.75rem, 3vw, 2.5rem)` · h2 `1.5rem` · body `1.0625rem` · small `0.9375rem` · min `0.875rem`.
- Numerals: Arabic-Indic (٠١٢٣) in `ar`, Western in `en`, via `Intl.NumberFormat` with `numberingSystem`. Never `font-feature-settings` tricks, never regex on data.
- Never let a Latin fallback render Arabic: `unicode-range` is set by `next/font`; the `ar` font stack lists Arabic faces first.

## 2.5 Motion (GSAP, one library everywhere)

Library decision: **GSAP 3.13+** (`gsap`, `ScrollTrigger`, `Flip`, `SplitText` — all free since 3.13) with `@gsap/react` `useGSAP` for cleanup and `gsap.matchMedia` for reduced motion. Framer Motion rejected: the skill's motion database is GSAP-native (17 presets), Flip and SplitText have no equivalent, and the public page needs a leaf-only client bundle.

| # | Signature | Skill preset (source) | Duration · Easing | Animates | Reduced motion |
|---|-----------|------------------------|-------------------|----------|----------------|
| 1 | Hero entrance | Stagger List (Complex) — SplitText chars | name 600ms `expo.out`, stagger 0.015; card 500ms `expo.out` `y 16→0` | transform, opacity | final state, no split |
| 1b | Orb drift | Aurora UI style (8–12s loops) → slowed to 24–36s | CSS `@keyframes`, `ease-in-out`, `alternate` | transform only | `animation: none` |
| 2 | Scroll reveal | Scroll Reveal (Subtle) | 350ms `power1.out`, `y 12`, start `top 90%`, `toggleActions: 'play none none reverse'` | transform, opacity | visible immediately |
| 3 | Glass hover | Hover Micro-interaction (Subtle) | 200ms `power1.out`, `y −2` | transform; CSS border/blur | CSS hover kept (not motion) |
| 4 | Route / step transition | Page Transition (Complex) + asymmetric rule | exit 200ms · enter 400–600ms `expo.inOut`; wizard steps `x ±24` in reading direction (RTL: next enters from the left) | transform, opacity | instant swap |
| 5 | Template switch | Page Transition (Complex) — Flip | 600ms `expo.inOut` on `[data-flip-id="hero"]`, 300ms crossfade for the rest | transform, opacity | instant swap |
| 6 | Completion meter | **no DB match** (`"counter count up number" -d gsap`) — stated default | count-up 600ms `power2.out`; single 400ms pulse at 100% | opacity, transform, SVG `stroke-dashoffset` | jump to value |

Hard rules: `prefers-reduced-motion: reduce` → no tweens are created at all (fully static). Only `transform`/`opacity` on scroll. Loops pause on `visibilitychange` and when offscreen. Initial hidden states are applied by CSS only under `html.js` **and** `(prefers-reduced-motion: no-preference)`, so JS-off and reduced-motion both render everything visible.

## 2.6 Layout, RTL, icons

- `<html dir="rtl" lang="ar">` by default; the toggle flips both attributes. **CSS logical properties only** (`margin-inline-start`, `padding-inline`, `inset-inline-*`, `text-align: start`). Tailwind: `ms-/me-/ps-/pe-/start-/end-` utilities; `left/right` utilities are lint-banned in layout code.
- Icons: **Lucide** (the skill's icon DB is Phosphor-centric; the brief names Lucide, and Lucide ships `rtl:` flip guidance). Directional icons (`arrow-*`, `chevron-*`, `corner-*`, `undo`) get `rtl:-scale-x-100`. Icon sizes tokenised: 16 / 20 / 24. Stroke 1.75. No emoji anywhere in UI.
- Touch targets ≥ 44px; web minimum 24px only for inline links.
- Focus: `outline: 2px solid var(--color-ring); outline-offset: 2px` on every interactive element. `cursor: pointer` on everything clickable.

## 2.7 Nuqush additions to the pre-delivery checklist

- [ ] No-experience fixture renders with **no** empty section / heading / gap / nudge
- [ ] Phone absent from the DOM when empty
- [ ] Contrast measured (script), both themes, on glass over the most saturated orb
- [ ] `-webkit-backdrop-filter` + `@supports not` fallback present
- [ ] Reduced motion → fully static (checked with the OS toggle)
- [ ] Only transform/opacity in scroll-driven tweens
- [ ] RTL: directional icons mirrored, no `left/right` in layout code, numerals switch with language
- [ ] «التالي» never blocked; hints never red; refresh loses nothing
- [ ] Free tier badge present; paid tier: no badge, 28 templates, custom accent
- [ ] Report link on every public page; hidden page → neutral 410

## 2.8 Search log (skill queries behind Part 2)

| Query | Domain / stack | Used for |
|-------|----------------|----------|
| `Arabic-first personal portfolio site builder … glassmorphism …` | `--design-system --motion 7` | Part 1 (provenance) |
| `glassmorphism --full` | style | glass tokens, checklist |
| `aurora gradient mesh` | style | mesh/orb background system |
| `portfolio personal brand` | product | Motion-Driven + Minimal primary, Aurora secondary, Link-in-Bio builder shell |
| `elegant modern sans` | typography | Arabic Elegant pairing (Noto Naskh/Sans Arabic) for editorial templates; Inter as Latin fallback |
| `arabic -n 6`, plus `Cairo`, `Tajawal`, `Almarai`, `IBM Plex Sans Arabic`, `Amiri`, `Noto Sans Arabic`, `Readex Pro`, `Inter`, `Manrope`, `Plus Jakarta Sans`, `Figtree` | google-fonts | subset/axis/weight verification for every face in `templates.md` |
| `hero reveal stagger scroll -n 5`, `page transition`, `hover lift card`, `flip layout change`, `floating loop ambient background`, `counter count up number` | gsap | motion table (count-up: no match → default) |
| `form wizard multi-step progress`, `reduced motion accessibility`, `helper text hint inline validation`, `focus ring keyboard visible`, `touch target size spacing` | ux | wizard + a11y rules |
| `unsaved changes data loss`, `localization language switch translation`, `RTL right-to-left bidirectional` | ux | **no database match** (retried once each) — autosave, language toggle and RTL rules in this file are stated defaults from the brief, not skill rules |
| `app router server components streaming`, `image optimization font loading`, `static generation ISR revalidate`, `client component boundary bundle size`, `metadata SEO` | nextjs | stack rules (empty-string stack query returns 0; use real terms) |
| `storytelling hero portfolio` | landing | landing section order |
| `arrow chevron back navigation` | icons | mirroring rule for directional icons |
