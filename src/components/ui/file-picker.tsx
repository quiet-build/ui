import * as React from "react"
import { File as FileIcon, Image as ImageIcon, UploadCloud, X } from "lucide-react"

import { Button } from "#components/ui/button"
import { cn } from "#lib/utils"
import { useControllableState } from "#hooks/use-controllable-state"
import { selectFiles, type FilePickerErrorReason } from "#lib/file-selection"

export type { FilePickerErrorReason }

type FilePickerContextValue = {
  files: File[]
  addFiles: (files: File[]) => void
  removeFile: (index: number) => void
  clear: () => void
  open: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  isDragActive: boolean
  setDragActive: (v: boolean) => void
  accept?: string
  multiple: boolean
  disabled: boolean
  maxSize?: number
  maxFiles?: number
  onError?: (reason: FilePickerErrorReason, file?: File) => void
}

const FilePickerContext = React.createContext<FilePickerContextValue | null>(null)

function useFilePicker(): FilePickerContextValue {
  const ctx = React.useContext(FilePickerContext)
  if (!ctx) {
    throw new Error(
      "FilePicker subcomponents must be used inside a <FilePicker> root.",
    )
  }
  return ctx
}

/* ─────────────────────────────────────────────────────────────────────────
 * Root
 * ─────────────────────────────────────────────────────────────────────── */

export type FilePickerProps = {
  /** Forwarded to `<input type="file">`. Examples: `"image/*"`, `".pdf,.docx"`. */
  accept?: string
  /** Allow multiple file selection. Default `false`. */
  multiple?: boolean
  disabled?: boolean
  /** Controlled value. Pair with `onFilesChange`. */
  value?: File[]
  /** Uncontrolled initial selection. */
  defaultValue?: File[]
  /** Fires whenever the selection changes (add, remove, clear). */
  onFilesChange?: (files: File[]) => void
  /** Per-file size cap in bytes. Files over this are rejected via `onError`. */
  maxSize?: number
  /** Cap on total selected files. Extras are trimmed and `onError` fires. */
  maxFiles?: number
  /**
   * Called when a file is rejected. The `file` arg is absent for the
   * `"too-many-files"` case (the excess is dropped, not identified).
   */
  onError?: (reason: FilePickerErrorReason, file?: File) => void
  /**
   * Custom layout. If omitted, renders the default Dropzone + Trigger + List.
   * Pass subcomponents to take full control.
   */
  children?: React.ReactNode
  className?: string
}

/**
 * Themed file picker with click-to-browse, drag-and-drop, validation,
 * per-file preview/remove, and full CSS customization via the compound API.
 *
 * @example
 * <FilePicker accept="image/*" multiple onFilesChange={(f) => console.log(f)} />
 *
 * @example
 * <FilePicker
 *   accept=".pdf"
 *   maxSize={5 * 1024 * 1024}
 *   onError={(reason, file) => toast.error(`${file?.name}: ${reason}`)}
 * >
 *   <FilePickerDropzone className="border-primary">
 *     <FilePickerTrigger>Choose a PDF</FilePickerTrigger>
 *   </FilePickerDropzone>
 *   <FilePickerList />
 * </FilePicker>
 */
