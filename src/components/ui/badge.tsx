import * as React from "react"

import { Badge as BadgeBase } from "#components/shadcn-base/badge"
import { cn } from "#lib/utils"

function Badge({
  className,
  ...props
}: React.ComponentProps<typeof BadgeBase>) {
  // restyle: prepend overrides before `className`
  return <BadgeBase className={cn(className)} {...props} />
}

export { Badge }
export { badgeVariants } from "#components/shadcn-base/badge"
