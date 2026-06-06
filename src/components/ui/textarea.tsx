import * as React from "react"

import { Textarea as TextareaBase } from "#components/shadcn-base/textarea"
import { cn } from "#lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof TextareaBase>) {
  // restyle: prepend overrides before `className`
  return <TextareaBase className={cn(className)} {...props} />
}

export { Textarea }