function FilePicker({
  accept,
  multiple = false,
  disabled = false,
  value,
  defaultValue,
  onFilesChange,
  maxSize,
  maxFiles,
  onError,
  children,
  className,
}: FilePickerProps) {
  const [files, setFiles] = useControllableState<File[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onFilesChange,
  })
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [isDragActive, setDragActive] = React.useState(false)
  // Polite SR announcement when a file is removed. Auto-clears so successive
  // removes of the same filename re-announce.
  const [removedAnnouncement, setRemovedAnnouncement] = React.useState("")
  React.useEffect(() => {
    if (!removedAnnouncement) return
    const id = setTimeout(() => setRemovedAnnouncement(""), 1500)
    return () => clearTimeout(id)
  }, [removedAnnouncement])

  // Keep the latest onError in a ref so the context value identity stays
  // stable across renders unless `files` actually changes.
  const onErrorRef = React.useRef(onError)
  React.useEffect(() => { onErrorRef.current = onError }, [onError])

  const commit = React.useCallback(
    (next: File[]) => {
      setFiles(next)
      // Sync the hidden input's FileList so form submission and direct
      // `inputRef.current.files` reads reflect the live selection.
      if (inputRef.current) {
        const dt = new DataTransfer()
        next.forEach((f) => dt.items.add(f))
        inputRef.current.files = dt.files
      }
    },
    [setFiles],
  )

  const addFiles = React.useCallback(
    (incoming: File[]) => {
      const { next, rejections } = selectFiles(files, incoming, {
        accept,
        multiple,
        maxSize,
        maxFiles,
      })
      for (const r of rejections) onErrorRef.current?.(r.reason, r.file)
      commit(next)
    },
    [files, accept, multiple, maxSize, maxFiles, commit],
  )

  const removeFile = React.useCallback(
    (index: number) => {
      const removed = files[index]
      commit(files.filter((_, i) => i !== index))
      if (removed) setRemovedAnnouncement(`Removed ${removed.name}`)
    },
    [files, commit],
  )

  const clear = React.useCallback(() => commit([]), [commit])
  const open = React.useCallback(() => inputRef.current?.click(), [])

  const ctxValue = React.useMemo<FilePickerContextValue>(
    () => ({
      files,
      addFiles,
      removeFile,
      clear,
      open,
      inputRef,
      isDragActive,
      setDragActive,
      accept,
      multiple,
      disabled,
      maxSize,
      maxFiles,
      onError,
    }),
    [
      files,
      addFiles,
      removeFile,
      clear,
      open,
      isDragActive,
      accept,
      multiple,
      disabled,
      maxSize,
      maxFiles,
      onError,
    ],
  )

  return (
    <FilePickerContext.Provider value={ctxValue}>
      <div
        data-slot="file-picker"
        data-disabled={disabled || undefined}
        className={cn("flex w-full flex-col gap-3", className)}
      >
        <FilePickerInput />
        {children ?? <FilePickerDefaultLayout />}
        {/* Polite live region — announces "Removed {filename}" when a file is
            removed. Visually hidden but readable by AT. */}
        <span
          data-slot="file-picker-announcer"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {removedAnnouncement}
        </span>
      </div>
    </FilePickerContext.Provider>
  )
}

