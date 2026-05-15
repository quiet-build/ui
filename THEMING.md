# Theming `@quietbuildlab/ui`

The library ships with one canonical theme — **Manuscript** (warm paper, Forest
accent, Lora serif headings over Inter body, 4px radius, light + dark). Consumers
who want every quietbuildlab app to look the same use the defaults.

For per-app brand tweaks (a different accent, a softer radius, a different serif),
override the CSS variables in your own stylesheet **after** importing
`@quietbuildlab/ui/theme.css`. The cascade does the rest — every component picks
the new values up automatically because they all reference the same tokens.

## Example: change the accent color

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/theme.css";
@source "../node_modules/@quietbuildlab/ui/dist";

/* Override Manuscript's Forest with a deep blue */
:root {
  --primary: oklch(0.40 0.10 250);
  --ring: oklch(0.40 0.10 250);
}

.dark {
  --primary: oklch(0.65 0.10 250);
  --ring: oklch(0.65 0.10 250);
}
```

That's the entire change — every `<Button>`, focus ring, active state, and progress
bar across the app now uses the new accent. Override only the tokens you want to
change; everything else stays Manuscript.

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

Override in `:root` for the light theme and `.dark` for dark mode. If you only override
in `:root`, dark mode falls back to Manuscript's dark values for those tokens — usually
not what you want for a brand color.

## Use OKLCH

The theme uses OKLCH because Tailwind v4 does, and because it makes light/dark pairs
easier to derive. If you have hex, convert with the Tailwind docs' picker or any
OKLCH converter. Hex still works (`#3d5240`) but you'll lose the perceptual-lightness
benefit.

## Changing the fonts

```css
:root {
  --font-sans: "Geist", system-ui, sans-serif;
  --font-serif: "Fraunces", Georgia, serif;
}
```

You're responsible for loading the fonts (e.g. via `@fontsource-variable/geist` or
a `<link>` to Google Fonts). The Manuscript theme bundles `@fontsource-variable/inter`
and `@fontsource-variable/lora` — overriding `--font-sans` / `--font-serif` simply
points the cascade at your fonts instead.

## Live preview

Run the project's Storybook (`npm run storybook`) and open the **Theming** story
to see token overrides applied to a live component gallery.
