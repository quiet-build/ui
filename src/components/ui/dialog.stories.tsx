import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

const meta: Meta = {
  title: 'UI/Dialog',
  tags: ['autodocs', 'ai-generated'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline">Rename file</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
          <DialogDescription>Give it a clearer name.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="filename">File name</Label>
          <Input id="filename" defaultValue="untitled.txt" />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithTrigger: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
          <DialogDescription>Give it a clearer name.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="filename2">File name</Label>
          <Input id="filename2" defaultValue="untitled.txt" />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /open dialog/i })
    await userEvent.click(trigger)
    // Dialog content portals to document.body — query through canvasElement.ownerDocument.
    // Use waitFor so the toBeVisible check retries until the enter animation completes.
    const { within, waitFor } = await import('storybook/test')
    const dialog = await within(trigger.ownerDocument.body).findByRole('dialog')
    await waitFor(() => expect(dialog).toBeVisible())
  },
}
