# DataTable

TanStack Table-powered data grid with built-in pagination controls, rows-per-page selector, empty state, and loading state. Two modes: client-side (default) and server-side (presence of `pageCount` flips the mode).

## Import

```tsx
import { DataTable } from '@quietbuildlab/ui'
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
}
```

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

Set `pageCount` to flip the mode. Parent owns `pageIndex`/`pageSize`, fetches the right slice, and passes `loading` so the table dims controls during fetch.

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

## Notes

- `onPaginationChange` receives the *full* next `PaginationState` (both `pageIndex` AND `pageSize`). Handle both — the user can change either.
- `ColumnDef` types come from `@tanstack/react-table`; import them directly from there.
- For a static styled table without pagination, use the `<Table>` primitives instead.

## Related

- [Table](./table.md), [Pagination](./pagination.md), [Skeleton](./skeleton.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/data-table.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-datatable--default)
