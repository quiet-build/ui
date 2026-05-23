# Label

Styled `<label>` element. Pair with `htmlFor` to associate with a form control for accessibility.

## Import

```tsx
import { Label } from '@quietbuildlab/ui'
```

## Props

`React.ComponentProps<typeof LabelPrimitive.Root>` — wraps Radix `Label`. Accepts all standard `<label>` attributes including `htmlFor`.

## Usage

```tsx
import { Label, Input } from '@quietbuildlab/ui'

<Label htmlFor="name">Full name</Label>
<Input id="name" />
```

Clicking the label focuses the associated input.

## Notes

- Always set `htmlFor` to the input's `id`. Don't wrap input + label — keep them siblings.
- For Checkbox/Switch/RadioGroupItem, the same pattern applies: `Label htmlFor="x"` next to `<Checkbox id="x" />`.

## Related

- [Input](./input.md), [Textarea](./textarea.md), [Checkbox](./checkbox.md), [Switch](./switch.md), [RadioGroup](./radio-group.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/label.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-label--default)
