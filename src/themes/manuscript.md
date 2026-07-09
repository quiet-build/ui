# Manuscript Theme

Default warm paper theme and backward-compatible visual identity for `@quietbuildlab/ui`.

## Import

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes/manuscript.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

## Character

- Warm off-white surfaces with subtle paper-toned borders.
- Forest green primary accent.
- Inter body text with Lora available as the serif token.
- Compact `0.25rem` base radius.

## Dark Mode

Toggle the `.dark` class on `<html>`:

```ts
document.documentElement.classList.toggle("dark", isDark)
```

## Notes

- This is also what `@quietbuildlab/ui/theme.css` imports.
- In bundled runtime-switching mode, this preset applies when no `data-theme` is set or when `data-theme="manuscript"`.

## Source

- [Source](./manuscript.css)
