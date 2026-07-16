'use client'

import * as React from 'react'
import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Table,
  type Updater,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EyeOff,
  Loader2,
  MoreVertical,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import { cn } from '#lib/utils'
import { useControllableState } from '#hooks/use-controllable-state'
import { paginationView } from '#lib/pagination-view'
import {
  Table as TablePrimitive,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table'
import { Button } from '#components/ui/button'
import { Badge } from '#components/ui/badge'
import { Checkbox } from '#components/ui/checkbox'
import { Input } from '#components/ui/input'
import { Separator } from '#components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu'

// Lets consumers name a column for DataTableViewOptions without needing a
// string `header`: `meta: { label: 'Amount' }`.
declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
  }
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

function resolveUpdater<T>(updater: Updater<T>, old: T): T {
  return typeof updater === 'function' ? (updater as (old: T) => T)(old) : updater
}

function columnLabel<TData, TValue>(column: Column<TData, TValue>): string {
  const meta = column.columnDef.meta
  if (meta?.label) return meta.label
  const header = column.columnDef.header
  if (typeof header === 'string') return header
  return column.id
}

/**
 * Filter function for use with {@link DataTableFacetedFilter}: matches when
 * the cell's (stringified) value is one of the selected filter values.
 * `column.getFacetedUniqueValues()` (used for the filter's per-option
 * counts) requires client-side mode (no `pageCount`).
 *
 * @example
 * { accessorKey: 'status', header: 'Status', filterFn: dataTableFacetedFilterFn }
 */
export function dataTableFacetedFilterFn<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown
): boolean {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true
  return filterValue.includes(String(row.getValue(columnId)))
}
dataTableFacetedFilterFn.autoRemove = (value: unknown) =>
  !Array.isArray(value) || value.length === 0

export interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

/**
 * Sortable column header. Clicking the label toggles sort (shift-click for
 * multi-sort, via `column.getToggleSortingHandler()`); the caret opens a
 * menu with explicit Asc / Desc / Hide actions. Renders plain text if the
 * column isn't sortable.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn('text-sm font-medium', className)}>{title}</div>
  }

  const sorted = column.getIsSorted()
  const SortIcon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ChevronsUpDown

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          '-ml-2.5 h-8 gap-1.5 px-2 font-medium text-muted-foreground hover:text-foreground',
          sorted && 'text-foreground'
        )}
        onClick={column.getToggleSortingHandler()}
      >
        {title}
        <SortIcon className="size-3.5" aria-hidden="true" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground"
              aria-label={`${title} column menu`}
            >
              <MoreVertical className="size-3.5" aria-hidden="true" />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp /> Sort ascending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown /> Sort descending
          </DropdownMenuItem>
          {column.getCanHide() ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff /> Hide column
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  className?: string
}

/** Dropdown to toggle visibility of any column with `enableHiding` (default). */
export function DataTableViewOptions<TData>({
  table,
  className,
}: DataTableViewOptionsProps<TData>) {
  const hideableColumns = table.getAllColumns().filter((column) => column.getCanHide())
  if (hideableColumns.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className={cn('gap-1.5', className)}>
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            View
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        {hideableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(value)}
          >
            {columnLabel(column)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface DataTableFacetedFilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title: string
  options: DataTableFacetedFilterOption[]
}

/**
 * Popover checkbox-list filter for enum-ish columns, with per-option counts
 * from `column.getFacetedUniqueValues()` (client-side mode only). Pair the
 * target column with `filterFn: dataTableFacetedFilterFn`.
 */
export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set((column?.getFilterValue() as string[] | undefined) ?? [])
  const facets = column?.getFacetedUniqueValues()

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5 border-dashed">
            {title}
            {selectedValues.size > 0 ? (
              <>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="secondary" className="rounded-sm px-1.5 font-normal">
                  {selectedValues.size}
                </Badge>
              </>
            ) : null}
          </Button>
        }
      />
      <PopoverContent className="w-56 p-0" align="start">
        <div className="max-h-64 overflow-y-auto p-1">
          {options.map((option) => {
            const isSelected = selectedValues.has(option.value)
            const count = facets?.get(option.value)
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    const next = new Set(selectedValues)
                    if (checked) next.add(option.value)
                    else next.delete(option.value)
                    column?.setFilterValue(next.size ? Array.from(next) : undefined)
                  }}
                />
                {option.icon ? <option.icon className="size-4 text-muted-foreground" /> : null}
                <span className="flex-1">{option.label}</span>
                {count !== undefined ? (
                  <span className="text-xs text-muted-foreground tabular-nums"> ({count})</span>
                ) : null}
              </label>
            )
          })}
        </div>
        {selectedValues.size > 0 ? (
          <>
            <Separator />
            <div className="p-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                onClick={() => column?.setFilterValue(undefined)}
              >
                Clear filter
              </Button>
            </div>
          </>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  children?: React.ReactNode
  className?: string
  /** Render {@link DataTableViewOptions} on the trailing edge. Default true. */
  showViewOptions?: boolean
}

/**
 * Default toolbar: debounced global search (when `enableGlobalFilter` is on)
 * + a "Reset" button (when any filter is active) + `children` (typically
 * {@link DataTableFacetedFilter}s) on the left, {@link DataTableViewOptions}
 * on the right (unless `showViewOptions` is false).
 */
export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Search…',
  children,
  className,
  showViewOptions = true,
}: DataTableToolbarProps<TData>) {
  const showSearch = table.options.enableGlobalFilter === true
  const globalFilter = (table.getState().globalFilter as string | undefined) ?? ''
  const [searchValue, setSearchValue] = React.useState(globalFilter)

  // Reflect external changes to globalFilter (e.g. a "Reset" click) in the input.
  React.useEffect(() => {
    setSearchValue(globalFilter)
  }, [globalFilter])

  // Debounce outgoing changes so typing doesn't refilter on every keystroke.
  React.useEffect(() => {
    if (searchValue === globalFilter) return
    const handle = setTimeout(() => {
      table.setGlobalFilter(searchValue || undefined)
    }, 300)
    return () => clearTimeout(handle)
    // Re-runs only when the local input value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  const isFiltered = table.getState().columnFilters.length > 0 || Boolean(globalFilter)

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-2', className)}>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {showSearch ? (
          <div className="relative w-full max-w-56">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-8 pl-8"
            />
          </div>
        ) : null}
        {children}
        {isFiltered ? (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter(undefined)
            }}
          >
            Reset
            <X className="size-3.5" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
      {showViewOptions ? <DataTableViewOptions table={table} /> : null}
    </div>
  )
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
  loading?: boolean
  className?: string
}

