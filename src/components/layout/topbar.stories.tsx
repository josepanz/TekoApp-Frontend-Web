import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SidebarProvider } from '@/components/ui/sidebar';
import { Topbar } from './topbar';

// Barra superior: SidebarTrigger (necesita SidebarProvider) + ThemeToggle + UserMenu. Lleva un
// borde superior con gradiente primary→accent (acento de marca minoritario, ver rules/design-system).
const meta = {
  title: 'Layout/Topbar',
  component: Topbar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { userName: 'Ana Giménez', userEmail: 'ana@tekoapp.com.py' },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="w-full">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof Topbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
