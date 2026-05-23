# Card

Rounded surface container. Compose with sub-components for structured layouts.

## Import

```tsx
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter, CardAction,
} from '@quietbuildlab/ui'
```

## Sub-components

| Component | Purpose |
|---|---|
| `Card` | Outer surface (rounded border + background). |
| `CardHeader` | Top section with grid layout for title + action. |
| `CardTitle` | Heading inside `CardHeader`. |
| `CardDescription` | Subtitle / muted text inside `CardHeader`. |
| `CardAction` | Renders in the top-right corner of `CardHeader` via CSS grid. |
| `CardContent` | Main body. |
| `CardFooter` | Bottom section, typically actions. |

All sub-components accept `React.ComponentProps<"div">`.

## Usage

```tsx
<Card className="max-w-sm">
  <CardHeader>
    <CardTitle>Workspace</CardTitle>
    <CardDescription>Your active projects</CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon-sm"><PlusIcon /></Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">3 projects active</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline" size="sm">View all</Button>
  </CardFooter>
</Card>
```

## Notes

- `Card` alone is a usable styled div — sub-components are optional.
- `CardHeader` uses CSS grid so `CardAction` positions itself without floats or absolute positioning.

## Related

- [Button](./button.md), [Badge](./badge.md)
- [Sheet](./sheet.md) — slide-in panels with a similar internal layout

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/card.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-card--default)
