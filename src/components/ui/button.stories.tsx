import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Save',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const CssCheck: Story = {
  args: { children: 'Submit', variant: 'default' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /submit/i })
    // Button variant=default uses bg-primary, which maps to --primary
    // (oklch(0.45 0.045 155) — Manuscript Forest accent). If Tailwind/theme.css
    // didn't load, this would be transparent or unstyled.
    const bg = getComputedStyle(button).backgroundColor
    await expect(bg).not.toBe('')
    await expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    await expect(bg).not.toBe('transparent')
    // The exact computed color depends on browser oklch->rgb resolution.
    // Asserting "non-default, non-transparent" is the proof CSS loaded.
  },
}
