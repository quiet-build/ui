# @quietbuildlab/ui

The shared UI component library for quietbuildlab apps — the **Manuscript** design
system. Warm paper surfaces, Lora serif headings over Inter body text, crisp 4px
corners, a single Forest-green accent, light + dark.

📘 **[Live Storybook → quietbuildlab.github.io/ui](https://quietbuildlab.github.io/ui/)**
🤖 **AI-friendly:** [`llms.txt`](https://quietbuildlab.github.io/ui/llms.txt) · [`llms-full.txt`](https://quietbuildlab.github.io/ui/llms-full.txt) · [`AGENTS.md`](./AGENTS.md)

## Install

```
npm install @quietbuildlab/ui
```

Requires **Tailwind CSS v4** and React 18 or 19 in the consuming app.

## Setup

In your app's main CSS file:

```css
@import "tailwindcss";
@import "@quietbuildlab/ui/theme.css";
@source "../node_modules/@quietbuildlab/ui/dist";
```

Then import components:

```tsx
import { Button, Dialog } from "@quietbuildlab/ui";
```

## Dark mode

The theme ships light + dark. Toggle a `dark` class on `<html>`:

```ts
document.documentElement.classList.toggle("dark", isDark);
```

## Components

Button, Input, Textarea, Label, Card, Badge, Dialog, DropdownMenu, Tooltip,
Select, Checkbox, Switch, RadioGroup, Tabs, Separator, Skeleton, Progress, Toaster,
Table, Pagination, DataTable.

## Theming

Override any token in your app CSS after `@import "@quietbuildlab/ui/theme.css"`:

```css
:root {
  --primary: oklch(0.40 0.10 250);   /* deep blue accent */
  --radius: 0.5rem;                   /* softer corners */
}
```

Every component re-themes automatically. See `THEMING.md` for the full token list
and worked examples, or run `npm run storybook` and open the **Guides → Theming**
story for a live control panel.

## Development

```
npm install        # install dependencies
npm run dev        # component preview gallery (light + dark)
npm test           # smoke tests
npm run typecheck  # type check
npm run build      # build dist/
```

## Publishing

Releases are manual:

```
npm run build
npm publish --access public
```

Requires membership in the `@quietbuildlab` npm org and `npm login`.
