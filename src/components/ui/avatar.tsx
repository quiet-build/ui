import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "#lib/utils"

/**
 * User avatar with image + fallback. Falls back to `AvatarFallback`
 * (usually initials) when the image fails to load or while it's loading.
 *
 * Accessibility: when the image loads, screen readers read the `alt` on
 * `AvatarImage`. When the image fails and the fallback ("AL") renders, AT
 * users hear just the initials with no context. If the fallback might be
 * shown to AT users, set an `aria-label` on `<Avatar>` (e.g.
 * `aria-label="Ada Lovelace"`) so the avatar has a descriptive name in both
 * states.
 *
 * @example
 * <Avatar aria-label="Ada Lovelace">
 *   <AvatarImage src="https://example.com/u.jpg" alt="Ada Lovelace" />
 *   <AvatarFallback>AL</AvatarFallback>
 * </Avatar>
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-xs font-medium uppercase",
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
