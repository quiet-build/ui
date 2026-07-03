import * as React from "react"

import {
  Sidebar as SidebarBase,
  SidebarContent as SidebarContentBase,
  SidebarFooter as SidebarFooterBase,
  SidebarHeader as SidebarHeaderBase,
  SidebarMenuButton as SidebarMenuButtonBase,
} from "#components/shadcn-base/sidebar"
import { cn } from "#lib/utils"

// Thin ui-layer wrappers - restyle here by prepending overrides before `className`.

function Sidebar({
  className,
  ...props
}: React.ComponentProps<typeof SidebarBase>) {
  return <SidebarBase className={cn(className)} {...props} />
}

function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<typeof SidebarHeaderBase>) {
  return <SidebarHeaderBase className={cn(className)} {...props} />
}

function SidebarContent({
  className,
  ...props
}: React.ComponentProps<typeof SidebarContentBase>) {
  return <SidebarContentBase className={cn(className)} {...props} />
}

function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<typeof SidebarFooterBase>) {
  return <SidebarFooterBase className={cn(className)} {...props} />
}

function SidebarMenuButton({
  className,
  ...props
}: React.ComponentProps<typeof SidebarMenuButtonBase>) {
  return <SidebarMenuButtonBase className={cn(className)} {...props} />
}

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenuButton }
export {
  SidebarProvider,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "#components/shadcn-base/sidebar"
