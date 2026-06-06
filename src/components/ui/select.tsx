"use client"

import * as React from "react"
import {
  SelectTrigger as SelectTriggerBase,
  SelectContent as SelectContentBase,
  SelectItem as SelectItemBase,
  SelectLabel as SelectLabelBase,
  SelectSeparator as SelectSeparatorBase,
  SelectScrollUpButton as SelectScrollUpButtonBase,
  SelectScrollDownButton as SelectScrollDownButtonBase,
} from "#components/shadcn-base/select"

import { cn } from "#lib/utils"

function SelectTrigger({
  className,
  ...props
}: React.ComponentProps<typeof SelectTriggerBase>) {
  // restyle: prepend overrides before `className`
  return <SelectTriggerBase className={cn(className)} {...props} />
}

function SelectContent({
  className,
  ...props
}: React.ComponentProps<typeof SelectContentBase>) {
  // restyle: prepend overrides before `className`
  return <SelectContentBase className={cn(className)} {...props} />
}

function SelectItem({
  className,
  ...props
}: React.ComponentProps<typeof SelectItemBase>) {
  // restyle: prepend overrides before `className`
  return <SelectItemBase className={cn(className)} {...props} />
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectLabelBase>) {
  // restyle: prepend overrides before `className`
  return <SelectLabelBase className={cn(className)} {...props} />
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectSeparatorBase>) {
  // restyle: prepend overrides before `className`
  return <SelectSeparatorBase className={cn(className)} {...props} />
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectScrollUpButtonBase>) {
  // restyle: prepend overrides before `className`
  return <SelectScrollUpButtonBase className={cn(className)} {...props} />
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectScrollDownButtonBase>) {
  // restyle: prepend overrides before `className`
  return <SelectScrollDownButtonBase className={cn(className)} {...props} />
}

export { Select, SelectGroup, SelectValue } from "#components/shadcn-base/select"

export {
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
