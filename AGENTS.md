# Agent guide for `@quietbuildlab/ui`

This file tells AI agents (Claude Code, Cursor, Copilot, Codex, etc.) how to use this library correctly when working in a consumer project. Skim it once at session start.

## What this library is

`@quietbuildlab/ui` is a themed shadcn/ui component library that ships **one canonical visual identity** ("Manuscript" — warm paper light + warm-charcoal dark, Forest accent, Lora serif headings over Inter body, 4px radius). It exports 21 React components built on Radix UI primitives plus a TanStack-powered `DataTable`. Re-themable per app via CSS variable overrides.

## Install in a consumer app

```bash
npm install @quietbuildlab/ui
```

Requires **Tailwind CSS v4** and React 18 or 19.

## CSS setup — do this exactly

In the consumer app's main CSS file:

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/theme.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

Order matters: tailwind first, then theme.css, then `@source` so Tailwind scans the package's built JS for utility classes.

## Importing components

All components are named exports from the package root:

```tsx
import { Button, Card, CardHeader, CardTitle, Dialog, DialogTrigger, DialogContent } from '@quietbuildlab/ui'
```

Do NOT deep-import (no `from '@quietbuildlab/ui/dist/...'`).

## Dark mode

Toggle a `dark` class on `<html>`:

```ts
document.documentElement.classList.toggle('dark', isDark)
```

The library does NOT ship a theme-provider component — apps own the toggle.

**Caveat for `Toaster`:** `sonner` uses `next-themes` for color-mode detection. Without a `<ThemeProvider attribute="class">` wrapping the app, `Toaster` falls back to OS `prefers-color-scheme` instead of tracking your `.dark` class. If your app needs `Toaster` to follow the explicit class, install `next-themes` and wrap the root.

## Re-theming per app

The Manuscript identity is the default. To tweak per app, override CSS variables AFTER the theme.css import:

```css
:root {
  --primary: oklch(0.40 0.10 250);    /* deep blue accent */
  --ring: oklch(0.40 0.10 250);
  --radius: 0.5rem;                    /* softer corners */
}
.dark {
  --primary: oklch(0.65 0.10 250);
  --ring: oklch(0.65 0.10 250);
}
```

Override only what you need. Everything else stays Manuscript. See `THEMING.md` for the full token table.

## Composition rules

1. **Tooltip needs `<TooltipProvider>` somewhere up the tree.** Wrap the app once at the root.
2. **Dialog / DropdownMenu / Tooltip / Select content portals to `document.body`.** They render outside their parent's DOM tree. Pass `className` to `*Content` for styling.
3. **Compound components stay together.** `<Card>` is a styled div on its own, but `<CardHeader>` etc. must be children of `<Card>`. Same for `<Tabs>`, `<Dialog>`, `<DropdownMenu>`, `<Select>`, `<RadioGroup>`.
4. **Use semantic tokens, not raw colors.** `bg-destructive`, `text-foreground`, `border-input` retheme automatically. `bg-red-500` does not.
5. **`asChild` (Radix Slot) for polymorphism.** `<Button asChild><Link to="/foo">Go</Link></Button>` renders the link with button styling. Don't nest `<a>`/`<Link>` inside `<button>`.

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
- **Don't add a `<ThemeProvider>` thinking the library needs one.** Just toggle `.dark` on `<html>`. (Exception: if you want `Toaster` to track the class, then yes — `next-themes` ThemeProvider helps.)
- **Don't expect SSR-specific hydration helpers** — components are client-side React; the `'use client'` directive is in the components for Next.js App Router compatibility.
- **Tailwind utility overrides via `className` work via `tailwind-merge`** — `cn('px-2', 'px-4')` resolves to `px-4`. But for tokens, override the CSS variable instead of fighting class specificity.

## Where to look for more

- Live Storybook: https://quietbuildlab.github.io/ui/
- llms.txt (concise index): https://quietbuildlab.github.io/ui/llms.txt
- llms-full.txt (full API): https://quietbuildlab.github.io/ui/llms-full.txt
- THEMING.md: https://github.com/quietbuildlab/ui/blob/main/THEMING.md
- Source: https://github.com/quietbuildlab/ui
