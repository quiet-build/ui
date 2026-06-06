"use client"

import * as React from "react"

import { TooltipContent as TooltipContentBase } from "#components/shadcn-base/tooltip"
import { cn } from "#lib/utils"

function TooltipContent({
  className,
  ...props
}: React.ComponentProps<typeof TooltipContentBase>) {
  // restyle: prepend overrides before `className`
  return <TooltipContentBase className={cn(className)} {...props} />
}

export { TooltipContent }
export {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from "#components/shadcn-base/tooltip"
