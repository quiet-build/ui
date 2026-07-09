# Pagination View

Pure DataTable pagination view-model for display page numbers and accessible button labels.

## Import

```ts
import { paginationView, type PaginationViewState } from './pagination-view'
```

This helper is internal to the library. It is not exported from `@quietbuildlab/ui`.

## API

```ts
type PaginationViewState = {
  pageIndex: number
  pageCount: number
}

type PaginationView = {
  currentPage: number
  totalPages: number
  prevLabel: string
  nextLabel: string
}

function paginationView(state: PaginationViewState): PaginationView
```

## Behavior

- Converts zero-based `pageIndex` into a one-based `currentPage` for display.
- Floors `totalPages` at `1`, even when the table reports `0` pages.
- Generates bounded Previous/Next `aria-label` strings so controls do not announce page `0` or a page past the end.

## Source

- [Source](./pagination-view.ts)
