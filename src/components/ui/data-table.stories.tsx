import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { expect, userEvent, within } from 'storybook/test'
import {
  DataTable,
  DataTableColumnHeader,
  DataTableFacetedFilter,
  DataTableRangeFilter,
  DataTableToolbar,
  dataTableFacetedFilterFn,
} from './data-table'

type Invoice = { id: string; status: 'Paid' | 'Pending' | 'Unpaid'; amount: number }

const ROWS: Invoice[] = Array.from({ length: 47 }, (_, i) => ({
  id: `INV-${String(i + 1).padStart(3, '0')}`,
  status: (['Paid', 'Pending', 'Unpaid'] as const)[i % 3],
  amount: Math.round((i + 1) * 32.5 * 100) / 100,
}))

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'status', header: 'Status', filterFn: dataTableFacetedFilterFn },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => <div className="text-right">${row.original.amount.toFixed(2)}</div>,
    // Custom `header` render functions bypass the string-header auto-wrap,
    // so name the column explicitly for DataTableViewOptions.
    meta: { label: 'Amount' },
  },
]

const STATUS_OPTIONS = [
  { label: 'Paid', value: 'Paid' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Unpaid', value: 'Unpaid' },
]

const meta: Meta<typeof DataTable<Invoice, unknown>> = {
  title: 'UI/DataTable',
  component: DataTable<Invoice, unknown>,
  tags: ['autodocs', 'ai-generated'],
}
export default meta
type Story = StoryObj<typeof DataTable<Invoice, unknown>>

export const ClientSide: Story = {
  render: () => (
    <div className="w-[600px]">
      <DataTable columns={columns} data={ROWS} pageSize={10} />
    </div>
  ),
  play: async ({ canvasElement, userEvent: ue }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/Page 1 of 5/)).toBeVisible()
    await ue.click(canvas.getByRole('button', { name: /next/i }))
    await expect(canvas.getByText(/Page 2 of 5/)).toBeVisible()
  },
}

export const Empty: Story = {
  render: () => (
    <div className="w-[600px]">
      <DataTable columns={columns} data={[]} emptyMessage="No invoices yet." />
    </div>
  ),
}

function ServerSideExample() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [isLoading, setIsLoading] = useState(false)
  const [pageRows, setPageRows] = useState<Invoice[]>(() => ROWS.slice(0, 10))

  const pageCount = Math.ceil(ROWS.length / pagination.pageSize)

  const handlePaginationChange = (next: PaginationState) => {
    setPagination(next)
    setIsLoading(true)
    // Simulate a server fetch.
    setTimeout(() => {
      const start = next.pageIndex * next.pageSize
      setPageRows(ROWS.slice(start, start + next.pageSize))
      setIsLoading(false)
    }, 700)
  }

  return (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        Server-side mode: parent owns pagination state, simulates a 700ms fetch on every change,
        and passes <code>loading</code> so the table dims and disables controls during the fetch.
      </p>
      <DataTable
        columns={columns}
        data={pageRows}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        pageCount={pageCount}
        onPaginationChange={handlePaginationChange}
        loading={isLoading}
      />
    </div>
  )
}

export const ServerSide: Story = {
  render: () => <ServerSideExample />,
}

export const Loading: Story = {
  render: () => (
    <div className="w-[600px]">
      <DataTable
        columns={columns}
        data={ROWS.slice(0, 10)}
        pageIndex={0}
        pageCount={5}
        pageSize={10}
        loading
      />
    </div>
  ),
}

export const StickyHeader: Story = {
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        All {ROWS.length} rows on one page, in a max-height scroll wrapper — scroll within the
        table and the header row stays pinned to the top.
      </p>
      <DataTable columns={columns} data={ROWS} pageSize={ROWS.length} stickyHeader />
    </div>
  ),
}

export const Sorting: Story = {
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>enableSorting</code> auto-wraps every plain-string column header with a sortable{' '}
        <code>DataTableColumnHeader</code>. Click a header to toggle asc/desc; hold Shift and
        click a second header to add it to a multi-column sort (
        <code>column.getToggleSortingHandler()</code> handles this natively). The caret menu also
        offers explicit Asc / Desc / Hide actions.
      </p>
      <DataTable columns={columns} data={ROWS} pageSize={10} enableSorting />
    </div>
  ),
  play: async ({ canvasElement, userEvent: ue }) => {
    const canvas = within(canvasElement)
    const header = canvas.getByRole('button', { name: 'Invoice' })
    await ue.click(header)
    await expect(canvas.getAllByRole('columnheader')[0]).toHaveAttribute('aria-sort', 'ascending')
    await ue.click(header)
    await expect(canvas.getAllByRole('columnheader')[0]).toHaveAttribute('aria-sort', 'descending')
  },
}

