import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { UserMenu } from './user-menu';

// Trigger con avatar (iniciales) + nombre y aria-label "Menú de usuario". Abre un menú con el
// email, "Mi perfil" y "Cerrar sesión" (variant destructive). useRouter lo mockea Storybook.
const meta = {
  title: 'Layout/UserMenu',
  component: UserMenu,
  tags: ['autodocs'],
  args: { name: 'Ana Giménez', email: 'ana@tekoapp.com.py' },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Nombre de una sola palabra → una sola inicial en el avatar.
export const SingleName: Story = {
  args: { name: 'Ana', email: 'ana@tekoapp.com.py' },
};
