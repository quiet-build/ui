# quietbuildlab-ui — Improvements (UI / UX / design / workflow)
> Generated 2026-07-11 from the portfolio review. Portfolio summary: ~/projects/improvements.md

1. **Close the consumer version lag with Renovate/Dependabot.** privacy-blur pins `^0.6.1` and my-nextjs-blog `^0.6.0` while `0.8.0` is shipped — automated dependency PRs would keep them current so new components (e.g. the v0.7.0 collapsible Sidebar) actually reach production.
2. **Add visual-regression testing across the six themes.** Wire Storybook 10 + Playwright screenshot diffs so theme changes and component tweaks are caught visually before publish — the library already runs Vitest browser mode + Playwright, so the infra is largely in place.
3. **Ship a `ThemeSwitcher` recipe.** The library exposes six themes via `next-themes`; a documented, drop-in switcher recipe would let consumers adopt theming without hand-rolling it (both privacy-blur and cxzc could use it).
4. **Add data-table empty / loading / error recipes.** The TanStack-table-backed data table needs documented states so consumers render consistent empty/loading/error UI rather than improvising.
5. **Add a bundle-size budget in CI.** With tsup output and a growing component count, a size budget guards consumers (Astro/Vite apps) against silent bundle bloat.
6. **Pin the bleeding-edge toolchain.** `typescript@^6.0.3` and `vite@^8` risk peer conflicts downstream; pinning them is a small workflow change that protects every consumer.
