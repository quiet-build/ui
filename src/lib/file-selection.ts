/**
 * Pure file-selection policy for FilePicker. Lives outside the component so the
 * accept/size/count rules are data-in / data-out and unit-testable without
 * rendering React. The component keeps only the React concerns (refs, live
 * region, DataTransfer sync) and routes the rejections this returns to onError.
 */

/** Reasons a file may be rejected from a selection. */
export type FilePickerErrorReason =
  | "file-too-large"
  | "too-many-files"
  | "invalid-type"

export type FileSelectionPolicy = {
  /** Forwarded `accept` string, e.g. `"image/*"` or `".pdf,.docx"`. */
  accept?: string
  /** Append to the current selection (true) or replace it (false). */
  multiple: boolean
  /** Per-file size cap in bytes. */
  maxSize?: number
  /** Cap on total selected files. */
  maxFiles?: number
}

export type FileRejection = {
  /** Absent for `"too-many-files"` — the excess is dropped, not identified. */
  file?: File
  reason: FilePickerErrorReason
}

export type FileSelectionResult = {
  /** The next selection after applying the policy. */
  next: File[]
  /** Every file (or count) rejected while computing `next`, in order. */
  rejections: FileRejection[]
}

/** True when `file` satisfies the `accept` string (wildcard, extension, or MIME). */
export function matchesAccept(file: File, accept: string): boolean {
  const tokens = accept.split(",").map((t) => t.trim().toLowerCase())
  return tokens.some((t) => {
    if (t.endsWith("/*")) {
      return file.type.toLowerCase().startsWith(t.slice(0, -1))
    }
    if (t.startsWith(".")) return file.name.toLowerCase().endsWith(t)
    return file.type.toLowerCase() === t
  })
}

/** Reason `file` violates the policy, or `null` if it passes. */
export function validateFile(
  file: File,
  policy: FileSelectionPolicy,
): FilePickerErrorReason | null {
  if (policy.maxSize != null && file.size > policy.maxSize) {
    return "file-too-large"
  }
  if (policy.accept && !matchesAccept(file, policy.accept)) {
    return "invalid-type"
  }
  return null
}

/**
 * Apply `incoming` files onto the `current` selection under `policy`, returning
 * the next selection plus an ordered list of rejections (per-file first, then a
 * single `"too-many-files"` if the cap trimmed the result).
 */
export function selectFiles(
  current: File[],
  incoming: File[],
  policy: FileSelectionPolicy,
): FileSelectionResult {
  const rejections: FileRejection[] = []
  const accepted: File[] = []
  for (const f of incoming) {
    const err = validateFile(f, policy)
    if (err) {
      rejections.push({ file: f, reason: err })
      continue
    }
    accepted.push(f)
  }

  let next = policy.multiple ? [...current, ...accepted] : accepted.slice(0, 1)
  if (policy.maxFiles != null && next.length > policy.maxFiles) {
    rejections.push({ reason: "too-many-files" })
    next = next.slice(0, policy.maxFiles)
  }
  return { next, rejections }
}
