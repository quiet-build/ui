# Accordion

Vertical stack of collapsible sections. New in v0.6.

## Import

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@quietbuildlab/ui'
```

## Props

**Accordion** (Base UI Root):
- `multiple`: allow any number of items open at once (default `false` — single-open)
- `value` / `defaultValue` / `onValueChange` — values are **arrays** (e.g. `["a"]`)
- `disabled`, `orientation`

**AccordionItem**: `value` (required, unique within the Accordion), `disabled`.

## Usage

Single-open (default — the open item closes when re-clicked):

```tsx
<Accordion>
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
<Accordion multiple>
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
