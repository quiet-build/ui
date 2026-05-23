import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useRef } from 'react'
import {
  Button, Badge, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Progress, Switch, Separator, Avatar, AvatarFallback,
} from './index'

const PRESETS = [
  { name: 'Manuscript', desc: 'Warm paper, Forest accent, Lora serif', dataTheme: 'manuscript' },
  { name: 'Midnight', desc: 'Cool indigo, modern, soft 6px corners', dataTheme: 'midnight' },
  { name: 'Slate', desc: 'Neutral grey, slate-blue accent, modernist', dataTheme: 'slate' },
  { name: 'Sunset', desc: 'Warm coral, friendly, soft 10px corners', dataTheme: 'sunset' },
  { name: 'Ocean', desc: 'Calm teal, trustworthy SaaS energy', dataTheme: 'ocean' },
  { name: 'Mono', desc: 'High-contrast B/W, sharp corners, brutalist', dataTheme: 'mono' },
] as const

const PRESET_TOKENS = {
  manuscript: {
    light: {
      background: 'oklch(0.977 0.006 95)',
      foreground: 'oklch(0.24 0.012 75)',
      card: 'oklch(0.992 0.004 95)',
      'card-foreground': 'oklch(0.24 0.012 75)',
      primary: 'oklch(0.45 0.045 155)',
      'primary-foreground': 'oklch(0.97 0.01 95)',
      secondary: 'oklch(0.93 0.012 90)',
      'secondary-foreground': 'oklch(0.30 0.015 75)',
      muted: 'oklch(0.93 0.012 90)',
      'muted-foreground': 'oklch(0.50 0.015 80)',
      accent: 'oklch(0.90 0.018 95)',
      'accent-foreground': 'oklch(0.30 0.015 75)',
      destructive: 'oklch(0.52 0.16 27)',
      border: 'oklch(0.87 0.016 88)',
      input: 'oklch(0.87 0.016 88)',
      ring: 'oklch(0.45 0.045 155)',
      radius: '0.25rem',
      'font-serif': '"Lora Variable", ui-serif, Georgia, serif',
    },
  },
  midnight: {
    light: {
      background: 'oklch(0.985 0.003 250)',
      foreground: 'oklch(0.20 0.020 260)',
      card: 'oklch(1.0 0 0)',
      'card-foreground': 'oklch(0.20 0.020 260)',
      primary: 'oklch(0.45 0.16 270)',
      'primary-foreground': 'oklch(0.98 0.005 250)',
      secondary: 'oklch(0.94 0.012 250)',
      'secondary-foreground': 'oklch(0.25 0.020 260)',
      muted: 'oklch(0.94 0.012 250)',
      'muted-foreground': 'oklch(0.50 0.015 250)',
      accent: 'oklch(0.93 0.018 270)',
      'accent-foreground': 'oklch(0.25 0.020 260)',
      destructive: 'oklch(0.55 0.20 25)',
      border: 'oklch(0.90 0.012 250)',
      input: 'oklch(0.90 0.012 250)',
      ring: 'oklch(0.45 0.16 270)',
      radius: '0.375rem',
      'font-serif': '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    },
  },
  slate: {
    light: {
      background: 'oklch(0.985 0 0)',
      foreground: 'oklch(0.20 0.005 250)',
      card: 'oklch(1.0 0 0)',
      'card-foreground': 'oklch(0.20 0.005 250)',
      primary: 'oklch(0.42 0.12 250)',
      'primary-foreground': 'oklch(0.98 0 0)',
      secondary: 'oklch(0.95 0.004 250)',
      'secondary-foreground': 'oklch(0.25 0.005 250)',
      muted: 'oklch(0.95 0.004 250)',
      'muted-foreground': 'oklch(0.50 0.008 250)',
      accent: 'oklch(0.93 0.005 250)',
      'accent-foreground': 'oklch(0.25 0.005 250)',
      destructive: 'oklch(0.55 0.20 25)',
      border: 'oklch(0.90 0.005 250)',
      input: 'oklch(0.90 0.005 250)',
      ring: 'oklch(0.42 0.12 250)',
      radius: '0.25rem',
      'font-serif': '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    },
  },
  sunset: {
    light: {
      background: 'oklch(0.99 0.012 60)',
      foreground: 'oklch(0.25 0.025 30)',
      card: 'oklch(1.0 0.005 60)',
      'card-foreground': 'oklch(0.25 0.025 30)',
      primary: 'oklch(0.55 0.18 30)',
      'primary-foreground': 'oklch(0.99 0.012 60)',
      secondary: 'oklch(0.94 0.025 60)',
      'secondary-foreground': 'oklch(0.30 0.025 30)',
      muted: 'oklch(0.94 0.025 60)',
      'muted-foreground': 'oklch(0.50 0.030 40)',
      accent: 'oklch(0.92 0.035 50)',
      'accent-foreground': 'oklch(0.30 0.025 30)',
      destructive: 'oklch(0.55 0.22 25)',
      border: 'oklch(0.88 0.025 60)',
      input: 'oklch(0.88 0.025 60)',
      ring: 'oklch(0.55 0.18 30)',
      radius: '0.625rem',
      'font-serif': '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    },
  },
  ocean: {
    light: {
      background: 'oklch(0.985 0.008 200)',
      foreground: 'oklch(0.22 0.025 220)',
      card: 'oklch(1.0 0.003 200)',
      'card-foreground': 'oklch(0.22 0.025 220)',
      primary: 'oklch(0.50 0.10 200)',
      'primary-foreground': 'oklch(0.99 0.005 200)',
      secondary: 'oklch(0.94 0.015 200)',
      'secondary-foreground': 'oklch(0.27 0.025 220)',
      muted: 'oklch(0.94 0.015 200)',
      'muted-foreground': 'oklch(0.50 0.025 210)',
      accent: 'oklch(0.92 0.020 200)',
      'accent-foreground': 'oklch(0.27 0.025 220)',
      destructive: 'oklch(0.55 0.20 25)',
      border: 'oklch(0.88 0.015 200)',
      input: 'oklch(0.88 0.015 200)',
      ring: 'oklch(0.50 0.10 200)',
      radius: '0.375rem',
      'font-serif': '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
    },
  },
  mono: {
    light: {
      background: 'oklch(1.0 0 0)',
      foreground: 'oklch(0.10 0 0)',
      card: 'oklch(1.0 0 0)',
      'card-foreground': 'oklch(0.10 0 0)',
      primary: 'oklch(0.10 0 0)',
      'primary-foreground': 'oklch(1.0 0 0)',
      secondary: 'oklch(0.95 0 0)',
      'secondary-foreground': 'oklch(0.10 0 0)',
      muted: 'oklch(0.95 0 0)',
      'muted-foreground': 'oklch(0.45 0 0)',
      accent: 'oklch(0.92 0 0)',
      'accent-foreground': 'oklch(0.10 0 0)',
      destructive: 'oklch(0.50 0.22 25)',
      border: 'oklch(0.10 0 0)',
      input: 'oklch(0.85 0 0)',
      ring: 'oklch(0.10 0 0)',
      radius: '0',
      'font-serif': 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace',
    },
  },
} as const

function styleFor(themeKey: keyof typeof PRESET_TOKENS) {
  const t = PRESET_TOKENS[themeKey].light
  const css: Record<string, string> = {}
  for (const [k, v] of Object.entries(t)) css[`--${k}`] = v
  return css as React.CSSProperties
}

function ThemeCard({ name, desc, dataTheme }: (typeof PRESETS)[number]) {
  return (
    <div
      style={styleFor(dataTheme)}
      className="rounded-lg border bg-background text-foreground p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl">{name}</h3>
          <p className="text-muted-foreground text-xs">{desc}</p>
        </div>
        <Badge>preview</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm">Primary</Button>
        <Button size="sm" variant="secondary">Secondary</Button>
        <Button size="sm" variant="outline">Outline</Button>
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${dataTheme}-input`} className="text-xs">File</Label>
        <Input id={`${dataTheme}-input`} defaultValue="invoice-2026.pdf" />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <span className="text-sm">ada@example.com</span>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload progress</CardTitle>
          <CardDescription>62% complete</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={62} />
        </CardContent>
        <CardFooter>
          <Button size="sm">Open</Button>
        </CardFooter>
      </Card>

      <pre className="rounded-md border bg-muted/50 px-3 py-2 text-[10px] leading-relaxed overflow-x-auto">
{`@import "@quietbuildlab/ui/themes/${dataTheme}.css";`}
      </pre>
    </div>
  )
}

function Gallery() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-serif text-2xl">Theme gallery</h2>
        <p className="text-muted-foreground text-sm max-w-xl">
          Six presets. Pick one with a single CSS import, or import <code>themes.css</code> and switch via{' '}
          <code>&lt;html data-theme="…"&gt;</code>. Each card is locally themed via scoped CSS variables —
          identical to what a consuming app gets.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRESETS.map((p) => (
          <ThemeCard key={p.dataTheme} {...p} />
        ))}
      </div>
    </div>
  )
}

const meta: Meta<typeof Gallery> = {
  title: 'Guides/Preset Gallery',
  component: Gallery,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Six ready-made themes ship with @quietbuildlab/ui. Browse them side-by-side here ' +
          'to pick one. To see how *any individual component* (Button, Card, Alert, etc.) ' +
          'looks across themes, open the component\'s page and use the **theme picker** in ' +
          'the Storybook toolbar (top of the screen) to switch globally. Install in your app ' +
          'via `@import "@quietbuildlab/ui/themes/<name>.css"`, or import the bundled ' +
          '`themes.css` and switch at runtime by toggling `data-theme` on `<html>`.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Gallery>

export const AllThemes: Story = {}

function RuntimeSwitcherDemo() {
  const ref = useRef<HTMLDivElement>(null)

  // Apply chosen theme tokens to the wrapper. In a real app the equivalent is
  // setting `document.documentElement.dataset.theme = "midnight"` after
  // importing `@quietbuildlab/ui/themes.css`.
  useEffect(() => {
    // noop — selection happens via the buttons below
  }, [])

  const apply = (themeKey: keyof typeof PRESET_TOKENS) => {
    if (!ref.current) return
    const tokens = PRESET_TOKENS[themeKey].light
    for (const [k, v] of Object.entries(tokens)) {
      ref.current.style.setProperty(`--${k}`, v)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Button key={p.dataTheme} size="sm" variant="outline" onClick={() => apply(p.dataTheme)}>
            {p.name}
          </Button>
        ))}
      </div>
      <div ref={ref} className="rounded-lg border bg-background text-foreground p-6 space-y-4 max-w-xl">
        <h3 className="font-serif text-2xl">Live theme switcher</h3>
        <p className="text-muted-foreground text-sm">
          Click a theme above to apply it to this card. In a real app the equivalent is{' '}
          <code className="text-xs">document.documentElement.dataset.theme = "midnight"</code>{' '}
          after importing the bundled <code>themes.css</code>.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
        <Progress value={70} />
      </div>
    </div>
  )
}

export const RuntimeSwitcher: StoryObj = {
  render: () => <RuntimeSwitcherDemo />,
}
