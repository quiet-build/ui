import * as React from "react"
import {
  AlertDialogAction as AlertDialogActionBase,
  AlertDialogCancel as AlertDialogCancelBase,
  AlertDialogContent as AlertDialogContentBase,
  AlertDialogDescription as AlertDialogDescriptionBase,
  AlertDialogFooter as AlertDialogFooterBase,
  AlertDialogHeader as AlertDialogHeaderBase,
  AlertDialogMedia as AlertDialogMediaBase,
  AlertDialogOverlay as AlertDialogOverlayBase,
  AlertDialogTitle as AlertDialogTitleBase,
} from "#components/shadcn-base/alert-dialog"
import { cn } from "#lib/utils"

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogOverlayBase>) {
  // restyle: prepend overrides before `className`
  return <AlertDialogOverlayBase className={cn(className)} {...props} />
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogContentBase>) {
  // restyle: prepend overrides before `className`
  return <AlertDialogContentBase className={cn(className)} {...props} />
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogHeaderBase>) {
  // restyle: prepend overrides before `className`
  return <AlertDialogHeaderBase className={cn(className)} {...props} />
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogFooterBase>) {
  // restyle: prepend overrides before `className`
  return <AlertDialogFooterBase className={cn(className)} {...props} />
}

function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogMediaBase>) {
  // restyle: prepend overrides before `className`
  return <AlertDialogMediaBase className={cn(className)} {...props} />
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogTitleBase>) {
  // restyle: prepend overrides before `className`
  return <AlertDialogTitleBase className={cn(className)} {...props} />
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogDescriptionBase>) {
  // restyle: prepend overrides before `className`
  return <AlertDialogDescriptionBase className={cn(className)} {...props} />
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogActionBase>) {
  // restyle: prepend overrides before `className`
  return <AlertDialogActionBase className={cn(className)} {...props} />
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogCancelBase>) {
  // restyle: prepend overrides before `className`
  return <AlertDialogCancelBase className={cn(className)} {...props} />
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogTrigger,
} from "#components/shadcn-base/alert-dialog"

export {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogTitle,
}
