# Toaster (sonner)

Toast notification host. Mount once at the app root, then trigger toasts from anywhere with `toast()` from `sonner`.

## Import

```tsx
import { Toaster } from '@quietbuildlab/ui'
import { toast } from 'sonner'
```

## Usage

Mount once at the app root:

```tsx
// app/layout.tsx (Next.js) or root layout
<Toaster />
```

Trigger from anywhere:

```tsx
toast('File saved')
toast.success('Uploaded successfully')
toast.error('Upload failed', { description: 'Check your connection.' })
toast.loading('Saving…')
toast.promise(savePromise, {
  loading: 'Saving…',
  success: 'Saved',
  error: 'Save failed',
})
```

## Notes

- `toast.success` / `.info` / `.warning` / `.error` render a semantically colored icon (via the `--success`, `--info`, `--warning`, `--destructive` tokens) on an otherwise neutral toast — status is conveyed by icon shape *and* color, and follows the active theme in both light and dark.
- Internally uses `next-themes` for color-mode detection. Without a `<ThemeProvider attribute="class">` wrapping the app, `Toaster` falls back to OS `prefers-color-scheme` instead of tracking the `.dark` class on `<html>`. Install `next-themes` and wrap if you need it to follow the class.
- `toast` is imported from `sonner` (the underlying library), not `@quietbuildlab/ui` — that's intentional so you keep direct access to sonner's full API.

## Related

- [Alert](./alert.md) — inline status banners (non-blocking, in-flow)
- [AlertDialog](./alert-dialog.md) — blocking yes/no confirmations

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/sonner.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-sonner--default)
