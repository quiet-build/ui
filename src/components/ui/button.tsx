import * as React from "react"

import { Button as ButtonBase } from "#components/shadcn-base/button"
import { cn } from "#lib/utils"

function Button({
  className,
  ...props
}: React.ComponentProps<typeof ButtonBase>) {
  // restyle: prepend overrides before `className`
  return <ButtonBase className={cn(className)} {...props} />
}

export { Button }
export { buttonVariants } from "#components/shadcn-base/button"
