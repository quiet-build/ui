import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ColumnDef, Table } from '@tanstack/react-table'
import {
  DataGrid,
  DataTable,
  DataTableRangeFilter,
  tableToCsv,
  selectionToTsv,
} from '../../index'

type Invoice = { id: string; customer: string; status: 'paid' | 'pending' | 'unpaid'; amount: number }

const rows: Invoice[] = [
  { id: 'INV-1', customer: 'Ada', status: 'paid', amount: 100 },
  { id: 'INV-2', customer: 'Grace', status: 'pending', amount: 250 },
  { id: 'INV-3', customer: 'Alan', status: 'unpaid', amount: 400 },
  { id: 'INV-4', customer: 'Barbara', status: 'paid', amount: 50 },
]

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'amount', header: 'Amount' },
]

function firstBodyCellTexts() {
  return [...document.querySelectorAll('tbody tr')].map(
    (tr) => tr.querySelector('td')?.textContent
  )
}

describe('DataTable defaultSorting', () => {
  it('seeds an uncontrolled initial sort', () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        pageSize={10}
        enableSorting
        defaultSorting={[{ id: 'amount', desc: true }]}
      />
    )
    expect(firstBodyCellTexts()).toEqual(['INV-3', 'INV-2', 'INV-1', 'INV-4'])
  })

  it('still lets the user re-sort (state is not controlled)', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={rows}
        pageSize={10}
        enableSorting
        defaultSorting={[{ id: 'amount', desc: true }]}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Customer' }))
    expect(firstBodyCellTexts()[0]).toBe('INV-1') // Ada first
  })
})

describe('DataTable filter → page reset', () => {
  it('returns to page 1 when a filter narrows results while on a later page', async () => {
    const user = userEvent.setup()
    const many: Invoice[] = Array.from({ length: 25 }, (_, i) => ({
      id: `INV-${i + 1}`,
      customer: i === 0 ? 'Zelda' : `Customer ${i + 1}`,
      status: 'paid',
      amount: i,
    }))
    render(<DataTable columns={columns} data={many} pageSize={10} enableGlobalFilter />)

    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText(/Page 2 of 3/)).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Search…'), 'Zelda')
    await waitFor(() => expect(screen.getByText('Zelda')).toBeInTheDocument(), { timeout: 2000 })
    expect(screen.getByText(/Page 1 of 1/)).toBeInTheDocument()
  })
})

describe('DataTable onRowClick', () => {
  it('fires with the clicked row and supports Enter activation', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(<DataTable columns={columns} data={rows} pageSize={10} onRowClick={fn} />)

    await user.click(screen.getByText('Ada'))
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn.mock.calls[0][0].original.id).toBe('INV-1')

    const graceRow = screen.getByText('Grace').closest('tr')!
    graceRow.focus()
    await user.keyboard('{Enter}')
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn.mock.calls[1][0].original.id).toBe('INV-2')
  })

  it('ignores clicks on interactive elements (selection checkbox)', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={rows}
        pageSize={10}
        onRowClick={fn}
        enableRowSelection
        getRowId={(r) => r.id}
      />
    )
    await user.click(screen.getAllByRole('checkbox', { name: /select row/i })[0])
    expect(fn).not.toHaveBeenCalled()
    expect(screen.getByText('1 of 4 row(s) selected.')).toBeInTheDocument()
  })
})

describe('DataTable column pinning', () => {
  it('renders pinned columns sticky with computed offsets', () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        pageSize={10}
        enableColumnPinning
        defaultColumnPinning={{ left: ['id'] }}
      />
    )
    const pinnedHeader = screen.getByRole('columnheader', { name: 'Invoice' })
    expect(pinnedHeader.style.position).toBe('sticky')
    expect(pinnedHeader.style.left).toBe('0px')
    // Unpinned columns are not sticky.
    expect(screen.getByRole('columnheader', { name: 'Customer' }).style.position).not.toBe(
      'sticky'
    )
  })

  it('offers Pin actions in the header menu and pins on click', async () => {
    const user = userEvent.setup()
    render(
      <DataTable columns={columns} data={rows} pageSize={10} enableSorting enableColumnPinning />
    )
    await user.click(screen.getByRole('button', { name: 'Customer column menu' }))
    await user.click(await screen.findByRole('menuitem', { name: /pin left/i }))
    await waitFor(() =>
      expect(screen.getByRole('columnheader', { name: 'Customer' }).style.position).toBe('sticky')
    )
  })
})

