# Plan — enterprise-grade DataTable ("ag-grid-class" features)

> Handoff plan for a future implementation session. Written 2026-07-16 after
> researching ag-grid (github.com/ag-grid/ag-grid) and TanStack Table docs.
> Self-contained: everything needed is in this file plus the repo.
>
> **Status: Phase 1 implemented 2026-07-16.** Sorting, global search, faceted
> column filters, column visibility, row selection, and sticky headers are
> shipped in `src/components/ui/data-table.tsx` (see companion `.md`, new
> Storybook stories, and `src/components/__tests__/data-table-features.test.tsx`).
> Verified: typecheck, full test suite (283 tests), build, and live browser
> checks in light + dark. Phases 2–4 remain not started and still need the
> open decisions below answered before work begins.

## Why this plan exists

Ming likes ag-grid's enterprise data-table experience and wants
`@quietbuildlab/ui`'s `DataTable` to grow toward it. This plan maps ag-grid's
feature set onto our stack, decides what to build / defer / never build, and
phases the work so each phase ships as an independently useful minor release.

## Research summary

**Current state** (`src/components/ui/data-table.tsx`): TanStack Table v8
wrapper with client/server pagination (presence of `pageCount` flips the
mode), rows-per-page selector, loading + empty states, good a11y. Nothing
else — no sorting, filtering, selection, or column controls.

**ag-grid's feature taxonomy** (from the repo README):

- *Community (MIT)*: sorting, filtering, pagination, cell editing, CSV
  export, drag & drop, row/cell selection, custom renderers, infinite
  scroll / row virtualization, accessibility.
- *Enterprise (paid)*: row grouping + aggregation, pivoting, Excel export,
  clipboard, master/detail, tree data, column & context menus, tool panels,
  integrated charts, formulas, AI toolkit.
- *Architecture*: framework-agnostic virtualized rendering core with React/
  Angular/Vue wrappers; multiple "row models" (client-side, infinite,
  server-side). Bundle is heavyweight (hundreds of KB) because rendering,
  state, and UI all live inside the grid.

**Key insight — we already own the right foundation.** TanStack Table v8
(`@tanstack/react-table@^8.21`, already a dependency) provides the *headless
logic* for nearly all of ag-grid Community AND several Enterprise features:
sorting, column/global filtering, faceted values, row selection, column
visibility/ordering/pinning/sizing, expanding (master/detail, tree data),
grouping + aggregation. Each is opt-in via its row model
(`getSortedRowModel()`, `getFilteredRowModel()`, `getGroupedRowModel()`,
`getExpandedRowModel()`, `getFacetedRowModel()`…) so unused features
tree-shake away. What ag-grid sells that TanStack doesn't do: the *rendered
UI*, virtualization (separate `@tanstack/react-virtual` package, ~3 KB), and
the truly deep Enterprise features (pivot, Excel, charts).

**Strategic decision (recommended):** build the UI layer on TanStack v8 in
phases below. Do **not** attempt an ag-grid clone. If a consuming app ever
genuinely needs pivoting / integrated charts / Excel-grade export, the honest
answer is to use AG Grid Community directly in that app — rebuilding those is
multi-year work with negative ROI for a portfolio component library.

## Ground rules (same as previous plans)

- npm (not pnpm). `npm run typecheck && npm test && npm run build` green
  before declaring any phase done.
- Docs-in-sync rule (AGENTS.md "Editing this library"): companion `.md` files,
  plus `llms.txt` / `llms-full.txt` for public API changes.
- **Non-breaking**: every new capability is opt-in; existing `DataTable`
  usages in privacy-blur / my-nextjs-blog must compile and behave unchanged.
- TanStack **v8 API** (`useReactTable`, `getXRowModel()`): do not copy v9-beta
  snippets (`useTable`, `tableFeatures`) from docs — the repo is on v8.
- Follow the server-mode convention already established: `manualPagination`
  flips on `pageCount` presence; new server-driven features follow the same
  pattern (`manualSorting`, `manualFiltering`) with controlled state +
  `on*Change` callbacks.
- Theming: use semantic tokens only (including the new `--success` /
  `--warning` / `--info` where states call for them). No raw colors.
- Every phase adds Storybook stories (feeds the visual-regression backlog
  item) and tests: node-level logic tests where extractable, story/browser
  tests for interaction.

