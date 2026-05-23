# Button

Themed action button. Built on a native `<button>` element, or any other element via Radix `Slot` when `asChild` is true.

## Import

```tsx
import { Button } from '@quietbuildlab/ui'
```

## Props

```tsx
interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link"
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
  asChild?: boolean
}
```

## Usage

```tsx
<Button>Save</Button>
<Button variant="destructive" size="sm">Delete</Button>

// Polymorphic — renders as <a> with button styling.
<Button asChild>
  <a href="/dashboard">Go to dashboard</a>
</Button>

// Icon-only — provide an `aria-label`.
<Button variant="outline" size="icon" aria-label="Settings">
  <SettingsIcon />
</Button>
```

## Notes

- Don't nest `<a>`/`<Link>` inside `<button>` — use `asChild` instead.
- For destructive *confirmations*, pair with `<AlertDialog>` rather than firing the action immediately.

## Related

- [Badge](./badge.md) — non-interactive labels
- [AlertDialog](./alert-dialog.md) — confirm destructive actions

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/button.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-button--default)