describe('DataTable column resizing', () => {
  it('applies explicit widths and renders resize handles', () => {
    render(<DataTable columns={columns} data={rows} pageSize={10} enableColumnResizing />)
    // The resize handle's aria-label folds into the th's accessible name.
    const header = screen.getByRole('columnheader', { name: /invoice/i })
    expect(header.style.width).toBe('150px') // TanStack default size
    expect(screen.getAllByRole('separator', { name: /resize/i }).length).toBe(columns.length)
  })

  it('does not apply widths or handles by default', () => {
    render(<DataTable columns={columns} data={rows} pageSize={10} />)
    const header = screen.getByRole('columnheader', { name: 'Invoice' })
    expect(header.style.width).toBe('')
    expect(screen.queryByRole('separator', { name: /resize/i })).not.toBeInTheDocument()
  })
})

describe('DataTable renderDetail (expandable rows)', () => {
  it('toggles a full-width detail row with aria-expanded', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={rows}
        pageSize={10}
        renderDetail={(row) => <div>Detail for {row.original.id}</div>}
      />
    )
    expect(screen.queryByText('Detail for INV-1')).not.toBeInTheDocument()

    const toggle = screen.getAllByRole('button', { name: 'Expand row' })[0]
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)

    expect(screen.getByText('Detail for INV-1')).toBeInTheDocument()
    const collapse = screen.getByRole('button', { name: 'Collapse row' })
    expect(collapse).toHaveAttribute('aria-expanded', 'true')
    await user.click(collapse)
    expect(screen.queryByText('Detail for INV-1')).not.toBeInTheDocument()
  })
})

describe('DataTable getSubRows (tree data)', () => {
  type Node = { name: string; children?: Node[] }
  const tree: Node[] = [
    { name: 'Parent', children: [{ name: 'Child A' }, { name: 'Child B' }] },
    { name: 'Loner' },
  ]
  const treeColumns: ColumnDef<Node>[] = [{ accessorKey: 'name', header: 'Name' }]

  it('hides children until the parent is expanded', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={treeColumns}
        data={tree}
        pageSize={25}
        getSubRows={(node) => node.children}
      />
    )
    expect(screen.queryByText('Child A')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Expand row' }))
    expect(screen.getByText('Child A')).toBeInTheDocument()
    expect(screen.getByText('Child B')).toBeInTheDocument()
  })

  it('expands everything with defaultExpanded={true}', () => {
    render(
      <DataTable
        columns={treeColumns}
        data={tree}
        pageSize={25}
        getSubRows={(node) => node.children}
        defaultExpanded={true}
      />
    )
    expect(screen.getByText('Child A')).toBeInTheDocument()
  })
})

describe('DataTable grouping & aggregation', () => {
  const groupColumns: ColumnDef<Invoice>[] = [
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'id', header: 'Invoice', enableGrouping: false },
    {
      accessorKey: 'amount',
      header: 'Amount',
      enableGrouping: false,
      aggregationFn: 'sum',
      aggregatedCell: ({ getValue }) => <span>sum:{getValue<number>()}</span>,
    },
  ]

  it('renders group rows with counts and aggregated cells', () => {
    render(
      <DataTable
        columns={groupColumns}
        data={rows}
        pageSize={25}
        enableGrouping
        defaultGrouping={['status']}
      />
    )
    // paid group: INV-1 (100) + INV-4 (50)
    expect(screen.getByRole('button', { name: /^paid/ })).toBeInTheDocument()
    expect(screen.getByText('(2)')).toBeInTheDocument()
    expect(screen.getByText('sum:150')).toBeInTheDocument()
    // Leaf rows are collapsed.
    expect(screen.queryByText('INV-1')).not.toBeInTheDocument()
  })

  it('expands a group to reveal leaf rows', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={groupColumns}
        data={rows}
        pageSize={25}
        enableGrouping
        defaultGrouping={['status']}
      />
    )
    await user.click(screen.getByRole('button', { name: /^paid/ }))
    expect(screen.getByText('INV-1')).toBeInTheDocument()
    expect(screen.getByText('INV-4')).toBeInTheDocument()
  })
})

describe('DataTable footer', () => {
  it('renders a footer row when any column defines footer', () => {
    const withFooter: ColumnDef<Invoice>[] = [
      { accessorKey: 'id', header: 'Invoice', footer: () => 'Total' },
      {
        accessorKey: 'amount',
        header: 'Amount',
        footer: ({ table }) => (
          <span>
            {table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.amount, 0)}
          </span>
        ),
      },
    ]
    render(<DataTable columns={withFooter} data={rows} pageSize={10} />)
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('800')).toBeInTheDocument() // 100+250+400+50
  })

  it('renders no footer element otherwise', () => {
    const { container } = render(<DataTable columns={columns} data={rows} pageSize={10} />)
    expect(container.querySelector('tfoot')).not.toBeInTheDocument()
  })
})

