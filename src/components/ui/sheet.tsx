"use client"

import * as React from "react"
import {
  SheetContent as SheetContentBase,
  SheetHeader as SheetHeaderBase,
  SheetFooter as SheetFooterBase,
  SheetTitle as SheetTitleBase,
  SheetDescription as SheetDescriptionBase,
} from "#components/shadcn-base/sheet"
import { cn } from "#lib/utils"

function SheetContent({
  className,
  ...props
}: React.ComponentProps<typeof SheetContentBase>) {
  // restyle: prepend overrides before `className`
  return <SheetContentBase className={cn(className)} {...props} />
}

function SheetHeader({
  className,
  ...props
}: React.ComponentProps<typeof SheetHeaderBase>) {
  // restyle: prepend overrides before `className`
  return <SheetHeaderBase className={cn(className)} {...props} />
}

function SheetFooter({
  className,
  ...props
}: React.ComponentProps<typeof SheetFooterBase>) {
  // restyle: prepend overrides before `className`
  return <SheetFooterBase className={cn(className)} {...props} />
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetTitleBase>) {
  // restyle: prepend overrides before `className`
  return <SheetTitleBase className={cn(className)} {...props} />
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetDescriptionBase>) {
  // restyle: prepend overrides before `className`
  return <SheetDescriptionBase className={cn(className)} {...props} />
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
} from "#components/shadcn-base/sheet"

export {
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
