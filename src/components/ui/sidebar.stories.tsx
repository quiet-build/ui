import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { expect, within } from 'storybook/test'
import {
  BarChart3,
  BookOpen,
  FileText,
  Home,
  MessageSquare,
  Moon,
  PenLine,
  Settings,
  Sun,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from './sidebar'

const meta: Meta = {
  title: 'UI/Sidebar',
  tags: ['autodocs', 'ai-generated'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const PRIMARY_NAV = [
  { key: 'home', label: 'Home', icon: <Home /> },
  { key: 'docs', label: 'Documents', icon: <FileText /> },
  { key: 'editor', label: 'Editor', icon: <PenLine /> },
]

const WORKSPACE_NAV = [
  { key: 'library', label: 'Library', icon: <BookOpen /> },
  { key: 'comments', label: 'Comments', icon: <MessageSquare /> },
  { key: 'analytics', label: 'Analytics', icon: <BarChart3 /> },
]

const NAV = [...PRIMARY_NAV, ...WORKSPACE_NAV]

function Demo({
  defaultCollapsed = false,
  showGroups = false,
  showHeaderTrigger = false,
}: {
  defaultCollapsed?: boolean
  showGroups?: boolean
  showHeaderTrigger?: boolean
}) {
  const [active, setActive] = React.useState('home')
  const [dark, setDark] = React.useState(false)

  const renderMenuButton = (item: (typeof NAV)[number]) => (
    <SidebarMenuButton
      key={item.key}
      icon={item.icon}
      isActive={active === item.key}
      onClick={() => setActive(item.key)}
    >
      {item.label}
    </SidebarMenuButton>
  )

  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed}>
      <div className={dark ? 'dark' : undefined}>
        <div className="flex h-[560px] bg-background text-foreground">
          <Sidebar>
            <SidebarRail />
            <SidebarHeader>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sidebar-primary font-serif text-lg leading-none text-sidebar-primary-foreground">
                M
              </div>
              <div className="flex flex-col group-data-[collapsed=true]/sidebar:hidden">
                <span className="font-serif text-lg font-semibold leading-tight">
                  Manuscript
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Workspace
                </span>
              </div>
              {showHeaderTrigger ? (
                <SidebarTrigger className="ml-auto group-data-[collapsed=true]/sidebar:hidden" />
              ) : null}
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                {showGroups ? <SidebarGroupLabel>Primary</SidebarGroupLabel> : null}
                {PRIMARY_NAV.map(renderMenuButton)}
                {showGroups ? <SidebarGroupLabel>Workspace</SidebarGroupLabel> : null}
                {WORKSPACE_NAV.map(renderMenuButton)}
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuButton icon={<Settings />}>Settings</SidebarMenuButton>
                <SidebarMenuButton
                  icon={dark ? <Sun /> : <Moon />}
                  tooltip={dark ? 'Light mode' : 'Dark mode'}
                  onClick={() => setDark((d) => !d)}
                >
                  {dark ? 'Light mode' : 'Dark mode'}
                </SidebarMenuButton>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 p-8">
            <h1 className="text-xl font-semibold">{
              NAV.find((n) => n.key === active)?.label
            }</h1>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export const Default: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('heading', { name: 'Home' })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Documents' }))
    await expect(canvas.getByRole('heading', { name: 'Documents' })).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Collapse sidebar' }))
    await expect(canvas.getByRole('button', { name: 'Expand sidebar' })).toBeVisible()
  },
}

export const Collapsed: Story = {
  render: () => <Demo defaultCollapsed />,
}

export const WithGroupsAndHeaderTrigger: Story = {
  render: () => <Demo showGroups showHeaderTrigger />,
}
