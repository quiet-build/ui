"use client"

import * as React from "react"
import {
  Progress as ProgressBase,
  ProgressTrack as ProgressTrackBase,
  ProgressIndicator as ProgressIndicatorBase,
  ProgressLabel as ProgressLabelBase,
  ProgressValue as ProgressValueBase,
} from "#components/shadcn-base/progress"

import { cn } from "#lib/utils"

function Progress({
  className,
  ...props
}: React.ComponentProps<typeof ProgressBase>) {
  // restyle: prepend overrides before `className`
  return <ProgressBase className={cn(className)} {...props} />
}

function ProgressTrack({
  className,
  ...props
}: React.ComponentProps<typeof ProgressTrackBase>) {
  // restyle: prepend overrides before `className`
  return <ProgressTrackBase className={cn(className)} {...props} />
}

function ProgressIndicator({
  className,
  ...props
}: React.ComponentProps<typeof ProgressIndicatorBase>) {
  // restyle: prepend overrides before `className`
  return <ProgressIndicatorBase className={cn(className)} {...props} />
}

function ProgressLabel({
  className,
  ...props
}: React.ComponentProps<typeof ProgressLabelBase>) {
  // restyle: prepend overrides before `className`
  return <ProgressLabelBase className={cn(className)} {...props} />
}

function ProgressValue({
  className,
  ...props
}: React.ComponentProps<typeof ProgressValueBase>) {
  // restyle: prepend overrides before `className`
  return <ProgressValueBase className={cn(className)} {...props} />
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
