import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select'

const meta: Meta = {
  title: 'UI/Select',
  tags: ['autodocs', 'ai-generated'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="w-48">
      <Select defaultOpen>
        <SelectTrigger>
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="jpeg">JPEG</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Closed: Story = {
  render: () => (
    <div className="w-48">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="jpeg">JPEG</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvas, userEvent, canvasElement }) => {
    const trigger = canvas.getByRole('combobox')
    await userEvent.click(trigger)
    const { within, waitFor } = await import('storybook/test')
    const listbox = await within(canvasElement.ownerDocument.body).findByRole('listbox')
    await waitFor(() => expect(listbox).toBeVisible())
  },
}

export const WithGroup: Story = {
  render: () => (
    <div className="w-48">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Image formats</SelectLabel>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}
