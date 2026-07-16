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
- Exposes shared motion tokens — `--ease-spring`, `--ease-out-quart` (which also generate `ease-spring` / `ease-out-quart` utilities), and `--duration-fast` / `--duration-normal` / `--duration-slow` — so components and consumers reference timings instead of hardcoding them.
- Maps semantic Tailwind color tokens such as `bg-background`, `text-foreground`, `border-input`, and `ring-ring` to CSS variables supplied by each preset.
- Maps the shared status tokens (`--success`, `--warning`, `--info`, plus `-foreground` pairs) so `bg-success`, `text-warning`, `border-info`, etc. work.
- Maps sidebar, chart, font, and radius tokens into Tailwind's inline theme layer.
- Owns two **brand-independent** token groups that only vary by light/dark, defined once here and inherited by every preset and the runtime bundle:
  - **Status colors** (`--success` / `--warning` / `--info` + `-foreground`) — the semantic status palette alongside each preset's `--destructive`.
  - **Elevation** (`--elevation-2xs` … `--elevation-2xl`, mapped onto Tailwind's `--shadow-*` scale) — light values are byte-identical to Tailwind's defaults; dark values are stronger so shadows stay visible on dark surfaces.

## Notes

- Theme presets own the per-brand CSS variable values (accent, surfaces, borders, charts, radius, fonts).
- Status colors and elevation are shared here because they read the same regardless of brand; a consumer can still override `--success` etc. or `--elevation-*` in their own `:root` / `.dark` after the theme import.
- Keep token names aligned with shadcn/ui conventions so component utility classes stay portable.

## Source

- [Source](./_shared.css)
