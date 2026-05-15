import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from './table'

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs', 'ai-generated'],
}
export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  render: () => (
    <Table className="w-[480px]">
      <TableCaption>Recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV-001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV-002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell className="text-right">$1,250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV-003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell className="text-right">$70.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">$1,570.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}
