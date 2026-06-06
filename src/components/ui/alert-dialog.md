# AlertDialog

Blocking yes/no confirmation modal. Use for destructive or important actions (delete, sign-out, discard changes). Built on Base UI AlertDialog.

For inline non-blocking messages, use `<Alert>`. For general modal content (forms, info), use `<Dialog>`.

## Import

```tsx
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@quietbuildlab/ui'
```

## Sub-components and styling

- `AlertDialogAction` — destructive-button styling by default.
- `AlertDialogCancel` — outline-button styling by default.

Both override styles via `className`.

## Usage

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive">Delete project</Button>} />
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this project?</AlertDialogTitle>
      <AlertDialogDescription>
        This permanently removes the project and all associated files. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Notes

- Always include BOTH `AlertDialogAction` AND `AlertDialogCancel` so the user can back out.
- Don't use AlertDialog for forms — use `<Dialog>` (AlertDialog is meant for short, terminal yes/no questions).
- For a non-destructive confirm, override the Action's styling: `<AlertDialogAction className={buttonVariants({ variant: "default" })}>Confirm</AlertDialogAction>`.

## Related

- [Dialog](./dialog.md) — general-purpose modal
- [Alert](./alert.md) — inline status banner

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/alert-dialog.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-alertdialog--default)
