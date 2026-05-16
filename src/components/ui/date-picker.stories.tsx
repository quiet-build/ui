import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DatePicker, DatePickerContent, DatePickerTrigger } from './date-picker'

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker',
  component: DatePicker,
  tags: ['autodocs', 'ai-generated'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    locale: { control: 'text' },
  },
  args: {
    placeholder: 'Pick a date',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

/** One-liner default — trigger + popover + calendar, no children needed. */
export const Default: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <div className="w-72">
        <DatePicker {...args} value={date} onValueChange={setDate} />
      </div>
    )
  },
}

/** Custom trigger label + ghost variant. */
export const CustomTrigger: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <div className="w-72">
        <DatePicker {...args} value={date} onValueChange={setDate}>
          <DatePickerTrigger variant="ghost" className="text-base">
            {date ? `📅  ${date.toDateString()}` : 'When?'}
          </DatePickerTrigger>
          <DatePickerContent align="end" />
        </DatePicker>
      </div>
    )
  },
}

/** Bound selection to a window via `minDate` / `maxDate`. */
export const Bounded: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    const today = new Date()
    const inTwoWeeks = new Date(today)
    inTwoWeeks.setDate(today.getDate() + 14)
    return (
      <div className="w-72 space-y-2">
        <DatePicker
          value={date}
          onValueChange={setDate}
          minDate={today}
          maxDate={inTwoWeeks}
          placeholder="Within the next two weeks"
        />
        <p className="text-xs text-muted-foreground">
          Only the next 14 days are selectable.
        </p>
      </div>
    )
  },
}

/** Locale-aware default formatter. */
export const Localized: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date('2026-03-15'))
    return (
      <div className="w-72 space-y-2">
        <DatePicker value={date} onValueChange={setDate} locale="en-AU" />
        <DatePicker value={date} onValueChange={setDate} locale="ja-JP" />
        <DatePicker value={date} onValueChange={setDate} locale="de-DE" />
      </div>
    )
  },
}

/** Custom formatter — bring your own `format(date)`. */
export const CustomFormat: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <div className="w-72">
        <DatePicker
          value={date}
          onValueChange={setDate}
          format={(d) =>
            d.toISOString().slice(0, 10) // YYYY-MM-DD
          }
        />
      </div>
    )
  },
}

/** Disabled state — trigger inert, popover never opens. */
export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <div className="w-72">
        <DatePicker disabled value={date} onValueChange={setDate} />
      </div>
    )
  },
}
