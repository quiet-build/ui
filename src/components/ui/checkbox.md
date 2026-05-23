# Checkbox

Binary toggle. Controlled via `checked` + `onCheckedChange`, or uncontrolled via `defaultChecked`.

## Import

```tsx
import { Checkbox } from '@quietbuildlab/ui'
```

## Props

`React.ComponentProps<typeof CheckboxPrimitive.Root>` — wraps Radix Checkbox. Key props:
- `checked` / `defaultChecked`: `boolean | "indeterminate"`
- `onCheckedChange(checked)`
- `disabled`, `required`, `name`, `value`

## Usage

```tsx
import { Checkbox, Label } from '@quietbuildlab/ui'

<div className="flex items-center gap-2">
  <Checkbox id="terms" onCheckedChange={(checked) => console.log(checked)} />
  <Label htmlFor="terms">Accept terms</Label>
</div>
```

Controlled:

```tsx
const [accepted, setAccepted] = useState(false)
<Checkbox checked={accepted} onCheckedChange={(v) => setAccepted(v === true)} />
```

## Notes

- `onCheckedChange` receives `boolean | "indeterminate"` — narrow with `=== true` for boolean state.
- For grouped on/off choices, prefer `<Switch>` (preference) or `<RadioGroup>` (single-choice).

## Related

- [Switch](./switch.md), [RadioGroup](./radio-group.md), [Label](./label.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/checkbox.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-checkbox--default)
