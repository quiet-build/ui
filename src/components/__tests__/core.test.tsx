import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  Button, Badge, Input, Label, Textarea,
  Card, CardHeader, CardTitle, CardContent,
} from '../../index'

describe('core components', () => {
  it('Button renders its label', () => {
    const { getByRole } = render(<Button>Save</Button>)
    expect(getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('Badge renders children', () => {
    const { getByText } = render(<Badge>Beta</Badge>)
    expect(getByText('Beta')).toBeInTheDocument()
  })

  it('Input and Textarea mount as form fields', () => {
    const { getByPlaceholderText } = render(
      <>
        <Input placeholder="name" />
        <Textarea placeholder="bio" />
      </>,
    )
    expect(getByPlaceholderText('name')).toBeInTheDocument()
    expect(getByPlaceholderText('bio')).toBeInTheDocument()
  })

  it('Label renders its text', () => {
    const { getByText } = render(<Label htmlFor="x">Email</Label>)
    expect(getByText('Email')).toBeInTheDocument()
  })

  it('Card composes header, title and content', () => {
    const { getByText } = render(
      <Card>
        <CardHeader><CardTitle>Recent files</CardTitle></CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    )
    expect(getByText('Recent files')).toBeInTheDocument()
    expect(getByText('Body')).toBeInTheDocument()
  })
})
