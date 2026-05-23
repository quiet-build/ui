# Textarea

Multi-line text input. Accepts all standard `<textarea>` attributes.

## Import

```tsx
import { Textarea } from '@quietbuildlab/ui'
```

## Props

`React.ComponentProps<"textarea">` — every native textarea attribute passes through (`value`, `defaultValue`, `onChange`, `rows`, `cols`, `disabled`, `required`, etc.).

## Usage

```tsx
import { Textarea, Label } from '@quietbuildlab/ui'

<div className="flex flex-col gap-1.5">
  <Label htmlFor="bio">Bio</Label>
  <Textarea id="bio" rows={4} placeholder="Tell us about yourself" />
</div>
```

## Notes

- Always pair with a `<Label htmlFor=...>`.
- Set `rows` to suggest a starting height; users can still resize unless you set `className="resize-none"`.

## Related

- [Input](./input.md) — single-line text
- [Label](./label.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/textarea.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-textarea--default)
