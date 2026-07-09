# useControllableState

React hook for coordinating one controlled or uncontrolled value while keeping the setter identity stable.

## Import

```tsx
import { useControllableState } from './use-controllable-state'
```

This hook is an internal library helper. It is not exported from `@quietbuildlab/ui`.

## API

```tsx
function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue: T
  onChange?: (next: T) => void
}): [T, (next: T) => void]
```

## Behavior

- `value !== undefined` makes the hook controlled. The returned value follows `value`, and the setter only calls `onChange`.
- `value === undefined` makes the hook uncontrolled. Internal state starts at `defaultValue`, and the setter updates that state before calling `onChange`.
- The returned setter is stable across renders, even if the caller passes a fresh `onChange`.

## Caveat

A controlled value of `undefined` is indistinguishable from uncontrolled mode. Components whose value type includes `undefined`, such as clearable inputs, inherit that caveat.

## Source

- [Source](./use-controllable-state.ts)
