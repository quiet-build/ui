import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "#lib/utils"

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /**
   * Per-thumb accessible labels. Position N in the array labels thumb N (in
   * the order they appear in `value` / `defaultValue`). Useful for range
   * sliders where each thumb has a distinct purpose — e.g.
   * `thumbAriaLabels={["Minimum price", "Maximum price"]}`.
   *
   * For single-value sliders, prefer passing `aria-label` on the Slider root
   * (forwarded to Radix). `thumbAriaLabels` overrides per-thumb labels when
   * both are present.
   */
  thumbAriaLabels?: string[]
}

/**
 * Range input. Use `defaultValue` (uncontrolled) or `value` + `onValueChange`
 * (controlled). Pass two-element arrays for range sliders.
 *
 * Accessibility — for range sliders (two thumbs) pass `thumbAriaLabels` so
 * each thumb announces a distinct name. For single-thumb sliders, an
 * `aria-label` on the Slider itself is usually enough.
 *
 * @example
 * <Slider defaultValue={[50]} min={0} max={100} step={1} aria-label="Volume" />
 * <Slider
 *   defaultValue={[20, 80]} min={0} max={100} step={5}
 *   thumbAriaLabels={["Minimum price", "Maximum price"]}
 * />
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbAriaLabels,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={thumbAriaLabels?.[index]}
          className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border-2 shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
export type { SliderProps }