/** Rows-per-page selector, "X of Y row(s) selected", page status, and Prev/Next. */
export function DataTablePagination<TData>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  loading = false,
  className,
}: DataTablePaginationProps<TData>) {
  const rowsPerPageId = React.useId()
  const { currentPage, totalPages, prevLabel, nextLabel } = paginationView({
    pageIndex: table.getState().pagination.pageIndex,
    pageCount: table.getPageCount(),
  })
  const showSelectionSummary = Boolean(table.options.enableRowSelection)
  // In server-side mode, getFilteredRowModel()/getFilteredSelectedRowModel()
  // only see the current page's data — they'd silently undercount selections
  // made on other pages. Count directly from state instead, and drop the
  // unknowable "of Y" denominator (getRowId makes selection itself correct
  // across pages; it's only this summary's row model that can't see beyond
  // the current page).
  const isServerSide = table.options.manualPagination
  const selectedCount = isServerSide
    ? Object.values(table.getState().rowSelection).filter(Boolean).length
    : table.getFilteredSelectedRowModel().rows.length

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <div className="min-w-0 flex-1 text-sm text-muted-foreground">
        {showSelectionSummary
          ? isServerSide
            ? `${selectedCount} row(s) selected.`
            : `${selectedCount} of ${table.getFilteredRowModel().rows.length} row(s) selected.`
          : null}
      </div>

      <div className="flex items-center gap-2">
        <span id={rowsPerPageId} className="text-muted-foreground text-sm">
          Rows per page
        </span>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
          disabled={loading}
        >
          <SelectTrigger className="h-8 w-[80px]" aria-labelledby={rowsPerPageId}>
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : null}
          {/* aria-live announces page changes; aria-atomic ensures the whole
              "Page X of Y / Loading" message is re-read on update. */}
          <span role="status" aria-live="polite" aria-atomic="true">
            {loading ? 'Loading, ' : ''}
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={loading || !table.getCanPreviousPage()}
            aria-label={prevLabel}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={loading || !table.getCanNextPage()}
            aria-label={nextLabel}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

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
   * In server-side mode, sorting and column filters are also manual: the
   * table never sorts/filters locally, it only fires `onSortingChange` /
   * `onColumnFiltersChange` / `onGlobalFilterChange`.
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

  /** Enable column sorting. Default false. Per-column opt-out via `ColumnDef.enableSorting`. */
  enableSorting?: boolean
  /** Controlled sorting state. */
  sorting?: SortingState
  onSortingChange?: (state: SortingState) => void

  /** Enable the built-in global search box in the default toolbar. Default false. */
  enableGlobalFilter?: boolean
  /** Controlled global filter value. */
  globalFilter?: string
  onGlobalFilterChange?: (value: string | undefined) => void
  /** Placeholder for the built-in search input. Default "Search…". */
  searchPlaceholder?: string

  /** Controlled column filters state (drive with `DataTableFacetedFilter` or your own inputs). */
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (state: ColumnFiltersState) => void

  /** Show the "View" column-visibility dropdown in the default toolbar. Default false. */
  enableViewOptions?: boolean
  /** Controlled column visibility state. */
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (state: VisibilityState) => void

  /** Enable row selection (adds a checkbox column). Default false. */
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  /** Controlled row-selection state, keyed by row id (see `getRowId`). */
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (state: RowSelectionState) => void
  /**
   * Row id resolver. Strongly recommended whenever `enableRowSelection` is
   * used with server-side mode, so selection survives page changes.
   */
  getRowId?: (row: TData, index: number) => string

  /**
   * Replaces the default toolbar (search + view options) with a custom one.
   * Receives the live `table` instance so you can compose
   * `DataTableToolbar` with `DataTableFacetedFilter` / your own controls.
   */
  renderToolbar?: (table: Table<TData>) => React.ReactNode

  /** Stick the header row to the top of a scrollable (max-height) wrapper. Default false. */
  stickyHeader?: boolean
}

