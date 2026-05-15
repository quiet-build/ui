import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Label } from './label'

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs', 'ai-generated'],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="a4" className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a4" id="rg-a4" />
        <Label htmlFor="rg-a4">A4</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="letter" id="rg-letter" />
        <Label htmlFor="rg-letter">Letter</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="legal" id="rg-legal" />
        <Label htmlFor="rg-legal">Legal</Label>
      </div>
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="a4" className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a4" id="rg-h-a4" />
        <Label htmlFor="rg-h-a4">A4</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="letter" id="rg-h-letter" />
        <Label htmlFor="rg-h-letter">Letter</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="legal" id="rg-h-legal" />
        <Label htmlFor="rg-h-legal">Legal</Label>
      </div>
    </RadioGroup>
  ),
}
