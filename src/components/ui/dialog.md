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

**Dialog** (Base UI Root): `open`, `defaultOpen`, `onOpenChange`, `modal`.

**DialogContent** extra prop: `showCloseButton?: boolean` (default `true`).

**DialogFooter** extra prop: `showCloseButton?: boolean` (default `false`) — appends a styled Close button after children.

## Usage

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline">Open</Button>} />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rename file</DialogTitle>
      <DialogDescription>Give it a clearer name.</DialogDescription>
    </DialogHeader>
    <Input defaultValue="invoice.pdf" />
    <DialogFooter>
      <DialogClose render={<Button variant="outline">Cancel</Button>} />
      <Button onClick={save}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Notes

- Always include a `<DialogTitle>` (or pass `aria-labelledby`) for screen readers.
- `DialogContent` portals to `document.body` — pass `className` to `DialogContent` for sizing/positioning.
- Wrap a Cancel button with `<DialogClose render={<Button…/>} />` so clicking it closes the dialog.
- **Accessibility**: `DialogContent` shows a close (✕) button by default. If you pass `showCloseButton={false}`, keep at least one of these working so users can dismiss: Base UI's default Escape key, the default outside-click, or your own visible `<DialogClose>`-rendered button. Disabling all three traps users with no way out.

## Related

- [AlertDialog](./alert-dialog.md) — destructive confirmations
- [Sheet](./sheet.md) — slide-in side panels
- [Popover](./popover.md) — non-modal anchored overlay

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/dialog.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-dialog--default)
