# Input

Single-line text input. Accepts all standard `<input>` attributes.

## Import

```tsx
import { Input } from '@quietbuildlab/ui'
```

## Props

`React.ComponentProps<"input">` — every native input attribute passes through (`type`, `value`, `defaultValue`, `onChange`, `placeholder`, `disabled`, `required`, etc.).

## Usage

```tsx
import { Input, Label } from '@quietbuildlab/ui'

<div className="flex flex-col gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

## Notes

- Always pair with a `<Label htmlFor=...>` for accessibility.
- For multi-line input, use `<Textarea>` instead.
- For password inputs, set `type="password"` — styling is identical.

## Related

- [Label](./label.md) — accessible labels
- [Textarea](./textarea.md) — multi-line text
- [Select](./select.md) — fixed-option dropdowns

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/input.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-input--default)
