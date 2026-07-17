'use client'

import * as React from 'react'
import {
  type ColumnDef,
  type Row,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Loader2 } from 'lucide-react'

import { cn } from '#lib/utils'
import { useControllableState } from '#hooks/use-controllable-state'
import { DataTableColumnHeader, DataTableToolbar } from '#components/ui/data-table'

export interface DataGridProps<TData, TValue> {
  /** Column definitions in TanStack Table format. Column `size` drives cell widths (default 150). */
  columns: ColumnDef<TData, TValue>[]
  /** Full client-side dataset. The grid virtualizes rendering, not data. */
  data: TData[]
  /** Scroll viewport height. Default '32rem'. */
  height?: number | string
  /** Estimated row height in px for the virtualizer. Default 40. */
  estimateRowHeight?: number
  /** Rows rendered beyond the visible window. Default 5. */
  overscan?: number
  /** Enable column sorting (plain string headers auto-wrap, same as DataTable). Default false. */
  enableSorting?: boolean
  /** Uncontrolled initial sorting. */
  defaultSorting?: SortingState
  /** Show the debounced search box (via DataTableToolbar). Default false. */
  enableGlobalFilter?: boolean
  searchPlaceholder?: string
  /** Replaces the default toolbar. */
  renderToolbar?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode
  /**
   * Infinite scroll: called when the user scrolls near the end of the
   * loaded rows and `hasMore` is true. Append the next chunk to `data`.
   */
  onReachEnd?: () => void
  /** Whether more rows can be loaded via `onReachEnd`. Default false. */
  hasMore?: boolean
  /** Shows a loading row at the bottom and pauses `onReachEnd`. */
  loading?: boolean
  emptyMessage?: React.ReactNode
  getRowId?: (row: TData, index: number) => string
  /** Same contract as DataTable's `onRowClick`. */
  onRowClick?: (row: Row<TData>) => void
  className?: string
}

/**
 * Virtualized sibling of `DataTable` for large datasets (100k+ rows):
 * renders only the visible window via `@tanstack/react-virtual`, with the
 * same column API, sortable headers, and toolbar pieces. No pagination —
 * one continuous scroll (optionally infinite via `onReachEnd`).
 *
 * Client-side only. For paginated/server-side data, use `DataTable`.
 *
 * @example
 * <DataGrid columns={columns} data={rows100k} height={480} enableSorting />
 */
export function DataGrid<TData, TValue>({
  columns,
  data,
  height = '32rem',
  estimateRowHeight = 40,
  overscan = 5,
  enableSorting = false,
  defaultSorting,
  enableGlobalFilter = false,
  searchPlaceholder,
  renderToolbar,
  onReachEnd,
  hasMore = false,
  loading = false,
  emptyMessage = 'No results.',
  getRowId,
  onRowClick,
  className,
}: DataGridProps<TData, TValue>) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const [sorting, setSorting] = useControllableState<SortingState>({
    value: undefined,
    defaultValue: defaultSorting ?? [],
  })
  const [globalFilter, setGlobalFilter] = React.useState<string | undefined>(undefined)

  const tableColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!enableSorting) return columns
    // Same auto-wrap as DataTable: plain string headers become sortable
    // DataTableColumnHeaders; function headers are the opt-out.
    return columns.map((col) => {
      if (typeof col.header !== 'string') return col
      const title = col.header
      return {
        ...col,
        meta: { ...col.meta, label: col.meta?.label ?? title },
        header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
      } as ColumnDef<TData, TValue>
    })
  }, [columns, enableSorting])

  const table = useReactTable<TData>({
    data,
    columns: tableColumns,
    state: { sorting, globalFilter },
    onSortingChange: (updater) =>
      setSorting(typeof updater === 'function' ? updater(sorting) : updater),
    onGlobalFilterChange: (updater) =>
      setGlobalFilter(typeof updater === 'function' ? updater(globalFilter) : updater),
    enableSorting,
    enableGlobalFilter,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan,
    // Dynamic row measurement; skipped on Firefox, which measures border
    // heights incorrectly (per TanStack's own virtualized-table guidance).
    measureElement:
      typeof window !== 'undefined' && !navigator.userAgent.includes('Firefox')
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  })

  const virtualItems = virtualizer.getVirtualItems()

  // Infinite scroll: fire once per data length when the last rendered row
  // is within `overscan` of the end.
  const lastFiredForCount = React.useRef(-1)
  React.useEffect(() => {
    if (!onReachEnd || !hasMore || loading || rows.length === 0) return
    const last = virtualItems[virtualItems.length - 1]
    if (!last) return
    if (last.index >= rows.length - 1 - overscan && lastFiredForCount.current !== rows.length) {
      lastFiredForCount.current = rows.length
      onReachEnd()
    }
  }, [virtualItems, rows.length, hasMore, loading, onReachEnd, overscan])

  const showDefaultToolbar = !renderToolbar && enableGlobalFilter

  const rowClickHandlers = (row: Row<TData>) =>
    onRowClick
      ? {
          onClick: (event: React.MouseEvent<HTMLTableRowElement>) => {
            const target = event.target as HTMLElement
            if (target.closest('button, a, input, select, [role="checkbox"], [role="menu"]'))
              return
            onRowClick(row)
          },
          onKeyDown: (event: React.KeyboardEvent<HTMLTableRowElement>) => {
            if (event.key === 'Enter' && event.target === event.currentTarget) onRowClick(row)
          },
          tabIndex: 0,
        }
      : {}

  return (
    <div className={cn('space-y-3', className)} aria-busy={loading || undefined}>
      {renderToolbar ? (
        renderToolbar(table)
      ) : showDefaultToolbar ? (
        <DataTableToolbar
          table={table}
          searchPlaceholder={searchPlaceholder}
          showViewOptions={false}
        />
      ) : null}

      <div
        ref={scrollRef}
        className="relative overflow-auto rounded-md border"
        style={{ height }}
      >
        {/* display:grid layout is required for absolutely-positioned
            virtual rows with dynamic heights (TanStack virtualizer docs). */}
        <table className="grid w-full caption-bottom text-sm">
          <thead className="bg-background sticky top-0 z-10 grid border-b shadow-2xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="flex h-10 items-center px-2 text-left font-medium whitespace-nowrap text-foreground"
                    aria-sort={
                      header.column.getCanSort()
                        ? header.column.getIsSorted() === 'asc'
                          ? 'ascending'
                          : header.column.getIsSorted() === 'desc'
                            ? 'descending'
                            : 'none'
                        : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            className="relative grid"
            style={{ height: rows.length > 0 ? virtualizer.getTotalSize() : undefined }}
          >
            {rows.length === 0 ? (
              <tr className="flex">
                <td className="text-muted-foreground w-full py-8 text-center">
                  {loading ? (
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" aria-label="Loading" />
                  ) : (
                    emptyMessage
                  )}
                </td>
              </tr>
            ) : (
              virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={(node) => virtualizer.measureElement(node)}
                    className={cn(
                      'absolute flex w-full border-b transition-colors hover:bg-muted/50',
                      onRowClick && 'cursor-pointer'
                    )}
                    style={{ transform: `translateY(${virtualRow.start}px)` }}
                    {...rowClickHandlers(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className="flex items-center overflow-hidden p-2 whitespace-nowrap"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        {loading && rows.length > 0 ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 border-t py-2 text-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            <span role="status">Loading more…</span>
          </div>
        ) : null}
      </div>

      <div className="text-muted-foreground text-sm" role="status" aria-live="polite">
        {rows.length.toLocaleString()} row(s)
        {hasMore ? ' — scroll to load more' : ''}
      </div>
    </div>
  )
}
