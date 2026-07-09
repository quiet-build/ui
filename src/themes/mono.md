# Mono Theme

High-contrast black and white theme with sharp corners.

## Import

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes/mono.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

## Character

- Black and white surfaces with intentionally stark contrast.
- Zero-radius corners for a sharper interface.
- Inter is used for the sans token; the serif token maps to a monospace stack.
- Chart tokens step through greyscale values.

## Dark Mode

Toggle the `.dark` class on `<html>`:

```ts
document.documentElement.classList.toggle("dark", isDark)
```

## Runtime Switching

When using `@quietbuildlab/ui/themes.css`, set:

```ts
document.documentElement.dataset.theme = "mono"
```

## Source

- [Source](./mono.css)
