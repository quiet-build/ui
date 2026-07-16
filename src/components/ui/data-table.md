# DataTable

TanStack Table-powered data grid with built-in pagination, sorting, filtering, column visibility, and row selection. Two pagination modes: client-side (default) and server-side (presence of `pageCount` flips the mode) — in server-side mode, sorting and filtering are also manual: the table never sorts/filters locally, it only fires the `on*Change` callbacks.

Also exports the building blocks it's made from — `DataTableColumnHeader`, `DataTableToolbar`, `DataTableFacetedFilter`, `DataTableViewOptions`, `DataTablePagination`, and `dataTableFacetedFilterFn` — so you can compose a fully custom table instead of using `<DataTable>` directly.

## Import

```tsx
import {
  DataTable,
  DataTableColumnHeader,
  DataTableToolbar,
  DataTableFacetedFilter,
  DataTableViewOptions,
  DataTablePagination,
  dataTableFacetedFilterFn,
} from '@quietbuildlab/ui'
import type { ColumnDef } from '@tanstack/react-table'  // transitive dep
```

## Props

```tsx
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]   // from @tanstack/react-table
  data: TData[]                          // full dataset (client) or current page slice (server)
  pageSize?: number                      // initial/controlled page size (default 10)
  pageSizeOptions?: number[]             // dropdown options (default [10, 25, 50, 100])
  pageIndex?: number                     // controlled page index (server-side mode)
  pageCount?: number                     // total pages — presence flips to server-side mode
  onPaginationChange?: (state: PaginationState) => void
  loading?: boolean                      // dims table and disables controls
  emptyMessage?: React.ReactNode         // default "No results."
  className?: string

  enableSorting?: boolean                // default false
  sorting?: SortingState
  onSortingChange?: (state: SortingState) => void

  enableGlobalFilter?: boolean           // default false — shows the built-in search box
  globalFilter?: string
  onGlobalFilterChange?: (value: string | undefined) => void
  searchPlaceholder?: string             // default "Search…"

  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (state: ColumnFiltersState) => void

  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (state: VisibilityState) => void

  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)  // default false
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (state: RowSelectionState) => void
  getRowId?: (row: TData, index: number) => string  // recommended with selection + server mode

  renderToolbar?: (table: Table<TData>) => React.ReactNode  // replaces the default toolbar

  stickyHeader?: boolean                 // default false
}
```

All new props are optional and off by default — existing `<DataTable columns={columns} data={data} />` usages are unaffected.

## Usage — client-side (default)

Pass the full dataset. The table handles pagination internally.

```tsx
type User = { id: string; name: string; email: string; role: string }

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name',  header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role',  header: 'Role' },
]

<DataTable columns={columns} data={allUsers} pageSize={25} />
```

## Usage — server-side

Set `pageCount` to flip the mode. Parent owns `pageIndex`/`pageSize` (and, if used, `sorting`/`columnFilters`/`globalFilter`), fetches the right slice, and passes `loading` so the table dims controls during fetch.

```tsx
import type { PaginationState } from '@tanstack/react-table'

const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
const [isLoading, setIsLoading] = useState(false)
const [pageRows, setPageRows] = useState<Order[]>([])
const [pageCount, setPageCount] = useState(0)

async function handlePaginationChange(next: PaginationState) {
  setPagination(next)
  setIsLoading(true)
  const res = await fetchOrders(next.pageIndex, next.pageSize)
  setPageRows(res.rows)
  setPageCount(res.pageCount)
  setIsLoading(false)
}

<DataTable
  columns={columns}
  data={pageRows}
  pageIndex={pagination.pageIndex}
  pageSize={pagination.pageSize}
  pageCount={pageCount}
  onPaginationChange={handlePaginationChange}
  loading={isLoading}
/>
```

## Usage — sorting

```tsx
<DataTable columns={columns} data={allUsers} enableSorting />
```

Any column whose `header` is a plain string automatically gets the sortable `DataTableColumnHeader` treatment for free — clicking the label toggles sort (shift-click adds a column to a multi-sort), and a caret button opens a menu with explicit Asc / Desc / Hide actions. Opt a column out with `enableSorting: false` on its `ColumnDef` (it renders as plain text). To control the header's rendering yourself (custom label, icon, alignment), give the column a function `header` — that column is left untouched by the auto-wrap:

