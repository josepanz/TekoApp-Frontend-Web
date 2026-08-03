import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toast } from 'sonner';

import { Button } from './button';
import { Toaster } from './sonner';

const meta = {
  title: 'UI/Sonner (Toaster)',
  component: Toaster,
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

// Los toasts llevan ícono por tipo (success/info/warning/error) — el estado no depende solo del
// color. Ver .claude/rules/accessibility.md.
export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast('Servicio guardado')}>
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success('Perfil actualizado')}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('Tenés una nueva solicitud')}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning('Tu perfil está incompleto')}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error('No se pudo guardar')}
      >
        Error
      </Button>
      <Toaster />
    </div>
  ),
};
