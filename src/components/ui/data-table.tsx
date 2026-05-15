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

export interface DataTableProps<TData, TValue> {
  /** Column definitions in TanStack Table format. */
  columns: ColumnDef<TData, TValue>[]
  /**
   * Row data.
   * - Client-side mode: pass the full dataset; the table paginates internally.
   * - Server-side mode: pass only the current page's rows.
   */
  data: TData[]
  /** Rows per page. Defaults to 10. */
  pageSize?: number
  /**
   * Controlled current page index (0-based). Pass alongside `pageCount` and
   * `onPaginationChange` for server-side pagination.
   */
  pageIndex?: number
  /**
   * Total page count. **Presence of this prop flips the table into
   * server-side mode** — the parent is responsible for fetching the right
   * slice of data when `onPaginationChange` fires.
   */
  pageCount?: number
  /** Fires whenever the user navigates pages (or page size changes). */
  onPaginationChange?: (state: PaginationState) => void
  /** Empty-state cell content. Defaults to "No results.". */
  emptyMessage?: React.ReactNode
  /** Optional class for the outer wrapper. */
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  pageIndex,
  pageCount,
  onPaginationChange,
  emptyMessage = 'No results.',
  className,
}: DataTableProps<TData, TValue>) {
  const isServerSide = pageCount !== undefined
  const isControlled = pageIndex !== undefined

  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  const pagination: PaginationState = isControlled
    ? { pageIndex, pageSize }
    : internalPagination

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater
    if (!isControlled) {
      setInternalPagination(next)
    }
    onPaginationChange?.(next)
  }

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: handlePaginationChange,
    ...(isServerSide ? { pageCount, manualPagination: true } : { getPaginationRowModel: getPaginationRowModel() }),
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = Math.max(table.getPageCount(), 1)

  return (
    <div className={cn('space-y-3', className)}>
      <div className="rounded-md border">
        <Table>
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

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
