# Avatar

User image with text fallback. The fallback renders if the image fails to load or while it's still loading.

## Import

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@quietbuildlab/ui'
```

## Props

All three components forward to Radix Avatar primitives:
- `Avatar`: outer container (size via `className`, default `size-8` / 32px)
- `AvatarImage`: `src`, `alt`, plus standard `<img>` attrs
- `AvatarFallback`: rendered when image isn't available

## Usage

```tsx
<Avatar>
  <AvatarImage src="https://example.com/u.jpg" alt="Ada Lovelace" />
  <AvatarFallback>AL</AvatarFallback>
</Avatar>

// Different sizes
<Avatar className="size-10">
  <AvatarFallback>MW</AvatarFallback>
</Avatar>
```

Group avatars with negative spacing:

```tsx
<div className="flex -space-x-2">
  <Avatar className="border-2 border-background"><AvatarFallback>A</AvatarFallback></Avatar>
  <Avatar className="border-2 border-background"><AvatarFallback>B</AvatarFallback></Avatar>
  <Avatar className="border-2 border-background"><AvatarFallback>+3</AvatarFallback></Avatar>
</div>
```

## Notes

- Always include `AvatarFallback` — image loading failure is common and the fallback is the accessible identifier.
- Set a meaningful `alt` on `AvatarImage` ("Ada Lovelace") — empty alt only if the avatar is purely decorative.
- **Accessibility**: when the image loads, AT reads `alt`. When it fails over to the fallback ("AL"), AT reads only the initials. If your avatars frequently fail to load (avatar APIs going down, broken URLs), set an `aria-label` on `<Avatar>` itself so the name is announced in both states:

```tsx
<Avatar aria-label="Ada Lovelace">
  <AvatarImage src="https://example.com/u.jpg" alt="Ada Lovelace" />
  <AvatarFallback>AL</AvatarFallback>
</Avatar>
```

## Related

- [Card](./card.md), [DropdownMenu](./dropdown-menu.md) — common avatar containers

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/avatar.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-avatar--default)
