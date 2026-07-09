# Slate Theme

Minimal neutral theme with a slate-blue accent.

## Import

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes/slate.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

## Character

- Modernist grey surfaces with restrained contrast.
- Slate-blue primary token.
- Inter is used for both sans and serif font tokens.
- Compact `0.25rem` base radius.

## Dark Mode

Toggle the `.dark` class on `<html>`:

```ts
document.documentElement.classList.toggle("dark", isDark)
```

## Runtime Switching

When using `@quietbuildlab/ui/themes.css`, set:

```ts
document.documentElement.dataset.theme = "slate"
```

## Source

- [Source](./slate.css)
