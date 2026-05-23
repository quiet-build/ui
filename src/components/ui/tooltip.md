# Tooltip

Hover/focus tooltip. Content portals to `document.body`. Requires `<TooltipProvider>` somewhere in the ancestor tree — usually mounted once at the app root.

## Import

```tsx
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@quietbuildlab/ui'
```

## Props

**TooltipProvider**: `delayDuration` (default 0), `skipDelayDuration`, `disableHoverableContent`.

**Tooltip**: `open`, `defaultOpen`, `onOpenChange`, `delayDuration`, `disableHoverableContent`.

**TooltipContent**: `side`, `align`, `sideOffset` (default 0), `alignOffset`, `avoidCollisions`.

## Usage

Mount the provider once at the app root:

```tsx
<TooltipProvider>
  <App />
</TooltipProvider>
```

Then wherever you need a tooltip:

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Copy">
      <CopyIcon />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Copy to clipboard</TooltipContent>
</Tooltip>
```

## Notes

- Forgetting `<TooltipProvider>` is the most common bug — components render but tooltips never appear.
- Tooltips are hover/focus only. For mobile-friendly contextual info, consider `<Popover>`.
- Don't put critical info in a tooltip — they're often inaccessible on touch.

## Related

- [Popover](./popover.md), [DropdownMenu](./dropdown-menu.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/tooltip.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-tooltip--default)
