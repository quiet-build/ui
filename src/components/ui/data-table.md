# DataTable

TanStack Table-powered data grid with built-in pagination, sorting, filtering, column visibility, row selection, column pinning/resizing, expandable detail rows, tree data, grouping with aggregation, footer rows, CSV export, and error/skeleton states. Two pagination modes: client-side (default) and server-side (presence of `pageCount` flips the mode) — in server-side mode, sorting and filtering are also manual: the table never sorts/filters locally, it only fires the `on*Change` callbacks. Grouping, tree data, and faceted counts are client-side-only.

Also exports the building blocks it's made from — `DataTableColumnHeader`, `DataTableToolbar`, `DataTableFacetedFilter`, `DataTableRangeFilter`, `DataTableViewOptions`, `DataTablePagination`, `DataTableExportButton`, `dataTableFacetedFilterFn`, and the CSV/TSV helpers (`tableToCsv`, `selectionToTsv`, `copySelectionAsTsv`, `exportTableToCsv`) — so you can compose a fully custom table instead of using `<DataTable>` directly.

For 100k+ rows, use the virtualized sibling [DataGrid](./data-grid.md).

## Import

```tsx
import {
  DataTable,
  DataTableColumnHeader,
  DataTableToolbar,
  DataTableFacetedFilter,
  DataTableRangeFilter,
  DataTableViewOptions,
  DataTablePagination,
  DataTableExportButton,
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
  loading?: boolean                      // dims table (or shows skeleton rows when empty)
  loadingRows?: number                   // skeleton row count when loading && empty (default 5)
  error?: React.ReactNode                // replaces the body with an error message
  onRetry?: () => void                   // adds a Retry button to the error state
  emptyMessage?: React.ReactNode         // default "No results."
  className?: string

  enableSorting?: boolean                // default false
  sorting?: SortingState
  defaultSorting?: SortingState          // uncontrolled initial sort
  onSortingChange?: (state: SortingState) => void

  enableGlobalFilter?: boolean           // default false — shows the built-in search box
  globalFilter?: string
  onGlobalFilterChange?: (value: string | undefined) => void
  searchPlaceholder?: string             // default "Search…"

  columnFilters?: ColumnFiltersState
  defaultColumnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (state: ColumnFiltersState) => void

  enableViewOptions?: boolean            // default false — shows the "View" column-visibility dropdown
  columnVisibility?: VisibilityState
  defaultColumnVisibility?: VisibilityState
  onColumnVisibilityChange?: (state: VisibilityState) => void

  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)  // default false
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (state: RowSelectionState) => void
  getRowId?: (row: TData, index: number) => string  // recommended with selection + server mode

  onRowClick?: (row: Row<TData>) => void // pointer cursor + Enter activation; ignores inner controls

  enableColumnResizing?: boolean         // default false — drag handles; applies explicit widths
  enableColumnPinning?: boolean          // default false — Pin left/right in the column menu
  columnPinning?: ColumnPinningState
  defaultColumnPinning?: ColumnPinningState  // e.g. { left: ['name'] }
  onColumnPinningChange?: (state: ColumnPinningState) => void

  renderDetail?: (row: Row<TData>) => React.ReactNode  // expandable detail panel (chevron column)
  getSubRows?: (row: TData) => TData[] | undefined     // tree data (client-side only)
  expanded?: ExpandedState
  defaultExpanded?: ExpandedState        // `true` expands everything
  onExpandedChange?: (state: ExpandedState) => void

  enableGrouping?: boolean               // default false — "Group by" in column menus (client-side only)
  grouping?: GroupingState
  defaultGrouping?: GroupingState        // e.g. ['status']
  onGroupingChange?: (state: GroupingState) => void

  enableCsvExport?: boolean | string     // default false — Export button; string sets the filename

  renderToolbar?: (table: Table<TData>) => React.ReactNode  // replaces the default toolbar
  stickyHeader?: boolean                 // default false
  meta?: TableMeta<TData>                // passed to table.options.meta (e.g. updateData for editable cells)
}
```

All feature props are optional and off by default — existing `<DataTable columns={columns} data={data} />` usages are unaffected.

**Stable references:** memoize `columns` and `data` (module constants, `useMemo`, or state) rather than building fresh arrays inline on every render — unstable references make TanStack re-derive column instances each render, which costs performance and resets column sizing state.

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

