import * as React from "react"
import { Skeleton as SkeletonBase } from "#components/shadcn-base/skeleton"
import { cn } from "#lib/utils"

function Skeleton({
  className,
  ...props
}: React.ComponentProps<typeof SkeletonBase>) {
  // restyle: prepend overrides before `className`
  return <SkeletonBase className={cn(className)} {...props} />
}

export { Skeleton }
