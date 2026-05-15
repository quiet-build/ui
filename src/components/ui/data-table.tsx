'use client'

import * as React from 'react'
import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'

import { cn } from '#lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table'
import { Button } from '#components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components/ui/select'

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export interface DataTableProps<TData, TValue> {
  /** Column definitions in TanStack Table format. */
  columns: ColumnDef<TData, TValue>[]
  /**
   * Row data.
   * - Client-side mode: pass the full dataset; the table paginates internally.
   * - Server-side mode: pass only the current page's rows.
   */
  data: TData[]
  /** Initial (client-side) or controlled (server-side) page size. Default 10. */
  pageSize?: number
  /** Options for the rows-per-page selector. Default [10, 25, 50, 100]. */
  pageSizeOptions?: number[]
  /** Controlled page index. Required for server-side mode. */
  pageIndex?: number
  /**
   * Total page count. **Presence of this prop flips the table into
   * server-side mode** — the parent owns pagination state and is responsible
   * for fetching the right slice of data when `onPaginationChange` fires.
   */
  pageCount?: number
  /** Fires whenever pagination state changes (page or size). */
  onPaginationChange?: (state: PaginationState) => void
  /**
   * Show a loading indicator and disable controls. For server-side mode,
   * set true while the parent is fetching the next page.
   */
  loading?: boolean
  /** Empty-state cell content. Defaults to "No results.". */
  emptyMessage?: React.ReactNode
  /** Optional class for the outer wrapper. */
  className?: string
}

/**
 * TanStack Table-powered data table with built-in Prev/Next, rows-per-page
 * selector, empty state, and loading state.
 *
 * **Two pagination modes** — the presence of `pageCount` flips the mode:
 *
 * - **Client-side (default):** pass the full dataset; the table paginates
 *   internally over the `data` array.
 * - **Server-side:** pass `pageCount` (and typically controlled `pageIndex`).
 *   The parent owns pagination state, fetches the right slice when
 *   `onPaginationChange` fires, and passes `loading` so the table dims and
 *   disables controls during the fetch.
 *
 * `columns` uses TanStack's `ColumnDef<TData>[]` type — import it from
 * `@tanstack/react-table` (a transitive dep of this package).
 *
 * @example Client-side
 * <DataTable columns={columns} data={allRows} pageSize={10} />
 *
 * @example Server-side with loading
 * const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
 * const [isLoading, setIsLoading] = useState(false)
 * const [pageRows, setPageRows] = useState<Row[]>([])
 * const [pageCount, setPageCount] = useState(0)
 *
 * async function handlePagination(next: PaginationState) {
 *   setPagination(next)
 *   setIsLoading(true)
 *   const res = await fetchPage(next.pageIndex, next.pageSize)
 *   setPageRows(res.rows)
 *   setPageCount(res.pageCount)
 *   setIsLoading(false)
 * }
 *
 * <DataTable
 *   columns={columns}
 *   data={pageRows}
 *   pageIndex={pagination.pageIndex}
 *   pageSize={pagination.pageSize}
 *   pageCount={pageCount}
 *   onPaginationChange={handlePagination}
 *   loading={isLoading}
 * />
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  pageIndex,
  pageCount,
  onPaginationChange,
  loading = false,
  emptyMessage = 'No results.',
  className,
}: DataTableProps<TData, TValue>) {
  const isServerSide = pageCount !== undefined

  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  const pagination: PaginationState = isServerSide
    ? { pageIndex: pageIndex ?? 0, pageSize }
    : internalPagination

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater
    if (!isServerSide) {
      setInternalPagination(next)
    }
    onPaginationChange?.(next)
  }

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: handlePaginationChange,
    manualPagination: isServerSide,
    ...(isServerSide
      ? { pageCount }
      : { getPaginationRowModel: getPaginationRowModel() }),
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = Math.max(table.getPageCount(), 1)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="rounded-md border">
        <Table className={cn('transition-opacity', loading && 'opacity-60')}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground py-8 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Rows per page</span>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
            disabled={loading}
          >
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-label="Loading" />
            ) : null}
            <span>
              Page {pagination.pageIndex + 1} of {totalPages}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={loading || !table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={loading || !table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
