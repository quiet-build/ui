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
      <DialogTrigger asChild>
        <Button variant="outline">Rename file</Button>
      </DialogTrigger>
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
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithTrigger: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
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
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /open dialog/i })
    await userEvent.click(trigger)
    // Dialog content portals to document.body — query through canvasElement.ownerDocument
    const { within } = await import('storybook/test')
    await expect(await within(trigger.ownerDocument.body).findByRole('dialog')).toBeVisible()
  },
}
