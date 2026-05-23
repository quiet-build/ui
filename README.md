# @quietbuildlab/ui

The shared UI component library for quietbuildlab apps. Ships **six ready-made
themes** plus 31 themable React components built on Radix UI + Tailwind v4.

📘 **[Live Storybook → quietbuildlab.github.io/ui](https://quietbuildlab.github.io/ui/)**
🤖 **AI-friendly:** [`llms.txt`](https://quietbuildlab.github.io/ui/llms.txt) · [`llms-full.txt`](https://quietbuildlab.github.io/ui/llms-full.txt) · [`AGENTS.md`](./AGENTS.md)

## Install

```
npm install @quietbuildlab/ui
```

Requires **Tailwind CSS v4** and React 18 or 19.

## Setup — pick a theme

In your app's main CSS file, pick one of three styles:

### 1. Default (Manuscript)

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/theme.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

### 2. A different preset

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes/midnight.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

Replace `midnight` with `manuscript`, `slate`, `sunset`, `ocean`, or `mono`.

### 3. Runtime theme switching

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/themes.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

Then toggle on `<html>`:

```ts
document.documentElement.dataset.theme = "midnight"   // or any preset name
document.documentElement.classList.toggle("dark", isDark)
```

The default (no `data-theme` attribute set) is Manuscript.

## The six presets

| Theme | Vibe | Accent | Radius | Type |
|---|---|---|---|---|
| **Manuscript** | Warm paper, editorial | Forest green | 4px | Lora + Inter |
| **Midnight** | Cool, focused | Indigo | 6px | Inter |
| **Slate** | Modernist, neutral, corporate | Slate-blue | 4px | Inter |
| **Sunset** | Warm, friendly, consumer | Coral / amber | 10px | Inter |
| **Ocean** | Calm, trustworthy SaaS | Teal | 6px | Inter |
| **Mono** | High-contrast, brutalist | Black / white | 0px | Inter + mono |

See them side-by-side in the **Guides → Theme Gallery** Storybook page.

## Dark mode

Every theme ships light + dark. Toggle a `dark` class on `<html>`:

```ts
document.documentElement.classList.toggle("dark", isDark)
```

## Components (31)

Accordion, Alert, AlertDialog, Avatar, Badge, Button, Calendar, Card, Checkbox,
DataTable, DatePicker, Dialog, DropdownMenu, FilePicker, Input, Label,
Pagination, Popover, Progress, RadioGroup, Select, Separator, Sheet, Skeleton,
Slider, Switch, Table, Tabs, Textarea, Toaster, Tooltip.

```tsx
import { Button, Sheet, SheetContent, SheetTrigger } from "@quietbuildlab/ui";
```

## Custom themes

Pick a preset that's closest to what you want, then override the tokens you
want different in your app CSS — *after* the preset import:

```css
:root {
  --primary: oklch(0.40 0.10 250);   /* deep blue accent */
  --radius: 0.5rem;                   /* softer corners */
}
.dark {
  --primary: oklch(0.65 0.10 250);
}
```

Every component re-themes automatically. See `THEMING.md` for the full token
list and the **Guides → Theming** story for a live token playground.

## Development

```
npm install        # install dependencies
npm run dev        # component preview gallery (light + dark)
npm test           # smoke tests
npm run typecheck  # type check
npm run build      # build dist/
```

## Publishing

Releases are automated via `.github/workflows/publish-npm.yml`. To cut a
release:

```
npm version minor      # or patch / major — updates package.json + creates a v0.X.0 tag
git push origin main
git push origin v0.X.0
```

The tag push triggers the `Publish to npm` workflow which verifies the tag
matches `package.json`, runs typecheck + tests + build, and publishes to npm
with provenance.

**One-time setup** (already done if the repo has a working release history):

The workflow authenticates to npm via **Trusted Publishing** (OIDC) — no
`NPM_TOKEN` secret needed. Configure it once at:

1. **npmjs.com → `@quietbuildlab/ui` → Settings → Trusted publishing**
2. Select publisher: **GitHub Actions**
3. Fields:
   - Organization or user: `quietbuildlab`
   - Repository: `ui`
   - Workflow filename: `publish-npm.yml`
   - Environment: *(leave empty)*
   - Allowed actions: `npm publish`
4. Save

You also need `@quietbuildlab` org membership on npm.

To re-run a failed publish without re-tagging, trigger the workflow manually
from the Actions tab (`Publish to npm → Run workflow`).
