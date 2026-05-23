import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfoIcon, TriangleAlertIcon, CheckCircle2Icon } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from './alert'

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'destructive'] },
  },
}
export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert className="max-w-md">
      <InfoIcon />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>You can dismiss this anytime from your inbox.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-md">
      <TriangleAlertIcon />
      <AlertTitle>Connection failed</AlertTitle>
      <AlertDescription>Check your network and try again.</AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  render: () => (
    <Alert className="max-w-md">
      <CheckCircle2Icon className="text-primary" />
      <AlertTitle>Settings saved</AlertTitle>
      <AlertDescription>Your preferences will apply on next sign-in.</AlertDescription>
    </Alert>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <Alert className="max-w-md">
      <InfoIcon />
      <AlertTitle>Background sync is enabled</AlertTitle>
    </Alert>
  ),
}
