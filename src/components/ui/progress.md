# Progress

Horizontal progress bar. `value` is 0–100.

## Import

```tsx
import { Progress } from '@quietbuildlab/ui'
```

## Props

`React.ComponentProps<typeof ProgressPrimitive.Root>` — wraps Radix Progress. Key props:
- `value`: `number` (0–100)
- `max`: `number` (default 100)
- `getValueLabel(value, max)`: accessible label generator

## Usage

```tsx
const [progress, setProgress] = useState(0)

<Progress value={progress} className="w-64" />
```

Indeterminate (animated):

```tsx
// Omit value to render the indeterminate state
<Progress className="w-64" />
```

## Notes

- Use a fixed width (`className="w-64"`) or stretch to a container — Progress doesn't size itself.
- For loading placeholders that don't have a percentage, prefer `<Skeleton>`.

## Related

- [Skeleton](./skeleton.md), [Slider](./slider.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/progress.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-progress--default)
