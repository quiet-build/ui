import * as React from "react"

import { Switch as SwitchBase } from "#components/shadcn-base/switch"
import { cn } from "#lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchBase>) {
  // restyle: prepend overrides before `className`
  return <SwitchBase className={cn(className)} {...props} />
}

export { Switch }
