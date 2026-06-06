import * as React from "react"
import {
  RadioGroup as RadioGroupBase,
  RadioGroupItem as RadioGroupItemBase,
} from "#components/shadcn-base/radio-group"

import { cn } from "#lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupBase>) {
  // restyle: prepend overrides before `className`
  return <RadioGroupBase className={cn(className)} {...props} />
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupItemBase>) {
  // restyle: prepend overrides before `className`
  return <RadioGroupItemBase className={cn(className)} {...props} />
}

export { RadioGroup, RadioGroupItem }