```tsx
<DataTable columns={columns} data={allUsers} enableViewOptions />
```

`enableViewOptions` shows a "View" dropdown (in the default toolbar) listing every column with `enableHiding !== false` (the default). Name a column for that menu via a string `header`, or `meta: { label: '...' }` when the header is a custom render function:

```tsx
{ accessorKey: 'internalId', header: () => <code>ID</code>, meta: { label: 'Internal ID' } }
```

When composing your own toolbar via `renderToolbar`, `DataTableToolbar` always renders `DataTableViewOptions` unless you pass `showViewOptions={false}` to it.

## Usage — row selection

```tsx
<DataTable
  columns={columns}
  data={allUsers}
  enableRowSelection
  getRowId={(user) => user.id}   // strongly recommended, especially with server-side mode
/>
```

Adds a checkbox column (header checkbox selects/deselects every row on the current page, with an indeterminate state) and a selection summary in the pagination footer: "X of Y row(s) selected." in client-side mode, or "X row(s) selected." in server-side mode (the row model there only sees the current page, so the "of Y" denominator would silently undercount selections made on other pages — `getRowId` still makes the underlying selection correct across pages). `enableRowSelection` also accepts a per-row predicate: `(row) => row.original.status !== 'archived'`.

## Usage — row click

```tsx
<DataTable columns={columns} data={allUsers} onRowClick={(row) => navigate(`/users/${row.original.id}`)} />
```

Rows get a pointer cursor, become focusable, and activate on Enter. Clicks on interactive elements inside a row (buttons, links, checkboxes, selects) are ignored, so `onRowClick` composes cleanly with row selection and inline actions.

## Usage — column pinning & resizing

```tsx
<DataTable
  columns={columns}
  data={allUsers}
  enableSorting
  enableColumnPinning
  enableColumnResizing
  defaultColumnPinning={{ left: ['name'] }}
/>
```

`enableColumnPinning` adds Pin left / Pin right / Unpin to each column's header menu (the menu comes from `DataTableColumnHeader`, so pair it with `enableSorting` or manual headers); pinned columns stay sticky under horizontal scroll with a boundary border. `enableColumnResizing` adds drag handles on header edges (double-click resets). Either flag switches the table to explicit column widths from `ColumnDef.size` (TanStack default 150) — without them, columns keep natural auto-layout widths and `size` is ignored.

## Usage — expandable detail rows

```tsx
<DataTable
  columns={columns}
  data={orders}
  renderDetail={(row) => <OrderLineItems order={row.original} />}
/>
```

Adds a chevron column; expanding reveals a full-width detail panel under the row. Control externally via `expanded` / `defaultExpanded` / `onExpandedChange`.

## Usage — tree data

```tsx
type Account = { name: string; children?: Account[] }

<DataTable columns={columns} data={accounts} getSubRows={(a) => a.children} defaultExpanded={true} />
```

Hierarchies render as nested rows with depth indenting on the chevron column. Client-side mode only. `renderDetail` and `getSubRows` are mutually exclusive.

## Usage — grouping & aggregation

```tsx
const columns: ColumnDef<Invoice>[] = [
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'id', header: 'Invoice', enableGrouping: false },
  {
    accessorKey: 'amount',
    header: 'Amount',
    enableGrouping: false,
    aggregationFn: 'sum',                                   // TanStack built-in
    aggregatedCell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
]

<DataTable columns={columns} data={invoices} enableGrouping defaultGrouping={['status']} />
```

Group rows render a toggle with the group value and row count; other cells show `aggregatedCell` (fed by `aggregationFn` — `sum`, `min`, `max`, `mean`, `count`, etc.). Every groupable column's menu gains "Group by this column". Client-side mode only.

## Usage — footer totals

```tsx
{
  accessorKey: 'amount',
  header: 'Amount',
  footer: ({ table }) => {
    const total = table.getFilteredRowModel().rows.reduce((sum, r) => sum + r.original.amount, 0)
    return `$${total.toFixed(2)}`
  },
}
```

Any column with a `footer` renderer produces a `<tfoot>` row (TanStack-native `getFooterGroups`). The renderer receives the live table, so totals can follow the active filter.

## Usage — CSV export & clipboard

```tsx
<DataTable columns={columns} data={allUsers} enableCsvExport="users.csv" />
```

