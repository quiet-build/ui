import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  Dialog, DialogTrigger, DialogContent, DialogTitle,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Checkbox, Switch, RadioGroup, RadioGroupItem,
} from '../../index'

describe('overlay + form components', () => {
  it('Dialog renders its trigger (content closed by default)', () => {
    const { getByRole } = render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent><DialogTitle>Hi</DialogTitle></DialogContent>
      </Dialog>,
    )
    expect(getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('DropdownMenu renders its trigger', () => {
    const { getByRole } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent><DropdownMenuItem>Item</DropdownMenuItem></DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(getByRole('button', { name: 'Menu' })).toBeInTheDocument()
  })

  it('Tooltip renders its trigger', () => {
    const { getByRole } = render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(getByRole('button', { name: 'Hover' })).toBeInTheDocument()
  })

  it('Select renders its trigger as a combobox', () => {
    const { getByRole } = render(
      <Select>
        <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
        <SelectContent><SelectItem value="a">A</SelectItem></SelectContent>
      </Select>,
    )
    expect(getByRole('combobox')).toBeInTheDocument()
  })

  it('Checkbox mounts', () => {
    const { getByRole } = render(<Checkbox aria-label="agree" />)
    expect(getByRole('checkbox')).toBeInTheDocument()
  })

  it('Switch mounts', () => {
    const { getByRole } = render(<Switch aria-label="toggle" />)
    expect(getByRole('switch')).toBeInTheDocument()
  })

  it('RadioGroup mounts with items', () => {
    const { getByRole } = render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>,
    )
    expect(getByRole('radiogroup')).toBeInTheDocument()
  })
})
