import * as React from "react"
import {
  Pagination as PaginationBase,
  PaginationContent as PaginationContentBase,
  PaginationEllipsis as PaginationEllipsisBase,
  PaginationLink as PaginationLinkBase,
  PaginationNext as PaginationNextBase,
  PaginationPrevious as PaginationPreviousBase,
} from "#components/shadcn-base/pagination"

import { cn } from "#lib/utils"

function Pagination({
  className,
  ...props
}: React.ComponentProps<typeof PaginationBase>) {
  // restyle: prepend overrides before `className`
  return <PaginationBase className={cn(className)} {...props} />
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<typeof PaginationContentBase>) {
  // restyle: prepend overrides before `className`
  return <PaginationContentBase className={cn(className)} {...props} />
}

function PaginationLink({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLinkBase>) {
  // restyle: prepend overrides before `className`
  return <PaginationLinkBase className={cn(className)} {...props} />
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationPreviousBase>) {
  // restyle: prepend overrides before `className`
  return <PaginationPreviousBase className={cn(className)} {...props} />
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationNextBase>) {
  // restyle: prepend overrides before `className`
  return <PaginationNextBase className={cn(className)} {...props} />
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<typeof PaginationEllipsisBase>) {
  // restyle: prepend overrides before `className`
  return <PaginationEllipsisBase className={cn(className)} {...props} />
}

export { PaginationItem } from "#components/shadcn-base/pagination"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
