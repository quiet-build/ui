import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Label, Separator, Switch,
} from '../index'

function SettingsExample() {
  const [notifications, setNotifications] = useState(true)
  const [marketing, setMarketing] = useState(false)
  const [analytics, setAnalytics] = useState(true)

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what you want to hear from us.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="rec-notify">Account activity</Label>
          <Switch id="rec-notify" checked={notifications} onCheckedChange={setNotifications} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="rec-marketing">Marketing emails</Label>
          <Switch id="rec-marketing" checked={marketing} onCheckedChange={setMarketing} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="rec-analytics">Anonymous analytics</Label>
          <Switch id="rec-analytics" checked={analytics} onCheckedChange={setAnalytics} />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save preferences</Button>
      </CardFooter>
    </Card>
  )
}

const meta: Meta<typeof SettingsExample> = {
  title: 'Guides/Recipes/Settings card',
  component: SettingsExample,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    docs: {
      description: {
        component:
          'Card + Switch rows separated by `<Separator />`, footer holds the save action. The label-Switch row is a `<div className="flex items-center justify-between">` with the Label on the left and the Switch on the right — the `htmlFor`/`id` association makes the label clickable.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof SettingsExample>
export const Default: Story = {}
