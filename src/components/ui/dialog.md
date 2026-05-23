# Dialog

Modal dialog. Content portals to `document.body` with an animated overlay. Traps focus while open.

For destructive yes/no *confirmations*, prefer `<AlertDialog>` — it has built-in semantics for destructive actions.

## Import

```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from '@quietbuildlab/ui'
```

## Props

**Dialog** (Radix Root): `open`, `defaultOpen`, `onOpenChange`, `modal`.

**DialogContent** extra prop: `showCloseButton?: boolean` (default `true`).

**DialogFooter** extra prop: `showCloseButton?: boolean` (default `false`) — appends a styled Close button after children.

## Usage

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rename file</DialogTitle>
      <DialogDescription>Give it a clearer name.</DialogDescription>
    </DialogHeader>
    <Input defaultValue="invoice.pdf" />
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button onClick={save}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Notes

- Always include a `<DialogTitle>` (or pass `aria-labelledby`) for screen readers.
- `DialogContent` portals to `document.body` — pass `className` to `DialogContent` for sizing/positioning.
- Wrap a Cancel button with `<DialogClose asChild>` so clicking it closes the dialog.

## Related

- [AlertDialog](./alert-dialog.md) — destructive confirmations
- [Sheet](./sheet.md) — slide-in side panels
- [Popover](./popover.md) — non-modal anchored overlay

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/dialog.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-dialog--default)
