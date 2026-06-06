import * as React from "react"
import {
  Accordion as AccordionBase,
  AccordionItem as AccordionItemBase,
  AccordionTrigger as AccordionTriggerBase,
  AccordionContent as AccordionContentBase,
} from "#components/shadcn-base/accordion"
import { cn } from "#lib/utils"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionBase>) {
  // restyle: prepend overrides before `className`
  return <AccordionBase className={cn(className)} {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionItemBase>) {
  // restyle: prepend overrides before `className`
  return <AccordionItemBase className={cn(className)} {...props} />
}

function AccordionTrigger({
  className,
  ...props
}: React.ComponentProps<typeof AccordionTriggerBase>) {
  // restyle: prepend overrides before `className`
  return <AccordionTriggerBase className={cn(className)} {...props} />
}

function AccordionContent({
  className,
  ...props
}: React.ComponentProps<typeof AccordionContentBase>) {
  // restyle: prepend overrides before `className`
  return <AccordionContentBase className={cn(className)} {...props} />
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
