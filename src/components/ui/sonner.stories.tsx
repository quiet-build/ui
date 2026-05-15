import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'
import { Toaster } from './sonner'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Toaster',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <>
      <Button onClick={() => toast('File saved.')}>Show toast</Button>
      <Toaster />
    </>
  ),
}

export const Variants: Story = {
  render: () => (
    <>
      <div className="flex gap-2">
        <Button onClick={() => toast.success('File saved successfully.')}>Success</Button>
        <Button onClick={() => toast.error('Failed to save file.')}>Error</Button>
        <Button onClick={() => toast.warning('Disk space running low.')}>Warning</Button>
        <Button onClick={() => toast.info('Auto-save is enabled.')}>Info</Button>
      </div>
      <Toaster />
    </>
  ),
}
