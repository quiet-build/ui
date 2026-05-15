import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Button, Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '../index'

function ConfirmExample() {
  const [count, setCount] = useState(3)
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{count} items</span>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" disabled={count === 0}>
            Delete all
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete all items?</DialogTitle>
            <DialogDescription>
              This will permanently remove {count} items. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => setCount(0)}>
                Yes, delete all
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const meta: Meta<typeof ConfirmExample> = {
  title: 'Guides/Recipes/Confirm destructive action',
  component: ConfirmExample,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    docs: {
      description: {
        component:
          'Standard destructive-confirm pattern. The trigger uses `variant="destructive"` to telegraph intent; both Cancel and confirm wrap in `<DialogClose asChild>` so clicking either closes the dialog. The actual destructive work is done in the confirm button\'s `onClick`.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ConfirmExample>
export const Default: Story = {}
