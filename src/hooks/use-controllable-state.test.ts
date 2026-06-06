import { describe, it, expect, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useControllableState } from '#hooks/use-controllable-state'

describe('useControllableState', () => {
  it('uncontrolled: setter updates internal state and fires onChange', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControllableState({ value: undefined, defaultValue: 0, onChange }),
    )
    expect(result.current[0]).toBe(0)
    act(() => result.current[1](5))
    expect(result.current[0]).toBe(5)
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('controlled: setter fires onChange but does NOT mutate the returned value', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControllableState({ value: 1, defaultValue: 0, onChange }),
    )
    expect(result.current[0]).toBe(1)
    act(() => result.current[1](9))
    expect(onChange).toHaveBeenCalledWith(9)
    expect(result.current[0]).toBe(1) // parent owns the value; unchanged here
  })

  it('setter identity is stable across re-renders with a new onChange', () => {
    const { result, rerender } = renderHook(
      ({ cb }) => useControllableState({ value: undefined, defaultValue: 0, onChange: cb }),
      { initialProps: { cb: () => {} } },
    )
    const first = result.current[1]
    rerender({ cb: () => {} })
    expect(result.current[1]).toBe(first)
  })
})
