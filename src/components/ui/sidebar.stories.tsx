import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
} from './sidebar'

const meta: Meta = {
  title: 'UI/Sidebar',
  tags: ['autodocs', 'ai-generated'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const NAV = [
  { key: 'home', label: 'Home', icon: <Home /> },
  { key: 'docs', label: 'Documents', icon: <FileText /> },
  { key: 'editor', label: 'Editor', icon: <PenLine /> },
  { key: 'library', label: 'Library', icon: <BookOpen /> },
  { key: 'comments', label: 'Comments', icon: <MessageSquare /> },
  { key: 'analytics', label: 'Analytics', icon: <BarChart3 /> },
]

function Demo({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [active, setActive] = React.useState('home')
  const [dark, setDark] = React.useState(false)
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed}>
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
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuButton
                  key={item.key}
                  icon={item.icon}
                  isActive={active === item.key}
                  onClick={() => setActive(item.key)}
                >
                  {item.label}
                </SidebarMenuButton>
              ))}
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
    </SidebarProvider>
  )
}

export const Default: Story = {
  render: () => <Demo />,
}

export const Collapsed: Story = {
  render: () => <Demo defaultCollapsed />,
}
