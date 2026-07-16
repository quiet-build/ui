import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'success', 'warning', 'info', 'outline'],
    },
  },
  args: {
    children: 'Beta',
    variant: 'default',
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Synced</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="success">Live</Badge>
      <Badge variant="warning">Expiring</Badge>
      <Badge variant="info">Beta</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}
