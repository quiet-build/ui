# Package Exports

Public barrel for `@quietbuildlab/ui`. Everything exported here is available from the package root.

## Import

```tsx
import { Button, Dialog, DataTable } from '@quietbuildlab/ui'
```

## What It Exports

- All themed UI components from `src/components/ui/*`.
- Compound component parts such as `DialogTrigger`, `CardHeader`, `SelectContent`, and similar sub-components.
- Component helper types and utilities that are intentionally exported by their component module, such as `FilePickerErrorReason` and `formatBytes`.

## Notes

- Consumers should import from `@quietbuildlab/ui`, not from `dist` or internal source paths.
- If a new public component is added, export it here and add/update the matching component `.md` file.
- Theme CSS is exported through package subpaths such as `@quietbuildlab/ui/themes/midnight.css`; it is not exported from this TypeScript barrel.

## Related

- [Agent guide](../AGENTS.md) - consumer and contributor rules
- [Theming](../THEMING.md) - token reference and theme setup
