import { existsSync } from 'node:fs'

const required = ['dist/index.js', 'dist/index.d.ts', 'dist/theme.css']
const missing = required.filter((file) => !existsSync(file))

if (missing.length > 0) {
  console.error('Build output check FAILED. Missing:', missing.join(', '))
  process.exit(1)
}

console.log('Build output check passed:', required.join(', '))
