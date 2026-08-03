import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LayoutDashboard, Settings, Star, Users, Wrench } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from './sidebar';

const meta = {
  title: 'UI/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { title: 'Resumen', icon: LayoutDashboard, active: true },
  { title: 'Usuarios', icon: Users, active: false },
  { title: 'Servicios', icon: Wrench, active: false },
  { title: 'Calificaciones', icon: Star, active: false },
] as const;

// El ítem activo usa `sidebar-primary` (verde de marca), no el gris del hover — ver el comentario
// en sidebar.tsx. `collapsible="icon"`: el SidebarTrigger colapsa a solo-íconos.
export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="px-3 py-4">
          <span className="font-heading text-lg font-semibold tracking-tight text-primary group-data-[collapsible=icon]:hidden">
            TekoApp
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(({ title, icon: Icon, active }) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton isActive={active} tooltip={title}>
                      <Icon />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Ajustes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Configuración">
                    <Settings />
                    <span>Configuración</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Panel</span>
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          Contenido de la página. Usá el botón para colapsar el sidebar.
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
