import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from './calendar'

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs', 'ai-generated'],
}

export default meta
type Story = StoryObj<typeof Calendar>

/** Single-date selection — the most common case. */
export const SingleDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return <Calendar mode="single" selected={date} onSelect={setDate} />
  },
}

/** Multi-month range — pass `numberOfMonths` for side-by-side. */
export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>()
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
      />
    )
  },
}

/** Multiple individual dates. */
export const Multiple: Story = {
  render: () => {
    const [dates, setDates] = useState<Date[] | undefined>()
    return <Calendar mode="multiple" selected={dates} onSelect={setDates} />
  },
}

/** Bound the selectable window via `disabled` matchers. */
export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    const today = new Date()
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={[{ before: today }]}
      />
    )
  },
}
