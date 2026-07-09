# Date Bounds

Pure DatePicker helpers for translating min/max dates and building locale-aware display formatters.

## Import

```ts
import { resolveDateFormatter, toDisabledMatchers } from './date-bounds'
```

These helpers are internal to the library. They are not exported from `@quietbuildlab/ui`.

## API

```ts
type DateBound = { before: Date } | { after: Date }

function toDisabledMatchers(minDate?: Date, maxDate?: Date): DateBound[] | undefined

function resolveDateFormatter(locale?: string): Intl.DateTimeFormat
```

## Behavior

- `toDisabledMatchers` converts inclusive `minDate` / `maxDate` props into the matcher shape expected by `react-day-picker`.
- It returns `undefined` when neither bound is present, so DatePicker can omit the `disabled` prop.
- `resolveDateFormatter` returns an `Intl.DateTimeFormat` with `dateStyle: "long"`.
- Invalid locale strings fall back to the runtime default locale.

## Source

- [Source](./date-bounds.ts)
