# Progress

Horizontal progress bar. `value` is 0–100.

## Import

```tsx
import { Progress } from '@quietbuildlab/ui'
```

## Props

`React.ComponentProps<typeof ProgressPrimitive.Root>` — wraps Base UI Progress. Key props:
- `value`: `number` (0–100), or `null` for the indeterminate state
- `max`: `number` (default 100)
- `getAriaValueText(formattedValue, value)`: accessible label generator

## Usage

```tsx
const [progress, setProgress] = useState(0)

<Progress value={progress} className="w-64" />
```

Indeterminate (animated):

```tsx
// Pass value={null} to render the indeterminate state
<Progress value={null} className="w-64" />
```

## Notes

- Use a fixed width (`className="w-64"`) or stretch to a container — Progress doesn't size itself.
- For loading placeholders that don't have a percentage, prefer `<Skeleton>`.

## Related

- [Skeleton](./skeleton.md), [Slider](./slider.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/progress.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-progress--default)