/**
 * TanStack Table-powered data table with built-in pagination, sorting,
 * filtering, column visibility, and row selection.
 *
 * **Two pagination modes** — the presence of `pageCount` flips the mode:
 *
 * - **Client-side (default):** pass the full dataset; the table paginates,
 *   sorts, and filters internally.
 * - **Server-side:** pass `pageCount` (and typically controlled `pageIndex`).
 *   The parent owns pagination/sorting/filtering state, fetches the right
 *   slice on any `on*Change` callback, and passes `loading` so the table
 *   dims and disables controls during the fetch.
 *
 * `columns` uses TanStack's `ColumnDef<TData>[]` type — import it from
 * `@tanstack/react-table` (a transitive dep of this package). Also exports
 * the building blocks (`DataTableColumnHeader`, `DataTableToolbar`,
 * `DataTableFacetedFilter`, `DataTableViewOptions`, `DataTablePagination`)
 * for composing a fully custom table.
 *
 * @example Client-side
 * <DataTable columns={columns} data={allRows} pageSize={10} />
 *
 * @example With sorting, search, and row selection
 * <DataTable
 *   columns={columns}
 *   data={allRows}
 *   enableSorting
 *   enableGlobalFilter
 *   enableRowSelection
 *   getRowId={(row) => row.id}
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
  enableSorting = false,
  sorting: sortingProp,
  onSortingChange,
  enableGlobalFilter = false,
  globalFilter: globalFilterProp,
  onGlobalFilterChange,
  searchPlaceholder,
  columnFilters: columnFiltersProp,
  onColumnFiltersChange,
  enableViewOptions = false,
  columnVisibility: columnVisibilityProp,
  onColumnVisibilityChange,
  enableRowSelection = false,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  getRowId,
  renderToolbar,
  stickyHeader = false,
}: DataTableProps<TData, TValue>) {
  const isServerSide = pageCount !== undefined

  const [pagination, setPagination] = useControllableState<PaginationState>({
    value: isServerSide ? { pageIndex: pageIndex ?? 0, pageSize } : undefined,
    defaultValue: { pageIndex: 0, pageSize },
    onChange: onPaginationChange,
  })
  const [sorting, setSorting] = useControllableState<SortingState>({
    value: sortingProp,
    defaultValue: [],
    onChange: onSortingChange,
  })
  const [globalFilter, setGlobalFilter] = useControllableState<string | undefined>({
    value: globalFilterProp,
    defaultValue: undefined,
    onChange: onGlobalFilterChange,
  })
  const [columnFilters, setColumnFilters] = useControllableState<ColumnFiltersState>({
    value: columnFiltersProp,
    defaultValue: [],
    onChange: onColumnFiltersChange,
  })
  const [columnVisibility, setColumnVisibility] = useControllableState<VisibilityState>({
    value: columnVisibilityProp,
    defaultValue: {},
    onChange: onColumnVisibilityChange,
  })
  const [rowSelection, setRowSelection] = useControllableState<RowSelectionState>({
    value: rowSelectionProp,
    defaultValue: {},
    onChange: onRowSelectionChange,
  })

  const tableColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    // When sorting is on, give plain string headers the sortable
    // DataTableColumnHeader treatment for free. A column with its own
    // function `header` is left untouched (that's the opt-out).
    let cols = columns
    if (enableSorting) {
      cols = cols.map((col) => {
        if (typeof col.header !== 'string') return col
        const title = col.header
        return {
          ...col,
          // Preserve the original label for DataTableViewOptions — once
          // `header` becomes a function, columnLabel() can no longer read
          // it directly from columnDef.header.
          meta: { ...col.meta, label: col.meta?.label ?? title },
          header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
        } as ColumnDef<TData, TValue>
      })
    }

    if (enableRowSelection) {
      const selectionColumn: ColumnDef<TData, TValue> = {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
            aria-label="Select all rows on this page"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value)}
            disabled={!row.getCanSelect()}
            aria-label={`Select row ${row.index + 1}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      }
      cols = [selectionColumn, ...cols]
    }

    return cols
  }, [columns, enableSorting, enableRowSelection])

  const table = useReactTable<TData>({
    data,
    columns: tableColumns,
    state: { pagination, sorting, globalFilter, columnFilters, columnVisibility, rowSelection },
    onPaginationChange: (updater) => setPagination(resolveUpdater(updater, pagination)),
    onSortingChange: (updater) => setSorting(resolveUpdater(updater, sorting)),
    onGlobalFilterChange: (updater) => setGlobalFilter(resolveUpdater(updater, globalFilter)),
    onColumnFiltersChange: (updater) => setColumnFilters(resolveUpdater(updater, columnFilters)),
    onColumnVisibilityChange: (updater) =>
      setColumnVisibility(resolveUpdater(updater, columnVisibility)),
    onRowSelectionChange: (updater) => setRowSelection(resolveUpdater(updater, rowSelection)),
    manualPagination: isServerSide,
    manualSorting: isServerSide,
    manualFiltering: isServerSide,
    enableSorting,
    enableGlobalFilter,
    enableRowSelection,
    getRowId,
    ...(isServerSide
      ? { pageCount }
      : {
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
        }),
    getCoreRowModel: getCoreRowModel(),
  })

  const showDefaultToolbar = !renderToolbar && (enableGlobalFilter || enableViewOptions)

  return (
    <div className={cn('space-y-3', className)} aria-busy={loading || undefined}>
      {renderToolbar ? (
        renderToolbar(table)
      ) : showDefaultToolbar ? (
        <DataTableToolbar
          table={table}
          searchPlaceholder={searchPlaceholder}
          showViewOptions={enableViewOptions}
        />
      ) : null}

      <div
        className={cn(
          'rounded-md border',
          stickyHeader &&
            'max-h-[32rem] overflow-auto [&_[data-slot=table-container]]:overflow-visible'
        )}
      >
        <TablePrimitive className={cn('transition-opacity', loading && 'opacity-60')}>
          <TableHeader
            className={cn(stickyHeader && 'sticky top-0 z-10 bg-card shadow-2xs')}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
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
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  // `data-state` drives the actual selected-row styling.
                  // `aria-selected` is supplementary here — it's only
                  // formally defined for grid/treegrid rows, but is
                  // harmless progressive enhancement on a plain table.
                  aria-selected={enableRowSelection ? row.getIsSelected() : undefined}
                >
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
                  colSpan={tableColumns.length}
                  className="text-muted-foreground py-8 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TablePrimitive>
      </div>

      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} loading={loading} />
    </div>
  )
}
