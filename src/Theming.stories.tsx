import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useId } from 'react'
import {
  Button, Badge, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Progress, Switch, Tabs, TabsList, TabsTrigger, TabsContent, Separator,
} from './index'

type Args = {
  primary: string
  ring: string
  radius: string
  fontSerif: string
}

function ThemingDemo({ primary, ring, radius, fontSerif }: Args) {
  const scopeId = useId().replace(/[:]/g, '')
  const scopeClass = `theming-${scopeId}`

  // Inject scoped CSS variable overrides — same mechanism a consuming app would
  // use, just scoped to this story so it doesn't bleed into other stories.
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `.${scopeClass} {
      --primary: ${primary};
      --ring: ${ring};
      --radius: ${radius};
      --font-serif: ${fontSerif};
    }`
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [scopeClass, primary, ring, radius, fontSerif])

  return (
    <div className={`${scopeClass} bg-background text-foreground p-6 rounded-md max-w-2xl space-y-6`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl">Recent files</h2>
          <p className="text-muted-foreground text-sm">Tweak the tokens in the controls panel</p>
        </div>
        <Badge>Live</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      <Separator />

      <div className="grid gap-2">
        <Label htmlFor="theming-input">File name</Label>
        <Input id="theming-input" defaultValue="invoice-2026.pdf" />
        <div className="flex items-center gap-2 pt-1">
          <Switch id="theming-switch" defaultChecked />
          <Label htmlFor="theming-switch">Auto-sync</Label>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload progress</CardTitle>
          <CardDescription>Token overrides apply to every component below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={62} />
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-2">3 files</TabsContent>
            <TabsContent value="shared" className="pt-2">1 file</TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button size="sm">Open</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

const meta: Meta<typeof ThemingDemo> = {
  title: 'Guides/Theming',
  component: ThemingDemo,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    docs: {
      description: {
        component:
          'Drag the controls in the panel below to override Manuscript tokens live. ' +
          'In a real consuming app you would put these declarations in a `:root` block ' +
          'in your app CSS after `@import "@quietbuildlab/ui/theme.css"`. See `THEMING.md`.',
      },
    },
  },
  argTypes: {
    primary: { control: 'text', description: 'Accent color (any CSS color, OKLCH recommended).' },
    ring: { control: 'text', description: 'Focus ring color — usually matches `--primary`.' },
    radius: {
      control: 'select',
      options: ['0px', '0.25rem', '0.5rem', '0.75rem', '1rem', '9999px'],
      description: 'Corner radius across all components.',
    },
    fontSerif: {
      control: 'select',
      options: [
        '"Lora Variable", ui-serif, Georgia, serif',
        'Georgia, serif',
        '"Times New Roman", serif',
        'ui-monospace, monospace',
      ],
      description: 'Heading font — change to retheme typography.',
    },
  },
  args: {
    primary: 'oklch(0.45 0.045 155)',
    ring: 'oklch(0.45 0.045 155)',
    radius: '0.25rem',
    fontSerif: '"Lora Variable", ui-serif, Georgia, serif',
  },
}

export default meta
type Story = StoryObj<typeof ThemingDemo>

export const Manuscript: Story = {}

export const DeepBlue: Story = {
  args: {
    primary: 'oklch(0.40 0.10 250)',
    ring: 'oklch(0.40 0.10 250)',
    radius: '0.5rem',
    fontSerif: '"Lora Variable", ui-serif, Georgia, serif',
  },
}

export const Pill: Story = {
  args: {
    primary: 'oklch(0.55 0.18 25)',
    ring: 'oklch(0.55 0.18 25)',
    radius: '9999px',
    fontSerif: 'Georgia, serif',
  },
}
