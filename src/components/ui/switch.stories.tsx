import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './switch'

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
  args: {
    disabled: false,
    defaultChecked: false,
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {
    'aria-label': 'toggle',
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    'aria-label': 'toggle',
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-3">
      <Switch disabled aria-label="off" />
      <Switch disabled defaultChecked aria-label="on" />
    </div>
  ),
}
