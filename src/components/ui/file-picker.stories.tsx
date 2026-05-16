import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { Button } from './button'
import {
  FilePicker,
  FilePickerClear,
  FilePickerDropzone,
  FilePickerItem,
  FilePickerList,
  FilePickerTrigger,
  formatBytes,
} from './file-picker'

const meta: Meta<typeof FilePicker> = {
  title: 'UI/FilePicker',
  component: FilePicker,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxSize: { control: 'number' },
    maxFiles: { control: 'number' },
  },
  args: {
    accept: 'image/*',
    multiple: false,
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof FilePicker>

/**
 * Default layout: dropzone with upload-icon hint, click-to-browse trigger,
 * and an auto-rendered selected-files list below.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <FilePicker {...args} />
    </div>
  ),
}

/**
 * Multi-file mode. Drag in (or pick) several at once — they all show up
 * in the list with per-row preview/size/remove.
 */
export const Multiple: Story = {
  args: { multiple: true },
  render: (args) => (
    <div className="w-96">
      <FilePicker {...args} />
    </div>
  ),
}

/**
 * Custom dropzone label + a primary-variant Trigger + an opt-in "Clear all"
 * button. Demonstrates the compound API.
 */
export const CustomLayout: Story = {
  render: (args) => (
    <div className="w-96 space-y-3">
      <FilePicker {...args} multiple>
        <FilePickerDropzone className="border-primary/40 bg-primary/5">
          <UploadCloud className="size-10 text-primary" aria-hidden />
          <div className="text-center">
            <FilePickerTrigger variant="default">Browse images</FilePickerTrigger>
            <p className="mt-2 text-xs text-muted-foreground">PNG, JPG, WebP — up to 5 MB each</p>
          </div>
        </FilePickerDropzone>
        <FilePickerList />
        <div className="flex justify-end">
          <FilePickerClear />
        </div>
      </FilePicker>
    </div>
  ),
}

/**
 * Custom row renderer — drop the default preview/name/size/remove layout
 * and bring your own. Receives `file` and `index`; call `removeFile` via
 * `FilePickerItem` or render entirely from scratch.
 */
export const CustomItemRenderer: Story = {
  render: (args) => (
    <div className="w-96">
      <FilePicker {...args} multiple accept="image/*">
        <FilePickerDropzone>
          <FilePickerTrigger />
        </FilePickerDropzone>
        <FilePickerList
          className="grid grid-cols-3 gap-2"
          renderItem={(file) => (
            <div className="aspect-square overflow-hidden rounded border border-input bg-muted">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div className="grid size-full place-items-center text-xs text-muted-foreground">
                  {file.name}
                </div>
              )}
            </div>
          )}
        />
      </FilePicker>
    </div>
  ),
}

/**
 * Controlled selection — external state owns the file list. Useful when
 * you need to pre-populate, sync with a form library, or share files
 * between multiple components.
 */
export const Controlled: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([])
    return (
      <div className="w-96 space-y-3">
        <FilePicker {...args} multiple value={files} onFilesChange={setFiles} />
        <p className="text-sm text-muted-foreground">
          External state: {files.length} file(s),{' '}
          {formatBytes(files.reduce((acc, f) => acc + f.size, 0))}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={files.length === 0}
          onClick={() => setFiles([])}
        >
          Reset from outside
        </Button>
      </div>
    )
  },
}

/**
 * Validation: rejects files over `maxSize` and caps total at `maxFiles`.
 * Rejected files surface through `onError`.
 */
export const WithValidation: Story = {
  args: {
    multiple: true,
    accept: 'image/*',
    maxSize: 100 * 1024, // 100 KB
    maxFiles: 3,
  },
  render: (args) => {
    const [error, setError] = useState<string | null>(null)
    return (
      <div className="w-96 space-y-3">
        <FilePicker
          {...args}
          onError={(reason, file) =>
            setError(
              reason === 'too-many-files'
                ? `Too many files (max ${args.maxFiles})`
                : `${file?.name ?? 'file'}: ${reason}`,
            )
          }
          onFilesChange={() => setError(null)}
        />
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
}

/**
 * Disabled state — trigger, drop, and remove buttons all become inert.
 * Visual reflects via `data-disabled` on the dropzone.
 */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="w-96">
      <FilePicker {...args} />
    </div>
  ),
}

/**
 * Use `FilePickerItem` directly when you want default per-row UI but in a
 * non-default container layout (e.g. a `<table>` or a custom grid).
 */
export const ExplicitItems: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([])
    return (
      <div className="w-96">
        <FilePicker {...args} multiple value={files} onFilesChange={setFiles}>
          <FilePickerDropzone>
            <FilePickerTrigger />
          </FilePickerDropzone>
          <FilePickerList>
            {files.map((f, i) => (
              <FilePickerItem key={i} file={f} index={i} className="bg-secondary" />
            ))}
          </FilePickerList>
        </FilePicker>
      </div>
    )
  },
}
