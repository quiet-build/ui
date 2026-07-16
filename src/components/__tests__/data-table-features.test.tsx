import { describe, it, expect, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ColumnDef, Table } from '@tanstack/react-table'
import {
  DataTable,
  DataTableColumnHeader,
  DataTableFacetedFilter,
  dataTableFacetedFilterFn,
} from '../../index'

type Invoice = { id: string; customer: string; status: 'paid' | 'pending' | 'unpaid' }

const rows: Invoice[] = [
  { id: 'INV-1', customer: 'Ada', status: 'paid' },
  { id: 'INV-2', customer: 'Grace', status: 'pending' },
  { id: 'INV-3', customer: 'Alan', status: 'unpaid' },
  { id: 'INV-4', customer: 'Barbara', status: 'paid' },
]

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'status', header: 'Status', filterFn: dataTableFacetedFilterFn },
]

function bodyRowLabel(index: number) {
  return screen.getAllByRole('row').slice(1)[index]
}

describe('DataTable sorting', () => {
  it('sorts ascending then descending on repeated header clicks (client-side)', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={rows} enableSorting pageSize={10} />)
    const header = screen.getByRole('button', { name: 'Customer' })

    await user.click(header)
    expect(bodyRowLabel(0)).toHaveTextContent('Ada')

    await user.click(header)
    expect(bodyRowLabel(0)).toHaveTextContent('Grace')
  })

  it('reflects sort state via aria-sort on the header cell', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={rows} enableSorting pageSize={10} />)
    const columnHeader = screen.getAllByRole('columnheader')[1]
    expect(columnHeader).toHaveAttribute('aria-sort', 'none')
    await user.click(screen.getByRole('button', { name: 'Customer' }))
    expect(columnHeader).toHaveAttribute('aria-sort', 'ascending')
    await user.click(screen.getByRole('button', { name: 'Customer' }))
    expect(columnHeader).toHaveAttribute('aria-sort', 'descending')
  })

  it('does not sort locally in server-side mode; fires onSortingChange instead', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={rows.slice(0, 2)}
        enableSorting
        onSortingChange={fn}
        pageIndex={0}
        pageCount={2}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Customer' }))
    expect(fn).toHaveBeenCalled()
    // Server owns sorting — the provided slice's original order is preserved.
    expect(bodyRowLabel(0)).toHaveTextContent('Ada')
  })

  it('does not render a sort toggle when enableSorting is false (default)', () => {
    render(<DataTable columns={columns} data={rows} pageSize={10} />)
    expect(screen.queryByRole('button', { name: 'Customer' })).not.toBeInTheDocument()
    expect(screen.getByText('Customer')).toBeInTheDocument()
  })
})

describe('DataTable global filter', () => {
  it('narrows rows after the debounce window (client-side)', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={rows} enableGlobalFilter pageSize={10} />)

    const input = screen.getByPlaceholderText('Search…')
    await user.type(input, 'Ada')

    // Real timers: the debounce is 300ms, so poll past that window.
    await waitFor(() => expect(screen.queryByText('Grace')).not.toBeInTheDocument(), {
      timeout: 2000,
    })
    expect(screen.getByText('Ada')).toBeInTheDocument()
  })

  it('does not render a search box when enableGlobalFilter is false (default)', () => {
    render(<DataTable columns={columns} data={rows} pageSize={10} />)
    expect(screen.queryByPlaceholderText('Search…')).not.toBeInTheDocument()
  })

  it('does not filter locally in server-side mode; fires onGlobalFilterChange instead', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={rows.slice(0, 2)}
        enableGlobalFilter
        onGlobalFilterChange={fn}
        pageIndex={0}
        pageCount={2}
      />
    )
    const input = screen.getByPlaceholderText('Search…')
    await user.type(input, 'Ada')

    await waitFor(() => expect(fn).toHaveBeenCalledWith('Ada'), { timeout: 2000 })
    // Server owns filtering — the provided (unfiltered) slice still renders in full.
    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByText('Grace')).toBeInTheDocument()
  })
})

