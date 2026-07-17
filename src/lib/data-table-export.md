# data-table-export.ts

## Purpose

Dependency-free CSV/TSV serialization for `DataTable`/`DataGrid`: pure
serializers (`serializeCsv`, `serializeTsv`), table-aware builders
(`tableToCsv`, `selectionToTsv`), and browser-side actions
(`exportTableToCsv` download, `copySelectionAsTsv` clipboard). Re-exported
publicly through `src/components/ui/data-table.tsx`.

## Behavior

- CSV output is UTF-8-BOM-prefixed (Excel compatibility) and RFC-4180
  quoted: fields containing commas, quotes, or newlines are wrapped in
  double quotes with inner quotes doubled; rows join with CRLF.
- TSV output (for clipboard → spreadsheet paste) replaces tabs/newlines
  inside fields with spaces; no quoting.
- Table exports cover the **visible, non-utility** leaf columns (the
  built-in `select`/`expand` columns are excluded) of the filtered + sorted
  **pre-pagination** row model — i.e. the current view across all pages in
  client mode, or only the current page in server-side mode (the row model
  can't see more). Header labels resolve `meta.label` → string `header` →
  column id, matching `DataTableViewOptions`.
- `selectionToTsv` uses `getFilteredSelectedRowModel()` (selected rows that
  survive the active filter).

## Maintenance

Pure functions are node-tested in `data-table-export.test.ts`. Keep the
utility-column id set in sync with the utility columns `DataTable` injects.
