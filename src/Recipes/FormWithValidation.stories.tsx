import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Label,
} from '../index'

function FormExample() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
  const showError = submitted && !isValid

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Subscribe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Label htmlFor="rec-email">Email</Label>
        <Input
          id="rec-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? 'rec-email-error' : undefined}
          placeholder="you@example.com"
        />
        {showError ? (
          <p id="rec-email-error" className="text-destructive text-sm">
            Please enter a valid email address.
          </p>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => setSubmitted(true)}
          disabled={submitted && isValid}
        >
          {submitted && isValid ? 'Subscribed ✓' : 'Subscribe'}
        </Button>
      </CardFooter>
    </Card>
  )
}

const meta: Meta<typeof FormExample> = {
  title: 'Guides/Recipes/Form with validation',
  component: FormExample,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    docs: {
      description: {
        component:
          'Card + Label + Input + Button composition with inline validation. Uses `aria-invalid` and `aria-describedby` so the error is announced by screen readers. The error text uses `text-destructive` (a semantic theme token) so it retheme-s automatically.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof FormExample>
export const Default: Story = {}
