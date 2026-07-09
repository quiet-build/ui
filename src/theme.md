# theme.css

Backward-compatible CSS entrypoint for the default Manuscript theme.

## Import

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/theme.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

## Behavior

- Imports `src/themes/manuscript.css`.
- Preserves the original package entrypoint for apps that adopted the library before named theme entrypoints existed.
- Defines the default Manuscript token set on `:root` and dark tokens under `.dark` through the imported theme file.

## Notes

- New apps can import a named preset from `@quietbuildlab/ui/themes/<name>.css`.
- Apps that need runtime switching should import `@quietbuildlab/ui/themes.css` instead.
- Do not import multiple theme entrypoints in the same CSS bundle unless intentional cascade override is desired.

## Related

- [Manuscript theme](./themes/manuscript.md)
- [Bundled themes](./themes/index.md)
