# Skeleton

Loading placeholder. Size and shape via `className`.

## Import

```tsx
import { Skeleton } from '@quietbuildlab/ui'
```

## Props

`React.ComponentProps<"div">` — only `className` is needed for sizing.

## Usage

```tsx
// Match the shape of the content it will replace
<Skeleton className="h-4 w-48" />              // single line of text
<Skeleton className="h-10 w-10 rounded-full" /> // avatar
<Skeleton className="h-32 w-full" />           // image
```

Compose to mimic a card while loading:

```tsx
<div className="space-y-3">
  <Skeleton className="h-6 w-2/3" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
</div>
```

## Notes

- Set width and height that match the final content's shape so the layout doesn't shift on load.
- For data loads driven by `<DataTable>`, pass the `loading` prop instead of overlaying a skeleton.

## Related

- [Progress](./progress.md) — determinate progress
- [DataTable](./data-table.md) — built-in `loading` state

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/skeleton.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-skeleton--default)
