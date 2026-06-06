/**
 * Date-bound helpers for DatePicker. Names the one place that knows
 * react-day-picker's `disabled` matcher shape, and the locale-fallback
 * formatter, so both are unit-testable without rendering the component.
 */

/** A single before/after bound in react-day-picker's matcher format. */
export type DateBound = { before: Date } | { after: Date }

/**
 * Translate inclusive `minDate`/`maxDate` bounds into react-day-picker's
 * `disabled` matcher list, or `undefined` when there are no bounds.
 */
export function toDisabledMatchers(
  minDate?: Date,
  maxDate?: Date,
): DateBound[] | undefined {
  const arr: DateBound[] = []
  if (minDate) arr.push({ before: minDate })
  if (maxDate) arr.push({ after: maxDate })
  return arr.length > 0 ? arr : undefined
}

/**
 * Build a `dateStyle: "long"` formatter for `locale`, falling back to the
 * runtime default locale if the requested one is invalid.
 */
export function resolveDateFormatter(locale?: string): Intl.DateTimeFormat {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "long" })
  } catch {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "long" })
  }
}
