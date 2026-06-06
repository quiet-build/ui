import { describe, it, expect } from 'vitest'
import { toDisabledMatchers, resolveDateFormatter } from '#lib/date-bounds'

const min = new Date(2020, 0, 1)
const max = new Date(2020, 11, 31)

describe('toDisabledMatchers', () => {
  it('returns undefined with no bounds', () => {
    expect(toDisabledMatchers(undefined, undefined)).toBeUndefined()
  })

  it('emits a before matcher for minDate only', () => {
    expect(toDisabledMatchers(min, undefined)).toEqual([{ before: min }])
  })

  it('emits an after matcher for maxDate only', () => {
    expect(toDisabledMatchers(undefined, max)).toEqual([{ after: max }])
  })

  it('emits both, before then after', () => {
    expect(toDisabledMatchers(min, max)).toEqual([{ before: min }, { after: max }])
  })
})

describe('resolveDateFormatter', () => {
  it('formats with the requested locale', () => {
    const fmt = resolveDateFormatter('en-US')
    expect(fmt.format(new Date(2020, 0, 15))).toMatch(/January/)
  })

  it('falls back to the default locale when given an invalid one', () => {
    expect(() => resolveDateFormatter('not-a-locale!!')).not.toThrow()
  })
})
