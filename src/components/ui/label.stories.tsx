import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './label'
import { Checkbox } from './checkbox'

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
  args: {
    htmlFor: 'x',
    children: 'Email',
  },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {}

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="agree" />
      <Label htmlFor="agree">I agree to the terms</Label>
    </div>
  ),
}
