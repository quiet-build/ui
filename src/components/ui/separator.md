# Separator

Horizontal or vertical visual divider.

## Import

```tsx
import { Separator } from '@quietbuildlab/ui'
```

## Props

`React.ComponentProps<typeof SeparatorPrimitive.Root>` — wraps Radix Separator. Key props:
- `orientation?: "horizontal" | "vertical"` (default `"horizontal"`)
- `decorative?: boolean` — `true` (default) hides from screen readers

## Usage

```tsx
<Separator />
<Separator orientation="vertical" className="h-6" />
```

A vertical separator needs an explicit height since it stretches to its container:

```tsx
<div className="flex items-center gap-3 h-6">
  <span>One</span>
  <Separator orientation="vertical" />
  <span>Two</span>
</div>
```

## Notes

- Set `decorative={false}` only when the separator carries meaning (e.g. distinguishing two unrelated sections); otherwise the default `true` is correct.

## Related

- [Card](./card.md) — usually has its own internal separators
- [Table](./table.md) — built-in row borders

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/separator.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-separator--default)
