# DropdownMenu

Contextual menu. Content portals to `document.body`.

## Import

```tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@quietbuildlab/ui'
```

## Props

**DropdownMenu** (Radix Root): `open`, `defaultOpen`, `onOpenChange`, `dir`, `modal`.

**DropdownMenuContent**: `side`, `align`, `sideOffset`, `alignOffset`, etc. (Radix Content props).

**DropdownMenuItem**: `onSelect`, `disabled`, `textValue`, `inset`.

## Usage

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuItem onSelect={() => goToProfile()}>Profile</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => goToSettings()}>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive" onSelect={signOut}>Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Notes

- Portals to `document.body` — style content via `className` on `DropdownMenuContent`.
- For confirming the destructive items (e.g. Sign out), open an `<AlertDialog>` from the `onSelect` handler.
- For one-of-many selection inside a form, use `<Select>` instead.

## Related

- [Select](./select.md), [Popover](./popover.md), [Tooltip](./tooltip.md)
- [AlertDialog](./alert-dialog.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/dropdown-menu.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-dropdownmenu--default)
