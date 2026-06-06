"use client"

import * as React from "react"
import { Label as LabelBase } from "#components/shadcn-base/label"

import { cn } from "#lib/utils"

function Label({ className, ...props }: React.ComponentProps<typeof LabelBase>) {
  // restyle: prepend overrides before `className`
  return <LabelBase className={cn(className)} {...props} />
}

export { Label }
