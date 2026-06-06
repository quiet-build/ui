import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Tooltip',
  tags: ['autodocs', 'ai-generated'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger render={<Button variant="ghost">Hover me</Button>} />
      <TooltipContent>A helpful hint</TooltipContent>
    </Tooltip>
  ),
}

export const WithDelay: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost">Hover me</Button>} />
      <TooltipContent>A helpful hint</TooltipContent>
    </Tooltip>
  ),
}
