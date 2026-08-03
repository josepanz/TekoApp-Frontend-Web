import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';

// El ModeSwitcher del footer lee permisos/perfil vía TanStack Query. Sembramos el cache para que
// se muestren los otros modos sin pegarle a un backend real.
function makeClient() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  client.setQueryData(['auth', 'scope'], {
    permissions: [{ name: 'admin:all' }],
    roles: [{ name: 'admin' }],
  });
  client.setQueryData(['professionals', 'me'], { referenceId: 'demo' });
  return client;
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={makeClient()}>
      <SidebarProvider>
        {children}
        <SidebarInset>
          <div className="p-4 text-sm text-muted-foreground">
            Área de contenido de la página.
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

const meta = {
  title: 'Layout/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <Shell>
        <Story />
      </Shell>
    ),
  ],
} satisfies Meta<typeof AppSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Admin: Story = {
  args: { variant: 'admin' },
  parameters: { nextjs: { navigation: { pathname: '/admin/users' } } },
};

export const Professional: Story = {
  args: { variant: 'pro' },
  parameters: { nextjs: { navigation: { pathname: '/pro' } } },
};

export const Client: Story = {
  args: { variant: 'client' },
  parameters: { nextjs: { navigation: { pathname: '/' } } },
};
