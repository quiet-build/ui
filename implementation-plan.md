# Implementation plan — status-token follow-ups

> Handoff doc for the next implementation session. Self-contained: everything
> needed is in this file plus the repo. Written 2026-07-16.
>
> **Status: implemented 2026-07-16.** Task 1 (`src/themes/status-contrast.test.ts`,
> 72 passing assertions, mutation-checked) and Task 2 (status badges in
> `ThemeGallery.stories.tsx`) are both done and verified (typecheck, full test
> suite, build, visual check in Storybook light+dark). Shipped as part of the
> v0.8.0 release. Kept here as a record of the reasoning; not an open TODO.

## Context (read first)

The working tree contains a completed, **uncommitted** "Geist-inspired token
pass" (modeled on vercel.com/design.md + design.dark.md):

- Shared status tokens `--success` / `--warning` / `--info` (+ `-foreground`),
  defined once for light+dark in `src/themes/_shared.css`, inherited by all
  six themes. New `success` / `warning` / `info` variants on Alert and Badge
  (`src/components/shadcn-base/{alert,badge}.tsx`); Sonner toast icons colored
  semantically (`sonner.tsx`).
- Mode-aware elevation: `--elevation-2xs … -2xl` mapped onto Tailwind's
  `shadow-*` scale (light = Tailwind defaults byte-for-byte; dark = stronger).
- Motion tokens `--ease-spring`, `--ease-out-quart`, `--duration-fast/normal/slow`
  in `_shared.css` `:root` (NOT `@theme` — Tailwind v4 tree-shakes unused
  `@theme` vars; the eases are additionally mapped in `@theme inline` like
  `--font-sans` so `ease-spring` utilities work).
- New docs `DESIGN.md`, `CONTENT.md`; updates to `THEMING.md`, `AGENTS.md`,
  component `.md`s, stories, `llms.txt` / `llms-full.txt`.
- All verified: typecheck, 193/193 tests, `npm run build`, browser check in
  light + dark.

