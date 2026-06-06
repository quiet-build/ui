import * as React from "react"

import {
  Avatar as AvatarBase,
  AvatarImage as AvatarImageBase,
  AvatarFallback as AvatarFallbackBase,
  AvatarBadge as AvatarBadgeBase,
  AvatarGroup as AvatarGroupBase,
  AvatarGroupCount as AvatarGroupCountBase,
} from "#components/shadcn-base/avatar"
import { cn } from "#lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarBase>) {
  // restyle: prepend overrides before `className`
  return <AvatarBase className={cn(className)} {...props} />
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarImageBase>) {
  return <AvatarImageBase className={cn(className)} {...props} />
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarFallbackBase>) {
  return <AvatarFallbackBase className={cn(className)} {...props} />
}

function AvatarBadge({
  className,
  ...props
}: React.ComponentProps<typeof AvatarBadgeBase>) {
  return <AvatarBadgeBase className={cn(className)} {...props} />
}

function AvatarGroup({
  className,
  ...props
}: React.ComponentProps<typeof AvatarGroupBase>) {
  return <AvatarGroupBase className={cn(className)} {...props} />
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<typeof AvatarGroupCountBase>) {
  return <AvatarGroupCountBase className={cn(className)} {...props} />
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