describe('DataTable column filters', () => {
  it('does not filter locally in server-side mode; fires onColumnFiltersChange instead', () => {
    const fn = vi.fn()
    let table: Table<Invoice> | undefined
    render(
      <DataTable
        columns={columns}
        data={rows.slice(0, 2)}
        onColumnFiltersChange={fn}
        pageIndex={0}
        pageCount={2}
        renderToolbar={(t) => {
          table = t
          return null
        }}
      />
    )
    act(() => {
      table?.getColumn('status')?.setFilterValue(['paid'])
    })

    expect(fn).toHaveBeenCalledWith([{ id: 'status', value: ['paid'] }])
    // Server owns filtering — the provided (unfiltered) slice still renders in full.
    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByText('Grace')).toBeInTheDocument()
  })
})

describe('DataTableFacetedFilter', () => {
  it('narrows rows to the checked facet value and clears via "Clear filter"', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={rows}
        pageSize={10}
        renderToolbar={(table) => (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={[
              { label: 'Paid', value: 'paid' },
              { label: 'Pending', value: 'pending' },
              { label: 'Unpaid', value: 'unpaid' },
            ]}
          />
        )}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Status' }))
    // Accessible name concatenates the label with its trailing facet count
    // (e.g. "Paid2"), so anchor the match to the start to avoid "Unpaid".
    await user.click(screen.getByRole('checkbox', { name: /^Paid/ }))

    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByText('Barbara')).toBeInTheDocument()
    expect(screen.queryByText('Grace')).not.toBeInTheDocument()
    expect(screen.queryByText('Alan')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /clear filter/i }))
    expect(screen.getByText('Grace')).toBeInTheDocument()
  })
})

describe('DataTableViewOptions', () => {
  it('does not render by default — column visibility is opt-in', () => {
    render(<DataTable columns={columns} data={rows} pageSize={10} />)
    expect(screen.queryByRole('button', { name: 'View' })).not.toBeInTheDocument()
  })

  it('hides a column via the View menu when enableViewOptions is set', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={rows} pageSize={10} enableViewOptions />)
    expect(screen.getByRole('columnheader', { name: 'Customer' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'View' }))
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Customer' }))

    expect(screen.queryByRole('columnheader', { name: 'Customer' })).not.toBeInTheDocument()
    // Cell data for the hidden column is gone too.
    expect(screen.queryByText('Ada')).not.toBeInTheDocument()
  })

  it('keeps the original string label when enableSorting auto-wraps the header', async () => {
    // Regression: enableSorting replaces a string `header` with a function
    // (DataTableColumnHeader), which used to make the View menu fall back to
    // the raw column id ("customer") instead of the original label.
    const user = userEvent.setup()
    render(
      <DataTable columns={columns} data={rows} pageSize={10} enableSorting enableViewOptions />
    )
    await user.click(screen.getByRole('button', { name: 'View' }))
    expect(await screen.findByRole('menuitemcheckbox', { name: 'Customer' })).toBeInTheDocument()
    expect(screen.queryByRole('menuitemcheckbox', { name: 'customer' })).not.toBeInTheDocument()
  })
})

describe('DataTable row selection', () => {
  it('selects all rows on the page and shows the "N of M" summary', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={rows}
        pageSize={10}
        enableRowSelection
        getRowId={(r) => r.id}
      />
    )
    await user.click(screen.getByRole('checkbox', { name: /select all rows/i }))
    expect(screen.getByText(`${rows.length} of ${rows.length} row(s) selected.`)).toBeInTheDocument()
  })

  it('fires onRowSelectionChange keyed by getRowId', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={rows}
        pageSize={10}
        enableRowSelection
        getRowId={(r) => r.id}
        onRowSelectionChange={fn}
      />
    )
    await user.click(screen.getAllByRole('checkbox', { name: /select row/i })[0])
    expect(fn).toHaveBeenCalledWith({ 'INV-1': true })
  })

  it('does not add a selection column when enableRowSelection is false (default)', () => {
    render(<DataTable columns={columns} data={rows} pageSize={10} />)
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('counts selections from state (not the current page) in server-side mode', () => {
    // Regression: getFilteredSelectedRowModel()/getFilteredRowModel() only see
    // the current page's provided data in server-side mode. Selecting rows on
    // a different page (persisted via getRowId) used to silently read as 0
    // selected while viewing this page.
    render(
      <DataTable
        columns={columns}
        data={rows.slice(2, 4)} // current server-provided page — excludes the selected rows below
        pageIndex={1}
        pageCount={2}
        enableRowSelection
        getRowId={(r) => r.id}
        rowSelection={{ 'INV-1': true, 'INV-2': true }}
      />
    )
    expect(screen.getByText('2 row(s) selected.')).toBeInTheDocument()
  })

  it('disables checkboxes for rows excluded by a per-row predicate', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={rows}
        pageSize={10}
        enableRowSelection={(row) => row.original.status !== 'unpaid'}
        getRowId={(r) => r.id}
      />
    )
    // INV-3 (Alan) is 'unpaid' — excluded from selection. Base UI's Checkbox
    // renders as a non-native `[role="checkbox"]`, so assert aria-disabled
    // directly rather than jest-dom's toBeDisabled() (native-element heuristic).
    expect(screen.getByRole('checkbox', { name: /select row 3/i })).toHaveAttribute(
      'aria-disabled',
      'true'
    )
    expect(screen.getByRole('checkbox', { name: /select row 1/i })).not.toHaveAttribute(
      'aria-disabled'
    )

    // Select-all only selects the eligible rows (getCanSelect() gates it),
    // but the "of Y" denominator still counts every filtered row.
    await user.click(screen.getByRole('checkbox', { name: /select all rows/i }))
    expect(screen.getByText(`${rows.length - 1} of ${rows.length} row(s) selected.`)).toBeInTheDocument()
  })
})

