"use client"

import * as React from "react"
import { Toaster as ToasterBase } from "#components/shadcn-base/sonner"
import { cn } from "#lib/utils"

function Toaster({
  className,
  ...props
}: React.ComponentProps<typeof ToasterBase>) {
  // restyle: prepend overrides before `className`
  return <ToasterBase className={cn(className)} {...props} />
}

export { Toaster }
