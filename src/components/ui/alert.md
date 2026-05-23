# Alert

Inline non-blocking status banner. Use for info / warning / success / error messages that don't require user action.

For *blocking* yes/no confirmations, use `<AlertDialog>` instead. For *transient* notifications, use `<Toaster>` + `toast()`.

## Import

```tsx
import { Alert, AlertTitle, AlertDescription } from '@quietbuildlab/ui'
```

## Props

```tsx
interface AlertProps extends React.ComponentProps<"div"> {
  variant?: "default" | "destructive"
}
```

`AlertTitle` and `AlertDescription` are `React.ComponentProps<"div">`. A leading `<svg>` child is auto-styled as the icon.

## Usage

```tsx
import { InfoIcon, TriangleAlertIcon, CheckCircle2Icon } from 'lucide-react'

<Alert>
  <InfoIcon />
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>You can dismiss this anytime.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <TriangleAlertIcon />
  <AlertTitle>Connection failed</AlertTitle>
  <AlertDescription>Check your network and try again.</AlertDescription>
</Alert>

// Title-only (no description)
<Alert>
  <CheckCircle2Icon />
  <AlertTitle>Background sync is enabled</AlertTitle>
</Alert>
```

## Notes

- The icon slot is the first `<svg>` child — placement is automatic via CSS grid.
- For *success* / *warning* / *info* color treatments beyond the two variants, override `--primary` / `--destructive` per instance with `className`, or compose with `Badge`.

## Related

- [AlertDialog](./alert-dialog.md) — blocking confirmation modal
- [Toaster](./sonner.md) — transient toast notifications

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/alert.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-alert--default)
