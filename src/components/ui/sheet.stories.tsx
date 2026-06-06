import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from './sheet'

const meta: Meta<typeof Sheet> = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs', 'ai-generated'],
}
export default meta
type Story = StoryObj<typeof Sheet>

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button>Open right</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes and save.</SheetDescription>
        </SheetHeader>
        <div className="px-6 text-sm text-muted-foreground">
          Sheet body. Put a form or anything else here.
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open menu</Button>} />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Jump anywhere.</SheetDescription>
        </SheetHeader>
        <nav className="grid gap-1 p-6 text-sm">
          <a className="rounded-md px-3 py-2 hover:bg-accent">Dashboard</a>
          <a className="rounded-md px-3 py-2 hover:bg-accent">Projects</a>
          <a className="rounded-md px-3 py-2 hover:bg-accent">Settings</a>
        </nav>
      </SheetContent>
    </Sheet>
  ),
}

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button>Open bottom</Button>} />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick actions</SheetTitle>
        </SheetHeader>
        <div className="px-6 pb-6 text-sm text-muted-foreground">
          Bottom sheets work well on mobile.
        </div>
      </SheetContent>
    </Sheet>
  ),
}
