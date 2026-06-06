"use client"

import * as React from "react"
import { Checkbox as CheckboxBase } from "#components/shadcn-base/checkbox"
import { cn } from "#lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxBase>) {
  // restyle: prepend overrides before `className`
  return <CheckboxBase className={cn(className)} {...props} />
}

export { Checkbox }
