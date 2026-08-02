import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LogOut, Settings, User } from 'lucide-react';

import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './dropdown-menu';

const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// DropdownMenuLabel SIEMPRE va dentro de un DropdownMenuGroup (Base UI error #31 si va suelto).
// Ver .claude/rules/design-system.md.
export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline">Mi cuenta</Button>}
      />
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Ana Giménez</DropdownMenuLabel>
          <DropdownMenuItem>
            <User />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Configuración
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
