# Agent guide for `@quietbuildlab/ui`

This file tells AI agents (Claude Code, Cursor, Copilot, Codex, etc.) how to use this library correctly when working in a consumer project. Skim it once at session start.

## What this library is

`@quietbuildlab/ui` is a themed shadcn/ui component library that ships **six ready-made themes** (Manuscript, Midnight, Slate, Sunset, Ocean, Mono) and **31 React components** built on Radix UI primitives plus a TanStack-powered `DataTable`. Themes are swappable per app via a single CSS import, or at runtime via a `data-theme` attribute on `<html>`. Re-themable further via CSS variable overrides.

## Install in a consumer app

```bash
npm install @quietbuildlab/ui
```

Requires **Tailwind CSS v4** and React 18 or 19.

## CSS setup — pick ONE of these three modes

### Mode A: single preset (most common)

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes/midnight.css";   /* or manuscript, slate, sunset, ocean, mono */
@source "../node_modules/@quietbuildlab/ui/dist";
```

### Mode B: backward-compat (Manuscript only)

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/theme.css";              /* alias for themes/manuscript.css */
@source "../node_modules/@quietbuildlab/ui/dist";
```

### Mode C: runtime theme switching

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes.css";             /* bundles all 6 themes */
@source "../node_modules/@quietbuildlab/ui/dist";
```

Then set the theme on `<html>` at runtime:

```ts
document.documentElement.dataset.theme = "ocean"    // or any preset name
```

Default if no `data-theme` is set: Manuscript.

**Order matters in all modes**: tailwind first, then theme/themes CSS, then `@source` so Tailwind scans the package's built JS for utility classes.

## Importing components

All components are named exports from the package root:

```tsx
import {
  Button, Card, CardHeader, CardTitle,
  Dialog, DialogTrigger, DialogContent,
  Sheet, SheetTrigger, SheetContent,
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogAction, AlertDialogCancel,
} from '@quietbuildlab/ui'
```

Do NOT deep-import (no `from '@quietbuildlab/ui/dist/...'`).

## Components shipped (31)

Accordion, Alert, AlertDialog, Avatar, Badge, Button, Calendar, Card, Checkbox, DataTable, DatePicker, Dialog, DropdownMenu, FilePicker, Input, Label, Pagination, Popover, Progress, RadioGroup, Select, Separator, Sheet, Skeleton, Slider, Switch, Table, Tabs, Textarea, Toaster, Tooltip.

## Dark mode

Toggle a `dark` class on `<html>`:

```ts
document.documentElement.classList.toggle('dark', isDark)
```

In runtime-switching mode you typically toggle both at once:

```ts
document.documentElement.dataset.theme = "midnight"
document.documentElement.classList.toggle('dark', isDark)
```

The library does NOT ship a theme-provider component — apps own the toggle.

**Caveat for `Toaster`:** `sonner` uses `next-themes` for color-mode detection. Without a `<ThemeProvider attribute="class">` wrapping the app, `Toaster` falls back to OS `prefers-color-scheme` instead of tracking your `.dark` class. If your app needs `Toaster` to follow the explicit class, install `next-themes` and wrap the root.

## Re-theming per app (token overrides)

Override CSS variables AFTER the preset import:

```css
@import "@quietbuildlab/ui/themes/midnight.css";

:root {
  --primary: oklch(0.62 0.16 50);    /* warm orange */
  --ring: oklch(0.62 0.16 50);
  --radius: 0.5rem;
}
.dark {
  --primary: oklch(0.74 0.16 50);
  --ring: oklch(0.74 0.16 50);
}
```

Override only what you need. Everything else stays the preset's value. See `THEMING.md` for the full token table.

## Composition rules

1. **Tooltip needs `<TooltipProvider>` somewhere up the tree.** Wrap the app once at the root.
2. **Dialog / AlertDialog / Sheet / DropdownMenu / Tooltip / Select content portals to `document.body`.** They render outside their parent's DOM tree. Pass `className` to `*Content` for styling.
3. **Compound components stay together.** `<Card>` is a styled div on its own, but `<CardHeader>` etc. must be children of `<Card>`. Same for `<Tabs>`, `<Dialog>`, `<AlertDialog>`, `<Sheet>`, `<Accordion>`, `<DropdownMenu>`, `<Select>`, `<RadioGroup>`.
4. **Use semantic tokens, not raw colors.** `bg-destructive`, `text-foreground`, `border-input` retheme automatically. `bg-red-500` does not.
5. **`asChild` (Radix Slot) for polymorphism.** `<Button asChild><Link to="/foo">Go</Link></Button>` renders the link with button styling. Don't nest `<a>`/`<Link>` inside `<button>`.

## Alert vs AlertDialog

- **`<Alert>`** is inline, non-blocking — an info/warning/success banner.
- **`<AlertDialog>`** is blocking — a yes/no confirmation modal for destructive actions.

Both are themed. Pick by intent.

## DataTable specifically

`<DataTable>` wraps TanStack Table with built-in Prev/Next, rows-per-page selector, empty state, and loading state. Two modes:

**Client-side (default)** — pass the full dataset; the table paginates internally:
```tsx
<DataTable columns={columns} data={allRows} pageSize={10} />
```

**Server-side** — presence of `pageCount` flips the mode. Parent owns `pageIndex`, `pageSize`, fetches the right slice, and passes `loading` so the table dims and disables controls during fetch:
```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
const [isLoading, setIsLoading] = useState(false)
const [pageRows, setPageRows] = useState<Row[]>([])
const [pageCount, setPageCount] = useState(0)