export const SearchFilterAndViewOptions: Story = {
  name: 'Search, faceted filter & view options',
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        The three toolbar pieces composed together via <code>renderToolbar</code>: a debounced
        search box (<code>enableGlobalFilter</code>), a <code>DataTableFacetedFilter</code> for
        Status (wired to <code>dataTableFacetedFilterFn</code> on the column), and{' '}
        <code>DataTableViewOptions</code> (rendered automatically by{' '}
        <code>DataTableToolbar</code>). See <strong>Faceted filter only</strong> and{' '}
        <strong>Column visibility only</strong> for each piece in isolation.
      </p>
      <DataTable
        columns={columns}
        data={ROWS}
        pageSize={10}
        enableGlobalFilter
        searchPlaceholder="Search invoices…"
        renderToolbar={(table) => (
          <DataTableToolbar table={table} searchPlaceholder="Search invoices…">
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title="Status"
              options={STATUS_OPTIONS}
            />
          </DataTableToolbar>
        )}
      />
    </div>
  ),
}

export const ColumnFiltersOnly: Story = {
  name: 'Faceted filter only',
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>DataTableFacetedFilter</code> composed alone via <code>renderToolbar</code> — no
        search box or view options required. Per-option counts come from{' '}
        <code>column.getFacetedUniqueValues()</code>, which needs client-side mode (no{' '}
        <code>pageCount</code>).
      </p>
      <DataTable
        columns={columns}
        data={ROWS}
        pageSize={10}
        renderToolbar={(table) => (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={STATUS_OPTIONS}
          />
        )}
      />
    </div>
  ),
}

export const ViewOptionsOnly: Story = {
  name: 'Column visibility only',
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>enableViewOptions</code> shows the "View" dropdown on its own — it's independent of{' '}
        <code>enableGlobalFilter</code>. The "Amount" column has a custom function{' '}
        <code>header</code>, so it's named for this menu via <code>meta: {'{'} label: 'Amount' {'}'}</code>.
      </p>
      <DataTable columns={columns} data={ROWS} pageSize={10} enableViewOptions />
    </div>
  ),
}

export const RowSelection: Story = {
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>enableRowSelection</code> adds a checkbox column with an indeterminate select-all
        state and a "X of Y row(s) selected." summary. <code>getRowId</code> keys the selection so
        it's stable if rows re-sort or the data changes.
      </p>
      <DataTable
        columns={columns}
        data={ROWS.slice(0, 10)}
        pageSize={10}
        enableRowSelection
        getRowId={(row) => row.id}
      />
    </div>
  ),
  play: async ({ canvasElement, userEvent: ue }) => {
    const canvas = within(canvasElement)
    await ue.click(canvas.getByRole('checkbox', { name: /select all rows/i }))
    await expect(canvas.getByText('10 of 10 row(s) selected.')).toBeVisible()
  },
}

export const RowSelectionWithPredicate: Story = {
  name: 'Row selection — per-row predicate',
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>enableRowSelection</code> also accepts <code>(row) =&gt; boolean</code> — here,
        "Unpaid" rows can't be selected (their checkbox is disabled and excluded from
        select-all).
      </p>
      <DataTable
        columns={columns}
        data={ROWS.slice(0, 10)}
        pageSize={10}
        enableRowSelection={(row) => row.original.status !== 'Unpaid'}
        getRowId={(row) => row.id}
      />
    </div>
  ),
}

const customColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice #" />,
  },
  { accessorKey: 'status', header: 'Status', filterFn: dataTableFacetedFilterFn },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => <div className="text-right">${row.original.amount.toFixed(2)}</div>,
    meta: { label: 'Amount' },
  },
]

export const CustomComposition: Story = {
  name: 'Custom composition (building blocks)',
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        Full manual control, without <code>DataTable</code>'s auto-wrap or default toolbar: the
        "Invoice #" column renders <code>DataTableColumnHeader</code> directly with a custom
        title, and <code>renderToolbar</code> returns hand-rolled markup (not{' '}
        <code>DataTableToolbar</code>) mixing a plain count label with{' '}
        <code>DataTableFacetedFilter</code>.
      </p>
      <DataTable
        columns={customColumns}
        data={ROWS}
        pageSize={10}
        enableSorting
        renderToolbar={(table) => (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{ROWS.length} invoices</span>
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title="Status"
              options={STATUS_OPTIONS}
            />
          </div>
        )}
      />
    </div>
  ),
}

