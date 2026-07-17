# DataGrid

Virtualized sibling of [DataTable](./data-table.md) for large datasets (100k+ rows): renders only the visible window via `@tanstack/react-virtual`, with the same TanStack column API, sortable headers, and toolbar pieces. No pagination — one continuous scroll, optionally infinite via `onReachEnd`.

**Client-side only.** For paginated or server-side data, use `DataTable`.

## Import

```tsx
import { DataGrid } from '@quietbuildlab/ui'
import type { ColumnDef } from '@tanstack/react-table'
```

## Props

```tsx
interface DataGridProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]   // column `size` drives cell widths (default 150)
  data: TData[]                          // full client-side dataset
  height?: number | string               // scroll viewport height, default '32rem'
  estimateRowHeight?: number             // virtualizer row estimate in px, default 40
  overscan?: number                      // extra rows beyond the window, default 5

  enableSorting?: boolean                // default false — string headers auto-wrap, like DataTable
  defaultSorting?: SortingState
  enableGlobalFilter?: boolean           // default false — debounced search box
  searchPlaceholder?: string
  renderToolbar?: (table) => React.ReactNode

  onReachEnd?: () => void                // infinite scroll: append the next chunk to `data`
  hasMore?: boolean                      // default false
  loading?: boolean                      // bottom loading row; pauses onReachEnd

  emptyMessage?: React.ReactNode
  getRowId?: (row: TData, index: number) => string
  onRowClick?: (row: Row<TData>) => void // same contract as DataTable
  className?: string
}
```

## Usage — 100k rows

```tsx
<DataGrid columns={columns} data={rows100k} height={480} enableSorting enableGlobalFilter />
```

## Usage — infinite scroll

```tsx
const [rows, setRows] = useState(() => fetchChunk(0))
const [loading, setLoading] = useState(false)
const [hasMore, setHasMore] = useState(true)

<DataGrid
  columns={columns}
  data={rows}
  hasMore={hasMore}
  loading={loading}
  onReachEnd={async () => {
    setLoading(true)
    const next = await fetchChunk(rows.length)
    setRows((prev) => [...prev, ...next])
    setHasMore(next.length > 0)
    setLoading(false)
  }}
/>
```

`onReachEnd` fires once per `data.length` when the last rendered row comes within `overscan` of the end — append rows and it re-arms automatically.

## Notes

- The virtualized layout uses `display: grid` with absolutely-positioned rows (TanStack's documented pattern), so cells are flex boxes with explicit widths from `column.getSize()` — set `size` on columns that need more than the 150px default.
- Row heights are measured dynamically (skipped on Firefox, which measures border heights incorrectly — TanStack's own guidance).
- Sorting/filtering run over the full dataset via TanStack row models; only rendering is windowed.
- A polite live region below the grid announces the (filtered) row count.
- **Accessibility**: sortable headers set `aria-sort`; `onRowClick` rows are focusable and Enter-activatable.

## Related

- [DataTable](./data-table.md) — paginated, server-side modes, selection, grouping, pinning
- [Table](./table.md) — static primitives

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/data-grid.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-datagrid--hundred-thousand-rows)
