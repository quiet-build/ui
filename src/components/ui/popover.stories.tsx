import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

const meta: Meta<typeof Popover> = {
  title: 'UI/Popover',
  component: Popover,
  tags: ['autodocs', 'ai-generated'],
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
      <PopoverContent className="w-72">
        <div className="grid gap-3">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">Filter</h4>
            <p className="text-sm text-muted-foreground">
              Narrow the result set without leaving the page.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
