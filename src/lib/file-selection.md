# File Selection

Pure FilePicker selection policy for accept, file size, count, and single/multiple behavior.

## Import

```ts
import {
  matchesAccept,
  selectFiles,
  validateFile,
  type FilePickerErrorReason,
  type FileSelectionPolicy,
  type FileSelectionResult,
} from './file-selection'
```

The `FilePickerErrorReason` type is re-exported through the FilePicker component API. The policy helpers themselves are internal.

## Types

```ts
type FilePickerErrorReason = "file-too-large" | "too-many-files" | "invalid-type"

type FileSelectionPolicy = {
  accept?: string
  multiple: boolean
  maxSize?: number
  maxFiles?: number
}

type FileSelectionResult = {
  next: File[]
  rejections: FileRejection[]
}
```

## Behavior

- `matchesAccept(file, accept)` supports MIME types, wildcard MIME groups such as `image/*`, and file extensions such as `.pdf`.
- `validateFile(file, policy)` returns the first per-file rejection reason or `null`.
- `selectFiles(current, incoming, policy)` applies the full policy and returns the next accepted selection plus ordered rejections.
- Per-file rejections are reported before a final `too-many-files` rejection if the resulting list is trimmed.
- In single-file mode, incoming files replace the current selection and are capped to the first accepted file.

## Source

- [Source](./file-selection.ts)