export const KitchenSink: Story = {
  render: () => (
    <div className="w-[700px]">
      <p className="text-muted-foreground mb-3 text-sm">
        Every Phase 1 feature at once: sorting, search, faceted filter, view options, and row
        selection.
      </p>
      <DataTable
        columns={columns}
        data={ROWS}
        pageSize={10}
        enableSorting
        enableGlobalFilter
        enableRowSelection
        getRowId={(row) => row.id}
        renderToolbar={(table) => (
          <DataTableToolbar table={table} searchPlaceholder="Search invoices…">
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title="Status"
              options={STATUS_OPTIONS}
            />
          </DataTableToolbar>
        )}
      />
    </div>
  ),
}

export const DefaultSortingStory: Story = {
  name: 'Default sorting (uncontrolled)',
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>defaultSorting</code> seeds the initial sort (Amount, descending) without making the
        state controlled — users can still re-sort freely.
      </p>
      <DataTable
        columns={columns}
        data={ROWS}
        pageSize={10}
        enableSorting
        defaultSorting={[{ id: 'amount', desc: true }]}
      />
    </div>
  ),
}

export const ClickableRows: Story = {
  render: function ClickableRowsExample() {
    const [lastClicked, setLastClicked] = useState<string | null>(null)
    return (
      <div className="w-[600px]">
        <p className="text-muted-foreground mb-3 text-sm">
          <code>onRowClick</code> makes rows clickable (pointer cursor, Enter-activatable when
          focused). Clicks on interactive elements inside a row — like the selection checkbox —
          are ignored.
        </p>
        <p className="mb-3 text-sm font-medium" role="status">
          {lastClicked ? `Last clicked: ${lastClicked}` : 'Click a row…'}
        </p>
        <DataTable
          columns={columns}
          data={ROWS.slice(0, 10)}
          pageSize={10}
          enableRowSelection
          getRowId={(row) => row.id}
          onRowClick={(row) => setLastClicked(row.original.id)}
        />
      </div>
    )
  },
}

export const PinningAndResizing: Story = {
  name: 'Column pinning & resizing',
  render: () => (
    <div className="w-[560px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>enableColumnPinning</code> adds Pin left/right to each column menu (Invoice starts
        pinned left); <code>enableColumnResizing</code> adds drag handles between columns
        (double-click a handle to reset). Both apply explicit column widths, so the table can
        overflow horizontally — scroll sideways and the pinned column stays put.
      </p>
      <DataTable
        columns={[
          { accessorKey: 'id', header: 'Invoice', size: 140 },
          { accessorKey: 'status', header: 'Status', size: 200 },
          { accessorKey: 'amount', header: 'Amount', size: 200 },
          {
            id: 'notes',
            header: 'Notes',
            size: 320,
            cell: ({ row }) => `Generated reference note for ${row.original.id}`,
          },
        ]}
        data={ROWS}
        pageSize={10}
        enableSorting
        enableColumnPinning
        enableColumnResizing
        defaultColumnPinning={{ left: ['id'] }}
      />
    </div>
  ),
}

export const ExpandableRows: Story = {
  name: 'Expandable detail rows',
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>renderDetail</code> adds a chevron column; expanding a row reveals a full-width
        detail panel (TanStack's expanded row model — ag-grid calls this "master/detail").
      </p>
      <DataTable
        columns={columns}
        data={ROWS.slice(0, 8)}
        pageSize={10}
        renderDetail={(row) => (
          <dl className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Invoice</dt>
              <dd className="font-medium">{row.original.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium">{row.original.status}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="font-medium">${row.original.amount.toFixed(2)}</dd>
            </div>
          </dl>
        )}
      />
    </div>
  ),
}

type Account = { name: string; balance: number; children?: Account[] }

const ACCOUNTS: Account[] = [
  {
    name: 'Assets',
    balance: 5200,
    children: [
      { name: 'Cash', balance: 1200 },
      {
        name: 'Receivables',
        balance: 4000,
        children: [
          { name: 'Trade', balance: 3500 },
          { name: 'Other', balance: 500 },
        ],
      },
    ],
  },
  {
    name: 'Liabilities',
    balance: 2100,
    children: [
      { name: 'Payables', balance: 1400 },
      { name: 'Accrued', balance: 700 },
    ],
  },
]

export const TreeData: Story = {
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>getSubRows</code> turns hierarchical data into expandable nested rows with depth
        indenting (client-side mode only).
      </p>
      <DataTable<Account, unknown>
        columns={[
          { accessorKey: 'name', header: 'Account' },
          {
            accessorKey: 'balance',
            header: 'Balance',
            cell: ({ row }) => `$${row.original.balance.toLocaleString()}`,
          },
        ]}
        data={ACCOUNTS}
        pageSize={25}
        getSubRows={(account) => account.children}
        defaultExpanded={true}
      />
    </div>
  ),
}

