import { describe, it, expect } from 'vitest'
import { paginationView } from '#lib/pagination-view'

describe('paginationView', () => {
  it('converts zero-based index to one-based page', () => {
    expect(paginationView({ pageIndex: 0, pageCount: 5 }).currentPage).toBe(1)
    expect(paginationView({ pageIndex: 2, pageCount: 5 }).currentPage).toBe(3)
  })

  it('floors totalPages at 1 for an empty table', () => {
    expect(paginationView({ pageIndex: 0, pageCount: 0 }).totalPages).toBe(1)
  })

  it('clamps the prev label at page 1', () => {
    expect(paginationView({ pageIndex: 0, pageCount: 5 }).prevLabel)
      .toBe('Go to previous page, page 1')
  })

  it('clamps the next label at totalPages', () => {
    expect(paginationView({ pageIndex: 4, pageCount: 5 }).nextLabel)
      .toBe('Go to next page, page 5')
  })

  it('advances labels mid-range', () => {
    const v = paginationView({ pageIndex: 2, pageCount: 5 })
    expect(v.prevLabel).toBe('Go to previous page, page 2')
    expect(v.nextLabel).toBe('Go to next page, page 4')
  })
})
