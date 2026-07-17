import type { Row, Table } from '@tanstack/react-table'

/** Column ids of DataTable's own utility columns — never exported. */
const UTILITY_COLUMN_IDS = new Set(['select', 'expand'])

/** UTF-8 byte-order mark so Excel opens non-ASCII CSV content correctly. */
const BOM = '\ufeff'

function escapeCsvField(value: unknown): string {
  const text = value == null ? '' : String(value)
  // Quote when the field contains a comma, quote, or newline; double inner quotes.
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

/**
 * Serialize rows to CSV, prefixed with a UTF-8 BOM. Fields containing
 * commas, quotes, or newlines are quoted with doubled inner quotes per
 * RFC 4180.
 */
export function serializeCsv(rows: unknown[][]): string {
  return BOM + rows.map((row) => row.map(escapeCsvField).join(',')).join('\r\n')
}

/** Serialize rows to TSV (for clipboard paste into spreadsheets). Tabs/newlines inside fields become spaces. */
export function serializeTsv(rows: unknown[][]): string {
  return rows
    .map((row) =>
      row.map((value) => (value == null ? '' : String(value).replace(/[\t\n\r]+/g, ' '))).join('\t')
    )
    .join('\n')
}

function exportableColumns<TData>(table: Table<TData>) {
  return table.getVisibleLeafColumns().filter((column) => !UTILITY_COLUMN_IDS.has(column.id))
}

function columnHeaderLabel(column: {
  id: string
  columnDef: { header?: unknown; meta?: { label?: string } }
}): string {
  if (column.columnDef.meta?.label) return column.columnDef.meta.label
  if (typeof column.columnDef.header === 'string') return column.columnDef.header
  return column.id
}

function tableToMatrix<TData>(table: Table<TData>, rows: Row<TData>[]): unknown[][] {
  const columns = exportableColumns(table)
  const header = columns.map((column) => columnHeaderLabel(column))
  const body = rows.map((row) => columns.map((column) => row.getValue(column.id)))
  return [header, ...body]
}

/**
 * Build the CSV for a table's current view: visible (non-utility) columns of
 * the filtered + sorted rows, pre-pagination. In server-side mode the row
 * model only holds the current page, so only that page is exported.
 */
export function tableToCsv<TData>(table: Table<TData>): string {
  return serializeCsv(tableToMatrix(table, table.getPrePaginationRowModel().rows))
}

/** Build a TSV of the currently selected rows (respects the active filter). */
export function selectionToTsv<TData>(table: Table<TData>): string {
  return serializeTsv(tableToMatrix(table, table.getFilteredSelectedRowModel().rows))
}

/** Trigger a browser download of the table's current view as CSV. */
export function exportTableToCsv<TData>(table: Table<TData>, filename = 'export.csv'): void {
  const blob = new Blob([tableToCsv(table)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  anchor.click()
  URL.revokeObjectURL(url)
}

/** Copy the selected rows to the clipboard as TSV (pasteable into a spreadsheet). */
export async function copySelectionAsTsv<TData>(table: Table<TData>): Promise<void> {
  await navigator.clipboard.writeText(selectionToTsv(table))
}
