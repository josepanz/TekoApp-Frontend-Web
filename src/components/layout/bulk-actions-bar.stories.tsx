import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/button';
import { BulkActionsBar } from './bulk-actions-bar';

const meta = {
  title: 'Layout/BulkActionsBar',
  component: BulkActionsBar,
  tags: ['autodocs'],
} satisfies Meta<typeof BulkActionsBar>;

export default meta;
type Story = StoryObj<typeof BulkActionsBar>;

export const Default: Story = {
  args: {
    selectedCount: 3,
    onCancel: () => {},
    children: (
      <Button variant="destructive" size="sm">
        Eliminar seleccionadas (3)
      </Button>
    ),
  },
};

export const UnaSola: Story = {
  args: {
    selectedCount: 1,
    onCancel: () => {},
    children: (
      <Button variant="destructive" size="sm">
        Eliminar seleccionada (1)
      </Button>
    ),
  },
};

export const SinSeleccion: Story = {
  args: {
    selectedCount: 0,
    onCancel: () => {},
    children: null,
  },
};
