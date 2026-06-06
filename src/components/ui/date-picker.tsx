import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "#components/ui/button"
import { Calendar } from "#components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#components/ui/popover"
import { cn } from "#lib/utils"

/* ─────────────────────────────────────────────────────────────────────────
 * Context — shared by DatePicker root and its subcomponents
 * ─────────────────────────────────────────────────────────────────────── */

type DatePickerContextValue = {
  value: Date | undefined
  setValue: (date: Date | undefined) => void
  placeholder: string
  disabled: boolean
  format: (date: Date) => string
  minDate?: Date
  maxDate?: Date
  /** Programmatically close the popover (used after selection). */
  close: () => void
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(
  null,
)

function useDatePicker(): DatePickerContextValue {
  const ctx = React.useContext(DatePickerContext)
  if (!ctx) {
    throw new Error(
      "DatePicker subcomponents must be used inside a <DatePicker> root.",
    )
  }
  return ctx
}

/* ─────────────────────────────────────────────────────────────────────────
 * Root
 * ─────────────────────────────────────────────────────────────────────── */

export type DatePickerProps = {
  /** Controlled value. Pair with `onValueChange`. */
  value?: Date
  /** Uncontrolled initial value. */
  defaultValue?: Date
  /** Fires whenever the selected date changes (including clear → `undefined`). */
  onValueChange?: (date: Date | undefined) => void
  /** Trigger label when no date is selected. */
  placeholder?: string
  disabled?: boolean
  /** Earliest selectable date (inclusive). */
  minDate?: Date
  /** Latest selectable date (inclusive). */
  maxDate?: Date
  /** Locale for the default date formatter (Intl.DateTimeFormat). */
  locale?: string
  /** Custom formatter for the trigger label. Defaults to `dateStyle: 'long'`. */
  format?: (date: Date) => string
  /**
   * Custom layout. If omitted, renders the default Trigger + Content + Calendar.
   * Pass `DatePickerTrigger` + `DatePickerContent` for full control.
   */
  children?: React.ReactNode
}

/**
 * Single-date picker built on `<Popover>` + `<Calendar>`. The compound API
 * lets you customize the trigger, popover content, and calendar independently.
 *
 * For range or multi-date selection, drop down to `<Popover>` + `<Calendar
 * mode="range">` directly — that keeps DatePicker focused on the common case.
 *
 * @example  Easy
 * const [date, setDate] = React.useState<Date | undefined>()
 * <DatePicker value={date} onValueChange={setDate} placeholder="Pick a date" />
 *
 * @example  Customizable
 * <DatePicker value={date} onValueChange={setDate}>
 *   <DatePickerTrigger variant="ghost">{date ? fmt(date) : "When?"}</DatePickerTrigger>
 *   <DatePickerContent align="end" />
 * </DatePicker>
 */
function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date",
  disabled = false,
  minDate,
  maxDate,
  locale,
  format: formatProp,
  children,
}: DatePickerProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue)
  const current = isControlled ? value : internal
  const [open, setOpen] = React.useState(false)

  // Stable default formatter using Intl.DateTimeFormat (zero dep).
  const defaultFormatter = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: "long" })
    } catch {
      return new Intl.DateTimeFormat(undefined, { dateStyle: "long" })
    }
  }, [locale])

  const format = React.useCallback(
    (d: Date) => (formatProp ? formatProp(d) : defaultFormatter.format(d)),
    [formatProp, defaultFormatter],
  )

  const setValue = React.useCallback(
    (next: Date | undefined) => {
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const close = React.useCallback(() => setOpen(false), [])

  const ctxValue = React.useMemo<DatePickerContextValue>(
    () => ({
      value: current,
      setValue,
      placeholder,
      disabled,
      format,
      minDate,
      maxDate,
      close,
    }),
    [current, setValue, placeholder, disabled, format, minDate, maxDate, close],
  )

  return (
    <DatePickerContext.Provider value={ctxValue}>
      <Popover open={open} onOpenChange={setOpen}>
        {children ?? (
          <>
            <DatePickerTrigger />
            <DatePickerContent />
          </>
        )}
      </Popover>
    </DatePickerContext.Provider>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Trigger — Button wrapped by PopoverTrigger
 * ─────────────────────────────────────────────────────────────────────── */

type DatePickerTriggerProps = React.ComponentProps<typeof Button>

function DatePickerTrigger({
  className,
  children,
  variant,
  size,
  disabled,
  ...props
}: DatePickerTriggerProps) {
  const { value, placeholder, disabled: ctxDisabled, format } = useDatePicker()
  return (
    <PopoverTrigger
      render={
        <Button
          {...props}
          type="button"
          variant={variant ?? "outline"}
          size={size ?? "default"}
          disabled={ctxDisabled || disabled}
          data-slot="date-picker-trigger"
          data-empty={!value || undefined}
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="size-4" aria-hidden />
          {children ?? (value ? format(value) : placeholder)}
        </Button>
      }
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Content — PopoverContent wrapping a Calendar
 * ─────────────────────────────────────────────────────────────────────── */

type DatePickerContentProps = Omit<
  React.ComponentProps<typeof PopoverContent>,
  "children"
> & {
  /** Override the default Calendar — render anything inside the popover. */
  children?: React.ReactNode
}

function DatePickerContent({
  className,
  align = "start",
  children,
  ...props
}: DatePickerContentProps) {
  const { value, setValue, minDate, maxDate, close } = useDatePicker()
  // Build the v10 `disabled` matcher list from min/max bounds.
  const disabledMatchers = React.useMemo(() => {
    const arr: Array<{ before: Date } | { after: Date }> = []
    if (minDate) arr.push({ before: minDate })
    if (maxDate) arr.push({ after: maxDate })
    return arr.length > 0 ? arr : undefined
  }, [minDate, maxDate])

  return (
    <PopoverContent
      {...props}
      align={align}
      data-slot="date-picker-content"
      className={cn("w-auto p-0", className)}
    >
      {children ?? (
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            setValue(d)
            // Only auto-close when a real date is selected (not when toggling off).
            if (d) close()
          }}
          disabled={disabledMatchers}
          defaultMonth={value ?? minDate}
          autoFocus
        />
      )}
    </PopoverContent>
  )
}

export { DatePicker, DatePickerContent, DatePickerTrigger }
