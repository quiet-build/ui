# RadioGroup

Single-selection group. Wrap `RadioGroupItem` + `Label` pairs inside `RadioGroup`.

## Import

```tsx
import { RadioGroup, RadioGroupItem } from '@quietbuildlab/ui'
```

## Props

**RadioGroup**: `value`, `defaultValue`, `onValueChange`, `disabled`, `required`, `name`.

**RadioGroupItem**: `value` (required), `id`, `disabled`, `required`.

## Usage

```tsx
import { RadioGroup, RadioGroupItem, Label } from '@quietbuildlab/ui'

<RadioGroup defaultValue="monthly" onValueChange={(v) => console.log(v)}>
  <div className="flex items-center gap-2">
    <RadioGroupItem id="monthly" value="monthly" />
    <Label htmlFor="monthly">Monthly</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem id="annual" value="annual" />
    <Label htmlFor="annual">Annual</Label>
  </div>
</RadioGroup>
```

## Notes

- `RadioGroupItem` must be a descendant of `RadioGroup`.
- One-of-many selection only — for binary, use `<Switch>`; for multi, use multiple `<Checkbox>` or a `<Select multiple>`-style pattern.

## Related

- [Checkbox](./checkbox.md), [Switch](./switch.md), [Select](./select.md), [Label](./label.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/radio-group.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-radiogroup--default)
