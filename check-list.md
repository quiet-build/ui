# quietbuildlab-ui — Production Release Checklist
> Generated 2026-07-11 from the portfolio review. Portfolio summary: ~/projects/check-list.md
**Status**: Shipped & healthy — shared "Manuscript" design system (npm `@quietbuildlab/ui@0.7.0`, 31+ Base UI + Tailwind v4 components, six themes). The most production-solid of the five; consumed by privacy-blur and my-nextjs-blog. OIDC publishing on tag push works.

## Do yourself (human-only)
- [ ] Nothing blocking — the package is live and current. For the next release: run `npm version <x>` and push the tag; OIDC trusted publishing does the rest.

## Decisions needed
- Whether to pin `typescript@^6.0.3` and `vite@^8` (currently bleeding-edge) to avoid peer-dependency conflicts in consumers.
- Whether to keep npm here while consumers use pnpm (minor friction, not a blocker).

## Delegate to Claude (automatable)
- Add Renovate/Dependabot to keep consumers current (privacy-blur is on `^0.6.1`, blog on `^0.6.0`, vs `0.7.0` shipped).
- Add visual-regression testing (Storybook + Playwright screenshot diffs) across all six themes.
- Ship a `ThemeSwitcher` recipe.
- Add data-table empty / loading / error recipes.
- Add a bundle-size budget check to CI.

## Risks to keep in mind
- `typescript@^6.0.3` and `vite@^8` are bleeding-edge — a consumer on older tooling may hit peer conflicts.
- Library uses npm while both consumers use pnpm — minor lockfile/tooling friction.
- Consumers lag behind the shipped version, so improvements don't reach users until they bump.
