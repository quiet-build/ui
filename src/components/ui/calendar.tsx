import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker, type DayPickerProps } from "react-day-picker"

import { buttonVariants } from "#components/ui/button"
import { cn } from "#lib/utils"

/**
 * Themed react-day-picker (v10). Use for inline date / date-range / multi-date
 * pickers, scheduling UIs, or anywhere you want a calendar grid. For a simple
 * "click trigger → popover with calendar" pattern, use `<DatePicker>` instead.
 *
 * All `DayPickerProps` pass through, so you get full v10 API: `mode="single" |
 * "range" | "multiple"`, `disabled` matchers, `defaultMonth`, `numberOfMonths`,
 * etc. Override individual element classes via `classNames`.
 *
 * @example  Single date
 * const [date, setDate] = React.useState<Date | undefined>(new Date())
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 *
 * @example  Range
 * const [range, setRange] = React.useState<DateRange | undefined>()
 * <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: "w-fit",
        months: "flex flex-col sm:flex-row gap-2 relative",
        month: "flex flex-col gap-4",
        month_caption:
          "flex justify-center pt-1 relative items-center h-7 text-sm font-medium",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1 absolute top-1 inset-x-1 z-10 justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        month_grid: "w-full border-collapse mt-2",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex items-center justify-center h-8",
        week: "flex w-full mt-1",
        day: cn(
          "size-8 text-center text-sm p-0 relative",
          "[&:has([data-selected])]:bg-accent",
          "first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20",
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-8 p-0 font-normal",
          "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
          "data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground",
          "data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground",
        ),
        today: "bg-accent text-accent-foreground rounded-md",
        outside:
          "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
        range_start: "rounded-l-md bg-primary text-primary-foreground",
        range_end: "rounded-r-md bg-primary text-primary-foreground",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevClassName, ...chevProps }) => {
          const Icon =
            orientation === "right" ? ChevronRightIcon : ChevronLeftIcon
          return (
            <Icon
              className={cn("size-4", chevClassName)}
              aria-hidden
              {...chevProps}
            />
          )
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
