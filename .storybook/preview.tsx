import type { Preview } from '@storybook/react-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
import { useEffect } from 'react'
import { TooltipProvider } from '../src/index'
import './preview.css'

const PRESETS = ['manuscript', 'midnight', 'slate', 'sunset', 'ocean', 'mono'] as const

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true }, // theme.css owns the canvas
    layout: 'centered',
  },
  globalTypes: {
    preset: {
      name: 'Theme',
      description: 'Color/typography preset',
      defaultValue: 'manuscript',
      toolbar: {
        icon: 'paintbrush',
        title: 'Theme',
        items: PRESETS.map((p) => ({
          value: p,
          title: p.charAt(0).toUpperCase() + p.slice(1),
        })),
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    /* Preset picker — toolbar dropdown sets `data-theme` on <html>. */
    (Story, ctx) => {
      const preset = (ctx.globals.preset ?? 'manuscript') as string
      useEffect(() => {
        document.documentElement.dataset.theme = preset
        return () => {
          delete document.documentElement.dataset.theme
        }
      }, [preset])
      return <Story />
    },
    /* Light/Dark — toggles the `.dark` class on <html>. */
    withThemeByClassName({
      themes: { Light: '', Dark: 'dark' },
      defaultTheme: 'Light',
      parentSelector: 'html',
    }),
    (Story) => (
      <TooltipProvider>
        <div className="bg-background text-foreground font-sans p-6">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
}

export default preview
