# DatePicker

Single-date popover picker built on `Popover` + `Calendar`. Default layout renders trigger + content; pass children for full compound control.

For *range* selection or *multiple-date* selection, use `<Calendar>` directly inside a `<Popover>`.

## Import

```tsx
import { DatePicker, DatePickerTrigger, DatePickerContent } from '@quietbuildlab/ui'
```

## Props

**DatePicker**:
- `value` / `defaultValue`: `Date | undefined`
- `onValueChange(date: Date | undefined)`
- `open` / `defaultOpen` / `onOpenChange`
- `minDate` / `maxDate`: `Date` bounds
- `locale`: BCP 47 string (default uses `Intl.DateTimeFormat` default)
- `format`: `(date: Date, locale: string) => string` — custom formatter for the trigger label
- `placeholder`: shown when no date selected
- `disabled`

## Usage

Default layout — renders trigger + content automatically:

```tsx
const [date, setDate] = useState<Date>()

<DatePicker value={date} onValueChange={setDate} placeholder="Pick a date" />
```

Compound control — full control over trigger styling and content placement:

```tsx
<DatePicker value={date} onValueChange={setDate}>
  <DatePickerTrigger>
    <Button variant="outline">{date?.toDateString() ?? 'Pick a date'}</Button>
  </DatePickerTrigger>
  <DatePickerContent align="end" />
</DatePicker>
```

## Notes

- `onValueChange` may receive `undefined` if the user clears the selection.
- For ranges or multi-date, drop down to `<Calendar mode="range">` inside `<Popover>`.

## Related

- [Calendar](./calendar.md), [Popover](./popover.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/date-picker.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-datepicker--default)