function FilePickerDefaultLayout() {
  const { multiple, files } = useFilePicker()
  return (
    <>
      {/* The dropzone is the button now (role="button", keyboard-activatable).
          We don't nest a separate <FilePickerTrigger /> button inside — nested
          interactive controls confuse screen readers and complicate focus.
          The text content describes the action. */}
      <FilePickerDropzone aria-label={multiple ? "Choose files or drop files here" : "Choose a file or drop a file here"}>
        <UploadCloud className="size-8 text-muted-foreground" aria-hidden="true" />
        <div className="text-center">
          <span className="text-sm font-medium">{defaultTriggerLabel(files.length, multiple)}</span>
          {/* Drag-and-drop hint is purely visual — keyboard/SR users can't drag
              and the aria-label already says "or drop files here". */}
          <p aria-hidden="true" className="mt-2 text-sm text-muted-foreground">or drag and drop</p>
        </div>
      </FilePickerDropzone>
      <FilePickerList />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Hidden <input type="file">
 * ─────────────────────────────────────────────────────────────────────── */

function FilePickerInput({
  className,
  onChange,
  ...props
}: React.ComponentProps<"input">) {
  const { inputRef, accept, multiple, disabled, addFiles } = useFilePicker()
  return (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      // sr-only keeps it in the AT but visually hidden; tabIndex=-1 so the
      // visible Trigger is the sole keyboard entry point.
      className={cn("sr-only", className)}
      tabIndex={-1}
      data-slot="file-picker-input"
      onChange={(e) => {
        onChange?.(e)
        const list = e.target.files
        if (list && list.length > 0) addFiles(Array.from(list))
        // Reset so picking the same file twice still fires onChange.
        e.target.value = ""
      }}
      {...props}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Trigger — forwards Button's variant/size/render
 * ─────────────────────────────────────────────────────────────────────── */

type FilePickerTriggerProps = React.ComponentProps<typeof Button>

function FilePickerTrigger({
  className,
  children,
  onClick,
  variant,
  size,
  disabled,
  ...props
}: FilePickerTriggerProps) {
  const { open, multiple, disabled: ctxDisabled, files } = useFilePicker()
  return (
    <Button
      {...props}
      type="button"
      variant={variant ?? "outline"}
      size={size ?? "default"}
      disabled={ctxDisabled || disabled}
      data-slot="file-picker-trigger"
      className={className}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) open()
      }}
    >
      {children ?? defaultTriggerLabel(files.length, multiple)}
    </Button>
  )
}

function defaultTriggerLabel(count: number, multiple: boolean): string {
  if (count === 0) return multiple ? "Choose files" : "Choose file"
  return multiple ? "Add more" : "Change file"
}

/* ─────────────────────────────────────────────────────────────────────────
 * Dropzone — drag target
 * ─────────────────────────────────────────────────────────────────────── */

function FilePickerDropzone({
  className,
  children,
  onClick,
  onKeyDown,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  ...props
}: React.ComponentProps<"div">) {
  const { addFiles, open, disabled, isDragActive, setDragActive } = useFilePicker()
  return (
    <div
      {...props}
      data-slot="file-picker-dropzone"
      data-drag-active={isDragActive || undefined}
      data-disabled={disabled || undefined}
      // Keyboard users need a focusable entry point that's not just the drag
      // affordance — Enter/Space opens the native file picker the same way
      // mouse click does. role="button" makes screen readers announce purpose.
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || disabled) return
        // Don't re-trigger when clicking an interactive child (e.g. a nested
        // button or link). Those handle their own activation.
        const target = e.target as HTMLElement
        if (target.closest("button, a, input, select, textarea, [role=button]") !== e.currentTarget) {
          return
        }
        open()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.defaultPrevented || disabled) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          open()
        }
      }}
      onDragEnter={(e) => {
        onDragEnter?.(e)
        if (e.defaultPrevented || disabled) return
        e.preventDefault()
        setDragActive(true)
      }}
      onDragOver={(e) => {
        onDragOver?.(e)
        if (e.defaultPrevented || disabled) return
        // Required to enable drop on this element.
        e.preventDefault()
      }}
      onDragLeave={(e) => {
        onDragLeave?.(e)
        // Only deactivate when leaving the dropzone — not when crossing into a child.
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
        setDragActive(false)
      }}
      onDrop={(e) => {
        onDrop?.(e)
        if (e.defaultPrevented || disabled) return
        e.preventDefault()
        setDragActive(false)
        const list = e.dataTransfer.files
        if (list && list.length > 0) addFiles(Array.from(list))
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-input bg-transparent p-6 transition-colors outline-none",
        "cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "data-[drag-active]:border-ring data-[drag-active]:bg-accent/50",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * List + Item
 * ─────────────────────────────────────────────────────────────────────── */

export type FilePickerListProps = Omit<React.ComponentProps<"ul">, "children"> & {
  /** Custom item renderer. Receives the file and its index. */
  renderItem?: (file: File, index: number) => React.ReactNode
  /** Hide entirely when no files are selected. Default `true`. */
  hideWhenEmpty?: boolean
  /** Override default rendering entirely with custom children. */
  children?: React.ReactNode
}

function FilePickerList({
  className,
  renderItem,
  hideWhenEmpty = true,
  children,
  ...props
}: FilePickerListProps) {
  const { files } = useFilePicker()
  if (!children && files.length === 0 && hideWhenEmpty) return null
  return (
    <ul
      {...props}
      data-slot="file-picker-list"
      className={cn("flex flex-col gap-2", className)}
    >
      {children ??
        files.map((f, i) =>
          renderItem ? (
            <li key={fileKey(f, i)}>{renderItem(f, i)}</li>
          ) : (
            <FilePickerItem key={fileKey(f, i)} file={f} index={i} />
          ),
        )}
    </ul>
  )
}

export type FilePickerItemProps = Omit<React.ComponentProps<"li">, "children"> & {
  file: File
  index: number
  /** Show a thumbnail preview for image files. Default `true`. */
  preview?: boolean
  /** Override the entire row contents. */
  children?: React.ReactNode
}

function FilePickerItem({
  file,
  index,
  preview = true,
  className,
  children,
  ...props
}: FilePickerItemProps) {
  const { removeFile, disabled } = useFilePicker()
  const isImage = file.type.startsWith("image/")
  const previewUrl = React.useMemo(
    () => (isImage && preview ? URL.createObjectURL(file) : null),
    [file, isImage, preview],
  )
  React.useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    },
    [previewUrl],
  )

  return (
    <li
      {...props}
      data-slot="file-picker-item"
      className={cn(
        "flex items-center gap-3 rounded-md border border-input bg-card p-2 text-sm",
        className,
      )}
    >
      {children ?? (
        <>
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border border-input bg-muted">
            {previewUrl ? (
              <img src={previewUrl} alt="" className="size-full object-cover" />
            ) : isImage ? (
              <ImageIcon className="size-5 text-muted-foreground" aria-hidden />
            ) : (
              <FileIcon className="size-5 text-muted-foreground" aria-hidden />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            data-slot="file-picker-remove"
            aria-label={`Remove ${file.name}`}
            disabled={disabled}
            onClick={(e) => {
              // Capture sibling-or-fallback focus target BEFORE removing — the
              // DOM mutation below would otherwise leave focus on <body>.
              const li = (e.currentTarget as HTMLButtonElement).closest(
                'li[data-slot="file-picker-item"]',
              )
              const targetLi =
                (li?.nextElementSibling as HTMLElement | null) ??
                (li?.previousElementSibling as HTMLElement | null)
              const targetButton = targetLi?.querySelector<HTMLButtonElement>(
                'button[data-slot="file-picker-remove"]',
              )

              removeFile(index)

              // Move focus on the next microtask — after React unmounts this
              // item. If there's another item, focus its remove button. If
              // the list is empty now, fall back to the dropzone or trigger
              // so focus doesn't escape to <body>.
              queueMicrotask(() => {
                if (targetButton && document.contains(targetButton)) {
                  targetButton.focus()
                  return
                }
                const fallback = document.querySelector<HTMLElement>(
                  '[data-slot="file-picker-dropzone"], [data-slot="file-picker-trigger"]',
                )
                fallback?.focus()
              })
            }}
          >
            <X className="size-4" />
          </Button>
        </>
      )}
    </li>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Clear-all button
 * ─────────────────────────────────────────────────────────────────────── */

function FilePickerClear({
  className,
  children,
  variant,
  size,
  disabled,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { clear, files, disabled: ctxDisabled } = useFilePicker()
  if (files.length === 0) return null
  return (
    <Button
      {...props}
      type="button"
      variant={variant ?? "ghost"}
      size={size ?? "sm"}
      disabled={ctxDisabled || disabled}
      data-slot="file-picker-clear"
      className={className}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) clear()
      }}
    >
      {children ?? "Clear all"}
    </Button>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Helpers
 * ─────────────────────────────────────────────────────────────────────── */

/** Human-readable byte size (e.g. `"1.4 MB"`). Exported for caller use. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

function fileKey(file: File, index: number): string {
  // Best-effort stable key: name + size + lastModified, falling back to index.
  return `${file.name}:${file.size}:${file.lastModified}:${index}`
}

export {
  FilePicker,
  FilePickerClear,
  FilePickerDropzone,
  FilePickerInput,
  FilePickerItem,
  FilePickerList,
  FilePickerTrigger,
}
