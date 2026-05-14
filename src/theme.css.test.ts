// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const css = readFileSync(
  fileURLToPath(new URL('./theme.css', import.meta.url)),
  'utf8',
)

const REQUIRED_TOKENS = [
  '--background', '--foreground', '--card', '--popover',
  '--primary', '--primary-foreground', '--secondary', '--muted',
  '--accent', '--destructive', '--border', '--input', '--ring',
  '--radius', '--font-sans', '--font-serif',
]

describe('theme.css', () => {
  it('defines a :root block and a .dark block', () => {
    expect(css).toMatch(/:root\s*\{/)
    expect(css).toMatch(/\.dark\s*\{/)
  })

  it('defines every required token in :root', () => {
    const root = css.slice(css.indexOf(':root'), css.search(/\n\.dark\s*\{/))
    for (const token of REQUIRED_TOKENS) {
      expect(root, `:root missing ${token}`).toContain(`${token}:`)
    }
  })

  it('overrides the key color tokens for dark mode', () => {
    const dark = css.slice(css.search(/\n\.dark\s*\{/))
    for (const token of ['--background', '--foreground', '--primary', '--border', '--muted', '--accent', '--ring']) {
      expect(dark, `.dark missing ${token}`).toContain(`${token}:`)
    }
  })

  it('exposes tokens to Tailwind via @theme inline', () => {
    expect(css).toContain('@theme inline')
    expect(css).toContain('--color-primary: var(--primary)')
  })

  it('declares selector-based dark mode and 0.25rem (4px) radius', () => {
    expect(css).toContain('@custom-variant dark')
    expect(css).toContain('--radius: 0.25rem')
  })
})
