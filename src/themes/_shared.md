# Shared Theme Wiring

Shared Tailwind v4 and animation wiring imported by each theme preset.

## Used By

```css
@import "./_shared.css";
```

This file is internal to theme CSS entrypoints. Consumers import a published theme file, not `_shared.css` directly.

## Behavior

- Imports `tw-animate-css` so Radix-state-driven animations have their utility classes.
- Defines the custom `dark` variant that responds to `.dark` on the current element or an ancestor.
- Defines accordion open/close keyframes and exposes them through Tailwind theme animation tokens.
- Maps semantic Tailwind color tokens such as `bg-background`, `text-foreground`, `border-input`, and `ring-ring` to CSS variables supplied by each preset.
- Maps sidebar, chart, font, and radius tokens into Tailwind's inline theme layer.

## Notes

- Theme presets own the actual CSS variable values.
- Keep token names aligned with shadcn/ui conventions so component utility classes stay portable.

## Source

- [Source](./_shared.css)