The Export button downloads the current view: visible (non-utility) columns, filtered + sorted rows across all pages in client mode (current page only in server mode), UTF-8 BOM for Excel. For custom toolbars use `<DataTableExportButton table={table} filename="…" />`, or the helpers directly: `tableToCsv(table)`, `exportTableToCsv(table, filename)`, `selectionToTsv(table)`, and `copySelectionAsTsv(table)` (clipboard, pasteable into spreadsheets).

## Usage — number range filter

```tsx
const columns = [{ accessorKey: 'amount', header: 'Amount', filterFn: 'inNumberRange' }]

renderToolbar={(table) => (
  <DataTableRangeFilter column={table.getColumn('amount')} title="Amount" />
)}
```

Min/max inputs backed by TanStack's built-in `inNumberRange`; placeholders show the column's actual min/max via `getFacetedMinMaxValues()` (client-side mode).

## Usage — error & loading states

```tsx
<DataTable columns={columns} data={rows} error={fetchError && 'Couldn't load. Try again.'} onRetry={refetch} />
<DataTable columns={columns} data={[]} loading loadingRows={6} />  {/* skeleton rows */}
```

`error` replaces the body (takes precedence over rows and loading); `onRetry` adds a Retry button. While `loading` with no rows, the body shows `loadingRows` skeleton rows; with rows present, the existing dim-and-disable behavior applies.

## Usage — editable cells

Pass `meta={{ updateData }}` and commit from custom cell renderers via `table.options.meta.updateData(rowIndex, columnId, value)` — TanStack's documented pattern. See the **Recipes → Editable DataTable** story for a complete click-to-edit implementation.

## Composing a fully custom table

`DataTable` is built from exported pieces you can use directly:

- **`DataTableColumnHeader`** — `{ column, title, className? }`. Sortable header cell with a menu (sort / group / pin / hide, each item appearing only when that feature is enabled); renders plain text if `!column.getCanSort()`.
- **`DataTableToolbar`** — `{ table, searchPlaceholder?, children?, className?, showViewOptions?, csvExport? }`. Search box (when `table.options.enableGlobalFilter`) + Reset + `children` + export/view options on the trailing edge.
- **`DataTableFacetedFilter`** — `{ column?, title, options: { label, value, icon? }[] }`. Popover checkbox list with facet counts; pair the column with `filterFn: dataTableFacetedFilterFn`.
- **`DataTableRangeFilter`** — `{ column?, title, step? }`. Min/max number filter; pair with `filterFn: 'inNumberRange'`.
- **`DataTableViewOptions`** — `{ table }`. Column-visibility dropdown; renders `null` if no column can be hidden.
- **`DataTablePagination`** — `{ table, pageSizeOptions?, loading? }`. Rows-per-page selector, selection summary, page status, Prev/Next.
- **`DataTableExportButton`** — `{ table, filename? }`. CSV download of the current view.
- **`dataTableFacetedFilterFn(row, columnId, filterValue)`** — filter function matching when the cell's stringified value is one of the selected values.
- **CSV/TSV helpers** — `tableToCsv`, `exportTableToCsv`, `selectionToTsv`, `copySelectionAsTsv`, plus the pure `serializeCsv` / `serializeTsv`.

Use these with your own `useReactTable()` call (not `<DataTable>`) when you need full control over the table's layout.

## Notes

- `ColumnDef` types come from `@tanstack/react-table`; import them directly from there.
- For a static styled table without pagination, use the `<Table>` primitives instead.
- `stickyHeader` sticks the header row to the top of a bounded, vertically-scrolling wrapper (adds `max-h-[32rem] overflow-y-auto` to the table's outer wrapper); override the max-height via `className` if needed.
- **Accessibility**: the outer wrapper sets `aria-busy` while `loading` is true. The "Page X of Y" indicator is a polite live region, so screen readers announce page changes (and the loading state). Prev/Next buttons have full-context `aria-label`s describing the destination page. The rows-per-page Select is labelled by the visible "Rows per page" text via `aria-labelledby`. Sortable header cells set `aria-sort` (`ascending` / `descending` / `none`); selected rows get `aria-selected` and `data-state="selected"` (which drives the existing `data-[state=selected]:bg-muted` row styling).

## Related

- [DataGrid](./data-grid.md) — virtualized sibling for 100k+ rows (no pagination, infinite scroll)
- [Table](./table.md), [Pagination](./pagination.md), [Skeleton](./skeleton.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/data-table.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-datatable--default)
