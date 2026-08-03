import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ThemeToggle } from './theme-toggle';

// Botón solo-ícono con aria-label "Cambiar tema" que abre un menú Claro/Oscuro/Sistema (next-themes).
// El toggle de tema de la toolbar de Storybook controla la clase .dark del preview de forma
// independiente; este componente es el control real de la app.
const meta = {
  title: 'Layout/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
