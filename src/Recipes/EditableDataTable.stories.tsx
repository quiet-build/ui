import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CellContext, ColumnDef, RowData } from '@tanstack/react-table'
import {
  Button,
  DataTable,
  DataTableToolbar,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  copySelectionAsTsv,
} from '../index'

// TanStack's documented pattern for editable cells: expose an updater on
// `table.options.meta`, and have cell renderers commit through it.
declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

type Task = { id: string; title: string; status: 'todo' | 'doing' | 'done' }

const INITIAL_TASKS: Task[] = [
  { id: 'T-1', title: 'Write release notes', status: 'todo' },
  { id: 'T-2', title: 'Fix sticky header', status: 'done' },
  { id: 'T-3', title: 'Ship CSV export', status: 'doing' },
  { id: 'T-4', title: 'Review pinning PR', status: 'todo' },
]

/** Click-to-edit text cell: renders text; becomes an input on click; commits on blur or Enter. */
function EditableTextCell({ getValue, row, column, table }: CellContext<Task, unknown>) {
  const initial = getValue() as string
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initial)

  if (!editing) {
    return (
      <button
        type="button"
        className="w-full cursor-text rounded-sm px-1 py-0.5 text-left hover:bg-muted/60"
        onClick={() => {
          setDraft(initial)
          setEditing(true)
        }}
        aria-label={`Edit ${column.id} for ${row.original.id}`}
      >
        {initial}
      </button>
    )
  }

  const commit = () => {
    table.options.meta?.updateData?.(row.index, column.id, draft)
    setEditing(false)
  }

  return (
    <Input
      autoFocus
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') commit()
        if (event.key === 'Escape') setEditing(false)
      }}
      className="h-7"
    />
  )
}

/** Select cell: commits immediately on change. */
function StatusSelectCell({ getValue, row, column, table }: CellContext<Task, unknown>) {
  return (
    <Select
      value={getValue() as string}
      onValueChange={(value) => table.options.meta?.updateData?.(row.index, column.id, value)}
    >
      <SelectTrigger className="h-7 w-28" aria-label={`Status for ${row.original.id}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todo">To do</SelectItem>
        <SelectItem value="doing">Doing</SelectItem>
        <SelectItem value="done">Done</SelectItem>
      </SelectContent>
    </Select>
  )
}

const columns: ColumnDef<Task>[] = [
  { accessorKey: 'id', header: 'ID', size: 80 },
  { accessorKey: 'title', header: 'Title', cell: EditableTextCell },
  { accessorKey: 'status', header: 'Status', cell: StatusSelectCell },
]

function EditableDataTableExample() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)

  return (
    <div className="w-[640px] space-y-3">
      <p className="text-muted-foreground text-sm">
        Minimal inline editing via TanStack's <code>table.options.meta.updateData</code> pattern:
        the Title cell is click-to-edit (commit on blur/Enter, cancel on Escape); Status commits
        on select. Selected rows can be copied as TSV — paste straight into a spreadsheet.
      </p>
      <DataTable
        columns={columns}
        data={tasks}
        pageSize={10}
        enableRowSelection
        getRowId={(task) => task.id}
        meta={{
          updateData: (rowIndex, columnId, value) =>
            setTasks((prev) =>
              prev.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row))
            ),
        }}
        renderToolbar={(table) => (
          <DataTableToolbar table={table} showViewOptions={false}>
            <Button
              variant="outline"
              size="sm"
              disabled={table.getFilteredSelectedRowModel().rows.length === 0}
              onClick={() => copySelectionAsTsv(table)}
            >
              Copy selection (TSV)
            </Button>
          </DataTableToolbar>
        )}
      />
      <pre className="rounded-md border bg-muted/50 px-3 py-2 text-xs" data-testid="state-dump">
        {JSON.stringify(tasks, null, 2)}
      </pre>
    </div>
  )
}

const meta: Meta = {
  title: 'Recipes/Editable DataTable',
  tags: ['autodocs', 'ai-generated'],
}
export default meta

export const EditableCells: StoryObj = {
  render: () => <EditableDataTableExample />,
}
