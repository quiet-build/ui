# Theming `@quietbuildlab/ui`

The library ships **six ready-made themes**. Pick one with a single CSS import,
swap themes at runtime, or override tokens to build your own.

## 1. Pick a preset

The simplest path. Pick one of:

```css
@import "@quietbuildlab/ui/themes/manuscript.css";   /* warm paper, Forest accent (default) */
@import "@quietbuildlab/ui/themes/midnight.css";     /* cool indigo, modern */
@import "@quietbuildlab/ui/themes/slate.css";        /* neutral slate-blue, corporate */
@import "@quietbuildlab/ui/themes/sunset.css";       /* warm coral, friendly */
@import "@quietbuildlab/ui/themes/ocean.css";        /* calm teal, SaaS */
@import "@quietbuildlab/ui/themes/mono.css";         /* B/W brutalist */
```

`@import "@quietbuildlab/ui/theme.css"` is kept as an alias for Manuscript, so
existing consumers don't break.

| Theme | Vibe | Accent | Radius | Type |
|---|---|---|---|---|
| **Manuscript** | Warm paper, editorial | Forest green | 4px | Lora + Inter |
| **Midnight** | Cool, focused | Indigo | 6px | Inter |
| **Slate** | Modernist, neutral | Slate-blue | 4px | Inter |
| **Sunset** | Warm, friendly | Coral | 10px | Inter |
| **Ocean** | Calm, trustworthy | Teal | 6px | Inter |
| **Mono** | High-contrast brutalist | Black/white | 0px | Inter + mono |

## 2. Switch themes at runtime

Use the bundled `themes.css` (~17 KB gzipped, all 6 themes):

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

Then toggle on `<html>`:

```ts
document.documentElement.dataset.theme = "ocean"
document.documentElement.classList.toggle("dark", isDark)
```

Default (no `data-theme` attribute) is Manuscript.

```tsx
function ThemeSwitcher() {
  return (
    <select onChange={(e) => {
      document.documentElement.dataset.theme = e.target.value
    }}>
      <option value="manuscript">Manuscript</option>
      <option value="midnight">Midnight</option>
      <option value="slate">Slate</option>
      <option value="sunset">Sunset</option>
      <option value="ocean">Ocean</option>
      <option value="mono">Mono</option>
    </select>
  )
}
```

## 3. Build your own theme

Pick the preset closest to what you want, then override only the tokens you
want different — in your app CSS, **after** the preset import.

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes/midnight.css";
@source "../node_modules/@quietbuildlab/ui/dist";

/* Override Midnight's indigo with a warm orange */
:root {
  --primary: oklch(0.62 0.16 50);
  --ring: oklch(0.62 0.16 50);
  --radius: 0.5rem;
}
.dark {
  --primary: oklch(0.74 0.16 50);
  --ring: oklch(0.74 0.16 50);
}
```

Every `<Button>`, focus ring, active state, and progress bar now uses the new
accent. Override only what you want; everything else stays.

## What you can override

| Group | Tokens |
|---|---|
| **Surfaces** | `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground` |
| **Accent** | `--primary`, `--primary-foreground`, `--ring` |
| **Quiet UI** | `--secondary`, `--muted`, `--accent` (and their `-foreground` pairs) |
| **Form chrome** | `--border`, `--input` |
| **Status** | `--destructive`, `--destructive-foreground` |
| **Charts** | `--chart-1` through `--chart-5` |
| **Sidebar** | `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring` |
| **Shape** | `--radius` (e.g. `0` for square corners, `0.5rem` for soft, `9999px` for pill) |
| **Type** | `--font-sans`, `--font-serif` |

Override in `:root` for light and `.dark` for dark mode. If you only override
in `:root`, dark mode falls back to the preset's dark values for those tokens —
usually not what you want for a brand color.

## Why OKLCH

The themes use OKLCH because Tailwind v4 does, and because it makes light/dark
pairs easier to derive. Convert from hex with the Tailwind docs' picker or any
OKLCH converter. Hex still works (`#3d5240`) but you'll lose the perceptual-
lightness benefit.

## Changing fonts

```css
:root {
  --font-sans: "Geist", system-ui, sans-serif;
  --font-serif: "Fraunces", Georgia, serif;
}
```

You're responsible for loading the fonts (e.g. via `@fontsource-variable/geist`
or a `<link>` to Google Fonts). The Manuscript preset bundles
`@fontsource-variable/inter` and `@fontsource-variable/lora`; every other preset
bundles only `inter`. Override `--font-sans` / `--font-serif` to point at your
fonts instead.

## Live preview

Run the project's Storybook (`npm run storybook`) and open:

- **Guides → Theme Gallery** — side-by-side preview of all six presets,
  plus a live runtime-switcher demo.
- **Guides → Theming** — token-by-token overrides applied to a live component.
