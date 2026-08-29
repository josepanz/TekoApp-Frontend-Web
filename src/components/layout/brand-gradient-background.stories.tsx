import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BrandGradientBackground } from './brand-gradient-background';

// Gradiente diagonal navy→teal→verde de marca — usado como fondo de página completa (login,
// error) o como hero acotado (rounded + padding) dentro de una pantalla con chrome propio
// (ej. home de cliente). Ver el comentario del componente para el porqué de los shades 700/600.
const meta = {
  title: 'Layout/BrandGradientBackground',
  component: BrandGradientBackground,
  tags: ['autodocs'],
} satisfies Meta<typeof BrandGradientBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = {
  args: {
    className: 'flex min-h-64 items-center justify-center p-6 text-white',
    children: <p className="text-lg font-semibold">Fondo de página completa</p>,
  },
};

export const HeroCard: Story = {
  args: {
    className: 'rounded-xl p-6 text-white',
    children: (
      <div>
        <p className="text-2xl font-semibold">Hola, Ana</p>
        <p className="text-white/80">Bienvenida de vuelta a TekoApp</p>
      </div>
    ),
  },
};
