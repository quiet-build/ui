import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion'

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs', 'ai-generated'],
}
export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-96">
      <AccordionItem value="a">
        <AccordionTrigger>How does billing work?</AccordionTrigger>
        <AccordionContent>
          Monthly, billed in advance. Cancel anytime from your account settings.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Do you offer team plans?</AccordionTrigger>
        <AccordionContent>
          Yes — invite teammates, share workspaces, and centralize billing.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Is there a free tier?</AccordionTrigger>
        <AccordionContent>
          You get a 14-day trial. After that, choose a plan or downgrade to read-only.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-96">
      <AccordionItem value="a">
        <AccordionTrigger>Section one</AccordionTrigger>
        <AccordionContent>Open multiple at once.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Section two</AccordionTrigger>
        <AccordionContent>Useful for FAQ-style pages.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
