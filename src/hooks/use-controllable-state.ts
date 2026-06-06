import * as React from "react"

/**
 * Coordinate a single piece of controlled/uncontrolled state. A `value` of
 * `undefined` means uncontrolled — internal state drives the result and is
 * updated on change; otherwise `value` drives the result and only the change
 * callback fires. The returned setter is identity-stable across renders.
 *
 * Note: as with Radix's equivalent, a controlled value of `undefined` is
 * indistinguishable from uncontrolled. Components whose value type includes
 * `undefined` (e.g. a clearable date) inherit that long-standing caveat.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue: T
  onChange?: (next: T) => void
}): [T, (next: T) => void] {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<T>(defaultValue)
  const current = (isControlled ? value : internal) as T

  // Hold the latest callback in a ref so the setter's identity stays stable
  // even when the caller passes a fresh `onChange` each render.
  const onChangeRef = React.useRef(onChange)
  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChangeRef.current?.(next)
    },
    [isControlled],
  )

  return [current, setValue]
}
