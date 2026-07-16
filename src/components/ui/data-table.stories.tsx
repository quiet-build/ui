import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { expect, userEvent, within } from 'storybook/test'
import {
  DataTable,
  DataTableFacetedFilter,
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

export const RowSelection: Story = {
  render: () => (
    <div className="w-[600px]">
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

export const KitchenSink: Story = {
  render: () => (
    <div className="w-[700px]">
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
