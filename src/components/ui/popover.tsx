import * as React from "react"
import {
  PopoverContent as PopoverContentBase,
  PopoverDescription as PopoverDescriptionBase,
  PopoverHeader as PopoverHeaderBase,
  PopoverTitle as PopoverTitleBase,
} from "#components/shadcn-base/popover"

import { cn } from "#lib/utils"

function PopoverContent({
  className,
  ...props
}: React.ComponentProps<typeof PopoverContentBase>) {
  // restyle: prepend overrides before `className`
  return <PopoverContentBase className={cn(className)} {...props} />
}

function PopoverHeader({
  className,
  ...props
}: React.ComponentProps<typeof PopoverHeaderBase>) {
  // restyle: prepend overrides before `className`
  return <PopoverHeaderBase className={cn(className)} {...props} />
}

function PopoverTitle({
  className,
  ...props
}: React.ComponentProps<typeof PopoverTitleBase>) {
  // restyle: prepend overrides before `className`
  return <PopoverTitleBase className={cn(className)} {...props} />
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<typeof PopoverDescriptionBase>) {
  // restyle: prepend overrides before `className`
  return <PopoverDescriptionBase className={cn(className)} {...props} />
}

export { Popover, PopoverTrigger } from "#components/shadcn-base/popover"

export {
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
}
