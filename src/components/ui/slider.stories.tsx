import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Slider } from './slider'
import { Label } from './label'

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  tags: ['autodocs', 'ai-generated'],
}
export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: () => (
    <div className="w-72">
      <Slider defaultValue={[50]} min={0} max={100} step={1} />
    </div>
  ),
}

export const Controlled: Story = {
  render: function Controlled() {
    const [v, setV] = useState([35])
    return (
      <div className="w-72 space-y-3">
        <Label>Volume: {v[0]}</Label>
        <Slider
          value={v}
          onValueChange={(val) => setV(val as number[])}
          min={0}
          max={100}
          step={1}
        />
      </div>
    )
  },
}

export const Range: Story = {
  render: function Range() {
    const [v, setV] = useState([20, 80])
    return (
      <div className="w-72 space-y-3">
        <Label>
          Price: ${v[0]} – ${v[1]}
        </Label>
        <Slider
          value={v}
          onValueChange={(val) => setV(val as number[])}
          min={0}
          max={100}
          step={5}
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <Slider defaultValue={[60]} disabled />
    </div>
  ),
}