describe('DataTableColumnHeader (manual usage)', () => {
  // Composed directly in a column def, bypassing enableSorting's auto-wrap —
  // the "custom composition" pattern for columns with a custom title/render.
  it('renders the custom title and toggles sort on click', async () => {
    const user = userEvent.setup()
    const manualColumns: ColumnDef<Invoice>[] = [
      { accessorKey: 'id', header: 'Invoice' },
      {
        accessorKey: 'customer',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Full name" />,
      },
    ]
    render(<DataTable columns={manualColumns} data={rows} pageSize={10} enableSorting />)

    const header = screen.getByRole('button', { name: 'Full name' })
    await user.click(header)
    expect(screen.getAllByRole('columnheader')[1]).toHaveAttribute('aria-sort', 'ascending')
    expect(bodyRowLabel(0)).toHaveTextContent('Ada')
  })

  it('falls back to plain text when the column cannot sort', () => {
    const noSortColumns: ColumnDef<Invoice>[] = [
      {
        accessorKey: 'customer',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Full name" />,
        enableSorting: false,
      },
    ]
    render(<DataTable columns={noSortColumns} data={rows} pageSize={10} enableSorting />)
    expect(screen.queryByRole('button', { name: 'Full name' })).not.toBeInTheDocument()
    expect(screen.getByText('Full name')).toBeInTheDocument()
  })
})

describe('DataTable stickyHeader', () => {
  it('applies sticky positioning classes to the header when enabled', () => {
    const { container } = render(
      <DataTable columns={columns} data={rows} pageSize={10} stickyHeader />
    )
    const thead = container.querySelector('thead')
    expect(thead?.className).toMatch(/sticky/)
  })

  it('makes the outer wrapper the sole scrollport so sticky actually engages', () => {
    // Regression: the Table primitive's own inner wrapper
    // (data-slot="table-container") sets overflow-x-auto, which the CSS
    // spec forces into a real (if empty) scrollport for BOTH axes. A sticky
    // thead binds to the *nearest* such ancestor, so without neutralizing
    // that inner wrapper, the header sticks relative to a container that
    // never itself scrolls — and just scrolls away with everything else.
    const { container } = render(
      <DataTable columns={columns} data={rows} pageSize={10} stickyHeader />
    )
    const outer = container.querySelector('.rounded-md.border')
    expect(outer?.className).toMatch(/overflow-auto/)
    expect(outer?.className).toMatch(/overflow-visible/) // the table-container override
    const tableContainer = container.querySelector('[data-slot="table-container"]')
    expect(tableContainer?.className).toContain('overflow-x-auto') // still the primitive's own class
  })

  it('does not apply sticky classes by default', () => {
    const { container } = render(<DataTable columns={columns} data={rows} pageSize={10} />)
    const thead = container.querySelector('thead')
    const outer = container.querySelector('.rounded-md.border')
    expect(thead?.className).not.toMatch(/sticky/)
    expect(outer?.className).not.toMatch(/overflow-auto/)
  })
})
