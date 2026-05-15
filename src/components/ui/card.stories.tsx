import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Card',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Recent files</CardTitle>
        <CardDescription>Last opened just now</CardDescription>
      </CardHeader>
      <CardContent>3 files</CardContent>
      <CardFooter><Button size="sm">Open</Button></CardFooter>
    </Card>
  ),
}

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Recent files</CardTitle>
        <CardDescription>Last opened just now</CardDescription>
      </CardHeader>
    </Card>
  ),
}
