import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UsersIcon } from 'lucide-react';

import { EmptyState } from './empty-state';

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: { title: 'Todavía no hay profesionales' },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    icon: UsersIcon,
    description: 'Cuando se registren, los vas a ver acá.',
    action: { label: 'Crear profesional', onClick: () => undefined },
  },
};

export const NoResults: Story = {
  args: {
    variant: 'no-results',
    title: 'Sin resultados',
    description: 'Probá con otros términos o quitá los filtros.',
    action: { label: 'Limpiar filtros', onClick: () => undefined },
  },
};

export const ErrorWithRetry: Story = {
  args: {
    variant: 'error',
    title: 'No se pudo cargar la lista',
    description: 'Revisá tu conexión e intentá de nuevo.',
    action: { label: 'Reintentar', onClick: () => undefined },
  },
};
