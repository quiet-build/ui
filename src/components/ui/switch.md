# Switch

On/off toggle. Same controlled API as Checkbox. Use Switch for *preferences* that take effect immediately; use Checkbox for *form values* the user confirms with a Submit.

## Import

```tsx
import { Switch } from '@quietbuildlab/ui'
```

## Props

`React.ComponentProps<typeof SwitchPrimitive.Root>` — wraps Base UI Switch. Key props:
- `checked` / `defaultChecked`: `boolean`
- `onCheckedChange(checked: boolean)`
- `disabled`, `name`, `value`

## Usage

```tsx
import { Switch, Label } from '@quietbuildlab/ui'

const [enabled, setEnabled] = useState(false)

<div className="flex items-center gap-2">
  <Switch id="notifications" checked={enabled} onCheckedChange={setEnabled} />
  <Label htmlFor="notifications">Email notifications</Label>
</div>
```

## Notes

- Switch's `onCheckedChange` always receives a `boolean` (no "indeterminate" state).
- Use a clear `Label` — switches without context are easy to misread.

## Related

- [Checkbox](./checkbox.md), [RadioGroup](./radio-group.md), [Label](./label.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/switch.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-switch--default)
