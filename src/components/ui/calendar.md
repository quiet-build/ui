# Calendar

Themed `react-day-picker` v10. Modes: `single` | `range` | `multiple`. Forwards all `DayPickerProps`.

## Import

```tsx
import { Calendar } from '@quietbuildlab/ui'
```

## Props

All `DayPickerProps` from `react-day-picker` v10, including:
- `mode`: `"single"` | `"range"` | `"multiple"` (default `"single"`)
- `selected`, `onSelect`: shape depends on `mode`
- `defaultMonth`, `month`, `onMonthChange`
- `numberOfMonths` (default 1)
- `disabled`: a `Matcher` (Date, range, predicate, etc.)
- `classNames`: per-element overrides

## Usage

Single date, inline:

```tsx
const [date, setDate] = useState<Date>()

<Calendar mode="single" selected={date} onSelect={setDate} />
```

Range with two months side-by-side:

```tsx
import type { DateRange } from 'react-day-picker'
const [range, setRange] = useState<DateRange>()

<Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />
```

## Notes

- Use directly for inline calendars; wrap in `<Popover>` for custom date-range pickers.
- For single-date selection in a popover with a formatted trigger, use `<DatePicker>` instead — it handles the popover + Calendar + formatting for you.

## Related

- [DatePicker](./date-picker.md) — popover wrapper for single-date selection
- [Popover](./popover.md) — for custom range pickers

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/calendar.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-calendar--default)
