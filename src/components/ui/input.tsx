import * as React from "react"
import { Input as InputBase } from "#components/shadcn-base/input"

import { cn } from "#lib/utils"

function Input({ className, ...props }: React.ComponentProps<typeof InputBase>) {
  // restyle: prepend overrides before `className`
  return <InputBase className={cn(className)} {...props} />
}

export { Input }