async function handlePagination(next: PaginationState) {
  setPagination(next)
  setIsLoading(true)
  const res = await fetchPage(next.pageIndex, next.pageSize)
  setPageRows(res.rows)
  setPageCount(res.pageCount)
  setIsLoading(false)
}

return (
  <DataTable
    columns={columns}
    data={pageRows}
    pageIndex={pagination.pageIndex}
    pageSize={pagination.pageSize}
    pageCount={pageCount}
    onPaginationChange={handlePagination}
    loading={isLoading}
  />
)
```

`columns: ColumnDef<TData>[]` types come from `@tanstack/react-table` (a transitive dep — consumers `import type { ColumnDef } from '@tanstack/react-table'` directly).

## Common pitfalls

- **Don't use raw color utilities** (`bg-red-500`) — defeats the theme. Use semantic tokens.
- **Don't import from `dist/`.** Use the package root.
- **Don't add a `<ThemeProvider>` thinking the library needs one.** Just toggle `.dark` on `<html>` (and optionally `data-theme` in runtime mode). Exception: if you want `Toaster` to track the class, then yes — `next-themes` ThemeProvider helps.
- **Don't import more than one theme entrypoint.** `theme.css`, `themes/<name>.css`, and `themes.css` all define `:root` tokens — importing two will cause the second to win, possibly with surprising results.
- **Don't expect SSR-specific hydration helpers** — components are client-side React; the `'use client'` directive is in the components for Next.js App Router compatibility.
- **Tailwind utility overrides via `className` work via `tailwind-merge`** — `cn('px-2', 'px-4')` resolves to `px-4`. But for tokens, override the CSS variable instead of fighting class specificity.

## Editing this library (contributors)

If you're modifying source code in this repo (not just consuming the library in another project), one rule is load-bearing:

**The per-component `.md` files in `src/components/ui/*.md` are part of the contract. They must stay in sync with the `.tsx` they sit beside.**

Whenever a `.tsx` change touches anything a consumer would see — the prop shape, default values, sub-component exports, composition rules, accessibility requirements, or the canonical usage example — update the matching `.md` in the same commit. Treat the `.md` like a test that must be edited when behavior changes; don't ship the `.tsx` change without the doc change.

Concretely, you must update the doc when you:
- Add, remove, or rename an exported component, sub-component, or helper.
- Add, remove, or rename a prop, or change a prop's type or default.
- Change the required composition (e.g. a new compound child becomes required).
- Change accessibility behavior, focus management, or required ARIA props.
- Change how the component is themed (new CSS variable it reads, new `data-*` attribute).

You don't need to touch the `.md` for purely internal refactors (renaming a local variable, restructuring the implementation, optimizing perf) that don't change the externally observable contract.

When in doubt: if the change would surprise a consumer who only reads the doc, update the doc.

After updating the `.md`, also check if `llms.txt`, `llms-full.txt`, or any Storybook story needs the same update — those are downstream summaries of the per-component docs.

## Where to look for more

- Live Storybook: https://quiet-build.github.io/ui/
- llms.txt (concise index): https://quiet-build.github.io/ui/llms.txt
- llms-full.txt (full API): https://quiet-build.github.io/ui/llms-full.txt
- THEMING.md: https://github.com/quiet-build/ui/blob/main/THEMING.md
- Source: https://github.com/quiet-build/ui
