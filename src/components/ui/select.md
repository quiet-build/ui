# Select

Combobox / dropdown selector. Content portals to `document.body`.

## Import

```tsx
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem, SelectGroup, SelectLabel,
} from '@quietbuildlab/ui'
```

## Props

**Select**: `value`, `defaultValue`, `onValueChange`, `open`, `defaultOpen`, `onOpenChange`, `disabled`, `required`, `name`.

**SelectTrigger** extra prop: `size?: "sm" | "default"`.

**SelectContent** extra props: `position?: "item-aligned" | "popper"`, `align?: "start" | "center" | "end"`.

## Usage

```tsx
<Select onValueChange={(v) => console.log(v)}>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Pick a plan" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Plans</SelectLabel>
      <SelectItem value="free">Free</SelectItem>
      <SelectItem value="pro">Pro</SelectItem>
      <SelectItem value="enterprise">Enterprise</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

## Notes

- `SelectContent` portals to `document.body` — style via `className` on `SelectContent`, not its parent.
- For binary preferences, prefer `<Switch>`. For 2-5 mutually exclusive options, `<RadioGroup>` is more scannable.

## Related

- [RadioGroup](./radio-group.md), [DropdownMenu](./dropdown-menu.md), [Popover](./popover.md)

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/select.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-select--default)
