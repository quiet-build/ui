import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, Separator,
  Tooltip, TooltipContent, TooltipTrigger,
} from '../index'

function ToolbarExample() {
  return (
    <div className="border rounded-md p-1.5 inline-flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm">Bold</Button>
        </TooltipTrigger>
        <TooltipContent>Bold (⌘B)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm">Italic</Button>
        </TooltipTrigger>
        <TooltipContent>Italic (⌘I)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm">Link</Button>
        </TooltipTrigger>
        <TooltipContent>Insert link (⌘K)</TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">Insert ▾</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Image</DropdownMenuItem>
          <DropdownMenuItem>Table</DropdownMenuItem>
          <DropdownMenuItem>Code block</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Embed</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const meta: Meta<typeof ToolbarExample> = {
  title: 'Guides/Recipes/Toolbar',
  component: ToolbarExample,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    docs: {
      description: {
        component:
          'Editor-style toolbar combining ghost Buttons, Tooltips for keyboard hints, a vertical Separator, and a DropdownMenu for an "Insert" action. Note: this story works because `.storybook/preview.tsx` wraps every story in `<TooltipProvider>` — consumer apps must add their own at the root.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ToolbarExample>
export const Default: Story = {}
