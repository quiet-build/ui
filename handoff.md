# Handoff — quietbuildlab-ui

> Session-handoff snapshot. Self-contained: written for a fresh session with
> no conversation context. Update this file whenever a working session nears
> its usage limit or finishes a major milestone.
>
> **Last updated: 2026-07-17** (after the DataTable/DataGrid feature push).

## Current state

Everything is **committed and pushed to `origin/main`**; working tree clean.
Latest commit: `9ab5268` — "feat(data-table): phases 1.5–4".

Two major feature waves shipped this week, both fully verified (typecheck,
339-test suite, build, Storybook Playwright interaction tests, live Chromium
spot checks):

1. **Geist-inspired design-token pass** (`implementation-plan.md`, done):
   shared status tokens `--success/--warning/--info` + Alert/Badge/Sonner
   variants, mode-aware `--elevation-*` shadows, motion tokens, `DESIGN.md` +
   `CONTENT.md`, WCAG-contrast regression test, ThemeGallery status showcase.
   Storybook upgraded to 10.5.0 (adds dev-only `@storybook/addon-mcp` at
   `localhost:6006/mcp`).
2. **ag-grid-class DataTable + virtualized DataGrid**
   (`data-table-plan.md`, phases 1–4 done): sorting/search/faceted +
   number-range filters/column visibility/row selection/row click/column
   pinning + resizing/expandable detail rows/tree data/grouping +
   aggregation/footer rows/CSV + TSV export/error + skeleton states/editable
   cells via `meta.updateData`; new `DataGrid` (100k+ rows via
   `@tanstack/react-virtual`, infinite scroll). All opt-in, non-breaking.

## Pending — Ming's decisions

- **npm release**: package is still 0.7.0 on npm; this is a minor-version's
  worth of features. `npm version minor` + tag push triggers OIDC publish.
  Consumers (privacy-blur `^0.6.1`, blog `^0.6.0`) also lag and need bumps.
- **Mono theme**: keeps chromatic status colors (accessibility default);
  override to grayscale in `mono.css` only if Ming wants strict B/W.
- **Descoped/deferred** (revisit only if asked): i18n `labels` prop
  (explicitly descoped), date-range filter variant, drag-and-drop column
  reordering, Phase-4 "never build" list (pivot/charts/formulas → use AG Grid
  directly).

## Suggested next steps

- Release 0.8.0 and bump the two consumer apps.
- Older backlog in `improvements.md`: Renovate/Dependabot, visual-regression
  testing across the six themes (Storybook+Playwright infra is ready),
  bundle-size budget in CI, pinning typescript/vite versions.

## Traps for the next implementer (hard-won, don't rediscover)

- Repo is **TanStack Table v8** (`useReactTable`/`getXRowModel`) — docs sites
  serve v9-beta snippets (`useTable`/`tableFeatures`); don't copy them.
- Resolved `columnDef` always carries default `size: 150` — "did the user set
  a size?" is undetectable, so column widths only apply when
  pinning/resizing is enabled.
- Rows with subRows (tree data) report `getIsAggregated() === true`; grouped
  cell rendering must stay gated behind `enableGrouping`.
- Tailwind v4 **tree-shakes unused `@theme` vars** — shared design tokens
  live in plain `:root`/`.dark` blocks in `src/themes/_shared.css` with
  `@theme inline` var-indirection (same pattern as `--font-sans`).
- `--warning` light is exactly `oklch(0.55 0.12 70)` (WCAG-tuned, 4.87:1
  worst case) — don't re-lighten; `status-contrast.test.ts` will fail.
- Docs-in-sync rule (AGENTS.md): companion `.md` files + `llms.txt`/
  `llms-full.txt` must be updated with any public API change.
- Repo uses **npm** (not pnpm). Verify with
  `npm run typecheck && npm test && npm run build`.
- Session launch configs live at `~/projects/.claude/launch.json`
  (`ui-preview` port 5174, `ui-storybook` port 6006; 5173 is often held by
  Ming's ~/civica project).
