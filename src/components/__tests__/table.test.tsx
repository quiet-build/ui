import { describe, it, expect } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  DataTable,
} from '../../index'

describe('Table primitive', () => {
  it('renders rows and cells', () => {
    const { getByText, getByRole } = render(
      <Table>
        <TableHeader>
          <TableRow><TableHead>Name</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Alice</TableCell></TableRow>
        </TableBody>
      </Table>,
    )
    expect(getByRole('table')).toBeInTheDocument()
    expect(getByText('Alice')).toBeInTheDocument()
  })
})

describe('Pagination primitive', () => {
  it('renders pagination links', () => {
    const { getByText } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
        </PaginationContent>
      </Pagination>,
    )
    expect(getByText('1')).toBeInTheDocument()
    expect(getByText('2')).toBeInTheDocument()
  })
})

type Row = { id: number; name: string }
const columns: ColumnDef<Row>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
]
const rows: Row[] = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` }))

describe('DataTable client-side pagination', () => {
  it('renders only the first page (default pageSize=10)', () => {
    const { getByText, queryByText } = render(<DataTable columns={columns} data={rows} />)
    expect(getByText('Row 1')).toBeInTheDocument()
    expect(getByText('Row 10')).toBeInTheDocument()
    expect(queryByText('Row 11')).not.toBeInTheDocument()
    expect(getByText(/Page 1 of 3/)).toBeInTheDocument()
  })

  it('advances to page 2 on Next click', () => {
    const { getByRole, getByText, queryByText } = render(<DataTable columns={columns} data={rows} />)
    fireEvent.click(getByRole('button', { name: /next/i }))
    expect(queryByText('Row 1')).not.toBeInTheDocument()
    expect(getByText('Row 11')).toBeInTheDocument()
    expect(getByText(/Page 2 of 3/)).toBeInTheDocument()
  })

  it('shows empty message when there are no rows', () => {
    const { getByText } = render(<DataTable columns={columns} data={[]} emptyMessage="Nothing here" />)
    expect(getByText('Nothing here')).toBeInTheDocument()
  })
})

describe('DataTable server-side pagination', () => {
  it('uses provided pageCount and fires onPaginationChange', () => {
    const fn = vi.fn()
    const { getByRole, getByText } = render(
      <DataTable
        columns={columns}
        data={rows.slice(0, 10)}
        pageIndex={0}
        pageCount={5}
        onPaginationChange={fn}
      />,
    )
    expect(getByText(/Page 1 of 5/)).toBeInTheDocument()
    fireEvent.click(getByRole('button', { name: /next/i }))
    expect(fn).toHaveBeenCalled()
    const call = fn.mock.calls[fn.mock.calls.length - 1][0]
    expect(call.pageIndex).toBe(1)
  })

  it('does not slice data internally in server-side mode', () => {
    const { getByText, queryByText } = render(
      <DataTable
        columns={columns}
        data={rows.slice(0, 10)}
        pageIndex={0}
        pageCount={5}
        onPaginationChange={() => {}}
      />,
    )
    // All 10 provided rows render; client-side slicing doesn't kick in
    expect(getByText('Row 1')).toBeInTheDocument()
    expect(getByText('Row 10')).toBeInTheDocument()
    expect(queryByText('Row 11')).not.toBeInTheDocument()
  })
})

describe('DataTable rows-per-page selector', () => {
  it('changes page size client-side', async () => {
    const { container } = render(<DataTable columns={columns} data={rows} pageSize={10} />)
    // 10 rows visible initially
    expect(container.querySelectorAll('tbody tr').length).toBe(10)
    // Open the rows-per-page selector and choose 25.
    // Radix Select opens on keyDown Space/Enter; listbox renders into a portal.
    const trigger = screen.getByRole('combobox')
    fireEvent.keyDown(trigger, { key: 'Enter' })
    const option25 = await screen.findByRole('option', { name: '25' })
    fireEvent.click(option25)
    expect(container.querySelectorAll('tbody tr').length).toBe(25)
  })

  it('respects custom pageSizeOptions', async () => {
    render(<DataTable columns={columns} data={rows} pageSize={5} pageSizeOptions={[5, 15]} />)
    const trigger = screen.getByRole('combobox')
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(await screen.findByRole('option', { name: '5' })).toBeInTheDocument()
    expect(await screen.findByRole('option', { name: '15' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: '10' })).not.toBeInTheDocument()
  })

  it('fires onPaginationChange with new pageSize in server-side mode', async () => {
    const fn = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={rows.slice(0, 10)}
        pageIndex={0}
        pageCount={5}
        pageSize={10}
        onPaginationChange={fn}
      />,
    )
    const trigger = screen.getByRole('combobox')
    fireEvent.keyDown(trigger, { key: 'Enter' })
    fireEvent.click(await screen.findByRole('option', { name: '25' }))
    expect(fn).toHaveBeenCalled()
    const lastCall = fn.mock.calls[fn.mock.calls.length - 1][0]
    expect(lastCall.pageSize).toBe(25)
  })
})

describe('DataTable loading state', () => {
  it('shows a loading indicator with aria-label when loading', () => {
    render(
      <DataTable
        columns={columns}
        data={rows.slice(0, 10)}
        pageIndex={0}
        pageCount={5}
        loading
      />,
    )
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('disables Prev, Next, and the rows-per-page selector when loading', () => {
    render(
      <DataTable
        columns={columns}
        data={rows.slice(10, 20)}
        pageIndex={1}
        pageCount={5}
        loading
      />,
    )
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('does not show the indicator when loading is false', () => {
    render(<DataTable columns={columns} data={rows} />)
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
  })
})
