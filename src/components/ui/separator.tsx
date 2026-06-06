import * as React from "react"
import { Separator as SeparatorBase } from "#components/shadcn-base/separator"

import { cn } from "#lib/utils"

function Separator({
  className,
  ...props
}: React.ComponentProps<typeof SeparatorBase>) {
  // restyle: prepend overrides before `className`
  return <SeparatorBase className={cn(className)} {...props} />
}

export { Separator }