## Architecture: hybrid API (decision to confirm in Phase 1 PR)

Keep `<DataTable>` as the batteries-included component and grow it with
opt-in props, while **exporting the building blocks** so apps can compose
custom tables without forking:

- `DataTableColumnHeader` — sortable header cell (label + direction icon +
  menu for sort/hide). Sets `aria-sort`.
- `DataTablePagination` — extract the existing footer (rows-per-page +
  Prev/Next) into an exported subcomponent; `DataTable` consumes it.
- `DataTableToolbar` — slot-based bar: global search input, filter chips,
  view-options button, action buttons.
- `DataTableFacetedFilter` — popover checkbox-list filter with per-value
  counts (TanStack faceted row models).
- `DataTableViewOptions` — column-visibility dropdown.

This mirrors the widely-known shadcn/ui "tasks" demo naming, so consumers
(and AI agents generating UI against llms.txt) get a familiar API.

---

## Phase 1 — Table stakes (sorting, filtering, visibility, selection)

The 80% of ag-grid people actually use daily.

1. **Column sorting** — `enableSorting` prop; per-column opt-out via
   `ColumnDef.enableSorting`. Client mode uses `getSortedRowModel()`; server
   mode (when `pageCount` present) sets `manualSorting` and surfaces
   controlled `sorting` / `onSortingChange`. Multi-sort via shift-click.
   Header renders `DataTableColumnHeader` with `aria-sort`.
2. **Global filter** — `enableGlobalFilter`; debounced search input in the
   toolbar; controlled `globalFilter` / `onGlobalFilterChange` for server
   mode.
3. **Column filters** — controlled `columnFilters` / `onColumnFiltersChange`;
   text-contains default; `DataTableFacetedFilter` for enum-ish columns.
4. **Column visibility** — `DataTableViewOptions` dropdown; controlled
   `columnVisibility` state optional.
5. **Row selection** — `enableRowSelection` (boolean or per-row predicate),
   checkbox column (header = select-all-on-page with indeterminate state),
   controlled `rowSelection` / `onRowSelectionChange`, `getRowId` prop
   (critical for server mode so selection survives page changes), "N of M
   row(s) selected" in the footer.
6. **Sticky header** — `stickyHeader` prop (position: sticky, uses `--card`
   surface + `--elevation-2xs` separation when stuck).

**Acceptance criteria**
- All features work in BOTH client and server modes; server mode fires
  callbacks and never sorts/filters locally.
- Existing consumers compile unchanged (no new required props).
- Keyboard + SR pass: sort buttons reachable/announced, checkboxes labelled,
  filter input labelled. `aria-sort` reflects state.
- Stories: one per feature + one "kitchen sink" story; unit tests for the
  server/client mode branching logic; interaction tests for sort toggle,
  select-all, filter narrowing.
- Estimated size: the largest phase; ship as one minor (e.g. 0.9.0).

## Phase 2 — Power ergonomics

1. **Column pinning** (left/right sticky columns) and **column resizing**
   (drag handle, `columnResizeMode: 'onChange'`). Column *reordering* via
   drag-and-drop is optional — evaluate effort; a "move left/right" menu item
   on `DataTableColumnHeader` delivers 80% at 20% cost.
2. **Row expanding / detail panel** — `renderDetail(row)` prop using
   `getExpandedRowModel()`; chevron column; full-width detail row. This is
   ag-grid's Enterprise "master/detail" — cheap for us.
3. **CSV export** — toolbar action; hand-rolled serializer (~40 lines: quote
   escaping, BOM for Excel, respects current column visibility + filter +
   sort). **No new dependency.** Exports visible columns of the
   filtered+sorted row model (client mode) or current page (server mode,
   documented limitation).
4. **Empty / loading / error recipes** — closes improvements.md item 4:
   `error` + `onRetry` props alongside the existing `loading` /
   `emptyMessage`; skeleton-rows loading variant; documented recipe story.
5. **Toolbar recipe story** — compose search + faceted filters + view
   options + export into `Recipes/` as the canonical example.

**Acceptance criteria**
- Pinned columns stay sticky under horizontal scroll with correct z-index and
  border/elevation treatment in light + dark, all six themes.
- CSV opens correctly in Excel/Numbers (UTF-8 BOM, quoted fields with commas
  and newlines); unit-tested serializer in `src/lib/` (node tests).
