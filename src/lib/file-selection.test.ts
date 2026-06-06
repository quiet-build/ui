import { describe, it, expect } from 'vitest'
import { matchesAccept, validateFile, selectFiles } from '#lib/file-selection'

function f(name: string, type = '', size = 0): File {
  return new File(['x'.repeat(size)], name, { type })
}

describe('matchesAccept', () => {
  it('matches wildcard MIME (image/*)', () => {
    expect(matchesAccept(f('a.png', 'image/png'), 'image/*')).toBe(true)
    expect(matchesAccept(f('a.pdf', 'application/pdf'), 'image/*')).toBe(false)
  })

  it('matches by extension, case-insensitively', () => {
    expect(matchesAccept(f('Doc.PDF'), '.pdf')).toBe(true)
    expect(matchesAccept(f('a.txt'), '.pdf')).toBe(false)
  })

  it('matches exact MIME type', () => {
    expect(matchesAccept(f('a', 'application/pdf'), 'application/pdf')).toBe(true)
  })

  it('matches any token in a comma list', () => {
    expect(matchesAccept(f('a.docx'), 'image/*,.pdf,.docx')).toBe(true)
  })
})

describe('validateFile', () => {
  it('rejects files over maxSize', () => {
    expect(validateFile(f('a', '', 11), { multiple: false, maxSize: 10 }))
      .toBe('file-too-large')
  })

  it('rejects types outside accept', () => {
    expect(validateFile(f('a.txt', 'text/plain'), { multiple: false, accept: 'image/*' }))
      .toBe('invalid-type')
  })

  it('passes when within policy', () => {
    expect(validateFile(f('a.png', 'image/png', 5), { multiple: true, accept: 'image/*', maxSize: 10 }))
      .toBe(null)
  })
})

describe('selectFiles', () => {
  it('replaces selection when not multiple', () => {
    const r = selectFiles([f('old')], [f('new'), f('extra')], { multiple: false })
    expect(r.next.map((x) => x.name)).toEqual(['new'])
    expect(r.rejections).toEqual([])
  })

  it('appends to selection when multiple', () => {
    const r = selectFiles([f('a')], [f('b'), f('c')], { multiple: true })
    expect(r.next.map((x) => x.name)).toEqual(['a', 'b', 'c'])
  })

  it('collects per-file rejections and keeps the valid ones', () => {
    const policy = { multiple: true, accept: 'image/*' }
    const r = selectFiles([], [f('ok.png', 'image/png'), f('no.txt', 'text/plain')], policy)
    expect(r.next.map((x) => x.name)).toEqual(['ok.png'])
    expect(r.rejections).toEqual([{ file: r.rejections[0].file, reason: 'invalid-type' }])
  })

  it('trims to maxFiles and reports too-many-files last', () => {
    const r = selectFiles([], [f('a'), f('b'), f('c')], { multiple: true, maxFiles: 2 })
    expect(r.next.map((x) => x.name)).toEqual(['a', 'b'])
    expect(r.rejections).toEqual([{ reason: 'too-many-files' }])
  })
})
