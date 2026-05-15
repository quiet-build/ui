import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './progress'

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
    },
  },
  args: {
    value: 62,
    className: 'w-72',
  },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {}

export const Empty: Story = {
  render: () => <Progress value={0} className="w-72" />,
}

export const Complete: Story = {
  render: () => <Progress value={100} className="w-72" />,
}
