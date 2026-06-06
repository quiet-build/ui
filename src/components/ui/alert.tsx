import * as React from "react"
import {
  Alert as AlertBase,
  AlertTitle as AlertTitleBase,
  AlertDescription as AlertDescriptionBase,
  AlertAction as AlertActionBase,
} from "#components/shadcn-base/alert"
import { cn } from "#lib/utils"

function Alert({
  className,
  ...props
}: React.ComponentProps<typeof AlertBase>) {
  // restyle: prepend overrides before `className`
  return <AlertBase className={cn(className)} {...props} />
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertTitleBase>) {
  // restyle: prepend overrides before `className`
  return <AlertTitleBase className={cn(className)} {...props} />
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDescriptionBase>) {
  // restyle: prepend overrides before `className`
  return <AlertDescriptionBase className={cn(className)} {...props} />
}

function AlertAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertActionBase>) {
  // restyle: prepend overrides before `className`
  return <AlertActionBase className={cn(className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
