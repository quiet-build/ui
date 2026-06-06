# Tabs

Tabbed content switcher. Supports horizontal (default) and vertical orientations, plus a `line` variant for underline-style tabs.

## Import

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@quietbuildlab/ui'
```

## Props

**Tabs** (Base UI Root): `value`, `defaultValue`, `onValueChange`, `orientation` (`"horizontal" | "vertical"`).

**TabsList** extra prop: `variant?: "default" | "line"`.

## Usage

Default (pill style):

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview"><p>Overview content</p></TabsContent>
  <TabsContent value="activity"><p>Activity feed</p></TabsContent>
  <TabsContent value="settings"><p>Settings form</p></TabsContent>
</Tabs>
```

Line variant (underline style):

```tsx
<Tabs defaultValue="all">
  <TabsList variant="line">
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="active">Active</TabsTrigger>
  </TabsList>
  <TabsContent value="all">…</TabsContent>
  <TabsContent value="active">…</TabsContent>
</Tabs>
```

## Notes

- `value` on each `TabsTrigger` must match the `value` on the corresponding `TabsContent`.
- For navigation between full *pages*, prefer a router; Tabs are for in-page section switching.

## Related

- [Accordion](./accordion.md) — vertical collapsible sections, alternative to vertical tabs

## Source

- [Source](https://github.com/quiet-build/ui/blob/main/src/components/ui/tabs.tsx)
- [Storybook](https://quiet-build.github.io/ui/?path=/story/ui-tabs--default)
