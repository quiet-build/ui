# Claude / agent context

For instructions on using `@quietbuildlab/ui` in a consumer project, read **[`AGENTS.md`](./AGENTS.md)**. It covers install, CSS setup, dark mode, theming, composition rules, the `DataTable` API in depth, and common pitfalls.

For library-internal contributors (people working on this repo, not consuming it), the [`README.md`](./README.md) and [`THEMING.md`](./THEMING.md) cover local dev workflow and the full theming token reference. The **["Editing this library (contributors)"](./AGENTS.md#editing-this-library-contributors)** section in `AGENTS.md` carries the load-bearing docs rule: when you change a source file with a companion `.md`, update that Markdown file in the same commit. This is especially important for public components in `src/components/ui`, source helpers in `src/hooks` and `src/lib`, and theme entrypoints in `src/themes`.
