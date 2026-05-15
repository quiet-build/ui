import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
  },
  args: {
    placeholder: 'Notes',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    className: 'w-72',
  },
}

export const Disabled: Story = {
  render: () => <Textarea disabled placeholder="Disabled" className="w-72" />,
}
