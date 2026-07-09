# Sunset Theme

Warm, friendly theme with coral and amber energy.

## Import

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes/sunset.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

## Character

- Warm cream surfaces with coral primary accents.
- Amber and warm chart tokens for consumer-app dashboards.
- Inter is used for both sans and serif font tokens.
- Larger `0.625rem` base radius.

## Dark Mode

Toggle the `.dark` class on `<html>`:

```ts
document.documentElement.classList.toggle("dark", isDark)
```

## Runtime Switching

When using `@quietbuildlab/ui/themes.css`, set:

```ts
document.documentElement.dataset.theme = "sunset"
```

## Source

- [Source](./sunset.css)
