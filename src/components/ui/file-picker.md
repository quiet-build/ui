# FilePicker

Compound file picker with click + drag-and-drop, controlled / uncontrolled, per-file preview/size/remove, and `accept` / `maxSize` / `maxFiles` validation.

## Import

```tsx
import {
  FilePicker, FilePickerDropzone, FilePickerTrigger, FilePickerInput,
  FilePickerList, FilePickerItem, FilePickerClear,
  formatBytes, type FilePickerErrorReason,
} from '@quietbuildlab/ui'
```

## Props

**FilePicker**:
- `value` / `defaultValue`: `File[]`
- `onValueChange(files: File[])`
- `accept`: MIME / extension list (e.g. `"image/*"`, `".pdf,.docx"`)
- `multiple` (default `true`)
- `maxFiles`: number
- `maxSize`: bytes
- `disabled`
- `onError(reason: FilePickerErrorReason, file?: File)` — fires on `too-many-files`, `file-too-large`, `wrong-type`, etc.

## Usage

Default layout — renders dropzone + trigger + list automatically:

```tsx
<FilePicker
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  onValueChange={(files) => console.log(files)}
  onError={(reason, file) => toast.error(`${reason}: ${file?.name}`)}
/>
```

Compound — full control over composition:

```tsx
<FilePicker accept=".pdf" maxFiles={3} onValueChange={setFiles}>
  <FilePickerDropzone>
    Drop PDFs here, or
    <FilePickerTrigger>browse</FilePickerTrigger>
  </FilePickerDropzone>
  <FilePickerInput />
  <FilePickerList />
  <FilePickerClear>Clear all</FilePickerClear>
</FilePicker>
```

## Helpers

- `formatBytes(n)` — formats a byte count as `"1.2 MB"` etc.
- `FilePickerErrorReason` — union type for the `onError` reason argument.

## Notes

- If you don't pass children, FilePicker renders a default dropzone + trigger + list layout.
- For *uploading* files, hook into `onValueChange` and send them yourself — FilePicker is selection only.
- **Accessibility**: `<FilePickerDropzone>` is `role="button"` and keyboard-activatable (Enter / Space). When composing your own layout, **don't nest a `<FilePickerTrigger>` button inside `<FilePickerDropzone>`** — the dropzone is already the button, and a nested interactive widget confuses screen readers. Put the trigger button outside the dropzone instead.

## Related

- [Dialog](./dialog.md), [Sheet](./sheet.md) — common wrappers for upload flows

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/file-picker.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-filepicker--default)
