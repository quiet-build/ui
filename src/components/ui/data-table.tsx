'use client'

import * as React from 'react'
import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ExpandedState,
  type GroupingState,
  type PaginationState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Table,
  type TableMeta,
  type Updater,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ChevronsUpDown,
  Download,
  EyeOff,
  Loader2,
  MoreVertical,
  Pin,
  PinOff,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import { cn } from '#lib/utils'
import { useControllableState } from '#hooks/use-controllable-state'
import { paginationView } from '#lib/pagination-view'
import { exportTableToCsv } from '#lib/data-table-export'
import {
  Table as TablePrimitive,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table'
import { Skeleton } from '#components/ui/skeleton'
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

// CSV / clipboard helpers (see src/lib/data-table-export.ts).
export {
  exportTableToCsv,
  tableToCsv,
  selectionToTsv,
  copySelectionAsTsv,
  serializeCsv,
  serializeTsv,
} from '#lib/data-table-export'

/**
 * Sticky offsets + layering for a pinned column's cells. Only meaningful
 * when the table applies column sizing (pinning/resizing enabled), since
 * the offsets derive from column sizes.
 */
function pinnedCellStyle<TData, TValue>(
  column: Column<TData, TValue>
): React.CSSProperties | undefined {
  const pinned = column.getIsPinned()
  if (!pinned) return undefined
  return {
    position: 'sticky',
    zIndex: 1,
    left: pinned === 'left' ? column.getStart('left') : undefined,
    right: pinned === 'right' ? column.getAfter('right') : undefined,
  }
}

function pinnedCellClass<TData, TValue>(column: Column<TData, TValue>): string | undefined {
  const pinned = column.getIsPinned()
  if (!pinned) return undefined
  // Solid surface so scrolled content doesn't show through, plus a boundary
  // border on the scroll-facing edge.
  return cn(
    'bg-background',
    pinned === 'left' && column.getIsLastColumn('left') && 'border-r',
    pinned === 'right' && column.getIsFirstColumn('right') && 'border-l'
  )
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
          {column.getCanGroup() ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={column.getToggleGroupingHandler()}>
                <ChevronsUpDown />
                {column.getIsGrouped() ? 'Ungroup' : 'Group by this column'}
              </DropdownMenuItem>
            </>
          ) : null}
          {column.getCanPin() ? (
            <>
              <DropdownMenuSeparator />
              {column.getIsPinned() !== 'left' ? (
                <DropdownMenuItem onClick={() => column.pin('left')}>
                  <Pin /> Pin left
                </DropdownMenuItem>
              ) : null}
              {column.getIsPinned() !== 'right' ? (
                <DropdownMenuItem onClick={() => column.pin('right')}>
                  <Pin className="rotate-90" /> Pin right
                </DropdownMenuItem>
              ) : null}
              {column.getIsPinned() ? (
                <DropdownMenuItem onClick={() => column.pin(false)}>
                  <PinOff /> Unpin
                </DropdownMenuItem>
              ) : null}
            </>
          ) : null}
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

export interface DataTableRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title: string
  /** Increment for the number inputs. Default 1. */
  step?: number
}

/**
 * Min/max range filter for numeric columns. Pair the target column with
 * TanStack's built-in filter: `filterFn: 'inNumberRange'`. Placeholders show
 * the column's actual min/max (via `getFacetedMinMaxValues()`, client-side
 * mode only).
 */
