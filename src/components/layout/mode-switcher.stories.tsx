import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { SidebarProvider } from '@/components/ui/sidebar';
import { ModeSwitcher } from './mode-switcher';

// Siembra permisos de staff + perfil profesional para que aparezcan los 3 modos.
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
        <div className="w-64 rounded-lg border bg-sidebar p-2">{children}</div>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

const meta = {
  title: 'Layout/ModeSwitcher',
  component: ModeSwitcher,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Shell>
        <Story />
      </Shell>
    ),
  ],
} satisfies Meta<typeof ModeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

// Muestra los modos DISTINTOS al actual (oculta el modo en el que ya estás).
export const FromClient: Story = { args: { current: 'client' } };
export const FromAdmin: Story = { args: { current: 'admin' } };
