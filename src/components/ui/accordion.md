# Accordion

Vertical stack of collapsible sections. New in v0.6.

## Import

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@quietbuildlab/ui'
```

## Props

**Accordion** (Radix Root):
- `type`: `"single"` (one open at a time) or `"multiple"` (any number open)
- `collapsible`: only with `type="single"` — allow the open item to close
- `value` / `defaultValue` / `onValueChange`
- `disabled`, `dir`, `orientation`

**AccordionItem**: `value` (required, unique within the Accordion), `disabled`.

## Usage

Single-open with collapse:

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>How does billing work?</AccordionTrigger>
    <AccordionContent>Monthly, billed in advance.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="b">
    <AccordionTrigger>Can I cancel?</AccordionTrigger>
    <AccordionContent>Yes, anytime.</AccordionContent>
  </AccordionItem>
</Accordion>
```

Multiple open at once:

```tsx
<Accordion type="multiple">
  <AccordionItem value="a">…</AccordionItem>
  <AccordionItem value="b">…</AccordionItem>
</Accordion>
```

## Notes

- `AccordionItem`'s `value` must be unique within the Accordion.
- The expand/collapse animation depends on the `animate-accordion-down/up` utilities provided via the theme's shared CSS (auto-set up for any preset import).

## Related

- [Tabs](./tabs.md) — switch between sections instead of stacking them
- [Sheet](./sheet.md) — slide-in panel

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/accordion.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-accordion--default)
