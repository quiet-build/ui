import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ColumnDef } from '@tanstack/react-table'
import {
  DataTable,
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
  it('hides a column via the View menu', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={rows} pageSize={10} />)
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
    render(<DataTable columns={columns} data={rows} pageSize={10} enableSorting />)
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
})

describe('DataTable stickyHeader', () => {
  it('applies sticky positioning classes to the header when enabled', () => {
    const { container } = render(
      <DataTable columns={columns} data={rows} pageSize={10} stickyHeader />
    )
    const thead = container.querySelector('thead')
    expect(thead?.className).toMatch(/sticky/)
  })

  it('does not apply sticky classes by default', () => {
    const { container } = render(<DataTable columns={columns} data={rows} pageSize={10} />)
    const thead = container.querySelector('thead')
    expect(thead?.className).not.toMatch(/sticky/)
  })
})
