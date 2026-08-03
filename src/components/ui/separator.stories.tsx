import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Separator } from './separator';

const meta = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <p className="text-sm">Datos de la cuenta</p>
      <Separator {...args} className="my-3" />
      <p className="text-sm text-muted-foreground">Preferencias</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="flex h-6 items-center gap-3 text-sm">
      <span>Perfil</span>
      <Separator {...args} />
      <span>Servicios</span>
      <Separator {...args} />
      <span>Pagos</span>
    </div>
  ),
};
