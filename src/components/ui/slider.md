# Slider

Range input. New in v0.6. Single-value or two-value range slider depending on the length of the value array.

## Import

```tsx
import { Slider } from '@quietbuildlab/ui'
```

## Props

```tsx
interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  // Forwards everything to Radix Slider. Useful props:
  // min, max, step, defaultValue, value, onValueChange, disabled, orientation

  /**
   * Per-thumb accessible labels. Index N labels thumb N (in the order they
   * appear in value/defaultValue). Use this for range sliders so each thumb
   * has a distinct name (e.g. ["Minimum price", "Maximum price"]).
   */
  thumbAriaLabels?: string[]
}
```

`value` and `defaultValue` are arrays:
- `[n]` — single thumb
- `[min, max]` — range slider with two thumbs

## Usage

Uncontrolled, single:

```tsx
<Slider defaultValue={[50]} min={0} max={100} step={1} />
```

Range:

```tsx
<Slider defaultValue={[20, 80]} min={0} max={100} step={5} />
```

Controlled:

```tsx
const [v, setV] = useState([35])
<Slider value={v} onValueChange={setV} min={0} max={100} />
```

Display the current value with a Label:

```tsx
const [v, setV] = useState([50])
<Label>Volume: {v[0]}</Label>
<Slider value={v} onValueChange={setV} min={0} max={100} />
```

## Notes

- `onValueChange` receives an array — always, even for single-thumb sliders.
- For vertical orientation pass `orientation="vertical"` and set an explicit height via `className`.
- **Accessibility**: for single-thumb sliders, set `aria-label` on the Slider itself ("Volume"). For range sliders, set `thumbAriaLabels={["Minimum X", "Maximum X"]}` so screen readers distinguish the two thumbs:

```tsx
<Slider
  defaultValue={[20, 80]} min={0} max={100} step={5}
  thumbAriaLabels={["Minimum price", "Maximum price"]}
/>
```

## Related

- [Progress](./progress.md) — read-only progress bar
- [Input](./input.md) — when typing a value is more efficient than scrubbing

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/slider.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-slider--default)
