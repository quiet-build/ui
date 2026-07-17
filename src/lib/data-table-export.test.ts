// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { serializeCsv, serializeTsv } from './data-table-export'

describe('serializeCsv', () => {
  it('prefixes a UTF-8 BOM and joins rows with CRLF', () => {
    const csv = serializeCsv([
      ['a', 'b'],
      ['1', '2'],
    ])
    expect(csv.charCodeAt(0)).toBe(0xfeff)
    expect(csv.slice(1)).toBe('a,b\r\n1,2')
  })

  it('quotes fields containing commas, quotes, and newlines per RFC 4180', () => {
    const csv = serializeCsv([['plain', 'a,b', 'say "hi"', 'line1\nline2']])
    expect(csv.slice(1)).toBe('plain,"a,b","say ""hi""","line1\nline2"')
  })

  it('serializes null/undefined as empty fields and preserves numbers', () => {
    const csv = serializeCsv([[null, undefined, 42, 0]])
    expect(csv.slice(1)).toBe(',,42,0')
  })
})

describe('serializeTsv', () => {
  it('joins with tabs/newlines and never quotes', () => {
    expect(
      serializeTsv([
        ['a', 'b'],
        ['1', '2'],
      ])
    ).toBe('a\tb\n1\t2')
  })

  it('flattens tabs and newlines inside fields to spaces', () => {
    expect(serializeTsv([['a\tb', 'c\nd']])).toBe('a b\tc d')
  })
})
