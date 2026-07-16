import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'
import { Toaster } from './sonner'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Toaster',
  tags: ['autodocs', 'ai-generated'],
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
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast.success('Changes saved')}>Success</Button>
        <Button onClick={() => toast.error('Couldn’t save changes', { description: 'Check your connection and try again.' })}>Error</Button>
        <Button onClick={() => toast.warning('Disk space running low')}>Warning</Button>
        <Button onClick={() => toast.info('Auto-save is on')}>Info</Button>
      </div>
      <Toaster />
    </>
  ),
}
