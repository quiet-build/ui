import * as React from "react"

import {
  Card as CardBase,
  CardHeader as CardHeaderBase,
  CardFooter as CardFooterBase,
  CardTitle as CardTitleBase,
  CardAction as CardActionBase,
  CardDescription as CardDescriptionBase,
  CardContent as CardContentBase,
} from "#components/shadcn-base/card"
import { cn } from "#lib/utils"

function Card({
  className,
  ...props
}: React.ComponentProps<typeof CardBase>) {
  // restyle: prepend overrides before `className`
  return <CardBase className={cn(className)} {...props} />
}

function CardHeader({
  className,
  ...props
}: React.ComponentProps<typeof CardHeaderBase>) {
  return <CardHeaderBase className={cn(className)} {...props} />
}

function CardFooter({
  className,
  ...props
}: React.ComponentProps<typeof CardFooterBase>) {
  return <CardFooterBase className={cn(className)} {...props} />
}

function CardTitle({
  className,
  ...props
}: React.ComponentProps<typeof CardTitleBase>) {
  return <CardTitleBase className={cn(className)} {...props} />
}

function CardAction({
  className,
  ...props
}: React.ComponentProps<typeof CardActionBase>) {
  return <CardActionBase className={cn(className)} {...props} />
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<typeof CardDescriptionBase>) {
  return <CardDescriptionBase className={cn(className)} {...props} />
}

function CardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardContentBase>) {
  return <CardContentBase className={cn(className)} {...props} />
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
