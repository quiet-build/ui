# Sidebar

Collapsible app-navigation rail. Expands to icon + label, collapses to an icon-only rail with
tooltip flyouts. Built on the `sidebar-*` theme tokens, so it themes across all six presets in
light and dark automatically. Composes the library's `Tooltip` for the collapsed flyouts.

## Import

```tsx
import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarTrigger, SidebarRail,
  useSidebar,
} from '@quietbuildlab/ui'
```

## Props

**SidebarProvider** - owns collapse state and provides the `TooltipProvider`.
- `defaultCollapsed?: boolean` (uncontrolled), or `collapsed` + `onCollapsedChange` (controlled).

**Sidebar** (`<aside>`) - width via CSS vars: `--sidebar-width` (default `16rem`) and
`--sidebar-width-collapsed` (default `4.5rem`). Animates `width` 300ms. Exposes `data-collapsed`
and a `group/sidebar` for descendant collapse styling.

**SidebarMenuButton** (`<button>`) extra props:
- `icon?: React.ReactNode` - leading icon (auto-sized to `size-5`).
- `isActive?: boolean` - active row treatment (`bg-sidebar-accent` + `bg-sidebar-primary` indicator).
- `tooltip?: React.ReactNode` - flyout label when collapsed (defaults to `children`).

**SidebarTrigger** - inline chevron toggle. **SidebarRail** - round edge toggle on the border.

`useSidebar()` -> `{ collapsed, setCollapsed, toggle }`.

## Usage

```tsx
<SidebarProvider defaultCollapsed={false}>
  <div className="flex h-screen">
    <Sidebar>
      <SidebarRail />
      <SidebarHeader>
        <span className="font-serif text-lg font-semibold group-data-[collapsed=true]/sidebar:hidden">
          Manuscript
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuButton icon={<Home />} isActive>Home</SidebarMenuButton>
          <SidebarMenuButton icon={<FileText />}>Documents</SidebarMenuButton>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>{/* ... */}</SidebarFooter>
    </Sidebar>
    <main className="flex-1 overflow-auto">{/* ... */}</main>
  </div>
</SidebarProvider>
```

## Notes

- Collapsed flyouts only render while `collapsed` - expanded, `SidebarMenuButton` is a plain `<button>`.
- Hide labels/branding in collapsed mode with `group-data-[collapsed=true]/sidebar:hidden`.
- `SidebarMenuButton` renders a `<button>`. For real nav links, add a `render`-prop pass-through
  following the Base UI pattern used in `sheet.tsx`, or an `asChild`-style prop.
- All colors are `sidebar-*` tokens - no hard-coded values; safe to restyle via the `ui/` wrapper.

## Related

- [Sheet](./sheet.md) - slide-in side panels (mobile drawer companion)
- [Tooltip](./tooltip.md) - powers the collapsed flyouts

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/sidebar.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-sidebar--default)
