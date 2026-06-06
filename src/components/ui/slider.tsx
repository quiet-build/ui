import * as React from "react"
import { Slider as SliderBase } from "#components/shadcn-base/slider"
import { cn } from "#lib/utils"

type SliderProps = React.ComponentProps<typeof SliderBase> & {
  /** Per-thumb accessible labels. For multi-thumb support, customize
   *  shadcn-base/slider.tsx; the single-thumb case falls back to aria-label. */
  thumbAriaLabels?: string[]
}

function Slider({ className, thumbAriaLabels, ...props }: SliderProps) {
  // best-effort: single-thumb sliders get the first label as the root aria-label
  const ariaLabel =
    props["aria-label"] ??
    (thumbAriaLabels?.length === 1 ? thumbAriaLabels[0] : undefined)
  // restyle: prepend overrides before `className`
  return <SliderBase aria-label={ariaLabel} className={cn(className)} {...props} />
}

export { Slider }
export type { SliderProps }