export const GroupingAndAggregation: Story = {
  name: 'Grouping & aggregation',
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>enableGrouping</code> + <code>defaultGrouping</code> group rows by Status (each
        column's menu gains "Group by this column"). The Amount column declares{' '}
        <code>aggregationFn: 'sum'</code> with an <code>aggregatedCell</code>, so collapsed groups
        show per-group totals.
      </p>
      <DataTable<Invoice, unknown>
        columns={[
          { accessorKey: 'status', header: 'Status' },
          { accessorKey: 'id', header: 'Invoice', enableGrouping: false },
          {
            accessorKey: 'amount',
            header: 'Amount',
            enableGrouping: false,
            aggregationFn: 'sum',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
            aggregatedCell: ({ getValue }) => (
              <span className="font-medium">${(getValue() as number).toFixed(2)}</span>
            ),
          },
        ]}
        data={ROWS}
        pageSize={50}
        enableSorting
        enableGrouping
        defaultGrouping={['status']}
      />
    </div>
  ),
}

export const FooterTotals: Story = {
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        Any column with a <code>footer</code> renderer gets a table footer row — here summing the
        filtered rows' Amount. TanStack-native: the footer receives the live table instance.
      </p>
      <DataTable<Invoice, unknown>
        columns={[
          { accessorKey: 'id', header: 'Invoice', footer: () => 'Total' },
          { accessorKey: 'status', header: 'Status' },
          {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
            footer: ({ table }) => {
              const total = table
                .getFilteredRowModel()
                .rows.reduce((sum, row) => sum + row.original.amount, 0)
              return <span className="font-semibold">${total.toFixed(2)}</span>
            },
          },
        ]}
        data={ROWS}
        pageSize={10}
        enableGlobalFilter
        searchPlaceholder="Filter, and watch the total follow…"
      />
    </div>
  ),
}

export const CsvExport: Story = {
  name: 'CSV export',
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>enableCsvExport="invoices.csv"</code> adds an Export button to the toolbar. It
        downloads the current view — visible columns, filtered + sorted rows across all pages
        (client mode). UTF-8 BOM included so Excel is happy.
      </p>
      <DataTable
        columns={columns}
        data={ROWS}
        pageSize={10}
        enableGlobalFilter
        enableCsvExport="invoices.csv"
      />
    </div>
  ),
}

export const RangeFilterStory: Story = {
  name: 'Number range filter',
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        <code>DataTableRangeFilter</code> filters a numeric column by min/max, using TanStack's
        built-in <code>filterFn: 'inNumberRange'</code>. Placeholders show the column's actual
        min/max via faceting.
      </p>
      <DataTable<Invoice, unknown>
        columns={[
          { accessorKey: 'id', header: 'Invoice' },
          { accessorKey: 'status', header: 'Status' },
          {
            accessorKey: 'amount',
            header: 'Amount',
            filterFn: 'inNumberRange',
            cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
          },
        ]}
        data={ROWS}
        pageSize={10}
        renderToolbar={(table) => (
          <DataTableRangeFilter column={table.getColumn('amount')} title="Amount" />
        )}
      />
    </div>
  ),
}

export const ErrorState: Story = {
  render: function ErrorStateExample() {
    const [failed, setFailed] = useState(true)
    return (
      <div className="w-[600px]">
        <p className="text-muted-foreground mb-3 text-sm">
          <code>error</code> replaces the body with a message and (with <code>onRetry</code>) a
          Retry button. Retrying here "succeeds" and shows the data.
        </p>
        <DataTable
          columns={columns}
          data={failed ? [] : ROWS.slice(0, 5)}
          pageSize={10}
          error={failed ? 'Couldn’t load invoices. Check your connection and try again.' : undefined}
          onRetry={() => setFailed(false)}
        />
      </div>
    )
  },
}

export const SkeletonLoading: Story = {
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        When <code>loading</code> is set and no rows exist yet, the body renders{' '}
        <code>loadingRows</code> skeleton rows (default 5) instead of dimming an empty table.
      </p>
      <DataTable columns={columns} data={[]} pageIndex={0} pageCount={3} loading loadingRows={6} />
    </div>
  ),
}
