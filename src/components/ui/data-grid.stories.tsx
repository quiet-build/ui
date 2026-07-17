import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { expect, within } from 'storybook/test'
import { DataGrid } from './data-grid'

type Reading = { id: number; sensor: string; region: string; value: number }

const REGIONS = ['North', 'South', 'East', 'West'] as const

function makeReadings(count: number, offset = 0): Reading[] {
  return Array.from({ length: count }, (_, i) => {
    const id = offset + i
    return {
      id,
      sensor: `SN-${String(id).padStart(6, '0')}`,
      region: REGIONS[id % REGIONS.length],
      value: Math.round(Math.sin(id) * 5000 + 5000) / 100,
    }
  })
}

const columns: ColumnDef<Reading>[] = [
  { accessorKey: 'sensor', header: 'Sensor', size: 180 },
  { accessorKey: 'region', header: 'Region', size: 140 },
  {
    accessorKey: 'value',
    header: 'Value',
    size: 120,
    cell: ({ row }) => row.original.value.toFixed(2),
  },
]

const meta: Meta<typeof DataGrid<Reading, unknown>> = {
  title: 'UI/DataGrid',
  component: DataGrid<Reading, unknown>,
  tags: ['autodocs', 'ai-generated'],
}
export default meta
type Story = StoryObj<typeof DataGrid<Reading, unknown>>

const HUNDRED_K = makeReadings(100_000)

export const HundredThousandRows: Story = {
  name: '100,000 rows',
  render: () => (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        All 100,000 rows live in memory; only the visible window (± overscan) is in the DOM.
        Sorting and search still operate on the full dataset.
      </p>
      <DataGrid
        columns={columns}
        data={HUNDRED_K}
        height={400}
        enableSorting
        enableGlobalFilter
        searchPlaceholder="Search sensors…"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('100,000 row(s)')).toBeVisible()
    // Virtualization: the DOM holds a tiny fraction of the 100k rows.
    const renderedRows = canvasElement.querySelectorAll('tbody tr')
    await expect(renderedRows.length).toBeGreaterThan(0)
    await expect(renderedRows.length).toBeLessThan(100)
  },
}

function InfiniteScrollExample() {
  const [rows, setRows] = useState<Reading[]>(() => makeReadings(100))
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = () => {
    setLoading(true)
    // Simulate a 400ms network fetch of the next chunk.
    setTimeout(() => {
      setRows((prev) => {
        const next = [...prev, ...makeReadings(100, prev.length)]
        setHasMore(next.length < 1000)
        return next
      })
      setLoading(false)
    }, 400)
  }

  return (
    <div className="w-[600px]">
      <p className="text-muted-foreground mb-3 text-sm">
        Starts with 100 rows; scrolling near the end calls <code>onReachEnd</code>, which appends
        the next chunk (simulated 400ms fetch) until 1,000 rows are loaded.
      </p>
      <DataGrid
        columns={columns}
        data={rows}
        height={400}
        hasMore={hasMore}
        loading={loading}
        onReachEnd={loadMore}
      />
    </div>
  )
}

export const InfiniteScroll: Story = {
  render: () => <InfiniteScrollExample />,
}
