import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

const meta: Meta = {
  title: 'UI/Tabs',
  tags: ['autodocs', 'ai-generated'],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="all" className="w-80">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="shared">Shared</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="pt-2">3 files</TabsContent>
      <TabsContent value="shared" className="pt-2">1 file</TabsContent>
      <TabsContent value="archived" className="pt-2">No files</TabsContent>
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    const sharedTab = canvas.getByRole('tab', { name: /shared/i })
    await userEvent.click(sharedTab)
    await expect(sharedTab).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByText(/1 file/i)).toBeVisible()
  },
}
