"use client"

import * as React from "react"
import { ChevronLeftIcon } from "lucide-react"

import { cn } from "#lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#components/shadcn-base/tooltip"

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

type SidebarContextValue = {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) {
    throw new Error("useSidebar must be used within a <SidebarProvider>")
  }
  return ctx
}

function SidebarProvider({
  defaultCollapsed = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  children,
}: {
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  children: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultCollapsed)
  const isControlled = collapsedProp !== undefined
  const collapsed = isControlled ? collapsedProp : uncontrolled

  const setCollapsed = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setUncontrolled(value)
      onCollapsedChange?.(value)
    },
    [isControlled, onCollapsedChange]
  )

  const value = React.useMemo<SidebarContextValue>(
    () => ({ collapsed, setCollapsed, toggle: () => setCollapsed(!collapsed) }),
    [collapsed, setCollapsed]
  )

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delay={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*  Shell                                                                      */
/* -------------------------------------------------------------------------- */

function Sidebar({
  className,
  style,
  ...props
}: React.ComponentProps<"aside">) {
  const { collapsed } = useSidebar()
  return (
    <aside
      data-slot="sidebar"
      data-collapsed={collapsed}
      className={cn(
        "group/sidebar relative flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        "w-[var(--sidebar-width,16rem)] data-[collapsed=true]:w-[var(--sidebar-width-collapsed,4.5rem)]",
        "transition-[width] duration-300 ease-in-out",
        className
      )}
      style={style}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        "flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4",
        "group-data-[collapsed=true]/sidebar:justify-center group-data-[collapsed=true]/sidebar:px-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-3",
        "group-data-[collapsed=true]/sidebar:items-center group-data-[collapsed=true]/sidebar:px-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        "mt-auto flex flex-col gap-1 border-t border-sidebar-border p-3",
        "group-data-[collapsed=true]/sidebar:items-center group-data-[collapsed=true]/sidebar:px-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "px-3 pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground",
        "group-data-[collapsed=true]/sidebar:hidden",
        className
      )}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Menu                                                                       */
/* -------------------------------------------------------------------------- */

function SidebarMenu({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="sidebar-menu"
      className={cn("flex w-full flex-col gap-0.5", className)}
      {...props}
    />
  )
}

type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  isActive?: boolean
  icon?: React.ReactNode
  /** Label used for the flyout tooltip when collapsed. Defaults to children. */
  tooltip?: React.ReactNode
}

function SidebarMenuButton({
  className,
  isActive = false,
  icon,
  tooltip,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { collapsed } = useSidebar()

  const button = (
    <button
      type="button"
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        "group/item relative flex h-10 w-full items-center gap-3 rounded-md px-2.5 text-sm font-medium outline-none transition-colors",
        "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar",
        // active
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-foreground",
        "before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r before:bg-sidebar-primary before:opacity-0 before:transition-opacity data-[active=true]:before:opacity-100",
        // collapsed rail: square, centered
        "group-data-[collapsed=true]/sidebar:size-10 group-data-[collapsed=true]/sidebar:justify-center group-data-[collapsed=true]/sidebar:px-0",
        className
      )}
      {...props}
    >
      {icon ? (
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center [&_svg]:size-5",
            "text-current group-data-[active=true]/item:text-sidebar-primary data-[active=true]:text-sidebar-primary"
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="truncate group-data-[collapsed=true]/sidebar:hidden">
        {children}
      </span>
    </button>
  )

  if (!collapsed) return button

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent side="right" sideOffset={12}>
        {tooltip ?? children}
      </TooltipContent>
    </Tooltip>
  )
}

/* -------------------------------------------------------------------------- */
/*  Trigger / rail                                                             */
/* -------------------------------------------------------------------------- */

function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { collapsed, toggle } = useSidebar()
  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      onClick={toggle}
      className={cn(
        "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon
        className={cn(
          "size-4 transition-transform duration-300",
          collapsed && "rotate-180"
        )}
      />
    </button>
  )
}

/** Floating round toggle that straddles the sidebar's right edge. */
function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { collapsed, toggle } = useSidebar()
  return (
    <button
      type="button"
      data-slot="sidebar-rail"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      onClick={toggle}
      className={cn(
        "absolute -right-3 top-14 z-30 flex size-6 items-center justify-center rounded-full border border-sidebar-border bg-popover text-muted-foreground shadow-sm transition-colors hover:text-sidebar-foreground",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon
        className={cn(
          "size-3.5 transition-transform duration-300",
          collapsed && "rotate-180"
        )}
      />
    </button>
  )
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
}
