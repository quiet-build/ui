import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import { expect, userEvent, within } from 'storybook/test'
import { DataTable } from './data-table'

type Invoice = { id: string; status: 'Paid' | 'Pending' | 'Unpaid'; amount: number }

const ROWS: Invoice[] = Array.from({ length: 47 }, (_, i) => ({
  id: `INV-${String(i + 1).padStart(3, '0')}`,
  status: (['Paid', 'Pending', 'Unpaid'] as const)[i % 3],
  amount: Math.round((i + 1) * 32.5 * 100) / 100,
}))

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => <div className="text-right">${row.original.amount.toFixed(2)}</div>,
  },
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
  const PAGE_SIZE = 10
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: PAGE_SIZE })

  // Simulate "fetching" the right slice from a server.
  const start = pagination.pageIndex * PAGE_SIZE
  const pageRows = ROWS.slice(start, start + PAGE_SIZE)
  const pageCount = Math.ceil(ROWS.length / PAGE_SIZE)

  return (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        Server-side mode: parent owns <code>pageIndex</code> + <code>pageCount</code>; the table calls
        <code> onPaginationChange</code> instead of slicing.
      </p>
      <DataTable
        columns={columns}
        data={pageRows}
        pageSize={PAGE_SIZE}
        pageIndex={pagination.pageIndex}
        pageCount={pageCount}
        onPaginationChange={setPagination}
      />
    </div>
  )
}

export const ServerSide: Story = {
  render: () => <ServerSideExample />,
}
