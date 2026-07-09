# Ocean Theme

Calm teal theme for SaaS and operational interfaces.

## Import

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes/ocean.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

## Character

- Cool light surfaces with teal primary and ring tokens.
- Balanced chart colors for dashboards and product interfaces.
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
document.documentElement.dataset.theme = "ocean"
```

## Source

- [Source](./ocean.css)
