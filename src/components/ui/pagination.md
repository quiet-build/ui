# Pagination

Numbered pagination UI primitives. No logic — wire up `href`s or `onClick` yourself.

For a complete table with pagination wired up, use `<DataTable>` instead.

## Import

```tsx
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis,
} from '@quietbuildlab/ui'
```

## Props

**PaginationLink** extra props: `isActive?: boolean`, `size` (matches Button `size`), plus standard `<a>` attributes (`href`, `onClick`, etc.).

## Usage

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>
    <PaginationItem><PaginationLink href="?page=1" isActive>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="?page=2">2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationNext href="?page=2" /></PaginationItem>
  </PaginationContent>
</Pagination>
```

## Notes

- Use `<PaginationLink asChild>` to render as a router link (`<Link>`) instead of a native `<a>`.
- For table data, prefer `<DataTable>` which manages pagination state for you.

## Related

- [DataTable](./data-table.md) — full table with pagination
- [Table](./table.md) — styling-only primitives

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/pagination.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-pagination--default)
