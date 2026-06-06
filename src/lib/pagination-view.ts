/**
 * Pure pagination view-model for DataTable. Concentrates the off-by-one and
 * boundary arithmetic plus the aria-label copy that was previously scattered
 * inline through the JSX, so it can be table-tested directly.
 */

export type PaginationViewState = {
  /** Zero-based current page index. */
  pageIndex: number
  /** Total page count from the table (may be 0). */
  pageCount: number
}

export type PaginationView = {
  /** One-based page number for display. */
  currentPage: number
  /** Total pages, floored at 1. */
  totalPages: number
  /** aria-label for the Previous button. */
  prevLabel: string
  /** aria-label for the Next button. */
  nextLabel: string
}

export function paginationView({
  pageIndex,
  pageCount,
}: PaginationViewState): PaginationView {
  const totalPages = Math.max(pageCount, 1)
  const currentPage = pageIndex + 1
  return {
    currentPage,
    totalPages,
    prevLabel: `Go to previous page, page ${Math.max(currentPage - 1, 1)}`,
    nextLabel: `Go to next page, page ${Math.min(currentPage + 1, totalPages)}`,
  }
}
