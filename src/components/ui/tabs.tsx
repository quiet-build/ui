import * as React from "react"

import {
  Tabs as TabsBase,
  TabsList as TabsListBase,
  TabsTrigger as TabsTriggerBase,
  TabsContent as TabsContentBase,
} from "#components/shadcn-base/tabs"
import { cn } from "#lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsBase>) {
  // restyle: prepend overrides before `className`
  return <TabsBase className={cn(className)} {...props} />
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsListBase>) {
  return <TabsListBase className={cn(className)} {...props} />
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsTriggerBase>) {
  return <TabsTriggerBase className={cn(className)} {...props} />
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsContentBase>) {
  return <TabsContentBase className={cn(className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
export { tabsListVariants } from "#components/shadcn-base/tabs"