- Detail rows are keyboard-toggleable and announced (aria-expanded).

## Phase 3 — Scale (virtualization + infinite data)

This is ag-grid's core architectural moat; TanStack's documented pattern
covers it.

1. **Virtualized rows** — new opt-in surface, either `<DataTable virtualized
   height={...}>` or a sibling `<DataGrid>`; recommend deciding by bundle
   impact: `@tanstack/react-virtual` is small, but the virtualized layout
   forces the documented `display: grid` / fixed-height / sticky-thead table
   layout, which differs enough from the current `<Table>` primitives that a
   **sibling component sharing the column API** is likely cleaner than a mode
   flag. Target: 100k client-side rows at 60 fps scroll, `useVirtualizer` in
   the deepest body component (per TanStack guidance), `overscan: 5`,
   Firefox `measureElement` workaround from the docs.
2. **Infinite scroll mode** (ag-grid "infinite row model") — `onReachEnd`
   callback + `hasMore`; composes with virtualization; alternative to
   paginated server mode.
3. **Tree data / sub-rows** — `getSubRows` prop wired to
   `getExpandedRowModel()` with indent + toggle in the first column.

**Acceptance criteria**
- A 100k-row story scrolls smoothly (measure with the Storybook a11y/perf
  panel or a simple frame counter); sorting/filtering still work virtualized.
- Virtualization code must not load for consumers who don't use it (separate
  export path or dynamic import — verify with a bundle check on dist).
- Pagination mode remains the default and unchanged.

## Phase 4 — Evaluate before building (explicit gates, not commitments)

Each item needs a go/no-go from Ming with a real consumer use-case before
any code:

- **Row grouping + aggregation** — TanStack `getGroupedRowModel()` +
  `aggregationFn` make the logic cheap, but the UX (group headers, drag-to-
  group bar, aggregate footers) is substantial. Build only when an app needs
  it.
- **Inline cell editing** — editable cell renderers + commit/rollback +
  validation. High complexity, high test surface. ag-grid Community has it;
  we should only build a minimal "click-to-edit text/select cell" recipe,
  not a spreadsheet.
- **Clipboard copy** — "copy selection as TSV" toolbar action is cheap and
  useful; full paste-into-grid is not. Cap scope at copy-only.
- **Excel (.xlsx) export** — requires a heavy dep (exceljs/SheetJS). If ever
  needed: optional peer dependency + separate export path, never in core.
  CSV (Phase 2) covers most real needs.
- **Never build** (use AG Grid directly in the consuming app instead):
  pivoting, integrated charts, formulas, AI assistants, tool panels/context
  menu system.

## Cross-cutting requirements (all phases)

- **Bundle discipline**: core `DataTable` keeps zero new runtime deps through
  Phase 2. Any new dep (react-virtual) must be tree-shakeable or in a
  separate entry. Add a size check to the release checklist (ties to
  improvements.md item 5).
- **A11y**: keep the existing live-region/aria-busy patterns; new interactive
  elements need labels; consider `@storybook/addon-a11y` (Storybook already
  suggests it) as part of Phase 1 verification.
- **State philosophy**: every stateful feature = uncontrolled by default,
  controllable via `value` + `onChange` pair (the `useControllableState`
  hook already in the repo). Server mode always controlled.
- **Docs**: `data-table.md` grows a section per feature with a copy-paste
  example; `llms-full.txt` DataTable section updated in the same commit;
  README component count/blurb if the public surface grows.

## Suggested sequencing & sizing

| Phase | Ships as | Rough size |
|---|---|---|
| 1 — table stakes | 0.9.0 | L (several days of focused work) |
| 2 — ergonomics | 0.10.0 | M |
| 3 — scale | 0.11.0 | M–L (layout rework risk) |
| 4 — gated items | case-by-case | per-item |

Phases are independent releases; stop after any phase and the library is
still coherent. Phase 1 alone covers the majority of what consumers hand-roll
today.

## Open decisions for Ming

1. Hybrid API (fat `DataTable` + exported subcomponents) — confirm, or
   prefer pure composition?
2. Phase 3: sibling `<DataGrid>` vs `virtualized` prop on `DataTable`
   (plan recommends sibling).
3. Column reordering: full drag-and-drop, or menu-based move (plan recommends
   menu-based first)?
4. Any Phase 4 item with a concrete consumer need today? If none, Phase 4
   stays gated.
