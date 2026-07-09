# Midnight Theme

Cool, focused theme with an indigo accent and Inter throughout.

## Import

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes/midnight.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

## Character

- Cool neutral surfaces with a saturated indigo primary token.
- Designed to pair well with dark-mode-first applications.
- Inter is used for both sans and serif font tokens.
- Soft `0.375rem` base radius.

## Dark Mode

Toggle the `.dark` class on `<html>`:

```ts
document.documentElement.classList.toggle("dark", isDark)
```

## Runtime Switching

When using `@quietbuildlab/ui/themes.css`, set:

```ts
document.documentElement.dataset.theme = "midnight"
```

## Source

- [Source](./midnight.css)
