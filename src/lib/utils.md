# Utilities

Small shared utility helpers used by the component implementations.

## Import

```ts
import { cn } from './utils'
```

This helper is internal to the library. It is not exported from `@quietbuildlab/ui`.

## API

```ts
function cn(...inputs: ClassValue[]): string
```

## Behavior

- Combines conditional class values with `clsx`.
- Resolves conflicting Tailwind utility classes with `tailwind-merge`, so later classes such as `px-4` can override earlier classes such as `px-2`.
- Used throughout components for `className` composition.

## Source

- [Source](./utils.ts)
