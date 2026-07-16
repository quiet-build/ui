# Voice & Content — `@quietbuildlab/ui`

House style for UI copy across apps that consume this library. Adapted from
Vercel's Geist content guidelines. The goal is one consistent voice so every
Quiet Build app reads the same — and so an agent generating a new screen has a
spec to follow instead of improvising.

Keep it plain, specific, and calm. Write for someone mid-task who wants to keep
moving.

## Capitalization

- **Title Case** for UI labels, buttons, menu items, and titles: `Save Changes`, `New Project`, `Delete File`.
- **Sentence case** for descriptions, help text, and body copy: `Your preferences apply on next sign-in.`

## Actions (buttons, menu items)

- **Verb + noun**, not vague acknowledgements: `Deploy Project`, `Add Member`, `Delete File` — not `OK`, `Submit`, `Yes`.
- Name the specific object when there is one: `Delete invoice-2026.pdf`, not `Delete`.
- Keep the destructive verb honest: `Delete`, `Remove`, `Revoke` — never soften a destructive action into `OK`.

## Errors

Two parts: **what happened** + **what to do next**.

- Good: `Couldn't save changes. Check your connection and try again.`
- Bad: `Error 500` / `Something went wrong.`

Blame the situation, not the user. Prefer `We couldn't reach the server` over `You entered an invalid value` where possible.

## Toasts (transient notifications)

- Name the specific item; no trailing period; no `successfully`.
  - Good: `Changes saved` · `invoice-2026.pdf deleted` · `Member added`
  - Bad: `Saved successfully.` · `Done!`
- Put any recovery detail in the toast `description`, not the title.
- Use for confirmations and non-blocking status; use `Alert` for in-flow status and `AlertDialog` for anything that needs a decision.

## Empty states

Say what would be here, then point at the first action.

- `No projects yet. Create your first project to get started.` + a primary button.

## In-progress states

Present participle + ellipsis: `Saving…`, `Uploading…`, `Deleting…`. Switch to a completion toast when done (`Changes saved`).

## Status color meaning

Pair the word with the right status token/variant so color reinforces meaning (never color alone — the icon and text carry it too):

| Meaning | Token / variant | Typical use |
|---|---|---|
| Success / done | `success` | Saved, published, connected |
| Needs attention | `warning` | Expiring, quota low, unsaved |
| Neutral info | `info` | Tips, "new in this release", beta |
| Error / failure | `destructive` | Failed, rejected, offline |

## Small stuff

- Use numerals: `3 files`, not `three files`.
- Curly quotes (`'` `"`) and a real ellipsis (`…`).
- Omit `please` — it reads as filler in UI.
- Prefer active voice and short sentences.
