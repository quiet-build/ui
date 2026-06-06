# Badge

Small inline label for status, categories, or counts.

## Import

```tsx
import { Badge } from '@quietbuildlab/ui'
```

## Props

```tsx
interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  render?: React.ReactElement | ((props, state) => React.ReactElement)
}
```

## Usage

```tsx
<Badge>New</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

## Notes

- Use semantic tokens, not raw colors — `variant="destructive"` re-themes automatically.
- For interactive variants (e.g. removable tags), wrap a Button or use the `render` prop.

## Related

- [Button](./button.md) — interactive actions
- [Alert](./alert.md) — multi-line status messages

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/badge.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-badge--default)
