# Sheet

Slide-in panel anchored to an edge of the viewport. Built on Radix Dialog, so it traps focus and supports `<SheetTrigger asChild>` like `<Dialog>` does.

## Import

```tsx
import {
  Sheet, SheetTrigger, SheetContent,
  SheetHeader, SheetTitle, SheetDescription,
  SheetFooter, SheetClose,
} from '@quietbuildlab/ui'
```

## Props

**SheetContent** prop: `side?: "top" | "right" | "bottom" | "left"` (default `"right"`).

Other props match the equivalent Dialog primitives (`open`, `defaultOpen`, `onOpenChange`, etc.).

## Usage

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Open menu</Button>
  </SheetTrigger>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
      <SheetDescription>Navigate the app.</SheetDescription>
    </SheetHeader>
    <nav className="grid gap-2 p-4">
      <a className="rounded-md px-3 py-2 hover:bg-accent">Dashboard</a>
      <a className="rounded-md px-3 py-2 hover:bg-accent">Projects</a>
      <a className="rounded-md px-3 py-2 hover:bg-accent">Settings</a>
    </nav>
    <SheetFooter>
      <SheetClose asChild><Button variant="outline">Close</Button></SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## Notes

- Common uses: mobile navigation drawer, side filters, in-app settings panel, quick edit panel.
- `bottom` sheets work well on mobile for quick actions.
- Always include a `<SheetTitle>` (or `aria-labelledby`) for screen readers.

## Related

- [Dialog](./dialog.md) — centered modal
- [Popover](./popover.md) — non-modal anchored content
- [AlertDialog](./alert-dialog.md) — destructive confirms

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/sheet.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-sheet--default)
