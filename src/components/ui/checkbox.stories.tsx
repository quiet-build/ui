import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Checkbox } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
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
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    'aria-label': 'agree',
  },
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(checkbox)
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    'aria-label': 'agree',
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-3">
      <Checkbox disabled aria-label="off" />
      <Checkbox disabled defaultChecked aria-label="on" />
    </div>
  ),
}
