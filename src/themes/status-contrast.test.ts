// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

function read(path: string): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8')
}

type Oklch = readonly [number, number, number]
type Rgb = readonly [number, number, number]

function parseOklch(css: string, token: string): Oklch {
  const re = new RegExp(`${token}:\\s*oklch\\(\\s*([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\s*\\)`)
  const match = css.match(re)
  if (!match) throw new Error(`token "${token}" not found`)
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

// OKLab -> LMS -> linear sRGB (https://bottosson.github.io/posts/oklab/)
function oklchToLinearSrgb([L, C, hDeg]: Oklch): Rgb {
  const h = (hDeg * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3
  const clamp = (v: number) => Math.min(1, Math.max(0, v))
  return [
    clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

// WCAG relative luminance. The OKLab -> sRGB conversion above already yields
// linear-light values, so no gamma companding is applied here.
function relativeLuminance([r, g, b]: Rgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const [l1, l2] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

function contrastOf(a: Oklch, b: Oklch): number {
  return contrastRatio(oklchToLinearSrgb(a), oklchToLinearSrgb(b))
}

const AA_MIN_CONTRAST = 4.5
const STATUS_TOKENS = ['success', 'warning', 'info'] as const
const SURFACES = ['background', 'card'] as const
const MODES = ['light', 'dark'] as const
const PRESETS = ['manuscript', 'midnight', 'slate', 'sunset', 'ocean', 'mono'] as const

type StatusToken = (typeof STATUS_TOKENS)[number]
type Surface = (typeof SURFACES)[number]
type Mode = (typeof MODES)[number]

// ---- Shared status colors — defined once (light + dark) in _shared.css and
// inherited by every theme; see THEMING.md / DESIGN.md. ----

const shared = read('./_shared.css')
const sharedRoot = shared.slice(shared.indexOf(':root {'), shared.indexOf('.dark {'))
const sharedDark = shared.slice(shared.indexOf('.dark {'))

function statusColorsFor(mode: Mode): Record<StatusToken, Oklch> {
  const css = mode === 'light' ? sharedRoot : sharedDark
  const entries = STATUS_TOKENS.map((token) => [token, parseOklch(css, `--${token}`)] as const)
  return Object.fromEntries(entries) as Record<StatusToken, Oklch>
}

const STATUS_COLORS: Record<Mode, Record<StatusToken, Oklch>> = {
  light: statusColorsFor('light'),
  dark: statusColorsFor('dark'),
}

// ---- Per-theme surfaces (--background, --card) that status text sits on ----

const CASES = SURFACES.flatMap((surface) => STATUS_TOKENS.map((status) => ({ surface, status })))

describe.each(PRESETS)('status color contrast — %s theme', (preset) => {
  const css = read(`./${preset}.css`)
  const root = css.slice(css.indexOf(':root'), css.search(/\n\.dark\s*\{/))
  const dark = css.slice(css.search(/\n\.dark\s*\{/))

  function surfaceColorsFor(mode: Mode): Record<Surface, Oklch> {
    const source = mode === 'light' ? root : dark
    const entries = SURFACES.map((surface) => [surface, parseOklch(source, `--${surface}`)] as const)
    return Object.fromEntries(entries) as Record<Surface, Oklch>
  }

  describe.each(MODES)('%s mode', (mode) => {
    const surfaceColors = surfaceColorsFor(mode)

    it.each(CASES)('--$status text on --$surface meets WCAG AA (>= 4.5:1)', ({ surface, status }) => {
      const ratio = contrastOf(STATUS_COLORS[mode][status], surfaceColors[surface])
      expect(
        ratio,
        `${preset}/${mode}: --${status} vs --${surface} = ${ratio.toFixed(2)}:1`
      ).toBeGreaterThanOrEqual(AA_MIN_CONTRAST)
    })
  })
})
