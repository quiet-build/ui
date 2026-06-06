# Popover

Anchored non-modal overlay. Content portals to `document.body`. Doesn't trap focus — use `<Dialog>` if you need that.

## Import

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@quietbuildlab/ui'
```

## Props

**Popover** (Base UI Root): `open`, `defaultOpen`, `onOpenChange`, `modal`.

**PopoverContent**: `side`, `align`, `sideOffset`, `alignOffset` (Base UI Positioner props), plus Popup props. To anchor the popover to an element *other* than the trigger, pass an `anchor` prop (handled by the Positioner).

## Usage

```tsx
<Popover>
  <PopoverTrigger render={<Button variant="outline">Open</Button>} />
  <PopoverContent className="w-80">
    <p className="text-sm">Anchored, non-modal content.</p>
  </PopoverContent>
</Popover>
```

## Notes

- Doesn't trap focus — clicks outside dismiss it. Use `<Dialog>` for modal interactions.
- Powers `<DatePicker>` internally; useful for building custom date-range or autocomplete UIs.
- Portals to `document.body` — style content via `className` on `PopoverContent`.

## Related

- [Dialog](./dialog.md) — modal
- [DropdownMenu](./dropdown-menu.md) — menu-style content
- [Tooltip](./tooltip.md) — hover-only info
- [DatePicker](./date-picker.md) — built on Popover + Calendar

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/popover.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-popover--default)
