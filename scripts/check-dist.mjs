import { existsSync } from 'node:fs'

const required = [
  'dist/index.js',
  'dist/index.d.ts',
  'dist/theme.css',
  'dist/themes/index.css',
  'dist/themes/_shared.css',
  'dist/themes/manuscript.css',
  'dist/themes/midnight.css',
  'dist/themes/slate.css',
  'dist/themes/sunset.css',
  'dist/themes/ocean.css',
  'dist/themes/mono.css',
]
const missing = required.filter((file) => !existsSync(file))

if (missing.length > 0) {
  console.error('Build output check FAILED. Missing:', missing.join(', '))
  process.exit(1)
}

console.log('Build output check passed:', required.length, 'files present')
