# DropdownMenu

Contextual menu. Content portals to `document.body`.

## Import

```tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@quietbuildlab/ui'
```

## Props

**DropdownMenu** (Base UI Menu Root): `open`, `defaultOpen`, `onOpenChange`, `modal`.

**DropdownMenuContent**: `side`, `align`, `sideOffset`, `alignOffset`, etc. (Base UI Positioner props).

**DropdownMenuItem**: `onClick`, `disabled`, `inset`.

## Usage

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Actions</Button>} />
  <DropdownMenuContent align="end">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => goToProfile()}>Profile</DropdownMenuItem>
      <DropdownMenuItem onClick={() => goToSettings()}>Settings</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive" onClick={signOut}>Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Notes

- Portals to `document.body` — style content via `className` on `DropdownMenuContent`.
- For confirming the destructive items (e.g. Sign out), open an `<AlertDialog>` from the `onClick` handler.
- For one-of-many selection inside a form, use `<Select>` instead.

## Related

- [Select](./select.md), [Popover](./popover.md), [Tooltip](./tooltip.md)
- [AlertDialog](./alert-dialog.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/dropdown-menu.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-dropdownmenu--default)