```tsx
{
  accessorKey: 'name',
  header: ({ column }) => <DataTableColumnHeader column={column} title="Full name" />,
}
```

## Usage — search and column filters

```tsx
<DataTable columns={columns} data={allUsers} enableGlobalFilter searchPlaceholder="Search users…" />
```

The built-in search box narrows rows against every column (debounced ~300ms). For an enum-ish column filter with a checkbox popover and per-option counts, pair `dataTableFacetedFilterFn` on the column with `DataTableFacetedFilter`, composed via `renderToolbar`:

```tsx
const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role', filterFn: dataTableFacetedFilterFn },
]

<DataTable
  columns={columns}
  data={allUsers}
  enableGlobalFilter
  renderToolbar={(table) => (
    <DataTableToolbar table={table}>
      <DataTableFacetedFilter
        column={table.getColumn('role')}
        title="Role"
        options={[
          { label: 'Admin', value: 'admin' },
          { label: 'Member', value: 'member' },
        ]}
      />
    </DataTableToolbar>
  )}
/>
```

`renderToolbar` fully replaces the default toolbar (search + view options), so compose `DataTableToolbar` yourself to keep them — it renders the search box, your `children` (typically one or more `DataTableFacetedFilter`s), a "Reset" button when any filter is active, and `DataTableViewOptions` on the trailing edge. Per-option facet counts (`getFacetedUniqueValues()`) are only available in client-side mode.

## Usage — column visibility

Automatic: whenever at least one column has `enableHiding !== false` (the default), the default toolbar (or `DataTableToolbar`) renders a "View" dropdown. Name a column for that menu via a string `header`, or `meta: { label: '...' }` when the header is a custom render function:

```tsx
{ accessorKey: 'internalId', header: () => <code>ID</code>, meta: { label: 'Internal ID' } }
```

## Usage — row selection

```tsx
<DataTable
  columns={columns}
  data={allUsers}
  enableRowSelection
  getRowId={(user) => user.id}   // strongly recommended, especially with server-side mode
/>
```

Adds a checkbox column (header checkbox selects/deselects every row on the current page, with an indeterminate state) and an "X of Y row(s) selected." summary in the pagination footer. `enableRowSelection` also accepts a per-row predicate: `(row) => row.original.status !== 'archived'`.

## Composing a fully custom table

`DataTable` is built from exported pieces you can use directly:

- **`DataTableColumnHeader`** — `{ column, title, className? }`. Sortable header cell; renders plain text if `!column.getCanSort()`.
- **`DataTableToolbar`** — `{ table, searchPlaceholder?, children?, className? }`. Search box (when `table.options.enableGlobalFilter`) + Reset + `children` + `DataTableViewOptions`.
- **`DataTableFacetedFilter`** — `{ column?, title, options: { label, value, icon? }[] }`. Popover checkbox list with facet counts; pair the column with `filterFn: dataTableFacetedFilterFn`.
- **`DataTableViewOptions`** — `{ table }`. Column-visibility dropdown; renders `null` if no column can be hidden.
- **`DataTablePagination`** — `{ table, pageSizeOptions?, loading? }`. Rows-per-page selector, selection summary, page status, Prev/Next.
- **`dataTableFacetedFilterFn(row, columnId, filterValue)`** — filter function matching when the cell's stringified value is one of the selected values.

Use these with your own `useReactTable()` call (not `<DataTable>`) when you need full control over the table's layout.

## Notes

- `ColumnDef` types come from `@tanstack/react-table`; import them directly from there.
- For a static styled table without pagination, use the `<Table>` primitives instead.
- `stickyHeader` sticks the header row to the top of a bounded, vertically-scrolling wrapper (adds `max-h-[32rem] overflow-y-auto` to the table's outer wrapper); override the max-height via `className` if needed.
- **Accessibility**: the outer wrapper sets `aria-busy` while `loading` is true. The "Page X of Y" indicator is a polite live region, so screen readers announce page changes (and the loading state). Prev/Next buttons have full-context `aria-label`s describing the destination page. The rows-per-page Select is labelled by the visible "Rows per page" text via `aria-labelledby`. Sortable header cells set `aria-sort` (`ascending` / `descending` / `none`); selected rows get `aria-selected` and `data-state="selected"` (which drives the existing `data-[state=selected]:bg-muted` row styling).

## Related

- [Table](./table.md), [Pagination](./pagination.md), [Skeleton](./skeleton.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/data-table.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-datatable--default)
