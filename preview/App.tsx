import { useState, type ReactNode } from 'react'
import {
  Button, Badge, Input, Textarea, Label,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Checkbox, Switch, RadioGroup, RadioGroupItem,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Separator, Skeleton, Progress, Toaster,
  FilePicker,
  DatePicker,
  Popover, PopoverTrigger, PopoverContent,
} from '../src/index'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-xl text-foreground">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
      <Separator />
    </section>
  )
}

export function App() {
  const [dark, setDark] = useState(false)

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <div className="mx-auto max-w-3xl space-y-8 p-10">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl">@quietbuildlab/ui</h1>
              <p className="text-muted-foreground text-sm">
                Manuscript design system — component preview
              </p>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
              {dark ? 'Light' : 'Dark'} mode
            </Button>
          </header>

          <Section title="Buttons & badges">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Badge>Beta</Badge>
            <Badge variant="secondary">Synced</Badge>
          </Section>

          <Section title="Form fields">
            <div className="grid w-full gap-3">
              <Label htmlFor="name">File name</Label>
              <Input id="name" defaultValue="invoice-2026.pdf" />
              <Textarea placeholder="Notes" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="keep" />
                  <Label htmlFor="keep">Keep a copy</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="sync" />
                  <Label htmlFor="sync">Auto-sync</Label>
                </div>
              </div>
              <RadioGroup defaultValue="a4" className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="a4" id="a4" />
                  <Label htmlFor="a4">A4</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="letter" id="letter" />
                  <Label htmlFor="letter">Letter</Label>
                </div>
              </RadioGroup>
              <Select>
                <SelectTrigger><SelectValue placeholder="Format" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Section>

          <Section title="Overlays">
            <Dialog>
              <DialogTrigger render={<Button>Open dialog</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename file</DialogTitle>
                  <DialogDescription>Give it a clearer name.</DialogDescription>
                </DialogHeader>
                <Input defaultValue="invoice-2026.pdf" />
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline">Menu</Button>} />
              <DropdownMenuContent>
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost">Hover me</Button>} />
              <TooltipContent>A helpful hint</TooltipContent>
            </Tooltip>
          </Section>

          <Section title="File picker">
            <div className="w-full max-w-md">
              <FilePicker accept="image/*" multiple onFilesChange={() => {}} />
            </div>
          </Section>

          <Section title="Date picker">
            <div className="flex items-start gap-3">
              <DatePicker placeholder="Pick a date" />
              <Popover>
                <PopoverTrigger render={<Button variant="outline">Popover</Button>} />
                <PopoverContent className="w-56">
                  <p className="text-sm">Anchored content goes here.</p>
                </PopoverContent>
              </Popover>
            </div>
          </Section>

          <Section title="Layout & feedback">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Recent files</CardTitle>
                <CardDescription>Last opened just now</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="shared">Shared</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="pt-2">3 files</TabsContent>
                  <TabsContent value="shared" className="pt-2">1 file</TabsContent>
                </Tabs>
                <Progress value={62} />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Button size="sm">Open</Button>
              </CardFooter>
            </Card>
          </Section>
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
