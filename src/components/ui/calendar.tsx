"use client"

import * as React from "react"

import {
  Calendar as CalendarBase,
  CalendarDayButton as CalendarDayButtonBase,
} from "#components/shadcn-base/calendar"
import { cn } from "#lib/utils"

function Calendar({
  className,
  ...props
}: React.ComponentProps<typeof CalendarBase>) {
  // restyle: prepend overrides before `className`
  return <CalendarBase className={cn(className)} {...props} />
}

function CalendarDayButton({
  className,
  ...props
}: React.ComponentProps<typeof CalendarDayButtonBase>) {
  // restyle: prepend overrides before `className`
  return <CalendarDayButtonBase className={cn(className)} {...props} />
}

export { Calendar, CalendarDayButton }
