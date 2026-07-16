// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

function read(path: string) {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8')
}

const REQUIRED_TOKENS = [
  '--background', '--foreground', '--card', '--popover',
  '--primary', '--primary-foreground', '--secondary', '--muted',
  '--accent', '--destructive', '--border', '--input', '--ring',
  '--radius', '--font-sans', '--font-serif',
]

const PRESETS = ['manuscript', 'midnight', 'slate', 'sunset', 'ocean', 'mono'] as const

describe('theme.css (backward-compat entry)', () => {
  it('imports the manuscript preset so existing consumers keep the canonical look', () => {
    const css = read('./theme.css')
    expect(css).toMatch(/@import\s+["']\.\/themes\/manuscript\.css["']/)
  })
})

describe.each(PRESETS)('themes/%s.css', (name) => {
  const css = read(`./themes/${name}.css`)

  it('defines a :root block and a .dark block', () => {
    expect(css).toMatch(/:root\s*\{/)
    expect(css).toMatch(/\.dark\s*\{/)
  })

  it('defines every required token in :root', () => {
    const root = css.slice(css.indexOf(':root'), css.search(/\n\.dark\s*\{/))
    for (const token of REQUIRED_TOKENS) {
      expect(root, `${name}::root missing ${token}`).toContain(`${token}:`)
    }
  })

  it('overrides the key color tokens for dark mode', () => {
    const dark = css.slice(css.search(/\n\.dark\s*\{/))
    for (const token of ['--background', '--foreground', '--primary', '--border', '--muted', '--accent', '--ring']) {
      expect(dark, `${name}::.dark missing ${token}`).toContain(`${token}:`)
    }
  })

  it('pulls in the shared Tailwind wiring', () => {
    expect(css).toMatch(/@import\s+["']\.\/_shared\.css["']/)
  })
})

describe('themes/_shared.css (Tailwind wiring)', () => {
  const css = read('./themes/_shared.css')

  it('exposes tokens to Tailwind via @theme inline', () => {
    expect(css).toContain('@theme inline')
    expect(css).toContain('--color-primary: var(--primary)')
  })

  it('declares selector-based dark mode', () => {
    expect(css).toContain('@custom-variant dark')
  })

  it('maps the shared status colors to Tailwind', () => {
    for (const token of ['success', 'warning', 'info']) {
      expect(css).toContain(`--color-${token}: var(--${token})`)
      expect(css).toContain(`--color-${token}-foreground: var(--${token}-foreground)`)
    }
  })

  it('remaps the Tailwind shadow scale onto mode-aware elevation tokens', () => {
    for (const step of ['xs', 'sm', 'md', 'lg', 'xl']) {
      expect(css).toContain(`--shadow-${step}: var(--elevation-${step})`)
    }
  })

  it('defines shared status + elevation values for both light and dark', () => {
    const rootStart = css.indexOf(':root {')
    const darkStart = css.indexOf('.dark {')
    expect(rootStart).toBeGreaterThan(-1)
    expect(darkStart).toBeGreaterThan(rootStart)
    const root = css.slice(rootStart, darkStart)
    const dark = css.slice(darkStart)
    for (const token of ['--success', '--warning', '--info', '--elevation-sm']) {
      expect(root, `_shared :root missing ${token}`).toContain(`${token}:`)
      expect(dark, `_shared .dark missing ${token}`).toContain(`${token}:`)
    }
  })

  it('exposes shared motion tokens', () => {
    expect(css).toContain('--ease-spring:')
    expect(css).toContain('--duration-normal:')
  })
})

describe('themes/index.css (runtime-switching bundle)', () => {
  const css = read('./themes/index.css')

  it('declares a selector for every preset', () => {
    for (const name of PRESETS) {
      expect(css, `bundle missing [data-theme="${name}"]`).toContain(`[data-theme="${name}"]`)
      expect(css, `bundle missing [data-theme="${name}"].dark`).toContain(`[data-theme="${name}"].dark`)
    }
  })

  it('defaults to manuscript on :root so apps that omit data-theme keep the canonical look', () => {
    expect(css).toMatch(/:root,\s*\n?\s*\[data-theme="manuscript"\]/)
  })

  it('pulls in the shared Tailwind wiring', () => {
    expect(css).toMatch(/@import\s+["']\.\/_shared\.css["']/)
  })
})
