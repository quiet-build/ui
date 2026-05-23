# Table

Semantic HTML table primitives — styling only, no data logic. For pagination, sorting, or filtering, use `<DataTable>`.

## Import

```tsx
import {
  Table, TableHeader, TableBody, TableFooter,
  TableHead, TableRow, TableCell, TableCaption,
} from '@quietbuildlab/ui'
```

## Sub-components

All accept `React.ComponentProps` of their underlying HTML element (`table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, `caption`).

## Usage

```tsx
<Table>
  <TableCaption>Recent invoices</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV-001</TableCell>
      <TableCell>$120.00</TableCell>
      <TableCell>Paid</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Notes

- This is the *styling layer* only. For anything more than a static list, reach for `<DataTable>`.
- Wrap in a `<div className="overflow-x-auto">` if the columns might overflow on narrow viewports.

## Related

- [DataTable](./data-table.md) — TanStack-powered table with pagination + loading state
- [Pagination](./pagination.md) — pagination primitives if you build your own

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/table.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-table--default)
