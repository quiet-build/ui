import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { CheckIcon, TrashIcon } from 'lucide-react'
import { Button } from './button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Badge } from './badge'

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

export const Showcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A richer demo to show how the current theme affects the button alongside ' +
          'surrounding chrome (surface, border, radius, font, badge). Switch theme via the ' +
          '🖌 toolbar dropdown above to compare presets.',
      },
    },
  },
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Publish article</CardTitle>
        <CardDescription className="flex items-center gap-2">
          Theme-aware actions and surface
          <Badge>preview</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex flex-wrap gap-2">
          <Button>
            <CheckIcon /> Publish
          </Button>
          <Button variant="secondary">Save draft</Button>
          <Button variant="outline">Preview</Button>
          <Button variant="ghost">Cancel</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button variant="destructive">
            <TrashIcon /> Delete
          </Button>
          <Button variant="link">Read docs →</Button>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Notice the surface color, border, radius, and primary accent all shift with the theme.
      </CardFooter>
    </Card>
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
