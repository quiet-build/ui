"use client"

import * as React from "react"

import {
  Table as TableBase,
  TableHeader as TableHeaderBase,
  TableBody as TableBodyBase,
  TableFooter as TableFooterBase,
  TableHead as TableHeadBase,
  TableRow as TableRowBase,
  TableCell as TableCellBase,
  TableCaption as TableCaptionBase,
} from "#components/shadcn-base/table"
import { cn } from "#lib/utils"

function Table({
  className,
  ...props
}: React.ComponentProps<typeof TableBase>) {
  // restyle: prepend overrides before `className`
  return <TableBase className={cn(className)} {...props} />
}

function TableHeader({
  className,
  ...props
}: React.ComponentProps<typeof TableHeaderBase>) {
  return <TableHeaderBase className={cn(className)} {...props} />
}

function TableBody({
  className,
  ...props
}: React.ComponentProps<typeof TableBodyBase>) {
  return <TableBodyBase className={cn(className)} {...props} />
}

function TableFooter({
  className,
  ...props
}: React.ComponentProps<typeof TableFooterBase>) {
  return <TableFooterBase className={cn(className)} {...props} />
}

function TableHead({
  className,
  ...props
}: React.ComponentProps<typeof TableHeadBase>) {
  return <TableHeadBase className={cn(className)} {...props} />
}

function TableRow({
  className,
  ...props
}: React.ComponentProps<typeof TableRowBase>) {
  return <TableRowBase className={cn(className)} {...props} />
}

function TableCell({
  className,
  ...props
}: React.ComponentProps<typeof TableCellBase>) {
  return <TableCellBase className={cn(className)} {...props} />
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<typeof TableCaptionBase>) {
  return <TableCaptionBase className={cn(className)} {...props} />
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
