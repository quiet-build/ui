# Design Foundations — `@quietbuildlab/ui`

The non-color primitives of the Manuscript design system: spacing rhythm,
radii, elevation, motion, breakpoints, and the status palette. Colors and
per-theme tokens live in [`THEMING.md`](./THEMING.md); UI copy lives in
[`CONTENT.md`](./CONTENT.md).

These build on Tailwind v4 defaults — this doc records the *intent* so layouts
stay cohesive across apps, and adds the few tokens Tailwind doesn't ship.

## Spacing rhythm

Base unit is **4px** (Tailwind's `--spacing: 0.25rem`). Scale: 4, 8, 12, 16,
24, 32, 40, 64, 96.

Keep a **three-step rhythm** (borrowed from Geist — it's the most useful rule):

- **8px** inside a group (icon ↔ label, stacked form controls)
- **16px** between groups (a label+input block ↔ the next block)
- **32–40px** between page sections

If two things relate, tighten the gap; if they don't, widen it. Consistent
rhythm reads as "designed" even when nothing else changes.

## Radii

Driven by the per-theme `--radius`, with derived steps:

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | `--radius − 2px` | inputs, small chips |
| `rounded-md` | `--radius` | buttons, cards (default) |
| `rounded-lg` | `--radius + 2px` | popovers, menus |
| `rounded-xl` | `--radius + 6px` | dialogs, sheets |

Keep **one radius family per view**. `--radius` ranges from `0` (Mono) to
`0.625rem` (Sunset) across presets — see the theme table in `THEMING.md`.

## Elevation

A mode-aware shadow scale mapped onto Tailwind's `shadow-*` utilities. **Light
values are identical to Tailwind's defaults; dark values are stronger** so
cards, popovers, and dialogs keep their depth on dark surfaces (plain black
shadows nearly vanish on a dark background otherwise).

| Utility | Use |
|---|---|
| `shadow-xs` | subtle lift — outline buttons, resting cards |
| `shadow-sm` | raised cards |
| `shadow-md` | popovers, dropdowns, tooltips |
| `shadow-lg` / `shadow-xl` | dialogs, sheets, command palettes |

The values live in `--elevation-*` (in `src/themes/_shared.css`). Override
`--elevation-*` in your app's `:root` / `.dark` to retune globally. Prefer
elevation for transient/floating surfaces; prefer a border for in-flow surfaces.

One trade-off: because the `shadow-*` steps resolve through `var(--elevation-*)`,
Tailwind's shadow *color* modifiers (`shadow-md shadow-primary/20`,
`shadow-lg/50`) can't recolor them — the layers are opaque to the compiler.
Nothing in the library or its consumers uses colored shadows today; if you need
one, use an arbitrary value (`shadow-[0_4px_12px_var(--color)]`).

## Motion

Motion should **clarify a change, never decorate**. Most state changes are
instant; animate only enter/exit and things that move.

Shared tokens (in `_shared.css`):

| Token | Value | Use |
|---|---|---|
| `--duration-fast` (150ms) | quick state changes (hover, press) |
| `--duration-normal` (200ms) | popovers, accordions, tabs |
| `--duration-slow` (300ms) | overlays, sheets, dialogs |
| `ease-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.1)` — playful overshoot |
| `ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` — decisive settle |

Use via utilities (`ease-spring`, `duration-200`) or the vars directly
(`[transition-duration:var(--duration-normal)]`). Always honor
`prefers-reduced-motion` — gate non-essential motion behind
`motion-safe:` / `motion-reduce:`.

## Breakpoints

Tailwind defaults (min-width): `sm` 640px, `md` 768px, `lg` 1024px, `xl`
1280px, `2xl` 1536px. Design mobile-first; layer complexity up at `md`+. Center
primary content in a readable column (`max-w-3xl`…`max-w-6xl`) rather than
letting it span ultra-wide.

## Status palette

Alongside each theme's brand `--primary` and `--destructive`, three shared,
brand-independent status colors complete the semantic set:

| Token | Meaning | Consumed by |
|---|---|---|
| `--success` | done / healthy | `Alert`, `Badge`, toast `success` |
| `--warning` | needs attention | `Alert`, `Badge`, toast `warning` |
| `--info` | neutral info | `Alert`, `Badge`, toast `info` |
| `--destructive` | error / failure | `Alert`, `Badge`, `Button`, toast `error` |

They're defined once (light + dark) in `_shared.css` and inherited by all six
themes. Signal status with **icon + text + color together**, never color alone
(accessibility). See `CONTENT.md` for the words that pair with each.

WCAG AA contrast (≥ 4.5:1) for each status color against every theme's
`--card` and `--background`, in both light and dark, is enforced by
[`src/themes/status-contrast.test.ts`](./src/themes/status-contrast.test.ts) —
a token change that drops contrast below AA fails the test suite.

---

## Adopted from Geist — and what we deliberately didn't

This foundations layer was informed by Vercel's Geist design docs. What we took:
the three-step spacing rhythm, a complete status palette, mode-aware elevation,
motion durations/easing, and the voice guidelines (`CONTENT.md`).

What we **didn't** adopt, on purpose:

- **Numbered 100–1000 color scales.** This system uses shadcn-style semantic
  role tokens; hover/active come from Tailwind opacity modifiers and
  `color-mix`. Migrating to intent-numbered scales would fight the grain and
  rewrite all six themes for little gain.
- **A full typographic token scale** (heading/label/copy/button ramps). Tailwind
  utilities cover this at our altitude; only font *families* are themed.
- **Dual sRGB + P3 tokens.** Every token is already OKLCH (wide-gamut native),
  so the extra hex/P3 pairing Geist ships for published hex isn't needed.