export function DataTableRangeFilter<TData, TValue>({
  column,
  title,
  step = 1,
}: DataTableRangeFilterProps<TData, TValue>) {
  const value = (column?.getFilterValue() as [number?, number?] | undefined) ?? [
    undefined,
    undefined,
  ]
  const [min, max] = value
  const facetedRange = column?.getFacetedMinMaxValues()
  const isActive = min !== undefined || max !== undefined

  const setBound = (index: 0 | 1, raw: string) => {
    const next: [number?, number?] = [...value]
    next[index] = raw === '' ? undefined : Number(raw)
    column?.setFilterValue(next[0] === undefined && next[1] === undefined ? undefined : next)
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5 border-dashed">
            {title}
            {isActive ? (
              <>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="secondary" className="rounded-sm px-1.5 font-normal">
                  {min ?? '…'}–{max ?? '…'}
                </Badge>
              </>
            ) : null}
          </Button>
        }
      />
      <PopoverContent className="w-56" align="start">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="decimal"
            step={step}
            value={min ?? ''}
            onChange={(event) => setBound(0, event.target.value)}
            placeholder={facetedRange ? String(facetedRange[0]) : 'Min'}
            aria-label={`${title} minimum`}
            className="h-8"
          />
          <span className="text-muted-foreground text-sm">to</span>
          <Input
            type="number"
            inputMode="decimal"
            step={step}
            value={max ?? ''}
            onChange={(event) => setBound(1, event.target.value)}
            placeholder={facetedRange ? String(facetedRange[1]) : 'Max'}
            aria-label={`${title} maximum`}
            className="h-8"
          />
        </div>
        {isActive ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => column?.setFilterValue(undefined)}
          >
            Clear filter
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export interface DataTableExportButtonProps<TData> {
  table: Table<TData>
  /** Download filename. Default "export.csv". */
  filename?: string
  className?: string
}

/**
 * Downloads the table's current view (visible columns, filtered + sorted
 * rows across all pages in client mode; the current page in server mode)
 * as a UTF-8 CSV.
 */
export function DataTableExportButton<TData>({
  table,
  filename,
  className,
}: DataTableExportButtonProps<TData>) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn('gap-1.5', className)}
      onClick={() => exportTableToCsv(table, filename)}
    >
      <Download className="size-3.5" aria-hidden="true" />
      Export CSV
    </Button>
  )
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  children?: React.ReactNode
  className?: string
  /** Render {@link DataTableViewOptions} on the trailing edge. Default true. */
  showViewOptions?: boolean
  /** Render a CSV export button on the trailing edge. Pass a string to set the filename. */
  csvExport?: boolean | string
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
  csvExport = false,
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
      <div className="flex items-center gap-2">
        {csvExport ? (
          <DataTableExportButton
            table={table}
            filename={typeof csvExport === 'string' ? csvExport : undefined}
          />
        ) : null}
        {showViewOptions ? <DataTableViewOptions table={table} /> : null}
      </div>
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
  /** Uncontrolled initial sorting, e.g. `[{ id: 'date', desc: true }]`. */
  defaultSorting?: SortingState
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
  /** Uncontrolled initial column filters. */
  defaultColumnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (state: ColumnFiltersState) => void

  /** Show the "View" column-visibility dropdown in the default toolbar. Default false. */
  enableViewOptions?: boolean
  /** Controlled column visibility state. */
  columnVisibility?: VisibilityState
  /** Uncontrolled initial column visibility, e.g. `{ internalId: false }`. */
  defaultColumnVisibility?: VisibilityState
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

  /**
   * Fires when a row is clicked (or activated with Enter). Clicks on
   * interactive elements inside the row (buttons, links, checkboxes…) are
   * ignored. Adds a pointer cursor and makes rows focusable.
   */
  onRowClick?: (row: Row<TData>) => void

  /** Enable drag-to-resize column widths. Default false. Applies explicit widths to all columns. */
  enableColumnResizing?: boolean
  /**
   * Enable pin-left/pin-right actions in each column's header menu (requires
   * `enableSorting` or a manual `DataTableColumnHeader` so the menu exists).
   * Pinned columns stay sticky under horizontal scroll. Applies explicit
   * widths to all columns. Default false.
   */
  enableColumnPinning?: boolean
  /** Controlled column pinning state. */
  columnPinning?: ColumnPinningState
  /** Uncontrolled initial pinning, e.g. `{ left: ['name'] }`. */
  defaultColumnPinning?: ColumnPinningState
  onColumnPinningChange?: (state: ColumnPinningState) => void

  /**
   * Renders an expandable detail panel per row (adds a chevron column).
   * Mutually exclusive with `getSubRows`.
   */
  renderDetail?: (row: Row<TData>) => React.ReactNode
  /**
   * Tree data: returns a row's children (adds a chevron column with
   * depth indenting). Client-side mode only. Mutually exclusive with
   * `renderDetail`.
   */
  getSubRows?: (row: TData) => TData[] | undefined
  /** Controlled expanded state (for `renderDetail` / `getSubRows`). */
  expanded?: ExpandedState
  /** Uncontrolled initial expanded state, e.g. `true` to expand all. */
  defaultExpanded?: ExpandedState
  onExpandedChange?: (state: ExpandedState) => void

  /**
   * Enable row grouping (adds "Group by" to column header menus). Grouped
   * rows render a toggle with the group value and row count; other cells
   * render `aggregatedCell` / `aggregationFn` results. Client-side mode
   * only. Default false.
   */
  enableGrouping?: boolean
  /** Controlled grouping state (column ids). */
  grouping?: GroupingState
  /** Uncontrolled initial grouping, e.g. `['status']`. */
  defaultGrouping?: GroupingState
  onGroupingChange?: (state: GroupingState) => void

  /** Show a CSV export button in the default toolbar. Pass a string to set the filename. Default false. */
  enableCsvExport?: boolean | string

  /**
   * Error state: replaces the table body with the given message and an
   * optional Retry button (`onRetry`). Takes precedence over `loading`.
   */
  error?: React.ReactNode
  onRetry?: () => void
  /**
   * When `loading` is true and there are no rows yet, render this many
   * skeleton rows instead of dimming an empty table. Default 5; pass 0 to
   * disable.
   */
  loadingRows?: number

  /**
   * Passed through to TanStack as `table.options.meta` — e.g. an
   * `updateData` handler that editable cell renderers commit through.
   */
  meta?: TableMeta<TData>
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
  defaultSorting,
  onSortingChange,
  enableGlobalFilter = false,
  globalFilter: globalFilterProp,
  onGlobalFilterChange,
  searchPlaceholder,
  columnFilters: columnFiltersProp,
  defaultColumnFilters,
  onColumnFiltersChange,
  enableViewOptions = false,
  columnVisibility: columnVisibilityProp,
  defaultColumnVisibility,
  onColumnVisibilityChange,
  enableRowSelection = false,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  getRowId,
  renderToolbar,
  stickyHeader = false,
  onRowClick,
  enableColumnResizing = false,
  enableColumnPinning = false,
  columnPinning: columnPinningProp,
  defaultColumnPinning,
  onColumnPinningChange,
  renderDetail,
  getSubRows,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  enableGrouping = false,
  grouping: groupingProp,
  defaultGrouping,
  onGroupingChange,
  enableCsvExport = false,
  error,
  onRetry,
  loadingRows = 5,
  meta,
}: DataTableProps<TData, TValue>) {
  const isServerSide = pageCount !== undefined
  const enableExpanding = Boolean(renderDetail || getSubRows)

  const [pagination, setPagination] = useControllableState<PaginationState>({
    value: isServerSide ? { pageIndex: pageIndex ?? 0, pageSize } : undefined,
    defaultValue: { pageIndex: 0, pageSize },
    onChange: onPaginationChange,
  })
  const [sorting, setSorting] = useControllableState<SortingState>({
    value: sortingProp,
    defaultValue: defaultSorting ?? [],
    onChange: onSortingChange,
  })
  const [globalFilter, setGlobalFilter] = useControllableState<string | undefined>({
    value: globalFilterProp,
    defaultValue: undefined,
    onChange: onGlobalFilterChange,
  })
  const [columnFilters, setColumnFilters] = useControllableState<ColumnFiltersState>({
    value: columnFiltersProp,
    defaultValue: defaultColumnFilters ?? [],
    onChange: onColumnFiltersChange,
  })
  const [columnVisibility, setColumnVisibility] = useControllableState<VisibilityState>({
    value: columnVisibilityProp,
    defaultValue: defaultColumnVisibility ?? {},
    onChange: onColumnVisibilityChange,
  })
  const [rowSelection, setRowSelection] = useControllableState<RowSelectionState>({
    value: rowSelectionProp,
    defaultValue: {},
    onChange: onRowSelectionChange,
  })
  const [expanded, setExpanded] = useControllableState<ExpandedState>({
    value: expandedProp,
    defaultValue: defaultExpanded ?? {},
    onChange: onExpandedChange,
  })
  const [grouping, setGrouping] = useControllableState<GroupingState>({
    value: groupingProp,
    defaultValue: defaultGrouping ?? [],
    onChange: onGroupingChange,
  })
  const [columnPinning, setColumnPinning] = useControllableState<ColumnPinningState>({
    value: columnPinningProp,
    defaultValue: defaultColumnPinning ?? {},
    onChange: onColumnPinningChange,
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

    if (enableExpanding) {
      const expandColumn: ColumnDef<TData, TValue> = {
        id: 'expand',
        header: () => null,
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={row.getToggleExpandedHandler()}
              aria-expanded={row.getIsExpanded()}
              aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
              style={row.depth > 0 ? { marginLeft: row.depth * 16 } : undefined}
            >
              <ChevronRight
                className={cn('size-4 transition-transform', row.getIsExpanded() && 'rotate-90')}
                aria-hidden="true"
              />
            </Button>
          ) : row.depth > 0 ? (
            // Leaf row in a tree: keep the indent so depth stays readable.
            <span style={{ marginLeft: row.depth * 16 }} />
          ) : null,
        enableSorting: false,
        enableHiding: false,
        size: 40,
      }
      cols = [expandColumn, ...cols]
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
  }, [columns, enableSorting, enableRowSelection, enableExpanding])

  const table = useReactTable<TData>({
    data,
    columns: tableColumns,
    state: {
      pagination,
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      grouping,
      columnPinning,
    },
    onPaginationChange: (updater) => setPagination(resolveUpdater(updater, pagination)),
    onSortingChange: (updater) => setSorting(resolveUpdater(updater, sorting)),
    onGlobalFilterChange: (updater) => setGlobalFilter(resolveUpdater(updater, globalFilter)),
    onColumnFiltersChange: (updater) => setColumnFilters(resolveUpdater(updater, columnFilters)),
    onColumnVisibilityChange: (updater) =>
      setColumnVisibility(resolveUpdater(updater, columnVisibility)),
    onRowSelectionChange: (updater) => setRowSelection(resolveUpdater(updater, rowSelection)),
    onExpandedChange: (updater) => setExpanded(resolveUpdater(updater, expanded)),
    onGroupingChange: (updater) => setGrouping(resolveUpdater(updater, grouping)),
    onColumnPinningChange: (updater) => setColumnPinning(resolveUpdater(updater, columnPinning)),
    manualPagination: isServerSide,
    manualSorting: isServerSide,
    manualFiltering: isServerSide,
    manualGrouping: isServerSide,
    enableSorting,
    enableGlobalFilter,
    enableRowSelection,
    enableColumnResizing,
    columnResizeMode: 'onChange',
    // TanStack defaults these to true; gate them behind our explicit props
    // so the header-menu items only appear when opted in.
    enableColumnPinning,
    enableGrouping,
    getRowId,
    getSubRows,
    meta,
    // A detail panel makes every row expandable; tree data derives it from
    // getSubRows instead.
    getRowCanExpand: renderDetail && !getSubRows ? () => true : undefined,
    ...(enableExpanding || enableGrouping
      ? { getExpandedRowModel: getExpandedRowModel() }
      : {}),
    ...(isServerSide
      ? { pageCount }
      : {
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
          getFacetedMinMaxValues: getFacetedMinMaxValues(),
          ...(enableGrouping ? { getGroupedRowModel: getGroupedRowModel() } : {}),
        }),
    getCoreRowModel: getCoreRowModel(),
  })

  const showDefaultToolbar =
    !renderToolbar && (enableGlobalFilter || enableViewOptions || Boolean(enableCsvExport))
  // Pinned offsets and resize deltas only make sense with explicit widths.
  const applySizing = enableColumnResizing || enableColumnPinning

  // Column widths only apply when a sizing feature is on. (TanStack merges
  // a default `size: 150` into every resolved columnDef, so "did the consumer
  // set size?" is not reliably detectable — and unconditionally applying it
  // would freeze every existing table's natural auto-layout at 150px.)
  const columnWidth = (column: Column<TData, unknown>): React.CSSProperties | undefined =>
    applySizing ? { width: column.getSize() } : undefined

  const visibleColumnCount = table.getVisibleLeafColumns().length || 1
  const hasFooter = table
    .getAllLeafColumns()
    .some((column) => column.columnDef.footer !== undefined)

  const rowClickHandlers = (row: Row<TData>) =>
    onRowClick
      ? {
          onClick: (event: React.MouseEvent<HTMLTableRowElement>) => {
            const target = event.target as HTMLElement
            // Ignore clicks on interactive content inside the row.
            if (
              target.closest(
                'button, a, input, select, textarea, [role="checkbox"], [role="combobox"], [role="menu"], [role="menuitem"]'
              )
            )
              return
            onRowClick(row)
          },
          onKeyDown: (event: React.KeyboardEvent<HTMLTableRowElement>) => {
            if (event.key === 'Enter' && event.target === event.currentTarget) onRowClick(row)
          },
          tabIndex: 0,
        }
      : {}

  const renderCellContent = (row: Row<TData>, cell: ReturnType<Row<TData>['getVisibleCells']>[number]) => {
    // The grouped/aggregated/placeholder cell states are only meaningful
    // under row grouping. TanStack also reports `getIsAggregated()` for any
    // row with subRows — which tree data (`getSubRows`) produces — so gate
    // the whole branch, or tree parents would render through the default
    // `aggregatedCell` (getValue → empty for the expand/utility columns).
    if (!enableGrouping) {
      return flexRender(cell.column.columnDef.cell, cell.getContext())
    }
    if (cell.getIsGrouped()) {
      return (
        <button
          type="button"
          onClick={row.getToggleExpandedHandler()}
          aria-expanded={row.getIsExpanded()}
          className="flex items-center gap-1.5 font-medium"
        >
          <ChevronRight
            className={cn('size-4 transition-transform', row.getIsExpanded() && 'rotate-90')}
            aria-hidden="true"
          />
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
          <span className="text-muted-foreground font-normal">({row.subRows.length})</span>
        </button>
      )
    }
    if (cell.getIsAggregated()) {
      return flexRender(
        cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
        cell.getContext()
      )
    }
    if (cell.getIsPlaceholder()) return null
    return flexRender(cell.column.columnDef.cell, cell.getContext())
  }

  return (
    <div className={cn('space-y-3', className)} aria-busy={loading || undefined}>
      {renderToolbar ? (
        renderToolbar(table)
      ) : showDefaultToolbar ? (
        <DataTableToolbar
          table={table}
          searchPlaceholder={searchPlaceholder}
          showViewOptions={enableViewOptions}
          csvExport={enableCsvExport}
        />
      ) : null}

      <div
        className={cn(
          'rounded-md border',
          stickyHeader &&
            'max-h-[32rem] overflow-auto [&_[data-slot=table-container]]:overflow-visible'
        )}
      >
        <TablePrimitive
          className={cn('transition-opacity', loading && 'opacity-60')}
          style={applySizing ? { width: table.getTotalSize(), minWidth: '100%' } : undefined}
        >
          <TableHeader
            className={cn(stickyHeader && 'sticky top-0 z-10 bg-background shadow-2xs')}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      enableColumnResizing && 'relative',
                      pinnedCellClass(header.column)
                    )}
                    style={{ ...columnWidth(header.column), ...pinnedCellStyle(header.column) }}
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
                    {enableColumnResizing && header.column.getCanResize() ? (
                      <div
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Resize ${columnLabel(header.column)} column`}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onDoubleClick={() => header.column.resetSize()}
                        className={cn(
                          'absolute top-0 right-0 h-full w-1.5 cursor-col-resize touch-none select-none',
                          'bg-border opacity-0 transition-opacity hover:opacity-100',
                          header.column.getIsResizing() && 'bg-ring opacity-100'
                        )}
                      />
                    ) : null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {error !== undefined && error !== null ? (
              <TableRow>
                <TableCell colSpan={visibleColumnCount} className="py-8 text-center">
                  <div className="text-destructive text-sm">{error}</div>
                  {onRetry ? (
                    <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
                      Retry
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    // `data-state` drives the actual selected-row styling.
                    // `aria-selected` is supplementary here — it's only
                    // formally defined for grid/treegrid rows, but is
                    // harmless progressive enhancement on a plain table.
                    aria-selected={enableRowSelection ? row.getIsSelected() : undefined}
                    className={cn(onRowClick && 'cursor-pointer')}
                    {...rowClickHandlers(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={pinnedCellClass(cell.column)}
                        style={{ ...columnWidth(cell.column), ...pinnedCellStyle(cell.column) }}
                      >
                        {renderCellContent(row, cell)}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderDetail && !getSubRows && row.getIsExpanded() ? (
                    <TableRow data-slot="table-detail-row" className="hover:bg-transparent">
                      <TableCell colSpan={visibleColumnCount} className="bg-muted/30 px-4 py-3">
                        {renderDetail(row)}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              ))
            ) : loading && loadingRows > 0 ? (
              Array.from({ length: loadingRows }, (_, index) => (
                <TableRow key={index}>
                  {table.getVisibleLeafColumns().map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnCount}
                  className="text-muted-foreground py-8 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {hasFooter ? (
            <TableFooter>
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      className={pinnedCellClass(header.column)}
                      style={{ ...columnWidth(header.column), ...pinnedCellStyle(header.column) }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.footer, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          ) : null}
        </TablePrimitive>
      </div>

      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} loading={loading} />
    </div>
  )
}