**Already tuned — do not change:** `--warning` light is exactly
`oklch(0.55 0.12 70)`; it was darkened from 0.58 to pass WCAG AA (worst case
4.87:1 on Manuscript's card). Do not re-lighten any status color.

## Ground rules

- This repo uses **npm** (not pnpm). Run `npm run typecheck && npm test &&
  npm run build` before declaring done.
- **Docs-in-sync rule** (see AGENTS.md "Editing this library"): any change to a
  file with a companion `.md` updates that `.md` in the same commit. Public
  API changes also sync `llms.txt` / `llms-full.txt`. Tasks below don't change
  public API, so only companions apply.
- Surgical changes only; match existing style. Light-mode visuals must not
  change.
- Tests are node-based string/logic tests (see `src/theme.css.test.ts` for the
  pattern: `// @vitest-environment node`, `readFileSync` relative to
  `import.meta.url`).

---

## Task 1 — WCAG contrast regression test (highest value)

**Goal:** make "status colors pass AA" a tested invariant, not a one-time
claim. A future tweak to any status token or theme surface must fail CI if it
drops below 4.5:1.

**New file:** `src/themes/status-contrast.test.ts` (node environment).

**Spec:**

1. Parse `oklch(L C H)` values out of CSS with a regex. Sources:
   - Shared status tokens from `src/themes/_shared.css` — `--success`,
     `--warning`, `--info` in the plain `:root { … }` block (light) and
     `.dark { … }` block (dark). Note the file also has `@theme` blocks;
     anchor the parse to the `:root {` / `.dark {` blocks near the bottom.
   - Per-theme surfaces from each of the six preset files
     (`manuscript|midnight|slate|sunset|ocean|mono.css`): `--card` and
     `--background` from `:root` (light) and `.dark` (dark).
2. Convert OKLCH → linear sRGB (constants below), clamp channels to [0,1],
   compute WCAG relative luminance directly from **linear** RGB
   (`0.2126R + 0.7152G + 0.0722B`), contrast = `(L1+0.05)/(L2+0.05)`.
3. Assert: for each theme × mode × surface (card, background) × status color
   (success, warning, info): **contrast ≥ 4.5**. That's 6×2×2×3 = 72
   assertions (a `describe.each` over presets works well).

**OKLCH → linear sRGB** (oklab → LMS → linear sRGB; a = C·cos(h°),
b = C·sin(h°)):

```
l' = L + 0.3963377774·a + 0.2158037573·b
m' = L − 0.1055613458·a − 0.0638541728·b
s' = L − 0.0894841775·a − 1.2914855480·b
l = l'³, m = m'³, s = s'³
R =  4.0767416621·l − 3.3077115913·m + 0.2309699292·s
G = −1.2684380046·l + 2.6097574011·m − 0.3413193965·s
B = −0.0041960863·l − 0.7034186147·m + 1.7076147010·s
```

**Expected baselines with current values** (sanity-check your implementation
against these; worst cases): light warning on Manuscript card ≈ 4.87, light
success on white card ≈ 5.19, light info on white ≈ 5.51; dark values all
≥ 6.0. If your numbers differ by more than ~0.05, the conversion is wrong —
fix the test, not the tokens.

**Out of scope for assertions:** `--destructive`, `--primary`,
`--muted-foreground` etc. (pre-existing values, not audited — asserting them
may fail themes this pass didn't touch). Optionally `console.log` them for
information, but don't assert.

**Verify:** `npx vitest run src/themes/status-contrast.test.ts` green, then
full `npm test`. Then mutation-check the test: temporarily set
`--warning: oklch(0.7 0.12 70)` in `_shared.css`, confirm the test **fails**,
revert.

**Doc:** add one line to `DESIGN.md`'s "Status palette" section noting the
contrast invariant is enforced by `src/themes/status-contrast.test.ts`.

---

## Task 2 — Status variants in the ThemeGallery story

**Goal:** the six-theme side-by-side (`src/ThemeGallery.stories.tsx`, story
"Guides → Theme Gallery") should showcase the status palette per theme, so
theme comparisons and future visual-regression diffs cover it.

**Spec:**

1. In the `ThemeCard` component (~line 159; it already renders
   `<Badge>preview</Badge>`), add a compact row of the three status badges:
   `<Badge variant="success">Live</Badge>`,
   `<Badge variant="warning">Expiring</Badge>`,
   `<Badge variant="info">Beta</Badge>` — plus the existing destructive if not
   already shown. Keep it to one small flex row; don't restructure the card.
2. First understand how `ThemeCard` applies theme tokens (`styleFor(themeKey)`
   / `PRESET_TOKENS` inline-style approach vs `data-theme`). The status tokens
   are **shared** (from `:root` / `.dark`, not per-theme), so badge classes
   like `bg-success/10 text-success` resolve via the cascade regardless —
   verify this holds in the gallery's inline-style setup. If `PRESET_TOKENS`
   contains its own copies of tokens, do NOT add per-theme status entries;
   shared is the design.
3. If the `RuntimeSwitcherDemo` in the same file has a natural spot, add one
   success badge there too (optional, low priority).

**Verify:** `npm run storybook`, open Guides → Theme Gallery, check all six
cards show the badges correctly in light and dark (addon toolbar toggles).
Screenshot or note the result. Then `npm run typecheck && npm test`.

---

## Task 3 — Commit (grouped), leave release to Ming

**Confirm with Ming before committing** (this plan alone is not commit
authorization). When approved, suggested grouping (or a single commit if
preferred):

1. `feat(themes): shared status tokens, mode-aware elevation, motion tokens`
   — `_shared.css`, `_shared.md`, `theme.css.test.ts`
2. `feat(components): success/warning/info variants for Alert, Badge, Sonner`
   — component + story + companion `.md` + `llms*.txt` changes
3. `docs: DESIGN.md and CONTENT.md foundations` — new docs + `THEMING.md`,
   `AGENTS.md`
4. Task 1 + Task 2 from this plan.

Note: commits are signed with `~/.ssh/git_signing` via
`git -c gpg.ssh.program=ssh-keygen …` (see global git config; do not use
1Password's op-ssh-sign).

**Do NOT run `npm version` / push tags** — tag push triggers OIDC publish to
npm. That release step is Ming's (suggested: `npm version minor` →
0.8.0, since the pass is additive).

---

## Open decision — not in scope unless Ming says so

**Mono theme + chromatic status colors.** Mono is strict-B/W brutalist, but
now inherits green/amber/blue status colors. Current choice: keep chromatic
(accessibility, consistency). Alternative: override the six status tokens in
`mono.css` to grayscale/near-black. Do not implement without Ming's explicit
go-ahead.

## Backlog (pre-existing, separate from this pass)

See `improvements.md`: Renovate/Dependabot for consumers, Storybook+Playwright
visual regression across themes (Task 2 feeds this), ThemeSwitcher recipe,
data-table state recipes, bundle-size budget, pinning typescript/vite.
