import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-themes', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (cfg) => {
    // Set the public base path when building for GitHub Pages (project sites
    // serve from /<repo>/). The CI workflow sets STORYBOOK_BASE_PATH=/ui/.
    if (process.env.STORYBOOK_BASE_PATH) {
      cfg.base = process.env.STORYBOOK_BASE_PATH
    }
    cfg.plugins = [...(cfg.plugins ?? []), tailwindcss()]
    return cfg
  },
}

export default config
