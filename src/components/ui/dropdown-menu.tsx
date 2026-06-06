import * as React from "react"
import {
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItemBase,
  DropdownMenuContent as DropdownMenuContentBase,
  DropdownMenuItem as DropdownMenuItemBase,
  DropdownMenuLabel as DropdownMenuLabelBase,
  DropdownMenuRadioItem as DropdownMenuRadioItemBase,
  DropdownMenuSeparator as DropdownMenuSeparatorBase,
  DropdownMenuShortcut as DropdownMenuShortcutBase,
  DropdownMenuSubContent as DropdownMenuSubContentBase,
  DropdownMenuSubTrigger as DropdownMenuSubTriggerBase,
} from "#components/shadcn-base/dropdown-menu"
import { cn } from "#lib/utils"

function DropdownMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContentBase>) {
  // restyle: prepend overrides before `className`
  return <DropdownMenuContentBase className={cn(className)} {...props} />
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuLabelBase>) {
  // restyle: prepend overrides before `className`
  return <DropdownMenuLabelBase className={cn(className)} {...props} />
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuItemBase>) {
  // restyle: prepend overrides before `className`
  return <DropdownMenuItemBase className={cn(className)} {...props} />
}

function DropdownMenuSubTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubTriggerBase>) {
  // restyle: prepend overrides before `className`
  return <DropdownMenuSubTriggerBase className={cn(className)} {...props} />
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubContentBase>) {
  // restyle: prepend overrides before `className`
  return <DropdownMenuSubContentBase className={cn(className)} {...props} />
}

function DropdownMenuCheckboxItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuCheckboxItemBase>) {
  // restyle: prepend overrides before `className`
  return <DropdownMenuCheckboxItemBase className={cn(className)} {...props} />
}

function DropdownMenuRadioItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioItemBase>) {
  // restyle: prepend overrides before `className`
  return <DropdownMenuRadioItemBase className={cn(className)} {...props} />
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparatorBase>) {
  // restyle: prepend overrides before `className`
  return <DropdownMenuSeparatorBase className={cn(className)} {...props} />
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcutBase>) {
  // restyle: prepend overrides before `className`
  return <DropdownMenuShortcutBase className={cn(className)} {...props} />
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuSub,
} from "#components/shadcn-base/dropdown-menu"
export {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
