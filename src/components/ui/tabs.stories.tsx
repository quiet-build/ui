import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

const meta: Meta = {
  title: 'UI/Tabs',
  tags: ['autodocs'],
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
}
