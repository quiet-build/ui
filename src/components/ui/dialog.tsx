import * as React from "react"
import {
  DialogContent as DialogContentBase,
  DialogDescription as DialogDescriptionBase,
  DialogFooter as DialogFooterBase,
  DialogHeader as DialogHeaderBase,
  DialogOverlay as DialogOverlayBase,
  DialogTitle as DialogTitleBase,
} from "#components/shadcn-base/dialog"
import { cn } from "#lib/utils"

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogOverlayBase>) {
  // restyle: prepend overrides before `className`
  return <DialogOverlayBase className={cn(className)} {...props} />
}

function DialogContent({
  className,
  ...props
}: React.ComponentProps<typeof DialogContentBase>) {
  // restyle: prepend overrides before `className`
  return <DialogContentBase className={cn(className)} {...props} />
}

function DialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof DialogHeaderBase>) {
  // restyle: prepend overrides before `className`
  return <DialogHeaderBase className={cn(className)} {...props} />
}

function DialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof DialogFooterBase>) {
  // restyle: prepend overrides before `className`
  return <DialogFooterBase className={cn(className)} {...props} />
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitleBase>) {
  // restyle: prepend overrides before `className`
  return <DialogTitleBase className={cn(className)} {...props} />
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescriptionBase>) {
  // restyle: prepend overrides before `className`
  return <DialogDescriptionBase className={cn(className)} {...props} />
}

export { Dialog, DialogClose, DialogPortal, DialogTrigger } from "#components/shadcn-base/dialog"
export {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
}