describe('DataTable error & skeleton states', () => {
  it('shows the error message and fires onRetry', async () => {
    const user = userEvent.setup()
    const retry = vi.fn()
    render(
      <DataTable columns={columns} data={rows} pageSize={10} error="Boom." onRetry={retry} />
    )
    expect(screen.getByText('Boom.')).toBeInTheDocument()
    // Error takes precedence over data rows.
    expect(screen.queryByText('Ada')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(retry).toHaveBeenCalledTimes(1)
  })

  it('renders skeleton rows while loading with no data', () => {
    const { container } = render(
      <DataTable columns={columns} data={[]} pageIndex={0} pageCount={2} loading loadingRows={4} />
    )
    expect(container.querySelectorAll('tbody [data-slot="skeleton"]').length).toBe(
      4 * columns.length
    )
  })
})

describe('DataTableRangeFilter', () => {
  it('narrows rows by min/max with the built-in inNumberRange filterFn', async () => {
    const user = userEvent.setup()
    const rangeColumns: ColumnDef<Invoice>[] = [
      { accessorKey: 'id', header: 'Invoice' },
      { accessorKey: 'amount', header: 'Amount', filterFn: 'inNumberRange' },
    ]
    render(
      <DataTable
        columns={rangeColumns}
        data={rows}
        pageSize={10}
        renderToolbar={(table) => (
          <DataTableRangeFilter column={table.getColumn('amount')} title="Amount" />
        )}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Amount' }))
    await user.type(await screen.findByLabelText('Amount minimum'), '200')

    await waitFor(() => expect(screen.queryByText('INV-1')).not.toBeInTheDocument())
    expect(screen.getByText('INV-2')).toBeInTheDocument() // 250
    expect(screen.getByText('INV-3')).toBeInTheDocument() // 400
    expect(screen.queryByText('INV-4')).not.toBeInTheDocument() // 50
  })
})

describe('CSV / TSV table integration', () => {
  it('tableToCsv exports the filtered+sorted view without utility columns', () => {
    let captured: Table<Invoice> | undefined
    render(
      <DataTable
        columns={columns}
        data={rows}
        pageSize={2} // pagination must NOT limit the export
        enableSorting
        enableRowSelection
        getRowId={(r) => r.id}
        defaultSorting={[{ id: 'amount', desc: true }]}
        renderToolbar={(table) => {
          captured = table
          return null
        }}
      />
    )
    const csv = tableToCsv(captured!)
    const lines = csv.slice(1).split('\r\n') // strip BOM
    expect(lines[0]).toBe('Invoice,Customer,Amount')
    expect(lines).toHaveLength(1 + rows.length)
    expect(lines[1]).toBe('INV-3,Alan,400') // sorted desc, across all pages
  })

  it('selectionToTsv exports only selected rows', () => {
    let captured: Table<Invoice> | undefined
    render(
      <DataTable
        columns={columns}
        data={rows}
        pageSize={10}
        enableRowSelection
        getRowId={(r) => r.id}
        rowSelection={{ 'INV-2': true }}
        renderToolbar={(table) => {
          captured = table
          return null
        }}
      />
    )
    expect(selectionToTsv(captured!)).toBe('Invoice\tCustomer\tAmount\nINV-2\tGrace\t250')
  })

  it('shows the Export CSV button via enableCsvExport', () => {
    render(<DataTable columns={columns} data={rows} pageSize={10} enableCsvExport />)
    expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument()
  })
})

describe('DataGrid (virtualized)', () => {
  const gridColumns: ColumnDef<Invoice>[] = [
    { accessorKey: 'id', header: 'Invoice', size: 120 },
    { accessorKey: 'customer', header: 'Customer', size: 160 },
  ]
  const bigData: Invoice[] = Array.from({ length: 5000 }, (_, i) => ({
    id: `INV-${i}`,
    customer: `Customer ${i}`,
    status: 'paid',
    amount: i,
  }))

  it('renders only a window of rows, never the full dataset', () => {
    // jsdom has no layout, so the virtualizer's measured viewport is 0 and
    // the window is empty here — the "window is non-empty AND small" check
    // runs in real Chromium via the DataGrid story play test. This test
    // locks in that the full dataset is never materialized in the DOM.
    const { container } = render(
      <DataGrid columns={gridColumns} data={bigData} height={300} estimateRowHeight={40} />
    )
    expect(container.querySelectorAll('tbody tr').length).toBeLessThan(100)
    expect(screen.getByText('5,000 row(s)')).toBeInTheDocument()
  })

  it('shows the empty message without data', () => {
    render(<DataGrid columns={gridColumns} data={[]} emptyMessage="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })
})
