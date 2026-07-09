# Bundled Themes

Runtime-switching CSS entrypoint that includes every preset in one file.

## Import

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

## Runtime Switching

```ts
document.documentElement.dataset.theme = "ocean"
document.documentElement.classList.toggle("dark", isDark)
```

## Behavior

- Imports Inter and Lora font packages plus the shared Tailwind wiring.
- Defines Manuscript as the default under `:root` and `[data-theme="manuscript"]`.
- Defines named preset tokens under `[data-theme="<name>"]`.
- Defines dark tokens under `.dark` for default Manuscript and under `[data-theme="<name>"].dark` for named presets.

## Presets

- `manuscript` - warm paper, forest accent, Lora serif over Inter body.
- `midnight` - cool focused indigo theme, Inter throughout.
- `slate` - neutral modernist theme with slate-blue accent.
- `sunset` - warm coral/amber theme with larger radius.
- `ocean` - calm teal SaaS theme.
- `mono` - high-contrast black and white theme with sharp corners.

## Notes

- If no `data-theme` attribute is set, Manuscript is used.
- Use a single named theme file instead when an app does not need runtime switching.
- Keep this file in sync with every individual preset so runtime switching matches direct imports.

## Related

- [Shared theme wiring](./_shared.md)
- [Theming reference](../../THEMING.md)
