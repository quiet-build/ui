import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
  Separator, Skeleton, Progress, Toaster,
} from '../../index'

describe('layout + feedback components', () => {
  it('Tabs renders a tablist and the active panel', () => {
    const { getByRole, getByText } = render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>,
    )
    expect(getByRole('tablist')).toBeInTheDocument()
    expect(getByText('First panel')).toBeInTheDocument()
  })

  it('Separator mounts', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).not.toBeNull()
  })

  it('Skeleton mounts', () => {
    const { container } = render(<Skeleton className="h-4 w-10" />)
    expect(container.firstChild).not.toBeNull()
  })

  it('Progress renders a progressbar', () => {
    const { getByRole } = render(<Progress value={62} />)
    expect(getByRole('progressbar')).toBeInTheDocument()
  })

  it('Toaster mounts without crashing', () => {
    const { container } = render(<Toaster />)
    expect(container).toBeDefined()
  })
})
